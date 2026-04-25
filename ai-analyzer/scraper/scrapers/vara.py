# VARA regulations page scraper.
from __future__ import annotations

import sys

import httpx

from scraper.base_scraper import BaseScraper

_VARA_URL = "https://www.vara.ae/en/regulations/regulatory-notices/"


class VARAScraper(BaseScraper):
    source_name = "VARA"
    jurisdiction = "UAE"
    source_url = _VARA_URL

    async def scrape(self) -> list[dict]:
        headers = {"User-Agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36"}
        try:
            async with httpx.AsyncClient(timeout=30.0, follow_redirects=True, headers=headers) as client:
                r = await client.get(_VARA_URL)
                r.raise_for_status()
        except Exception as exc:
            print(f"[VARA] fetch error: {exc}", file=sys.stderr)
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
