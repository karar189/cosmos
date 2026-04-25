"""
Simple API: accept compliance form inputs and return a list of compliances to follow (OpenAI).
"""
from __future__ import annotations

import json
import os
import uuid

from fastapi import HTTPException
from openai import OpenAI
from pydantic import BaseModel, Field


class ComplianceFormRequest(BaseModel):
    """Form payload from the compliance checker UI."""
    wallet_address: str | None = Field(None, alias="walletAddress")
    business_name: str | None = Field(None, alias="businessName")
    email: str | None = None
    based_out_of: str | None = Field(None, alias="basedOutOf")
    business_type: str | None = Field(None, alias="businessType")
    geographies: str | None = None
    products: str | None = None
    monthly_transactions: str | None = Field(None, alias="monthlyTransactions")
    avg_transaction_value_usd: str | None = Field(None, alias="avgTransactionValueUsd")
    ops_hourly_rate_usd: str | None = Field(None, alias="opsHourlyRateUsd")
    compliance_hourly_rate_usd: str | None = Field(None, alias="complianceHourlyRateUsd")
    platform_cost_usd_month: str | None = Field(None, alias="platformCostUsdMonth")
    constraints: str | None = None

    class Config:
        populate_by_name = True


class ChecklistItem(BaseModel):
    id: str
    text: str


class ComplianceChecklistResponse(BaseModel):
    items: list[ChecklistItem]


def _build_context(req: ComplianceFormRequest) -> str:
    parts = []
    if req.business_name:
        parts.append(f"Business name: {req.business_name}")
    if req.based_out_of:
        parts.append(f"Based out of (HQ/jurisdiction): {req.based_out_of}")
    if req.business_type:
        parts.append(f"Type / sector: {req.business_type}")
    if req.geographies:
        parts.append(f"Geographical location(s): {req.geographies}")
    if req.products:
        parts.append(f"Products / services: {req.products}")
    if req.monthly_transactions:
        parts.append(f"Monthly transactions (volume): {req.monthly_transactions}")
    if req.avg_transaction_value_usd:
        parts.append(f"Average transaction value (USD): {req.avg_transaction_value_usd}")
    if req.ops_hourly_rate_usd:
        parts.append(f"Ops hourly rate (USD): {req.ops_hourly_rate_usd}")
    if req.compliance_hourly_rate_usd:
        parts.append(f"Compliance hourly rate (USD): {req.compliance_hourly_rate_usd}")
    if req.platform_cost_usd_month:
        parts.append(f"Platform cost (USD/month): {req.platform_cost_usd_month}")
    if req.constraints:
        parts.append(f"Constraints / requirements: {req.constraints}")
    return ". ".join(parts) if parts else "General business (no additional details provided)."


def generate_checklist(req: ComplianceFormRequest) -> ComplianceChecklistResponse:
    """Call OpenAI to generate a compliance checklist from the form inputs."""
    api_key = (os.getenv("OPENAI_API_KEY") or os.getenv("OPENAI_KEY") or "").strip()
    if not api_key:
        raise HTTPException(
            status_code=503,
            detail="OPENAI_API_KEY not configured. Set it in .env to generate compliance checklists.",
        )

    context = _build_context(req)
    system_prompt = (
        "You are a regulatory and compliance advisor. Given a business profile, "
        "produce a concise checklist of regulatory and compliance actions the business should take "
        "to operate in a legally compliant manner in their jurisdictions and sector. "
        "Output only a JSON array of strings, each string being one actionable item "
        '(e.g. "Register for data protection authority if processing EU personal data"). '
        "No other text. Example: [\"Item one\", \"Item two\"]"
    )
    user_prompt = (
        f"Business profile: {context}. "
        "Generate a professional, actionable regulatory and compliance checklist (8–15 items) "
        "for this business to become fully legally compliant. "
        "Consider geography, sector, transaction volume, and any constraints. "
        "Return only a JSON array of strings."
    )

    client = OpenAI(api_key=api_key)
    try:
        resp = client.chat.completions.create(
            model=os.getenv("OPENAI_MODEL", "gpt-4o-mini"),
            messages=[
                {"role": "system", "content": system_prompt},
                {"role": "user", "content": user_prompt},
            ],
            temperature=0.4,
        )
    except Exception as e:
        raise HTTPException(status_code=502, detail=f"OpenAI request failed: {e!s}") from e

    content = (resp.choices[0].message.content or "").strip()
    list_raw: list[str] = []
    try:
        parsed = json.loads(content)
        if isinstance(parsed, list):
            list_raw = [str(x).strip() for x in parsed if x]
        else:
            list_raw = []
    except json.JSONDecodeError:
        for line in content.splitlines():
            line = line.strip().lstrip("-*• ").strip()
            if line:
                list_raw.append(line)
    list_raw = list_raw[:20]

    prefix = f"item-{uuid.uuid4().hex[:8]}"
    items = [ChecklistItem(id=f"{prefix}-{i}", text=t) for i, t in enumerate(list_raw)]
    return ComplianceChecklistResponse(items=items)
