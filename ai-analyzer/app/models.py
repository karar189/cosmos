from __future__ import annotations

from typing import Any, Literal

from pydantic import BaseModel, Field

from .catalog import WidgetCategory


class WidgetImpact(BaseModel):
    time_saved_hours_per_month: float = Field(..., ge=0)
    cost_savings_usd_per_month: float = Field(..., ge=0)


class RecommendedWidget(BaseModel):
    id: str
    title: str
    category: WidgetCategory
    type: Literal["chart", "metric", "table", "alert"]
    why: str = Field(..., min_length=8)
    impact: WidgetImpact


class BundleTotals(BaseModel):
    time_saved_hours_per_month: float = Field(..., ge=0)
    cost_savings_usd_per_month: float = Field(..., ge=0)
    roi_percent: float | None = Field(default=None, description="Optional ROI% if platform_cost_usd_per_month provided")
    estimated_monthly_cost_usd: float | None = Field(
        default=None, ge=0, description="Estimated monthly platform cost for this bundle; used for budget filtering"
    )


class WidgetBundle(BaseModel):
    id: str
    name: str
    description: str
    widgets: list[RecommendedWidget]
    totals: BundleTotals


class RecommendationsRequest(BaseModel):
    business_name: str = Field(..., min_length=2, max_length=120)
    business_description: str = Field(..., min_length=20, max_length=3000)

    # Optional structured hints (users may not fit neatly into a single label)
    business_type_hint: str | None = Field(
        default=None,
        description="Optional: any hint like 'remittance + stablecoin', 'marketplace', etc.",
    )
    geographies: list[str] | None = Field(default=None, description="e.g. ['US','EU','IN']")
    products: list[str] | None = Field(default=None, description="e.g. ['cross-border payouts','cards']")
    monthly_transactions: int | None = Field(default=None, ge=0)
    avg_transaction_value_usd: float | None = Field(default=None, ge=0)

    # Cost/time modeling knobs
    ops_hourly_rate_usd: float = Field(default=65.0, ge=10, le=500)
    compliance_hourly_rate_usd: float = Field(default=85.0, ge=10, le=800)
    team_size_ops: int | None = Field(default=None, ge=0)
    team_size_compliance: int | None = Field(default=None, ge=0)
    platform_cost_usd_per_month: float | None = Field(default=None, ge=0)

    existing_tools: list[str] | None = None
    constraints: str | None = Field(default=None, description="Budget, timeline, integrations, etc.")


class BusinessProfile(BaseModel):
    inferred_categories: list[WidgetCategory]
    confidence: float = Field(..., ge=0, le=1)
    rationale: str
    assumptions: list[str] = Field(default_factory=list)


class RecommendationsResponse(BaseModel):
    source: Literal["openai", "heuristic"]
    business_profile: BusinessProfile
    bundles: list[WidgetBundle]
    notes: list[str] = Field(default_factory=list)
    debug: dict[str, Any] | None = None

