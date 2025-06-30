@echo off
:: Script de construcción automática - SQLEditor.exe

title Empaquetador de App Web Flask + React
color 0a

echo 🔨 Iniciando proceso de empaquetado...
echo.

:: Variables
set APP_NAME=SQLEditor
set PYTHON_SCRIPT=backend\app.py
set DIST_FOLDER=dist
set BUILD_FOLDER=build
set OUTPUT_EXE=%DIST_FOLDER%\%APP_NAME%.exe
set TARGET_PATH=%cd%\%APP_NAME%.exe

:: Limpiar directorios antiguos
echo 🧹 Limpiando archivos temporales...
if exist %BUILD_FOLDER% rmdir /s /q %BUILD_FOLDER%
if exist %DIST_FOLDER% rmdir /s /q %DIST_FOLDER%

echo.
echo ▶️ Compilando frontend React...
cd frontend
call npm run build
if errorlevel 1 (
    echo ❌ Error al compilar el frontend
    cd ..
    pause
    exit /b 1
)
cd ..

echo.
echo ▶️ Ejecutando PyInstaller...

pyinstaller --name=%APP_NAME% ^
    --onefile ^
    --windowed ^
    --add-data "%cd%\frontend\build;build" ^
    --hidden-import=flask ^
    --hidden-import=flask_cors ^
    --hidden-import=routes.file_routes ^
    --hidden-import=os ^
    --clean ^
    %PYTHON_SCRIPT%

:: Verificar si se creó el .exe
if not exist "%OUTPUT_EXE%" (
    echo ❌ Error: No se encontró el .exe generado
    pause
    exit /b 1
)

:: Copiar el .exe a la raíz del proyecto
echo.
echo 📁 Copiando %APP_NAME%.exe a la raíz del proyecto...
copy /y "%OUTPUT_EXE%" "%TARGET_PATH%"

:: Eliminar carpetas innecesarias después de compilar
echo.
echo 🗑️ Eliminando carpetas temporales...
if exist %BUILD_FOLDER% rmdir /s /q %BUILD_FOLDER%
if exist %DIST_FOLDER% rmdir /s /q %DIST_FOLDER%

echo.
echo ✅ ¡Empaquetado completado!
echo.
echo 🎯 Tu aplicación está lista: %APP_NAME%.exe
echo.
pause