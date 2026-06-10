"""Biometric / HRV routes."""

from fastapi import APIRouter
from pydantic import BaseModel

from ursaki.biometric.hrv_analyzer import analyze_hrv
from ursaki.biometric.intervention_engine import Intervention, on_stress_event

router = APIRouter(prefix="/biometric", tags=["biometric"])


class AnalyzeRequest(BaseModel):
    userId: str
    rrIntervalsMs: list[float]
    isStationary: bool = True


class AnalyzeResponse(BaseModel):
    stressDetected: bool
    intervention: Intervention | None = None


@router.post("/analyze", response_model=AnalyzeResponse)
async def analyze_biometric(body: AnalyzeRequest) -> AnalyzeResponse:
    event = analyze_hrv(body.rrIntervalsMs, body.isStationary)
    if event is None:
        return AnalyzeResponse(stressDetected=False)
    intervention = on_stress_event(event, body.userId)
    return AnalyzeResponse(stressDetected=True, intervention=intervention)
