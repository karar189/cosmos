from __future__ import annotations

from typing import Literal

from pydantic import BaseModel, Field


class BusinessImpactProfile(BaseModel):
    business_name: str = Field(..., min_length=2, max_length=120)
    industry: str = Field(..., min_length=2, max_length=200)
    location: str = Field(..., min_length=2, max_length=120)
    description: str = Field(..., min_length=20, max_length=4000)
    target_market: str = Field(..., min_length=2, max_length=4000)
    business_model: str | None = Field(default=None, max_length=500)
    risk_focus: list[str] = Field(default_factory=list)
    geographies: list[str] = Field(default_factory=list, description="Where the business has customers/users")
    operations_geographies: list[str] = Field(default_factory=list, description="Where the business has legal/ops footprint")


class MarketSignal(BaseModel):
    id: str
    title: str
    url: str
    source: str | None = None
    summary: str | None = None
    published_date: str | None = None
    sentiment: Literal["up", "down", "neutral"]
    sentiment_score: float = Field(..., ge=-1.0, le=1.0)
    impact_score: float = Field(..., ge=1.0, le=10.0)
    category: str


class SentimentOverview(BaseModel):
    positive: int = 0
    negative: int = 0
    neutral: int = 0
    average_sentiment_score: float = 0.0
    average_impact_score: float = 0.0


class ReportInsight(BaseModel):
    text: str
    signal_ids: list[str] = Field(default_factory=list)


class ImpactReport(BaseModel):
    executive_summary: str
    key_signals: list[ReportInsight] = Field(default_factory=list)
    risks: list[ReportInsight] = Field(default_factory=list)
    opportunities: list[ReportInsight] = Field(default_factory=list)
    compliance_impact: list[ReportInsight] = Field(default_factory=list)
    recommended_actions: list[ReportInsight] = Field(default_factory=list)
    urgency_level: Literal["Low", "Medium", "High"]
    final_recommendation: str
    data_quality: Literal["strong", "moderate", "limited"] = "moderate"
    confidence: float = Field(..., ge=0.0, le=1.0)
    disclaimer: str = "This report is informational and not legal advice."


class BusinessImpactResponse(BaseModel):
    business: str
    industry: str
    location: str
    geographies: list[str] = Field(default_factory=list)
    operations_geographies: list[str] = Field(default_factory=list)
    signals_found: list[MarketSignal] = Field(default_factory=list)
    sentiment_overview: SentimentOverview
    report: ImpactReport


class DashboardNewsRequest(BaseModel):
    profile: BusinessImpactProfile
    max_signals: int = Field(default=20, ge=1, le=100)
    lookback_hours: int = Field(default=24, ge=6, le=168)


class EmailReportRequest(BaseModel):
    profile: BusinessImpactProfile
    recipient_email: str = Field(..., min_length=5, max_length=320)
    lookback_hours: int = Field(default=24, ge=6, le=168)


class DailyScheduledProfile(BaseModel):
    profile: BusinessImpactProfile
    recipient_email: str = Field(..., min_length=5, max_length=320)


class DailyDigestConfig(BaseModel):
    timezone: str = "UTC"
    send_hour_24: int = Field(default=20, ge=0, le=23)
    profiles: list[DailyScheduledProfile] = Field(default_factory=list)
