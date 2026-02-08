from __future__ import annotations

from dataclasses import dataclass
from typing import Literal

WidgetCategory = Literal[
    "remittance",
    "fintech",
    "bank",
    "stablecoin",
    "ngo",
    "rwa",
    "custom",
]


@dataclass(frozen=True)
class WidgetDef:
    id: str
    title: str
    category: WidgetCategory
    type: Literal["chart", "metric", "table", "alert"]
    # Short default justification used by heuristic fallback (LLM can override)
    why_default: str


# NOTE: These widget IDs intentionally match the frontend `availableWidgets` ids:
# `frontend/apps/platform/app/workspace/dashboard-builder/page.tsx`
WIDGETS: dict[str, WidgetDef] = {
    # ===== Custom / generic =====
    "compliance-score": WidgetDef(
        id="compliance-score",
        title="Compliance Score Trend",
        category="custom",
        type="chart",
        why_default="Gives an at-a-glance view of compliance posture over time and highlights regression early.",
    ),
    "routing-analytics": WidgetDef(
        id="routing-analytics",
        title="Routing Analytics",
        category="custom",
        type="chart",
        why_default="Helps identify bottlenecks and optimize operational flows and routing decisions.",
    ),
    "transaction-volume": WidgetDef(
        id="transaction-volume",
        title="Transaction Volume",
        category="custom",
        type="chart",
        why_default="Tracks throughput trends to detect anomalies, seasonality, and capacity needs.",
    ),
    "risk-heatmap": WidgetDef(
        id="risk-heatmap",
        title="Risk Heatmap",
        category="custom",
        type="chart",
        why_default="Highlights hotspots so teams can focus monitoring and controls where risk is concentrated.",
    ),
    "active-routes": WidgetDef(
        id="active-routes",
        title="Active Routes",
        category="custom",
        type="metric",
        why_default="Quickly shows how many routes/paths are active so outages are obvious.",
    ),
    "compliance-blocks": WidgetDef(
        id="compliance-blocks",
        title="Active Compliance Blocks",
        category="custom",
        type="metric",
        why_default="Shows enforcement actions in real time so ops can respond and unblock legitimate activity.",
    ),
    "alerts-panel": WidgetDef(
        id="alerts-panel",
        title="Recent Alerts",
        category="custom",
        type="alert",
        why_default="Centralizes critical alerts to reduce time-to-detection and time-to-response.",
    ),
    "asset-distribution": WidgetDef(
        id="asset-distribution",
        title="Asset Distribution",
        category="custom",
        type="chart",
        why_default="Shows concentration risk and exposure mix at a glance.",
    ),
    "custom-metric": WidgetDef(
        id="custom-metric",
        title="Custom Metric",
        category="custom",
        type="metric",
        why_default="Allows teams to track a business-specific KPI without engineering a bespoke dashboard.",
    ),
    "custom-chart": WidgetDef(
        id="custom-chart",
        title="Custom Chart",
        category="custom",
        type="chart",
        why_default="Visualize a business-specific metric and monitor changes over time.",
    ),
    "custom-table": WidgetDef(
        id="custom-table",
        title="Custom Table",
        category="custom",
        type="table",
        why_default="Operational listings and drill-downs for whatever dataset matters to the business.",
    ),
    "custom-alert": WidgetDef(
        id="custom-alert",
        title="Custom Alert",
        category="custom",
        type="alert",
        why_default="Lets teams define their own alert rules to match internal controls and SLAs.",
    ),
    "custom-api-integration-status": WidgetDef(
        id="custom-api-integration-status",
        title="API Integration Status",
        category="custom",
        type="metric",
        why_default="Shows whether critical integrations are healthy to avoid silent failures.",
    ),
    "custom-compliance-calendar": WidgetDef(
        id="custom-compliance-calendar",
        title="Compliance Calendar",
        category="custom",
        type="table",
        why_default="Keeps filing deadlines and periodic controls visible and reduces missed obligations.",
    ),
    "custom-team-activity-log": WidgetDef(
        id="custom-team-activity-log",
        title="Team Activity Log",
        category="custom",
        type="table",
        why_default="Provides an audit trail of internal actions for governance and incident response.",
    ),
    "custom-external-dashboard-link": WidgetDef(
        id="custom-external-dashboard-link",
        title="External Dashboard Link",
        category="custom",
        type="table",
        why_default="Quick access to third-party dashboards without context switching.",
    ),

    # ===== Remittance company =====
    "remittance-corridor-risk-monitor": WidgetDef(
        id="remittance-corridor-risk-monitor",
        title="Corridor Risk Monitor",
        category="remittance",
        type="chart",
        why_default="Risk scoring by corridor helps prioritize controls, pricing, and escalation for high-risk routes.",
    ),
    "remittance-cross-border-volume": WidgetDef(
        id="remittance-cross-border-volume",
        title="Cross-Border Volume",
        category="remittance",
        type="chart",
        why_default="Spot spikes/drops in corridor volume to detect fraud bursts, outages, or demand shifts.",
    ),
    "remittance-settlement-time-tracker": WidgetDef(
        id="remittance-settlement-time-tracker",
        title="Settlement Time Tracker",
        category="remittance",
        type="chart",
        why_default="Monitoring settlement SLAs prevents customer complaints and pinpoints operational bottlenecks.",
    ),
    "remittance-agent-network-monitor": WidgetDef(
        id="remittance-agent-network-monitor",
        title="Agent Network Monitor",
        category="remittance",
        type="table",
        why_default="Third-party agents add risk; visibility into agent status reduces operational and compliance incidents.",
    ),
    "remittance-transaction-limits-tracker": WidgetDef(
        id="remittance-transaction-limits-tracker",
        title="Transaction Limits Tracker",
        category="remittance",
        type="chart",
        why_default="Shows limit utilization so teams can proactively adjust rules and prevent declines or abuse.",
    ),
    "remittance-aml-screening-dashboard": WidgetDef(
        id="remittance-aml-screening-dashboard",
        title="AML Screening Dashboard",
        category="remittance",
        type="alert",
        why_default="Centralizes sanctions/PEP hits and screening alerts for fast, consistent adjudication.",
    ),
    "remittance-regulatory-alerts": WidgetDef(
        id="remittance-regulatory-alerts",
        title="Regulatory Alerts",
        category="remittance",
        type="alert",
        why_default="Corridor-specific regulatory changes require fast action; alerts reduce compliance lag.",
    ),
    "remittance-smurfing-detection": WidgetDef(
        id="remittance-smurfing-detection",
        title="Smurfing Detection",
        category="remittance",
        type="metric",
        why_default="Detects structuring behavior early to reduce AML exposure and reporting risk.",
    ),

    # ===== Fintech payments =====
    "fintech-payment-analytics": WidgetDef(
        id="fintech-payment-analytics",
        title="Payment Analytics",
        category="fintech",
        type="chart",
        why_default="Improves reliability by tracking success/failure rates and root-causing failures quickly.",
    ),
    "fintech-fraud-detection-dashboard": WidgetDef(
        id="fintech-fraud-detection-dashboard",
        title="Fraud Detection Dashboard",
        category="fintech",
        type="alert",
        why_default="Reduces loss by escalating anomalous activity and supporting faster fraud response.",
    ),
    "fintech-compliance-score-gauge": WidgetDef(
        id="fintech-compliance-score-gauge",
        title="Compliance Score",
        category="fintech",
        type="chart",
        why_default="Makes compliance gaps visible so remediation is prioritized and measurable.",
    ),
    "fintech-payment-volume-by-method": WidgetDef(
        id="fintech-payment-volume-by-method",
        title="Payment Volume by Method",
        category="fintech",
        type="chart",
        why_default="Shows channel mix and helps identify which rails need optimization or additional controls.",
    ),
    "fintech-chargeback-monitor": WidgetDef(
        id="fintech-chargeback-monitor",
        title="Chargeback Monitor",
        category="fintech",
        type="chart",
        why_default="Controls chargeback risk and protects relationships with processors and partners.",
    ),
    "fintech-authorization-rates": WidgetDef(
        id="fintech-authorization-rates",
        title="Authorization Rates",
        category="fintech",
        type="chart",
        why_default="Pinpoints issuer/rail issues so success rates improve with targeted fixes.",
    ),
    "fintech-payment-routing-optimizer": WidgetDef(
        id="fintech-payment-routing-optimizer",
        title="Payment Routing Optimizer",
        category="fintech",
        type="table",
        why_default="Suggests best routes to reduce costs and increase success rates.",
    ),
    "fintech-sanctions-screening": WidgetDef(
        id="fintech-sanctions-screening",
        title="Sanctions Screening",
        category="fintech",
        type="alert",
        why_default="Prevents prohibited transactions and reduces regulatory exposure via real-time screening.",
    ),

    # ===== Bank / Neobank =====
    "bank-kyc-kyb-dashboard": WidgetDef(
        id="bank-kyc-kyb-dashboard",
        title="KYC/KYB Dashboard",
        category="bank",
        type="table",
        why_default="Centralizes identity verification and review queues to reduce onboarding risk and backlog.",
    ),
    "bank-transaction-monitoring": WidgetDef(
        id="bank-transaction-monitoring",
        title="Transaction Monitoring",
        category="bank",
        type="alert",
        why_default="Real-time monitoring catches suspicious patterns earlier than periodic reviews.",
    ),
    "bank-risk-scoring-engine": WidgetDef(
        id="bank-risk-scoring-engine",
        title="Risk Scoring Engine",
        category="bank",
        type="chart",
        why_default="Risk tiering drives proportionate controls and reduces manual reviews for low-risk customers.",
    ),
    "bank-account-opening-metrics": WidgetDef(
        id="bank-account-opening-metrics",
        title="Account Opening Metrics",
        category="bank",
        type="chart",
        why_default="Improves onboarding efficiency by showing where applicants drop off and why.",
    ),
    "bank-lending-portfolio-health": WidgetDef(
        id="bank-lending-portfolio-health",
        title="Lending Portfolio Health",
        category="bank",
        type="chart",
        why_default="Tracks credit risk so teams can intervene early and control losses.",
    ),
    "bank-liquidity-monitor": WidgetDef(
        id="bank-liquidity-monitor",
        title="Liquidity Monitor",
        category="bank",
        type="chart",
        why_default="Prevents liquidity surprises by showing real-time inflows/outflows and buffer levels.",
    ),
    "bank-regulatory-reporting-status": WidgetDef(
        id="bank-regulatory-reporting-status",
        title="Regulatory Reporting Status",
        category="bank",
        type="table",
        why_default="Tracks filings and deadlines to reduce missed reports and audit findings.",
    ),
    "bank-customer-segmentation": WidgetDef(
        id="bank-customer-segmentation",
        title="Customer Segmentation",
        category="bank",
        type="chart",
        why_default="Helps tailor controls and product decisions based on customer cohorts and risk tiers.",
    ),
    "bank-large-value-transfer-monitor": WidgetDef(
        id="bank-large-value-transfer-monitor",
        title="Large-Value Transfer Monitor",
        category="bank",
        type="alert",
        why_default="Flags threshold events so enhanced due diligence and approvals happen on time.",
    ),

    # ===== Stablecoin issuer =====
    "stablecoin-reserve-monitoring": WidgetDef(
        id="stablecoin-reserve-monitoring",
        title="Reserve Monitoring",
        category="stablecoin",
        type="chart",
        why_default="Reserve transparency is core to issuer trust and regulatory compliance.",
    ),
    "stablecoin-redemption-tracker": WidgetDef(
        id="stablecoin-redemption-tracker",
        title="Redemption Tracker",
        category="stablecoin",
        type="table",
        why_default="Helps ensure redemptions meet SLAs and provides early warning of liquidity stress.",
    ),
    "stablecoin-peg-stability-monitor": WidgetDef(
        id="stablecoin-peg-stability-monitor",
        title="Peg Stability Monitor",
        category="stablecoin",
        type="chart",
        why_default="Detects peg deviation quickly to enable interventions and communications.",
    ),
    "stablecoin-circulation-analytics": WidgetDef(
        id="stablecoin-circulation-analytics",
        title="Circulation Analytics",
        category="stablecoin",
        type="chart",
        why_default="Understanding where supply sits reduces concentration and compliance risk.",
    ),
    "stablecoin-attestation-status": WidgetDef(
        id="stablecoin-attestation-status",
        title="Attestation Status",
        category="stablecoin",
        type="table",
        why_default="Keeps attestations and evidence organized to reduce audit friction and delays.",
    ),
    "stablecoin-mint-burn-volume": WidgetDef(
        id="stablecoin-mint-burn-volume",
        title="Mint/Burn Volume",
        category="stablecoin",
        type="chart",
        why_default="Tracks issuance/redemption activity to spot anomalies and plan liquidity.",
    ),
    "stablecoin-bank-balance-monitor": WidgetDef(
        id="stablecoin-bank-balance-monitor",
        title="Bank Balance Monitor",
        category="stablecoin",
        type="metric",
        why_default="Reduces reconciliation effort and helps avoid reserve shortfalls.",
    ),
    "stablecoin-regulatory-compliance": WidgetDef(
        id="stablecoin-regulatory-compliance",
        title="Regulatory Compliance",
        category="stablecoin",
        type="alert",
        why_default="Keeps teams aware of changing requirements and reduces compliance drift across regions.",
    ),

    # ===== NGO =====
    "ngo-donation-tracker": WidgetDef(
        id="ngo-donation-tracker",
        title="Donation Tracker",
        category="ngo",
        type="chart",
        why_default="Tracks donors, intent, and funds movement for transparency and donor requirements.",
    ),
    "ngo-fund-flow-monitor": WidgetDef(
        id="ngo-fund-flow-monitor",
        title="Fund Flow Monitor",
        category="ngo",
        type="chart",
        why_default="Detects diversion risk and delays by showing end-to-end fund movement.",
    ),
    "ngo-compliance-checker": WidgetDef(
        id="ngo-compliance-checker",
        title="Compliance Checker",
        category="ngo",
        type="alert",
        why_default="Sanctions screening is critical when operating in high-risk regions.",
    ),
    "ngo-beneficiary-verification": WidgetDef(
        id="ngo-beneficiary-verification",
        title="Beneficiary Verification",
        category="ngo",
        type="table",
        why_default="Reduces fraud and misallocation by verifying recipients and re-verifying periodically.",
    ),
    "ngo-impact-metrics": WidgetDef(
        id="ngo-impact-metrics",
        title="Impact Metrics",
        category="ngo",
        type="chart",
        why_default="Provides program outcome reporting required by donors and governance.",
    ),
    "ngo-donor-compliance": WidgetDef(
        id="ngo-donor-compliance",
        title="Donor Compliance",
        category="ngo",
        type="metric",
        why_default="Keeps KYD/source-of-funds requirements organized and auditable.",
    ),
    "ngo-regulatory-reporting": WidgetDef(
        id="ngo-regulatory-reporting",
        title="Regulatory Reporting",
        category="ngo",
        type="table",
        why_default="Organizes evidence packs and deadlines to avoid missed reporting obligations.",
    ),
    "ngo-expense-ratio-monitor": WidgetDef(
        id="ngo-expense-ratio-monitor",
        title="Expense Ratio Monitor",
        category="ngo",
        type="chart",
        why_default="Tracks program vs admin spending and flags drift early.",
    ),

    # ===== RWA platform =====
    "rwa-asset-tokenization-tracker": WidgetDef(
        id="rwa-asset-tokenization-tracker",
        title="Asset Tokenization Tracker",
        category="rwa",
        type="table",
        why_default="Links on-chain tokens to off-chain assets and tracks collateralization status.",
    ),
    "rwa-rwa-compliance-monitor": WidgetDef(
        id="rwa-rwa-compliance-monitor",
        title="RWA Compliance Monitor",
        category="rwa",
        type="alert",
        why_default="Monitors securities/regulatory changes impacting tokenized assets.",
    ),
    "rwa-yield-analytics": WidgetDef(
        id="rwa-yield-analytics",
        title="Yield Analytics",
        category="rwa",
        type="chart",
        why_default="Tracks distributions and reporting obligations for yield-bearing assets.",
    ),
    "rwa-proof-of-reserve": WidgetDef(
        id="rwa-proof-of-reserve",
        title="Proof of Reserve",
        category="rwa",
        type="chart",
        why_default="Increases trust by verifying off-chain backing and detecting shortfalls.",
    ),
    "rwa-asset-performance": WidgetDef(
        id="rwa-asset-performance",
        title="Asset Performance",
        category="rwa",
        type="chart",
        why_default="Tracks underlying asset value and risk to inform disclosures and controls.",
    ),
    "rwa-investor-accreditation": WidgetDef(
        id="rwa-investor-accreditation",
        title="Investor Accreditation",
        category="rwa",
        type="table",
        why_default="Ensures only eligible investors access restricted offerings and maintains audit trails.",
    ),
    "rwa-secondary-market-activity": WidgetDef(
        id="rwa-secondary-market-activity",
        title="Secondary Market Activity",
        category="rwa",
        type="chart",
        why_default="Monitors liquidity and detects market manipulation risk signals.",
    ),
    "rwa-asset-valuation-tracker": WidgetDef(
        id="rwa-asset-valuation-tracker",
        title="Asset Valuation Tracker",
        category="rwa",
        type="metric",
        why_default="Supports mark-to-market and disclosure workflows with fewer manual steps.",
    ),
    "rwa-custody-monitor": WidgetDef(
        id="rwa-custody-monitor",
        title="Custody Monitor",
        category="rwa",
        type="alert",
        why_default="Tracks custodian risks/incidents and asset location for operational resilience.",
    ),
}


def list_widgets() -> list[WidgetDef]:
    return list(WIDGETS.values())


def get_widget(widget_id: str) -> WidgetDef | None:
    return WIDGETS.get(widget_id)

