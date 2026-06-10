"""Avatar state manager tests."""

from ursaki.avatar.avatar_state_manager import compute_avatar_state
from ursaki.models import EmotionSnapshot


def test_high_anxiety_high_armor_gray_color() -> None:
    history = [
        EmotionSnapshot(
            timestamp="2026-01-01T00:00:00Z",
            valence=-0.6,
            arousal=0.8,
            dominance=0.4,
            source="text",
        )
        for _ in range(5)
    ]
    state = compute_avatar_state(history)
    assert state.armorLevel > 0.5
    assert state.form in ("armored", "volcanic", "neutral")


def test_high_joy_high_crystallinity_warm_color() -> None:
    history = [
        EmotionSnapshot(
            timestamp="2026-01-01T00:00:00Z",
            valence=0.7,
            arousal=0.3,
            dominance=0.6,
            source="text",
        )
        for _ in range(5)
    ]
    state = compute_avatar_state(history)
    assert state.crystallinity > 0.5
    assert state.form in ("radiant", "calm_crystal")


def test_panic_softening_state() -> None:
    history = [
        EmotionSnapshot(
            timestamp="2026-01-01T00:00:00Z",
            valence=-0.5,
            arousal=0.9,
            dominance=0.3,
            source="hrv",
        )
    ]
    state = compute_avatar_state(history)
    assert state.form == "softening"
    assert state.animationSpeed == 0.3
