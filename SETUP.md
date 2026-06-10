# UrSaKi — Setup & Push Guide

## Quick start (Windows)

```powershell
# 1. Add to PATH permanently (System Environment Variables):
#    C:\Program Files\nodejs
#    C:\Users\saisu\AppData\Local\Programs\Ollama

# 2. Install deps
cd C:\Users\saisu\Projects\ursaki
copy .env.example .env
npm install
py -m pip install -r backend/requirements.txt

# 3. Pull AI models (optional)
ollama pull gemma2:2b

# 4. Start everything
.\scripts\dev.ps1
```

## URLs when running

| Service | URL |
|---------|-----|
| Backend API | http://localhost:8000 |
| API Docs | http://localhost:8000/docs |
| Mobile (web) | http://localhost:8081 |
| Desktop | http://localhost:1420 |

## Tests

```powershell
npm run test:backend          # 23 tests
cd apps/mobile && npm test    # 4 tests
```

## Push to GitHub

```powershell
# Login once
gh auth login

# Create repo and push
cd C:\Users\saisu\Projects\ursaki
gh repo create ursaki --public --source=. --remote=origin --push
```

If the repo already exists:

```powershell
git remote set-url origin https://github.com/saisuryakiran1/ursaki.git
git push -u origin main
```

## What's included

- **Backend**: FastAPI + safety_guard + AI engine + all feature modules
- **Mobile**: Expo app with navigation, all screens, tests
- **Desktop**: Tauri + Vite (web dev works; native needs Rust)
- **Watch**: iOS/Android stubs
- **CI**: GitHub Actions workflows
- **Safety**: SAFETY_AUDIT.md + crisis hotlines hardcoded
