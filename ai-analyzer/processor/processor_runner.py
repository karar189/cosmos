"""Orchestrates scraping + LLM normalization with change detection.

Change detection: only call the LLM when content_hash has changed since last run.
This keeps OpenAI costs low — most sources don't change daily.
"""
from __future__ import annotations

import asyncio
import sys

from scraper.scraper_runner import run_all_scrapers, run_scraper
from processor.normalizer import normalize
from app.regintel.db import save_regulation


def _should_normalize(scrape_result: dict) -> bool:
    """Only normalize if content actually changed (or is new)."""
    return scrape_result.get("changed", True)


async def process_all() -> list[dict]:
    """Scrape all sources, normalize changed ones, return full result list."""
    scrape_results = await run_all_scrapers()

    normalized = []
    skipped = 0

    for result in scrape_results:
        if not _should_normalize(result):
            skipped += 1
            print(
                f"[processor] skipping {result.get('source_name')} — content unchanged",
                file=sys.stderr,
            )
            continue

        print(f"[processor] normalizing {result.get('source_name')} ...", file=sys.stderr)
        norm = normalize(result)
        if norm:
            reg_id = await save_regulation(result, norm)
            norm["_id"] = reg_id
            normalized.append(norm)
            print(f"[processor] saved regulation {reg_id} for {result.get('source_name')}", file=sys.stderr)
        else:
            print(
                f"[processor] normalization failed for {result.get('source_name')}",
                file=sys.stderr,
            )

    print(
        f"[processor] done — {len(normalized)} normalized, {skipped} skipped (unchanged)",
        file=sys.stderr,
    )
    return normalized


async def process_source(name: str) -> list[dict]:
    """Scrape and normalize a single source by name. Always normalizes (ignores change flag)."""
    scrape_results = await run_scraper(name)

    normalized = []
    for result in scrape_results:
        print(f"[processor] normalizing {result.get('source_name')} ...", file=sys.stderr)
        norm = normalize(result)
        if norm:
            reg_id = await save_regulation(result, norm)
            norm["_id"] = reg_id
            normalized.append(norm)

    return normalized
