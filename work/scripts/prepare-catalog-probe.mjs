// Conserva la geometría del pincho aportado, eliminando el marcado MAC y sus
// buffers, no solo ocultando sus nodos. El archivo original no se modifica.
import { readFile, writeFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import { resolve } from "node:path";

export function anonymiseProbe(input) {
  if (input.readUInt32LE(0) !== 0x46546c67)
    throw new Error("Se esperaba un GLB");
  const jsonLength = input.readUInt32LE(12);
  const json = JSON.parse(input.subarray(20, 20 + jsonLength).toString());
  const bin = input.subarray(28 + jsonLength);
  if (
    json.animations?.length ||
    json.skins?.length ||
    json.images?.length ||
    json.accessors.some((a) => a.sparse)
  )
    throw new Error(
      "Este preparador solo admite el pincho estático suministrado",
    );
  const keepNodes = json.nodes
    .map((node, index) => (/^MAC_/.test(node.name ?? "") ? null : index))
    .filter((index) => index !== null);
  if (keepNodes.length === json.nodes.length)
    throw new Error("No se encontró el marcado a retirar");
  const nodeMap = new Map(keepNodes.map((old, index) => [old, index]));
  const keepMeshes = [
    ...new Set(
      keepNodes.flatMap((index) =>
        json.nodes[index].mesh === undefined ? [] : [json.nodes[index].mesh],
      ),
    ),
  ].sort((a, b) => a - b);
  const meshMap = new Map(keepMeshes.map((old, index) => [old, index]));
  json.nodes = keepNodes.map((index) => {
    const node = json.nodes[index];
    if (node.children)
      node.children = node.children
        .filter((child) => nodeMap.has(child))
        .map((child) => nodeMap.get(child));
    if (node.mesh !== undefined) node.mesh = meshMap.get(node.mesh);
    return node;
  });
  for (const scene of json.scenes)
    scene.nodes = scene.nodes
      .filter((index) => nodeMap.has(index))
      .map((index) => nodeMap.get(index));
  json.meshes = keepMeshes.map((index) => json.meshes[index]);
  const keepAccessors = [
    ...new Set(
      json.meshes.flatMap((mesh) =>
        mesh.primitives.flatMap((primitive) => [
          ...Object.values(primitive.attributes),
          ...(primitive.indices === undefined ? [] : [primitive.indices]),
          ...(primitive.targets ?? []).flatMap((target) =>
            Object.values(target),
          ),
        ]),
      ),
    ),
  ].sort((a, b) => a - b);
  const accessorMap = new Map(keepAccessors.map((old, index) => [old, index]));
  for (const mesh of json.meshes)
    for (const primitive of mesh.primitives) {
      primitive.attributes = Object.fromEntries(
        Object.entries(primitive.attributes).map(([key, index]) => [
          key,
          accessorMap.get(index),
        ]),
      );
      if (primitive.indices !== undefined)
        primitive.indices = accessorMap.get(primitive.indices);
      if (primitive.targets)
        primitive.targets = primitive.targets.map((target) =>
          Object.fromEntries(
            Object.entries(target).map(([key, index]) => [
              key,
              accessorMap.get(index),
            ]),
          ),
        );
    }
  json.accessors = keepAccessors.map((index) => json.accessors[index]);
  const keepViews = [
    ...new Set(json.accessors.map((accessor) => accessor.bufferView)),
  ].sort((a, b) => a - b);
  const viewMap = new Map(keepViews.map((old, index) => [old, index]));
  const chunks = [];
  let offset = 0;
  json.bufferViews = keepViews.map((index) => {
    const view = json.bufferViews[index];
    const data = bin.subarray(
      view.byteOffset ?? 0,
      (view.byteOffset ?? 0) + view.byteLength,
    );
    const padded = Buffer.alloc(Math.ceil(data.length / 4) * 4);
    data.copy(padded);
    chunks.push(padded);
    const result = { ...view, buffer: 0, byteOffset: offset };
    offset += padded.length;
    return result;
  });
  for (const accessor of json.accessors)
    accessor.bufferView = viewMap.get(accessor.bufferView);
  json.buffers = [{ byteLength: offset }];
  const text = Buffer.from(JSON.stringify(json));
  const paddedJson = Buffer.alloc(Math.ceil(text.length / 4) * 4, 0x20);
  text.copy(paddedJson);
  const binary = Buffer.concat(chunks);
  const header = Buffer.alloc(20);
  header.writeUInt32LE(0x46546c67, 0);
  header.writeUInt32LE(2, 4);
  header.writeUInt32LE(28 + paddedJson.length + binary.length, 8);
  header.writeUInt32LE(paddedJson.length, 12);
  header.writeUInt32LE(0x4e4f534a, 16);
  const binaryHeader = Buffer.alloc(8);
  binaryHeader.writeUInt32LE(binary.length, 0);
  binaryHeader.writeUInt32LE(0x004e4942, 4);
  return Buffer.concat([header, paddedJson, binaryHeader, binary]);
}

if (
  process.argv[1] &&
  resolve(process.argv[1]) === fileURLToPath(import.meta.url)
) {
  const source =
    process.argv[2] ||
    fileURLToPath(
      new URL("../../outputs/PINCHO_modelo_color.glb", import.meta.url),
    );
  const output = new URL(
    "../public/catalog-models/soil-probe.glb",
    import.meta.url,
  );
  await writeFile(output, anonymiseProbe(await readFile(source)));
  console.log("Pincho del catálogo preparado sin el marcado identificativo.");
}
