# UrSaKi Backend

FastAPI backend for the UrSaKi platform.

## Setup

```bash
poetry install
poetry run uvicorn ursaki.main:app --reload --host 0.0.0.0 --port 8000
```

## Tests

```bash
poetry run pytest
```

## Docker

```bash
docker build -t ursaki-backend .
docker run -p 8000:8000 ursaki-backend
```
