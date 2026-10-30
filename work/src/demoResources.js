// Content and records for the fictional, account-free application walkthrough.
export const guideSections = [
  {
    id: "measurements",
    title: "Qué mide tu LIBOx",
    description: "Qué mide cada sensor y cómo entender sus lecturas.",
  },
  {
    id: "decisions",
    title: "Decisiones de cultivo",
    description:
      "Riego, ventilación, sombreo: cómo se usan los datos para decidir.",
  },
  {
    id: "greenhouse",
    title: "El invernadero por dentro",
    description:
      "Conoce las cubiertas, las mallas y los sistemas de ventilación.",
  },
  {
    id: "glossary",
    title: "Glosario",
    description: "Los términos que aparecen en la app.",
  },
];

const entries = [
  [
    "conductivity",
    "Conductividad y salinidad",
    "Ayuda a conocer la cantidad de sales que hay en el suelo.",
    "ec1",
    "La conductividad eléctrica ayuda a conocer la cantidad de sales disueltas en el suelo. No indica qué sales son. Para entender la lectura hay que tener en cuenta también la humedad, la temperatura y el tipo de sensor.",
  ],
  [
    "deficit",
    "Déficit de humedad",
    "Indica cuánto vapor de agua le falta al aire para llegar a su máximo.",
    "deficit",
    "El aire puede contener una cantidad de vapor de agua que depende de su temperatura. Esta medida indica cuánto le falta para llegar a ese máximo. Se muestra en gramos por metro cúbico (g/m³). La gráfica permite seguir sus cambios durante el día.",
  ],
  [
    "co2",
    "Dióxido de carbono",
    "Es un gas del aire que la planta utiliza para crecer.",
    "co2",
    "El dióxido de carbono, o CO₂, es un gas que las plantas utilizan para crecer. Su cantidad en el aire cambia, entre otras cosas, con la ventilación y la actividad de las plantas. La aplicación lo muestra en partes por millón (ppm).",
  ],
  [
    "device",
    "Estado del LIBOx",
    "Comprueba la batería, la conexión y cuándo llegó la última lectura.",
    null,
    "La batería indica la carga que queda. La cobertura muestra cómo está la conexión. La hora de la última lectura permite saber si siguen llegando datos. Si una lectura no se actualiza, estos tres datos ayudan a revisar qué ocurre con el equipo.",
  ],
  [
    "moisture",
    "Humedad del suelo",
    "Muestra cuánta agua hay en el suelo junto al sensor.",
    "moisture1",
    "La sonda mide la humedad del suelo que la rodea. Sirve para observar cómo cambia después de regar y mientras el suelo se seca. Dos sensores pueden dar lecturas distintas porque están en lugares o profundidades diferentes.",
  ],
  [
    "humidity",
    "Humedad relativa",
    "Indica lo húmedo que está el aire a la temperatura actual.",
    "humidity",
    "La humedad relativa se muestra como un porcentaje. Compara el vapor de agua que hay en el aire con el máximo que podría contener a esa temperatura. Conviene mirar también la temperatura: si esta cambia, el porcentaje de humedad puede cambiar.",
  ],
  [
    "rain",
    "Lluvia",
    "Consulta cuánta lluvia ha caído y en qué momento.",
    "rain",
    "La estación mide la lluvia en milímetros (mm). La aplicación permite consultar lo que ha llovido en un período y el total del día o del año. Las gráficas de esta demostración usan episodios de lluvia inventados.",
  ],
  [
    "pressure",
    "Presión atmosférica",
    "Una medida del aire que ayuda a observar los cambios del tiempo.",
    "pressure",
    "La presión atmosférica es la presión que ejerce el aire. Se muestra en hectopascales (hPa). Sus cambios ayudan a observar cómo evoluciona el tiempo, aunque una lectura por sí sola no permite saber qué tiempo hará.",
  ],
  [
    "dew",
    "Punto de rocío",
    "La temperatura a la que el vapor del aire puede empezar a formar gotas.",
    "dew",
    "Si el aire se enfría lo suficiente, parte del vapor de agua puede convertirse en gotas. El punto de rocío indica esa temperatura. Ayuda a entender por qué aparecen gotas en una cubierta o en otras superficies frías.",
  ],
  [
    "radiation",
    "Radiación y luz",
    "Mide la energía del sol que llega al cultivo.",
    "radiation",
    "Este sensor mide la energía del sol que llega al cultivo. La aplicación la muestra en vatios por metro cuadrado (W/m²). Su gráfica permite ver las diferencias entre el día y la noche y los cambios de energía que recibe el cultivo.",
  ],
  [
    "vpd",
    "Sequedad del aire (DPV)",
    "Combina temperatura y humedad para entender lo seco que está el aire.",
    "vpd",
    "El DPV, o déficit de presión de vapor, combina la temperatura y la humedad del aire. Ayuda a entender la facilidad con la que la planta pierde agua a través de las hojas. Se muestra en kilopascales (kPa) y se interpreta según el cultivo y sus condiciones.",
  ],
  [
    "air",
    "Temperatura del aire",
    "Permite seguir el calor y el frío en el punto donde está el sensor.",
    "air",
    "El sensor mide la temperatura del aire que lo rodea, en grados Celsius (°C). La gráfica permite ver cuándo sube o baja y comparar distintos momentos del día. Puedes consultar la humedad al mismo tiempo para entender mejor el ambiente.",
  ],
  [
    "soil",
    "Temperatura del suelo",
    "Muestra la temperatura en la zona donde crecen las raíces.",
    "soil",
    "La temperatura del suelo no tiene por qué ser igual a la del aire. Los sensores permiten medirla en distintos puntos y profundidades. Compara sus gráficas, en grados Celsius (°C), para ver dónde cambia antes y dónde se mantiene más estable.",
  ],
  [
    "tension",
    "Tensiómetros",
    "Ayudan a saber cuánto les cuesta a las raíces absorber el agua del suelo.",
    "tension15",
    "El tensiómetro mide cuánto cuesta extraer el agua del suelo. En la aplicación se expresa en centibares (cbar): no es un porcentaje de humedad. Las gráficas a 15 y 30 cm permiten comparar lo que ocurre a ambas profundidades.",
  ],
  [
    "wind",
    "Viento",
    "Comprueba la velocidad, las rachas y la dirección del viento.",
    "wind",
    "La estación indica a qué velocidad sopla el viento, sus rachas y de dónde viene. Una racha es un aumento breve de velocidad. La velocidad se muestra en kilómetros por hora (km/h) y la dirección en grados.",
  ],
  [
    "irrigation",
    "Cuándo y cuánto regar",
    "Observa cómo responde el suelo antes y después del riego.",
    "moisture1",
    "Compara las gráficas de humedad y de los tensiómetros para ver cómo responde el suelo al riego. Esta demostración usa datos inventados: muestra cómo consultar las medidas, pero no calcula cuánto debes regar en una finca real.",
  ],
  [
    "shade",
    "Sombreo y encalado",
    "Entiende cómo las cubiertas de sombra cambian la luz que entra.",
    "radiation",
    "El sombreo y el encalado reducen parte de la luz del sol que entra en el invernadero. Compara las medidas de radiación interior y exterior para observar esa diferencia. La solución adecuada depende del cultivo y de la instalación.",
  ],
  [
    "ventilation",
    "Ventilar con criterio",
    "Comprueba cómo cambia el ambiente al renovar el aire.",
    "humidity",
    "Ventilar renueva el aire del invernadero. Puedes observar sus efectos en las gráficas de temperatura, humedad y CO₂. Esta demostración solo permite consultar datos: no abre ventanas ni controla equipos reales.",
  ],
  [
    "screens",
    "Pantallas, mallas y plásticos",
    "Conoce para qué se usan las distintas cubiertas del invernadero.",
    null,
    "Las cubiertas, las mallas y las pantallas pueden cambiar la luz, el paso del aire o la pérdida de calor. Sus funciones dependen del material y de cómo se instalen. Las lecturas de los sensores ayudan a observar el ambiente resultante.",
  ],
  [
    "systems",
    "Sistemas de ventilación",
    "Diferencias entre ventilar por el techo, por los laterales o de forma automática.",
    null,
    "La ventilación cenital utiliza aperturas en el techo; la lateral, en los lados. Una instalación preparada puede abrirlas automáticamente. Esta aplicación de ejemplo muestra las lecturas del ambiente, pero no controla esas aperturas.",
  ],
  [
    "types",
    "Tipos de invernadero",
    "Conoce las diferencias entre las estructuras y sus cubiertas.",
    null,
    "La forma de la estructura, las cubiertas y las aperturas influyen en cómo entra la luz y se renueva el aire. Finca Demo1 es un ejemplo inventado: no corresponde a una ubicación real ni representa un tipo concreto de invernadero.",
  ],
  [
    "glossary",
    "Glosario",
    "Las palabras de la aplicación, explicadas de forma sencilla.",
    null,
    "LIBOx: equipo que reúne las lecturas de los sensores. DPV: medida que combina temperatura y humedad del aire. CO₂: dióxido de carbono, un gas que utiliza la planta. CE: medida relacionada con las sales del suelo. Histórico: gráfica de cómo cambia una medida con el tiempo. Racha: aumento breve de la velocidad del viento. Punto de control: lugar de la finca donde se toman medidas.",
  ],
];

export const demoGuides = entries.map(
  ([id, title, summary, metric, body], index) => ({
    id,
    title,
    summary,
    metric,
    body,
    section:
      index < 15
        ? "measurements"
        : index < 18
          ? "decisions"
          : index < 21
            ? "greenhouse"
            : "glossary",
  }),
);
const normalize = (value) =>
  value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLocaleLowerCase("es")
    .trim();
export const matchingGuides = (query) =>
  demoGuides.filter((guide) =>
    normalize(`${guide.title} ${guide.summary}`).includes(normalize(query)),
  );
