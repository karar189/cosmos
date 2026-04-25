"""Test routes for compliance scrapers + LLM processor — exposes run/normalize endpoints."""
from __future__ import annotations

from fastapi import APIRouter, HTTPException, Query
from pydantic import BaseModel
from typing import Optional

from scraper.scraper_runner import run_all_scrapers, run_scraper, _SCRAPER_REGISTRY
from processor.processor_runner import process_all, process_source
from app.regintel.db import get_regulations, clear_regulations

router = APIRouter(prefix="/api/scraper", tags=["scraper"])


class ScrapeResult(BaseModel):
    source_name: str
    jurisdiction: str
    source_url: str
    doc_type: str
    content_hash: str
    scraped_at: str
    changed: bool
    raw_preview: str  # first 500 chars of raw_content


def _to_result(r: dict) -> ScrapeResult:
    return ScrapeResult(
        source_name=r.get("source_name", ""),
        jurisdiction=r.get("jurisdiction", ""),
        source_url=r.get("source_url", ""),
        doc_type=r.get("doc_type", ""),
        content_hash=r.get("content_hash", ""),
        scraped_at=r.get("scraped_at", ""),
        changed=r.get("changed", False),
        raw_preview=str(r.get("raw_content", ""))[:500],
    )


@router.get("/sources")
async def list_sources() -> dict:
    """List all available scraper sources."""
    return {"sources": list(_SCRAPER_REGISTRY.keys())}


@router.post("/run/all")
async def run_all() -> dict:
    """Trigger all 8 scrapers and return a summary of what was fetched."""
    results = await run_all_scrapers()
    return {
        "total": len(results),
        "results": [_to_result(r).model_dump() for r in results],
    }


@router.post("/run/{source}")
async def run_single(source: str) -> dict:
    """
    Trigger a single scraper by name.
    Valid values: OFAC, FinCEN, SEC, FATF, MiCA/ESMA, GDPR/EDPB, VARA, MAS
    """
    try:
        results = await run_scraper(source)
    except ValueError as e:
        raise HTTPException(status_code=404, detail=str(e))
    return {
        "source": source,
        "total": len(results),
        "results": [_to_result(r).model_dump() for r in results],
    }


@router.post("/normalize/all")
async def normalize_all() -> dict:
    """
    Scrape all 8 sources and normalize changed ones through OpenAI.
    Sources with unchanged content are skipped to save API costs.
    """
    results = await process_all()
    return {
        "total": len(results),
        "results": results,
    }


@router.post("/normalize/{source}")
async def normalize_single(source: str) -> dict:
    """
    Scrape and normalize a single source through OpenAI.
    Always normalizes regardless of change detection.
    Valid values: OFAC, FinCEN, SEC, FATF, MiCA/ESMA, GDPR/EDPB, VARA, MAS
    """
    try:
        results = await process_source(source)
    except ValueError as e:
        raise HTTPException(status_code=404, detail=str(e))
    return {
        "source": source,
        "total": len(results),
        "results": results,
    }


@router.get("/regulations")
async def list_regulations(
    jurisdiction: Optional[str] = Query(None, description="Filter by jurisdiction, e.g. US, EU, UAE, SG"),
    category: Optional[str] = Query(None, description="Partial match on category, e.g. AML, sanctions"),
    applies_to: Optional[str] = Query(None, description="Filter by business type tag, e.g. exchange, payments"),
    limit: int = Query(100, ge=1, le=500),
) -> dict:
    """
    Query stored normalized regulations.
    All filters are optional and can be combined.
    """
    docs = await get_regulations(
        jurisdiction=jurisdiction,
        category=category,
        applies_to=applies_to,
        limit=limit,
    )
    return {"total": len(docs), "regulations": docs}


@router.delete("/regulations")
async def delete_regulations() -> dict:
    """
    Delete ALL regulations from MongoDB.
    Use before a full re-normalize to avoid stale data.
    """
    deleted = await clear_regulations()
    return {"deleted": deleted, "message": f"Cleared {deleted} regulation(s) from MongoDB."}


@router.delete("/hashes")
async def delete_hashes() -> dict:
    """
    Delete the local hash state file so ALL sources are treated as changed on next run.
    Call this before normalize/all to force a full re-scrape + re-normalize.
    """
    from scraper.scraper_runner import _STATE_FILE
    if _STATE_FILE.exists():
        _STATE_FILE.unlink()
        return {"deleted": True, "message": "Hash state cleared. Next normalize run will process all sources."}
    return {"deleted": False, "message": "Hash state file did not exist — nothing to clear."}


@router.get("/run/{source}/raw")
async def run_single_raw(source: str) -> dict:
    """
    Run a single scraper and return the full raw_content (no truncation).
    Useful for inspecting exactly what the LLM normalizer will receive.
    """
    try:
        results = await run_scraper(source)
    except ValueError as e:
        raise HTTPException(status_code=404, detail=str(e))
    return {
        "source": source,
        "total": len(results),
        "results": results,
    }
