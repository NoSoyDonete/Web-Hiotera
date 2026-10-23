import test from "node:test";
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { liboxParts } from "../src/libox.js";
import { catalogItems, filterCatalog } from "../src/catalog.js";
import { heroPhaseAt } from "../src/hooks/useHeroPhases.js";
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
  assert.equal(filterCatalog("Sensores", "solar").length, 0);
  assert.equal(filterCatalog("Todos", "desconocido").length, 0);
});

test("el catálogo incluye tensiómetros analógicos y cámaras con consulta propia", () => {
  assert.equal(catalogItems.length, 8);
  assert.equal(new Set(catalogItems.map((item) => item.id)).size, 8);
  const analog = filterCatalog("Sensores", "tensiometros analogicos");
  const cameras = filterCatalog("Equipos", "videovigilancia");
  assert.equal(analog.length, 1);
  assert.equal(cameras.length, 1);
  for (const item of [analog[0], cameras[0]]) {
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
  assert.ok(hero.includes("hero-hud"));
  assert.ok(!hero.includes("model-loaded"));
  assert.match(
    app,
    /<HeroScene[^>]*\/>\s*<LiboxScene\s*\/>\s*<MeteoScene\s*\/>/,
  );
});

test("la portada conserva los tres textos originales sin depender de un modelo", () => {
  assert.equal(heroPhaseAt(-1), 0);
  assert.equal(heroPhaseAt(0), 0);
  assert.equal(heroPhaseAt(0.34), 1);
  assert.equal(heroPhaseAt(0.68), 2);
  assert.equal(heroPhaseAt(1), 2);
  assert.equal(heroPhaseAt(2), 2);
});
