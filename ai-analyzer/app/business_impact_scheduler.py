from __future__ import annotations

import json
import sys
from zoneinfo import ZoneInfo

try:
    from apscheduler.schedulers.asyncio import AsyncIOScheduler  # type: ignore
    from apscheduler.triggers.cron import CronTrigger  # type: ignore
except ImportError:
    AsyncIOScheduler = None  # type: ignore
    CronTrigger = None  # type: ignore

from .business_impact_models import BusinessImpactProfile, DailyDigestConfig
from .business_impact_news import fetch_market_signals, summarize_sentiment
from .business_impact_agent import generate_business_impact_report
from .business_impact_email import send_business_impact_email
from .business_impact_models import BusinessImpactResponse


async def run_daily_digest_from_config(config_json: str) -> None:
    try:
        raw = json.loads(config_json)
        config = DailyDigestConfig(**raw)
    except Exception as exc:
        print(f"[business-impact-scheduler] invalid DAILY_IMPACT_EMAIL_CONFIG: {exc}", file=sys.stderr)
        return

    for entry in config.profiles:
        try:
            await _generate_and_send(entry.profile, entry.recipient_email)
            print(
                f"[business-impact-scheduler] sent daily impact email to {entry.recipient_email}",
                file=sys.stderr,
            )
        except Exception as exc:
            print(
                f"[business-impact-scheduler] send failed for {entry.recipient_email}: {exc}",
                file=sys.stderr,
            )


async def _generate_and_send(profile: BusinessImpactProfile, recipient_email: str) -> None:
    signals = await fetch_market_signals(profile, lookback_hours=24, max_signals=12)
    sentiment = summarize_sentiment(signals)
    report = generate_business_impact_report(profile, signals)
    result = BusinessImpactResponse(
        business=profile.business_name,
        industry=profile.industry,
        location=profile.location,
        geographies=profile.geographies,
        operations_geographies=profile.operations_geographies,
        signals_found=signals,
        sentiment_overview=sentiment,
        report=report,
    )
    send_business_impact_email(recipient_email, result)


def create_business_impact_scheduler(config_json: str) -> "AsyncIOScheduler":
    if AsyncIOScheduler is None or CronTrigger is None:
        raise RuntimeError("apscheduler is not installed")

    config = DailyDigestConfig(**json.loads(config_json))
    timezone_name = config.timezone or "UTC"

    scheduler = AsyncIOScheduler(timezone=timezone_name)
    scheduler.add_job(
        run_daily_digest_from_config,
        trigger=CronTrigger(hour=config.send_hour_24, minute=0, timezone=ZoneInfo(timezone_name)),
        id="daily_business_impact_email",
        replace_existing=True,
        kwargs={"config_json": config_json},
    )

    return scheduler
