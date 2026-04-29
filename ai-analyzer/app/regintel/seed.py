"""Seed default RegIntel sources if none exist."""
from __future__ import annotations

from . import db

DEFAULT_SOURCES = [
    {"name": "Stellar Horizon", "type": "api", "url": "https://horizon.stellar.org", "jurisdiction": "global", "tags": ["stellar", "network"], "enabled": True},
    {"name": "StellarExpert", "type": "api", "url": "https://api.stellar.expert", "jurisdiction": "global", "tags": ["stellar"], "enabled": True},
    {"name": "FCA", "type": "rss", "url": "https://www.fca.org.uk/news/rss", "jurisdiction": "UK", "tags": ["regulator"], "enabled": True},
    {"name": "MAS", "type": "rss", "url": "https://www.mas.gov.sg/rss", "jurisdiction": "SG", "tags": ["regulator"], "enabled": True},
    {"name": "ESMA", "type": "rss", "url": "https://www.esma.europa.eu/rss/news", "jurisdiction": "EU", "tags": ["regulator"], "enabled": True},
    {"name": "FinCEN", "type": "rss", "url": "https://www.fincen.gov/rss.xml", "jurisdiction": "US", "tags": ["regulator"], "enabled": True},
    {"name": "OFAC SDN", "type": "dataset", "url": "https://www.treasury.gov/ofac/downloads/sdn.xml", "jurisdiction": "US", "tags": ["sanctions"], "enabled": True},
]


async def seed_sources_if_empty() -> int:
    existing = await db.list_sources(enabled_only=False)
    if existing:
        return 0
    for s in DEFAULT_SOURCES:
        await db.create_source(s)
    return len(DEFAULT_SOURCES)
