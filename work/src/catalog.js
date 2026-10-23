// Amplía esta lista para añadir utensilios: no hay que cambiar el componente.
// Solo se incluyen equipos y utensilios confirmados por Hiotera.
export const catalogCategories = ["Todos", "Equipos", "Sensores", "Energía"];
export const catalogItems = [
  {
    id: "libox",
    category: "Equipos",
    name: "LIBOx",
    type: "Nodo de campo",
    model: { file: "libox-sin-cables.glb", orbit: "28deg 78deg 112%" },
    href: "#nodo",
    action: "Explorar el LIBOx",
    description:
      "El punto de conexión entre las sondas del cultivo y la aplicación de Hiotera.",
  },
  {
    id: "meteo",
    category: "Equipos",
    name: "Estación meteorológica",
    type: "Viento y precipitación",
    model: { file: "estacion-meteo-viva.glb", orbit: "-145deg 68deg 112%" },
    href: "#meteo",
    action: "Explorar la estación",
    description:
      "Anemómetro, veleta, embudo colector y pluviómetro en un mismo conjunto.",
  },
  {
    id: "temperature",
    category: "Sensores",
    name: "Sonda de temperatura",
    type: "Temperatura del suelo",
    model: {
      file: "catalog-models/soil-probe.glb",
      orbit: "18deg 65deg 110%",
      orientation: "180deg 0deg 0deg",
    },
    modelNote: "Modelo del pincho de suelo",
    href: "#nodo",
    action: "Ver su conexión",
    description:
      "Mide la temperatura del suelo y se conecta a la salida inferior izquierda del LIBOx.",
  },
  {
    id: "tension",
    category: "Sensores",
    name: "Tensiómetros",
    type: "A 15 y 30 cm de profundidad",
    model: {
      file: "catalog-models/tensiometer.glb",
      orbit: "30deg 78deg 112%",
      orientation: "0deg -90deg 0deg",
    },
    href: "#nodo",
    action: "Ver sus conexiones",
    description:
      "Dos puntos de lectura de la tensión del agua en el suelo, a distintas profundidades.",
  },
  {
    id: "light",
    category: "Sensores",
    name: "Sensor de radiación",
    type: "Radiación en el cultivo",
    model: {
      file: "catalog-models/radiation-sensor.glb",
      orbit: "22deg 75deg 112%",
    },
    href: "#nodo",
    action: "Ver su conexión",
    description:
      "Mide la radiación que recibe el cultivo y se conecta al cable que sale por la parte superior del LIBOx.",
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
      "Se conecta bajo la antena lateral para suministrar carga al equipo.",
  },
  {
    id: "analog-tensiometers",
    category: "Sensores",
    name: "Tensiómetros analógicos",
    type: "Lectura con manómetro",
    model: null,
    modelNote: "Modelo 3D pendiente de aportar",
    contact: true,
    action: "Consultar equipo",
    description:
      "Lectura directa de la tensión del agua en el suelo mediante un manómetro analógico.",
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
      "Cámaras para supervisar visualmente la finca y sus instalaciones. Consúltanos las opciones disponibles.",
  },
];

export function filterCatalog(category, query) {
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
      normalise(`${item.name} ${item.type} ${item.description}`).includes(
        search,
      ),
  );
}
