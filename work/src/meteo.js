// Anclajes y desplazamientos del modelo original de Estacion-meteo-web.
// Despiece dura 6,5 s; la separación sucede entre los segundos 2,5 y 6,5.
export const meteoModelFile = "estacion-meteo-viva.glb";
export const meteoCameraTarget = "0m 1.5m -0.3m";

export const meteoCameraRadius = (model) =>
  10.5 *
  Math.max(
    1,
    (1.3 * Math.max(1, model.clientHeight)) / Math.max(1, model.clientWidth),
  );

export const meteoParts = [
  {
    key: "anemometer",
    name: "Anemómetro",
    category: "Velocidad del viento",
    description: "Gira con el viento para medir a qué velocidad sopla.",
    anchor: [-1.54, 2.455, 0.5],
    offset: [-0.48, 0.68, 0.1],
  },
  {
    key: "vane",
    name: "Veleta",
    category: "Dirección del viento",
    description:
      "Se orienta con el viento para indicar de qué dirección sopla.",
    anchor: [1.6, 2.455, 0.4],
    offset: [0.48, 0.65, 0.1],
  },
  {
    key: "funnel",
    name: "Embudo colector",
    category: "Captación de lluvia",
    description:
      "Recoge el agua de lluvia y la lleva al medidor que hay debajo.",
    anchor: [0.39, 2.345, -1],
    offset: [0, 0.94, -0.24],
  },
  {
    key: "rain",
    name: "Pluviómetro",
    category: "Cantidad de lluvia",
    description:
      "Mide cuánta lluvia ha caído. Está debajo del embudo; al separar las piezas puedes ver su mecanismo.",
    anchor: [0.4, 1.995, -1],
    offset: [0, 0.13, -0.3],
  },
  {
    key: "solar",
    name: "Placa solar",
    category: "Energía de la estación",
    description:
      "Capta la luz del sol y suministra energía para que la estación funcione.",
    // Panel_superior_84 dentro de Chasis_en_Y (y global = 1.76 + 0.081).
    anchor: [0, 1.84, -0.45],
    offset: [0, 0, 0],
  },
  {
    key: "collector",
    name: "Depósito colector",
    category: "Recogida de lluvia",
    description:
      "Recibe el agua que baja del embudo y la conduce al mecanismo que mide la lluvia.",
    anchor: [0.4, 1.68, -1.08],
    offset: [0.2, -0.42, -0.22],
  },
];
