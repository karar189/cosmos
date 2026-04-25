"""
Real cost estimates for widget bundles based on the API keys/integrations
users will connect to those widgets. Each widget type maps to one or more
integration types (e.g. screening, KYC, payment rails); we apply representative
pricing and request volume to compute estimated monthly cost.
"""
from __future__ import annotations

# Integration types that widgets consume (APIs users typically integrate)
INTEGRATION_SCREENING = "screening"  # OFAC/AML/sanctions (ComplyAdvantage, Refinitiv, Dow Jones, etc.)
INTEGRATION_KYC = "kyc"  # Identity verification (Onfido, Jumio, Sumsub, etc.)
INTEGRATION_PAYMENT_RAILS = "payment_rails"  # Payment processors / routing data
INTEGRATION_REGULATORY = "regulatory"  # Regulatory feeds, filing tools
INTEGRATION_MONITORING = "monitoring"  # Alerts, dashboards, SIEM-style

# Representative monthly pricing (USD) for each integration type.
# Tuned so Lean bundle stays under a typical $2,500/mo budget even at high volume.
# Base = fixed monthly; per_unit = cost per "unit" (screening = per lookup, KYC = per verification).
INTEGRATION_PRICING: dict[str, dict] = {
    INTEGRATION_SCREENING: {
        "base_monthly_usd": 80.0,
        "per_unit_usd": 0.005,
        "unit_description": "per screening lookup",
        "volume_driver": "monthly_transactions",
    },
    INTEGRATION_KYC: {
        "base_monthly_usd": 150.0,
        "per_unit_usd": 0.90,
        "unit_description": "per verification",
        "volume_driver": "kyc_verifications_per_month",
    },
    INTEGRATION_PAYMENT_RAILS: {
        "base_monthly_usd": 220.0,
        "per_unit_usd": 0.0,
        "unit_description": "platform access",
        "volume_driver": None,
    },
    INTEGRATION_REGULATORY: {
        "base_monthly_usd": 120.0,
        "per_unit_usd": 0.0,
        "unit_description": "feed access",
        "volume_driver": None,
    },
    INTEGRATION_MONITORING: {
        "base_monthly_usd": 50.0,
        "per_unit_usd": 0.0,
        "unit_description": "per widget/dashboard",
        "volume_driver": None,
    },
}

# Widget ID -> list of integration types that widget uses (APIs user would connect).
# Only widgets that need external APIs are listed; others get a small fixed "monitoring" cost.
WIDGET_INTEGRATIONS: dict[str, list[str]] = {
    # Remittance
    "remittance-aml-screening-dashboard": [INTEGRATION_SCREENING, INTEGRATION_MONITORING],
    "remittance-regulatory-alerts": [INTEGRATION_REGULATORY, INTEGRATION_MONITORING],
    "remittance-agent-network-monitor": [INTEGRATION_MONITORING],
    "remittance-corridor-risk-monitor": [INTEGRATION_MONITORING],
    "remittance-cross-border-volume": [INTEGRATION_PAYMENT_RAILS, INTEGRATION_MONITORING],
    "remittance-settlement-time-tracker": [INTEGRATION_PAYMENT_RAILS, INTEGRATION_MONITORING],
    "remittance-transaction-limits-tracker": [INTEGRATION_MONITORING],
    "remittance-smurfing-detection": [INTEGRATION_SCREENING, INTEGRATION_MONITORING],
    # Fintech
    "fintech-sanctions-screening": [INTEGRATION_SCREENING, INTEGRATION_MONITORING],
    "fintech-fraud-detection-dashboard": [INTEGRATION_PAYMENT_RAILS, INTEGRATION_MONITORING],
    "fintech-payment-routing-optimizer": [INTEGRATION_PAYMENT_RAILS, INTEGRATION_MONITORING],
    "fintech-payment-analytics": [INTEGRATION_PAYMENT_RAILS, INTEGRATION_MONITORING],
    "fintech-compliance-score-gauge": [INTEGRATION_REGULATORY, INTEGRATION_MONITORING],
    "fintech-chargeback-monitor": [INTEGRATION_PAYMENT_RAILS, INTEGRATION_MONITORING],
    "fintech-authorization-rates": [INTEGRATION_PAYMENT_RAILS, INTEGRATION_MONITORING],
    "fintech-payment-volume-by-method": [INTEGRATION_PAYMENT_RAILS, INTEGRATION_MONITORING],
    # Bank
    "bank-kyc-kyb-dashboard": [INTEGRATION_KYC, INTEGRATION_MONITORING],
    "bank-transaction-monitoring": [INTEGRATION_SCREENING, INTEGRATION_MONITORING],
    "bank-large-value-transfer-monitor": [INTEGRATION_MONITORING],
    "bank-regulatory-reporting-status": [INTEGRATION_REGULATORY, INTEGRATION_MONITORING],
    "bank-account-opening-metrics": [INTEGRATION_KYC, INTEGRATION_MONITORING],
    "bank-risk-scoring-engine": [INTEGRATION_MONITORING],
    "bank-liquidity-monitor": [INTEGRATION_MONITORING],
    "bank-customer-segmentation": [INTEGRATION_MONITORING],
    "bank-lending-portfolio-health": [INTEGRATION_MONITORING],
    # Stablecoin, NGO, RWA, Custom — use monitoring or generic
    "stablecoin-reserve-monitoring": [INTEGRATION_MONITORING],
    "stablecoin-redemption-tracker": [INTEGRATION_MONITORING],
    "stablecoin-peg-stability-monitor": [INTEGRATION_MONITORING],
    "stablecoin-circulation-analytics": [INTEGRATION_MONITORING],
    "stablecoin-attestation-status": [INTEGRATION_REGULATORY, INTEGRATION_MONITORING],
    "stablecoin-mint-burn-volume": [INTEGRATION_MONITORING],
    "stablecoin-bank-balance-monitor": [INTEGRATION_MONITORING],
    "stablecoin-regulatory-compliance": [INTEGRATION_REGULATORY, INTEGRATION_MONITORING],
    "custom-api-integration-status": [INTEGRATION_MONITORING],
    "compliance-score": [INTEGRATION_REGULATORY, INTEGRATION_MONITORING],
    "routing-analytics": [INTEGRATION_PAYMENT_RAILS, INTEGRATION_MONITORING],
    "transaction-volume": [INTEGRATION_MONITORING],
    "risk-heatmap": [INTEGRATION_MONITORING],
    "alerts-panel": [INTEGRATION_MONITORING],
    "custom-compliance-calendar": [INTEGRATION_REGULATORY, INTEGRATION_MONITORING],
    "custom-metric": [INTEGRATION_MONITORING],
    "custom-chart": [INTEGRATION_MONITORING],
    "custom-table": [INTEGRATION_MONITORING],
    "custom-alert": [INTEGRATION_MONITORING],
    "custom-team-activity-log": [INTEGRATION_MONITORING],
    "custom-external-dashboard-link": [],
    "active-routes": [INTEGRATION_MONITORING],
    "compliance-blocks": [INTEGRATION_MONITORING],
    "asset-distribution": [INTEGRATION_MONITORING],
    # NGO
    "ngo-donation-tracker": [INTEGRATION_MONITORING],
    "ngo-fund-flow-monitor": [INTEGRATION_MONITORING],
    "ngo-compliance-checker": [INTEGRATION_REGULATORY, INTEGRATION_MONITORING],
    "ngo-beneficiary-verification": [INTEGRATION_KYC, INTEGRATION_MONITORING],
    "ngo-impact-metrics": [INTEGRATION_MONITORING],
    "ngo-donor-compliance": [INTEGRATION_REGULATORY, INTEGRATION_MONITORING],
    "ngo-regulatory-reporting": [INTEGRATION_REGULATORY, INTEGRATION_MONITORING],
    "ngo-expense-ratio-monitor": [INTEGRATION_MONITORING],
    # RWA
    "rwa-asset-tokenization-tracker": [INTEGRATION_MONITORING],
    "rwa-rwa-compliance-monitor": [INTEGRATION_REGULATORY, INTEGRATION_MONITORING],
    "rwa-yield-analytics": [INTEGRATION_MONITORING],
    "rwa-proof-of-reserve": [INTEGRATION_MONITORING],
    "rwa-asset-performance": [INTEGRATION_MONITORING],
    "rwa-investor-accreditation": [INTEGRATION_KYC, INTEGRATION_MONITORING],
    "rwa-secondary-market-activity": [INTEGRATION_MONITORING],
    "rwa-asset-valuation-tracker": [INTEGRATION_MONITORING],
    "rwa-custody-monitor": [INTEGRATION_MONITORING],
}

# Default cost when widget is not in WIDGET_INTEGRATIONS (e.g. new widget ID from LLM)
DEFAULT_WIDGET_MONTHLY_USD = 85.0


def _monthly_usage_for_integration(
    integration_type: str,
    monthly_transactions: int | None,
    kyc_verifications_per_month: int | None,
) -> float:
    """Estimate monthly 'units' used for this integration (for per_unit pricing)."""
    pricing = INTEGRATION_PRICING.get(integration_type, {})
    driver = pricing.get("volume_driver")
    if not driver:
        return 0.0
    if driver == "monthly_transactions":
        return float(monthly_transactions or 0)
    if driver == "kyc_verifications_per_month":
        if kyc_verifications_per_month is not None:
            return float(kyc_verifications_per_month)
        # Rough proxy: ~0.3% of tx volume as new accounts needing KYC
        return (monthly_transactions or 0) * 0.003
    return 0.0


def _cost_for_integration(
    integration_type: str,
    monthly_transactions: int | None,
    kyc_verifications_per_month: int | None,
    widget_count_using: int,
) -> float:
    """
    Cost for one integration type when used by `widget_count_using` widgets in the bundle.
    Base is shared (count once per integration type); per-unit is summed from usage.
    """
    pricing = INTEGRATION_PRICING.get(integration_type, {})
    if not pricing:
        return 0.0
    base = pricing.get("base_monthly_usd") or 0.0
    per_unit = pricing.get("per_unit_usd") or 0.0
    usage = _monthly_usage_for_integration(
        integration_type, monthly_transactions, kyc_verifications_per_month
    )
    # Base counted once per integration type; per-unit scales with volume
    return base + (usage * per_unit)


def estimated_monthly_cost_usd(
    widget_ids: list[str],
    monthly_transactions: int | None = None,
    kyc_verifications_per_month: int | None = None,
) -> float:
    """
    Real-cost estimate for a bundle of widgets based on the APIs they integrate.
    Aggregates by integration type (each API type paid once per bundle) then sums.
    """
    if not widget_ids:
        return 0.0

    # Collect unique integration types used by this bundle (user pays once per API)
    integration_types_used: set[str] = set()
    for wid in widget_ids:
        integration_types_used.update(
            WIDGET_INTEGRATIONS.get(wid, [INTEGRATION_MONITORING])
        )

    total = 0.0
    for it in integration_types_used:
        total += _cost_for_integration(
            it,
            monthly_transactions,
            kyc_verifications_per_month,
            widget_count_using=1,
        )

    # Add a small per-widget platform overhead for widgets not in map (e.g. custom/LLM-suggested)
    known = set(WIDGET_INTEGRATIONS)
    unknown_count = sum(1 for wid in widget_ids if wid not in known)
    if unknown_count:
        total += unknown_count * DEFAULT_WIDGET_MONTHLY_USD

    return round(total, 2)
