import type { FaTreasurySnapshot, FaMarketsResponse, FaAssetDetail } from "@/lib/financial-advisor/types";
import { DISCLAIMER } from "@/lib/financial-advisor/insights";

export const DEMO_TREASURY_SNAPSHOT: FaTreasurySnapshot = {
  businessId: "demo",
  totalTreasuryUsd: 128430.42,
  totalTreasuryUsdFormatted: "$128,430.42",
  changePeriodPct: 8.4,
  changePeriodLabel: "this month",
  realizedGainLossUsd: 1240,
  unrealizedGainLossUsd: 7000.18,
  assetsHeld: 4,
  holdings: [
    {
      symbol: "USDC",
      amount: 57000,
      amountFormatted: "57,000.00",
      usdPrice: 1,
      usdValue: 57000,
      allocationPct: 44,
      change24hPct: 0.01,
      change7dPct: 0.03,
      source: "both",
    },
    {
      symbol: "EURC",
      amount: 20000,
      amountFormatted: "20,000.00",
      usdPrice: 1.08,
      usdValue: 21600,
      allocationPct: 20,
      change24hPct: 0.02,
      change7dPct: 0.1,
      source: "vault",
    },
    {
      symbol: "XLM",
      amount: 80000,
      amountFormatted: "80,000.00",
      usdPrice: 0.23,
      usdValue: 18400,
      allocationPct: 18,
      change24hPct: 3.2,
      change7dPct: 14.8,
      source: "both",
    },
  ],
  paymentInflow: {
    today: 2840,
    thisWeek: 12400,
    thisMonth: 42840,
    transactionCount: 38,
    changeFromLastMonthPct: 22,
  },
  healthScore: 82,
  healthLabel: "Healthy",
  treasurySeries: [
    { date: "2026-05-01", valueUsd: 98000, label: "May 1" },
    { date: "2026-05-08", valueUsd: 102400, label: "May 8" },
    { date: "2026-05-15", valueUsd: 108200, label: "May 15" },
    { date: "2026-05-22", valueUsd: 112800, label: "May 22" },
    { date: "2026-06-01", valueUsd: 118600, label: "Jun 1" },
    { date: "2026-06-08", valueUsd: 122400, label: "Jun 8" },
    { date: "2026-06-15", valueUsd: 126800, label: "Jun 15" },
    { date: "2026-06-23", valueUsd: 128430.42, label: "Jun 23" },
  ],
  paymentSeries: [
    { label: "Mon", volume: 4200, count: 4 },
    { label: "Tue", volume: 6800, count: 6 },
    { label: "Wed", volume: 5100, count: 5 },
    { label: "Thu", volume: 8900, count: 8 },
    { label: "Fri", volume: 12400, count: 11 },
    { label: "Sat", volume: 2100, count: 2 },
    { label: "Sun", volume: 3340, count: 2 },
  ],
  insights: [
    {
      id: "demo-1",
      title: "Treasury increased 8.4% over the last 30 days",
      explanation: "Growth driven primarily by USDC payment inflows and XLM price appreciation.",
      riskLevel: "low",
      suggestedAction: "Review asset allocation",
    },
    {
      id: "demo-2",
      title: "42% of treasury is held in USDC",
      explanation: "Strong stablecoin base supports operational liquidity.",
      riskLevel: "low",
      suggestedAction: "Maintain liquidity reserve",
    },
    {
      id: "demo-3",
      title: "XLM exposure increased this month",
      explanation: "18% of treasury is in XLM — monitor if it exceeds 25%.",
      riskLevel: "medium",
      suggestedAction: "Set allocation limit",
    },
  ],
  lastUpdated: new Date().toISOString(),
  disclaimer: DISCLAIMER,
};

export const DEMO_MARKETS: FaMarketsResponse = {
  assets: [
    {
      symbol: "USDC",
      name: "USD Coin",
      logoUrl: "https://coin-images.coingecko.com/coins/images/6319/large/usdc.png?1696506694",
      priceUsd: 1.0,
      change1hPct: 0,
      change6hPct: 0.01,
      change24hPct: 0.01,
      change7dPct: 0.03,
      marketCapUsd: 35e9,
      volume24hUsd: 5e9,
      circulatingSupply: 35e9,
      riskScore: 12,
      riskLabel: "Low Risk",
      category: "stablecoin",
      supportedByHypertron: true,
    },
    {
      symbol: "XLM",
      name: "Stellar Lumens",
      logoUrl: "https://coin-images.coingecko.com/coins/images/100/large/fmpFRHHQ_400x400.jpg?1735231350",
      priceUsd: 0.23,
      change1hPct: 0.4,
      change6hPct: 1.2,
      change24hPct: 3.2,
      change7dPct: 14.8,
      marketCapUsd: 6.8e9,
      volume24hUsd: 210e6,
      circulatingSupply: 29e9,
      riskScore: 28,
      riskLabel: "Low Risk",
      category: "native",
      supportedByHypertron: true,
    },
    {
      symbol: "EURC",
      name: "Euro Coin",
      logoUrl: "https://coin-images.coingecko.com/coins/images/26045/large/EURC.png?1769615705",
      priceUsd: 1.08,
      change1hPct: 0.01,
      change6hPct: 0.02,
      change24hPct: 0.02,
      change7dPct: 0.1,
      marketCapUsd: 180e6,
      volume24hUsd: 12e6,
      circulatingSupply: 167e6,
      riskScore: 12,
      riskLabel: "Low Risk",
      category: "stablecoin",
      supportedByHypertron: true,
    },
    {
      symbol: "AQUA",
      name: "Aquarius",
      logoUrl: "https://coin-images.coingecko.com/coins/images/17809/large/QUA.png?1696517356",
      priceUsd: 0.0042,
      change1hPct: -0.2,
      change6hPct: -0.8,
      change24hPct: -1.2,
      change7dPct: 5.6,
      marketCapUsd: 12e6,
      volume24hUsd: 890e3,
      circulatingSupply: 2.8e9,
      riskScore: 55,
      riskLabel: "Medium Risk",
      category: "defi",
      supportedByHypertron: false,
    },
  ],
  topGainers: [],
  topLosers: [],
  lastUpdated: new Date().toISOString(),
};

DEMO_MARKETS.topGainers = [...DEMO_MARKETS.assets]
  .sort((a, b) => (b.change24hPct ?? 0) - (a.change24hPct ?? 0))
  .slice(0, 3);
DEMO_MARKETS.topLosers = [...DEMO_MARKETS.assets]
  .sort((a, b) => (a.change24hPct ?? 0) - (b.change24hPct ?? 0))
  .slice(0, 3);

export function demoAssetDetail(symbol: string): FaAssetDetail | null {
  const base = DEMO_MARKETS.assets.find((a) => a.symbol === symbol.toUpperCase());
  if (!base) return null;

  const holding = DEMO_TREASURY_SNAPSHOT.holdings.find((h) => h.symbol === base.symbol) ?? null;

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

  const meta = descriptions[base.symbol] ?? { desc: base.name, use: "Digital asset", issuer: "Unknown" };
  const change24 = base.change24hPct ?? 0;

  return {
    ...base,
    issuer: meta.issuer,
    assetType: base.category === "stablecoin" ? "Stablecoin" : base.category === "native" ? "Native Asset" : "DeFi Token",
    description: meta.desc,
    primaryUseCase: meta.use,
    securityScore: base.riskScore <= 30 ? 88 : base.riskScore <= 55 ? 72 : 54,
    securityLabel: base.riskScore <= 30 ? "Low Risk" : base.riskScore <= 55 ? "Medium Risk" : "High Risk",
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
      base.symbol === "XLM"
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
      base.symbol === "XLM" && (holding?.allocationPct ?? 0) > 20
        ? "Monitor"
        : base.category === "stablecoin"
          ? "Suitable for Treasury Reserve"
          : "Hold",
    treasuryHolding: holding,
    treasuryRecommendation: holding
      ? `You hold ${holding.amountFormatted} ${base.symbol}, representing ${holding.allocationPct.toFixed(0)}% of your treasury. ${
          holding.allocationPct > 25 ? "Consider reducing exposure above 25%." : "Current allocation is within a typical range."
        }`
      : "You do not currently hold this asset in your Hypertron treasury.",
    priceHistory: Array.from({ length: 14 }, (_, i) => ({
      date: `Day ${i + 1}`,
      price: base.priceUsd * (1 + (Math.sin(i / 2) * 0.04 + (change24 / 100) * (i / 14))),
    })),
    news: [
      {
        headline: `Stellar ecosystem ${base.symbol} activity update`,
        source: "Hypertron Market Intelligence",
        date: new Date().toISOString().slice(0, 10),
        summary: `${base.name} continues to see payment and DEX activity across the Stellar network.`,
        sentiment: change24 >= 0 ? "Bullish" : "Neutral",
      },
    ],
  };
}
