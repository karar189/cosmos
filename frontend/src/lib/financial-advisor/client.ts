import type { FaAssetDetail, FaMarketsResponse, FaTimeRange, FaTreasurySnapshot } from "@/lib/financial-advisor/types";

export async function fetchTreasurySnapshot(
  businessId: string,
  range: FaTimeRange = "30d"
): Promise<FaTreasurySnapshot> {
  const res = await fetch(
    `/api/financial-advisor/treasury?businessId=${encodeURIComponent(businessId)}&range=${range}`,
    { credentials: "same-origin" }
  );
  if (!res.ok) throw new Error("Failed to load treasury");
  return res.json() as Promise<FaTreasurySnapshot>;
}

export async function fetchMarkets(): Promise<FaMarketsResponse> {
  const res = await fetch("/api/financial-advisor/markets", { credentials: "same-origin" });
  if (!res.ok) throw new Error("Failed to load markets");
  return res.json() as Promise<FaMarketsResponse>;
}

export async function fetchAssetDetail(businessId: string, symbol: string): Promise<FaAssetDetail | null> {
  const res = await fetch(
    `/api/financial-advisor/markets/${encodeURIComponent(symbol)}?businessId=${encodeURIComponent(businessId)}`,
    { credentials: "same-origin" }
  );
  if (res.status === 404) return null;
  if (!res.ok) throw new Error("Failed to load asset");
  return res.json() as Promise<FaAssetDetail>;
}
