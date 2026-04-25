"""Retrieve relevant chunks by cosine similarity (RAG)."""
from __future__ import annotations

import json
import math
import os
from typing import Any

from openai import OpenAI

from . import db

EMBEDDING_MODEL = "text-embedding-3-small"
TOP_K = 20


def _get_client() -> OpenAI | None:
    key = os.getenv("OPENAI_API_KEY") or os.getenv("OPENAI_KEY")
    if not key or not key.strip():
        return None
    return OpenAI(api_key=key.strip())


def _cosine(a: list[float], b: list[float]) -> float:
    if not a or not b or len(a) != len(b):
        return 0.0
    dot = sum(x * y for x, y in zip(a, b))
    na = math.sqrt(sum(x * x for x in a))
    nb = math.sqrt(sum(x * x for x in b))
    if na == 0 or nb == 0:
        return 0.0
    return dot / (na * nb)


async def get_query_embedding(query: str) -> list[float] | None:
    client = _get_client()
    if not client:
        return None
    try:
        resp = client.embeddings.create(
            model=EMBEDDING_MODEL,
            input=query[:8000],
        )
        return resp.data[0].embedding
    except Exception:
        return None


async def retrieve_chunks(
    query: str,
    jurisdiction_filter: str | None = None,
    top_k: int = TOP_K,
) -> list[dict[str, Any]]:
    """
    Return list of { text, title, url, published_at, document_id } sorted by relevance.
    """
    query_emb = await get_query_embedding(query)
    if not query_emb:
        return []
    rows = await db.get_all_chunks_with_docs(jurisdiction_filter=jurisdiction_filter)
    if not rows:
        return []
    scored = []
    for r in rows:
        emb_raw = r.get("embedding")
        if isinstance(emb_raw, str):
            try:
                emb = json.loads(emb_raw)
            except Exception:
                continue
        else:
            emb = emb_raw
        if not isinstance(emb, list):
            continue
        score = _cosine(query_emb, emb)
        scored.append((score, r))
    scored.sort(key=lambda x: -x[0])
    out = []
    seen_urls = set()
    for _, r in scored[: top_k * 2]:
        url = r.get("url") or ""
        if url in seen_urls:
            continue
        seen_urls.add(url)
        out.append({
            "text": r.get("text", ""),
            "title": r.get("title", ""),
            "url": url,
            "published_at": r.get("published_at"),
            "document_id": r.get("document_id"),
        })
        if len(out) >= top_k:
            break
    return out
