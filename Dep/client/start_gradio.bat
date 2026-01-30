@echo off
echo ========================================
echo  Image to LaTeX Converter (Gradio)
echo ========================================
echo.

cd /d "%~dp0"

REM Check if Python is available
python --version >nul 2>&1
if errorlevel 1 (
    echo ERROR: Python not found!
    echo Please install Python 3.8+ and try again.
    pause
    exit /b 1
)

REM Check and install Gradio
echo Checking dependencies...
pip show gradio >nul 2>&1
if errorlevel 1 (
    echo Installing Gradio...
    pip install gradio requests Pillow
)

echo.
echo Starting Gradio app at http://localhost:7860
echo Press Ctrl+C to stop the server
echo.

python app_gradio.py

pause
