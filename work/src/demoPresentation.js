import {
  demoFarm,
  demoMetrics,
  demoSamples,
  metricById,
  seriesFor,
} from "./demoData.js";

export const cropStages = [
  { name: "Recién trasplantado", days: "Días 0–13", start: 0 },
  { name: "Crecimiento", days: "Días 14–29", start: 14 },
  { name: "Floración y cuajado", days: "Días 30–49", start: 30 },
  { name: "Primeros frutos", days: "Días 50–89", start: 50 },
  { name: "En cosecha", days: "Desde el día 90", start: 90 },
];
export const graphGroups = {
  environment: {
    title: "Ambiente y radiación interior",
    ids: ["air", "humidity", "radiation"],
  },
  dryness: { title: "Sequedad y rocío", ids: ["dew", "vpd", "deficit"] },
  water: {
    title: "Humedad y tensión del suelo",
    ids: ["moisture2", "moisture1", "tension30", "tension15"],
  },
  temperature: {
    title: "Temperatura del suelo",
    ids: ["soil", "soil1", "soil2"],
  },
  probes: { title: "Sensores de los pinchos", ids: ["ec1", "ec2"] },
  meteo: {
    title: "Datos de la estación meteorológica",
    ids: demoMetrics
      .filter((m) => m.group === "Meteo" && m.id !== "direction")
      .map((m) => m.id),
  },
};

export function deviceReading(
  id,
  value = demoSamples.at(-1).values[id],
  device = 0,
) {
  if (
    !device ||
    id.startsWith("outside") ||
    ["rain", "rainDay", "rainYear", "wind", "gust", "direction"].includes(id)
  )
    return value;
  const unit = metricById[id]?.unit;
  const delta =
    unit === "°C"
      ? 0.8
      : unit === "%"
        ? -2
        : unit === "W/m²"
          ? 14
          : unit === "cbar"
            ? 1.1
            : 0.03;
  return Math.max(0, Math.min(unit === "%" ? 100 : Infinity, value + delta));
}
export function deviceSeries(id, period, device = 0) {
  return seriesFor(id, period).map((point) => ({
    ...point,
    value: deviceReading(id, point.value, device),
  }));
}
export function readingState(id, value) {
  const band = metricById[id].band;
  if (!band) return { key: "info", label: "Informativo", icon: null };
  if (value < band[0]) return { key: "low", label: "Bajo", icon: "low" };
  if (value > band[1]) return { key: "high", label: "Alto", icon: "up" };
  return { key: "optimal", label: "Óptimo", icon: "check" };
}
export function chartScale(id, points) {
  if (!points.length) return [0, 1];
  const values = points.map((p) => p.value);
  const min = Math.min(...values),
    max = Math.max(...values);
  const padding = Math.max((max - min) * 0.13, 0.1);
  const step =
    metricById[id].unit === "%"
      ? 10
      : metricById[id].unit === "W/m²"
        ? 100
        : max > 100
          ? 10
          : max > 10
            ? 5
            : max > 2
              ? 1
              : 0.2;
  return [
    Math.floor(Math.max(0, min - padding) / step) * step,
    Math.ceil((max + padding) / step) * step,
  ];
}
export function transplantDay(date) {
  const start = Date.parse(date + "T16:00:00.000Z");
  return Number.isFinite(start)
    ? Math.max(0, Math.floor((Date.parse(demoFarm.end) - start) / 86400000))
    : 0;
}
