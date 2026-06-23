import type { PaymentAssetCode } from "@/lib/stellar-assets";

export type FaTimeRange = "1d" | "7d" | "30d" | "90d" | "all";

export type FaAssetHolding = {
  symbol: PaymentAssetCode;
  amount: number;
  amountFormatted: string;
  usdPrice: number;
  usdValue: number;
  allocationPct: number;
  change24hPct: number | null;
  change7dPct: number | null;
  source: "vault" | "virtual" | "both";
};

export type FaPaymentInflow = {
  today: number;
  thisWeek: number;
  thisMonth: number;
  transactionCount: number;
  changeFromLastMonthPct: number | null;
};

export type FaTreasurySeriesPoint = {
  date: string;
  valueUsd: number;
  label: string;
};

export type FaInsight = {
  id: string;
  title: string;
  explanation: string;
  riskLevel: "low" | "medium" | "high";
  suggestedAction: string;
};

export type FaTreasurySnapshot = {
  businessId: string;
  totalTreasuryUsd: number;
  totalTreasuryUsdFormatted: string;
  changePeriodPct: number | null;
  changePeriodLabel: string;
  realizedGainLossUsd: number;
  unrealizedGainLossUsd: number;
  assetsHeld: number;
  holdings: FaAssetHolding[];
  paymentInflow: FaPaymentInflow;
  healthScore: number;
  healthLabel: "Healthy" | "Moderate" | "Needs Attention";
  treasurySeries: FaTreasurySeriesPoint[];
  paymentSeries: { label: string; volume: number; count: number }[];
  insights: FaInsight[];
  lastUpdated: string;
  disclaimer: string;
};

export type FaMarketAsset = {
  symbol: string;
  name: string;
  logoUrl: string;
  priceUsd: number;
  change1hPct: number | null;
  change6hPct: number | null;
  change24hPct: number | null;
  change7dPct: number | null;
  marketCapUsd: number | null;
  volume24hUsd: number | null;
  circulatingSupply: number | null;
  riskScore: number;
  riskLabel: "Low Risk" | "Medium Risk" | "High Risk";
  category: "stablecoin" | "native" | "defi";
  supportedByHypertron: boolean;
};

export type FaMarketsResponse = {
  assets: FaMarketAsset[];
  topGainers: FaMarketAsset[];
  topLosers: FaMarketAsset[];
  lastUpdated: string;
};

export type FaAssetDetail = FaMarketAsset & {
  issuer: string;
  assetType: string;
  description: string;
  primaryUseCase: string;
  securityScore: number;
  securityLabel: string;
  riskCategories: { name: string; score: number; label: string }[];
  sentiment: "Bullish" | "Neutral" | "Bearish";
  shortTermOutlook: string;
  longTermOutlook: string;
  keyDrivers: string[];
  risks: string[];
  aiRecommendation: string;
  treasuryHolding: FaAssetHolding | null;
  treasuryRecommendation: string;
  priceHistory: { date: string; price: number }[];
  news: { headline: string; source: string; date: string; summary: string; sentiment: string }[];
};
