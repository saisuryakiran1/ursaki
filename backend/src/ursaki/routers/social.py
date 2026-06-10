"""Social Bridge routes."""

from fastapi import APIRouter
from pydantic import BaseModel

from ursaki.social.bridge_session_manager import (
    BridgeProfile,
    MatchResult,
    generate_anonymous_token,
    match_profiles,
)

router = APIRouter(prefix="/social", tags=["social"])


class MatchRequest(BaseModel):
    localProfile: BridgeProfile
    nearbyProfiles: list[BridgeProfile]


@router.get("/token/{user_id}")
async def get_token(user_id: str) -> dict[str, str]:
    return {"token": generate_anonymous_token(user_id)}


@router.post("/match", response_model=list[MatchResult])
async def match(body: MatchRequest) -> list[MatchResult]:
    return match_profiles(body.localProfile, body.nearbyProfiles)
