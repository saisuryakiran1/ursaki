"""Chat / LLM orchestration routes."""

from fastapi import APIRouter

from ursaki.engine.orchestrator import orchestrator
from ursaki.models import LLMRequest, SafetyCheckedResponse, UserSafetyContext

router = APIRouter(prefix="/chat", tags=["chat"])


@router.post("/message", response_model=SafetyCheckedResponse)
async def send_message(
    request: LLMRequest,
    user_id: str = "default",
) -> SafetyCheckedResponse:
    context = UserSafetyContext(userId=user_id, shadowModeActive=request.shadowModeActive)
    return await orchestrator.call_llm(request, context)
