@echo off
setlocal enabledelayedexpansion

title Node.js Setup

echo ================================
echo Node.js Setup 
echo ================================
echo.

:: Check if node command exists
echo Checking for Node.js...
node --version >nul 2>&1

if %errorlevel% equ 0 (
    :: Node.js is installed, get version info
    for /f "tokens=*" %%i in ('node --version') do set NODE_VERSION=%%i
    echo [OK] Node.js is installed!
    
    :: Check npm as well
    echo Checking for npm...
    npm --version >nul 2>&1

    if %errorlevel% equ 0 (
        for /f "tokens=*" %%i in ('npm --version') do set NPM_VERSION=%%i
        echo [OK] npm is available!
        echo.
        
        :: Check if package.json exists
        if exist "package.json" (
            echo Found package.json file.
            echo.
            echo Installing dependencies...
            echo ================================
            
            :: Run npm install
            npm install
            
            if !errorlevel! equ 0 (
                echo ================================
                echo.
                echo [OK] All dependencies installed successfully!
                echo [OK] Your project is ready to use.
                echo.
                echo You can now run your application.
            ) else (
                echo ================================
                echo.
                echo [ERROR] npm install failed!
                echo Please check the error messages above and try again.
                echo.
                echo Common solutions:
                echo - Make sure you have internet connection
                echo - Try running as administrator
                echo - Delete node_modules folder and try again
                echo OR maybe everything is fine any you just need to open start.bat  
            )
            
        ) else (
            echo [!] Warning: No package.json file found in current directory.
            echo.
            echo Make sure you're running this script from the project root directory
            echo that contains a package.json file.
            echo.
            echo Current directory: %CD%
        )
        
    ) else (
        echo [ERROR] npm is not available
        echo This might indicate a problem with your Node.js installation.
        echo Please reinstall Node.js from the official website.
    )
    
    echo.
    
) else (
    :: Node.js is not installed
    echo [ERROR] Node.js is not installed on this system.
    echo.
    echo Node.js is required to run this application.
    echo.
    echo What you need to do:
    echo 1. Download and install Node.js from the official website
    echo 2. Restart your command prompt/terminal
    echo 3. Run this script again
    echo.
    echo Press any key to open the Node.js download page...
    pause >nul
    
    :: Open the Node.js download page
    start https://nodejs.org/en/download/
    
    echo.
    echo Download page opened in your browser.
    echo Please install Node.js and run this script again.
)

echo.
pause
endlocal