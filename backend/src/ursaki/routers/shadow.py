"""Shadow Mode routes."""

from fastapi import APIRouter, HTTPException
from pydantic import BaseModel

from ursaki.models import GroundingExercise, SafetyCheckedResponse
from ursaki.shadow.resilience_tracker import resilience_tracker
from ursaki.shadow.shadow_session_manager import (
    ShadowSession,
    create_session,
    generate_shadow_response,
    get_session,
    terminate_session,
)

router = APIRouter(prefix="/shadow", tags=["shadow"])


class CreateSessionRequest(BaseModel):
    userId: str
    shadowTopics: list[str]


class ShadowMessageRequest(BaseModel):
    sessionId: str
    message: str


@router.post("/session", response_model=ShadowSession)
async def start_session(body: CreateSessionRequest) -> ShadowSession:
    return create_session(body.userId, body.shadowTopics)


@router.post("/message", response_model=SafetyCheckedResponse)
async def shadow_message(body: ShadowMessageRequest) -> SafetyCheckedResponse:
    session = get_session(body.sessionId)
    if session is None:
        raise HTTPException(status_code=404, detail="Session not found")
    return await generate_shadow_response(session, body.message)


@router.post("/session/{session_id}/terminate", response_model=GroundingExercise)
async def end_session(session_id: str) -> GroundingExercise:
    return terminate_session(session_id)


@router.get("/stats/{user_id}")
async def get_resilience_stats(user_id: str) -> dict:
    return resilience_tracker.get_stats(user_id).model_dump()
