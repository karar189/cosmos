from __future__ import annotations

import json
import os
from typing import Any

from fastapi import HTTPException
from openai import OpenAI

from .business_impact_models import BusinessImpactProfile, ImpactReport, MarketSignal


def _openai_client() -> OpenAI:
    api_key = (
        os.getenv("OPENAI_API_KEY")
        or os.getenv("NEXT_PUBLIC_OPENAI_API_KEY")
        or os.getenv("OPENAI_KEY")
    )
    if not api_key:
        raise HTTPException(status_code=503, detail="OPENAI_API_KEY is missing")
    return OpenAI(api_key=api_key)


def _build_prompt(profile: BusinessImpactProfile, signals: list[MarketSignal]) -> str:
    signal_payload = [s.model_dump() for s in signals]
    return (
        "You are Hypertron's Business Impact Intelligence Agent.\n"
        "Analyze the latest signals and return ONLY valid JSON.\n\n"
        "Business profile:\n"
        f"{json.dumps(profile.model_dump(), ensure_ascii=False)}\n\n"
        "Signals:\n"
        f"{json.dumps(signal_payload, ensure_ascii=False)}\n\n"
        "Return JSON with exact keys:\n"
        "{\n"
        '  "executive_summary": "string",\n'
        '  "key_signals": [{"text":"string","signal_ids":["sig-1"]}],\n'
        '  "risks": [{"text":"string","signal_ids":["sig-1"]}],\n'
        '  "opportunities": [{"text":"string","signal_ids":["sig-2"]}],\n'
        '  "compliance_impact": [{"text":"string","signal_ids":["sig-3"]}],\n'
        '  "recommended_actions": [{"text":"string","signal_ids":["sig-1","sig-2"]}],\n'
        '  "urgency_level": "Low|Medium|High",\n'
        '  "final_recommendation": "string",\n'
        '  "data_quality": "strong|moderate|limited",\n'
        '  "confidence": 0.0\n'
        "}\n\n"
        "Rules:\n"
        "- Keep it founder-friendly and specific to this business.\n"
        "- Every risk/opportunity/compliance/action should cite relevant signal_ids.\n"
        "- If evidence is weak, say it and lower confidence.\n"
        "- Do not invent sources.\n"
        "- Add short compliance caution language where relevant.\n"
    )


def _fallback_report(signals: list[MarketSignal]) -> ImpactReport:
    urgency = "Low"
    if any(s.category == "Compliance Alert" for s in signals):
        urgency = "Medium"
    if any(s.impact_score >= 8.5 for s in signals):
        urgency = "High"

    signal_refs = [s.id for s in signals[:3]]
    return ImpactReport(
        executive_summary="Signals were found, but model analysis was unavailable. Review high-impact items manually.",
        key_signals=[
            {
                "text": f"{s.title} ({s.source})",
                "signal_ids": [s.id],
            }
            for s in signals[:5]
        ],
        risks=[
            {
                "text": "Regulatory and operational items should be reviewed for policy changes and service impacts.",
                "signal_ids": signal_refs,
            }
        ],
        opportunities=[
            {
                "text": "Use market momentum signals to prioritize go-to-market and product messaging updates.",
                "signal_ids": signal_refs,
            }
        ],
        compliance_impact=[
            {
                "text": "Treat compliance-related signals as potential legal review triggers.",
                "signal_ids": signal_refs,
            }
        ],
        recommended_actions=[
            {
                "text": "Run a same-day review with compliance and product owners for top impact signals.",
                "signal_ids": signal_refs,
            }
        ],
        urgency_level=urgency,
        final_recommendation="Validate key assumptions with legal and operations teams before executing major changes.",
        data_quality="limited" if len(signals) < 3 else "moderate",
        confidence=0.35 if len(signals) < 3 else 0.5,
    )


def generate_business_impact_report(
    profile: BusinessImpactProfile,
    signals: list[MarketSignal],
) -> ImpactReport:
    if not signals:
        return ImpactReport(
            executive_summary="No strong recent signals were found in the selected window.",
            key_signals=[],
            risks=[],
            opportunities=[],
            compliance_impact=[],
            recommended_actions=[
                {
                    "text": "Increase lookback window or broaden geographies to improve coverage.",
                    "signal_ids": [],
                }
            ],
            urgency_level="Low",
            final_recommendation="Monitor daily and revisit when more relevant signals are available.",
            data_quality="limited",
            confidence=0.15,
        )

    client = _openai_client()
    prompt = _build_prompt(profile, signals)

    try:
        response = client.chat.completions.create(
            model=os.getenv("OPENAI_MODEL", "gpt-4o-mini"),
            messages=[
                {
                    "role": "system",
                    "content": "You are a senior business intelligence analyst for fintech/payments compliance.",
                },
                {"role": "user", "content": prompt},
            ],
            temperature=0.2,
            response_format={"type": "json_object"},
        )
        content = response.choices[0].message.content or "{}"
        payload: dict[str, Any] = json.loads(content)
        return ImpactReport(**payload)
    except HTTPException:
        raise
    except Exception:
        return _fallback_report(signals)
