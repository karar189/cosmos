from __future__ import annotations

from fastapi import APIRouter

from .business_impact_agent import generate_business_impact_report
from .business_impact_email import send_business_impact_email
from .business_impact_models import (
    BusinessImpactProfile,
    BusinessImpactResponse,
    DashboardNewsRequest,
    EmailReportRequest,
)
from .business_impact_news import fetch_market_signals, summarize_sentiment


router = APIRouter(tags=["business-impact"])


@router.post("/agent/business-impact-report", response_model=BusinessImpactResponse)
async def create_business_impact_report(
    profile: BusinessImpactProfile,
) -> BusinessImpactResponse:
    signals = await fetch_market_signals(profile, lookback_hours=24, max_signals=12)
    sentiment = summarize_sentiment(signals)
    report = generate_business_impact_report(profile, signals)

    return BusinessImpactResponse(
        business=profile.business_name,
        industry=profile.industry,
        location=profile.location,
        geographies=profile.geographies,
        operations_geographies=profile.operations_geographies,
        signals_found=signals,
        sentiment_overview=sentiment,
        report=report,
    )


@router.post("/agent/business-impact-news")
async def get_business_impact_news(req: DashboardNewsRequest) -> dict:
    signals = await fetch_market_signals(
        req.profile,
        lookback_hours=req.lookback_hours,
        max_signals=req.max_signals,
    )
    return {
        "business": req.profile.business_name,
        "industry": req.profile.industry,
        "location": req.profile.location,
        "geographies": req.profile.geographies,
        "operations_geographies": req.profile.operations_geographies,
        "sentiment_overview": summarize_sentiment(signals).model_dump(),
        "signals_found": [s.model_dump() for s in signals],
    }


@router.post("/agent/business-impact-report/email")
async def send_business_impact_report_email(req: EmailReportRequest) -> dict:
    signals = await fetch_market_signals(req.profile, lookback_hours=req.lookback_hours, max_signals=12)
    sentiment = summarize_sentiment(signals)
    report = generate_business_impact_report(req.profile, signals)

    result = BusinessImpactResponse(
        business=req.profile.business_name,
        industry=req.profile.industry,
        location=req.profile.location,
        geographies=req.profile.geographies,
        operations_geographies=req.profile.operations_geographies,
        signals_found=signals,
        sentiment_overview=sentiment,
        report=report,
    )

    send_business_impact_email(req.recipient_email, result)

    return {
        "status": "sent",
        "recipient": req.recipient_email,
        "urgency_level": result.report.urgency_level,
        "signals_count": len(signals),
    }
