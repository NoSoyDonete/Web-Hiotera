# Hiotera · React

Web completa de Hiotera migrada a React y Vite, con el modelo LIBOx en 3D controlado por el scroll, diseño adaptable, modo escáner y las pestañas de la demostración.

El LIBOx aparece al cargar la portada, junto al texto y el radar, y completa un
giro de 360° al desplazarse. Conserva su posición y tamaño durante todo el giro.
Justo después del LIBOx, la sección **La meteo** integra la estación meteorológica original:
al bajar se separan sus siete conjuntos y al subir vuelven a montarse. El
miniíndice destaca solo los cuatro primeros: anemómetro, veleta, embudo y
pluviómetro. Los soportes y la garita forman parte del modelo completo. Las
etiquetas siguen las piezas; pulsa sus nombres o los puntos numerados para
conocer su función. Los botones **Montada** y **Despiece** permiten recorrer la
secuencia también con el teclado. En móvil, los números corresponden a la
lista de nombres situada bajo el modelo.

La dirección **http://127.0.0.1:5173/meteo.html** abre directamente la misma
estación en React, con su despiece al bajar y sin pasar por la portada del LIBOx.
Esta vista se incluye también en la compilación `dist/meteo.html`.

El enlace **La meteo** está visible también en móvil. Abrir directamente la URL
con `#meteo` desplaza a la estación después de montar React; la navegación
recalcula la posición si cambia el diseño y deja de corregirla en cuanto el
usuario empieza a desplazarse manualmente.

`npm test` comprueba la navegación directa, los enlaces a secciones y la
restauración de su posición cuando cambian las fuentes o el diseño.

El modelo completo de la web está en `public/estacion-meteo.glb`, con sus
materiales y animación incluidos. La cámara inicial está más alejada y
centrada para encuadrar la estación montada y en despiece.
`src/components/MeteoScene.jsx` compone la sección,
`src/hooks/useMeteoScene.js` sincroniza la animación con el scroll,
`src/meteo.js` conserva nombres y anclajes, y `src/meteo.css` define su diseño.
Se reutiliza el visor 3D instalado, sin añadir dependencias. `dist/` se mantiene
en el repositorio como copia compilada, igual que en la entrega original.

Se puede girar el LIBOx y la estación en cualquier momento arrastrando sobre
ellos. En la estación, el botón derecho permite desplazar la vista y los
botones **+**, **−** y **↺** acercan, alejan y restablecen la cámara. La rueda y
el desplazamiento vertical siguen controlando el recorrido y el despiece.

## Arrancarla en tu ordenador

1. Instala **Node.js 24 LTS**, que incluye npm, desde [nodejs.org](https://nodejs.org/). Si ya tienes Node, utiliza al menos la versión 22.12.
2. Abre una terminal en esta carpeta. En tu instalación actual de Windows puedes usar:

   ```powershell
   cd "C:\Users\dANIEL\Documents\ChatGPT\Hiotera\work"
   ```

3. Instala las dependencias la primera vez:

   ```powershell
   npm install
   ```

4. Inicia la web:

   ```powershell
   npm run dev
   ```

5. Abre **http://localhost:5173**. Si ese puerto está ocupado, Vite indicará otro en la terminal. Mantén la terminal abierta. Pulsa **Ctrl+C** para detener el servidor.

En Windows también puedes hacer doble clic en **INICIAR-WEB.cmd**. Comprueba Node, instala lo necesario la primera vez y abre la web. Si PowerShell bloquea `npm.ps1`, usa `npm.cmd install` y `npm.cmd run dev`; no necesitas cambiar la política de ejecución.

No abras `index.html` con doble clic: el proyecto necesita el servidor de Vite para cargar sus módulos y el 3D.

## Dónde cambiar cada cosa

| Archivo                              | Qué puedes modificar                                          |
| ------------------------------------ | ------------------------------------------------------------- |
| `src/App.jsx`                        | Orden y composición de las secciones.                         |
| `src/content.js`                     | Textos de la portada, pasos, tarjetas y valores de la demo.   |
| `src/config.js`                      | Teléfono, ubicación, archivos del modelo y ajustes del giro.  |
| `src/styles.css`                     | Colores, fuentes, tamaños, distribución y adaptación a móvil. |
| `src/components/HeroScene.jsx`       | Portada y presentación del LIBOx.                             |
| `src/hooks/useSensorScene.js`        | Trayectoria, tamaño y sincronización del 3D con el scroll.    |
| `src/components/ContentSections.jsx` | Secciones de presentación, producto, impacto y cierre.        |
| `src/components/SignalSection.jsx`   | Pestañas, lecturas y gráfica de demostración.                 |
| `src/components/HeaderFooter.jsx`    | Navegación y pie de página.                                   |
| `src/components/ContactDialog.jsx`   | Formulario y ventana de contacto.                             |
| `public/`                            | Modelo `.glb` e imágenes originales.                          |

Guarda un archivo de `src/` y verás el cambio en el navegador. El CSS se conserva separado de los componentes. Puedes ordenar el formato del código con `npm run format`.

Para hacer el giro más lento, aumenta la altura `.hero.sensor-hero` en `src/styles.css` (actualmente `280svh` en escritorio y `270svh` en móvil). En `src/config.js`, `smoothingMs` regula la suavidad y `rotationDegrees` el ángulo total. El movimiento permanece ligado a la rueda o al gesto de desplazamiento, y respeta la preferencia de movimiento reducido.

## Versión preparada para publicar

```powershell
npm run build
npm run preview
```

El primer comando genera la web optimizada en **dist/**. El segundo permite revisarla en **http://localhost:4173**. Para publicarla en un alojamiento propio, sube **el contenido de dist/**, manteniendo sus carpetas. El servidor no necesita Node: el resultado son archivos estáticos. La configuración también permite alojarla dentro de una subcarpeta.

`npm run dev` sirve para editar; `npm run preview` sirve para comprobar la compilación local. Para un dominio público usa un alojamiento web de archivos estáticos. No es necesario exponer tu ordenador a Internet.

Para verla desde otro dispositivo de tu misma red, puedes ejecutar `npm run dev -- --host 0.0.0.0` y abrir la dirección de red que muestra Vite. Esta opción solo es necesaria si quieres compartir la vista previa en tu red local.

## Qué funciona sin servidor adicional

La escena 3D, el scroll, el escáner, la navegación, las pestañas y el contacto por teléfono funcionan en local. El modelo y el visor 3D se incluyen en el proyecto; las fuentes de Google tienen alternativas del sistema si no hay conexión.

Los números del panel son una demostración. El formulario todavía no tiene un servicio de envío conectado: prepara una consulta local y lo indica en pantalla, sin afirmar que haya enviado datos. Para recibir mensajes reales hay que conectar el componente `ContactDialog.jsx` con un servicio de correo o un backend.

El archivo `package-lock.json` fija las versiones resueltas. En otra instalación puedes usar `npm ci` para reproducirlas exactamente.
