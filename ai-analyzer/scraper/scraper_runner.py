# Orchestrates all compliance scrapers with change detection via local hash state.
from __future__ import annotations

import asyncio
import json
import sys
from pathlib import Path

from scraper.base_scraper import BaseScraper
from scraper.scrapers import (
    FATFScraper,
    FinCENScraper,
    GDPRScraper,
    MASScraper,
    MiCAScraper,
    OFACScraper,
    SECScraper,
    VARAScraper,
)

_STATE_FILE = Path(__file__).parent / "state" / "hashes.json"

_SCRAPER_REGISTRY: dict[str, type[BaseScraper]] = {
    "OFAC": OFACScraper,
    "FinCEN": FinCENScraper,
    "SEC": SECScraper,
    "FATF": FATFScraper,
    "MiCA/ESMA": MiCAScraper,
    "GDPR/EDPB": GDPRScraper,
    "VARA": VARAScraper,
    "MAS": MASScraper,
}


def _load_hashes() -> dict[str, str]:
    try:
        if _STATE_FILE.exists():
            return json.loads(_STATE_FILE.read_text(encoding="utf-8"))
    except Exception as exc:
        print(f"[runner] could not load hashes: {exc}", file=sys.stderr)
    return {}


def _save_hashes(hashes: dict[str, str]) -> None:
    try:
        _STATE_FILE.parent.mkdir(parents=True, exist_ok=True)
        _STATE_FILE.write_text(json.dumps(hashes, indent=2), encoding="utf-8")
    except Exception as exc:
        print(f"[runner] could not save hashes: {exc}", file=sys.stderr)


def _annotate_changes(results: list[dict], hashes: dict[str, str]) -> dict[str, str]:
    updated = dict(hashes)
    for item in results:
        url = item.get("source_url", "")
        new_hash = item.get("content_hash", "")
        prev_hash = hashes.get(url)
        item["changed"] = new_hash != prev_hash
        updated[url] = new_hash
    return updated


async def _run_scraper_safe(scraper: BaseScraper) -> list[dict]:
    try:
        return await scraper.scrape()
    except Exception as exc:
        print(
            f"[runner] unhandled error in {scraper.source_name}: {exc}",
            file=sys.stderr,
        )
        return []


async def run_all_scrapers() -> list[dict]:
    scrapers = [cls() for cls in _SCRAPER_REGISTRY.values()]
    hashes = _load_hashes()

    groups = await asyncio.gather(*[_run_scraper_safe(s) for s in scrapers])
    results: list[dict] = [item for group in groups for item in group]

    updated_hashes = _annotate_changes(results, hashes)
    _save_hashes(updated_hashes)
    return results


async def run_scraper(name: str) -> list[dict]:
    cls = _SCRAPER_REGISTRY.get(name)
    if cls is None:
        raise ValueError(
            f"Unknown scraper '{name}'. Available: {list(_SCRAPER_REGISTRY)}"
        )
    hashes = _load_hashes()
    results = await _run_scraper_safe(cls())
    updated_hashes = _annotate_changes(results, hashes)
    _save_hashes(updated_hashes)
    return results
