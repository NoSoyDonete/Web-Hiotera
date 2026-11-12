// Contenido editable: cada objeto representa una pieza de la página.
export const heroPhases = [
  {
    tab: "El campo",
    eyebrow: "SENSORES PARA INVERNADEROS",
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
    eyebrow: "CONOCE TU CULTIVO",
    title: "Lo invisible",
    highlight: "señala.",
    description:
      "¿Está seco el suelo? ¿Hace demasiado calor? Consulta la humedad, la temperatura y la energía del sol que recibe tu cultivo.",
    note: ["SUELO Y AMBIENTE", "consulta cómo cambian con el tiempo"],
  },
  {
    tab: "Las decisiones",
    eyebrow: "DECIDE CON MÁS INFORMACIÓN",
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
    category: "riego",
    title: ["Riega con", "criterio."],
    description:
      "Mira la humedad del suelo y cuánto les cuesta a las raíces absorber el agua a 15 y 30 cm antes de volver a regar.",
  },
  {
    category: "suelo",
    title: ["Conoce", "tu suelo."],
    description:
      "Sigue la temperatura, la humedad y la conductividad del suelo, que indica su nivel de sales.",
  },
  {
    category: "ambiente",
    title: ["Vigila", "el clima."],
    description:
      "Comprueba cómo cambian el ambiente del invernadero y el tiempo en el exterior.",
  },
  {
    category: "control",
    title: ["Tu finca.", "Desde cualquier lugar."],
    description:
      "Revisa las lecturas y los avisos desde el móvil o el ordenador.",
  },
];

// Lo que incluye la compra. Datos confirmados en los textos de Hiotera.
export const includedItems = [
  {
    title: "Instalación",
    description:
      "Un técnico de Hiotera coloca el LIBOx y los sensores en tu invernadero.",
  },
  {
    title: "Formación",
    description:
      "El mismo día de la instalación te enseñamos a usar la aplicación.",
  },
  {
    title: "1 año de mantenimiento",
    description:
      "Durante el primer año, el mantenimiento de los equipos es gratis.",
  },
  {
    title: "Atención de oficina",
    description:
      "Llámanos o escríbenos de lunes a viernes, de 8:00 a 16:00.",
  },
];

// Solo respuestas confirmadas. Añade aquí nuevas preguntas cuando estén validadas.
export const faqItems = [
  {
    question: "¿Necesito un enchufe en el invernadero?",
    answer:
      "No. El LIBOx se carga con una placa solar que se conecta debajo de su antena.",
  },
  {
    question: "¿Qué mide la sonda de suelo?",
    answer:
      "La temperatura, la humedad y la conductividad del suelo. La conductividad indica su nivel de sales.",
  },
  {
    question: "¿Desde dónde puedo ver los datos?",
    answer:
      "Desde la aplicación de Hiotera, en el móvil o en el ordenador. Cada medida tiene su gráfica histórica.",
  },
  {
    question: "¿Quién instala los equipos?",
    answer:
      "Un técnico de Hiotera. La instalación está incluida y ese mismo día te enseña a usar el sistema.",
  },
  {
    question: "¿Qué pasa si tengo un problema con un equipo?",
    answer:
      "El primer año de mantenimiento es gratis. Además, puedes llamar o escribir a la oficina de lunes a viernes, de 8:00 a 16:00.",
  },
  {
    question: "¿Qué sensores necesita mi finca?",
    answer:
      "Depende de tu cultivo y de lo que quieras controlar. Cuéntanos cómo trabajas y te ayudamos a elegir.",
  },
  {
    question: "¿Puedo probar la aplicación antes?",
    answer:
      "Sí. En esta página tienes una demostración con datos inventados para ver cómo funciona.",
  },
];

export const journeySteps = [
  {
    title: "Cuéntanos qué necesitas",
    description:
      "Llámanos o escríbenos. Te ayudamos a elegir los sensores según tu cultivo y tu finca.",
  },
  {
    title: "Instalamos y te enseñamos",
    description:
      "Un técnico instala los equipos y te enseña a usar la aplicación el mismo día.",
  },
  {
    title: "Consulta tu finca cada día",
    description:
      "Mira las lecturas y las gráficas para ver cómo cambian el suelo y el ambiente.",
  },
];
