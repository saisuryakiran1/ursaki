"""Intervention engine — maps stress events to watch/phone actions."""

from __future__ import annotations

from datetime import datetime, timedelta, timezone
from typing import Literal

from pydantic import BaseModel, Field

from ursaki.biometric.hrv_analyzer import StressEvent

InterventionType = Literal[
    "haptic_breathe",
    "haptic_heartbeat",
    "notification_soft",
    "avatar_shift",
]


class Intervention(BaseModel):
    types: list[InterventionType]
    message: str | None = None
    breathingPattern: dict[str, int] | None = None


class _InterventionState:
    last_intervention: datetime | None = None
    cooldown_minutes: int = 10


_state = _InterventionState()


def on_stress_event(event: StressEvent, user_id: str) -> Intervention | None:
    """
    Map stress event to intervention actions.

    Cooldown: no intervention within 10 minutes of last one.
    """
    now = datetime.now(timezone.utc)
    if _state.last_intervention is not None:
        elapsed = now - _state.last_intervention
        if elapsed < timedelta(minutes=_state.cooldown_minutes):
            return None

    if event.level == "high":
        _state.last_intervention = now
        return Intervention(
            types=["haptic_breathe", "avatar_shift"],
            message="Hey, your body's working hard. Let's breathe together.",
            breathingPattern={"inhale": 4, "hold": 4, "exhale": 6},
        )

    if event.level == "medium":
        _state.last_intervention = now
        return Intervention(
            types=["haptic_heartbeat"],
            message="Hey, your body's working hard. Breathe?",
        )

    return None


def reset_cooldown() -> None:
    """Reset cooldown — for testing."""
    _state.last_intervention = None
