# Aplicacion Hiotera

Copia completa de la carpeta de trabajo de Aplicacion Hiotera, preparada para el repositorio [NoSoyDonete/Web-Hiotera](https://github.com/NoSoyDonete/Web-Hiotera).

## Contenido

- `work/`: aplicación React y Vite, código fuente, recursos 3D, dependencias instaladas, compilación y archivos auxiliares.
- `outputs/`: las once entregas y versiones archivadas, incluido `Estacion-meteo-web.zip`.
- `historial-git/work-git-original.zip`: metadatos completos del repositorio Git original de `work/`, con sus nueve commits. Git reserva el nombre `.git`; se conserva comprimido para que el código de `work/` siga siendo navegable y no se convierta en una referencia a otro repositorio.
- `INVENTARIO-ORIGINAL.json`: listado de todos los archivos originales, tamaños y huellas SHA-256. No se han excluido archivos de la copia por sus reglas `.gitignore` ni por posibles credenciales.

## Ejecutar la aplicación

Desde `work/`, ejecuta `npm.cmd run dev` en Windows. También puedes abrir `work/INICIAR-WEB.cmd`. Para generar una nueva compilación, ejecuta `npm.cmd run build`. `work/README.md` contiene las instrucciones completas.

El modelo meteorológico y su demo independiente están en `outputs/Estacion-meteo-web.zip`; incluye sus propias instrucciones de integración.

La carpeta `node_modules` se conserva tal como estaba en Windows. Para otra plataforma, usa el archivo `package-lock.json` y ejecuta `npm ci` dentro de `work/`.

## Restaurar el historial original

En una copia independiente de `work/`, extrae `historial-git/work-git-original.zip` de modo que aparezca `work/.git/`. Esta copia conserva el historial original; los cambios posteriores en GitHub pertenecen al repositorio exterior.

No se ha aplicado una licencia nueva al código o a los recursos. Las dependencias conservan sus licencias originales.
