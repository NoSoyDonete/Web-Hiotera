// Amplía esta lista para añadir utensilios: no hay que cambiar el componente.
// Solo se incluyen equipos y utensilios confirmados por Hiotera.
export const catalogCategories = ["Todos", "Equipos", "Sensores", "Energía"];
export const catalogItems = [
  {
    id: "libox",
    category: "Equipos",
    name: "LIBOx",
    type: "Conecta los sensores con la aplicación",
    model: { file: "libox-sin-cables.glb", orbit: "28deg 78deg 112%" },
    href: "#nodo",
    action: "Explorar el LIBOx",
    description:
      "Reúne las lecturas de los sensores para que puedas consultar cómo está tu cultivo en la aplicación.",
  },
  {
    id: "meteo",
    category: "Equipos",
    name: "Estación meteorológica",
    type: "Clima exterior",
    model: { file: "estacion-meteo-viva.glb", orbit: "-145deg 68deg 112%" },
    href: "#meteo",
    action: "Explorar la estación",
    description:
      "Mide la temperatura, la humedad, la lluvia, la presión, la radiación y el viento fuera del invernadero.",
  },
  {
    id: "temperature",
    category: "Sensores",
    name: "Sonda de suelo",
    type: "Temperatura, humedad y conductividad",
    model: {
      file: "catalog-models/soil-probe-v2.glb",
      orbit: "25deg 55deg 110%",
    },
    modelNote: "Sonda de suelo",
    href: "#nodo",
    action: "Ver su conexión",
    description:
      "Mide la temperatura, la humedad y la conductividad del suelo, que indica su nivel de sales. Así conoces las condiciones en las que crecen las raíces.",
  },
  {
    id: "tension",
    category: "Sensores",
    name: "Tensiómetros para LIBOx",
    type: "A 15 y 30 cm de profundidad",
    model: {
      file: "catalog-models/tensiometer.glb",
      orbit: "30deg 78deg 112%",
      orientation: "0deg -90deg 0deg",
    },
    href: "#nodo",
    action: "Ver sus conexiones",
    description:
      "Ayudan a saber cuánto les cuesta a las raíces absorber el agua. Comparan el suelo a 15 y 30 cm de profundidad.",
  },
  {
    id: "light",
    category: "Sensores",
    name: "Sensor de radiación",
    type: "Energía solar que recibe el cultivo",
    model: {
      file: "catalog-models/radiation-sensor.glb",
      orbit: "22deg 75deg 112%",
    },
    href: "#nodo",
    action: "Ver su conexión",
    description:
      "Mide la energía del sol que llega al cultivo. Puedes ver cómo cambia durante el día en la aplicación.",
  },
  {
    id: "solar",
    category: "Energía",
    name: "Placa solar",
    type: "Carga del LIBOx",
    model: {
      file: "catalog-models/solar-panel.glb",
      orbit: "-22deg 72deg 112%",
    },
    href: "#nodo",
    action: "Ver la conexión de carga",
    description:
      "Aprovecha la luz del sol para cargar el LIBOx. Se enchufa en el conector situado debajo de la antena.",
  },
  {
    id: "digital-tensiometer",
    category: "Sensores",
    name: "Tensiómetro digital",
    type: "Lectura directa en pantalla",
    model: {
      file: "catalog-models/digital-tensiometer.glb",
      orbit: "25deg 65deg 110%",
      orientation: "0deg -90deg 0deg",
    },
    contact: true,
    action: "Consultar equipo",
    description:
      "Permite consultar en su pantalla la tensión del agua en el suelo: una medida de lo difícil que es para las raíces absorberla.",
  },
  {
    id: "surveillance-cameras",
    category: "Equipos",
    name: "Cámaras de videovigilancia",
    type: "Supervisión de la finca",
    model: {
      file: "catalog-models/camera.glb",
      orbit: "25deg 100deg 112%",
      orientation: "0deg -90deg 0deg",
    },
    contact: true,
    action: "Consultar equipo",
    description:
      "Te permiten ver qué ocurre en la finca y sus instalaciones. Pregúntanos qué opciones se adaptan a lo que necesitas.",
  },
];

export function filterCatalog(category, query, translate = (value) => value) {
  const normalise = (value) =>
    value
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .toLowerCase()
      .trim();
  const search = normalise(query);
  return catalogItems.filter(
    (item) =>
      (category === "Todos" || item.category === category) &&
      normalise(
        `${item.name} ${item.type} ${item.description} ${translate(item.name)} ${translate(item.type)} ${translate(item.description)}`,
      ).includes(search),
  );
}
