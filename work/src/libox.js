import { catalogItems } from "./catalog.js";

// Funciones confirmadas por Hiotera. Coordenadas del GLB, en metros.
// No se presupone qué tensiómetro ocupa el conector central o el derecho.
export const liboxOverview = "28deg 78deg 112%";

// Modelo 3D del sensor que va en cada conector. Se reutiliza el del catálogo
// (mismo «id» que la «key» de la parte); las partes sin modelo devuelven null.
export const liboxPartModel = (part) =>
  catalogItems.find((item) => item.id === part?.key)?.model ?? null;
export const liboxParts = [
  {
    key: "temperature",
    name: "Sonda de suelo",
    category: "SONDA / SALIDA INFERIOR IZQUIERDA",
    description:
      "En la salida inferior izquierda se conecta la sonda de suelo. Mide la temperatura, la humedad y la conductividad, y en la aplicación puedes ver cómo cambian a lo largo del día.",
    anchors: [[-0.03, -0.084, -0.01]],
    normals: [[0, -1, 0]],
    orbit: "-22deg 112deg 103%",
    tag: "Sonda de suelo",
  },
  {
    key: "tension",
    name: "Tensiómetros · 15 y 30 cm",
    category: "DOS SONDAS / DOS PROFUNDIDADES",
    description:
      "Las otras dos salidas inferiores conectan los tensiómetros, a 15 cm y 30 cm de profundidad. Miden cuánto cuesta extraer el agua del suelo y permiten comparar lo que ocurre a las dos profundidades.",
    anchors: [
      [0, -0.084, -0.01],
      [0.03, -0.084, -0.01],
    ],
    normals: [
      [0, -1, 0],
      [0, -1, 0],
    ],
    orbit: "20deg 115deg 108%",
    tag: "15 / 30 cm",
  },
  {
    key: "light",
    name: "Radiación",
    category: "SENSOR DE RADIACIÓN / SALIDA SUPERIOR",
    description:
      "El cable superior conecta el sensor de radiación: mide la energía del sol que llega al cultivo. La aplicación muestra cómo cambia durante el día, en W/m².",
    anchors: [[0.0165, 0.083, -0.009]],
    normals: [[0, 1, 0]],
    orbit: "-25deg 58deg 108%",
    tag: "Radiación",
  },
  {
    key: "solar",
    name: "Carga solar",
    category: "ALIMENTACIÓN / CONECTOR LATERAL",
    description:
      "La placa solar se enchufa debajo de la antena para cargar el LIBOx con la luz del sol. Este conector es para la carga, no para un sensor.",
    anchors: [[-0.068, -0.031, -0.0125]],
    normals: [[-1, 0, 0]],
    orbit: "-65deg 80deg 108%",
    tag: "Placa solar",
  },
  {
    key: "reset",
    name: "Reinicio",
    category: "CONTROL / PULSADOR ROJO PEQUEÑO",
    description:
      "El pulsador rojo pequeño sirve para reiniciar el LIBOx. Está situado en el lateral, por encima del interruptor de encendido.",
    anchors: [[0.071, 0.016, -0.008]],
    normals: [[1, 0, 0]],
    orbit: "65deg 78deg 105%",
    tag: "Reinicio",
  },
  {
    key: "power",
    name: "Encendido · I / O",
    category: "CONTROL / INTERRUPTOR PRINCIPAL",
    description:
      "Este interruptor enciende y apaga el equipo: I es encendido y O es apagado. El botón pequeño que hay encima sirve para reiniciarlo.",
    anchors: [[0.072, -0.017, -0.007]],
    normals: [[1, 0, 0]],
    orbit: "65deg 92deg 105%",
    tag: "I / O",
  },
  {
    key: "antenna",
    name: "Antena",
    category: "COMUNICACIÓN / LATERAL",
    description:
      "La antena ayuda al LIBOx a comunicarse para que puedas consultar las lecturas. Está en el lateral, encima de la conexión de la placa solar.",
    anchors: [[-0.092, 0.045, -0.01]],
    normals: [[-1, 0, 0]],
    orbit: "-48deg 75deg 112%",
    tag: "Antena",
  },
];
