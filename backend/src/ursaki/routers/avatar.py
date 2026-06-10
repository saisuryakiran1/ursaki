"""Avatar computation routes."""

from fastapi import APIRouter
from pydantic import BaseModel

from ursaki.avatar.avatar_state_manager import compute_avatar_state
from ursaki.models import AvatarState, EmotionSnapshot

router = APIRouter(prefix="/avatar", tags=["avatar"])


class ComputeAvatarRequest(BaseModel):
    userId: str
    emotionHistory: list[EmotionSnapshot]


@router.post("/compute", response_model=AvatarState)
async def compute_avatar(body: ComputeAvatarRequest) -> AvatarState:
    return compute_avatar_state(body.emotionHistory)
