# OFAC SDN list scraper (XML).
from __future__ import annotations

import sys
import xml.etree.ElementTree as ET

import httpx

from scraper.base_scraper import BaseScraper

_SDN_URL = "https://sanctionslistservice.ofac.treas.gov/api/publicationpreview/exports/sdn.xml"


class OFACScraper(BaseScraper):
    source_name = "OFAC"
    jurisdiction = "US"
    source_url = _SDN_URL

    async def scrape(self) -> list[dict]:
        try:
            async with httpx.AsyncClient(timeout=60.0, follow_redirects=True) as client:
                r = await client.get(_SDN_URL)
                r.raise_for_status()
        except Exception as exc:
            print(f"[OFAC] fetch error: {exc}", file=sys.stderr)
            return []

        try:
            root = ET.fromstring(r.text)
        except ET.ParseError as exc:
            print(f"[OFAC] XML parse error: {exc}", file=sys.stderr)
            return []

        # Try multiple namespace variations used across OFAC SDN XML versions
        ns_variants = [
            {"ofac": "http://tempuri.org/sdnList.xsd"},
            {"ofac": "https://sanctionslistservice.ofac.treas.gov/api/publicationpreview/exports/sdn.xsd"},
        ]
        entries = []
        for ns in ns_variants:
            entries = root.findall(".//ofac:sdnEntry", ns)
            if entries:
                break
        if not entries:
            entries = root.findall(".//sdnEntry")
        count = len(entries)
        xml_snippet = r.text[:50000]
        raw_content = f"OFAC SDN list: {count} sanctioned entries.\n\n{xml_snippet}"
        content_hash = self._hash(raw_content)

        return [
            {
                "source_name": self.source_name,
                "jurisdiction": self.jurisdiction,
                "source_url": self.source_url,
                "raw_content": raw_content,
                "content_hash": content_hash,
                "scraped_at": self._now(),
                "doc_type": "xml",
            }
        ]
