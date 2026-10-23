import test from "node:test";
import assert from "node:assert/strict";
import { readFile, readdir } from "node:fs/promises";
import {
  demoFarm,
  demoMetrics,
  demoSamples,
  demoAlerts,
  platformViews,
  periods,
  samplesFor,
  seriesFor,
  rainIntervals,
  chartDomain,
  demoRange,
  matchingMetrics,
  toggleDemoMetric,
} from "../src/demoData.js";

test("el escenario y sus siete vistas se identifican como ficticios", () => {
  assert.equal(demoFarm.name, "Invernadero Aurora");
  assert.equal(demoFarm.device, "DEMO-07");
  assert.equal(demoFarm.notice, "DATOS SIMULADOS");
  assert.match(demoFarm.phase, /ficticia/);
  assert.equal(platformViews.length, 7);
  assert.deepEqual(
    platformViews.map((view) => view.id),
    [
      "telemetry",
      "environment",
      "water",
      "temperature",
      "meteo",
      "custom",
      "alerts",
    ],
  );
  for (const view of platformViews) assert.equal(view.file, undefined);
});

test("los treinta parámetros comparten muestras horarias completas y finitas", () => {
  assert.equal(demoMetrics.length, 30);
  assert.equal(new Set(demoMetrics.map((metric) => metric.id)).size, 30);
  assert.equal(demoSamples.length, 721);
  assert.equal(demoSamples.at(-1).time, Date.parse(demoFarm.end));
  demoSamples.forEach((sample, index) => {
    assert.equal(Object.keys(sample.values).length, demoMetrics.length);
    for (const metric of demoMetrics) {
      assert.ok(Number.isFinite(sample.values[metric.id]), metric.id);
      assert.ok(sample.values[metric.id] >= 0, metric.id);
    }
    if (index) assert.equal(sample.time - demoSamples[index - 1].time, 3600000);
    assert.ok(sample.values.humidity <= 100);
    assert.ok(sample.values.outsideHumidity <= 100);
    assert.ok(sample.values.gust >= sample.values.wind);
    assert.ok(sample.values.dew <= sample.values.air);
    assert.ok(sample.values.outsideDew <= sample.values.outside);
    assert.ok(sample.values.outsideRadiation >= sample.values.radiation);
  });
});

test("cada parámetro tiene su histórico para los tres períodos y coincide con el resumen", () => {
  for (const period of periods) {
    assert.equal(samplesFor(period.id).length, period.hours + 1);
    assert.match(demoRange(period.id), /2030/);
    for (const metric of demoMetrics) {
      const series = seriesFor(metric.id, period.id);
      assert.equal(series.length, period.hours + 1);
      assert.equal(series.at(-1).value, demoSamples.at(-1).values[metric.id]);
      assert.equal(series.at(-1).time, Date.parse(demoFarm.end));
      const domain = chartDomain([metric.id], period.id);
      assert.ok(domain[1] > domain[0]);
      assert.ok(
        series.every(
          (point) => point.value >= domain[0] && point.value <= domain[1],
        ),
      );
    }
  }
  assert.deepEqual(seriesFor("invalid"), []);
});

test("la agregación de lluvia conserva exactamente el acumulado simulado", () => {
  for (const period of periods) {
    const total = samplesFor(period.id)
      .slice(1)
      .reduce((sum, sample) => sum + sample.values.rain, 0);
    const bars = rainIntervals(period.id);
    assert.ok(
      Math.abs(total - bars.reduce((sum, point) => sum + point.value, 0)) <
        0.000001,
    );
    assert.ok(bars.every((point) => point.value >= 0));
  }
  assert.ok(rainIntervals("7d").some((point) => point.value > 0));
  assert.ok(
    demoSamples.every(
      (sample, index) =>
        !index ||
        sample.values.rainYear >= demoSamples[index - 1].values.rainYear,
    ),
  );
});

test("el aviso de atención coincide con la última lectura inventada", () => {
  const alert = demoAlerts.find((item) => item.state === "Atención");
  const metric = demoMetrics.find((item) => item.id === alert.metric);
  assert.ok(demoSamples.at(-1).values[metric.id] > metric.band[1]);
  assert.match(alert.date, /09\/05\/2030.*16:00/);
  for (const item of demoAlerts)
    assert.ok(demoMetrics.some((metric) => metric.id === item.metric));
});

test("el creador busca sin tildes, permite quitar medidas y limita la selección a seis", () => {
  assert.equal(matchingMetrics("radiacion").length, 2);
  assert.equal(matchingMetrics("tensiometro").length, 2);
  assert.equal(matchingMetrics("algo inexistente").length, 0);
  let selected = [];
  for (const metric of demoMetrics)
    selected = toggleDemoMetric(selected, metric.id);
  assert.equal(selected.length, 6);
  selected = toggleDemoMetric(selected, selected[0]);
  assert.equal(selected.length, 5);
  assert.deepEqual(toggleDemoMetric(selected, "invalid"), selected);
});

test("no se publican las capturas originales ni se usan imágenes para ocultar datos", async () => {
  const assets = await readdir(new URL("../public/", import.meta.url));
  assert.ok(!assets.some((name) => /^app-.*\.png$/.test(name)));
  const component = await readFile(
    new URL("../src/components/SignalSection.jsx", import.meta.url),
    "utf8",
  );
  assert.ok(!component.includes("<img"));
  assert.ok(!component.includes("Screenshot"));
  assert.ok(component.includes("ApplicationDemo"));
  const demo = await readFile(
    new URL("../src/components/ApplicationDemo.jsx", import.meta.url),
    "utf8",
  );
  assert.ok(demo.includes('data-demo="synthetic"'));
  assert.ok(!demo.includes("fetch("));
  assert.ok(!demo.includes("localStorage"));
  assert.ok(!demo.includes("dangerouslySetInnerHTML"));
});
