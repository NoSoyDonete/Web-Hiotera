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
    description:
      "Sus tres cazoletas giran con el viento y permiten medir la velocidad del aire.",
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
      "Recoge la lluvia y la conduce hacia el mecanismo de medida del interior.",
    anchor: [0.39, 2.345, -1],
    offset: [0, 0.94, -0.24],
  },
  {
    key: "rain",
    name: "Pluviómetro",
    category: "Precipitación",
    description:
      "Un balancín interior permite medir la lluvia acumulada. Al separar el embudo queda al descubierto.",
    anchor: [0.4, 1.995, -1],
    offset: [0, 0.13, -0.3],
  },
];

export const meteoProgress = (section) => {
  const travel = section.offsetHeight - window.innerHeight;
  const progress =
    travel > 0 ? -section.getBoundingClientRect().top / travel : 0;
  return Math.max(0, Math.min(1, (progress - 0.08) / 0.8));
};
