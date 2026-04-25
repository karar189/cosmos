# MiCA/ESMA crypto-assets regulation page scraper.
from __future__ import annotations

import sys

import httpx

from scraper.base_scraper import BaseScraper

_MICA_URL = (
    "https://www.esma.europa.eu/esmas-activities/digital-finance-and-innovation"
    "/markets-crypto-assets-regulation-mica"
)


class MiCAScraper(BaseScraper):
    source_name = "MiCA/ESMA"
    jurisdiction = "EU"
    source_url = _MICA_URL

    async def scrape(self) -> list[dict]:
        try:
            async with httpx.AsyncClient(timeout=30.0, follow_redirects=True) as client:
                r = await client.get(_MICA_URL)
                r.raise_for_status()
        except Exception as exc:
            print(f"[MiCA] fetch error: {exc}", file=sys.stderr)
            return []

        raw_content = self._html_to_text(r.text)
        content_hash = self._hash(raw_content)
        return [
            {
                "source_name": self.source_name,
                "jurisdiction": self.jurisdiction,
                "source_url": self.source_url,
                "raw_content": raw_content,
                "content_hash": content_hash,
                "scraped_at": self._now(),
                "doc_type": "html",
            }
        ]
