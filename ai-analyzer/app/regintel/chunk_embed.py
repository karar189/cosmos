"""Chunk text and embed with OpenAI; store in DB."""
from __future__ import annotations

import json
import os
from typing import Any

from openai import OpenAI

from . import db

CHUNK_SIZE = 1000
CHUNK_OVERLAP = 150
EMBEDDING_MODEL = "text-embedding-3-small"


def _get_client() -> OpenAI | None:
    key = os.getenv("OPENAI_API_KEY") or os.getenv("OPENAI_KEY")
    if not key or not key.strip():
        return None
    return OpenAI(api_key=key.strip())


def chunk_text(text: str, size: int = CHUNK_SIZE, overlap: int = CHUNK_OVERLAP) -> list[str]:
    """Split text into overlapping chunks."""
    if not text or len(text) <= size:
        return [text] if text else []
    chunks = []
    start = 0
    while start < len(text):
        end = start + size
        chunk = text[start:end]
        chunks.append(chunk.strip())
        if end >= len(text):
            break
        start = end - overlap
    return [c for c in chunks if c]


def embed_chunks(client: OpenAI, chunks: list[str]) -> list[list[float]]:
    """Get embeddings for each chunk (batch to avoid rate limits)."""
    if not chunks:
        return []
    embeddings = []
    batch_size = 20
    for i in range(0, len(chunks), batch_size):
        batch = chunks[i : i + batch_size]
        try:
            resp = client.embeddings.create(
                model=EMBEDDING_MODEL,
                input=[t[:8000] for t in batch],  # API limit
            )
            for d in resp.data:
                embeddings.append(d.embedding)
        except Exception:
            embeddings.extend([[0.0] * 1536] * len(batch))  # fallback dim for small
    return embeddings


async def chunk_and_store_document(document_id: str, raw_text: str) -> int:
    """Chunk raw_text, embed, insert into chunks collection. Returns count of chunks stored."""
    client = _get_client()
    if not client:
        return 0
    chunks = chunk_text(raw_text)
    if not chunks:
        return 0
    vectors = embed_chunks(client, chunks)
    if len(vectors) != len(chunks):
        return 0
    await db.delete_chunks_by_document(document_id)
    docs = []
    for i, (text, emb) in enumerate(zip(chunks, vectors)):
        docs.append({
            "document_id": document_id,
            "chunk_index": i,
            "text": text,
            "embedding": json.dumps(emb) if isinstance(emb, list) else emb,
            "token_count": len(text) // 4,
        })
    await db.insert_chunks(docs)
    return len(docs)
