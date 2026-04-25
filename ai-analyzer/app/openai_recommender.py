from __future__ import annotations

import json
import os
from typing import Any

from openai import OpenAI

from .catalog import WIDGETS, WidgetCategory
from .heuristics import recommend_with_heuristics
from .integration_pricing import estimated_monthly_cost_usd as integration_based_cost
from .models import (
    BusinessProfile,
    BundleTotals,
    RecommendationsRequest,
    RecommendationsResponse,
    RecommendedWidget,
    WidgetBundle,
    WidgetImpact,
)


def _cap_bundle_to_budget(bundle: WidgetBundle, budget: float) -> WidgetBundle:
    """Scale per-widget costs and bundle total down to fit budget when over."""
    total_cost = sum(w.impact.cost_savings_usd_per_month for w in bundle.widgets)
    if total_cost <= 0 or total_cost <= budget:
        return bundle
    scale = budget / total_cost
    scaled_widgets: list[RecommendedWidget] = []
    for w in bundle.widgets:
        scaled_widgets.append(
            RecommendedWidget(
                id=w.id,
                title=w.title,
                category=w.category,
                type=w.type,
                why=w.why,
                impact=WidgetImpact(
                    time_saved_hours_per_month=w.impact.time_saved_hours_per_month,
                    cost_savings_usd_per_month=round(
                        w.impact.cost_savings_usd_per_month * scale, 2
                    ),
                ),
            )
        )
    new_total_cost = round(
        sum(w.impact.cost_savings_usd_per_month for w in scaled_widgets), 2
    )
    roi = None
    if budget > 0:
        roi = round(((new_total_cost - budget) / budget) * 100, 1)
    est = bundle.totals.estimated_monthly_cost_usd
    if est is not None and est > budget:
        est = round(min(est, budget), 2)
    return WidgetBundle(
        id=bundle.id,
        name=bundle.name,
        description=bundle.description,
        widgets=scaled_widgets,
        totals=BundleTotals(
            time_saved_hours_per_month=bundle.totals.time_saved_hours_per_month,
            cost_savings_usd_per_month=new_total_cost,
            roi_percent=roi,
            estimated_monthly_cost_usd=est,
        ),
    )


def _get_api_key() -> str | None:
    # Support reusing the frontend env var if present
    return (
        os.getenv("OPENAI_API_KEY")
        or os.getenv("NEXT_PUBLIC_OPENAI_API_KEY")
        or os.getenv("OPENAI_KEY")
    )


def _catalog_for_prompt() -> list[dict[str, Any]]:
    return [
        {
            "id": w.id,
            "title": w.title,
            "category": w.category,
            "type": w.type,
        }
        for w in WIDGETS.values()
    ]


def recommend_with_openai(req: RecommendationsRequest) -> RecommendationsResponse:
    api_key = _get_api_key()
    if not api_key:
        return recommend_with_heuristics(req)

    client = OpenAI(api_key=api_key)

    # We ask for strict JSON. If parsing fails, we fall back to heuristics.
    system = (
        "You are a product+compliance architect for financial services monitoring. "
        "Given a business description and constraints, propose widget bundles (combinations) "
        "from the provided widget catalog. "
        "Return ONLY valid JSON matching the required schema."
    )

    user = {
        "business_name": req.business_name,
        "business_description": req.business_description,
        "business_type_hint": req.business_type_hint,
        "geographies": req.geographies,
        "products": req.products,
        "monthly_transactions": req.monthly_transactions,
        "avg_transaction_value_usd": req.avg_transaction_value_usd,
        "existing_tools": req.existing_tools,
        "constraints": req.constraints,
        "ops_hourly_rate_usd": req.ops_hourly_rate_usd,
        "compliance_hourly_rate_usd": req.compliance_hourly_rate_usd,
        "team_size_ops": req.team_size_ops,
        "team_size_compliance": req.team_size_compliance,
        "platform_cost_usd_per_month": req.platform_cost_usd_per_month,
        "widget_catalog": _catalog_for_prompt(),
    }

    schema = {
        "type": "object",
        "additionalProperties": False,
        "properties": {
            "business_profile": {
                "type": "object",
                "additionalProperties": False,
                "properties": {
                    "inferred_categories": {
                        "type": "array",
                        "items": {"type": "string", "enum": ["remittance", "fintech", "bank", "stablecoin", "ngo", "rwa", "custom"]},
                        "minItems": 1,
                    },
                    "confidence": {"type": "number", "minimum": 0, "maximum": 1},
                    "rationale": {"type": "string"},
                    "assumptions": {"type": "array", "items": {"type": "string"}},
                },
                "required": ["inferred_categories", "confidence", "rationale", "assumptions"],
            },
            "bundles": {
                "type": "array",
                "minItems": 2,
                "maxItems": 3,
                "items": {
                    "type": "object",
                    "additionalProperties": False,
                    "properties": {
                        "id": {"type": "string"},
                        "name": {"type": "string"},
                        "description": {"type": "string"},
                        "widgets": {
                            "type": "array",
                            "minItems": 4,
                            "items": {
                                "type": "object",
                                "additionalProperties": False,
                                "properties": {
                                    "id": {"type": "string"},
                                    "why": {"type": "string"},
                                    "impact": {
                                        "type": "object",
                                        "additionalProperties": False,
                                        "properties": {
                                            "time_saved_hours_per_month": {"type": "number", "minimum": 0},
                                            "cost_savings_usd_per_month": {"type": "number", "minimum": 0},
                                        },
                                        "required": ["time_saved_hours_per_month", "cost_savings_usd_per_month"],
                                    },
                                },
                                "required": ["id", "why", "impact"],
                            },
                        },
                        "totals": {
                            "type": "object",
                            "additionalProperties": False,
                            "properties": {
                                "time_saved_hours_per_month": {"type": "number", "minimum": 0},
                                "cost_savings_usd_per_month": {"type": "number", "minimum": 0},
                                "roi_percent": {"type": ["number", "null"]},
                            },
                            "required": ["time_saved_hours_per_month", "cost_savings_usd_per_month", "roi_percent"],
                        },
                    },
                    "required": ["id", "name", "description", "widgets", "totals"],
                },
            },
            "notes": {"type": "array", "items": {"type": "string"}},
        },
        "required": ["business_profile", "bundles", "notes"],
    }

    prompt = (
        "Task:\n"
        "- Infer the best matching categories (can be multiple) from: remittance, fintech, bank, stablecoin, ngo, rwa, custom.\n"
        "- Propose 2-3 widget bundles: Lean, Balanced, Comprehensive.\n"
        "- Choose widgets ONLY from widget_catalog by id.\n"
        "- For each widget: write a concrete 'why' in 1-2 sentences.\n"
        "- Provide numeric estimates for time_saved_hours_per_month and cost_savings_usd_per_month.\n"
        "- Totals must equal the sum of the widget impacts (approximately; within rounding).\n"
        "- If platform_cost_usd_per_month is provided, set roi_percent; otherwise null.\n"
        "- Return JSON that conforms to the schema.\n"
    )

    try:
        # Use Chat Completions for broad compatibility.
        resp = client.chat.completions.create(
            model=os.getenv("OPENAI_MODEL", "gpt-4o-mini"),
            messages=[
                {"role": "system", "content": system},
                {"role": "user", "content": prompt + "\n\nINPUT:\n" + json.dumps(user)},
            ],
            temperature=0.4,
            max_tokens=1800,
        )
        content = resp.choices[0].message.content or ""
        data = json.loads(content)
    except Exception:
        return recommend_with_heuristics(req)

    # Validate + enrich with catalog fields (title/type/category) and enforce IDs exist.
    try:
        bp = data["business_profile"]
        profile = BusinessProfile(
            inferred_categories=[c for c in bp["inferred_categories"]],
            confidence=float(bp["confidence"]),
            rationale=str(bp["rationale"]),
            assumptions=list(bp.get("assumptions") or []),
        )

        bundles: list[WidgetBundle] = []
        for b in data["bundles"]:
            widgets: list[RecommendedWidget] = []
            for w in b["widgets"]:
                wid = str(w["id"])
                catalog = WIDGETS.get(wid)
                if not catalog:
                    # Unknown widget id -> fallback
                    raise ValueError(f"Unknown widget id: {wid}")
                impact = w.get("impact") or {}
                widgets.append(
                    RecommendedWidget(
                        id=catalog.id,
                        title=catalog.title,
                        category=catalog.category,
                        type=catalog.type,
                        why=str(w["why"]),
                        impact=WidgetImpact(
                            time_saved_hours_per_month=float(impact["time_saved_hours_per_month"]),
                            cost_savings_usd_per_month=float(impact["cost_savings_usd_per_month"]),
                        ),
                    )
                )

            totals = b["totals"]
            # Real cost from APIs/integrations those widgets use (screening, KYC, payment rails, etc.)
            est_cost = round(
                integration_based_cost(
                    [w.id for w in widgets],
                    monthly_transactions=req.monthly_transactions,
                    kyc_verifications_per_month=None,
                ),
                2,
            )
            bundles.append(
                WidgetBundle(
                    id=str(b["id"]),
                    name=str(b["name"]),
                    description=str(b["description"]),
                    widgets=widgets,
                    totals=BundleTotals(
                        time_saved_hours_per_month=float(totals["time_saved_hours_per_month"]),
                        cost_savings_usd_per_month=float(totals["cost_savings_usd_per_month"]),
                        roi_percent=totals.get("roi_percent", None),
                        estimated_monthly_cost_usd=est_cost,
                    ),
                )
            )

        budget = req.platform_cost_usd_per_month
        # Scale each bundle's costs down to fit budget so widget costs don't exceed it
        if budget is not None and budget > 0:
            bundles = [_cap_bundle_to_budget(b, budget) for b in bundles]

        # When user provides a monthly budget, only return bundles within budget
        if budget is not None and budget > 0:
            within_budget = [b for b in bundles if (b.totals.estimated_monthly_cost_usd or 0) <= budget]
            if within_budget:
                bundles = within_budget
            else:
                bundles = sorted(bundles, key=lambda b: b.totals.estimated_monthly_cost_usd or 0)[:2]

        notes = list(data.get("notes") or [])
        if budget is not None and budget > 0 and bundles:
            est = bundles[0].totals.estimated_monthly_cost_usd
            if est is not None and est <= budget:
                notes.append(f"Bundles above are within your ${budget:,.0f}/mo budget (estimated cost shown per bundle).")
            else:
                notes.append(f"No bundle fits your ${budget:,.0f}/mo budget; showing cheapest options. Consider increasing budget or starting with the Lean bundle.")

        return RecommendationsResponse(
            source="openai",
            business_profile=profile,
            bundles=bundles,
            notes=notes,
        )
    except Exception:
        return recommend_with_heuristics(req)

