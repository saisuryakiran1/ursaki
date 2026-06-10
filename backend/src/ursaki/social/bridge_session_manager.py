"""Social Bridge — anonymous BLE proximity matching."""

from __future__ import annotations

import uuid
from datetime import datetime, timedelta, timezone

from pydantic import BaseModel, Field


class BridgeProfile(BaseModel):
    token: str
    comfortLevel: int = Field(ge=0, le=100)
    interestTags: list[str]
    isAdult: bool


class MatchResult(BaseModel):
    matchScore: float
    sharedInterests: list[str]
    distanceMeters: float
    icebreaker: str


_token_store: dict[str, datetime] = {}


def generate_anonymous_token(user_id: str) -> str:
    """Generate rotating anonymous session token (30 min TTL)."""
    token = str(uuid.uuid4())
    _token_store[token] = datetime.now(timezone.utc) + timedelta(minutes=30)
    return token


def _is_token_valid(token: str) -> bool:
    expiry = _token_store.get(token)
    if expiry is None:
        return True
    return datetime.now(timezone.utc) < expiry


def match_profiles(
    local_profile: BridgeProfile,
    nearby_profiles: list[BridgeProfile],
) -> list[MatchResult]:
    """Match local profile against nearby anonymous profiles."""
    if not local_profile.isAdult:
        return []

    results: list[MatchResult] = []

    for profile in nearby_profiles:
        if not profile.isAdult or not _is_token_valid(profile.token):
            continue

        shared = list(set(local_profile.interestTags) & set(profile.interestTags))
        if not shared:
            continue

        interest_score = len(shared) / max(
            len(local_profile.interestTags),
            len(profile.interestTags),
            1,
        )
        comfort_diff = abs(local_profile.comfortLevel - profile.comfortLevel) / 100.0
        comfort_score = 1.0 - comfort_diff
        match_score = (interest_score * 0.7) + (comfort_score * 0.3)

        if match_score <= 0.6:
            continue

        interest = shared[0]
        results.append(
            MatchResult(
                matchScore=round(match_score, 3),
                sharedInterests=shared,
                distanceMeters=10.0,
                icebreaker=(
                    f"There's someone nearby who also loves {interest} "
                    "and seems comfortable starting a conversation."
                ),
            )
        )

    return sorted(results, key=lambda r: r.matchScore, reverse=True)
