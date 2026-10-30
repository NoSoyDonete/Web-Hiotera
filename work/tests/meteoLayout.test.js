import test from "node:test";
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { createServer } from "vite";
import { translate } from "../src/i18n.js";

test("meteo copy uses content flow instead of competing fixed positions", async () => {
  const css = await readFile(
    new URL("../src/meteo.css", import.meta.url),
    "utf8",
  );
  const experience = await readFile(
    new URL("../src/experience.css", import.meta.url),
    "utf8",
  );
  assert.match(
    css,
    /\.meteo-pin\s*\{[^}]*position: sticky;[^}]*display: grid;/,
  );
  assert.match(
    css,
    /\.meteo-copy\s*\{[^}]*display: flex;[^}]*flex-direction: column;[^}]*overflow-y: auto;/,
  );
  for (const name of ["heading", "parts"]) {
    const block = css.match(
      new RegExp("\\.meteo-" + name + "\\s*\\{([^}]+)\\}"),
    )[1];
    assert.match(block, /position: static;/);
    assert.doesNotMatch(block, /\b(?:top|bottom):/);
  }
  assert.match(
    css,
    /grid-template-areas: "heading" "model" "parts" "transport";/,
  );
  assert.doesNotMatch(experience, /\.meteo-heading\s*\{[^}]*top:/);
});
test("every translation keeps heading and parts inside the same responsive column", async () => {
  const originalMatchMedia = globalThis.matchMedia;
  globalThis.matchMedia = () => ({ matches: false });
  const server = await createServer({
    logLevel: "silent",
    cacheDir: fileURLToPath(
      new URL("../scratch/meteo-layout-vite/", import.meta.url),
    ),
    optimizeDeps: { noDiscovery: true, include: [] },
    server: { middlewareMode: true, watch: null, hmr: false },
  });
  try {
    const { default: MeteoScene } = await server.ssrLoadModule(
      "/src/components/MeteoScene.jsx",
    );
    const { LanguageProvider } = await server.ssrLoadModule(
      "/src/components/LanguageProvider.jsx",
    );
    for (const language of ["es", "en", "fr", "de"]) {
      const html = renderToStaticMarkup(
        createElement(
          LanguageProvider,
          { initialLanguage: language },
          createElement(MeteoScene),
        ),
      );
      const heading = html.indexOf('class="meteo-heading"');
      const parts = html.indexOf('class="meteo-parts"');
      const stage = html.indexOf('class="meteo-stage"');
      assert.ok(
        html.includes('<div class="meteo-copy"><div class="meteo-heading">'),
      );
      assert.ok(heading < parts && parts < stage);
      assert.ok(html.includes(translate("Viento y lluvia.", language)));
      assert.ok(html.includes(translate("Anemómetro", language)));
      assert.match(html, /role="progressbar"/);
      assert.match(html, /animation-name="Viento"/);
    }
  } finally {
    await server.close();
    if (originalMatchMedia) globalThis.matchMedia = originalMatchMedia;
    else delete globalThis.matchMedia;
  }
});
