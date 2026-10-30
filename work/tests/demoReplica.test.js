import test from "node:test";
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { createServer } from "vite";
import {
  demoMetrics,
  demoSamples,
  platformViews,
  periods,
} from "../src/demoData.js";
import {
  cropStages,
  graphGroups,
  chartScale,
  deviceReading,
  deviceSeries,
  readingState,
  transplantDay,
} from "../src/demoPresentation.js";
import {
  demoGuides,
  guideSections,
  matchingGuides,
} from "../src/demoResources.js";

test("los equipos 000 y 001 usan lecturas inventadas coherentes con sus curvas", () => {
  assert.notEqual(
    deviceReading("air", undefined, 0),
    deviceReading("air", undefined, 1),
  );
  assert.equal(
    deviceReading("outside", undefined, 0),
    deviceReading("outside", undefined, 1),
  );
  for (const device of [0, 1])
    for (const metric of demoMetrics)
      for (const period of periods) {
        const points = deviceSeries(metric.id, period.id, device);
        assert.equal(
          points.at(-1).value,
          deviceReading(metric.id, undefined, device),
        );
        const [min, max] = chartScale(metric.id, points);
        assert.ok(Number.isFinite(min) && Number.isFinite(max) && max > min);
        assert.ok(
          points.every((point) => point.value >= min && point.value <= max),
        );
      }
  assert.deepEqual(chartScale("air", []), [0, 1]);
});
test("los estados, las fases y los grupos de gráficas respetan la estructura de las capturas", () => {
  assert.equal(cropStages.length, 5);
  assert.equal(transplantDay("2030-03-16"), 54);
  assert.equal(transplantDay("2030-05-09"), 0);
  assert.equal(transplantDay(""), 0);
  assert.equal(graphGroups.environment.ids.length, 3);
  assert.equal(graphGroups.dryness.ids.length, 3);
  assert.equal(graphGroups.water.ids.length, 4);
  assert.equal(graphGroups.meteo.ids.length, 11);
  assert.equal(readingState("air", 100).key, "high");
  assert.equal(readingState("air", 1).key, "low");
  assert.equal(readingState("air", 24).key, "optimal");
  assert.equal(readingState("pressure", 1012).key, "info");
});
test("los seis apartados y los treinta históricos renderizan sin nombres reales ni curvas inválidas", async () => {
  const server = await createServer({
    logLevel: "silent",
    cacheDir: fileURLToPath(
      new URL("../scratch/replica-render-vite/", import.meta.url),
    ),
    optimizeDeps: { noDiscovery: true, include: [] },
    server: { middlewareMode: true, watch: null, hmr: false },
  });
  try {
    const { default: ApplicationDemo, useDemoExperience } =
      await server.ssrLoadModule("/src/components/ApplicationDemo.jsx");
    const render = (view, override = {}) => {
      function Fixture() {
        const experience = useDemoExperience();
        return createElement(ApplicationDemo, {
          view,
          onView() {},
          experience: { ...experience, ...override },
        });
      }
      return renderToStaticMarkup(createElement(Fixture));
    };
    for (const view of platformViews) {
      const html = render(view.id);
      assert.match(html, /data-demo="synthetic"/);
      assert.doesNotMatch(
        html,
        /NaN|Infinity|DEMO-07|Aurora|Nave \d|LX-\d{3}|@hiotera\.com|2026-/,
      );
    }
    const farms = render("farms"),
      telemetry = render("telemetry"),
      meteo = render("meteo"),
      builder = render("custom");
    assert.match(farms, /1 finca en el mapa/);
    assert.match(farms, /demo1@example.com/);
    assert.match(farms, /Abrir ficha/);
    assert.match(telemetry, /LIBOx (?:<!-- -->)?000/);
    assert.match(telemetry, /LIBOx (?:<!-- -->)?001/);
    assert.match(telemetry, /<h2>Telemetría LIBOx<\/h2>/);
    assert.doesNotMatch(telemetry, /class="replica-farm-tabs"/);
    assert.match(render("farm-telemetry"), /class="replica-farm-tabs"/);
    assert.match(render("farm-telemetry"), /<h2>Telemetría de finca<\/h2>/);
    const notebook = render("notebook"),
      guides = render("guides");
    assert.match(notebook, /<h1>Demo1<\/h1>/);
    assert.match(notebook, /1 de 5 apartados listos/);
    assert.equal(
      (notebook.match(/class="replica-notebook-step"/g) ?? []).length,
      5,
    );
    for (const heading of [
      "Explotación",
      "Personas",
      "Equipos de aplicación",
      "Fincas y recintos SIGPAC",
    ])
      assert.ok(notebook.includes(heading));
    assert.equal(
      (guides.match(/class="replica-guide-card"/g) ?? []).length,
      22,
    );
    for (const section of guideSections)
      assert.ok(guides.includes(section.title));
    assert.match(
      render("guides", { guide: "tension" }),
      /Ver la gráfica de esta medida/,
    );
    assert.doesNotMatch(
      render("guides", { guide: "tension" }),
      /replica-info-modal/,
    );
    for (const guide of demoGuides)
      assert.match(render("guides", { guide: guide.id }), /Todas las guías/);
    assert.equal(
      (telemetry.match(/class="replica-reading /g) ?? []).length,
      18,
    );
    assert.equal((meteo.match(/class="replica-reading /g) ?? []).length, 11);
    assert.match(meteo, /Dirección del viento/);
    assert.match(builder, /Confirmar gráfica/);
    assert.match(render("environment"), /SERIES VISIBLES/);
    assert.match(render("water"), /Comienzo del rango de la gráfica/);
    for (const metric of demoMetrics) {
      const html = render("telemetry", { metric: metric.id });
      assert.match(html, /replica-history/);
      assert.doesNotMatch(html, /NaN|Infinity/);
    }
    assert.doesNotMatch(
      render("environment", {
        period: "custom",
        customStart: "2040-01-01",
        customEnd: "2040-01-02",
      }),
      /NaN|Infinity/,
    );
  } finally {
    await server.close();
  }
});
test("las guías buscan sin tildes y sus historiales corresponden a medidas existentes", () => {
  assert.equal(demoGuides.length, 22);
  assert.equal(new Set(demoGuides.map((item) => item.id)).size, 22);
  assert.equal(matchingGuides("tensiometros")[0].id, "tension");
  assert.equal(matchingGuides("SEQUEDAD")[0].id, "vpd");
  assert.equal(matchingGuides("inexistente").length, 0);
  for (const guide of demoGuides) {
    assert.ok(guideSections.some((section) => section.id === guide.section));
    assert.ok(
      !guide.metric || demoMetrics.some((metric) => metric.id === guide.metric),
    );
    assert.ok(guide.body.length > 100);
  }
});
test("el lienzo conserva sidebar, cabecera y proporciones sin reutilizar las capturas", async () => {
  const css = await readFile(
    new URL("../src/application-demo.css", import.meta.url),
    "utf8",
  );
  const component = await readFile(
    new URL("../src/components/ApplicationDemo.jsx", import.meta.url),
    "utf8",
  );
  assert.match(css, /aspect-ratio: 1920\s*\/\s*920/);
  assert.match(css, /grid-template-columns: 252px minmax\(0, 1fr\)/);
  assert.match(css, /\.replica-header\s*\{[^}]*height: 76px/);
  assert.match(
    css,
    /\.app-demo :where\(footer\)\s*\{[^}]*background: transparent;[^}]*padding: 0;/,
  );
  assert.match(component, /new ResizeObserver/);
  assert.doesNotMatch(
    component,
    /fetch\(|localStorage|codex-clipboard|dangerouslySetInnerHTML/,
  );
});
