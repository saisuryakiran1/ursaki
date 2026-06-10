"""HRV analysis — RMSSD computation and stress detection."""

from __future__ import annotations

import math
from typing import Literal

from pydantic import BaseModel

StressLevel = Literal["high", "medium", "low"]
StressType = Literal["panic_risk", "elevated"]


class StressEvent(BaseModel):
    level: StressLevel
    type: StressType
    rmssd: float


def compute_rmssd(rr_intervals_ms: list[float]) -> float:
    """Compute RMSSD from RR intervals in milliseconds."""
    if len(rr_intervals_ms) < 2:
        return 0.0
    diffs = [
        (rr_intervals_ms[i + 1] - rr_intervals_ms[i]) ** 2
        for i in range(len(rr_intervals_ms) - 1)
    ]
    return math.sqrt(sum(diffs) / len(diffs))


def compute_stress_level(
    rmssd: float,
    is_stationary: bool,
) -> StressEvent | None:
    """
    Determine stress level from RMSSD.

    Suppresses detection when user is in motion (exercise false positives).
    """
    if not is_stationary:
        return None

    if rmssd < 20:
        return StressEvent(level="high", type="panic_risk", rmssd=rmssd)
    if rmssd < 50:
        return StressEvent(level="medium", type="elevated", rmssd=rmssd)
    return None


def analyze_hrv(
    rr_intervals_ms: list[float],
    is_stationary: bool,
) -> StressEvent | None:
    """Full HRV analysis pipeline."""
    if not rr_intervals_ms:
        return None
    rmssd = compute_rmssd(rr_intervals_ms)
    return compute_stress_level(rmssd, is_stationary)
