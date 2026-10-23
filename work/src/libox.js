// Funciones confirmadas por Hiotera. Coordenadas del GLB, en metros.
// No se presupone qué tensiómetro ocupa el conector central o el derecho.
export const liboxOverview = "28deg 78deg 112%";
export const liboxParts = [
  {
    key: "temperature",
    name: "Temperatura del suelo",
    category: "SONDA / SALIDA INFERIOR IZQUIERDA",
    description:
      "De la salida inferior izquierda sale el cable de la sonda que mide la temperatura del suelo. La lectura se consulta en la aplicación junto al resto de señales del cultivo.",
    anchors: [[-0.03, -0.084, -0.01]],
    normals: [[0, -1, 0]],
    orbit: "-22deg 112deg 103%",
    tag: "Temperatura",
  },
  {
    key: "tension",
    name: "Tensiómetros · 15 y 30 cm",
    category: "DOS SONDAS / DOS PROFUNDIDADES",
    description:
      "Las otras dos salidas inferiores conectan los tensiómetros: uno se clava a 15 cm y el otro a 30 cm. Miden la tensión del agua en el suelo para conocer cómo cambia su disponibilidad a ambas profundidades.",
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
      "El cable superior conecta el LIBOx con el sensor de radiación. Registra la radiación que recibe el cultivo y permite consultar su evolución en la aplicación, en W/m².",
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
      "Debajo de la antena está el conector donde se enchufa la placa solar para cargar el LIBOx. Es la conexión de alimentación solar, no una salida de sonda.",
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
      "El interruptor basculante es el mando de encendido y apagado. Las marcas I y O permiten identificar sus dos posiciones, por separado del pulsador de reinicio.",
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
      "La antena lateral forma parte de la comunicación del LIBOx. El modelo sin cables deja ver su posición y la separación entre las conexiones de datos y de carga.",
    anchors: [[-0.092, 0.045, -0.01]],
    normals: [[-1, 0, 0]],
    orbit: "-48deg 75deg 112%",
    tag: "Antena",
  },
];
