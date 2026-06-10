# UrSaKi

**Neuro-symbiotic mental wellness platform** targeting Gen-Z.

UrSaKi combines React Native mobile, Tauri desktop sanctuary, Unity 3D avatars, smartwatch biometrics, and a privacy-first FastAPI backend with local LLM orchestration.

---

## Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                         UrSaKi Monorepo                          │
├──────────────┬──────────────┬──────────────┬───────────────────┤
│  apps/mobile │ apps/desktop │ watch-ios/   │   shared/         │
│  Expo RN     │ Tauri v2     │ watch-android│   TS types        │
│  + R3F       │ + Rust HUD   │ HRV stubs    │                   │
├──────────────┴──────────────┴──────────────┴───────────────────┤
│                      backend/ (FastAPI)                          │
│  engine/ · avatar/ · shadow/ · biometric/ · memory_palace/      │
│  social/ · marketplace/ · safety_guard middleware               │
├─────────────────────────────────────────────────────────────────┤
│  models/ (Ollama configs)  ·  infra/ (Docker Compose)            │
└─────────────────────────────────────────────────────────────────┘
```

### Stack

| Layer | Technology |
|-------|------------|
| Mobile | React Native (Expo) + TypeScript |
| Desktop | Tauri v2 (Rust + React/Vite) |
| 3D / AR | Unity via React Native bridge, React Three Fiber |
| Backend | FastAPI (Python 3.11+), Poetry |
| Vector store | ChromaDB |
| LLM orchestration | LangChain + LlamaIndex |
| Local models | Ollama — Gemma 2B (mobile), Llama 3 8B (desktop) |
| Wearables | WatchKit (iOS), Wear OS (Android) |
| Streaming | WebRTC (hybrid compute) |
| Proximity | BLE (Social Bridge) |
| User data | Solid Protocol Data Pods (privacy ground truth) |

### Privacy & Safety (non-negotiable)

1. **safety_guard** middleware runs before every LLM response
2. No emotional data leaves the device without explicit opt-in
3. Shadow Mode requires double opt-in + session limits
4. Crisis resources hardcoded in safety templates (iCall: 9152987821)

---

## Repository Structure

```
ursaki/
├── apps/
│   ├── mobile/          # Expo + React Native (TypeScript)
│   ├── desktop/         # Tauri v2 + Vite React frontend
│   ├── watch-ios/       # WatchKit stub (Swift)
│   └── watch-android/   # Wear OS stub (Kotlin)
├── backend/
│   └── src/ursaki/      # FastAPI application
├── shared/
│   └── types/           # Shared TypeScript domain types
├── models/              # Ollama / local model configs
├── infra/               # Docker Compose, deployment configs
├── turbo.json           # Turborepo pipelines
├── package.json         # npm workspaces root
└── .env.example         # Environment variable reference
```

---

## Getting Started

### Prerequisites

- Node.js 20+
- Python 3.11+
- Poetry
- Docker & Docker Compose (optional, for full stack)
- Rust (for Tauri desktop)
- Ollama (for local LLM inference)

### 1. Clone & install

```bash
cd ursaki
cp .env.example .env

# JavaScript monorepo
npm install

# Python backend
cd backend && poetry install && cd ..
```

### 2. Start infrastructure (optional)

```bash
cd infra
docker compose up -d
```

This starts: FastAPI backend, Ollama, ChromaDB.

### 3. Run apps

```bash
# All dev servers via Turborepo
npm run dev

# Or individually:
cd backend && poetry run uvicorn ursaki.main:app --reload
cd apps/mobile && npm run start
cd apps/desktop && npm run tauri dev
```

### 4. Health check

```bash
curl http://localhost:8000/health
# {"status":"ok","service":"ursaki-backend","version":"1.0.0"}
```

---

## Turborepo Scripts

| Command | Description |
|---------|-------------|
| `npm run build` | Build all apps and packages |
| `npm run dev` | Start all dev servers |
| `npm run lint` | Lint all workspaces |
| `npm run test` | Run all test suites |
| `npm run typecheck` | TypeScript strict check |

---

## Shared Types

Core domain types live in `shared/types/index.ts`:

- `EmotionSnapshot` — VAD emotion vector with source
- `UserPod` — Solid Protocol pod with avatar + memory palace
- `AvatarState` — procedural avatar parameters
- `MemoryNode` — spatial emotional memory node
- `SafetyFlag` — green / yellow / red safety classification

---

## Feature Development Order

1. **Prompt 1** — Monorepo scaffold (this repo)
2. **Prompt 2** — AI Engine + safety_guard
3. **Prompt 7** — Mobile shell + navigation
4. **Prompt 3** — Neuro-Genesis Avatar
5. **Prompt 5** — Smartwatch + HRV
6. **Prompt 6** — 3D Memory Palace
7. **Prompt 4** — Shadow Self Mode (after safety infra)
8. **Prompt 8** — Desktop Sanctuary
9. **Prompt 9** — Social Bridge (BLE)
10. **Prompt 10** — Mind-Mod Marketplace
11. **Prompt 11** — Tests + CI/CD + Safety Audit

Use feature branches: `feature/module-name`

---

## License

Proprietary — UrSaKi © Sai Surya Kiran
