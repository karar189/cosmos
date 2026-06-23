import {
  EURC_LOGO_URL,
  paymentAssetLogo,
  STELLAR_LOGO_URL,
  USDC_LOGO_URL,
  type PaymentAssetCode,
} from "@/lib/stellar-assets";
import type { FaMarketAsset } from "@/lib/financial-advisor/types";

/** CoinGecko ids for Stellar ecosystem assets we surface in Financial Advisor. */
export const MARKET_ASSET_CONFIG: {
  symbol: string;
  name: string;
  coingeckoId: string;
  logoUrl: string;
  category: FaMarketAsset["category"];
  supportedByHypertron: boolean;
  stablecoin: boolean;
}[] = [
  {
    symbol: "XLM",
    name: "Stellar Lumens",
    coingeckoId: "stellar",
    logoUrl: STELLAR_LOGO_URL,
    category: "native",
    supportedByHypertron: true,
    stablecoin: false,
  },
  {
    symbol: "USDC",
    name: "USD Coin",
    coingeckoId: "usd-coin",
    logoUrl: USDC_LOGO_URL,
    category: "stablecoin",
    supportedByHypertron: true,
    stablecoin: true,
  },
  {
    symbol: "EURC",
    name: "Euro Coin",
    coingeckoId: "euro-coin",
    logoUrl: EURC_LOGO_URL,
    category: "stablecoin",
    supportedByHypertron: true,
    stablecoin: true,
  },
  {
    symbol: "AQUA",
    name: "Aquarius",
    coingeckoId: "aquarius",
    logoUrl: "https://coin-images.coingecko.com/coins/images/17809/large/QUA.png?1696517356",
    category: "defi",
    supportedByHypertron: false,
    stablecoin: false,
  },
];

export type AssetPriceQuote = {
  symbol: string;
  usd: number;
  change24hPct: number | null;
  change7dPct: number | null;
  change1hPct: number | null;
  marketCapUsd: number | null;
  volume24hUsd: number | null;
  circulatingSupply: number | null;
};

const FALLBACK_PRICES: Record<string, AssetPriceQuote> = {
  XLM: { symbol: "XLM", usd: 0.23, change24hPct: 2.1, change7dPct: 8.4, change1hPct: 0.3, marketCapUsd: 6.8e9, volume24hUsd: 210e6, circulatingSupply: 29e9 },
  USDC: { symbol: "USDC", usd: 1.0, change24hPct: 0.01, change7dPct: 0.02, change1hPct: 0, marketCapUsd: 35e9, volume24hUsd: 5e9, circulatingSupply: 35e9 },
  EURC: { symbol: "EURC", usd: 1.08, change24hPct: 0.02, change7dPct: 0.1, change1hPct: 0, marketCapUsd: 180e6, volume24hUsd: 12e6, circulatingSupply: 167e6 },
  AQUA: { symbol: "AQUA", usd: 0.0042, change24hPct: -1.2, change7dPct: 5.6, change1hPct: -0.2, marketCapUsd: 12e6, volume24hUsd: 890e3, circulatingSupply: 2.8e9 },
};

let priceCache: { at: number; quotes: Map<string, AssetPriceQuote> } | null = null;
const CACHE_TTL_MS = 60_000;

function riskFromAsset(symbol: string, change24h: number | null, stablecoin: boolean): { score: number; label: FaMarketAsset["riskLabel"] } {
  if (stablecoin) return { score: 12, label: "Low Risk" };
  const vol = Math.abs(change24h ?? 0);
  if (symbol === "XLM" && vol < 8) return { score: 28, label: "Low Risk" };
  if (vol < 5) return { score: 35, label: "Medium Risk" };
  if (vol < 12) return { score: 55, label: "Medium Risk" };
  return { score: 78, label: "High Risk" };
}

export async function fetchAssetPrices(): Promise<Map<string, AssetPriceQuote>> {
  if (priceCache && Date.now() - priceCache.at < CACHE_TTL_MS) {
    return priceCache.quotes;
  }

  const ids = MARKET_ASSET_CONFIG.map((a) => a.coingeckoId).join(",");
  const url =
    `https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&ids=${ids}` +
    "&order=market_cap_desc&sparkline=false&price_change_percentage=1h,24h,7d";

  try {
    const res = await fetch(url, {
      next: { revalidate: 60 },
      headers: { Accept: "application/json" },
    });
    if (!res.ok) throw new Error(`CoinGecko ${res.status}`);

    const rows = (await res.json()) as {
      id: string;
      current_price: number;
      price_change_percentage_1h_in_currency?: number;
      price_change_percentage_24h?: number;
      price_change_percentage_7d_in_currency?: number;
      market_cap?: number;
      total_volume?: number;
      circulating_supply?: number;
    }[];

    const quotes = new Map<string, AssetPriceQuote>();
    for (const cfg of MARKET_ASSET_CONFIG) {
      const row = rows.find((r) => r.id === cfg.coingeckoId);
      if (row && Number.isFinite(row.current_price)) {
        quotes.set(cfg.symbol, {
          symbol: cfg.symbol,
          usd: row.current_price,
          change1hPct: row.price_change_percentage_1h_in_currency ?? null,
          change24hPct: row.price_change_percentage_24h ?? null,
          change7dPct: row.price_change_percentage_7d_in_currency ?? null,
          marketCapUsd: row.market_cap ?? null,
          volume24hUsd: row.total_volume ?? null,
          circulatingSupply: row.circulating_supply ?? null,
        });
      } else {
        quotes.set(cfg.symbol, FALLBACK_PRICES[cfg.symbol]!);
      }
    }

    priceCache = { at: Date.now(), quotes };
    return quotes;
  } catch {
    const quotes = new Map<string, AssetPriceQuote>();
    for (const cfg of MARKET_ASSET_CONFIG) {
      quotes.set(cfg.symbol, FALLBACK_PRICES[cfg.symbol]!);
    }
    priceCache = { at: Date.now(), quotes };
    return quotes;
  }
}

export function getPriceForCode(
  quotes: Map<string, AssetPriceQuote>,
  code: PaymentAssetCode
): AssetPriceQuote {
  const q = quotes.get(code);
  if (q) return q;
  if (code === "XLM") return FALLBACK_PRICES.XLM!;
  if (code === "EURC") return FALLBACK_PRICES.EURC!;
  return FALLBACK_PRICES.USDC!;
}

export function buildMarketAssets(quotes: Map<string, AssetPriceQuote>): FaMarketAsset[] {
  return MARKET_ASSET_CONFIG.map((cfg) => {
    const q = quotes.get(cfg.symbol) ?? FALLBACK_PRICES[cfg.symbol]!;
    const risk = riskFromAsset(cfg.symbol, q.change24hPct, cfg.stablecoin);
    return {
      symbol: cfg.symbol,
      name: cfg.name,
      logoUrl: cfg.logoUrl,
      priceUsd: q.usd,
      change1hPct: q.change1hPct,
      change6hPct: q.change1hPct != null ? q.change1hPct * 2.5 : null,
      change24hPct: q.change24hPct,
      change7dPct: q.change7dPct,
      marketCapUsd: q.marketCapUsd,
      volume24hUsd: q.volume24hUsd,
      circulatingSupply: q.circulatingSupply,
      riskScore: risk.score,
      riskLabel: risk.label,
      category: cfg.category,
      supportedByHypertron: cfg.supportedByHypertron,
    };
  });
}

export function assetLogo(symbol: string): string {
  const cfg = MARKET_ASSET_CONFIG.find((a) => a.symbol === symbol.toUpperCase());
  if (cfg) return cfg.logoUrl;
  return paymentAssetLogo(symbol as PaymentAssetCode);
}
