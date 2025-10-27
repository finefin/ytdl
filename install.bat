@echo off
setlocal enabledelayedexpansion

title Installation Setup

echo ================================
echo Installation Setup
echo ================================
echo(

:menu
echo What would you like to install?
echo(
echo 1. Install Node.js dependencies only
echo 2. Install/Update yt-dlp only
echo 3. Install both (recommended)
echo 4. Exit
echo(
set /p choice="Enter your choice (1-4): "

if "%choice%"=="1" goto install_node
if "%choice%"=="2" goto install_ytdlp
if "%choice%"=="3" goto install_both
if "%choice%"=="4" goto end
echo(
echo [ERROR] Invalid choice. Please enter 1, 2, 3, or 4.
echo(
goto menu

:install_both
echo DEBUG: Starting Node.js installation
call :install_node_deps
echo DEBUG: Node.js installation returned
echo DEBUG: Starting yt-dlp installation
call :install_ytdlp_tool
echo DEBUG: yt-dlp installation returned
goto complete

:install_node
call :install_node_deps
goto complete

:install_ytdlp
call :install_ytdlp_tool
goto complete

:install_node_deps
echo(
echo ================================
echo Installing Node.js Dependencies
echo ================================
echo(

REM Check if node command exists
echo Checking for Node.js...
node --version >nul 2>&1

if %errorlevel% equ 0 (
    REM Node.js is installed
    for /f "tokens=*" %%i in ('node --version') do set NODE_VERSION=%%i
    echo [OK] Node.js is installed!

    REM Check npm as well
    echo Checking for npm...
    npm --version >nul 2>&1

    if %errorlevel% equ 0 (
        for /f "tokens=*" %%i in ('npm --version') do set NPM_VERSION=%%i
        echo [OK] npm is available!
        echo(

        REM Check if package.json exists
        if exist "package.json" (
            echo Found package.json file.
            echo(
            echo Installing dependencies...
            echo ================================

            REM Run npm install
            npm install
            set NPM_ERROR=!errorlevel!

            echo ================================
            echo(
            if !NPM_ERROR! equ 0 (
                echo [OK] All dependencies installed successfully!
            ) else (
                echo [ERROR] npm install failed!
                echo Please check the error messages above and try again.
                echo(
                echo Common solutions:
                echo - Make sure you have internet connection
                echo - Try running as administrator
                echo - Delete node_modules folder and try again
            )
        ) else (
            echo [!] Warning: No package.json file found in current directory.
            echo(
            echo Make sure you're running this script from the project root directory
            echo that contains a package.json file.
            echo(
            echo Current directory: %CD%
        )
    ) else (
        echo [ERROR] npm is not available
        echo This might indicate a problem with your Node.js installation.
        echo Please reinstall Node.js from the official website.
    )
) else (
    REM Node.js is not installed
    echo [ERROR] Node.js is not installed on this system.
    echo(
    echo Node.js is required to run this application.
    echo(
    echo What you need to do:
    echo 1. Download and install Node.js from the official website
    echo 2. Restart your command prompt/terminal
    echo 3. Run this script again
    echo(
    echo Press any key to open the Node.js download page...
    pause >nul

    REM Open the Node.js download page
    start https://nodejs.org/en/download/

    echo(
    echo Download page opened in your browser.
    echo Please install Node.js and run this script again.
)
goto :eof

:install_ytdlp_tool
echo(
echo ================================
echo Installing/Updating yt-dlp
echo ================================
echo(
echo Attempting to install or update yt-dlp via winget...
echo(
winget install yt-dlp --silent --accept-source-agreements --accept-package-agreements
echo(
echo Installation/update completed
echo(
echo NOTE: If yt-dlp was already installed it has been updated
echo NOTE: You may need to restart your terminal for changes to take effect
echo(
echo If you see errors above please install manually:
echo - Using pip: pip install yt-dlp
echo - Download from: https://github.com/yt-dlp/yt-dlp/releases
echo(
goto :eof

:complete
echo(
echo ================================
echo Setup Completed!
echo ================================
echo(
echo Your installation is ready.
echo You can now run your application with start.bat
echo(
goto end

:end
echo(
pause
endlocal
