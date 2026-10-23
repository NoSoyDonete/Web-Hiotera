import test from "node:test";
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import {
  motion,
  prepareMeteoMotion,
  readGlb,
} from "../scripts/prepare-meteo-motion.mjs";
import { createMeteoPlayback } from "../src/meteoPlayback.js";

const original = await readFile(
  new URL("../public/estacion-meteo.glb", import.meta.url),
);
const generated = await readFile(
  new URL("../public/estacion-meteo-viva.glb", import.meta.url),
);
const { json, bin } = readGlb(generated);
const base = readGlb(original).json;
const clip = (name) => json.animations.find((item) => item.name === name);
const values = (index) => {
  const item = json.accessors[index];
  const components = { SCALAR: 1, VEC3: 3, VEC4: 4 }[item.type];
  const offset =
    (json.bufferViews[item.bufferView].byteOffset || 0) +
    (item.byteOffset || 0);
  return Array.from({ length: item.count }, (_, sample) =>
    Array.from({ length: components }, (_, axis) =>
      bin.readFloatLE(offset + (sample * components + axis) * 4),
    ),
  );
};

test("el modelo animado se reproduce exactamente desde el original", () => {
  assert.deepEqual(generated, prepareMeteoMotion(original));
  assert.equal(generated.readUInt32LE(8), generated.length);
  assert.equal(bin.length, json.buffers[0].byteLength);
  for (const view of json.bufferViews) {
    assert.equal((view.byteOffset || 0) % 4, 0);
    assert.ok((view.byteOffset || 0) + view.byteLength <= bin.length);
  }
  for (const name of ["Despiece", "Montaje"])
    assert.deepEqual(
      clip(name),
      base.animations.find((item) => item.name === name),
    );
  for (let index = 0; index < base.meshes.length; index++) {
    const originalMesh = base.meshes[index];
    if (
      base.nodes.some(
        (node) =>
          node.mesh === index && node.name?.startsWith("Etiqueta_Hiotera"),
      )
    ) {
      assert.equal(
        json.meshes[index].primitives[0].attributes.POSITION,
        originalMesh.primitives[0].attributes.POSITION,
      );
    } else assert.deepEqual(json.meshes[index], originalMesh);
  }
  assert.deepEqual(
    json.materials.slice(0, base.materials.length),
    base.materials,
  );
});

test("la etiqueta usa la marca oficial y la parte superior de la imagen queda arriba", () => {
  const node = json.nodes.find((item) =>
    item.name?.startsWith("Etiqueta_Hiotera"),
  );
  const primitive = json.meshes[node.mesh].primitives[0];
  const uv = json.accessors[primitive.attributes.TEXCOORD_0];
  const offset = json.bufferViews[uv.bufferView].byteOffset;
  assert.equal(bin.readFloatLE(offset + 4), 0);
  const material = json.materials[primitive.material];
  assert.equal(material.name, "Hiotera_Label_Oficial");
  const texture =
    json.textures[material.pbrMetallicRoughness.baseColorTexture.index];
  assert.equal(json.images[texture.source].name, "Hiotera_Rebrand_Oficial");
});

test("viento y veleta animan solo los rotores, sin interferir con el despiece", () => {
  const explosionTargets = new Set(
    clip("Despiece").channels.map((item) => item.target.node),
  );
  for (const [name, node] of [
    ["Viento", "Rotor_anemometro"],
    ["Veleta", "Rotor_veleta"],
  ]) {
    assert.equal(clip(name).channels.length, 1);
    const channel = clip(name).channels[0];
    assert.equal(json.nodes[channel.target.node].name, node);
    assert.equal(channel.target.path, "rotation");
    assert.ok(!explosionTargets.has(channel.target.node));
    const rotations = values(clip(name).samplers[0].output);
    for (const quaternion of rotations)
      assert.ok(Math.abs(Math.hypot(...quaternion) - 1) < 0.000001);
    assert.ok(rotations.some((q) => Math.abs(q[1] - rotations[0][1]) > 0.01));
    // q y -q representan la misma rotación: no hay salto al repetir.
    const dot = rotations[0].reduce(
      (sum, v, i) => sum + v * rotations.at(-1)[i],
      0,
    );
    assert.ok(Math.abs(Math.abs(dot) - 1) < 0.000001);
  }
  const angles = values(clip("Veleta").samplers[0].output).map(
    (q) => 2 * Math.atan2(q[1], q[3]),
  );
  assert.ok(
    Math.min(...angles) >= motion.vaneYaw - motion.vaneAmplitude - 0.000001,
  );
  assert.ok(
    Math.max(...angles) <= motion.vaneYaw + motion.vaneAmplitude + 0.000001,
  );
});

test("las tres gotas nacen del embudo, caen a media velocidad y repiten sin parpadeos", () => {
  assert.equal(motion.dropCount, 3);
  assert.equal(motion.rainDuration, 1.8 * 2);
  const funnel = json.nodes.find((node) => node.name === "Embudo_colector");
  const droplets = json.nodes.flatMap((node, index) =>
    node.extras?.part === "water-drop" ? [index] : [],
  );
  assert.equal(droplets.length, motion.dropCount);
  assert.equal(
    new Set(droplets.map((index) => json.nodes[index].mesh)).size,
    1,
  );
  for (const index of droplets) {
    assert.ok(funnel.children.includes(index));
    const channels = clip("Lluvia").channels.filter(
      (item) => item.target.node === index,
    );
    assert.deepEqual(channels.map((item) => item.target.path).sort(), [
      "scale",
      "translation",
    ]);
    for (const channel of channels) {
      const times = values(clip("Lluvia").samplers[channel.sampler].input);
      assert.ok(Math.abs(times.at(-1)[0] - 3.6) < 0.000001);
      const samples = values(clip("Lluvia").samplers[channel.sampler].output);
      assert.deepEqual(samples[0], samples.at(-1));
      if (channel.target.path === "translation") {
        assert.ok(samples.every((v) => v[1] <= motion.outletY + 0.000001));
        assert.ok(samples.some((v) => v[1] < -0.9));
      } else {
        assert.ok(samples.some((v) => v.every((axis) => axis === 0)));
        assert.ok(samples.some((v) => v[0] > 0.8));
      }
    }
  }
});

function playbackFixture() {
  let enabled = true;
  let next = 0;
  const frames = new Map();
  const model = {
    paused: true,
    timeScale: 1,
    plays: 0,
    play() {
      this.paused = false;
      this.plays++;
    },
    pause() {
      this.paused = true;
    },
  };
  const playback = createMeteoPlayback(
    model,
    () => enabled,
    (callback) => {
      frames.set(++next, callback);
      return next;
    },
    (id) => frames.delete(id),
  );
  return {
    model,
    playback,
    frames,
    enable(value) {
      enabled = value;
    },
    frame() {
      const pending = [...frames.values()];
      frames.clear();
      pending.forEach((callback) => callback());
    },
  };
}

test("el error de carga o la limpieza antes de registrar el visor son seguros", () => {
  const unloadedElement = {};
  const playback = createMeteoPlayback(
    unloadedElement,
    () => false,
    () => 1,
    () => {},
  );
  assert.doesNotThrow(() => playback.sync());
  assert.doesNotThrow(() => playback.dispose());
});

test("el scroll no reinicia el viento; la pausa deja aplicar el despiece sin avanzar el tiempo", () => {
  const f = playbackFixture();
  f.playback.sync();
  f.playback.sync(true);
  assert.equal(f.model.plays, 1);
  assert.equal(f.model.timeScale, 1);
  f.enable(false);
  f.playback.sync();
  assert.ok(f.model.paused);
  assert.equal(f.model.timeScale, 0);
  // appendAnimation reanuda el mezclador para aplicar la nueva pose.
  f.model.paused = false;
  f.playback.sync(true);
  assert.equal(f.model.timeScale, 0);
  f.frame();
  f.frame();
  assert.ok(f.model.paused);
});

test("reanudar cancela la pausa pendiente; desmontar cancela los renders", () => {
  const f = playbackFixture();
  f.enable(false);
  f.playback.sync(true);
  f.enable(true);
  f.playback.sync();
  assert.equal(f.frames.size, 0);
  assert.equal(f.model.timeScale, 1);
  assert.equal(f.model.paused, false);
  f.enable(false);
  f.playback.sync(true);
  f.playback.dispose();
  assert.equal(f.frames.size, 0);
  assert.ok(f.model.paused);
  f.enable(true);
  f.playback.sync();
  assert.ok(f.model.paused);
});
