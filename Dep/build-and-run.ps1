# Build and Run Script for Qwen Vision API
# Usage: .\build-and-run.ps1

Write-Host "🚀 Building Qwen Vision API Docker Image..." -ForegroundColor Cyan

# Check if model file exists
if (-not (Test-Path "lora_model_qwen3vl.zip")) {
    Write-Host "❌ Error: lora_model_qwen3vl.zip not found!" -ForegroundColor Red
    Write-Host "Please place the model file in the current directory." -ForegroundColor Yellow
    exit 1
}

# Check if Docker is running
try {
    docker ps | Out-Null
} catch {
    Write-Host "❌ Error: Docker is not running!" -ForegroundColor Red
    Write-Host "Please start Docker Desktop and try again." -ForegroundColor Yellow
    exit 1
}

# Check NVIDIA Docker runtime
Write-Host "`n🔍 Checking NVIDIA Docker runtime..." -ForegroundColor Cyan
try {
    docker run --rm --gpus all nvidia/cuda:12.1.0-base-ubuntu22.04 nvidia-smi 2>&1 | Out-Null
    Write-Host "✅ NVIDIA Docker runtime OK" -ForegroundColor Green
} catch {
    Write-Host "⚠️  Warning: NVIDIA Docker runtime not available" -ForegroundColor Yellow
    Write-Host "The container will not have GPU access." -ForegroundColor Yellow
    $continue = Read-Host "Continue anyway? (y/N)"
    if ($continue -ne 'y') {
        exit 1
    }
}

# Build Docker image
Write-Host "`n🔨 Building Docker image..." -ForegroundColor Cyan
docker-compose build
if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ Build failed!" -ForegroundColor Red
    exit 1
}

Write-Host "`n✅ Build successful!" -ForegroundColor Green

# Ask to run
$run = Read-Host "`nStart the server now? (Y/n)"
if ($run -eq '' -or $run -eq 'y' -or $run -eq 'Y') {
    Write-Host "`n🚀 Starting server..." -ForegroundColor Cyan
    docker-compose up -d
    
    if ($LASTEXITCODE -eq 0) {
        Write-Host "`n✅ Server started successfully!" -ForegroundColor Green
        Write-Host "`n📊 Watching logs (Ctrl+C to exit)..." -ForegroundColor Cyan
        Write-Host "Server will continue running in background.`n" -ForegroundColor Yellow
        docker-compose logs -f
    } else {
        Write-Host "❌ Failed to start server!" -ForegroundColor Red
        exit 1
    }
} else {
    Write-Host "`nTo start the server later, run:" -ForegroundColor Yellow
    Write-Host "  docker-compose up -d`n" -ForegroundColor White
}
