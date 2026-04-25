# SEC EDGAR full-text search scraper for digital assets / crypto filings.
from __future__ import annotations

import sys

import httpx

from scraper.base_scraper import BaseScraper

# EDGAR full-text search — no bot protection, SEC requires identifying User-Agent
_SEC_URL = "https://efts.sec.gov/LATEST/search-index?q=%22digital+assets%22+%22crypto%22&forms=S-1,10-K,8-K&dateRange=custom&startdt=2024-01-01"


class SECScraper(BaseScraper):
    source_name = "SEC"
    jurisdiction = "US"
    source_url = _SEC_URL

    async def scrape(self) -> list[dict]:
        try:
            # SEC requires an identifying User-Agent (company name + contact)
            headers = {"User-Agent": "Hypertron/1.0 compliance-scraper@hypertron.xyz"}
            async with httpx.AsyncClient(timeout=30.0, follow_redirects=True, headers=headers) as client:
                r = await client.get(_SEC_URL)
                r.raise_for_status()
        except Exception as exc:
            print(f"[SEC] fetch error: {exc}", file=sys.stderr)
            return []

        raw_content = r.text[:50000]
        content_hash = self._hash(raw_content)
        return [
            {
                "source_name": self.source_name,
                "jurisdiction": self.jurisdiction,
                "source_url": self.source_url,
                "raw_content": raw_content,
                "content_hash": content_hash,
                "scraped_at": self._now(),
                "doc_type": "json",
            }
        ]
