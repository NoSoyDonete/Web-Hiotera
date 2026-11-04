// Contenido editable: cada objeto representa una pieza de la página.
export const heroPhases = [
  {
    tab: "El campo",
    eyebrow: "SENSORES PARA INVERNADEROS · EL EJIDO, ALMERÍA",
    title: "El campo",
    highlight: "habla.",
    description:
      "Consulta la humedad y la temperatura del suelo y las condiciones del invernadero desde una aplicación sencilla, en el móvil o el ordenador.",
    action: { href: "#catalogo", label: "Explora el catálogo" },
    contact: true,
    note: ["SENSORES EN EL CULTIVO", "información del suelo y del aire"],
  },
  {
    tab: "Las señales",
    eyebrow: "01 / CONOCE TU CULTIVO",
    title: "Lo invisible",
    highlight: "señala.",
    description:
      "¿Está seco el suelo? ¿Hace demasiado calor? Consulta la humedad, la temperatura y la energía del sol que recibe tu cultivo.",
    note: ["SUELO Y AMBIENTE", "consulta cómo cambian con el tiempo"],
  },
  {
    tab: "Las decisiones",
    eyebrow: "02 / DECIDE CON MÁS INFORMACIÓN",
    title: "Entiende.",
    highlight: "Actúa.",
    description:
      "Revisa las gráficas y los avisos para decidir mejor cuándo regar o revisar el ambiente del invernadero.",
    action: { href: "#senal", label: "Ver cómo funciona" },
    note: ["TODO EN UNA APLICACIÓN", "lecturas, gráficas y avisos"],
  },
];

export const nodeSteps = [
  {
    title: "Está cerca del cultivo.",
    description:
      "Los sensores miden la humedad y la temperatura del suelo y las condiciones del aire.",
    emphasis: "Sabes qué ocurre junto a tus plantas.",
  },
  {
    title: "Se conecta con la plataforma.",
    description:
      "Consulta las lecturas, sus gráficas y los avisos desde el móvil o el ordenador.",
  },
  {
    title: "Te dice qué merece atención.",
    description:
      "Los avisos te ayudan a detectar cambios que conviene revisar en el suelo o en el ambiente.",
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
      "Consulta la humedad del suelo antes de decidir cuándo volver a regar.",
    stamp: ["AGUA"],
  },
  {
    category: "suelo",
    title: ["Conoce", "tu suelo."],
    description:
      "Sigue su temperatura, humedad y nivel de sales desde la aplicación.",
    stamp: ["SUELO"],
  },
  {
    category: "riego",
    title: ["Lee el suelo.", "Decide el riego."],
    description:
      "Compara a 15 y 30 cm cuánto les cuesta a las raíces absorber el agua del suelo.",
    stamp: ["RIEGO"],
  },
  {
    category: "control",
    title: ["Tu finca.", "Desde cualquier lugar."],
    description:
      "Revisa las lecturas y los avisos desde el móvil o el ordenador.",
    stamp: ["CONTROL"],
  },
];

export const journeySteps = [
  {
    title: "Instalación y formación",
    description:
      "La compra de cualquiera de nuestros packs incluye la instalación y un año de mantenimiento gratis. El técnico te enseña a usar el sistema el día de la instalación.",
  },
  {
    title: "Conoce lo que ocurre",
    description:
      "Mira las lecturas y las gráficas para entender cómo cambian el suelo y el ambiente.",
  },
  {
    title: "Atención de oficina",
    description:
      "Si tienes dudas, puedes llamar o escribir a la oficina de lunes a viernes, de 8:00 a 16:00.",
  },
];
