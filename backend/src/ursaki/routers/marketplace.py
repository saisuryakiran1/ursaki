"""Marketplace routes."""

from fastapi import APIRouter, HTTPException
from pydantic import BaseModel

from ursaki.marketplace.mod_manager import (
    MindMod,
    create_mod,
    get_recommended_mods,
    list_mods,
    rate_mod,
)
from ursaki.marketplace.reputation_system import get_reputation
from ursaki.models import EmotionSnapshot

router = APIRouter(prefix="/marketplace", tags=["marketplace"])


class CreateModRequest(BaseModel):
    creatorId: str
    title: str
    description: str
    technique: str
    tags: list[str]
    musicPlaylist: list[str] | None = None
    breathingPattern: dict[str, int] | None = None
    affirmations: list[str] | None = None


class RateModRequest(BaseModel):
    userId: str
    modId: str
    effectivenessRating: float
    emotionBefore: EmotionSnapshot
    emotionAfter: EmotionSnapshot


@router.get("/mods", response_model=list[MindMod])
async def get_mods() -> list[MindMod]:
    return list_mods()


@router.post("/mods", response_model=MindMod)
async def post_mod(body: CreateModRequest) -> MindMod:
    return create_mod(body.creatorId, body.model_dump(exclude={"creatorId"}))


@router.post("/mods/rate", response_model=MindMod)
async def post_rating(body: RateModRequest) -> MindMod:
    mod = rate_mod(
        body.userId,
        body.modId,
        body.effectivenessRating,
        body.emotionBefore,
        body.emotionAfter,
    )
    if mod is None:
        raise HTTPException(status_code=404, detail="Mod not found")
    return mod


@router.post("/mods/recommend", response_model=list[MindMod])
async def recommend(user_id: str, emotion: EmotionSnapshot) -> list[MindMod]:
    return get_recommended_mods(user_id, emotion)


@router.get("/reputation/{creator_token}")
async def reputation(creator_token: str) -> dict:
    return get_reputation(creator_token).model_dump()
