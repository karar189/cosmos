"""MongoDB access for RegIntel using Motor (async)."""
from __future__ import annotations

import os
from datetime import datetime
from typing import Any

from motor.motor_asyncio import AsyncIOMotorClient, AsyncIOMotorDatabase

DB_NAME = "regintel"

_client: AsyncIOMotorClient | None = None


def get_client() -> AsyncIOMotorClient:
    global _client
    if _client is None:
        # Read lazily so load_dotenv() in main.py runs first
        uri = os.getenv("MONGODB_URI") or os.getenv("DATABASE_URL") or "mongodb://localhost:27017"
        _client = AsyncIOMotorClient(uri)
    return _client


def get_db() -> AsyncIOMotorDatabase:
    return get_client()[DB_NAME]


# Collection names
SOURCES = "sources"
DOCUMENTS = "documents"
CHUNKS = "chunks"
BUSINESS_PROFILES = "business_profiles"
ANALYSES = "analyses"
REGULATIONS = "regulations"


async def ensure_indexes() -> None:
    """Create indexes for sources, documents, chunks, profiles, analyses, regulations."""
    db = get_db()
    await db[SOURCES].create_index("enabled")
    await db[DOCUMENTS].create_index("url", unique=True)
    await db[DOCUMENTS].create_index([("source_id", 1), ("content_hash", 1)])
    await db[DOCUMENTS].create_index("jurisdiction")
    await db[CHUNKS].create_index("document_id")
    await db[BUSINESS_PROFILES].create_index("org_id", unique=True)
    await db[ANALYSES].create_index([("profile_id", 1), ("created_at", -1)])
    await db[REGULATIONS].create_index("source_name")
    await db[REGULATIONS].create_index("jurisdiction")
    await db[REGULATIONS].create_index("category")
    await db[REGULATIONS].create_index("applies_to")
    await db[REGULATIONS].create_index([("source_name", 1), ("content_hash", 1)], unique=True)


async def list_sources(enabled_only: bool = False) -> list[dict[str, Any]]:
    db = get_db()
    q = {"enabled": True} if enabled_only else {}
    cursor = db[SOURCES].find(q)
    return await cursor.to_list(length=500)


async def get_source(source_id: str) -> dict[str, Any] | None:
    db = get_db()
    return await db[SOURCES].find_one({"_id": source_id})


async def create_source(data: dict[str, Any]) -> dict[str, Any]:
    db = get_db()
    from bson import ObjectId
    doc = {
        "_id": str(ObjectId()),
        "name": data["name"],
        "type": data["type"],
        "url": data["url"],
        "jurisdiction": data.get("jurisdiction"),
        "tags": data.get("tags") or [],
        "enabled": data.get("enabled", True),
        "last_run_at": None,
        "created_at": datetime.utcnow(),
    }
    await db[SOURCES].insert_one(doc)
    doc["last_run_at"] = None
    doc["created_at"] = doc["created_at"].isoformat() + "Z"
    return doc


async def update_source(source_id: str, data: dict[str, Any]) -> dict[str, Any] | None:
    db = get_db()
    upd = {k: v for k, v in data.items() if v is not None and k in (
        "name", "type", "url", "jurisdiction", "tags", "enabled"
    )}
    if not upd:
        return await get_source(source_id)
    upd["updated_at"] = datetime.utcnow()
    result = await db[SOURCES].find_one_and_update(
        {"_id": source_id},
        {"$set": upd},
        return_document=True,
    )
    if result:
        result["last_run_at"] = result.get("last_run_at").isoformat() + "Z" if result.get("last_run_at") else None
        result["created_at"] = result.get("created_at").isoformat() + "Z" if result.get("created_at") else None
    return result


async def delete_source(source_id: str) -> bool:
    db = get_db()
    r = await db[SOURCES].delete_one({"_id": source_id})
    if r.deleted_count:
        await db[DOCUMENTS].delete_many({"source_id": source_id})
    return r.deleted_count > 0


async def upsert_document(data: dict[str, Any]) -> str:
    db = get_db()
    from bson import ObjectId
    doc = {
        "source_id": data["source_id"],
        "jurisdiction": data.get("jurisdiction"),
        "title": data["title"],
        "url": data["url"],
        "published_at": data.get("published_at"),
        "fetched_at": datetime.utcnow(),
        "doc_type": data.get("doc_type"),
        "raw_text": data["raw_text"],
        "content_hash": data["content_hash"],
        "metadata": data.get("metadata"),
    }
    existing = await db[DOCUMENTS].find_one({"url": data["url"]})
    if existing:
        await db[DOCUMENTS].update_one(
            {"url": data["url"]},
            {"$set": {k: v for k, v in doc.items() if k != "url"}},
        )
        return str(existing["_id"])
    doc["_id"] = str(ObjectId())
    await db[DOCUMENTS].insert_one(doc)
    return doc["_id"]


async def update_source_last_run(source_id: str) -> None:
    db = get_db()
    await db[SOURCES].update_one(
        {"_id": source_id},
        {"$set": {"last_run_at": datetime.utcnow()}},
    )


async def delete_chunks_by_document(document_id: str) -> int:
    db = get_db()
    r = await db[CHUNKS].delete_many({"document_id": document_id})
    return r.deleted_count


async def insert_chunks(chunks: list[dict[str, Any]]) -> None:
    if not chunks:
        return
    db = get_db()
    await db[CHUNKS].insert_many(chunks)


async def get_profile_by_org(org_id: str) -> dict[str, Any] | None:
    db = get_db()
    return await db[BUSINESS_PROFILES].find_one({"org_id": org_id})


async def upsert_profile(data: dict[str, Any]) -> dict[str, Any]:
    db = get_db()
    from bson import ObjectId
    now = datetime.utcnow()
    doc = {
        "org_id": data["org_id"],
        "business_name": data.get("business_name"),
        "jurisdictions": data.get("jurisdictions") or [],
        "business_model": data["business_model"],
        "custody_funds": data.get("custody_funds", False),
        "fiat_on_off_ramp": data.get("fiat_on_off_ramp", False),
        "retail_users": data.get("retail_users", False),
        "uses_stablecoin": data.get("uses_stablecoin", False),
        "wallets": data.get("wallets") or {"stellar": [], "evm": []},
        "updated_at": now,
    }
    existing = await db[BUSINESS_PROFILES].find_one({"org_id": data["org_id"]})
    if existing:
        await db[BUSINESS_PROFILES].update_one({"org_id": data["org_id"]}, {"$set": doc})
        doc["_id"] = existing["_id"]
        doc["created_at"] = existing.get("created_at", now)
    else:
        doc["created_at"] = now
        doc["_id"] = str(ObjectId())
        await db[BUSINESS_PROFILES].insert_one(doc)
    return doc


async def get_profile(profile_id: str) -> dict[str, Any] | None:
    db = get_db()
    return await db[BUSINESS_PROFILES].find_one({"_id": profile_id})


async def get_latest_analysis(profile_id: str, max_age_hours: float = 24) -> dict[str, Any] | None:
    db = get_db()
    from datetime import timedelta
    cutoff = datetime.utcnow() - timedelta(hours=max_age_hours)
    return await db[ANALYSES].find_one(
        {"profile_id": profile_id, "created_at": {"$gte": cutoff}},
        sort=[("created_at", -1)],
    )


async def save_analysis(profile_id: str, output_json: dict, citations: list[dict], model_info: str | None) -> dict:
    db = get_db()
    from bson import ObjectId
    doc = {
        "_id": str(ObjectId()),
        "profile_id": profile_id,
        "output_json": output_json,
        "citations": citations,
        "model_info": model_info,
        "created_at": datetime.utcnow(),
    }
    await db[ANALYSES].insert_one(doc)
    return doc


async def get_all_chunks_with_docs(jurisdiction_filter: str | None = None) -> list[dict]:
    """Load chunks with document title/url/published_at for retrieval. Optional jurisdiction filter."""
    db = get_db()
    pipeline: list[dict] = [
        {"$lookup": {"from": DOCUMENTS, "localField": "document_id", "foreignField": "_id", "as": "doc"}},
        {"$unwind": "$doc"},
    ]
    if jurisdiction_filter:
        pipeline.append({"$match": {"doc.jurisdiction": jurisdiction_filter}})
    pipeline.append({"$project": {"_id": 1, "text": 1, "embedding": 1, "document_id": 1, "title": "$doc.title", "url": "$doc.url", "published_at": "$doc.published_at"}})
    cursor = db[CHUNKS].aggregate(pipeline)
    return await cursor.to_list(length=50000)


async def save_regulation(scrape_result: dict, normalized: dict) -> str:
    """Upsert a normalized regulation into the regulations collection.

    Uses (source_name, content_hash) as the unique key so re-runs with
    identical content are idempotent and we never double-store the same doc.
    """
    db = get_db()
    from bson import ObjectId

    now = datetime.utcnow()
    doc = {
        "source_name": scrape_result.get("source_name", ""),
        "jurisdiction": scrape_result.get("jurisdiction", ""),
        "source_url": scrape_result.get("source_url", ""),
        "content_hash": scrape_result.get("content_hash", ""),
        "scraped_at": scrape_result.get("scraped_at", now.isoformat() + "Z"),
        # LLM-normalized fields
        "title": normalized.get("title", ""),
        "category": normalized.get("category", ""),
        "summary": normalized.get("summary", ""),
        "requirements": normalized.get("requirements") or [],
        "applies_to": normalized.get("applies_to") or [],
        "effective_date": normalized.get("effective_date"),
        "updated_at": now,
    }

    existing = await db[REGULATIONS].find_one(
        {"source_name": doc["source_name"], "content_hash": doc["content_hash"]}
    )
    if existing:
        await db[REGULATIONS].update_one(
            {"_id": existing["_id"]},
            {"$set": doc},
        )
        return str(existing["_id"])

    doc["_id"] = str(ObjectId())
    doc["created_at"] = now
    await db[REGULATIONS].insert_one(doc)
    return doc["_id"]


async def clear_regulations() -> int:
    """Delete all documents from the regulations collection. Returns count deleted."""
    db = get_db()
    result = await db[REGULATIONS].delete_many({})
    return result.deleted_count


async def get_regulations(
    jurisdiction: str | None = None,
    category: str | None = None,
    applies_to: str | None = None,
    limit: int = 100,
) -> list[dict[str, Any]]:
    """Query stored regulations with optional filters."""
    db = get_db()
    query: dict[str, Any] = {}
    if jurisdiction:
        query["jurisdiction"] = jurisdiction
    if category:
        query["category"] = {"$regex": category, "$options": "i"}
    if applies_to:
        query["applies_to"] = applies_to

    cursor = db[REGULATIONS].find(query, {"_id": 0}).sort("updated_at", -1).limit(limit)
    docs = await cursor.to_list(length=limit)
    # serialise datetime objects to ISO strings
    for d in docs:
        for k in ("updated_at", "created_at"):
            if isinstance(d.get(k), datetime):
                d[k] = d[k].isoformat() + "Z"
    return docs
