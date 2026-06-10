"""Application configuration loaded from environment variables."""

from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    """UrSaKi backend settings."""

    model_config = SettingsConfigDict(
        env_file=".env",
        env_file_encoding="utf-8",
        extra="ignore",
    )

    host: str = "0.0.0.0"
    port: int = 8000
    debug: bool = False
    cors_origins: list[str] = [
        "http://localhost:3000",
        "http://localhost:1420",
        "http://localhost:8081",
        "exp://localhost:8081",
    ]

    # LLM
    ollama_base_url: str = "http://localhost:11434"
    default_model: str = "gemma2:2b"
    desktop_model: str = "llama3:8b"
    openai_api_key: str = ""

    # ChromaDB
    chroma_persist_dir: str = "./data/chroma"

    # Safety
    safety_guard_timeout_ms: int = 50
    crisis_hotline_icall: str = "9152987821"
    crisis_hotline_vandrevala: str = "1860-2662-345"


settings = Settings()
