import test from "node:test";
import assert from "node:assert/strict";
import { readFile, readdir } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import { createElement, Fragment } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { createServer } from "vite";
import {
  languages,
  translate,
  legalUrl,
  normalizeText,
  languageStorageKey,
} from "../src/i18n.js";
import { translationRows, translations } from "../src/translations.js";
import { legalDocuments, legalIdentity } from "../src/legalContent.js";
import { platformViews } from "../src/demoData.js";
import { catalogItems, filterCatalog } from "../src/catalog.js";
import { site } from "../src/config.js";
import { liboxParts } from "../src/libox.js";
import { meteoParts } from "../src/meteo.js";

test("office and registered office remain distinct", () => {
  assert.equal(
    site.officeAddress,
    "Av. de Nicolás Salmerón, 69, 04700 El Ejido, Almería",
  );
  assert.match(site.registeredAddress, /Bulevar, 465, 23 A/);
  assert.equal(site.taxId, "B04925343");
  assert.equal(site.email, "contacto@hiotera.com");
  assert.equal(site.privacyEmail, "dpd@hiotera.com");
  assert.ok(
    legalIdentity.some(
      ([key, value]) =>
        key === "Domicilio legal" && value === site.registeredAddress,
    ),
  );
  assert.match(
    new URL(site.officeMap).searchParams.get("query"),
    /Nicolás Salmerón 69/,
  );
});
test("four complete dictionaries preserve Spanish and whitespace", () => {
  assert.deepEqual(
    languages.map((item) => item.code),
    ["es", "en", "fr", "de"],
  );
  assert.equal(languageStorageKey, "hiotera-language");
  assert.equal(
    new Set(translationRows.map((row) => row[0])).size,
    translationRows.length,
  );
  for (const row of translationRows) {
    assert.equal(row.length, 4);
    assert.ok(row.every((value) => typeof value === "string" && value.trim()));
  }
  assert.equal(translate("  Cambiar idioma\n", "en"), "  Change language\n");
  assert.equal(translate("Texto propio", "es"), "Texto propio");
  assert.equal(
    legalUrl("cookies", "fr"),
    "./legal.html?document=cookies&lang=fr",
  );
  assert.equal(
    legalUrl("cookies", "invalid"),
    "./legal.html?document=cookies&lang=es",
  );
  for (const doc of Object.values(legalDocuments))
    for (const text of [
      doc.title,
      ...doc.sections.flatMap(([heading, paragraphs]) => [
        heading,
        ...paragraphs,
      ]),
    ])
      for (const lang of ["en", "fr", "de"])
        assert.ok(
          translations[normalizeText(text)]?.[lang],
          "Missing legal translation: " + text,
        );
  for (const item of [...liboxParts, ...meteoParts, ...catalogItems])
    for (const field of ["name", "description", "category", "type", "action"])
      if (item[field] && item[field] !== "LIBOx")
        assert.ok(
          translations[normalizeText(item[field])],
          "Missing product translation: " + item[field],
        );
  for (const view of platformViews)
    for (const text of [
      view.tab,
      view.title,
      view.category,
      view.description,
      ...view.notes,
    ])
      if (!["LIBOx"].includes(text))
        assert.ok(
          translations[normalizeText(text)],
          "Missing public caption: " + text,
        );
});
test("catalogue search uses the chosen language without changing identifiers", () => {
  assert.ok(
    filterCatalog("Sensores", "moisture", (text) => translate(text, "en")).some(
      (item) => item.id === "temperature",
    ),
  );
  assert.ok(
    filterCatalog("Todos", "Überwachung", (text) => translate(text, "de")).some(
      (item) => item.id === "surveillance-cameras",
    ),
  );
  assert.equal(
    filterCatalog("Energía", "unmatched", (text) => translate(text, "fr"))
      .length,
    0,
  );
});
test("fonts are served locally with their licence notices", async () => {
  const styles = await readFile(
    new URL("../src/styles.css", import.meta.url),
    "utf8",
  );
  const index = await readFile(
    new URL("../index.html", import.meta.url),
    "utf8",
  );
  assert.doesNotMatch(styles + index, /fonts\.googleapis|fonts\.gstatic/);
  const files = await readdir(new URL("../public/fonts/", import.meta.url));
  assert.equal(files.filter((name) => name.endsWith(".ttf")).length, 11);
  for (const name of files.filter((name) => name.endsWith(".ttf"))) {
    const data = await readFile(
      new URL("../public/fonts/" + name, import.meta.url),
    );
    assert.ok(data.length > 10000);
    assert.equal(data.readUInt32BE(0), 0x00010000);
  }
  for (const family of ["dmmono", "manrope", "spacegrotesk"])
    assert.match(
      await readFile(
        new URL("../public/fonts/" + family + "-OFL.txt", import.meta.url),
        "utf8",
      ),
      /SIL OPEN FONT LICENSE/,
    );
});
test("legal pages, public copy and unchanged application render in every language", async () => {
  const originalMatchMedia = globalThis.matchMedia;
  globalThis.matchMedia = () => ({ matches: false });
  const server = await createServer({
    logLevel: "silent",
    cacheDir: fileURLToPath(
      new URL("../scratch/site-services-render-vite/", import.meta.url),
    ),
    optimizeDeps: { noDiscovery: true, include: [] },
    server: { middlewareMode: true, watch: null, hmr: false },
  });
  try {
    const { LanguageProvider, translateTree } = await server.ssrLoadModule(
      "/src/components/LanguageProvider.jsx",
    );
    const { Header, Footer } = await server.ssrLoadModule(
      "/src/components/HeaderFooter.jsx",
    );
    const { default: LegalPage } = await server.ssrLoadModule(
      "/src/components/LegalPage.jsx",
    );
    const { default: SignalSection } = await server.ssrLoadModule(
      "/src/components/SignalSection.jsx",
    );
    const { default: App } = await server.ssrLoadModule("/src/App.jsx");
    const render = (component, props, lang) =>
      renderToStaticMarkup(
        createElement(
          LanguageProvider,
          { initialLanguage: lang },
          createElement(component, props),
        ),
      );
    for (const lang of ["es", "en", "fr", "de"]) {
      const header = render(Header, {}, lang),
        footer = render(Footer, {}, lang);
      assert.match(header, /class="language-trigger"/);
      assert.ok(header.includes(translate("Cambiar idioma", lang)));
      assert.ok(footer.includes(site.officeAddress));
      assert.ok(!footer.includes(site.registeredAddress));
      assert.ok(
        footer.includes("legal.html?document=cookies&amp;lang=" + lang),
      );
      for (const key of Object.keys(legalDocuments)) {
        const html = render(LegalPage, { documentKey: key }, lang);
        assert.ok(html.includes(translate(legalDocuments[key].title, lang)));
        if (key !== "cookies") assert.ok(html.includes(site.registeredAddress));
        if (key === "cookies")
          assert.ok(
            html.includes(translate("Borrar mi preferencia de idioma", lang)),
          );
      }
      const html = render(App, {}, lang);
      assert.ok(html.includes(translate("Equipos para", lang)));
      assert.ok(html.includes(translate("Hablemos", lang)));
      const signal = render(SignalSection, {}, lang);
      assert.match(signal, /lang="es" translate="no"/);
      assert.match(signal, /<h2>Telemetría LIBOx<\/h2>/);
      assert.match(signal, /LIBOx (?:<!-- -->)?000/);
      assert.ok(signal.includes(translate(platformViews[0].description, lang)));
    }
    const callback = () => {};
    function Opaque() {
      return createElement("p", null, "Cambiar idioma");
    }
    const tree = createElement(
      "section",
      { id: "Cambiar idioma", onClick: callback, title: "Cambiar idioma" },
      createElement("input", {
        value: "Cambiar idioma",
        placeholder: "Cambiar idioma",
        readOnly: true,
      }),
      createElement("div", { translate: "no" }, "Cambiar idioma"),
      createElement(Opaque),
      createElement(Fragment, null, "Cambiar idioma"),
    );
    const translated = translateTree(tree, "en");
    const markup = renderToStaticMarkup(translated);
    assert.equal(translated.props.onClick, callback);
    assert.equal(translated.props.id, "Cambiar idioma");
    assert.match(markup, /title="Change language"/);
    assert.match(markup, /value="Cambiar idioma"/);
    assert.match(markup, /placeholder="Change language"/);
    assert.match(markup, /translate="no">Cambiar idioma/);
    assert.match(markup, /<p>Cambiar idioma<\/p>/);
  } finally {
    await server.close();
    if (originalMatchMedia) globalThis.matchMedia = originalMatchMedia;
    else delete globalThis.matchMedia;
  }
});
