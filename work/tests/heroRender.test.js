import test from "node:test";
import assert from "node:assert/strict";
import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { createServer } from "vite";
import { fileURLToPath } from "node:url";

test("la portada renderiza sus tres pestañas y aísla los mensajes inactivos", async () => {
  const server = await createServer({
    logLevel: "silent",
    cacheDir: fileURLToPath(
      new URL("../scratch/hero-render-vite/", import.meta.url),
    ),
    optimizeDeps: { noDiscovery: true, include: [] },
    server: { middlewareMode: true, watch: null, hmr: false },
  });
  try {
    const { default: HeroScene } = await server.ssrLoadModule(
      "/src/components/HeroScene.jsx",
    );
    const html = renderToStaticMarkup(
      createElement(HeroScene, { onContact() {} }),
    );
    assert.equal((html.match(/role="tab"/g) ?? []).length, 3);
    assert.equal((html.match(/role="tabpanel"/g) ?? []).length, 3);
    assert.equal((html.match(/aria-selected="true"/g) ?? []).length, 1);
    assert.equal((html.match(/inert=""/g) ?? []).length, 2);
    for (let index = 0; index < 3; index++) {
      assert.match(html, new RegExp(`id="hero-tab-${index}"`));
      assert.match(html, new RegExp(`aria-controls="hero-panel-${index}"`));
      assert.match(html, new RegExp(`aria-labelledby="hero-tab-${index}"`));
    }
    assert.match(html, /data-scene-stage="0"/);
    assert.match(html, /class="sensor-fallback"/);
    assert.match(html, /class="sensor-radar"/);
    assert.match(html, /href="#catalogo"/);
    assert.doesNotMatch(html, /scroll-cue|hero-hud|sensor-note/);
    assert.doesNotMatch(html, /Desliza para recorrer|model-viewer/);
  } finally {
    await server.close();
  }
});
