// Contenido editable: cada objeto representa una pieza de la página.
export const heroPhases = [
  {
    tab: "El suelo",
    title: "Tu invernadero,",
    highlight: "en el móvil.",
    description:
      "Ponemos sensores en el suelo y en el invernadero. Tú ves la humedad, la temperatura y las sales en una aplicación, en el móvil o en el ordenador.",
    action: { href: "#catalogo", label: "Ver los sensores" },
    contact: true,
  },
  {
    tab: "El riego",
    title: "Riega cuando",
    highlight: "hace falta.",
    description:
      "La sonda mide la humedad del suelo. Los tensiómetros, a 15 y 30 cm, te dicen cuánto le cuesta a la raíz sacar el agua.",
  },
  {
    tab: "Los avisos",
    title: "Te avisa",
    highlight: "si algo cambia.",
    description:
      "Si una medida se sale de lo normal, la aplicación te avisa y te enseña su gráfica para que veas desde cuándo pasa.",
    action: { href: "#senal", label: "Ver la aplicación" },
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
    title: ["Riego"],
    description:
      "Humedad del suelo y tensión a 15 y 30 cm. Sabes si la raíz tiene agua antes de abrir el riego.",
  },
  {
    category: "suelo",
    title: ["Suelo"],
    description:
      "Temperatura y conductividad. La conductividad te dice cuántas sales se están acumulando.",
  },
  {
    category: "clima",
    title: ["Clima"],
    description:
      "Temperatura, humedad, lluvia, viento y radiación fuera del invernadero, con la estación meteorológica.",
  },
  {
    category: "avisos",
    title: ["Avisos"],
    description:
      "Cuando una medida se sale de lo normal, aparece un aviso en la aplicación con su gráfica.",
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
    title: "Nos cuentas tu finca",
    description:
      "Por teléfono o por escrito. Con lo que cultivas y cómo riegas, te decimos qué sensores tienen sentido.",
  },
  {
    title: "Instalamos y te enseñamos",
    description:
      "Un técnico instala los equipos y te enseña a usar la aplicación el mismo día.",
  },
  {
    title: "Lo miras cuando quieras",
    description:
      "Abres la aplicación y ves las lecturas de hoy y las gráficas de los últimos días.",
  },
];
