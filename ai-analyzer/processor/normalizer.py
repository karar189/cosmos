"""LLM normalization — passes raw scraped content through OpenAI to produce structured JSON."""
from __future__ import annotations

import json
import os
import sys

from openai import OpenAI

_client: OpenAI | None = None

_SYSTEM_PROMPT = """You are a compliance data extraction system for a B2B fintech platform.

Given raw content scraped from an official regulatory website, extract structured compliance information.

Return ONLY a valid JSON object with this exact structure — no markdown, no explanation:
{
  "title": "short descriptive title of this regulation or guidance",
  "category": "one of: KYC, AML, Licensing, Tax, Privacy, Sanctions",
  "summary": "2-3 sentence plain English summary of what this requires",
  "requirements": ["array of specific actionable requirements for businesses"],
  "effective_date": "ISO date string or null if unknown",
  "applies_to": ["list of business types this applies to — e.g. VASP, MSB, Stablecoin issuer, DeFi platform, DAO, Payment provider"]
}"""

_USER_TEMPLATE = """Source: {source_name}
Jurisdiction: {jurisdiction}
URL: {source_url}

Raw content:
{raw_content}"""


def _get_client() -> OpenAI:
    global _client
    if _client is None:
        api_key = os.getenv("OPENAI_API_KEY")
        if not api_key:
            raise RuntimeError("OPENAI_API_KEY is not set in environment")
        _client = OpenAI(api_key=api_key)
    return _client


def normalize(scrape_result: dict) -> dict | None:
    """
    Pass a single scraper result through OpenAI and return a normalized dict.
    Returns None if normalization fails.
    """
    raw_content = str(scrape_result.get("raw_content", "")).strip()
    if not raw_content:
        return None

    # Truncate to stay well within token limits (~60k chars ≈ ~15k tokens)
    raw_content = raw_content[:60000]

    user_message = _USER_TEMPLATE.format(
        source_name=scrape_result.get("source_name", ""),
        jurisdiction=scrape_result.get("jurisdiction", ""),
        source_url=scrape_result.get("source_url", ""),
        raw_content=raw_content,
    )

    try:
        client = _get_client()
        response = client.chat.completions.create(
            model="gpt-4o",
            messages=[
                {"role": "system", "content": _SYSTEM_PROMPT},
                {"role": "user", "content": user_message},
            ],
            temperature=0,
            response_format={"type": "json_object"},
        )
        raw_json = response.choices[0].message.content or ""
        parsed = json.loads(raw_json)
    except Exception as exc:
        print(f"[normalizer] error for {scrape_result.get('source_name')}: {exc}", file=sys.stderr)
        return None

    return {
        "source_name": scrape_result.get("source_name"),
        "jurisdiction": scrape_result.get("jurisdiction"),
        "source_url": scrape_result.get("source_url"),
        "scraped_at": scrape_result.get("scraped_at"),
        "content_hash": scrape_result.get("content_hash"),
        "changed": scrape_result.get("changed", False),
        "doc_type": scrape_result.get("doc_type"),
        # LLM-extracted fields
        "title": parsed.get("title", ""),
        "category": parsed.get("category", ""),
        "summary": parsed.get("summary", ""),
        "requirements": parsed.get("requirements", []),
        "effective_date": parsed.get("effective_date"),
        "applies_to": parsed.get("applies_to", []),
    }
