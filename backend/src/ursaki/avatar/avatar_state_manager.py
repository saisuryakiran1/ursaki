"""Avatar state computation from emotional history."""

from __future__ import annotations

from ursaki.models import AvatarState, EmotionSnapshot


def _hsl_to_hex(h: float, s: float, lightness: float) -> str:
    """Convert HSL to hex color string."""
    import colorsys

    r, g, b = colorsys.hls_to_rgb(h / 360.0, lightness / 100.0, s / 100.0)
    return f"#{int(r * 255):02x}{int(g * 255):02x}{int(b * 255):02x}"


def _detect_panic(emotion_history: list[EmotionSnapshot]) -> bool:
    """Detect panic: HRV spike + low valence in recent snapshots."""
    hrv_snapshots = [e for e in emotion_history[-5:] if e.source == "hrv"]
    if not hrv_snapshots:
        return False
    latest = hrv_snapshots[-1]
    return latest.arousal > 0.8 and latest.valence < -0.3


def compute_avatar_state(emotion_history: list[EmotionSnapshot]) -> AvatarState:
    """
    Compute procedural avatar state from emotional journey.

    High arousal + low valence → armor increases.
    High valence + low arousal → crystallinity increases.
    Dominance → presence/size.
    """
    if not emotion_history:
        return AvatarState(
            form="seed",
            colorHex="#7B6FFF",
            armorLevel=0.3,
            crystallinity=0.3,
            animationSpeed=1.0,
            presence=0.5,
        )

    avg_valence = sum(e.valence for e in emotion_history) / len(emotion_history)
    avg_arousal = sum(e.arousal for e in emotion_history) / len(emotion_history)
    avg_dominance = sum(e.dominance for e in emotion_history) / len(emotion_history)

    armor = min(1.0, max(0.0, (avg_arousal * 0.6) + (max(0, -avg_valence) * 0.4)))
    crystallinity = min(1.0, max(0.0, (max(0, avg_valence) * 0.6) + ((1 - avg_arousal) * 0.4)))
    presence = min(1.0, max(0.2, avg_dominance))

    if avg_valence > 0.3 and avg_arousal < 0.4:
        color_hex = _hsl_to_hex(200, 55, 65)
        form = "calm_crystal"
    elif avg_valence > 0.2:
        color_hex = _hsl_to_hex(50, 80, 60)
        form = "radiant"
    elif avg_arousal > 0.6 and avg_valence < 0:
        color_hex = _hsl_to_hex(270, 25, 45)
        form = "armored"
    elif avg_valence < -0.2 and avg_arousal > 0.5:
        color_hex = _hsl_to_hex(5, 75, 45)
        form = "volcanic"
    else:
        color_hex = _hsl_to_hex(190, 50, 55)
        form = "neutral"

    animation_speed = 1.0

    if _detect_panic(emotion_history):
        color_hex = _hsl_to_hex(210, 60, 70)
        animation_speed = 0.3
        form = "softening"
        armor = max(0.0, armor - 0.2)

    return AvatarState(
        form=form,
        colorHex=color_hex,
        armorLevel=round(armor, 3),
        crystallinity=round(crystallinity, 3),
        animationSpeed=animation_speed,
        presence=round(presence, 3),
    )
