"""UrSaKi FastAPI application entry point."""

from contextlib import asynccontextmanager
from typing import AsyncGenerator

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from ursaki.config import settings
from ursaki.routers import avatar, biometric, chat, marketplace, memory_palace, shadow, social


@asynccontextmanager
async def lifespan(_app: FastAPI) -> AsyncGenerator[None, None]:
    yield


app = FastAPI(
    title="UrSaKi API",
    description="Neuro-symbiotic mental wellness platform backend",
    version="1.0.0",
    lifespan=lifespan,
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.cors_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(chat.router)
app.include_router(avatar.router)
app.include_router(biometric.router)
app.include_router(shadow.router)
app.include_router(memory_palace.router)
app.include_router(social.router)
app.include_router(marketplace.router)


@app.get("/health")
async def health() -> dict[str, str]:
    return {"status": "ok", "service": "ursaki-backend", "version": "1.0.0"}


def main() -> None:
    import uvicorn

    uvicorn.run(
        "ursaki.main:app",
        host=settings.host,
        port=settings.port,
        reload=settings.debug,
    )


if __name__ == "__main__":
    main()
