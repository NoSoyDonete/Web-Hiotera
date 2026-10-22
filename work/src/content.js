// Contenido editable: cada objeto representa una pieza de la página.
export const heroPhases = [
  {
    eyebrow: "UN NUEVO PUNTO DE VISTA",
    title: "El campo",
    highlight: "habla.",
    description:
      "Este es el punto donde empieza todo: un sensor real, dentro del cultivo, escuchando lo que todavía no se ve.",
    action: { href: "#nodo", label: "Descubre el nodo" },
    contact: true,
    note: ["LECTURA ACTIVA", "dato directo desde el cultivo"],
  },
  {
    eyebrow: "01 / ESCUCHA CONTINUA",
    title: "Lo invisible",
    highlight: "señala.",
    description:
      "Humedad, temperatura, luz y más. Cada variación dibuja una imagen más clara de lo que necesita la planta.",
    note: ["24 H / 7 D", "una señal que no se detiene"],
  },
  {
    eyebrow: "02 / INTELIGENCIA DE CULTIVO",
    title: "Entiende.",
    highlight: "Actúa.",
    description:
      "Hiotera traduce las señales en decisiones concretas para anticiparte, optimizar y cultivar con más criterio.",
    action: { href: "#senal", label: "Ver cómo funciona" },
    note: ["NODO 001", "instalado. conectado. leyendo."],
  },
];

export const nodeSteps = [
  {
    title: "Está cerca del cultivo.",
    description:
      "Sensores que registran humedad, temperatura, iluminancia, conductividad, CO₂ y más.",
    emphasis: "El dato aparece donde ocurre.",
  },
  {
    title: "Se conecta con la plataforma.",
    description:
      "La información viaja a un entorno sencillo, con histórico, gráficas y alertas para ver la finca desde cualquier lugar.",
  },
  {
    title: "Te dice qué merece atención.",
    description:
      "Hiotera transforma el dato en recomendaciones para riego, ventilación, humedad y control de los sistemas instalados.",
  },
];

export const signalPanels = {
  measure: {
    tab: "Mide",
    label: "Humedad del suelo",
    number: "72",
    unit: "%",
    delta: "↗ +4.2% esta semana",
    caption: "Ritmo del cultivo",
    time: "últimas 24 horas",
    values: ["18.4 °C", "1.42 mS", "824 ppm", "680 lux"],
  },
  understand: {
    tab: "Interpreta",
    label: "Índice de equilibrio",
    number: "86",
    unit: "/100",
    delta: "↗ condiciones estables",
    caption: "Lectura de la campaña",
    time: "últimos 7 días",
    values: ["óptima", "estable", "en rango", "ascendente"],
  },
  act: {
    tab: "Recomienda",
    label: "Siguiente acción",
    number: "12",
    unit: " min",
    delta: "● recomendación activa",
    caption: "Ventana de riego",
    time: "próximas 6 horas",
    values: ["18.4 °C", "1.42 mS", "824 ppm", "680 lux"],
  },
};

export const impactCards = [
  {
    category: "agua",
    title: ["Riega con", "criterio."],
    description:
      "Ajusta tiempos e intervalos con datos reales de cada cultivo.",
    stamp: ["WATER", "FLOW"],
  },
  {
    category: "suelo",
    title: ["Alimenta", "mejor."],
    description: "Optimiza fertilizantes y reduce el desperdicio.",
    stamp: ["SOIL", "READ"],
  },
  {
    category: "riesgo",
    title: ["Anticípate", "al cambio."],
    description: "Detecta anomalías y meteorología adversa antes de que pesen.",
    stamp: ["RISK", "OFF"],
  },
  {
    category: "control",
    title: ["Tu finca.", "Desde cualquier lugar."],
    description:
      "Supervisa y controla tus sistemas desde una app móvil o desde la nube.",
    stamp: ["FIELD", "ONLINE"],
  },
];

export const journeySteps = [
  {
    title: "Instala Hiotera",
    description:
      "Conecta tus invernaderos y empieza a recopilar la información sensible de tus cultivos.",
  },
  {
    title: "Optimiza la producción",
    description:
      "Mide, entiende y automatiza los procesos que mantienen el equilibrio perfecto.",
  },
  {
    title: "Gana tranquilidad",
    description:
      "Decide con datos y deja que el sistema te acompañe en cada campaña.",
  },
];
