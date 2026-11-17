---
name: Hiotera
description: Sensores para invernadero y una aplicación para ver el suelo y el clima desde el móvil.
colors:
  noche-invernadero: "#0b1c17"
  bosque: "#12372a"
  verde-senal: "#d9ff58"
  menta: "#a9ebc1"
  verde-hoja: "#69c98e"
  tierra-roja: "#ff7252"
  crema-campo: "#eef1e7"
  papel: "#fbfaf5"
  salvia-clara: "#e8eddf"
  verde-app: "#10281f"
typography:
  display:
    fontFamily: "Space Grotesk, sans-serif"
    fontSize: "clamp(4.2rem, 8.5vw, 9.1rem)"
    fontWeight: 500
    lineHeight: 0.82
    letterSpacing: "-0.115em"
  headline:
    fontFamily: "Space Grotesk, sans-serif"
    fontSize: "clamp(3rem, 6vw, 7rem)"
    fontWeight: 600
    lineHeight: 0.88
    letterSpacing: "-0.09em"
  title:
    fontFamily: "Space Grotesk, sans-serif"
    fontSize: "clamp(1.7rem, 1.9vw, 2.3rem)"
    fontWeight: 600
    lineHeight: 1
    letterSpacing: "-0.05em"
  body:
    fontFamily: "Manrope, system-ui, sans-serif"
    fontSize: "1.05rem"
    fontWeight: 400
    lineHeight: 1.6
  label:
    fontFamily: "DM Mono, monospace"
    fontSize: "0.94rem"
    fontWeight: 400
    letterSpacing: "0.13em"
rounded:
  field: "11px"
  card: "20px"
  panel: "26px"
  pill: "999px"
spacing:
  gutter: "3vw"
  section-y: "150px"
  card-pad: "30px"
  gap-sm: "12px"
  gap-md: "16px"
components:
  button-primary:
    backgroundColor: "{colors.verde-senal}"
    textColor: "{colors.noche-invernadero}"
    rounded: "{rounded.pill}"
    padding: "0 19px"
    height: "47px"
  button-primary-hover:
    backgroundColor: "{colors.crema-campo}"
  button-dark:
    backgroundColor: "{colors.noche-invernadero}"
    textColor: "{colors.papel}"
    rounded: "{rounded.pill}"
    padding: "0 19px"
    height: "47px"
  button-dark-hover:
    backgroundColor: "{colors.verde-senal}"
    textColor: "{colors.noche-invernadero}"
  button-outline-on-dark:
    textColor: "{colors.crema-campo}"
    rounded: "{rounded.pill}"
    padding: "0 19px"
    height: "47px"
  card-measure:
    backgroundColor: "{colors.menta}"
    textColor: "{colors.noche-invernadero}"
    rounded: "{rounded.card}"
    padding: "30px"
  input-field:
    backgroundColor: "{colors.papel}"
    textColor: "{colors.noche-invernadero}"
    rounded: "{rounded.field}"
    padding: "13px 14px"
  nav-bar:
    backgroundColor: "{colors.noche-invernadero}"
    textColor: "{colors.crema-campo}"
    rounded: "{rounded.card}"
---

# Design System: Hiotera

## Overview

**Creative North Star: "La sonda en el suelo"**

Hiotera es un instrumento de medida que vive en la tierra del invernadero. La web se diseña como esa sonda: precisa en lo que dice y en cómo lo muestra, con los equipos en 3D como protagonistas y los datos escritos con números claros. La precisión no es frialdad: el carácter confirmado es **cercano y tranquilo**. Se habla de tú, se deja aire alrededor de cada bloque y el contraste fuerte se reserva para lo que importa.

El sistema actual alterna bloques a sangre de color tierra-noche (verde casi negro) y de crema de campo, con el **Verde Señal** como la luz del sensor: marca la acción principal y el dato que hay que mirar. Los títulos son muy grandes y apretados (Space Grotesk), el texto de lectura es Manrope y los rótulos técnicos van en DM Mono. En escritorio toda la página se dibuja al 90 % (`--zoom: 0.9` desde 1200 px) y las unidades de ventana se compensan para que las secciones de pantalla completa sigan llenándola.

Dirección confirmada para el trabajo nuevo: componentes **firmes, de herramienta** (esquinas más cortas, bordes marcados) y algo de relieve en lo que se puede tocar. Hoy botones y tarjetas son píldoras y esquinas de 20 px; esa diferencia es una deriva conocida que se corrige poco a poco, no un motivo para mezclar estilos en un mismo bloque.

**Key Characteristics:**
- Bloques a sangre que alternan noche de invernadero y crema de campo.
- Verde Señal escaso: acción principal, dato activo y nada más.
- Títulos enormes con interlineado cerrado; texto de lectura amplio y con buen contraste.
- Los equipos se enseñan en 3D, girables, en el mismo encuadre circular.
- Sin rótulos decorativos encima de los títulos ni numeraciones de adorno.

## Colors

Una paleta de invernadero: tierra casi negra, verdes vivos de planta y señal, y cremas de papel al sol.

### Primary
- **Verde Señal** (`verde-senal`): la luz del sensor. Botón principal, pestaña activa, palabra destacada en los títulos sobre fondo oscuro y el foco de los datos. Nunca como fondo de un bloque de texto largo.

### Secondary
- **Menta** (`menta`) y **Verde Hoja** (`verde-hoja`): verdes de planta. La menta da fondo a tarjetas de medida; el verde hoja colorea la segunda línea de los títulos sobre crema y el anillo de foco.

### Tertiary
- **Tierra Roja** (`tierra-roja`): acento cálido puntual (una tarjeta de medida). No se usa para errores ni como color de acción.

### Neutral
- **Noche de Invernadero** (`noche-invernadero`): texto principal sobre claro, fondo de portada, barra de navegación, pie y bloques oscuros.
- **Bosque** (`bosque`) y **Verde App** (`verde-app`): fondos oscuros secundarios; el de la sección de la aplicación es verde app.
- **Crema de Campo** (`crema-campo`): fondo claro principal y texto sobre oscuro.
- **Papel** (`papel`): fondo del cuerpo, del cierre y de campos y tarjetas claras.
- **Salvia Clara** (`salvia-clara`): fondo del catálogo y de la meteo.

### Named Rules
**The Una Señal Rule.** En cada pantalla el Verde Señal marca una sola cosa principal (la acción o el dato). Si dos elementos compiten por él, uno pasa a contorno.

**The Texto Legible Rule.** El texto secundario no baja del 78 % de opacidad sobre crema (`rgba(11, 28, 23, 0.78)`) ni del 82 % sobre oscuro. Se lee al sol, en el móvil.

## Typography

**Display Font:** Space Grotesk (con sans-serif)
**Body Font:** Manrope (con system-ui, sans-serif)
**Label/Mono Font:** DM Mono (con monospace)

**Character:** Space Grotesk aporta el titular rotundo y técnico; Manrope, una lectura amable y abierta; DM Mono, la voz del instrumento para cifras, unidades y rótulos cortos.

### Hierarchy
- **Display** (500, clamp hasta 9.1rem, 0.82): titular de la portada, dos líneas como máximo con la segunda en color.
- **Headline** (600, clamp hasta 7rem, 0.88): título de cada sección, partido en dos líneas con la segunda en verde.
- **Title** (600, clamp hasta 2.3rem, 1): títulos de tarjeta, pasos y preguntas.
- **Body** (400, 1.05–1.5rem según bloque, 1.6): párrafos; ancho máximo de unos 600–660 px.
- **Label** (400, 0.94rem, tracking 0.13em, mayúsculas): rótulos de instrumento (categoría de un equipo, unidades). No va encima de los títulos.

### Named Rules
**The Dos Líneas Rule.** Un título de sección cabe en dos líneas en escritorio. Si ocupa tres o más, se acorta el texto antes que reducir la letra.

**The Mínimo 15 px Rule.** Ningún texto de lectura baja de 15 px en pantalla; los rótulos mono, de 13 px.

## Layout

Secciones a sangre que ocupan el ancho de la ventana con un margen lateral de 3vw (contenedor máximo de 1920 px) y unos 150 px de aire vertical. La cabecera de cada sección pone el título a la izquierda y un párrafo corto alineado abajo a la derecha. Las rejillas de tarjetas usan 4 columnas desde 1401 px, 2 entre 901 y 1400 px y 1 en móvil. LIBOx y meteo usan un escenario fijo de una pantalla: texto y lista a la izquierda (≈34 %) y el modelo 3D dentro de un círculo a la derecha. En escritorio (≥1200 px) la página se escala al 90 %; los valores vh/vw se escriben como `calc(Xvh / var(--zoom))`.

### Named Rules
**The Pantalla Completa Rule.** Toda medida basada en la ventana se divide por `var(--zoom)`, o la sección dejará un hueco bajo el zoom del 90 %.

## Elevation & Depth

Híbrido: las superficies son planas y la profundidad viene de los bloques de color. Hay sombra en lo que flota (barra de navegación, ventana de la aplicación, diálogos, botón de WhatsApp) y, según la dirección confirmada, un relieve suave en lo que se puede tocar.

### Shadow Vocabulary
- **Ventana flotante** (`box-shadow: 0 20px 70px #00130740`): la ventana de la demo de la aplicación.
- **Diálogo** (`box-shadow: 0 30px 90px rgba(0, 0, 0, 0.3)`): formulario de contacto.
- **Botón flotante** (`box-shadow: 0 10px 30px rgba(0, 0, 0, 0.25)`): botón de WhatsApp.
- **Marcador 3D** (`box-shadow: 0 2px 12px #182c1910`): números sobre los modelos.

### Named Rules
**The Relieve Al Tocar Rule.** Las tarjetas están planas en reposo y suben 4 px al pasar el ratón (160 ms). Nada gira ni rebota.

## Shapes

Hoy: botones y enlaces de navegación en píldora (999px), tarjetas y barra con esquina de 20 px, paneles grandes de 26 px y campos de 11 px. Los modelos 3D se enmarcan en un círculo fino (`1px solid` verde salvia translúcido). Dirección confirmada: firme, de herramienta; los componentes nuevos usan esquinas cortas y bordes de 1 px visibles, sin mezclar en un mismo bloque píldoras y esquinas cortas.

## Components

### Buttons
Firmes y directos; un verbo concreto en cada uno («Ver los sensores», «Enviar consulta»).
- **Shape:** píldora (999px), 47 px de alto, 0 19px de relleno, peso 800.
- **Primary:** Verde Señal con texto noche; al pasar el ratón pasa a crema.
- **Dark:** noche con texto papel; al pasar el ratón, Verde Señal con texto noche. Es el principal sobre fondos claros.
- **Outline (sobre oscuro):** transparente con borde crema al 30 %; al pasar el ratón, borde y texto en Verde Señal.
- **Hover / Focus:** sube 3 px en 200 ms; foco visible con anillo verde hoja de 2–3 px separado del borde.

### Chips
- **Style:** pestañas y filtros en píldora con borde translúcido.
- **State:** el seleccionado se rellena (Verde Señal sobre oscuro, noche sobre claro); el resto, solo borde.

### Cards / Containers
- **Corner Style:** 20 px.
- **Background:** menta, Verde Señal, tierra roja y papel para medidas; papel para el catálogo; translúcido sobre noche para «Qué incluye».
- **Shadow Strategy:** planas en reposo; relieve al pasar el ratón (ver Elevation).
- **Border:** 1 px translúcido en tarjetas claras y oscuras.
- **Internal Padding:** 28–30 px.

### Inputs / Fields
- **Style:** fondo blanco translúcido, borde de línea al 16 %, esquina de 11 px, 13 px × 14 px de relleno. Etiqueta visible encima en peso 700; los opcionales llevan «(opcional)».
- **Focus:** borde verde hoja y halo de 3 px al 16 %.

### Navigation
- **Style:** barra flotante noche con esquina de 20 px, logo a la izquierda, cuatro enlaces centrados en 0.96rem peso 700 al 66 % que pasan a 100 % con fondo Verde Señal al 12 %, e idioma y acceso a la aplicación a la derecha. En móvil se ocultan los enlaces centrales.

### Escenario 3D (signature)
Un modelo girable a mano dentro de un círculo fino, con números en círculo sobre sus conectores y una lista a la izquierda que hace lo mismo. Al elegir un conector con sensor propio, el LIBOx se difumina y el sensor ocupa su sitio. Ni giro automático ni giro ligado al scroll.

## Do's and Don'ts

### Do:
- **Do** reservar el Verde Señal para la acción principal o el dato activo de cada pantalla.
- **Do** partir los títulos de sección en dos líneas, la segunda en verde (Verde Señal sobre oscuro, verde hoja sobre crema).
- **Do** mantener el texto secundario a 78 % de opacidad o más y ningún texto de lectura por debajo de 15 px.
- **Do** dividir cualquier vh/vw por `var(--zoom)`.
- **Do** poner etiqueta visible a cada campo y marcar los opcionales.
- **Do** usar movimiento corto (≈160 ms) solo como respuesta a la interacción, y respetar «reducir movimiento».

### Don't:
- **Don't** poner rótulos ni numeraciones decorativas encima de los títulos («01 / Sección»).
- **Don't** usar franjas de palabras sueltas o tríos de eslóganes.
- **Don't** añadir puntos que laten, giros automáticos ni animaciones ligadas al scroll de la página (el despiece de la meteo va con la rueda dentro de su círculo).
- **Don't** mezclar en un mismo bloque píldoras y esquinas cortas.
- **Don't** usar la tierra roja para errores ni como color de acción.
