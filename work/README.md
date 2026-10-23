# Hiotera · React

Web de Hiotera en React y Vite. El código, el CSS, los modelos 3D y los datos de demostración están separados para facilitar los cambios.

## Recorrido de la web

1. **Inicio:** se conserva la composición original: foto real del invernadero con máscara difuminada sobre negro, órbitas, indicadores y los tres textos del recorrido. Solo se ha retirado el modelo 3D superpuesto; la foto permanece visible desde el primer momento.
2. **El LIBOx:** el nuevo modelo sin cables, justo antes de la meteo. El giro es exclusivamente manual: arrastra para explorarlo o pulsa una conexión para verla de cerca. La rueda desplaza la página, nunca gira el modelo. Los números opacos y de alto contraste muestran las funciones confirmadas por Hiotera.
3. **La meteo:** estación completa, despiece con el scroll (recorrido aproximadamente un 15 % más corto), anemómetro girando, veleta oscilando y tres gotas desde el embudo, a la mitad de velocidad que antes. El botón de pausa detiene viento y lluvia sin bloquear el despiece. La franja «Mide · Interpreta · Recomienda» es estática y muestra las palabras completas.
4. **La aplicación:** siete vistas recreadas en React a partir de las referencias de Hiotera: resumen, ambiente y radiación, humedad y tensión, temperatura del suelo, meteorología, creación de gráficas y avisos. Todos los nombres, equipos, fechas, fases, lecturas y curvas pertenecen a un escenario ficticio y llevan la marca «Datos simulados». No se publican las capturas originales ni se ocultan datos mediante recortes o difuminados.
5. **Impacto:** etiquetas completas de AGUA, SUELO, RIEGO y CONTROL.
6. **Catálogo:** LIBOx, estación meteorológica, sonda de temperatura, tensiómetros, sensor de radiación, placa solar, tensiómetros analógicos y cámaras de videovigilancia. Incluye búsqueda, filtros y enlaces para explorar las conexiones. Los dos nuevos utensilios abren la consulta de equipos, sin atribuirles conexiones al LIBOx no confirmadas. La portada enlaza directamente al catálogo con «Explora el catálogo», sin el botón adicional «Descubre la meteo».

El catálogo se amplía desde `src/catalog.js`: añade un objeto a `catalogItems`. No se anuncian existencias, precios ni productos no confirmados. Sus dibujos se han sustituido por siete modelos 3D aportados en `outputs`, con giro manual, carga al aproximarse a la vista y ampliación. El tensiómetro analógico queda sin modelo, pendiente del archivo correcto, por decisión del usuario.

## Modelos del catálogo

Los modelos nuevos autocontenidos están en `public/catalog-models/`: pincho de suelo, tensiómetro electrónico, sensor de radiación, panel sin bobina de cable y cámara. Se han extraído solo los GLB de los ZIP correspondientes de `outputs`, sin ejecutar programas de esos archivos. El LIBOx sin cables coincide con el ZIP `Hiotera_LIBOx_3D_V2_TODOS_LOS_FORMATOS.zip` y se reutiliza desde `public/libox-sin-cables.glb`. La meteo reutiliza su variante con la etiqueta oficial corregida.

`PINCHO_modelo_color.glb` y el GLB de `LIBOx 3D.zip` contienen la misma sonda de suelo, no el nodo de comunicaciones. El preparador `scripts/prepare-catalog-probe.mjs` conserva su forma y logotipo, pero elimina el marcado MAC y los buffers de sus letras en la copia pública. No modifica el original. Las variantes sin cable del panel y del sensor de radiación ofrecen un encuadre más claro. No se ha usado un modelo electrónico para representar el tensiómetro analógico.

## Conexiones confirmadas del LIBOx

- Salida inferior izquierda: sonda de temperatura del suelo.
- Otras dos salidas inferiores: tensiómetros a 15 y 30 cm. No se presupone cuál ocupa el conector central y cuál el derecho.
- Salida superior: sensor de radiación (W/m²).
- Conector debajo de la antena: carga desde la placa solar.
- Pulsador rojo pequeño: reinicio del LIBOx.
- Interruptor I/O: encendido y apagado.

El contenido y los anclajes 3D se editan en `src/libox.js`. El modelo entregado está en `public/libox-sin-cables.glb`, sin modificar. No hay giro automático ni ligado al scroll, independientemente de la preferencia de movimiento reducido.

En móvil el LIBOx se muestra en un recorrido vertical normal, sin superponer el índice al visor. Se gira con el dedo; los botones permiten acercar, alejar y restablecer la vista. Los enlaces de las sondas en el catálogo abren su conexión correspondiente. Las vistas de la aplicación se adaptan al móvil; los gráficos admiten desplazamiento horizontal para conservar la legibilidad.

## Demostración sin datos reales

`src/demoData.js` define el **Invernadero Aurora**, el equipo **DEMO-07**, una campaña ficticia de tomate cherry y un calendario de ejemplo que termina el **9 de mayo de 2030 a las 16:00 UTC**. Se generan determinísticamente 721 muestras horarias de 30 parámetros. Los indicadores, históricos y avisos comparten estas mismas series. Cada parámetro puede abrir su gráfico para 24 horas, 7 días o 30 días. Las unidades diferentes se representan en paneles separados.

El creador permite seleccionar hasta seis medidas y mostrar una vista previa. No conecta con cuentas, no guarda información y no envía datos. Las bandas y los estados son ilustrativos, no recomendaciones agronómicas. Las tres capturas antiguas se han retirado de `public/` y se conservan en la carpeta `referencias-privadas` situada fuera del proyecto publicado. Los originales adjuntos del usuario no se modifican. Esto no borra versiones históricas del alojamiento ni del repositorio.

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

`useSensorScene.js` se conserva como referencia del antiguo visor de la portada. Los estilos `.sensor-hero` vuelven a usarse para mantener el diseño original, sin el modelo superpuesto. `src/hooks/useHeroPhases.js` sincroniza únicamente sus textos con el scroll.

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
