# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Users

- **Agricultor con invernadero** (principal). Dueño o encargado de una finca de invernadero en el Poniente almeriense. Decide la compra y es quien abre la aplicación en el móvil para ver cómo está el suelo y si toca regar. No tiene por qué saber de tecnología.
- **Técnico o ingeniero agrónomo.** Asesora a una o varias fincas y usa las lecturas y las gráficas para recomendar riego, abonado o cambios de clima en el invernadero.

## Product Purpose

Hiotera vende e instala sensores para invernadero y una aplicación donde ver sus lecturas. La web explica qué mide cada equipo, enseña cómo es la aplicación y consigue que el agricultor o el técnico contacte con la oficina para pedir una instalación.

Éxito: que el visitante entienda qué podría ver de su finca y llame, escriba por WhatsApp o envíe el formulario.

## Positioning

- **Instalación y trato cercano.** Un técnico de Hiotera instala los equipos y enseña a usar la aplicación el mismo día. Hay oficina física en El Ejido (lunes a viernes, 8:00 a 16:00).
- **Aplicación sencilla**, pensada para el agricultor y no para un perfil técnico.
- **Todo en un sistema.** Suelo, tensiómetros, radiación, clima exterior, cámaras y cuaderno de campo en la misma aplicación.

## Operating Context

- El agricultor consulta la aplicación en el móvil, a menudo desde la finca; el técnico, también en el ordenador.
- Equipos: el **LIBOx** recoge las lecturas de los sensores conectados y las envía a la aplicación; se carga con placa solar. La **estación meteorológica** mide fuera del invernadero.
- Contacto real: teléfono y WhatsApp +34 624 412 364, contacto@hiotera.com, oficina en Av. de Nicolás Salmerón, 69, 04700 El Ejido (Almería).
- La aplicación real de clientes está en demo.hiotera.com; la web incluye una réplica con datos inventados (Finca Demo1).

## Capabilities and Constraints

- **Sonda de suelo:** temperatura, humedad y conductividad (nivel de sales).
- **Tensiómetros:** a 15 y 30 cm, tensión del agua en el suelo.
- **Sensor de radiación** (W/m²) y **placa solar** que carga el LIBOx.
- **Estación meteorológica:** 12 parámetros (temperatura y humedad exterior, punto de rocío, déficit de humedad, precipitación observada, diaria y anual, presión barométrica, radiación exterior, velocidad del viento, racha y dirección del viento).
- **También en catálogo:** tensiómetro digital (lectura en su pantalla) y cámaras de videovigilancia, ambos bajo consulta.
- **Aplicación:** lecturas, gráficas históricas por parámetro (24 h, 7 días, 30 días o intervalo personalizado), avisos, fincas en lista y mapa, guías y cuaderno de campo.
- **Compra:** incluye instalación, formación el día de la instalación y el primer año de mantenimiento gratis.
- **Web:** React y Vite, publicada en Netlify. Idiomas: español (principal), inglés, francés y alemán. La demo de la aplicación se muestra siempre en español.
- **Formulario de contacto:** todavía no envía datos (en pruebas).
- **Por decidir:** cobertura o conexión necesarias, duración de la batería y si la aplicación tiene cuota. No afirmarlo hasta confirmarlo.

## Brand Commitments

- Nombre: **Hiotera**. Equipo: **LIBOx** (con esa grafía).
- Iconos oficiales en `public/brand/`.
- Voz: tuteo, frases cortas y concretas, vocabulario del campo (finca, riego, raíz, sales). Nada de eslóganes vacíos ni promesas agronómicas: los avisos y las bandas son orientativos, no recomendaciones.

## Evidence on Hand

- Foto real de un LIBOx instalado: `public/libox-invernadero.webp`.
- Modelos 3D de todos los equipos del catálogo: `public/catalog-models/`, `public/libox-sin-cables.glb`, `public/estacion-meteo-viva.glb`.
- **Disponibles pero aún no en la web:** más fotos reales de instalaciones y precios públicos. Pedírselos a Hiotera antes de usarlos.
- **No existen:** opiniones de clientes, casos de éxito ni cifras de ahorro. No inventarlos.

## Product Principles

1. **Lo concreto primero.** Cada afirmación dice qué se mide, dónde y para qué sirve en la finca.
2. **El agricultor tiene que entenderlo sin ayuda.** Si hace falta un técnico para leer la web, está mal escrita.
3. **Personas reales detrás.** La instalación, la formación y la oficina son parte del producto; la web las enseña.
4. **No prometer lo que no está confirmado.** Ni resultados agronómicos, ni opiniones, ni funciones por validar.

## Accessibility & Inclusion

- Lectura cómoda en el móvil y al sol: texto grande y buen contraste.
- Navegable con teclado y con lector de pantalla (pestañas, modelos 3D y diálogos ya tienen etiquetas accesibles).
- Respetar «reducir movimiento» del sistema.
