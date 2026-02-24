from __future__ import annotations

import math
from collections.abc import Iterable

from .catalog import WIDGETS, WidgetCategory, WidgetDef
from .models import (
    BusinessProfile,
    BundleTotals,
    RecommendationsRequest,
    RecommendationsResponse,
    RecommendedWidget,
    WidgetBundle,
    WidgetImpact,
)


def _infer_categories(text: str) -> list[WidgetCategory]:
    t = (text or "").lower()
    inferred: list[WidgetCategory] = []
    if any(k in t for k in ["remittance", "payout", "cross-border", "fx corridor", "corridor", "money transfer"]):
        inferred.append("remittance")
    if any(k in t for k in ["fintech", "payments", "wallet", "checkout", "merchant", "acquiring", "card"]):
        inferred.append("fintech")
    if any(k in t for k in ["neobank", "bank", "accounts", "deposit", "lending", "kyc", "kyb"]):
        inferred.append("bank")
    if any(k in t for k in ["stablecoin", "issuer", "mint", "burn", "reserves", "peg"]):
        inferred.append("stablecoin")
    if any(k in t for k in ["ngo", "aid", "donation", "charity", "humanitarian", "beneficiary"]):
        inferred.append("ngo")
    if any(k in t for k in ["rwa", "real world asset", "tokenization", "securities", "accredited", "custody"]):
        inferred.append("rwa")

    if not inferred:
        inferred.append("custom")

    # De-dup preserve order
    dedup: list[WidgetCategory] = []
    for c in inferred:
        if c not in dedup:
            dedup.append(c)
    return dedup


def _widgets_for_categories(categories: Iterable[WidgetCategory]) -> list[WidgetDef]:
    cats = set(categories)
    return [w for w in WIDGETS.values() if w.category in cats]


def _select_bundle(widget_defs: list[WidgetDef], target: int) -> list[WidgetDef]:
    # Very simple: take stable, high-signal widgets first (alerts, monitoring, tables) then fill.
    priority_order = {"alert": 0, "table": 1, "chart": 2, "metric": 3}
    sorted_defs = sorted(widget_defs, key=lambda w: (priority_order.get(w.type, 9), w.title))
    return sorted_defs[: max(1, min(target, len(sorted_defs)))]


def _impact_for_widget(
    *,
    widget: WidgetDef,
    req: RecommendationsRequest,
    baseline_complexity: float,
    bundle_strength: float,
) -> WidgetImpact:
    """
    Heuristic time & cost impact model.
    Returns per-widget estimate so bundle totals can be computed.
    """
    # Base time savings by widget type
    base_hours = {"alert": 6.0, "table": 5.0, "chart": 3.5, "metric": 2.0}.get(widget.type, 3.0)

    # Scale with volume/complexity
    volume = (req.monthly_transactions or 0) / 50_000  # 50k tx/mo baseline
    volume_factor = 1.0 + min(2.0, max(0.0, volume)) * 0.35  # cap multiplier

    hours = base_hours * baseline_complexity * volume_factor * bundle_strength
    hours = max(0.5, round(hours, 1))

    # Mix ops vs compliance cost depending on widget category/type
    if widget.type in ("alert", "table"):
        rate = (req.compliance_hourly_rate_usd * 0.6) + (req.ops_hourly_rate_usd * 0.4)
    else:
        rate = (req.compliance_hourly_rate_usd * 0.4) + (req.ops_hourly_rate_usd * 0.6)

    cost = round(hours * rate, 2)
    return WidgetImpact(time_saved_hours_per_month=hours, cost_savings_usd_per_month=cost)


def recommend_with_heuristics(req: RecommendationsRequest) -> RecommendationsResponse:
    inference_text = " ".join(
        [
            req.business_name,
            req.business_description,
            req.business_type_hint or "",
            " ".join(req.products or []),
            " ".join(req.geographies or []),
        ]
    ).strip()
    categories = _infer_categories(inference_text)

    # Confidence: higher when we match a single obvious category, lower when mixed/unknown
    confidence = 0.78 if categories and categories[0] != "custom" else 0.52
    if len(categories) > 1:
        confidence = max(0.45, confidence - 0.12 * (len(categories) - 1))

    # Complexity based on breadth and compliance constraints keywords
    complexity = 1.0 + 0.15 * max(0, len(categories) - 1)
    if req.constraints and any(k in req.constraints.lower() for k in ["regulated", "license", "ofac", "mika", "micar", "nydfs"]):
        complexity += 0.15
    complexity = min(1.6, complexity)

    widget_pool = _widgets_for_categories(categories)
    # If everything is custom, include generic widgets as pool
    if categories == ["custom"]:
        widget_pool = [w for w in WIDGETS.values() if w.category == "custom"]

    # Build bundles as combinations (not full permutations, which would explode)
    lean = _select_bundle(widget_pool, target=6)
    balanced = _select_bundle(widget_pool, target=10)
    comprehensive = _select_bundle(widget_pool, target=14)

    def build_bundle(bundle_id: str, name: str, desc: str, defs: list[WidgetDef], strength: float) -> WidgetBundle:
        rec_widgets: list[RecommendedWidget] = []
        for d in defs:
            impact = _impact_for_widget(widget=d, req=req, baseline_complexity=complexity, bundle_strength=strength)
            rec_widgets.append(
                RecommendedWidget(
                    id=d.id,
                    title=d.title,
                    category=d.category,
                    type=d.type,
                    why=d.why_default,
                    impact=impact,
                )
            )

        total_hours = round(sum(w.impact.time_saved_hours_per_month for w in rec_widgets), 1)
        total_cost = round(sum(w.impact.cost_savings_usd_per_month for w in rec_widgets), 2)

        # Cap bundle cost to user's budget so sum of widget costs never exceeds budget
        budget = req.platform_cost_usd_per_month
        if budget is not None and budget > 0 and total_cost > budget:
            scale = budget / total_cost
            scaled_widgets: list[RecommendedWidget] = []
            for w in rec_widgets:
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
            rec_widgets = scaled_widgets
            total_cost = round(
                sum(w.impact.cost_savings_usd_per_month for w in rec_widgets), 2
            )

        roi = None
        if req.platform_cost_usd_per_month and req.platform_cost_usd_per_month > 0:
            roi = round(((total_cost - req.platform_cost_usd_per_month) / req.platform_cost_usd_per_month) * 100, 1)

        return WidgetBundle(
            id=bundle_id,
            name=name,
            description=desc,
            widgets=rec_widgets,
            totals=BundleTotals(
                time_saved_hours_per_month=total_hours,
                cost_savings_usd_per_month=total_cost,
                roi_percent=roi,
            ),
        )

    bundles = [
        build_bundle(
            "lean",
            "Lean",
            "Minimum set of widgets to start monitoring quickly with low overhead.",
            lean,
            strength=0.85,
        ),
        build_bundle(
            "balanced",
            "Balanced",
            "Best default mix: monitoring + compliance + operational visibility for most teams.",
            balanced,
            strength=1.0,
        ),
        build_bundle(
            "comprehensive",
            "Comprehensive",
            "Broader coverage for regulated environments and higher volumes; more alerts and drill-downs.",
            comprehensive,
            strength=1.12,
        ),
    ]

    profile = BusinessProfile(
        inferred_categories=categories,
        confidence=round(confidence, 2),
        rationale="Inferred from keywords in the business description, hint, products, and geographies.",
        assumptions=[
            "Estimates assume standard compliance + ops workflows with partial manual reviews today.",
            "Time/cost numbers are directional and will vary based on automation level and staffing.",
        ],
    )

    notes = [
        "Bundles are curated combinations; enumerating every permutation would be impractical at scale.",
        "Provide `monthly_transactions` and `platform_cost_usd_per_month` for tighter savings/ROI estimates.",
    ]

    return RecommendationsResponse(
        source="heuristic",
        business_profile=profile,
        bundles=bundles,
        notes=notes,
        debug={
            "complexity": round(complexity, 2),
            "widget_pool_size": len(widget_pool),
        },
    )

