@echo off
setlocal enabledelayedexpansion

echo ============================================
echo  Smart Appointment System - Setup Script
echo  Windows Version
echo ============================================
echo.

REM Check if Docker is running
echo [1/5] Checking Docker...
docker --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ERROR: Docker is not installed or not in PATH
    echo Please install Docker Desktop from: https://www.docker.com/products/docker-desktop
    pause
    exit /b 1
)

docker ps >nul 2>&1
if %errorlevel% neq 0 (
    echo ERROR: Docker is not running
    echo Please start Docker Desktop and try again
    pause
    exit /b 1
)

echo ✓ Docker is running
echo.

REM Check if .env file exists
echo [2/5] Checking environment file...
if not exist ".env" (
    if exist ".env.example" (
        echo Creating .env from .env.example...
        copy .env.example .env >nul
        echo ✓ Created .env file
    ) else (
        echo ERROR: .env.example not found
        echo Please create .env file manually
        pause
        exit /b 1
    )
) else (
    echo ✓ .env file exists
)
echo.

REM Stop and remove existing containers
echo [3/5] Cleaning up old containers...
docker-compose down >nul 2>&1
echo ✓ Cleanup complete
echo.

REM Build and start containers
echo [4/5] Building and starting containers...
echo This may take a few minutes on first run...
echo.

REM Try with BuildKit first
echo Attempting build with BuildKit...
set DOCKER_BUILDKIT=1
set COMPOSE_DOCKER_CLI_BUILD=1
docker-compose up --build -d 2>nul

if %errorlevel% neq 0 (
    echo.
    echo BuildKit failed, trying legacy builder...
    set DOCKER_BUILDKIT=0
    set COMPOSE_DOCKER_CLI_BUILD=0
    docker-compose up --build -d
    
    if !errorlevel! neq 0 (
        echo.
        echo ERROR: Failed to start containers
        echo Please check the error messages above
        pause
        exit /b 1
    )
)

echo ✓ Containers started successfully
echo.

REM Wait for services to be ready
echo [5/5] Waiting for services to start...
timeout /t 10 /nobreak >nul

REM Check if services are running
docker-compose ps | findstr "Up" >nul
if %errorlevel% neq 0 (
    echo WARNING: Some services might not be ready yet
    echo Run 'docker-compose logs' to check status
) else (
    echo ✓ Services are running
)

echo.
echo ============================================
echo  Setup Complete!
echo ============================================
echo.
echo Your application is running:
echo.
echo  Frontend (Production-like):  http://localhost
echo  Backend API:                  http://localhost/api/health
echo  API Documentation:            http://localhost/docs
echo.
echo  Frontend (Debug):             http://localhost:3001
echo  Backend (Debug):              http://localhost:8001
echo.
echo Useful commands:
echo  - View logs:        docker-compose logs -f
echo  - Stop services:    docker-compose down
echo  - Restart:          docker-compose restart
echo.
echo Press any key to view logs (Ctrl+C to exit)...
pause >nul

docker-compose logs -f
