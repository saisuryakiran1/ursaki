"""HRV analyzer tests."""

from ursaki.biometric.hrv_analyzer import analyze_hrv, compute_rmssd
from ursaki.biometric.intervention_engine import on_stress_event, reset_cooldown


def test_low_rmssd_stationary_high_stress() -> None:
    rr = [800.0, 801.0, 799.0, 800.0, 802.0]
    event = analyze_hrv(rr, is_stationary=True)
    assert event is not None
    assert event.level == "high"
    assert event.type == "panic_risk"


def test_normal_rmssd_in_motion_no_false_positive() -> None:
    rr = [800.0, 810.0, 805.0, 815.0, 808.0]
    event = analyze_hrv(rr, is_stationary=False)
    assert event is None


def test_empty_rr_intervals() -> None:
    assert analyze_hrv([], is_stationary=True) is None
    assert compute_rmssd([]) == 0.0


def test_red_stress_dual_intervention() -> None:
    reset_cooldown()
    from ursaki.biometric.hrv_analyzer import StressEvent

    event = StressEvent(level="high", type="panic_risk", rmssd=15.0)
    intervention = on_stress_event(event, "user1")
    assert intervention is not None
    assert "haptic_breathe" in intervention.types
    assert "avatar_shift" in intervention.types


def test_yellow_stress_heartbeat_only() -> None:
    reset_cooldown()
    from ursaki.biometric.hrv_analyzer import StressEvent

    event = StressEvent(level="medium", type="elevated", rmssd=35.0)
    intervention = on_stress_event(event, "user1")
    assert intervention is not None
    assert intervention.types == ["haptic_heartbeat"]
