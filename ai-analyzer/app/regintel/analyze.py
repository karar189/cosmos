"""RAG + OpenAI to produce compliance roadmap (strict JSON schema)."""
from __future__ import annotations

import json
import os
from typing import Any

from openai import OpenAI

from . import db
from .schemas import AnalysisOutput
from .search import retrieve_chunks

SYSTEM_PROMPT = """You are a compliance operations assistant for web3 and digital asset businesses. You do NOT give legal advice. You only summarize and plan based on the provided sources. Scope: web3, crypto, digital assets, virtual asset service providers (VASPs), stablecoins, exchanges, custody, DeFi only. Do not generalize to non-web3 industries.
If the provided sources do not mention something, return "unknown" for status and set "requires_legal_review": true. Never invent licenses or rules not supported by the sources. Always cite sources (title, url, published_at) for each item where possible."""

OUTPUT_SCHEMA = {
    "type": "object",
    "additionalProperties": False,
    "properties": {
        "compliance_completion": {"type": "number", "minimum": 0, "maximum": 1},
        "required_licenses": {
            "type": "array",
            "items": {
                "type": "object",
                "properties": {
                    "name": {"type": "string"},
                    "jurisdiction": {"type": "string"},
                    "status": {"type": "string", "enum": ["pending", "in_progress", "configured", "unknown"]},
                    "confidence": {"type": "string", "enum": ["high", "medium", "low"]},
                    "requires_legal_review": {"type": "boolean"},
                    "citations": {"type": "array", "items": {"type": "object", "properties": {"title": {"type": "string"}, "url": {"type": "string"}, "published_at": {"type": ["string", "null"]}}}}},
                "required": ["name", "jurisdiction", "status", "confidence", "requires_legal_review", "citations"],
            },
        },
        "required_certifications": {
            "type": "array",
            "items": {
                "type": "object",
                "properties": {
                    "name": {"type": "string"},
                    "status": {"type": "string", "enum": ["pending", "in_progress", "configured", "unknown"]},
                    "confidence": {"type": "string", "enum": ["high", "medium", "low"]},
                    "requires_legal_review": {"type": "boolean"},
                    "citations": {"type": "array"},
                },
                "required": ["name", "status", "confidence", "requires_legal_review", "citations"],
            },
        },
        "mandatory_controls": {
            "type": "array",
            "items": {
                "type": "object",
                "properties": {
                    "name": {"type": "string", "enum": ["KYC", "KYB", "KYT", "Travel Rule", "Transaction Monitoring", "Sanctions Screening", "Audit Logging", "Security Program"]},
                    "status": {"type": "string", "enum": ["pending", "in_progress", "configured", "unknown"]},
                    "notes": {"type": "string"},
                    "citations": {"type": "array"},
                },
                "required": ["name", "status", "notes", "citations"],
            },
        },
        "registration_status": {
            "type": "object",
            "properties": {"status": {"type": "string", "enum": ["pending", "in_progress", "configured", "unknown"]}, "notes": {"type": "string"}},
            "required": ["status", "notes"],
        },
        "missing_steps": {
            "type": "array",
            "items": {
                "type": "object",
                "properties": {"step": {"type": "string"}, "priority": {"type": "string", "enum": ["P0", "P1", "P2"]}, "why_it_matters": {"type": "string"}, "citations": {"type": "array"}},
                "required": ["step", "priority", "why_it_matters", "citations"],
            },
        },
        "estimated_timeline": {"type": "string"},
        "action_plan": {
            "type": "array",
            "items": {
                "type": "object",
                "properties": {"week": {"type": "string"}, "deliverables": {"type": "array", "items": {"type": "string"}}, "owner": {"type": "string", "enum": ["founder", "legal", "compliance", "engineering"]}, "citations": {"type": "array"}},
                "required": ["week", "deliverables", "owner", "citations"],
            },
        },
        "solutions": {
            "type": "array",
            "items": {
                "type": "object",
                "properties": {"problem": {"type": "string"}, "solution": {"type": "string"}, "implementation_hint": {"type": "string"}},
                "required": ["problem", "solution", "implementation_hint"],
            },
        },
        "citations": {"type": "array", "items": {"type": "object", "properties": {"title": {"type": "string"}, "url": {"type": "string"}, "published_at": {"type": ["string", "null"]}}}},
    },
    "required": [
        "compliance_completion", "required_licenses", "required_certifications",
        "mandatory_controls", "registration_status", "missing_steps",
        "estimated_timeline", "action_plan", "solutions", "citations",
    ],
}


def _profile_to_query(profile: dict[str, Any]) -> str:
    parts = [
        f"Jurisdictions: {', '.join(profile.get('jurisdictions') or [])}.",
        f"Business model: {profile.get('business_model', '')}.",
        "Custody of funds: yes." if profile.get("custody_funds") else "Custody of funds: no.",
        "Fiat on/off ramp: yes." if profile.get("fiat_on_off_ramp") else "Fiat on/off ramp: no.",
        "Retail users: yes." if profile.get("retail_users") else "Retail users: no.",
        "Uses stablecoin: yes." if profile.get("uses_stablecoin") else "Uses stablecoin: no.",
    ]
    return " ".join(parts)


def _format_citation(c: dict) -> str:
    return f"[{c.get('title', '')}]({c.get('url', '')}) ({c.get('published_at') or 'n/a'})"


async def run_analysis(profile_id: str, force: bool = False) -> tuple[dict[str, Any], list[dict] | None]:
    """
    Load profile, retrieve chunks, call OpenAI, return (output_json dict, citations).
    If force=False and a recent analysis exists (< 24h), returns (cached output, citations).
    """
    profile = await db.get_profile(profile_id)
    if not profile:
        raise ValueError("Profile not found")

    if not force:
        cached = await db.get_latest_analysis(profile_id, max_age_hours=24)
        if cached:
            out = cached.get("output_json")
            if isinstance(out, dict):
                return out, cached.get("citations") or []
            if isinstance(out, str):
                return json.loads(out), cached.get("citations") or []
            return {}, []

    query = _profile_to_query(profile)
    jurisdictions = profile.get("jurisdictions") or []
    jurisdiction_filter = jurisdictions[0] if jurisdictions else None
    chunks = await retrieve_chunks(query, jurisdiction_filter=jurisdiction_filter, top_k=20)
    if not chunks:
        chunks = await retrieve_chunks(query, jurisdiction_filter=None, top_k=20)

    context_parts = []
    for i, c in enumerate(chunks):
        pub = c.get("published_at")
        pub_str = pub.isoformat() if hasattr(pub, "isoformat") else str(pub) if pub else "n/a"
        context_parts.append(f"[Source {i+1}] Title: {c.get('title')}. URL: {c.get('url')}. Published: {pub_str}.\n{c.get('text', '')}")
    context = "\n\n---\n\n".join(context_parts)

    user_content = (
        "Based ONLY on the following retrieved regulatory/source excerpts (web3/crypto scope), "
        "produce a compliance roadmap for this business profile. Return valid JSON only.\n\n"
        "Business profile:\n" + query + "\n\n"
        "Retrieved sources:\n" + context[:28000] + "\n\n"
        "Return a single JSON object matching the required schema. Include confidence (high/medium/low) and requires_legal_review for each item. Use 'unknown' and requires_legal_review when sources do not explicitly state something."
    )

    api_key = os.getenv("OPENAI_API_KEY") or os.getenv("OPENAI_KEY")
    if not api_key or not api_key.strip():
        raise ValueError("OPENAI_API_KEY not configured")
    client = OpenAI(api_key=api_key.strip())
    model = os.getenv("OPENAI_MODEL", "gpt-4o")

    try:
        resp = client.chat.completions.create(
            model=model,
            messages=[
                {"role": "system", "content": SYSTEM_PROMPT},
                {"role": "user", "content": user_content},
            ],
            temperature=0.2,
            max_tokens=4000,
            response_format={"type": "json_schema", "json_schema": {"name": "analysis_output", "strict": True, "schema": OUTPUT_SCHEMA}},
        )
    except Exception as e:
        if "json_schema" in str(e).lower() or "response_format" in str(e).lower():
            resp = client.chat.completions.create(
                model=model,
                messages=[
                    {"role": "system", "content": SYSTEM_PROMPT + " Return valid JSON only."},
                    {"role": "user", "content": user_content},
                ],
                temperature=0.2,
                max_tokens=4000,
            )
        else:
            raise
    content = (resp.choices[0].message.content or "").strip()
    if content.startswith("```"):
        content = content.split("```")[1]
        if content.startswith("json"):
            content = content[4:]
    data = json.loads(content)
    citations = data.get("citations") or []
    await db.save_analysis(profile_id, data, citations, model)
    return data, citations
