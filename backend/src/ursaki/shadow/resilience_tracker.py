"""Resilience XP tracker for Shadow Mode."""

from __future__ import annotations


from ursaki.models import ResilienceSkill, ResilienceStats

_xp_store: dict[str, dict[str, int]] = {}
_streak_store: dict[str, int] = {}


class ResilienceTracker:
    """Track XP and streaks per user."""

    XP_PER_LEVEL = 100

    def track_xp(self, user_id: str, xp_gained: int, skill: ResilienceSkill) -> ResilienceStats:
        if user_id not in _xp_store:
            _xp_store[user_id] = {"Resilience": 0, "Articulation": 0, "Clarity": 0}
        _xp_store[user_id][skill] = _xp_store[user_id].get(skill, 0) + xp_gained
        return self.get_stats(user_id)

    def get_stats(self, user_id: str) -> ResilienceStats:
        skills = _xp_store.get(user_id, {})
        total = sum(skills.values())
        level = max(1, total // self.XP_PER_LEVEL + 1)
        return ResilienceStats(
            level=level,
            totalXP=total,
            streakDays=_streak_store.get(user_id, 0),
        )

    def increment_streak(self, user_id: str) -> None:
        _streak_store[user_id] = _streak_store.get(user_id, 0) + 1


resilience_tracker = ResilienceTracker()
