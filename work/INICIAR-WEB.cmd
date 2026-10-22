@echo off
setlocal
cd /d "%~dp0"
where node >nul 2>&1
if errorlevel 1 (
  echo Instala Node.js 24 LTS desde https://nodejs.org/ y vuelve a abrir este archivo.
  pause
  exit /b 1
)
where npm.cmd >nul 2>&1
if errorlevel 1 (
  echo No se encuentra npm. Reinstala Node.js incluyendo npm y reinicia esta ventana.
  pause
  exit /b 1
)
if not exist "node_modules\vite\bin\vite.js" (
  echo Instalando las dependencias de Hiotera...
  call npm.cmd install
  if errorlevel 1 (
    echo No se han podido instalar las dependencias. Revisa la conexion a Internet.
    pause
    exit /b 1
  )
)
echo Hiotera se abrira en el navegador. Para detenerla pulsa Ctrl+C.
call npm.cmd run dev -- --open
if errorlevel 1 pause
