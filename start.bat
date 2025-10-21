@echo off
setlocal EnableDelayedExpansion

echo =====================================
echo   Application Launcher
echo =====================================
echo.

REM Check if package.json exists first
if not exist "package.json" (
    echo ERROR: package.json not found!
    echo Make sure you're running this from the correct directory.
    echo.
    pause
    exit /b 1
)

REM Check if node_modules exists
if exist "node_modules\" (
    echo [OK] node_modules directory found
    echo [INFO] Starting application with npm start...
    echo.
    call npm start
    
    REM Check if npm start was successful
    if !errorlevel! neq 0 (
        echo.
        echo [ERROR] npm start failed with error code !errorlevel!
        pause
        exit /b !errorlevel!
    )
) else (
    echo [WARNING] node_modules directory not found!
    echo.
    echo This usually means dependencies haven't been installed yet.
    echo Please run 'install.bat' first to install all required dependencies.
    echo.
    echo Steps to fix this:
    echo 1. Run install.bat
    echo 2. Wait for installation to complete
    echo 3. Run this script again
    echo.
    pause
    exit /b 1
)