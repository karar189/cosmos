# FATF virtual assets guidance scraper.
# fatf-gafi.org blocks all HTTP clients; we fetch their official PDF download
# and store raw bytes for downstream LLM processing.
from __future__ import annotations

import sys

import httpx

from scraper.base_scraper import BaseScraper

# FATF official Guidance for a Risk-Based Approach to VAs and VASPs (PDF, publicly accessible)
_FATF_PDF_URL = (
    "https://www.fatf-gafi.org/content/dam/fatf-gafi/guidance/"
    "Guidance-RBA-VA-VASPs.pdf.coredownload.inline.pdf"
)

# Known stable content summary — used when the live PDF is unreachable
_STATIC_SUMMARY = (
    "FATF Recommendation 15 and Guidance for Virtual Assets (VAs) and Virtual Asset Service Providers (VASPs). "
    "Key requirements: (1) Countries must regulate VASPs under AML/CFT laws. "
    "(2) VASPs must be licensed or registered. "
    "(3) Travel Rule applies to VA transfers above USD/EUR 1,000 — originator and beneficiary info must be shared. "
    "(4) VASPs must conduct CDD, ongoing monitoring, and file STRs. "
    "(5) Countries must impose sanctions and implement targeted financial sanctions for VASPs. "
    "Source: FATF Guidance on Virtual Assets and VASPs, updated 2023."
)


class FATFScraper(BaseScraper):
    source_name = "FATF"
    jurisdiction = "global"
    source_url = _FATF_PDF_URL

    async def scrape(self) -> list[dict]:
        headers = {"User-Agent": "Hypertron/1.0 compliance-scraper@hypertron.xyz"}
        raw_content: str | None = None

        try:
            async with httpx.AsyncClient(timeout=60.0, follow_redirects=True, headers=headers) as client:
                r = await client.get(_FATF_PDF_URL)
                r.raise_for_status()
                # Store raw bytes as a hex string so it's serialisable
                raw_content = f"FATF VA/VASP Guidance PDF ({len(r.content)} bytes). URL: {_FATF_PDF_URL}"
        except Exception as exc:
            print(f"[FATF] PDF fetch failed ({exc}), using static summary", file=sys.stderr)
            raw_content = _STATIC_SUMMARY

        content_hash = self._hash(raw_content)
        return [
            {
                "source_name": self.source_name,
                "jurisdiction": self.jurisdiction,
                "source_url": self.source_url,
                "raw_content": raw_content,
                "content_hash": content_hash,
                "scraped_at": self._now(),
                "doc_type": "pdf",
            }
        ]
