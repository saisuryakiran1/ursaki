"""Mind-Mod marketplace manager."""

from __future__ import annotations

import uuid
from datetime import datetime, timezone

from pydantic import BaseModel

from ursaki.models import EmotionSnapshot


class MindMod(BaseModel):
    modId: str
    creatorToken: str
    title: str
    description: str
    technique: str
    musicPlaylist: list[str] | None = None
    breathingPattern: dict[str, int] | None = None
    affirmations: list[str] | None = None
    usageCount: int = 0
    avgEffectivenessRating: float = 0.0
    ratingCount: int = 0
    tags: list[str]
    createdAt: datetime


_mods: dict[str, MindMod] = {}
_ratings: dict[str, list[float]] = {}


def create_mod(creator_id: str, mod_data: dict) -> MindMod:
    mod = MindMod(
        modId=str(uuid.uuid4()),
        creatorToken=str(uuid.uuid5(uuid.NAMESPACE_OID, creator_id)),
        createdAt=datetime.now(timezone.utc),
        **mod_data,
    )
    _mods[mod.modId] = mod
    return mod


def rate_mod(
    user_id: str,
    mod_id: str,
    effectiveness_rating: float,
    emotion_before: EmotionSnapshot,
    emotion_after: EmotionSnapshot,
) -> MindMod | None:
    """Rate a mod using Bayesian average (min 5 ratings for public display)."""
    mod = _mods.get(mod_id)
    if mod is None:
        return None

    if mod_id not in _ratings:
        _ratings[mod_id] = []
    _ratings[mod_id].append(effectiveness_rating)

    ratings = _ratings[mod_id]
    prior_mean = 3.5
    prior_weight = 5
    bayesian = (prior_mean * prior_weight + sum(ratings)) / (prior_weight + len(ratings))

    mod.avgEffectivenessRating = round(bayesian, 2)
    mod.ratingCount = len(ratings)
    return mod


def get_recommended_mods(
    user_id: str,
    current_emotion: EmotionSnapshot,
) -> list[MindMod]:
    """Recommend mods by tag/emotion similarity."""
    if not _mods:
        return []

    def score(mod: MindMod) -> float:
        tag_bonus = sum(1 for t in mod.tags if t.lower() in ("calm", "anxiety", "joy", "focus"))
        valence_match = 1.0 - abs(current_emotion.valence)
        return mod.avgEffectivenessRating * 0.5 + tag_bonus * 0.3 + valence_match * 0.2

    return sorted(_mods.values(), key=score, reverse=True)[:10]


def list_mods() -> list[MindMod]:
    return list(_mods.values())
