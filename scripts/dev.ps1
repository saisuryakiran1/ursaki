# UrSaKi — one-command dev startup (Windows PowerShell)
# Usage: .\scripts\dev.ps1

$ErrorActionPreference = "Stop"
$Root = Split-Path -Parent $PSScriptRoot

# Ensure Node + Ollama on PATH
$env:Path = "C:\Program Files\nodejs;C:\Users\saisu\AppData\Local\Programs\Ollama;" + $env:Path

Write-Host "=== UrSaKi Dev Stack ===" -ForegroundColor Cyan

# Backend
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd '$Root\backend'; py -m uvicorn ursaki.main:app --reload --app-dir src --host 0.0.0.0 --port 8000"
Write-Host "Backend starting on http://localhost:8000"

# Desktop
Start-Process powershell -ArgumentList "-NoExit", "-Command", "`$env:Path='C:\Program Files\nodejs;'+`$env:Path; cd '$Root\apps\desktop'; npm run dev"
Write-Host "Desktop starting on http://localhost:1420"

# Mobile (web)
Start-Process powershell -ArgumentList "-NoExit", "-Command", "`$env:Path='C:\Program Files\nodejs;'+`$env:Path; cd '$Root\apps\mobile'; npx expo start --web --port 8081"
Write-Host "Mobile web starting on http://localhost:8081"

Write-Host "`nAPI docs: http://localhost:8000/docs" -ForegroundColor Green
