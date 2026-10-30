import { site } from "./config.js";

// Company data checked against the original legal notice. The user confirmed
// that only the customer-facing office moved; the registered office is unchanged.
export const legalDocuments = {
  "aviso-legal": {
    title: "Aviso legal",
    sections: [
      [
        "Titular del sitio",
        [
          "Este sitio web pertenece a Hiotera, S.L., con CIF B04925343. Sus datos de contacto y registro se indican a continuación.",
        ],
      ],
      [
        "Finalidad y uso de la web",
        [
          "Esta web presenta los equipos y servicios de Hiotera. La aplicación que se muestra es una demostración con datos inventados: no está conectada a fincas reales y no controla equipos. El formulario de contacto es de demostración y no envía datos.",
          "El uso de la web debe ser lícito y respetar los derechos de otras personas. No se permite dañar el sitio ni intentar acceder sin autorización a sus sistemas.",
        ],
      ],
      [
        "Propiedad intelectual",
        [
          "La marca Hiotera y los contenidos de la web pertenecen a sus titulares. Se permite su consulta para uso personal. Su reutilización comercial requiere la autorización correspondiente.",
        ],
      ],
      [
        "Disponibilidad y enlaces",
        [
          "La información puede actualizarse o contener errores. Los enlaces externos, como el mapa y el manual, llevan a servicios con sus propias condiciones. Estas condiciones no limitan los derechos que la ley reconoce a las personas consumidoras.",
        ],
      ],
      [
        "Normativa aplicable",
        [
          "El uso de este sitio se rige por la legislación española y por las normas de protección de datos que resulten aplicables, incluido el Reglamento (UE) 2016/679 y la Ley Orgánica 3/2018. Los conflictos se someterán a los órganos competentes conforme a la normativa, respetando los derechos de las personas consumidoras.",
        ],
      ],
    ],
  },
  privacidad: {
    title: "Política de privacidad",
    sections: [
      [
        "Responsable y contacto",
        [
          "El responsable es Hiotera, S.L., CIF B04925343. Para consultas sobre privacidad o para ejercer tus derechos puedes escribir a dpd@hiotera.com. El domicilio legal y la oficina de atención son direcciones distintas y se muestran en esta página.",
        ],
      ],
      [
        "Datos que se utilizan en esta demostración",
        [
          "Los nombres, las fechas y las lecturas de la aplicación de ejemplo son inventados. El formulario no envía ni guarda su contenido en nuestros servidores. Evita introducir información sensible o datos de otras personas.",
          "Si eliges un idioma, la web puede recordar únicamente esa preferencia en tu navegador. No se incorpora información del formulario a esta preferencia. El alojamiento puede tratar datos técnicos de conexión para entregar y proteger el sitio.",
        ],
      ],
      [
        "Cuando contactas con la oficina",
        [
          "Si nos llamas o nos escribes por correo, utilizaremos los datos que nos facilites para responder a tu consulta y, cuando lo solicites, gestionar una relación comercial o un servicio. La base jurídica será la gestión de tu solicitud, las medidas precontractuales o el contrato, según corresponda. Las comunicaciones comerciales que requieran consentimiento se tratarán por separado.",
        ],
      ],
      [
        "Conservación y destinatarios",
        [
          "Las consultas recibidas por teléfono o correo se conservarán mientras sean necesarias para atenderlas y, en su caso, durante los plazos exigidos para cumplir obligaciones legales o atender responsabilidades. No se venden datos personales.",
          "El proveedor de alojamiento y los proveedores necesarios para las comunicaciones pueden intervenir en la prestación del servicio. Si utilizas un enlace externo, como Google Maps, se aplicarán también las condiciones de ese proveedor. El mapa no está incrustado: solo se abre cuando pulsas el enlace.",
        ],
      ],
      [
        "Tus derechos",
        [
          "Puedes solicitar acceso, rectificación, supresión, oposición, limitación o portabilidad de tus datos cuando corresponda, así como retirar un consentimiento previamente otorgado. Escribe a dpd@hiotera.com o al domicilio legal. Solo se solicitará información adicional de identificación cuando sea necesaria.",
          "También puedes presentar una reclamación ante la Agencia Española de Protección de Datos, en www.aepd.es.",
        ],
      ],
      [
        "Alcance de esta información",
        [
          "Esta información describe esta web de presentación y demostración. No sustituye las condiciones específicas de una cuenta de cliente, de una instalación contratada o de la aplicación de producción. Antes de activar el envío del formulario, analítica u otros servicios se deberá actualizar la información correspondiente.",
        ],
      ],
    ],
  },
  cookies: {
    title: "Política de cookies",
    sections: [
      [
        "Cookies y almacenamiento del navegador",
        [
          "Las cookies y mecanismos similares permiten guardar información en el navegador. Esta web no incorpora herramientas de analítica publicitaria, píxeles de seguimiento ni cookies de marketing añadidas por Hiotera.",
        ],
      ],
      [
        "Preferencia de idioma",
        [
          "Cuando seleccionas un idioma guardamos el código elegido, como es, en, fr o de, en el almacenamiento local del navegador con el nombre hiotera-language. Su única finalidad es recordar tu elección. Permanece hasta que lo borres o el navegador elimine sus datos; no se utiliza para publicidad ni para elaborar perfiles.",
          "Puedes seguir usando la web si tu navegador bloquea este almacenamiento. También puedes borrar la preferencia con el botón de esta página o desde los ajustes del navegador.",
        ],
      ],
      [
        "Servicios técnicos y enlaces externos",
        [
          "El alojamiento puede utilizar mecanismos técnicos de sesión y seguridad para permitir el acceso y proteger el servicio. Las fuentes y los modelos de esta web se sirven desde el propio sitio. Google Maps y el manual solo se abren al pulsar sus enlaces y pueden aplicar sus propias políticas.",
        ],
      ],
      [
        "Sin banner de aceptación innecesario",
        [
          "No se solicita aceptar cookies publicitarias que esta web no utiliza. Si en el futuro se añaden tecnologías que requieran consentimiento, deberán permanecer desactivadas hasta que puedas aceptar, rechazar o configurar su uso.",
        ],
      ],
      [
        "Más información",
        [
          "Para consultas sobre esta política puedes escribir a contacto@hiotera.com. La guía de la Agencia Española de Protección de Datos explica el uso de cookies y tecnologías similares.",
        ],
      ],
    ],
  },
};
export const legalIdentity = [
  ["Razón social", site.company],
  ["CIF", site.taxId],
  ["Domicilio legal", site.registeredAddress],
  ["Registro mercantil", site.registry],
  ["Oficina de atención", site.officeAddress],
  ["Correo de contacto", site.email],
  ["Protección de datos", site.privacyEmail],
  ["Teléfono", site.phone],
];
