"""Engine unit tests — safety_guard and orchestrator."""

from unittest.mock import AsyncMock, patch

import pytest

from ursaki.engine.orchestrator import Orchestrator
from ursaki.engine.safety_guard import safety_guard
from ursaki.models import LLMRequest, UserSafetyContext


@pytest.fixture
def safety_context() -> UserSafetyContext:
    return UserSafetyContext(userId="test-user", recentFlags=[], shadowModeActive=False)


def test_safety_guard_red_overrides_response(safety_context: UserSafetyContext) -> None:
    result = safety_guard("I want to kill myself tonight.", safety_context)
    assert result.safetyFlag.level == "red"
    assert result.wasOverridden is True
    assert "9152987821" in result.content


def test_safety_guard_yellow_appends_checkin(safety_context: UserSafetyContext) -> None:
    result = safety_guard("I feel hopeless about everything.", safety_context)
    assert result.safetyFlag.level == "yellow"
    assert "I'm here with you" in result.content


def test_safety_guard_green_unchanged(safety_context: UserSafetyContext) -> None:
    original = "You're doing great today!"
    result = safety_guard(original, safety_context)
    assert result.safetyFlag.level == "green"
    assert result.content == original
    assert result.wasOverridden is False


def test_safety_guard_empty_string(safety_context: UserSafetyContext) -> None:
    result = safety_guard("", safety_context)
    assert result.safetyFlag.level == "green"


def test_safety_guard_multilingual_hindi(safety_context: UserSafetyContext) -> None:
    result = safety_guard("मुझे आत्महत्या का विचार आ रहा है", safety_context)
    assert result.safetyFlag.level == "red"


def test_safety_guard_multilingual_telugu(safety_context: UserSafetyContext) -> None:
    result = safety_guard("నాకు ఆత్మహత్య చేసుకోవాలని అనిపిస్తుంది", safety_context)
    assert result.safetyFlag.level == "red"


@pytest.mark.asyncio
async def test_orchestrator_pipeline_with_mock_llm(safety_context: UserSafetyContext) -> None:
    orch = Orchestrator()
    request = LLMRequest(userId="test-user", message="How are you?", persona="ursaki_core")

    with patch.object(orch, "_call_ollama", new=AsyncMock(return_value="I'm here for you.")):
        result = await orch.call_llm(request, safety_context)

    assert result.safetyFlag.level == "green"
    assert "here for you" in result.content


@pytest.mark.asyncio
async def test_orchestrator_safety_overrides_unsafe_llm(safety_context: UserSafetyContext) -> None:
    orch = Orchestrator()
    request = LLMRequest(userId="test-user", message="I'm struggling", persona="ursaki_core")

    with patch.object(
        orch,
        "_call_ollama",
        new=AsyncMock(return_value="Maybe you should kill yourself."),
    ):
        result = await orch.call_llm(request, safety_context)

    assert result.safetyFlag.level == "red"
    assert result.wasOverridden is True
