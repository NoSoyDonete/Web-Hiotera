import test from "node:test";
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { catalogItems } from "../src/catalog.js";

test("siete productos tienen GLB y el analógico queda pendiente por decisión del usuario", () => {
  assert.equal(catalogItems.filter((item) => item.model).length, 7);
  const pending = catalogItems.filter((item) => !item.model);
  assert.equal(pending.length, 1);
  assert.equal(pending[0].id, "analog-tensiometers");
  assert.match(pending[0].modelNote, /pendiente/);
  assert.ok(catalogItems.every((item) => !item.illustration));
});

test("los modelos existen, son autocontenidos y sus buffers son válidos", async () => {
  for (const item of catalogItems.filter((item) => item.model)) {
    const data = await readFile(
      new URL(`../public/${item.model.file}`, import.meta.url),
    );
    assert.equal(data.readUInt32LE(0), 0x46546c67, item.name);
    assert.equal(data.readUInt32LE(4), 2);
    assert.equal(data.readUInt32LE(8), data.length);
    const jsonLength = data.readUInt32LE(12);
    const gltf = JSON.parse(data.subarray(20, 20 + jsonLength).toString());
    const binaryLength = data.readUInt32LE(20 + jsonLength);
    assert.ok(gltf.nodes.length > 0);
    for (const resource of [...(gltf.buffers ?? []), ...(gltf.images ?? [])])
      assert.ok(!resource.uri, item.name);
    for (const view of gltf.bufferViews) {
      assert.equal((view.byteOffset ?? 0) % 4, 0);
      assert.ok(
        (view.byteOffset ?? 0) + view.byteLength <= binaryLength,
        item.name,
      );
    }
    for (const node of gltf.nodes) {
      if (node.mesh !== undefined) assert.ok(gltf.meshes[node.mesh]);
      for (const child of node.children ?? []) assert.ok(gltf.nodes[child]);
    }
    assert.match(item.model.orbit, /deg.*deg.*%/);
  }
});

test("el pincho conserva carcasa y logotipo, sin nodos ni geometría MAC sobrante", async () => {
  const data = await readFile(
    new URL("../public/catalog-models/soil-probe.glb", import.meta.url),
  );
  const jsonLength = data.readUInt32LE(12);
  const gltf = JSON.parse(data.subarray(20, 20 + jsonLength).toString());
  assert.ok(gltf.nodes.some((node) => node.name === "Blanco_0"));
  assert.ok(gltf.nodes.some((node) => node.name === "Logo_1_0"));
  assert.ok(gltf.nodes.every((node) => !/^MAC_/.test(node.name ?? "")));
  const meshes = new Set(
    gltf.nodes.flatMap((node) => (node.mesh === undefined ? [] : [node.mesh])),
  );
  assert.equal(meshes.size, gltf.meshes.length);
  const accessors = new Set(
    gltf.meshes.flatMap((mesh) =>
      mesh.primitives.flatMap((primitive) =>
        [...Object.values(primitive.attributes), primitive.indices].filter(
          (index) => index !== undefined,
        ),
      ),
    ),
  );
  assert.equal(accessors.size, gltf.accessors.length);
  const views = new Set(gltf.accessors.map((accessor) => accessor.bufferView));
  assert.equal(views.size, gltf.bufferViews.length);
  assert.ok(data.length < 1731064);
});

test("el catálogo no dibuja SVG ni gira modelos con scroll y carga cerca de la vista", async () => {
  const source = await readFile(
    new URL("../src/components/CatalogSection.jsx", import.meta.url),
    "utf8",
  );
  const model = await readFile(
    new URL("../src/components/CatalogModel.jsx", import.meta.url),
    "utf8",
  );
  assert.ok(!source.includes("ProductDrawing"));
  assert.ok(!source.includes("<svg"));
  assert.ok(source.includes("CatalogModel"));
  assert.ok(model.includes("IntersectionObserver"));
  assert.ok(model.includes('camera-controls=""'));
  assert.ok(model.includes('disable-zoom=""'));
  assert.ok(!model.includes("auto-rotate"));
  assert.ok(!model.includes('addEventListener("scroll"'));
});
