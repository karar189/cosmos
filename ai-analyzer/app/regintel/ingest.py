"""Orchestrate ingestion: fetch all enabled sources, normalize, chunk, embed."""
from __future__ import annotations

import asyncio
from datetime import datetime, timezone
from typing import Any

from . import db
from .chunk_embed import chunk_and_store_document
from .fetchers import _hash_content, fetch_source


async def run_ingestion(wallet_stellar: list[str] | None = None, wallet_evm: list[str] | None = None) -> dict[str, Any]:
    """
    For each enabled source: fetch, upsert documents, chunk+embed new/updated content.
    Returns { sources_run, documents_added, errors }.
    """
    sources = await db.list_sources(enabled_only=True)
    wallet_stellar = wallet_stellar or []
    wallet_evm = wallet_evm or []
    errors: list[str] = []
    docs_added = 0

    for source in sources:
        source_id = source.get("_id")
        if not source_id:
            continue
        try:
            items = await fetch_source(source, wallet_stellar, wallet_evm)
            for item in items:
                raw = item.get("raw_text", "") or item.get("title", "")
                url = item.get("url", "")
                if not raw and not url:
                    continue
                content_hash = _hash_content(raw, url)
                published_at = item.get("published_at")
                if hasattr(published_at, "isoformat"):
                    published_at = published_at
                elif published_at:
                    published_at = published_at
                else:
                    published_at = None
                doc_id = await db.upsert_document({
                    "source_id": source_id,
                    "jurisdiction": item.get("jurisdiction"),
                    "title": item.get("title", "Untitled"),
                    "url": url,
                    "published_at": published_at,
                    "doc_type": item.get("doc_type"),
                    "raw_text": raw[:500000],
                    "content_hash": content_hash,
                    "metadata": None,
                })
                n = await chunk_and_store_document(doc_id, raw[:500000])
                docs_added += 1
            await db.update_source_last_run(source_id)
        except Exception as e:
            errors.append(f"{source.get('name', source_id)}: {e!s}")
        await asyncio.sleep(0.5)

    return {"sources_run": len(sources), "documents_processed": docs_added, "errors": errors}
