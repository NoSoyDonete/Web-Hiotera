# Hiotera · React

Web de Hiotera en React y Vite. El código, el CSS, los modelos 3D y los datos de demostración están separados para facilitar los cambios.

## Recorrido de la web

1. **Inicio:** foto real del invernadero con máscara difuminada sobre negro, órbitas e indicadores. Los tres mensajes se eligen en las pestañas «El campo», «Las señales» y «Las decisiones», con transición suave, clic, toque o teclado (flechas, Inicio y Fin). No hay avance por scroll ni temporizador. La portada ocupa una sección normal, sin retener la pantalla ni reservar tres alturas para los textos; en pantallas pequeñas puede crecer lo necesario para no cortar contenido. No incluye un modelo 3D superpuesto.
2. **El LIBOx:** el nuevo modelo sin cables, justo antes de la meteo. El giro es exclusivamente manual: arrastra para explorarlo o pulsa una conexión para verla de cerca. La rueda desplaza la página, nunca gira el modelo. Los números opacos y de alto contraste muestran las funciones confirmadas por Hiotera.
3. **La meteo:** estación completa, despiece con el scroll (recorrido aproximadamente un 15 % más corto), anemómetro girando, veleta oscilando y tres gotas desde el embudo, a la mitad de velocidad que antes. El botón de pausa detiene viento y lluvia sin bloquear el despiece. La franja «Mide · Interpreta · Recomienda» es estática y muestra las palabras completas.
4. **La aplicación:** seis apartados principales recreados siguiendo las capturas: LIBOx, meteo, cuaderno de campo, fincas, guías y avisos. Los históricos y el creador de gráficas se abren dentro de los apartados, sin añadir pestañas por cada gráfico. Mantiene el menú lateral, cabecera, tarjetas y tablas de estados, selector de equipos, fases e históricos. El lienzo reproduce las proporciones de una pantalla de 1920 × 920 px y se escala al espacio disponible. Las marcas de demostración están fuera de la interfaz para no alterar su composición. No se publican las capturas originales ni se ocultan datos mediante recortes o difuminados.
5. **Impacto:** etiquetas completas de AGUA, SUELO, RIEGO y CONTROL.
6. **Catálogo:** LIBOx, estación meteorológica, sonda de temperatura y humedad, tensiómetros para LIBOx, sensor de radiación, placa solar, tensiómetro digital y cámaras de videovigilancia. Incluye búsqueda, filtros y enlaces para explorar las conexiones. El tensiómetro digital y las cámaras abren la consulta de equipos, sin atribuirles conexiones al LIBOx no confirmadas. La portada enlaza directamente al catálogo con «Explora el catálogo», sin el botón adicional «Descubre la meteo».

El catálogo se amplía desde `src/catalog.js`: añade un objeto a `catalogItems`. No se anuncian existencias, precios ni productos no confirmados. Los ocho productos tienen modelos 3D aportados por el usuario, con giro manual, carga al aproximarse a la vista y ampliación. El usuario confirmó que el modelo con pantalla sustituye a la tarjeta pendiente y debe llamarse «Tensiómetro digital».

La portada y los modelos no muestran rótulos decorativos repetidos ni enlaces de transición al pie de cada sección. Se mantienen los títulos, las explicaciones principales, la navegación y los controles de giro, zoom y ampliación; las instrucciones accesibles de los modelos siguen disponibles para lectores de pantalla.

## Modelos del catálogo

Los modelos nuevos autocontenidos están en `public/catalog-models/`: pincho de suelo, tensiómetro electrónico, sensor de radiación, panel sin bobina de cable y cámara. Se han extraído solo los GLB de los ZIP correspondientes de `outputs`, sin ejecutar programas de esos archivos. El LIBOx sin cables coincide con el ZIP `Hiotera_LIBOx_3D_V2_TODOS_LOS_FORMATOS.zip` y se reutiliza desde `public/libox-sin-cables.glb`. La meteo reutiliza su variante con la etiqueta oficial corregida.

La sonda actualizada usa `Sonda_humedad_sin_texto.glb` de `outputs/Pincho 3D.zip`, copiada como `public/catalog-models/soil-probe-v2.glb`. No incluye textos, marcas ni identificadores. El tensiómetro digital usa `Blumat_Digital_50205_color.glb` de `outputs/Tensiometro Digital 3D.zip`, copiado como `public/catalog-models/digital-tensiometer.glb`; su etiqueta es una textura incluida en el GLB. Solo se extraen los modelos, sin ejecutar programas de los ZIP. Los archivos originales no se modifican.

La versión anterior de la sonda, `soil-probe.glb`, queda conservada junto con su preparador `scripts/prepare-catalog-probe.mjs`, pero ya no se muestra en el catálogo. Las variantes sin cable del panel y del sensor de radiación siguen usando los modelos existentes. El texto de la web explica cada equipo con palabras sencillas; las guías definen las siglas y las unidades sin prometer resultados ni funciones no confirmadas.

## Conexiones confirmadas del LIBOx

- Salida inferior izquierda: sonda de temperatura del suelo.
- Otras dos salidas inferiores: tensiómetros a 15 y 30 cm. No se presupone cuál ocupa el conector central y cuál el derecho.
- Salida superior: sensor de radiación (W/m²).
- Conector debajo de la antena: carga desde la placa solar.
- Pulsador rojo pequeño: reinicio del LIBOx.
- Interruptor I/O: encendido y apagado.

El contenido y los anclajes 3D se editan en `src/libox.js`. El modelo entregado está en `public/libox-sin-cables.glb`, sin modificar. No hay giro automático ni ligado al scroll, independientemente de la preferencia de movimiento reducido.

En móvil el LIBOx se muestra en un recorrido vertical normal, sin superponer el índice al visor. Se gira con el dedo; los botones permiten acercar, alejar y restablecer la vista. Los enlaces de las sondas en el catálogo abren su conexión correspondiente. La muestra de la aplicación conserva su composición de escritorio a escala; en la vista ampliada móvil se puede desplazar horizontalmente para leerla con más detalle.

## Demostración sin datos reales

`src/demoData.js` define la **Finca Demo1**, la persona **Demo1**, el correo reservado **demo1@example.com**, los equipos **LIBOx 000 y 001** y una campaña ficticia de pimiento. El calendario de ejemplo termina el **9 de mayo de 2030 a las 16:00 UTC**. Se generan determinísticamente 721 muestras horarias de 30 parámetros, con variaciones seudoaleatorias. Los indicadores y los históricos comparten las mismas series. Cada parámetro abre su gráfico para 24 horas, 7 días, 30 días o un intervalo personalizado. Como en las capturas, las curvas se superponen con dominios por unidad; el selector de series identifica sus unidades y el cursor muestra sus valores. La banda inferior permite acotar el intervalo.

`src/demoPresentation.js` agrupa las gráficas, define los cinco estados del cultivo y adapta las lecturas del segundo equipo. `src/components/ReplicaIcons.jsx` contiene los iconos y las pequeñas ilustraciones de las fases, recreados en SVG. Estas ilustraciones no son las fotografías originales de las plantas; la interfaz es una reconstrucción, no una captura retocada ni una copia del código de la aplicación de clientes.

El creador permite seleccionar hasta seis medidas y crear hasta tres gráficas temporales dentro de la demo. No conecta con cuentas, no guarda información entre sesiones y no envía datos. Los controles ajenos al recorrido de ejemplo explican su carácter de demostración, sin simular cambios reales de configuración. Las bandas y los estados son ilustrativos, no recomendaciones agronómicas. Las tres capturas antiguas se han retirado de `public/` y se conservan en la carpeta `referencias-privadas` situada fuera del proyecto publicado. Los originales adjuntos del usuario no se modifican. Esto no borra versiones históricas del alojamiento ni del repositorio.

El cuaderno reproduce el resumen de cinco apartados y permite probar personas, equipos y registros con información inventada, solo en memoria. No es un cuaderno oficial ni realiza trámites. Las 22 guías se organizan en cuatro grupos, admiten búsqueda sin tildes y abren una lectura con acceso al histórico correspondiente. Su contenido está en `src/demoResources.js`; las vistas están en `NotebookDemo.jsx` y `GuidesDemo.jsx`.

## Arrancarla en tu ordenador

Necesitas Node.js **22.12 o posterior**, que incluye npm. Abre una terminal en la carpeta de esta aplicación (la que contiene `package.json`) y ejecuta:

```powershell
npm install
npm run dev
```

Abre la dirección que muestre la terminal, normalmente **http://127.0.0.1:5173**. Mantén la terminal abierta. Para detenerla, pulsa Ctrl+C.

En Windows también puedes abrir **INICIAR-WEB.cmd**. Si PowerShell bloquea `npm.ps1`, usa `npm.cmd install` y `npm.cmd run dev`; no necesitas cambiar la política de ejecución. No abras `index.html` con doble clic.

La dirección **http://127.0.0.1:5173/meteo.html** abre la estación meteorológica de forma independiente.

## Dónde cambiar cada cosa

| Archivo                              | Contenido                                                |
| ------------------------------------ | -------------------------------------------------------- |
| `src/App.jsx`                        | Orden de las secciones.                                  |
| `src/components/HeroScene.jsx`       | Portada fotográfica.                                     |
| `src/components/LiboxScene.jsx`      | Visor, puntos y controles del LIBOx.                     |
| `src/libox.js`                       | Funciones, anclajes y encuadres de cada conexión.        |
| `src/components/MeteoScene.jsx`      | Estación meteorológica y su índice.                      |
| `src/hooks/useMeteoScene.js`         | Despiece ligado al scroll.                               |
| `src/meteoPlayback.js`               | Pausa de viento y lluvia.                                |
| `src/meteo.js`                       | Anclajes de la meteo.                                    |
| `src/components/SignalSection.jsx`   | Vistas de demostración, pestañas y ampliación.           |
| `src/components/ApplicationDemo.jsx` | Interfaz recreada, históricos, gráficas y avisos.        |
| `src/demoData.js`                    | Escenario y series completamente ficticios.              |
| `src/application-demo.css`           | Diseño responsive de la aplicación de ejemplo.           |
| `src/catalog.js`                     | Lista de utensilios y categorías del catálogo.           |
| `src/components/CatalogSection.jsx`  | Búsqueda, filtros e ilustraciones del catálogo.          |
| `src/content.js`                     | Textos de impacto y pasos.                               |
| `src/config.js`                      | Teléfono, ubicación, modelo y foto.                      |
| `src/experience.css`                 | Portada, LIBOx, aplicación, catálogo y ajustes de marca. |
| `src/meteo.css`                      | Diseño base de la estación.                              |
| `src/styles.css`                     | Estilos generales y componentes comunes.                 |
| `src/components/HeaderFooter.jsx`    | Navegación, marca y pie.                                 |
| `public/brand/`                      | Iconos oficiales proporcionados por Hiotera.             |
| `public/site.webmanifest`            | Iconos y metadatos para móviles.                         |

`useSensorScene.js` se conserva como referencia del antiguo visor de la portada. Los estilos `.sensor-hero` mantienen el diseño original, sin el modelo superpuesto. `src/hooks/useHeroPhases.js` controla únicamente la selección manual y el teclado de sus pestañas. Portada, LIBOx y resto de secciones bajan en flujo normal; solo la meteo fija su escena mientras el scroll separa las piezas. Se mantiene la barra de navegación habitual.

## Modelo animado de la meteo

Se conserva el original `public/estacion-meteo.glb`. La web utiliza `public/estacion-meteo-viva.glb`, generado con:

```powershell
node scripts/prepare-meteo-motion.mjs
```

Este proceso añade las animaciones y coloca el icono oficial en la etiqueta, corrigiendo sus coordenadas de textura para que no aparezca boca abajo. Las velocidades y la cantidad de gotas están al principio del script. Los modelos son autocontenidos: no necesitan texturas externas.

## Comprobar y publicar en tu alojamiento

```powershell
npm test
npm run build
npm run preview
```

`npm test` comprueba navegación, anclajes, catálogo, recorrido del LIBOx, etiqueta y animaciones de la meteo. La compilación incluye `dist/index.html` y `dist/meteo.html`.

Para alojarla por tu cuenta, sube **el contenido de dist/** manteniendo las carpetas. Son archivos estáticos: el servidor no necesita Node. La configuración admite una subcarpeta. `npm run preview` sirve para comprobar la compilación local, normalmente en **http://127.0.0.1:4173**.

Los modelos, imágenes e iconos están incluidos; las fuentes de Google tienen alternativas del sistema. `package-lock.json` fija las dependencias; `npm ci` reproduce la instalación.

El formulario de contacto sigue en modo demostración: prepara la consulta, pero **no envía mensajes**. Para recibirlos hay que conectar correo o un backend. El enlace de teléfono sí funciona.

Para ver la web desde otro dispositivo de tu misma red puedes usar `npm run dev -- --host 0.0.0.0`. No es necesario exponer tu ordenador a Internet.
