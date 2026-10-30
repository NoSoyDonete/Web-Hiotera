// Datos compartidos de la marca. Cambia aquí el teléfono, la ubicación y los archivos.
export const site = {
  name: "Hiotera",
  phone: "+34 698 155 496",
  phoneHref: "tel:+34698155496",
  location: "El Ejido · Almería",
  officeAddress: "Av. de Nicolás Salmerón, 69, 04700 El Ejido, Almería",
  officeMap:
    "https://www.google.com/maps/search/?api=1&query=Av.%20de%20Nicol%C3%A1s%20Salmer%C3%B3n%2069%2C%2004700%20El%20Ejido%2C%20Almer%C3%ADa",
  email: "contacto@hiotera.com",
  privacyEmail: "dpd@hiotera.com",
  company: "Hiotera, S.L.",
  taxId: "B04925343",
  registeredAddress: "Bulevar, 465, 23 A, 04700 El Ejido, Almería, España",
  registry:
    "Registro Mercantil de Almería, tomo 2027, folio 128, inscripción 1.ª, hoja AL-51829",
  copyright: "© Hiotera 2026",
  modelFile: "libox-sin-cables.glb",
  installationPhoto: "libox-invernadero.webp",
};

export const assetUrl = (file) => `${import.meta.env.BASE_URL}${file}`;

// La duración depende de la distancia de scroll; aumenta las alturas en styles.css
// (.hero.sensor-hero) para que el recorrido requiera más vueltas de la rueda.
export const sensorAnimation = {
  rotationEnd: 0.75,
  smoothingMs: 145,
  rotationDegrees: 360,
  initialYaw: -18,
  pitch: 77,
  radius: 112,
};
