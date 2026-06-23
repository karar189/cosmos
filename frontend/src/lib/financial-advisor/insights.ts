import type { FaAssetHolding, FaInsight, FaPaymentInflow } from "@/lib/financial-advisor/types";

const DISCLAIMER =
  "Financial Advisor provides market intelligence, treasury analytics, and AI-generated insights for informational purposes. It does not constitute financial, investment, tax, or legal advice.";

export { DISCLAIMER };

export function computeHealthScore(
  holdings: FaAssetHolding[],
  totalUsd: number,
  stablecoinPct: number
): { score: number; label: "Healthy" | "Moderate" | "Needs Attention" } {
  if (totalUsd <= 0) {
    return { score: 50, label: "Moderate" };
  }

  let score = 50;
  const assetCount = holdings.filter((h) => h.usdValue > 0).length;
  score += Math.min(assetCount * 8, 24);
  score += Math.min(stablecoinPct * 0.35, 28);
  if (stablecoinPct >= 60) score += 8;

  const xlmPct = holdings.find((h) => h.symbol === "XLM")?.allocationPct ?? 0;
  if (xlmPct > 40) score -= 12;
  else if (xlmPct > 25) score -= 6;

  const topAllocation = Math.max(...holdings.map((h) => h.allocationPct), 0);
  if (topAllocation > 70) score -= 10;
  else if (topAllocation > 55) score -= 5;

  const clamped = Math.max(0, Math.min(100, Math.round(score)));
  const label =
    clamped >= 75 ? "Healthy" : clamped >= 55 ? "Moderate" : "Needs Attention";
  return { score: clamped, label };
}

export function generateInsights(
  holdings: FaAssetHolding[],
  totalUsd: number,
  changePeriodPct: number | null,
  paymentInflow: FaPaymentInflow,
  healthScore: number
): FaInsight[] {
  const insights: FaInsight[] = [];

  if (changePeriodPct != null && Math.abs(changePeriodPct) >= 0.5) {
    const dir = changePeriodPct >= 0 ? "increased" : "decreased";
    insights.push({
      id: "treasury-change",
      title: `Treasury ${dir} ${Math.abs(changePeriodPct).toFixed(1)}% this period`,
      explanation: `Your total treasury value has ${dir} over the selected time range based on holdings and market prices.`,
      riskLevel: changePeriodPct < -5 ? "medium" : "low",
      suggestedAction: changePeriodPct < -5 ? "Review volatile asset exposure" : "Continue monitoring allocation",
    });
  }

  const usdc = holdings.find((h) => h.symbol === "USDC");
  if (usdc && usdc.allocationPct >= 30) {
    insights.push({
      id: "stablecoin-base",
      title: `${usdc.allocationPct.toFixed(0)}% of treasury is USDC`,
      explanation: "A strong stablecoin base helps preserve liquidity for operations and payouts.",
      riskLevel: "low",
      suggestedAction: "Maintain liquidity reserve for operational expenses",
    });
  }

  const xlm = holdings.find((h) => h.symbol === "XLM");
  if (xlm && xlm.allocationPct >= 15) {
    insights.push({
      id: "xlm-exposure",
      title: `XLM represents ${xlm.allocationPct.toFixed(0)}% of your treasury`,
      explanation:
        xlm.allocationPct > 25
          ? "Volatile asset exposure is above a typical conservative treasury profile."
          : "XLM exposure supports Stellar network fees and ecosystem payments.",
      riskLevel: xlm.allocationPct > 25 ? "medium" : "low",
      suggestedAction:
        xlm.allocationPct > 25 ? "Consider converting excess XLM to stablecoins" : "Monitor XLM price movements",
    });
  }

  if (holdings.filter((h) => h.usdValue > 100).length >= 2) {
    const sorted = [...holdings].sort((a, b) => b.allocationPct - a.allocationPct);
    const topTwo = (sorted[0]?.allocationPct ?? 0) + (sorted[1]?.allocationPct ?? 0);
    if (topTwo > 75) {
      insights.push({
        id: "concentration",
        title: "Treasury is moderately concentrated in two assets",
        explanation: `${topTwo.toFixed(0)}% of value sits in ${sorted[0]?.symbol} and ${sorted[1]?.symbol}.`,
        riskLevel: "medium",
        suggestedAction: "Consider diversifying across additional stable assets",
      });
    }
  }

  if (paymentInflow.changeFromLastMonthPct != null && paymentInflow.changeFromLastMonthPct > 10) {
    insights.push({
      id: "payment-growth",
      title: `${paymentInflow.changeFromLastMonthPct.toFixed(0)}% more payments this month`,
      explanation: "Incoming payment volume is trending up compared to last month.",
      riskLevel: "low",
      suggestedAction: "Review which assets customers prefer for payments",
    });
  }

  const idleUsd = holdings
    .filter((h) => h.symbol !== "XLM" || h.allocationPct < 5)
    .reduce((s, h) => s + h.usdValue, 0);
  if (idleUsd >= 1000 && healthScore >= 70) {
    insights.push({
      id: "idle-capital",
      title: `$${idleUsd.toLocaleString("en-US", { maximumFractionDigits: 0 })} in deployable treasury`,
      explanation: "Stable holdings may be eligible for low-risk treasury opportunities on Stellar.",
      riskLevel: "low",
      suggestedAction: "Browse market opportunities",
    });
  }

  if (insights.length === 0) {
    insights.push({
      id: "getting-started",
      title: "Treasury tracking is active",
      explanation:
        totalUsd > 0
          ? "Connect more payment activity to unlock richer insights and recommendations."
          : "Receive payments through Hypertron to start building your treasury profile.",
      riskLevel: "low",
      suggestedAction: totalUsd > 0 ? "Explore Stellar markets" : "Create a payment link",
    });
  }

  return insights.slice(0, 6);
}

export function formatUsd(value: number): string {
  return value.toLocaleString("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
}

export function formatPct(value: number | null, signed = true): string {
  if (value == null || !Number.isFinite(value)) return "—";
  const prefix = signed && value > 0 ? "+" : "";
  return `${prefix}${value.toFixed(2)}%`;
}
