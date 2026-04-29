# FinCEN statutes/regulations and news scraper.
from __future__ import annotations

import sys

import httpx

from scraper.base_scraper import BaseScraper

_REGS_URL = "https://www.fincen.gov/resources/statutes-regulations"
_NEWS_URL = "https://www.fincen.gov/news"


class FinCENScraper(BaseScraper):
    source_name = "FinCEN"
    jurisdiction = "US"
    source_url = _REGS_URL

    async def scrape(self) -> list[dict]:
        results: list[dict] = []
        async with httpx.AsyncClient(timeout=30.0, follow_redirects=True) as client:
            for url in (_REGS_URL, _NEWS_URL):
                try:
                    r = await client.get(url)
                    r.raise_for_status()
                    raw_content = self._html_to_text(r.text)
                    content_hash = self._hash(raw_content)
                    results.append(
                        {
                            "source_name": self.source_name,
                            "jurisdiction": self.jurisdiction,
                            "source_url": url,
                            "raw_content": raw_content,
                            "content_hash": content_hash,
                            "scraped_at": self._now(),
                            "doc_type": "html",
                        }
                    )
                except Exception as exc:
                    print(f"[FinCEN] fetch error for {url}: {exc}", file=sys.stderr)
        return results
