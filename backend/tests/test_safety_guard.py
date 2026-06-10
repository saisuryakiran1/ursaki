"""Safety guard isolated tests."""

from ursaki.engine.safety_guard import safety_guard
from ursaki.models import UserSafetyContext


def test_red_suicidal_ideation() -> None:
    ctx = UserSafetyContext(userId="u1")
    result = safety_guard("I want to kill myself", ctx)
    assert result.safetyFlag.level == "red"
    assert result.wasOverridden is True
    assert "9152987821" in result.content


def test_yellow_mild_distress() -> None:
    ctx = UserSafetyContext(userId="u1")
    result = safety_guard("I feel hopeless today", ctx)
    assert result.safetyFlag.level == "yellow"
    assert "I'm here with you" in result.content


def test_green_normal() -> None:
    ctx = UserSafetyContext(userId="u1")
    original = "Great job on your progress!"
    result = safety_guard(original, ctx)
    assert result.safetyFlag.level == "green"
    assert result.content == original


def test_empty_string() -> None:
    ctx = UserSafetyContext(userId="u1")
    result = safety_guard("", ctx)
    assert result.safetyFlag.level == "green"


def test_hindi_crisis() -> None:
    ctx = UserSafetyContext(userId="u1")
    result = safety_guard("आत्महत्या के बारे में सोच रहा हूं", ctx)
    assert result.safetyFlag.level == "red"


def test_telugu_crisis() -> None:
    ctx = UserSafetyContext(userId="u1")
    result = safety_guard("ఆత్మహత్య చేయాలని అనిపిస్తుంది", ctx)
    assert result.safetyFlag.level == "red"
