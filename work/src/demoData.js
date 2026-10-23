// Escenario totalmente ficticio. No se importan capturas ni lecturas de clientes.
export const demoFarm = Object.freeze({
  name: "Invernadero Aurora",
  sector: "Sector A · finca de demostración",
  device: "DEMO-07",
  crop: "Tomate cherry",
  phase: "Cuajado · fase ficticia",
  campaignDay: 38,
  battery: 87,
  coverage: "Buena",
  end: "2030-05-09T16:00:00.000Z",
  notice: "DATOS SIMULADOS",
});

// Las bandas sirven solo para representar estados en la interfaz de ejemplo.
// No constituyen recomendaciones agronómicas ni umbrales de una finca real.
export const demoMetrics = [
  {
    id: "air",
    name: "Temperatura ambiente",
    unit: "°C",
    group: "Ambiente",
    color: "#bb7d0b",
    decimals: 1,
    band: [19, 28],
  },
  {
    id: "radiation",
    name: "Radiación interior",
    unit: "W/m²",
    group: "Ambiente",
    color: "#0f8574",
    decimals: 0,
  },
  {
    id: "humidity",
    name: "Humedad relativa",
    unit: "%",
    group: "Ambiente",
    color: "#3a922a",
    decimals: 1,
    band: [50, 75],
  },
  {
    id: "vpd",
    name: "Déficit de presión de vapor",
    unit: "kPa",
    group: "Ambiente",
    color: "#8b569e",
    decimals: 2,
  },
  {
    id: "deficit",
    name: "Déficit de humedad",
    unit: "g/m³",
    group: "Ambiente",
    color: "#bc6e43",
    decimals: 1,
  },
  {
    id: "dew",
    name: "Temperatura de rocío",
    unit: "°C",
    group: "Ambiente",
    color: "#427baa",
    decimals: 1,
  },
  {
    id: "pressure",
    name: "Presión atmosférica",
    unit: "hPa",
    group: "Ambiente",
    color: "#697580",
    decimals: 1,
  },
  {
    id: "co2",
    name: "Dióxido de carbono",
    unit: "ppm",
    group: "Ambiente",
    color: "#397552",
    decimals: 0,
  },
  {
    id: "voc",
    name: "Compuestos orgánicos volátiles",
    unit: "ppb",
    group: "Ambiente",
    color: "#a47937",
    decimals: 2,
  },
  {
    id: "soil",
    name: "Temperatura del suelo · sonda",
    unit: "°C",
    group: "Suelo",
    color: "#bd7c0f",
    decimals: 1,
    band: [20, 26],
  },
  {
    id: "soil1",
    name: "Temperatura suelo · pincho 1",
    unit: "°C",
    group: "Suelo",
    color: "#508f42",
    decimals: 1,
  },
  {
    id: "soil2",
    name: "Temperatura suelo · pincho 2",
    unit: "°C",
    group: "Suelo",
    color: "#427baa",
    decimals: 1,
  },
  {
    id: "moisture1",
    name: "Humedad del suelo · pincho 1",
    unit: "%",
    group: "Suelo",
    color: "#248572",
    decimals: 1,
  },
  {
    id: "moisture2",
    name: "Humedad del suelo · pincho 2",
    unit: "%",
    group: "Suelo",
    color: "#427baa",
    decimals: 1,
  },
  {
    id: "tension15",
    name: "Tensiómetro · 15 cm",
    unit: "cbar",
    group: "Suelo",
    color: "#418d2c",
    decimals: 1,
    band: [8, 18],
  },
  {
    id: "tension30",
    name: "Tensiómetro · 30 cm",
    unit: "cbar",
    group: "Suelo",
    color: "#bc7e14",
    decimals: 1,
    band: [6, 18],
  },
  {
    id: "ec1",
    name: "Conductividad eléctrica · pincho 1",
    unit: "dS/m",
    group: "Suelo",
    color: "#7d6397",
    decimals: 2,
  },
  {
    id: "ec2",
    name: "Conductividad eléctrica · pincho 2",
    unit: "dS/m",
    group: "Suelo",
    color: "#35877a",
    decimals: 2,
  },
  {
    id: "outside",
    name: "Temperatura exterior",
    unit: "°C",
    group: "Meteo",
    color: "#bb7d0b",
    decimals: 1,
  },
  {
    id: "outsideHumidity",
    name: "Humedad relativa exterior",
    unit: "%",
    group: "Meteo",
    color: "#3a922a",
    decimals: 1,
  },
  {
    id: "outsideDew",
    name: "Punto de rocío exterior",
    unit: "°C",
    group: "Meteo",
    color: "#427baa",
    decimals: 1,
  },
  {
    id: "outsideDeficit",
    name: "Déficit de humedad exterior",
    unit: "g/m³",
    group: "Meteo",
    color: "#bc6e43",
    decimals: 1,
  },
  {
    id: "rain",
    name: "Precipitación observada",
    unit: "mm",
    group: "Meteo",
    color: "#278eae",
    decimals: 1,
    bars: true,
  },
  {
    id: "rainDay",
    name: "Precipitación diaria",
    unit: "mm",
    group: "Meteo",
    color: "#4377a7",
    decimals: 1,
  },
  {
    id: "rainYear",
    name: "Precipitación anual",
    unit: "mm",
    group: "Meteo",
    color: "#546b9a",
    decimals: 1,
  },
  {
    id: "outsidePressure",
    name: "Presión barométrica",
    unit: "hPa",
    group: "Meteo",
    color: "#697580",
    decimals: 1,
  },
  {
    id: "outsideRadiation",
    name: "Radiación exterior",
    unit: "W/m²",
    group: "Meteo",
    color: "#0f8574",
    decimals: 0,
  },
  {
    id: "wind",
    name: "Velocidad del viento",
    unit: "km/h",
    group: "Meteo",
    color: "#3b885a",
    decimals: 1,
  },
  {
    id: "gust",
    name: "Racha de viento",
    unit: "km/h",
    group: "Meteo",
    color: "#b77e1f",
    decimals: 1,
  },
  {
    id: "direction",
    name: "Dirección del viento",
    unit: "°",
    group: "Meteo",
    color: "#8a6293",
    decimals: 0,
  },
];

export const metricById = Object.fromEntries(
  demoMetrics.map((metric) => [metric.id, metric]),
);
const hourMs = 3600000;
const end = Date.parse(demoFarm.end);
const start = end - 30 * 24 * hourMs;
const round = (value) => Math.round(value * 1000) / 1000;
const saturation = (temperature) =>
  0.6108 * Math.exp((17.27 * temperature) / (temperature + 237.3));
const dewPoint = (temperature, humidity) => {
  const gamma =
    Math.log(humidity / 100) + (17.27 * temperature) / (237.3 + temperature);
  return (237.3 * gamma) / (17.27 - gamma);
};

// Ciclos diarios, variaciones de nubosidad y pulsos de riego inventados.
// Se genera una única serie compartida por resúmenes, históricos y avisos.
let annualRain = 118.6,
  dailyRain = 0,
  previousDay = "";
export const demoSamples = Array.from({ length: 721 }, (_, index) => {
  const time = start + index * hourMs;
  const date = new Date(time);
  const hour = date.getUTCHours();
  const day = date.getUTCDate();
  const dayKey = date.toISOString().slice(0, 10);
  if (dayKey !== previousDay) dailyRain = 0;
  previousDay = dayKey;
  const sun = Math.max(0, Math.sin(((hour - 6) / 12) * Math.PI));
  const clouds =
    0.77 + 0.14 * Math.sin(day * 0.8) + 0.07 * Math.cos(hour * 0.7);
  const air = 18.6 + 10.1 * sun * clouds + 0.9 * Math.sin(day * 0.65);
  const humidity = 81 - 25 * sun + 2.2 * Math.cos(day * 0.9 + hour * 0.2);
  const outside = air - 2.8 + 0.4 * Math.cos(hour * 0.6);
  const outsideHumidity = humidity - 5 + 2.4 * Math.sin(hour * 0.5);
  const sinceIrrigation = ((hour + 22) % 24) / 24;
  const soil =
    22.5 +
    1.8 * Math.sin(((hour - 12) / 24) * Math.PI * 2) +
    0.35 * Math.sin(day * 0.8);
  const wind = 4.8 + 4 * sun + 1.8 * Math.sin(day * 1.4 + hour * 0.5);
  const rain =
    [4, 7, 18, 24].includes(day) && hour >= 13 && hour <= 17
      ? [0.3, 0.7, 1.1, 0.6, 0.2][hour - 13]
      : 0;
  dailyRain += rain;
  annualRain += rain;
  const pressure =
    1014.7 + 3.1 * Math.sin(day * 0.35) + 0.5 * Math.cos(hour * 0.4);
  const vpd = saturation(air) * (1 - humidity / 100);
  const values = {
    air,
    radiation: 585 * sun * clouds,
    humidity,
    vpd,
    deficit: (2167 * vpd) / (air + 273.15),
    dew: dewPoint(air, humidity),
    pressure,
    co2: 438 + 92 * (1 - sun) + 17 * Math.sin(day + hour * 0.15),
    voc: 0.23 + 0.035 * Math.sin(day * 0.7 + hour * 0.4),
    soil,
    soil1: soil + 0.7 + 0.4 * sun,
    soil2: soil - 0.4 + 0.2 * sun,
    moisture1: 33.5 - 7.1 * sinceIrrigation + 0.6 * Math.sin(day),
    moisture2: 36.8 - 4.1 * sinceIrrigation + 0.5 * Math.cos(day),
    tension15: 10.3 + 15 * sinceIrrigation + 0.6 * Math.sin(day * 0.7),
    tension30: 8.4 + 7 * sinceIrrigation + 0.4 * Math.sin(day * 0.5),
    ec1: 1.06 + 0.08 * sinceIrrigation + 0.03 * Math.sin(day * 0.8),
    ec2: 0.98 + 0.05 * sinceIrrigation + 0.02 * Math.cos(day * 0.7),
    outside,
    outsideHumidity,
    outsideDew: dewPoint(outside, outsideHumidity),
    outsideDeficit:
      (2167 * saturation(outside) * (1 - outsideHumidity / 100)) /
      (outside + 273.15),
    rain,
    rainDay: dailyRain,
    rainYear: annualRain,
    outsidePressure: pressure - 0.2,
    outsideRadiation: 830 * sun * clouds,
    wind,
    gust: wind + 2.3 + 1.8 * Math.abs(Math.sin(day * 0.6 + hour * 0.4)),
    direction: 108 + 24 * Math.sin(day * 0.55 + hour * 0.12),
  };
  return {
    time,
    values: Object.fromEntries(
      Object.entries(values).map(([id, value]) => [id, round(value)]),
    ),
  };
});

export const periods = [
  { id: "24h", label: "24 h", hours: 24 },
  { id: "7d", label: "7 días", hours: 168 },
  { id: "30d", label: "30 días", hours: 720 },
];
export function samplesFor(period = "7d") {
  const hours = periods.find((item) => item.id === period)?.hours ?? 168;
  return demoSamples.slice(-(hours + 1));
}
export function seriesFor(id, period = "7d") {
  if (!metricById[id]) return [];
  return samplesFor(period).map((sample) => ({
    time: sample.time,
    value: sample.values[id],
  }));
}
export function rainIntervals(period = "7d") {
  const samples = samplesFor(period).slice(1);
  const size = period === "24h" ? 1 : period === "30d" ? 24 : 6;
  return Array.from(
    { length: Math.ceil(samples.length / size) },
    (_, index) => {
      const bucket = samples.slice(index * size, (index + 1) * size);
      return {
        time: bucket.at(-1).time,
        value: round(
          bucket.reduce((sum, sample) => sum + sample.values.rain, 0),
        ),
      };
    },
  );
}
export function formatReading(id, value = demoSamples.at(-1).values[id]) {
  const metric = metricById[id];
  return Number(value).toLocaleString("es-ES", {
    minimumFractionDigits: metric.decimals,
    maximumFractionDigits: metric.decimals,
  });
}
export function demoDate(time, withTime = false) {
  const date = new Date(time);
  const day = String(date.getUTCDate()).padStart(2, "0");
  const month = String(date.getUTCMonth() + 1).padStart(2, "0");
  return `${day}/${month}${withTime ? ` · ${String(date.getUTCHours()).padStart(2, "0")}:00` : ""}`;
}
export function demoRange(period = "7d") {
  const samples = samplesFor(period);
  return `${demoDate(samples[0].time, period === "24h")} — ${demoDate(samples.at(-1).time, period === "24h")} / 2030`;
}
export function chartDomain(ids, period = "7d") {
  const values = ids.flatMap((id) =>
    seriesFor(id, period).map((point) => point.value),
  );
  const min = Math.min(...values),
    max = Math.max(...values);
  const padding = Math.max((max - min) * 0.15, 0.05);
  return [Math.max(0, min - padding), max + padding];
}
export function matchingMetrics(query) {
  const normalise = (value) =>
    value
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .toLowerCase();
  return demoMetrics.filter((metric) =>
    normalise(`${metric.name} ${metric.group}`).includes(
      normalise(query.trim()),
    ),
  );
}
export function toggleDemoMetric(selected, id) {
  if (!metricById[id]) return selected;
  return selected.includes(id)
    ? selected.filter((item) => item !== id)
    : selected.length < 6
      ? [...selected, id]
      : selected;
}

export const demoAlerts = [
  {
    id: "soil-tension",
    metric: "tension15",
    state: "Atención",
    date: "09/05/2030 · 16:00",
    title: "Tensión del suelo por encima de la banda de ejemplo",
    detail:
      "La lectura simulada a 15 cm supera el límite ilustrativo de 18 cbar. Abre el histórico para ver la evolución; este aviso no corresponde a una finca real.",
  },
  {
    id: "humidity-event",
    metric: "humidity",
    state: "Resuelto",
    date: "08/05/2030 · 07:00",
    title: "Humedad relativa fuera de la banda de ejemplo",
    detail:
      "Evento ficticio ya cerrado. El historial permite revisar cuándo cambió la humedad y compararla con otras señales.",
  },
  {
    id: "device-check",
    metric: "radiation",
    state: "Informativo",
    date: "07/05/2030 · 12:00",
    title: "Ejemplo de revisión de una señal",
    detail:
      "Aviso de demostración asociado a la radiación interior. Los nombres, las fechas y los valores de este entorno están inventados.",
  },
];

export const platformViews = [
  {
    id: "telemetry",
    tab: "Vista general",
    category: "TELEMETRÍA LIBOx",
    title: "Tu cultivo, en contexto.",
    description:
      "Cada parámetro tiene su propia gráfica histórica. Entra en los indicadores de este invernadero ficticio para explorar sus lecturas de ejemplo.",
    notes: [
      "Invernadero y equipo ficticios",
      "18 indicadores de ambiente y suelo",
      "Histórico de cada parámetro",
    ],
  },
  {
    id: "environment",
    tab: "Ambiente",
    category: "AMBIENTE Y RADIACIÓN",
    title: "Tres señales. Una misma historia.",
    description:
      "Temperatura, humedad y radiación comparten el mismo período. Cada curva tiene su unidad y su escala para que las lecturas no se confundan.",
    notes: [
      "Radiación expresada en W/m²",
      "Series inventadas, no copiadas",
      "24 horas, 7 días o 30 días",
    ],
  },
  {
    id: "water",
    tab: "Humedad y tensión",
    category: "HISTÓRICO DEL SUELO",
    title: "Lo que ocurre bajo tierra.",
    description:
      "Una secuencia simulada de riegos cambia la humedad y la tensión a dos profundidades. Compara las series sin utilizar datos de una explotación real.",
    notes: [
      "Tensiómetros a 15 y 30 cm",
      "Humedad en dos pinchos",
      "Escalas y unidades separadas",
    ],
  },
  {
    id: "temperature",
    tab: "Temperatura del suelo",
    category: "HISTÓRICO / TEMPERATURA",
    title: "Cada cambio tiene una curva.",
    description:
      "La sonda y los dos pinchos muestran ciclos de temperatura creados para esta demostración. Los valores coinciden con los indicadores del resumen.",
    notes: [
      "Tres series comparables",
      "Mismo calendario ficticio",
      "Lecturas totalmente simuladas",
    ],
  },
  {
    id: "meteo",
    tab: "Meteorología",
    category: "ESTACIÓN METEOROLÓGICA",
    title: "El exterior también cuenta.",
    description:
      "Viento, rachas y episodios de lluvia inventados, junto al resto de indicadores meteorológicos. Pulsa cualquier lectura para abrir su histórico.",
    notes: [
      "Viento y rachas en km/h",
      "Precipitación en mm",
      "12 indicadores con historial",
    ],
  },
  {
    id: "custom",
    tab: "Crea tu gráfica",
    category: "GRÁFICAS A MEDIDA",
    title: "Elige qué quieres comparar.",
    description:
      "Pon un nombre de ejemplo y selecciona hasta seis parámetros. La vista previa usa exclusivamente las series ficticias de esta demo; no guarda ni envía información.",
    notes: [
      "Selección de hasta seis medidas",
      "Búsqueda por parámetro",
      "Vista previa sin conexión a cuentas",
    ],
  },
  {
    id: "alerts",
    tab: "Avisos",
    category: "SEÑALES QUE MERECEN ATENCIÓN",
    title: "Del indicador al contexto.",
    description:
      "Estos avisos ficticios muestran cómo presentar un cambio, su estado y el acceso al histórico correspondiente. No son alertas activas de agricultores.",
    notes: [
      "Estados de ejemplo",
      "Fechas y equipos inventados",
      "Histórico vinculado al parámetro",
    ],
  },
];
