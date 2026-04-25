"""Regulatory Intelligence API routes."""
from __future__ import annotations

import os
from datetime import datetime, timezone

from fastapi import APIRouter, HTTPException, Header, Request

from . import db
from .analyze import run_analysis
from .ingest import run_ingestion
from .schemas import (
    AnalyzeRequest,
    FullAnalysisRequest,
    FullAnalysisMetadata,
    ProfileCreate,
    SourceCreate,
    SourceUpdate,
)

router = APIRouter(prefix="/api/regintel", tags=["regintel"])


def _serialize_source(d: dict) -> dict:
    out = dict(d)
    if "_id" in out:
        out["id"] = out.pop("_id")
    for k in ("last_run_at", "created_at", "updated_at"):
        v = out.get(k)
        if hasattr(v, "isoformat"):
            out[k] = v.isoformat() + "Z"
    return out


def _serialize_profile(d: dict) -> dict:
    out = dict(d)
    if "_id" in out:
        out["id"] = out.pop("_id")
    for k in ("created_at", "updated_at"):
        v = out.get(k)
        if hasattr(v, "isoformat"):
            out[k] = v.isoformat() + "Z"
    # API contract: camelCase for frontend
    if "org_id" in out:
        out["orgId"] = out.pop("org_id")
    if "business_name" in out:
        out["businessName"] = out.pop("business_name")
    if "business_model" in out:
        out["businessModel"] = out.pop("business_model")
    if "custody_funds" in out:
        out["custodyFunds"] = out.pop("custody_funds")
    if "fiat_on_off_ramp" in out:
        out["fiatOnOffRamp"] = out.pop("fiat_on_off_ramp")
    if "retail_users" in out:
        out["retailUsers"] = out.pop("retail_users")
    if "uses_stablecoin" in out:
        out["usesStablecoin"] = out.pop("uses_stablecoin")
    return out


# --- Sources CRUD ---
@router.get("/sources")
async def list_sources(enabled_only: bool = False):
    items = await db.list_sources(enabled_only=enabled_only)
    return {"sources": [_serialize_source(s) for s in items]}


@router.post("/sources")
async def create_source(body: SourceCreate):
    data = {
        "name": body.name,
        "type": body.type,
        "url": body.url,
        "jurisdiction": body.jurisdiction,
        "tags": body.tags,
        "enabled": body.enabled,
    }
    created = await db.create_source(data)
    return _serialize_source(created)


@router.get("/sources/{source_id}")
async def get_source(source_id: str):
    s = await db.get_source(source_id)
    if not s:
        raise HTTPException(status_code=404, detail="Source not found")
    return _serialize_source(s)


@router.patch("/sources/{source_id}")
async def update_source(source_id: str, body: SourceUpdate):
    data = body.model_dump(exclude_unset=True, by_alias=False)
    # map Pydantic field names to db
    if "business_model" in data:
        pass  # keep
    updated = await db.update_source(source_id, data)
    if not updated:
        raise HTTPException(status_code=404, detail="Source not found")
    return _serialize_source(updated)


@router.delete("/sources/{source_id}")
async def delete_source(source_id: str):
    ok = await db.delete_source(source_id)
    if not ok:
        raise HTTPException(status_code=404, detail="Source not found")
    return {"deleted": True}


# --- Ingest (protected) ---
@router.post("/ingest/run")
async def ingest_run(
    request: Request,
    x_ingestion_secret: str | None = Header(None),
    authorization: str | None = Header(None),
):
    secret = os.getenv("INGESTION_SECRET", "").strip()
    if not secret:
        raise HTTPException(status_code=503, detail="INGESTION_SECRET not configured")
    provided = x_ingestion_secret or (authorization.replace("Bearer ", "") if authorization else None)
    if provided != secret:
        raise HTTPException(status_code=401, detail="Invalid or missing ingestion secret")
    try:
        body = await request.json() if await request.body() else {}
    except Exception:
        body = {}
    stellar = body.get("wallet_stellar") or body.get("walletStellar") or []
    evm = body.get("wallet_evm") or body.get("walletEvm") or []
    result = await run_ingestion(wallet_stellar=stellar, wallet_evm=evm)
    return {"ok": True, **result}


# --- Profile ---
@router.post("/profile")
async def profile_upsert(body: ProfileCreate):
    data = {
        "org_id": body.org_id,
        "business_name": body.business_name,
        "jurisdictions": body.jurisdictions,
        "business_model": body.business_model,
        "custody_funds": body.custody_funds,
        "fiat_on_off_ramp": body.fiat_on_off_ramp,
        "retail_users": body.retail_users,
        "uses_stablecoin": body.uses_stablecoin,
        "wallets": body.wallets.model_dump() if body.wallets else {"stellar": [], "evm": []},
    }
    created = await db.upsert_profile(data)
    return _serialize_profile(created)


@router.get("/profile/{profile_id}")
async def get_profile(profile_id: str):
    p = await db.get_profile(profile_id)
    if not p:
        raise HTTPException(status_code=404, detail="Profile not found")
    return _serialize_profile(p)


@router.get("/profile/org/{org_id}")
async def get_profile_by_org(org_id: str):
    p = await db.get_profile_by_org(org_id)
    if not p:
        raise HTTPException(status_code=404, detail="Profile not found")
    return _serialize_profile(p)


# --- Analyze ---
@router.post("/analyze")
async def analyze(body: AnalyzeRequest):
    try:
        output, citations = await run_analysis(body.profile_id, force=body.force)
        return {"output": output, "citations": citations or []}
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


# --- Full Compliance Analysis (RAG roadmap + checklist combined) ---
@router.post("/compliance/full-analysis")
async def full_compliance_analysis(body: FullAnalysisRequest):
    """
    Combined endpoint: loads business profile, runs RAG-based AI compliance roadmap,
    and optionally generates a quick compliance checklist. Returns a unified response
    with profile data, full analysis output, and checklist items.
    """
    # Load profile
    profile = await db.get_profile(body.profile_id)
    if not profile:
        raise HTTPException(status_code=404, detail="Profile not found. Create a profile first.")

    # Run RAG + OpenAI analysis
    try:
        output, citations = await run_analysis(body.profile_id, force=body.force)
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=502, detail=f"Analysis failed: {e!s}")

    # Determine if result came from cache
    cached = False
    if not body.force:
        cached_record = await db.get_latest_analysis(body.profile_id, max_age_hours=24)
        cached = cached_record is not None

    # Optionally generate a quick compliance checklist
    checklist_items: list[dict] = []
    if body.include_checklist:
        try:
            from ..compliance_checklist import ComplianceFormRequest, generate_checklist
            import uuid

            form_data = body.checklist_form
            checklist_req = ComplianceFormRequest(
                businessName=_profile_to_name(profile),
                basedOutOf=", ".join(profile.get("jurisdictions") or []),
                businessType=profile.get("business_model", ""),
                geographies=", ".join(profile.get("jurisdictions") or []),
                products=form_data.products if form_data else None,
                constraints=form_data.constraints if form_data else None,
                monthlyTransactions=form_data.monthly_transactions if form_data else None,
                opsHourlyRateUsd=form_data.ops_hourly_rate_usd if form_data else None,
                complianceHourlyRateUsd=form_data.compliance_hourly_rate_usd if form_data else None,
            )
            checklist_response = generate_checklist(checklist_req)
            checklist_items = [{"id": item.id, "text": item.text} for item in checklist_response.items]
        except Exception:
            # Checklist is optional; don't fail the whole request
            checklist_items = []

    serialized_profile = _serialize_profile(dict(profile))
    model_used = os.getenv("OPENAI_MODEL", "gpt-4o")

    return {
        "profile": serialized_profile,
        "analysis": output,
        "checklist": checklist_items,
        "metadata": {
            "generated_at": datetime.now(timezone.utc).isoformat(),
            "cached": cached,
            "model_used": model_used,
        },
    }


def _profile_to_name(profile: dict) -> str | None:
    return profile.get("business_name") or profile.get("businessName") or None
