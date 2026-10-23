import { readFile, writeFile } from "node:fs/promises";
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { resolve } from "node:path";

export const motion = {
  rotorSpeed: 1.25,
  vaneSpeed: 0.45,
  vaneAmplitude: 0.12,
  vaneYaw: -0.18,
  dropCount: 3,
  rainDuration: 3.6,
  outletY: -0.14,
  fallDistance: 0.85,
};

export function readGlb(buffer) {
  if (buffer.readUInt32LE(0) !== 0x46546c67 || buffer.readUInt32LE(4) !== 2)
    throw new Error("Se esperaba un GLB 2.0");
  const jsonLength = buffer.readUInt32LE(12);
  const json = JSON.parse(buffer.subarray(20, 20 + jsonLength).toString());
  const binOffset = 20 + jsonLength + 8;
  return {
    json,
    bin: buffer.subarray(binOffset, binOffset + json.buffers[0].byteLength),
  };
}

const officialLogo = readFileSync(
  new URL("../public/brand/android-chrome-512.png", import.meta.url),
);

export function prepareMeteoMotion(source, labelImage = officialLogo) {
  const { json, bin } = readGlb(source);
  const chunks = [bin];
  let byteLength = bin.length;
  const align = () => {
    const padding = (4 - (byteLength % 4)) % 4;
    if (padding) chunks.push(Buffer.alloc(padding));
    byteLength += padding;
  };
  const accessor = (values, type, { indices = false, target } = {}) => {
    align();
    const components = { SCALAR: 1, VEC2: 2, VEC3: 3, VEC4: 4 }[type];
    const array = indices ? new Uint16Array(values) : new Float32Array(values);
    const buffer = Buffer.from(array.buffer);
    const view = {
      buffer: 0,
      byteOffset: byteLength,
      byteLength: buffer.length,
    };
    if (target) view.target = target;
    const bufferView = json.bufferViews.push(view) - 1;
    chunks.push(buffer);
    byteLength += buffer.length;
    const min = Array(components).fill(Infinity);
    const max = Array(components).fill(-Infinity);
    for (let i = 0; i < array.length; i++) {
      min[i % components] = Math.min(min[i % components], array[i]);
      max[i % components] = Math.max(max[i % components], array[i]);
    }
    return (
      json.accessors.push({
        bufferView,
        componentType: indices ? 5123 : 5126,
        count: values.length / components,
        type,
        min,
        max,
      }) - 1
    );
  };
  const nodeNamed = (name) => {
    const index = json.nodes.findIndex((node) => node.name === name);
    if (index < 0) throw new Error(`Falta la pieza ${name}`);
    return index;
  };

  // Etiqueta: glTF toma el origen de la imagen arriba. La UV original tenía
  // la V invertida, de ahí el rótulo boca abajo. Usar el icono oficial sin
  // modificar la imagen y conservar su proporción sobre la superficie curva.
  const labelNode = json.nodes.find((node) =>
    node.name?.startsWith("Etiqueta_Hiotera"),
  );
  if (!labelNode) throw new Error("Falta la etiqueta de la estación");
  const labelPrimitive = json.meshes[labelNode.mesh].primitives[0];
  const oldUv = json.accessors[labelPrimitive.attributes.TEXCOORD_0];
  const uvView = json.bufferViews[oldUv.bufferView];
  const uvOffset = (uvView.byteOffset || 0) + (oldUv.byteOffset || 0);
  const uvs = [];
  for (let i = 0; i < oldUv.count; i++) {
    const offset = uvOffset + i * (uvView.byteStride || 8);
    uvs.push(
      (bin.readFloatLE(offset) - 0.5) * 1.5 + 0.5,
      1 - bin.readFloatLE(offset + 4),
    );
  }
  labelPrimitive.attributes.TEXCOORD_0 = accessor(uvs, "VEC2", {
    target: 34962,
  });
  align();
  const labelView =
    json.bufferViews.push({
      buffer: 0,
      byteOffset: byteLength,
      byteLength: labelImage.length,
    }) - 1;
  chunks.push(labelImage);
  byteLength += labelImage.length;
  const labelSource =
    json.images.push({
      bufferView: labelView,
      mimeType: "image/png",
      name: "Hiotera_Rebrand_Oficial",
    }) - 1;
  const labelSampler =
    json.samplers.push({
      magFilter: 9729,
      minFilter: 9987,
      wrapS: 33071,
      wrapT: 33071,
    }) - 1;
  const labelTexture =
    json.textures.push({ sampler: labelSampler, source: labelSource }) - 1;
  const labelMaterial = structuredClone(
    json.materials[labelPrimitive.material],
  );
  labelMaterial.name = "Hiotera_Label_Oficial";
  labelMaterial.pbrMetallicRoughness.baseColorTexture = { index: labelTexture };
  labelPrimitive.material = json.materials.push(labelMaterial) - 1;

  const track = (clip, node, path, times, values, type) => {
    const sampler =
      clip.samplers.push({
        input: accessor(times, "SCALAR"),
        output: accessor(values, type),
        interpolation: "LINEAR",
      }) - 1;
    clip.channels.push({ sampler, target: { node, path } });
  };
  const rotationClip = (name, node, duration, yaw) => {
    const clip = { name, samplers: [], channels: [] };
    const times = [],
      values = [];
    const samples = Math.ceil(duration * 30);
    for (let i = 0; i <= samples; i++) {
      const time = (i / samples) * duration;
      const angle = yaw(time);
      times.push(time);
      values.push(0, Math.sin(angle / 2), 0, Math.cos(angle / 2));
    }
    track(clip, node, "rotation", times, values, "VEC4");
    return clip;
  };

  // Conservar el original y sus despieces; solo animar los hijos móviles.
  const wind = rotationClip(
    "Viento",
    nodeNamed("Rotor_anemometro"),
    (2 * Math.PI) / motion.rotorSpeed,
    (t) => t * motion.rotorSpeed,
  );
  const vane = rotationClip(
    "Veleta",
    nodeNamed("Rotor_veleta"),
    (2 * Math.PI) / motion.vaneSpeed,
    (t) =>
      motion.vaneYaw + Math.sin(t * motion.vaneSpeed) * motion.vaneAmplitude,
  );
  json.animations = json.animations.filter(
    (clip) => !["Viento", "Veleta", "Lluvia"].includes(clip.name),
  );
  json.animations.push(wind, vane);

  // Una sola malla de gota compartida: pequeña, brillante y con volumen real.
  const profile = [
    [0, -0.028],
    [0.01, -0.024],
    [0.016, -0.012],
    [0.015, 0],
    [0.009, 0.017],
    [0, 0.043],
  ];
  const positions = [],
    normals = [],
    indices = [];
  const segments = 16;
  for (let row = 0; row < profile.length; row++) {
    const [radius, y] = profile[row];
    const before = profile[Math.max(0, row - 1)];
    const after = profile[Math.min(profile.length - 1, row + 1)];
    const slope = (after[0] - before[0]) / (after[1] - before[1]);
    const length = Math.hypot(1, slope);
    for (let i = 0; i <= segments; i++) {
      const angle = (i / segments) * Math.PI * 2;
      positions.push(radius * Math.cos(angle), y, radius * Math.sin(angle));
      normals.push(
        Math.cos(angle) / length,
        -slope / length,
        Math.sin(angle) / length,
      );
      if (row < profile.length - 1 && i < segments) {
        const a = row * (segments + 1) + i,
          b = a + segments + 1;
        indices.push(a, b, a + 1, b, b + 1, a + 1);
      }
    }
  }
  const material =
    json.materials.push({
      name: "Agua — gotas del colector",
      pbrMetallicRoughness: {
        baseColorFactor: [0.12, 0.54, 0.76, 0.85],
        metallicFactor: 0.05,
        roughnessFactor: 0.12,
      },
      alphaMode: "BLEND",
      doubleSided: true,
    }) - 1;
  const mesh =
    json.meshes.push({
      name: "Gota de agua",
      primitives: [
        {
          attributes: {
            POSITION: accessor(positions, "VEC3", { target: 34962 }),
            NORMAL: accessor(normals, "VEC3", { target: 34962 }),
          },
          indices: accessor(indices, "SCALAR", {
            indices: true,
            target: 34963,
          }),
          material,
        },
      ],
    }) - 1;
  const funnel = json.nodes[nodeNamed("Embudo_colector")];
  const rain = { name: "Lluvia", samplers: [], channels: [] };
  for (let drop = 0; drop < motion.dropCount; drop++) {
    const node =
      json.nodes.push({
        name: `Gota_colector_${drop + 1}`,
        mesh,
        translation: [0, motion.outletY, 0],
        scale: [0, 0, 0],
        extras: { part: "water-drop" },
      }) - 1;
    funnel.children.push(node);
    const times = [],
      translations = [],
      scales = [];
    const samples = 360;
    for (let i = 0; i <= samples; i++) {
      const time = (i / samples) * motion.rainDuration;
      const phase =
        ((i === samples ? 0 : i / samples) + drop / motion.dropCount) % 1;
      // Breve pausa entre gotas. La caída acelera, sin saltos visibles al repetir.
      const falling = Math.min(1, phase / 0.72);
      const envelope =
        phase < 0.72 ? Math.min(1, falling / 0.09, (1 - falling) / 0.14) : 0;
      const width = 0.88 + drop * 0.055;
      times.push(time);
      translations.push(
        Math.sin(drop * 2.4) * 0.012 * falling,
        motion.outletY - motion.fallDistance * falling * falling,
        Math.cos(drop * 2.4) * 0.012 * falling,
      );
      scales.push(
        envelope * width,
        envelope * (1 + falling * 0.35),
        envelope * width,
      );
    }
    track(rain, node, "translation", times, translations, "VEC3");
    track(rain, node, "scale", times, scales, "VEC3");
  }
  json.animations.push(rain);
  align();
  json.buffers[0].byteLength = byteLength;
  const jsonBytes = Buffer.from(JSON.stringify(json));
  const jsonPadding = (4 - (jsonBytes.length % 4)) % 4;
  const jsonChunk = Buffer.concat([jsonBytes, Buffer.alloc(jsonPadding, 0x20)]);
  const binary = Buffer.concat(chunks);
  const header = Buffer.alloc(20);
  header.writeUInt32LE(0x46546c67, 0);
  header.writeUInt32LE(2, 4);
  header.writeUInt32LE(20 + jsonChunk.length + 8 + binary.length, 8);
  header.writeUInt32LE(jsonChunk.length, 12);
  header.writeUInt32LE(0x4e4f534a, 16);
  const binHeader = Buffer.alloc(8);
  binHeader.writeUInt32LE(binary.length, 0);
  binHeader.writeUInt32LE(0x004e4942, 4);
  return Buffer.concat([header, jsonChunk, binHeader, binary]);
}

if (
  process.argv[1] &&
  resolve(process.argv[1]) === fileURLToPath(import.meta.url)
) {
  const original = new URL("../public/estacion-meteo.glb", import.meta.url);
  const output = new URL("../public/estacion-meteo-viva.glb", import.meta.url);
  const result = prepareMeteoMotion(await readFile(original));
  await writeFile(output, result);
  console.log(`Estación animada preparada: ${result.length} bytes.`);
}
