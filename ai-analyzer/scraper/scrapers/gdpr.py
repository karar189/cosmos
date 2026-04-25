# GDPR/EDPB guidelines page scraper.
from __future__ import annotations

import sys

import httpx

from scraper.base_scraper import BaseScraper

_GDPR_URL = (
    "https://edpb.europa.eu/our-work-tools/general-guidance"
    "/guidelines-recommendations-best-practices_en"
)


class GDPRScraper(BaseScraper):
    source_name = "GDPR/EDPB"
    jurisdiction = "EU"
    source_url = _GDPR_URL

    async def scrape(self) -> list[dict]:
        try:
            async with httpx.AsyncClient(timeout=30.0, follow_redirects=True) as client:
                r = await client.get(_GDPR_URL)
                r.raise_for_status()
        except Exception as exc:
            print(f"[GDPR] fetch error: {exc}", file=sys.stderr)
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
