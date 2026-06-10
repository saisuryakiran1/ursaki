"""Shadow Self session manager with clinical safety guardrails."""

from __future__ import annotations

import uuid
from datetime import datetime, timedelta, timezone

from ursaki.engine.orchestrator import orchestrator
from ursaki.engine.safety_guard import safety_guard
from ursaki.models import (
    GroundingExercise,
    GroundingStep,
    LLMRequest,
    SafetyCheckedResponse,
    SafetyFlag,
    UserSafetyContext,
)
from pydantic import BaseModel, Field

SESSION_LIMIT_MINUTES = 15
MAX_TURNS = 50

FORBIDDEN_TOPICS = frozenset(
    {"violence", "self-harm methods", "weapons", "suicide methods", "illegal acts"}
)


class ShadowSession(BaseModel):
    sessionId: str
    userId: str
    topics: list[str]
    startTime: datetime
    turnCount: int = 0
    safetyFlags: list[SafetyFlag] = Field(default_factory=list)
    active: bool = True


_sessions: dict[str, ShadowSession] = {}


def create_session(user_id: str, shadow_topics: list[str]) -> ShadowSession:
    """Create a new Shadow Mode session with user-defined topics."""
    session = ShadowSession(
        sessionId=str(uuid.uuid4()),
        userId=user_id,
        topics=shadow_topics,
        startTime=datetime.now(timezone.utc),
    )
    _sessions[session.sessionId] = session
    return session


def _session_expired(session: ShadowSession) -> bool:
    elapsed = datetime.now(timezone.utc) - session.startTime
    return elapsed > timedelta(minutes=SESSION_LIMIT_MINUTES)


def _validate_topics(topics: list[str]) -> bool:
    for topic in topics:
        normalized = topic.lower()
        if any(forbidden in normalized for forbidden in FORBIDDEN_TOPICS):
            return False
    return True


async def generate_shadow_response(
    session: ShadowSession,
    user_message: str,
) -> SafetyCheckedResponse:
    """Generate Shadow persona response with safety pipeline."""
    if not session.active or _session_expired(session):
        session.active = False
        return SafetyCheckedResponse(
            content="Session time limit reached. Let's move to grounding.",
            safetyFlag=SafetyFlag(
                level="yellow",
                trigger="session_expired",
                timestamp=datetime.now(timezone.utc).isoformat(),
            ),
            wasOverridden=True,
        )

    if not _validate_topics(session.topics):
        return SafetyCheckedResponse(
            content="Session topics contain restricted content. Session terminated.",
            safetyFlag=SafetyFlag(
                level="red",
                trigger="forbidden_topic",
                timestamp=datetime.now(timezone.utc).isoformat(),
            ),
            wasOverridden=True,
        )

    session.turnCount += 1
    context = UserSafetyContext(
        userId=session.userId,
        recentFlags=session.safetyFlags,
        shadowModeActive=True,
    )

    topic_context = ", ".join(session.topics)
    request = LLMRequest(
        userId=session.userId,
        message=f"[Shadow topics: {topic_context}] {user_message}",
        persona="shadow_self",
        shadowModeActive=True,
    )

    response = await orchestrator.call_llm(request, context)
    session.safetyFlags.append(response.safetyFlag)

    if response.safetyFlag.level == "red":
        session.active = False

    return response


def terminate_session(session_id: str) -> GroundingExercise:
    """Terminate session and return mandatory grounding exercise."""
    session = _sessions.get(session_id)
    if session:
        session.active = False

    return GroundingExercise(
        sessionId=session_id,
        steps=[
            GroundingStep(step=5, instruction="Name 5 things you can see.", durationSeconds=30),
            GroundingStep(step=4, instruction="Name 4 things you can touch.", durationSeconds=25),
            GroundingStep(step=3, instruction="Name 3 things you can hear.", durationSeconds=20),
            GroundingStep(step=2, instruction="Name 2 things you can smell.", durationSeconds=15),
            GroundingStep(step=1, instruction="Name 1 thing you can taste.", durationSeconds=15),
        ],
    )


def get_session(session_id: str) -> ShadowSession | None:
    return _sessions.get(session_id)
