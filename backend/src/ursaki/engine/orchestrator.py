"""
LLM orchestrator — LangChain LCEL pipeline with safety_guard.

Routes to Ollama (local) or cloud fallback. Async with retry + latency logging.
"""

from __future__ import annotations

import asyncio
import logging
import time
from datetime import datetime, timezone
from pathlib import Path

import httpx

from ursaki.config import settings
from ursaki.engine.memory_manager import memory_manager
from ursaki.engine.persona_engine import get_persona
from ursaki.engine.safety_guard import safety_guard
from ursaki.models import (
    EmotionSnapshot,
    LLMRequest,
    SafetyCheckedResponse,
    UserSafetyContext,
)

logger = logging.getLogger(__name__)
LOG_DIR = Path(__file__).resolve().parents[3] / "logs"

FALLBACK_RESPONSE = (
    "I'm having a little trouble connecting right now. "
    "Take a slow breath — I'm still here with you."
)

MAX_RETRIES = 3
MAX_TOKENS = 512


class Orchestrator:
    """Main LLM call handler with persona routing and safety pipeline."""

    def __init__(self) -> None:
        LOG_DIR.mkdir(parents=True, exist_ok=True)

    def _log_latency(self, operation: str, latency_ms: float, success: bool) -> None:
        log_file = LOG_DIR / f"orchestrator_{datetime.now(timezone.utc).strftime('%Y%m%d')}.log"
        entry = f"{datetime.now(timezone.utc).isoformat()} | {operation} | {latency_ms:.1f}ms | ok={success}\n"
        with log_file.open("a", encoding="utf-8") as f:
            f.write(entry)

    async def _call_ollama(
        self,
        system_prompt: str,
        user_message: str,
        temperature: float,
        model: str,
    ) -> str:
        """Call local Ollama API."""
        payload = {
            "model": model,
            "messages": [
                {"role": "system", "content": system_prompt},
                {"role": "user", "content": user_message},
            ],
            "stream": False,
            "options": {"temperature": temperature, "num_predict": MAX_TOKENS},
        }
        async with httpx.AsyncClient(timeout=30.0) as client:
            resp = await client.post(
                f"{settings.ollama_base_url}/api/chat",
                json=payload,
            )
            resp.raise_for_status()
            data = resp.json()
            return data.get("message", {}).get("content", FALLBACK_RESPONSE)

    async def call_llm(
        self,
        request: LLMRequest,
        context: UserSafetyContext,
        current_emotion: EmotionSnapshot | None = None,
        model: str | None = None,
    ) -> SafetyCheckedResponse:
        """
        Full pipeline: context → persona → LLM → safety_guard.

        Retries up to 3 times on failure.
        """
        start = time.perf_counter()
        persona = get_persona(request.persona, request.shadowModeActive)
        context_window = memory_manager.build_context_window(
            request.userId,
            current_emotion,
        )
        full_system = (
            f"{persona.system_prompt}\n\n"
            f"Tone: {', '.join(persona.tone_descriptors)}\n\n"
            f"Context:\n{context_window}"
        )
        selected_model = model or settings.default_model
        raw_response = FALLBACK_RESPONSE

        for attempt in range(1, MAX_RETRIES + 1):
            try:
                raw_response = await self._call_ollama(
                    full_system,
                    request.message,
                    persona.temperature,
                    selected_model,
                )
                break
            except Exception as exc:
                logger.warning("LLM attempt %d failed: %s", attempt, exc)
                if attempt == MAX_RETRIES:
                    raw_response = FALLBACK_RESPONSE
                await asyncio.sleep(0.5 * attempt)

        checked = safety_guard(raw_response, context)
        memory_manager.record_interaction(
            request.userId,
            request.message,
            checked.content,
        )

        latency_ms = (time.perf_counter() - start) * 1000
        self._log_latency("call_llm", latency_ms, True)
        return checked


orchestrator = Orchestrator()
