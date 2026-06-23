import { db } from "@/lib/prisma";
import { getVaultBalance } from "@/lib/vault";
import { getVirtualBalances } from "@/lib/virtual-balance";
import type { PaymentAssetCode } from "@/lib/stellar-assets";
import {
  computeHealthScore,
  DISCLAIMER,
  formatUsd,
  generateInsights,
} from "@/lib/financial-advisor/insights";
import { fetchAssetPrices, getPriceForCode, buildMarketAssets, MARKET_ASSET_CONFIG } from "@/lib/financial-advisor/prices";
import type {
  FaAssetDetail,
  FaAssetHolding,
  FaMarketsResponse,
  FaPaymentInflow,
  FaTimeRange,
  FaTreasurySeriesPoint,
  FaTreasurySnapshot,
} from "@/lib/financial-advisor/types";

const STELLAR_NETWORK = (process.env.NEXT_PUBLIC_STELLAR_NETWORK || "testnet") as "testnet" | "public";

function startOfDay(d: Date): Date {
  const x = new Date(d);
  x.setHours(0, 0, 0, 0);
  return x;
}

function rangeStart(range: FaTimeRange): Date | null {
  const now = new Date();
  if (range === "all") return null;
  const d = new Date(now);
  if (range === "1d") d.setDate(d.getDate() - 1);
  else if (range === "7d") d.setDate(d.getDate() - 7);
  else if (range === "30d") d.setDate(d.getDate() - 30);
  else if (range === "90d") d.setDate(d.getDate() - 90);
  return d;
}

function changePeriodLabel(range: FaTimeRange): string {
  if (range === "1d") return "today";
  if (range === "7d") return "this week";
  if (range === "30d") return "this month";
  if (range === "90d") return "this quarter";
  return "all time";
}

function mergeHoldings(
  vault: { xlmRaw: number; usdcRaw: number } | null,
  virtual: { virtualBalanceUsdc: string; virtualBalanceXlm: string },
  quotes: Awaited<ReturnType<typeof fetchAssetPrices>>
): FaAssetHolding[] {
  const map = new Map<PaymentAssetCode, { amount: number; source: FaAssetHolding["source"] }>();

  if (vault) {
    if (vault.usdcRaw > 0) {
      map.set("USDC", { amount: vault.usdcRaw, source: "vault" });
    }
    if (vault.xlmRaw > 0) {
      const prev = map.get("XLM");
      map.set("XLM", {
        amount: (prev?.amount ?? 0) + vault.xlmRaw,
        source: prev ? "both" : "vault",
      });
    }
  }

  const vUsdc = parseFloat(virtual.virtualBalanceUsdc);
  const vXlm = parseFloat(virtual.virtualBalanceXlm);
  if (Number.isFinite(vUsdc) && vUsdc > 0) {
    const prev = map.get("USDC");
    map.set("USDC", {
      amount: (prev?.amount ?? 0) + vUsdc,
      source: prev ? "both" : "virtual",
    });
  }
  if (Number.isFinite(vXlm) && vXlm > 0) {
    const prev = map.get("XLM");
    map.set("XLM", {
      amount: (prev?.amount ?? 0) + vXlm,
      source: prev ? "both" : "virtual",
    });
  }

  const holdings: FaAssetHolding[] = [];
  for (const [symbol, { amount, source }] of Array.from(map.entries())) {
    const quote = getPriceForCode(quotes, symbol);
    const usdValue = amount * quote.usd;
    holdings.push({
      symbol,
      amount,
      amountFormatted: amount.toLocaleString("en-US", { maximumFractionDigits: 4 }),
      usdPrice: quote.usd,
      usdValue,
      allocationPct: 0,
      change24hPct: quote.change24hPct,
      change7dPct: quote.change7dPct,
      source,
    });
  }

  const total = holdings.reduce((s, h) => s + h.usdValue, 0);
  for (const h of holdings) {
    h.allocationPct = total > 0 ? Math.round((h.usdValue / total) * 100) : 0;
  }

  return holdings.sort((a, b) => b.usdValue - a.usdValue);
}

function buildPaymentInflow(
  paidLinks: { amount: string | null; paidAt: Date | null; currency: string | null }[]
): FaPaymentInflow {
  const now = new Date();
  const todayStart = startOfDay(now);
  const weekStart = new Date(now);
  weekStart.setDate(weekStart.getDate() - 7);
  const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);
  const lastMonthStart = new Date(now.getFullYear(), now.getMonth() - 1, 1);
  const lastMonthEnd = new Date(now.getFullYear(), now.getMonth(), 0, 23, 59, 59);

  let today = 0;
  let thisWeek = 0;
  let thisMonth = 0;
  let lastMonth = 0;
  let count = 0;

  for (const link of paidLinks) {
    if (!link.paidAt) continue;
    const amt = parseFloat(link.amount ?? "");
    if (!Number.isFinite(amt) || amt <= 0) continue;
    const paid = new Date(link.paidAt);
    count += 1;
    if (paid >= todayStart) today += amt;
    if (paid >= weekStart) thisWeek += amt;
    if (paid >= monthStart) thisMonth += amt;
    if (paid >= lastMonthStart && paid <= lastMonthEnd) lastMonth += amt;
  }

  const changeFromLastMonthPct =
    lastMonth > 0 ? Math.round(((thisMonth - lastMonth) / lastMonth) * 100) : thisMonth > 0 ? 100 : null;

  return {
    today,
    thisWeek,
    thisMonth,
    transactionCount: count,
    changeFromLastMonthPct,
  };
}

function buildTreasurySeries(
  paidLinks: { amount: string | null; paidAt: Date | null }[],
  quotes: Awaited<ReturnType<typeof fetchAssetPrices>>,
  xlmPrice: number
): FaTreasurySeriesPoint[] {
  const sorted = paidLinks
    .filter((l) => l.paidAt && l.amount)
    .map((l) => ({
      paidAt: new Date(l.paidAt!),
      amount: parseFloat(l.amount!),
    }))
    .filter((l) => Number.isFinite(l.amount))
    .sort((a, b) => a.paidAt.getTime() - b.paidAt.getTime());

  if (sorted.length === 0) return [];

  const byDay = new Map<string, number>();
  let cumulative = 0;
  for (const item of sorted) {
    cumulative += item.amount * xlmPrice;
    const key = item.paidAt.toISOString().slice(0, 10);
    byDay.set(key, cumulative);
  }

  return Array.from(byDay.entries()).map(([date, valueUsd]) => {
    const d = new Date(date);
    const label = d.toLocaleDateString("en-US", { month: "short", day: "numeric" });
    return { date, valueUsd, label };
  });
}

function buildPaymentSeries(
  paidLinks: { amount: string | null; paidAt: Date | null }[]
): { label: string; volume: number; count: number }[] {
  const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  const buckets = days.map((label) => ({ label, volume: 0, count: 0 }));
  const weekStart = new Date();
  weekStart.setDate(weekStart.getDate() - 7);

  for (const link of paidLinks) {
    if (!link.paidAt) continue;
    const paid = new Date(link.paidAt);
    if (paid < weekStart) continue;
    const amt = parseFloat(link.amount ?? "");
    if (!Number.isFinite(amt)) continue;
    const idx = paid.getDay();
    buckets[idx]!.volume += amt;
    buckets[idx]!.count += 1;
  }

  return [...buckets.slice(1), buckets[0]!];
}

export async function buildTreasurySnapshot(
  businessId: string,
  range: FaTimeRange = "30d"
): Promise<FaTreasurySnapshot> {
  const [business, virtual, quotes] = await Promise.all([
    db.business.findUnique({
      where: { id: businessId },
      select: { vaultAddress: true },
    }),
    getVirtualBalances(businessId),
    fetchAssetPrices(),
  ]);

  let vaultBalance: { xlmRaw: number; usdcRaw: number } | null = null;
  if (business?.vaultAddress) {
    const bal = await getVaultBalance(business.vaultAddress, STELLAR_NETWORK);
    if (bal) {
      vaultBalance = { xlmRaw: bal.xlmRaw, usdcRaw: bal.usdcRaw };
    }
  }

  const holdings = mergeHoldings(vaultBalance, virtual, quotes);
  const totalTreasuryUsd = holdings.reduce((s, h) => s + h.usdValue, 0);

  const paidLinks = await db.paymentLink.findMany({
    where: { businessId, paidAt: { not: null } },
    select: { amount: true, paidAt: true, currency: true },
    orderBy: { paidAt: "asc" },
  });

  const paymentInflow = buildPaymentInflow(paidLinks);
  const xlmQuote = getPriceForCode(quotes, "XLM");
  const treasurySeries = buildTreasurySeries(paidLinks, quotes, xlmQuote.usd);
  const paymentSeries = buildPaymentSeries(paidLinks);

  const rangeFrom = rangeStart(range);
  let changePeriodPct: number | null = null;
  if (rangeFrom && treasurySeries.length >= 2) {
    const inRange = treasurySeries.filter((p) => new Date(p.date) >= rangeFrom);
    const first = inRange[0]?.valueUsd ?? treasurySeries[0]!.valueUsd;
    const last = totalTreasuryUsd > 0 ? totalTreasuryUsd : inRange[inRange.length - 1]?.valueUsd ?? first;
    if (first > 0) changePeriodPct = Math.round(((last - first) / first) * 1000) / 10;
  }

  const stablecoinUsd = holdings
    .filter((h) => h.symbol === "USDC" || h.symbol === "EURC")
    .reduce((s, h) => s + h.usdValue, 0);
  const stablecoinPct = totalTreasuryUsd > 0 ? (stablecoinUsd / totalTreasuryUsd) * 100 : 0;
  const { score, label } = computeHealthScore(holdings, totalTreasuryUsd, stablecoinPct);
  const insights = generateInsights(holdings, totalTreasuryUsd, changePeriodPct, paymentInflow, score);

  const assetsHeld = holdings.filter((h) => h.usdValue > 0.01).length;

  return {
    businessId,
    totalTreasuryUsd,
    totalTreasuryUsdFormatted: formatUsd(totalTreasuryUsd),
    changePeriodPct,
    changePeriodLabel: changePeriodLabel(range),
    realizedGainLossUsd: 0,
    unrealizedGainLossUsd: 0,
    assetsHeld,
    holdings,
    paymentInflow,
    healthScore: score,
    healthLabel: label,
    treasurySeries,
    paymentSeries,
    insights,
    lastUpdated: new Date().toISOString(),
    disclaimer: DISCLAIMER,
  };
}

export async function buildMarketsResponse(): Promise<FaMarketsResponse> {
  const quotes = await fetchAssetPrices();
  const assets = buildMarketAssets(quotes);
  const sorted = [...assets].sort((a, b) => (b.change24hPct ?? 0) - (a.change24hPct ?? 0));

  return {
    assets,
    topGainers: sorted.slice(0, 3),
    topLosers: [...assets].sort((a, b) => (a.change24hPct ?? 0) - (b.change24hPct ?? 0)).slice(0, 3),
    lastUpdated: new Date().toISOString(),
  };
}

export async function buildAssetDetail(
  businessId: string,
  symbolRaw: string
): Promise<FaAssetDetail | null> {
  const symbol = symbolRaw.toUpperCase();
  const cfg = MARKET_ASSET_CONFIG.find((a) => a.symbol === symbol);
  if (!cfg) return null;

  const [markets, snapshot] = await Promise.all([
    buildMarketsResponse(),
    buildTreasurySnapshot(businessId, "30d"),
  ]);

  const base = markets.assets.find((a) => a.symbol === symbol);
  if (!base) return null;

  const holding = snapshot.holdings.find((h) => h.symbol === symbol) ?? null;
  const change24 = base.change24hPct ?? 0;

  const descriptions: Record<string, { desc: string; use: string; issuer: string }> = {
    XLM: {
      desc: "Stellar Lumens (XLM) is the native asset of the Stellar network, used for transaction fees and as a bridge currency.",
      use: "Network fees, cross-border payments, and liquidity on Stellar DEX.",
      issuer: "Stellar Development Foundation",
    },
    USDC: {
      desc: "USD Coin is a fully reserved digital dollar issued by Circle, available on Stellar for payments and treasury.",
      use: "Stable store of value, invoicing, and B2B settlement.",
      issuer: "Circle",
    },
    EURC: {
      desc: "Euro Coin is Circle's euro-denominated stablecoin on Stellar for European payment flows.",
      use: "EUR-denominated invoicing and cross-border settlement.",
      issuer: "Circle",
    },
    AQUA: {
      desc: "AQUA is the governance token of Aquarius, a liquidity management protocol on Stellar.",
      use: "DeFi liquidity incentives and protocol governance.",
      issuer: "Aquarius DAO",
    },
  };

  const meta = descriptions[symbol] ?? { desc: base.name, use: "Digital asset", issuer: "Unknown" };

  return {
    ...base,
    issuer: meta.issuer,
    assetType: base.category === "stablecoin" ? "Stablecoin" : base.category === "native" ? "Native Asset" : "DeFi Token",
    description: meta.desc,
    primaryUseCase: meta.use,
    securityScore: base.riskScore <= 30 ? 88 : base.riskScore <= 55 ? 72 : 54,
    securityLabel: base.riskLabel,
    riskCategories: [
      { name: "Issuer Risk", score: base.category === "stablecoin" ? 10 : 25, label: "Low" },
      { name: "Liquidity Risk", score: (base.volume24hUsd ?? 0) > 50e6 ? 15 : 45, label: (base.volume24hUsd ?? 0) > 50e6 ? "Low" : "Medium" },
      { name: "Market Risk", score: Math.min(90, Math.abs(change24) * 8), label: Math.abs(change24) < 5 ? "Low" : "Medium" },
      { name: "Regulatory Risk", score: base.category === "stablecoin" ? 20 : 35, label: "Low" },
    ],
    sentiment: change24 > 2 ? "Bullish" : change24 < -2 ? "Bearish" : "Neutral",
    shortTermOutlook:
      change24 > 0
        ? "Recent momentum is positive with steady volume on Stellar DEX."
        : "Price is consolidating; watch liquidity and payment inflow trends.",
    longTermOutlook:
      symbol === "XLM"
        ? "Stellar adoption in payments and stablecoin corridors supports long-term utility."
        : base.category === "stablecoin"
          ? "Stablecoins remain core infrastructure for Hypertron merchant treasuries."
          : "Ecosystem growth and liquidity depth will drive long-term value.",
    keyDrivers: [
      "Stellar payment transaction growth",
      "Stablecoin liquidity on Stellar DEX",
      "Institutional partnerships",
    ],
    risks: base.category === "stablecoin"
      ? ["Regulatory changes affecting stablecoins", "Issuer reserve transparency"]
      : ["Price volatility", "Market liquidity shifts", "Concentrated ownership"],
    aiRecommendation:
      symbol === "XLM" && (holding?.allocationPct ?? 0) > 20
        ? "Monitor"
        : base.category === "stablecoin"
          ? "Suitable for Treasury Reserve"
          : "Hold",
    treasuryHolding: holding,
    treasuryRecommendation: holding
      ? `You hold ${holding.amountFormatted} ${symbol}, representing ${holding.allocationPct.toFixed(0)}% of your treasury. ${
          holding.allocationPct > 25 ? "Consider reducing exposure above 25%." : "Current allocation is within a typical range."
        }`
      : "You do not currently hold this asset in your Hypertron treasury.",
    priceHistory: Array.from({ length: 14 }, (_, i) => ({
      date: `D${i + 1}`,
      price: base.priceUsd * (1 + Math.sin(i / 2) * 0.04),
    })),
    news: [
      {
        headline: `${base.name} market update`,
        source: "Hypertron Market Intelligence",
        date: new Date().toISOString().slice(0, 10),
        summary: `${base.name} activity continues across Stellar payment and DEX channels.`,
        sentiment: change24 >= 0 ? "Bullish" : "Neutral",
      },
    ],
  };
}
