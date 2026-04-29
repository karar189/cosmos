"""Pydantic schemas for RegIntel API and analysis output."""
from __future__ import annotations

from typing import Literal

from pydantic import BaseModel, Field


# --- Source ---
class SourceCreate(BaseModel):
    name: str = Field(..., min_length=1)
    type: Literal["rss", "html", "api", "dataset"]
    url: str
    jurisdiction: str | None = None
    tags: list[str] = Field(default_factory=list)
    enabled: bool = True


class SourceUpdate(BaseModel):
    name: str | None = None
    type: Literal["rss", "html", "api", "dataset"] | None = None
    url: str | None = None
    jurisdiction: str | None = None
    tags: list[str] | None = None
    enabled: bool | None = None


class SourceOut(BaseModel):
    id: str
    name: str
    type: str
    url: str
    jurisdiction: str | None
    tags: list[str]
    enabled: bool
    last_run_at: str | None
    created_at: str | None

    class Config:
        from_attributes = True


# --- Business profile ---
class ProfileWallets(BaseModel):
    stellar: list[str] = Field(default_factory=list)
    evm: list[str] = Field(default_factory=list)


class ProfileCreate(BaseModel):
    org_id: str = Field(..., min_length=1, alias="orgId")
    business_name: str | None = Field(None, alias="businessName")
    jurisdictions: list[str] = Field(..., min_length=1)
    business_model: Literal["exchange", "custody", "payments", "defi", "nft", "other"] = Field(
        ..., alias="businessModel"
    )
    custody_funds: bool = Field(False, alias="custodyFunds")
    fiat_on_off_ramp: bool = Field(False, alias="fiatOnOffRamp")
    retail_users: bool = Field(False, alias="retailUsers")
    uses_stablecoin: bool = Field(False, alias="usesStablecoin")
    wallets: ProfileWallets = Field(default_factory=ProfileWallets)

    class Config:
        populate_by_name = True


# --- Analyze request ---
class AnalyzeRequest(BaseModel):
    profile_id: str = Field(..., min_length=1, alias="profileId")
    force: bool = False

    class Config:
        populate_by_name = True


class ChecklistFormData(BaseModel):
    """Optional form data used to generate a basic compliance checklist alongside the deep analysis."""
    business_name: str | None = Field(None, alias="businessName")
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


class FullAnalysisRequest(BaseModel):
    """Request for the combined full compliance analysis (RAG roadmap + checklist)."""
    profile_id: str = Field(..., min_length=1, alias="profileId")
    force: bool = False
    include_checklist: bool = Field(True, alias="includeChecklist")
    checklist_form: ChecklistFormData | None = Field(None, alias="checklistForm")

    class Config:
        populate_by_name = True


class FullAnalysisMetadata(BaseModel):
    generated_at: str
    cached: bool
    model_used: str


class FullAnalysisResponse(BaseModel):
    profile: dict
    analysis: dict
    checklist: list[dict]
    metadata: FullAnalysisMetadata


# --- Analysis output (strict JSON schema for LLM) ---
class Citation(BaseModel):
    title: str
    url: str
    published_at: str | None = Field(None, alias="published_at")


class RequiredLicense(BaseModel):
    name: str
    jurisdiction: str
    status: Literal["pending", "in_progress", "configured", "unknown"]
    confidence: Literal["high", "medium", "low"]
    requires_legal_review: bool
    citations: list[Citation] = Field(default_factory=list)


class RequiredCertification(BaseModel):
    name: str
    status: Literal["pending", "in_progress", "configured", "unknown"]
    confidence: Literal["high", "medium", "low"]
    requires_legal_review: bool
    citations: list[Citation] = Field(default_factory=list)


class MandatoryControl(BaseModel):
    name: Literal[
        "KYC", "KYB", "KYT", "Travel Rule",
        "Transaction Monitoring", "Sanctions Screening",
        "Audit Logging", "Security Program"
    ]
    status: Literal["pending", "in_progress", "configured", "unknown"]
    notes: str
    citations: list[Citation] = Field(default_factory=list)


class RegistrationStatus(BaseModel):
    status: Literal["pending", "in_progress", "configured", "unknown"]
    notes: str


class MissingStep(BaseModel):
    step: str
    priority: Literal["P0", "P1", "P2"]
    why_it_matters: str
    citations: list[Citation] = Field(default_factory=list)


class ActionPlanItem(BaseModel):
    week: str
    deliverables: list[str]
    owner: Literal["founder", "legal", "compliance", "engineering"]
    citations: list[Citation] = Field(default_factory=list)


class Solution(BaseModel):
    problem: str
    solution: str
    implementation_hint: str


class AnalysisOutput(BaseModel):
    compliance_completion: float = Field(..., ge=0, le=1)
    required_licenses: list[RequiredLicense] = Field(default_factory=list)
    required_certifications: list[RequiredCertification] = Field(default_factory=list)
    mandatory_controls: list[MandatoryControl] = Field(default_factory=list)
    registration_status: RegistrationStatus
    missing_steps: list[MissingStep] = Field(default_factory=list)
    estimated_timeline: str
    action_plan: list[ActionPlanItem] = Field(default_factory=list)
    solutions: list[Solution] = Field(default_factory=list)
    citations: list[Citation] = Field(default_factory=list)
