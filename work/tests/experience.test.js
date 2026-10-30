import test from "node:test";
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { liboxParts } from "../src/libox.js";
import { catalogItems, filterCatalog } from "../src/catalog.js";
import { heroTabTarget } from "../src/hooks/useHeroPhases.js";
import { heroPhases } from "../src/content.js";

test("el LIBOx conserva las conexiones y funciones confirmadas", () => {
  assert.equal(liboxParts.length, 7);
  assert.equal(new Set(liboxParts.map((part) => part.key)).size, 7);
  for (const part of liboxParts) {
    assert.equal(part.anchors.length, part.normals.length);
    for (const point of part.anchors)
      assert.ok(point.length === 3 && point.every(Number.isFinite));
  }
  assert.match(
    liboxParts.find((part) => part.key === "temperature").description,
    /inferior izquierda/,
  );
  const tension = liboxParts.find((part) => part.key === "tension");
  assert.equal(tension.anchors.length, 2);
  assert.match(tension.description, /15 cm.*30 cm/);
  assert.match(
    liboxParts.find((part) => part.key === "reset").description,
    /reiniciar/,
  );
  assert.match(
    liboxParts.find((part) => part.key === "solar").description,
    /placa solar/,
  );
});

test("el LIBOx gira solo por interacción y conserva controles manuales", async () => {
  const source = await readFile(
    new URL("../src/components/LiboxScene.jsx", import.meta.url),
    "utf8",
  );
  assert.ok(source.includes('camera-controls=""'));
  assert.ok(source.includes('touch-action="pan-y"'));
  assert.ok(source.includes('aria-label="Restablecer vista del LIBOx"'));
  assert.ok(source.includes('aria-label="Acercar LIBOx"'));
  assert.ok(!source.includes('addEventListener("scroll"'));
  assert.ok(!source.includes("auto-rotate"));
  assert.ok(!source.includes("requestAnimationFrame"));
});

test("la salida superior y el catálogo identifican el sensor de radiación", () => {
  const sensor = liboxParts.find((part) => part.key === "light");
  assert.equal(sensor.name, "Radiación");
  assert.match(sensor.description, /radiación.*W\/m²/);
  assert.equal(filterCatalog("Sensores", "radiacion")[0].id, "light");
  assert.equal(filterCatalog("Sensores", "luminosidad").length, 0);
});

test("los números del modelo son opacos y contrastados, también en móvil", async () => {
  const css = await readFile(
    new URL("../src/experience.css", import.meta.url),
    "utf8",
  );
  const hotspot = css.match(/\.libox-hotspot\s*\{([^}]+)\}/)[1];
  assert.match(hotspot, /opacity: 1;/);
  assert.match(hotspot, /color: #ffffff;/);
  assert.ok(!css.includes(".libox-hotspot:not([data-visible])"));
  assert.match(css, /\.libox-hotspot > span\s*\{[^}]*background: #173e30;/);
  assert.match(
    css,
    /\.libox-hotspot > span\s*\{[^}]*width: 30px;[^}]*font-size: 0.7rem;/,
  );
});

test("la franja muestra las tres palabras una sola vez y sin movimiento", async () => {
  const component = await readFile(
    new URL("../src/components/ContentSections.jsx", import.meta.url),
    "utf8",
  );
  const marquee = component.slice(
    component.indexOf("export function Marquee"),
    component.indexOf("export function StatementSection"),
  );
  for (const word of ["MIDE", "INTERPRETA", "RECOMIENDA"])
    assert.equal(marquee.split(`<b>${word}</b>`).length - 1, 1);
  const css = await readFile(
    new URL("../src/styles.css", import.meta.url),
    "utf8",
  );
  assert.ok(!css.match(/\.marquee-track\s*\{[^}]*animation:/));
});

test("la aplicación explica que todos los parámetros tienen su propio histórico", async () => {
  const source = await readFile(
    new URL("../src/components/SignalSection.jsx", import.meta.url),
    "utf8",
  );
  const text = source.replace(/\s+/g, " ");
  assert.match(text, /Cada parámetro tiene su propia gráfica histórica/);
  assert.match(text, /Aquí puedes ver algunos ejemplos/);
});

test("el catálogo filtra por categoría y texto sin distinguir tildes", () => {
  assert.equal(filterCatalog("Todos", "").length, catalogItems.length);
  assert.equal(filterCatalog("Sensores", "").length, 4);
  assert.equal(filterCatalog("Todos", "tensiometros")[0].id, "tension");
  assert.equal(filterCatalog("Energía", "solar")[0].id, "solar");
  assert.equal(filterCatalog("Sensores", "solar")[0].id, "light");
  assert.equal(filterCatalog("Todos", "desconocido").length, 0);
});

test("el catálogo incluye el tensiómetro digital confirmado y cámaras con consulta propia", () => {
  assert.equal(catalogItems.length, 8);
  assert.equal(new Set(catalogItems.map((item) => item.id)).size, 8);
  const digital = filterCatalog("Sensores", "tensiometro digital");
  const cameras = filterCatalog("Equipos", "videovigilancia");
  assert.equal(digital.length, 1);
  assert.equal(filterCatalog("Todos", "analógico").length, 0);
  assert.equal(cameras.length, 1);
  for (const item of [digital[0], cameras[0]]) {
    assert.equal(item.contact, true);
    assert.equal(item.href, undefined);
    assert.equal(item.action, "Consultar equipo");
  }
});

test("la portada lleva al catálogo y elimina el acceso directo a la meteo", async () => {
  assert.deepEqual(heroPhases[0].action, {
    href: "#catalogo",
    label: "Explora el catálogo",
  });
  const hero = await readFile(
    new URL("../src/components/HeroScene.jsx", import.meta.url),
    "utf8",
  );
  assert.ok(!hero.includes("hero-meteo-link"));
  assert.ok(!hero.includes("Descubre la meteo"));
  assert.ok(hero.includes("sensor-radar"));
  assert.ok(hero.includes("site.installationPhoto"));
});

test("la portada es fotográfica y el LIBOx aparece inmediatamente antes de la meteo", async () => {
  const hero = await readFile(
    new URL("../src/components/HeroScene.jsx", import.meta.url),
    "utf8",
  );
  const app = await readFile(
    new URL("../src/App.jsx", import.meta.url),
    "utf8",
  );
  assert.ok(!hero.includes("model-viewer"));
  assert.ok(hero.includes("site.installationPhoto"));
  assert.ok(hero.includes("sensor-radar"));
  assert.ok(hero.includes("sensor-fallback"));
  assert.ok(!hero.includes("hero-hud"));
  assert.ok(!hero.includes("model-loaded"));
  assert.match(
    app,
    /<HeroScene[^>]*\/>\s*<LiboxScene\s*\/>\s*<MeteoScene\s*\/>/,
  );
});

test("la portada conserva los tres textos originales sin depender de un modelo", () => {
  assert.deepEqual(
    heroPhases.map((item) => item.title),
    ["El campo", "Lo invisible", "Entiende."],
  );
  assert.deepEqual(
    heroPhases.map((item) => item.tab),
    ["El campo", "Las señales", "Las decisiones"],
  );
});

test("las pestañas de portada se recorren con flechas, Inicio y Fin", () => {
  assert.equal(heroTabTarget("ArrowRight", 0), 1);
  assert.equal(heroTabTarget("ArrowRight", 2), 0);
  assert.equal(heroTabTarget("ArrowLeft", 0), 2);
  assert.equal(heroTabTarget("ArrowLeft", 2), 1);
  assert.equal(heroTabTarget("Home", 2), 0);
  assert.equal(heroTabTarget("End", 0), 2);
  assert.equal(heroTabTarget("Tab", 0), null);
  assert.equal(heroTabTarget("ArrowDown", 1), null);
});

test("la portada cambia solo con pestañas accesibles, no con scroll ni temporizadores", async () => {
  const hero = await readFile(
    new URL("../src/components/HeroScene.jsx", import.meta.url),
    "utf8",
  );
  const hook = await readFile(
    new URL("../src/hooks/useHeroPhases.js", import.meta.url),
    "utf8",
  );
  assert.match(hero, /role="tablist"\s+aria-label="Mensajes de Hiotera"/);
  assert.match(hero, /role="tab"/);
  assert.match(hero, /role="tabpanel"/);
  assert.match(hero, /aria-controls=\{`hero-panel-\$\{index\}`\}/);
  assert.match(hero, /aria-labelledby=\{`hero-tab-\$\{index\}`\}/);
  assert.match(hero, /aria-selected=\{phase === index\}/);
  assert.match(hero, /inert=\{phase !== index\}/);
  assert.match(hero, /onClick=\{\(\) => selectPhase\(index\)\}/);
  assert.match(hero, /onKeyDown=\{\(event\) => onTabKeyDown\(event, index\)\}/);
  assert.match(hook, /useState\(0\)/);
  assert.match(hook, /event\.preventDefault\(\)/);
  assert.match(hook, /\?\.focus\(\)/);
  assert.doesNotMatch(
    hook,
    /addEventListener|requestAnimationFrame|setTimeout|setInterval|window\.|getBoundingClientRect/,
  );
  assert.doesNotMatch(hero, /Desliza para recorrer/);
  assert.doesNotMatch(hero, /scroll-cue|sensor-note/);
});

test("las secciones no repiten rótulos decorativos ni mensajes de transición", async () => {
  const sources = await Promise.all(
    [
      "HeroScene.jsx",
      "LiboxScene.jsx",
      "MeteoScene.jsx",
      "CatalogModel.jsx",
    ].map((name) =>
      readFile(new URL(`../src/components/${name}`, import.meta.url), "utf8"),
    ),
  );
  assert.doesNotMatch(
    sources.join("\n"),
    /hero-hud|sensor-note|scroll-cue|libox-model-caption|libox-next|meteo-camera-hint|meteo-view-label|<figcaption>|ARRASTRA PARA GIRAR|VER LA ESTACIÓN METEOROLÓGICA/,
  );
  assert.match(sources[0], /role="tablist"/);
  assert.match(sources[1], /aria-label="Acercar LIBOx"/);
  assert.match(sources[1], /libox-hotspot/);
  assert.match(sources[2], /Pausar viento y lluvia/);
  assert.match(sources[2], /Montada/);
  assert.match(sources[3], /Ampliar modelo 3D de/);
  const css = await readFile(
    new URL("../src/styles.css", import.meta.url),
    "utf8",
  );
  assert.doesNotMatch(css, /HIOTERA \/ FIELD (?:NODE|NOTE) 001/);
  assert.match(css, /\.sensor-hero::after\s*\{\s*content: none;/);
});

test("solo la meteo retiene una escena al bajar; portada y LIBOx siguen el flujo", async () => {
  const css = await readFile(
    new URL("../src/styles.css", import.meta.url),
    "utf8",
  );
  const experience = await readFile(
    new URL("../src/experience.css", import.meta.url),
    "utf8",
  );
  const meteo = await readFile(
    new URL("../src/meteo.css", import.meta.url),
    "utf8",
  );
  assert.match(css, /\.hero\.sensor-hero\s*\{[^}]*min-height: 100svh;/);
  assert.match(
    css,
    /\.sensor-pin\s*\{[^}]*position: relative;[^}]*height: auto;/,
  );
  assert.match(css, /\.hero-phases\s*\{[^}]*display: grid;/);
  assert.match(css, /\.hero-phase\s*\{[^}]*grid-area: 1 \/ 1;/);
  assert.doesNotMatch(css, /position: sticky/);
  assert.doesNotMatch(css, /min-height: 2[78]0s?vh/);
  assert.match(experience, /\.libox-section\s*\{[^}]*height: auto;/);
  assert.match(experience, /\.libox-pin\s*\{[^}]*position: relative;/);
  assert.match(meteo, /\.meteo-pin\s*\{[^}]*position: sticky;/);
  assert.match(meteo, /\.meteo-section\s*\{[^}]*height: 310svh;/);
});
