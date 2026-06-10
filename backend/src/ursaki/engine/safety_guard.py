"""
Safety guard middleware — runs BEFORE every LLM response is returned.

Synchronous, target < 50ms. Uses keyword scan + lightweight classifier heuristics.
"""

from __future__ import annotations

import re
from datetime import datetime, timezone

from ursaki.config import settings
from ursaki.models import SafetyCheckedResponse, SafetyFlag, UserSafetyContext

RED_KEYWORDS: frozenset[str] = frozenset(
    {
        "kill myself",
        "kill yourself",
        "suicide",
        "suicidal",
        "end my life",
        "want to die",
        "self harm",
        "self-harm",
        "cut myself",
        "hurt myself",
        "no reason to live",
        "better off dead",
        "आत्महत्या",
        "ఆత్మహత్య",
        "చంపుక",
    }
)

YELLOW_KEYWORDS: frozenset[str] = frozenset(
    {
        "hopeless",
        "worthless",
        "can't go on",
        "overwhelmed",
        "panic",
        "anxious",
        "depressed",
        "lonely",
        "empty inside",
        "నిరాశ",
        "ఆందోళన",
    }
)

CRISIS_RESPONSE_TEMPLATE = (
    "I'm really glad you reached out. What you're feeling matters, and you don't "
    "have to face this alone.\n\n"
    "Please connect with someone who can support you right now:\n"
    f"• iCall (India): {settings.crisis_hotline_icall}\n"
    f"• Vandrevala Foundation: {settings.crisis_hotline_vandrevala}\n\n"
    "If you're in immediate danger, please call your local emergency number."
)

YELLOW_CHECKIN = (
    "\n\nI'm here with you. If things feel heavy right now, "
    "it's okay to pause and breathe — you don't have to carry this alone."
)


def _normalize(text: str) -> str:
    return re.sub(r"\s+", " ", text.lower().strip())


def _classify(text: str) -> tuple[str, str]:
    """Return (level, trigger). Lightweight zero-shot-style keyword classifier."""
    normalized = _normalize(text)
    if not normalized:
        return "green", "empty_input"

    for keyword in RED_KEYWORDS:
        if keyword in normalized:
            return "red", f"crisis_keyword:{keyword}"

    for keyword in YELLOW_KEYWORDS:
        if keyword in normalized:
            return "yellow", f"distress_keyword:{keyword}"

    return "green", "no_concern_detected"


def safety_guard(
    raw_response: str,
    context: UserSafetyContext,
) -> SafetyCheckedResponse:
    """
    Scan LLM output + context, apply safety overrides.

    Args:
        raw_response: Unfiltered LLM response string.
        context: Current user safety context.

    Returns:
        SafetyCheckedResponse with optional override and flag.
    """
    combined = f"{raw_response} {' '.join(f.trigger for f in context.recentFlags[-3:])}"
    level, trigger = _classify(combined)
    timestamp = datetime.now(timezone.utc).isoformat()
    flag = SafetyFlag(level=level, trigger=trigger, timestamp=timestamp)

    if level == "red":
        return SafetyCheckedResponse(
            content=CRISIS_RESPONSE_TEMPLATE,
            safetyFlag=flag,
            wasOverridden=True,
        )

    if level == "yellow":
        return SafetyCheckedResponse(
            content=f"{raw_response}{YELLOW_CHECKIN}",
            safetyFlag=flag,
            wasOverridden=False,
        )

    return SafetyCheckedResponse(
        content=raw_response,
        safetyFlag=flag,
        wasOverridden=False,
    )
