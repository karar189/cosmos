# APScheduler configuration for compliance scraper jobs.
from __future__ import annotations

import sys

try:
    from apscheduler.schedulers.asyncio import AsyncIOScheduler  # type: ignore
    from apscheduler.triggers.cron import CronTrigger  # type: ignore
    from apscheduler.triggers.interval import IntervalTrigger  # type: ignore
except ImportError:
    AsyncIOScheduler = None  # type: ignore
    CronTrigger = None  # type: ignore
    IntervalTrigger = None  # type: ignore

from scraper.scraper_runner import run_all_scrapers, run_scraper


async def _run_ofac_job() -> None:
    try:
        results = await run_scraper("OFAC")
        changed = sum(1 for r in results if r.get("changed"))
        print(f"[scheduler] OFAC job done — {len(results)} docs, {changed} changed", file=sys.stderr)
    except Exception as exc:
        print(f"[scheduler] OFAC job error: {exc}", file=sys.stderr)


async def _run_all_job() -> None:
    try:
        results = await run_all_scrapers()
        changed = sum(1 for r in results if r.get("changed"))
        print(f"[scheduler] daily job done — {len(results)} docs, {changed} changed", file=sys.stderr)
    except Exception as exc:
        print(f"[scheduler] daily job error: {exc}", file=sys.stderr)


def create_scheduler() -> "AsyncIOScheduler":
    if AsyncIOScheduler is None:
        raise RuntimeError("apscheduler is not installed. Run: pip install apscheduler")

    scheduler = AsyncIOScheduler(timezone="UTC")

    # Daily run at 02:00 UTC — all scrapers.
    scheduler.add_job(
        _run_all_job,
        trigger=CronTrigger(hour=2, minute=0, timezone="UTC"),
        id="daily_all_scrapers",
        replace_existing=True,
    )

    # Every 30 minutes — OFAC only.
    scheduler.add_job(
        _run_ofac_job,
        trigger=IntervalTrigger(minutes=30),
        id="ofac_30min",
        replace_existing=True,
    )

    return scheduler


async def start_scheduler(scheduler: "AsyncIOScheduler") -> None:
    scheduler.start()
    print("[scheduler] started (daily@2am UTC + OFAC every 30min)", file=sys.stderr)
