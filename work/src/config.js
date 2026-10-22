// Datos compartidos de la marca. Cambia aquí el teléfono, la ubicación y los archivos.
export const site = {
  name: "Hiotera",
  phone: "+34 698 155 496",
  phoneHref: "tel:+34698155496",
  location: "El Ejido · Almería",
  copyright: "© Hiotera 2024",
  modelFile: "sensor-agricola.glb",
  installationPhoto: "libox-invernadero.webp",
};

export const assetUrl = (file) => `${import.meta.env.BASE_URL}${file}`;

// La duración depende de la distancia de scroll; aumenta las alturas en styles.css
// (.hero.sensor-hero) para que el recorrido requiera más vueltas de la rueda.
export const sensorAnimation = {
  introEnd: 0.62,
  smoothingMs: 145,
  revealEnd: 0.14,
  landingStart: 0.96,
  controlsStart: 0.995,
  rotationDegrees: 360,
  initialYaw: -18,
  initialPitch: 77,
  initialRadius: 135,
  finalRadius: 112,
};
