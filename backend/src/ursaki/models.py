"""Shared Pydantic domain models for UrSaKi backend."""

from __future__ import annotations

from datetime import datetime
from typing import Literal

from pydantic import BaseModel, Field

EmotionSource = Literal["text", "hrv", "voice"]
SafetyLevel = Literal["green", "yellow", "red"]
ResilienceSkill = Literal["Resilience", "Articulation", "Clarity"]


class EmotionSnapshot(BaseModel):
    timestamp: str
    valence: float = Field(ge=-1.0, le=1.0)
    arousal: float = Field(ge=0.0, le=1.0)
    dominance: float = Field(ge=0.0, le=1.0)
    source: EmotionSource


class AvatarState(BaseModel):
    form: str
    colorHex: str
    armorLevel: float = Field(ge=0.0, le=1.0)
    crystallinity: float = Field(ge=0.0, le=1.0)
    animationSpeed: float = Field(default=1.0, ge=0.1, le=2.0)
    presence: float = Field(default=0.5, ge=0.0, le=1.0)


class MemoryNode(BaseModel):
    id: str
    emotionType: str
    intensity: float = Field(ge=0.0, le=1.0)
    date: str
    spatialCoords: tuple[float, float, float]


class SafetyFlag(BaseModel):
    level: SafetyLevel
    trigger: str
    timestamp: str


class SafetyCheckedResponse(BaseModel):
    content: str
    safetyFlag: SafetyFlag
    wasOverridden: bool


class UserSafetyContext(BaseModel):
    userId: str
    recentFlags: list[SafetyFlag] = Field(default_factory=list)
    shadowModeActive: bool = False
    isMinor: bool = False


class PersonaConfig(BaseModel):
    name: str
    system_prompt: str
    temperature: float
    tone_descriptors: list[str]
    is_shadow_mode: bool = False


class LLMRequest(BaseModel):
    userId: str
    message: str
    persona: str = "ursaki_core"
    shadowModeActive: bool = False


class ResilienceStats(BaseModel):
    level: int = 1
    totalXP: int = 0
    streakDays: int = 0


class GroundingStep(BaseModel):
    step: int
    instruction: str
    durationSeconds: int


class GroundingExercise(BaseModel):
    sessionId: str
    steps: list[GroundingStep]
    completedAt: datetime | None = None
