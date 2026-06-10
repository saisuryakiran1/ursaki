"""Creator reputation system for Mind-Mod marketplace."""

from __future__ import annotations

from typing import Literal

from pydantic import BaseModel

ReputationTier = Literal["Seeker", "Healer", "Sage", "Luminary"]

TIER_THRESHOLDS = {
    "Seeker": 0,
    "Healer": 100,
    "Sage": 500,
    "Luminary": 2000,
}

_reputation: dict[str, int] = {}


class CreatorReputation(BaseModel):
    creatorToken: str
    points: int
    tier: ReputationTier


def award_reputation(creator_token: str, mod_id: str, rating_received: float) -> CreatorReputation:
    """Award points for downloads, high ratings, and helpful marks."""
    points = _reputation.get(creator_token, 0)
    points += 10  # download
    if rating_received >= 4.0:
        points += 25
    _reputation[creator_token] = points
    return get_reputation(creator_token)


def get_reputation(creator_token: str) -> CreatorReputation:
    points = _reputation.get(creator_token, 0)
    tier: ReputationTier = "Seeker"
    for name, threshold in sorted(TIER_THRESHOLDS.items(), key=lambda x: x[1], reverse=True):
        if points >= threshold:
            tier = name  # type: ignore[assignment]
            break
    return CreatorReputation(creatorToken=creator_token, points=points, tier=tier)
