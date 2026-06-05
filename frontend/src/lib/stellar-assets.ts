import type { StellarNetwork } from "@/lib/stellar-payment";

export type PaymentAssetCode = "USDC" | "XLM";

/** Brand logos from CoinGecko (aligned with dashboard wallet charts). */
export const STELLAR_LOGO_URL =
  "https://coin-images.coingecko.com/coins/images/100/large/fmpFRHHQ_400x400.jpg?1735231350";

export const USDC_LOGO_URL =
  "https://coin-images.coingecko.com/coins/images/6319/large/usdc.png?1696506694";

/** Circle USDC on Stellar (official issuers). */
/** @see https://developers.circle.com/stablecoins/usdc-contract-addresses */
export const CIRCLE_USDC_ISSUER: Record<StellarNetwork, string> = {
  testnet: "GBBD47IF6LWK7P7MDEVSCWR7DPUWV3NY3DTQEVFL4NAT4AQH3ZLLFLA5",
  public: "GA5ZSEJYB37JXL5HIFDVCFZZA5TQA3UOXMZHERO4V54CV2PMIUDVONV",
};

export const USDC_ASSET_CODE = "USDC";

export function getUsdcIssuer(network: StellarNetwork): string {
  const fromEnv =
    network === "public"
      ? process.env.NEXT_PUBLIC_USDC_ISSUER_MAINNET?.trim()
      : process.env.NEXT_PUBLIC_USDC_ISSUER_TESTNET?.trim();
  return fromEnv || CIRCLE_USDC_ISSUER[network];
}

export function normalizePaymentAssetCode(raw: unknown): PaymentAssetCode {
  const v = typeof raw === "string" ? raw.trim().toUpperCase() : "";
  return v === "XLM" ? "XLM" : "USDC";
}

export function paymentAssetDecimals(code: PaymentAssetCode): number {
  return code === "USDC" ? 7 : 7;
}

export function normalizePaymentAmount(amount: string, code: PaymentAssetCode): string {
  const n = parseFloat(amount.replace(/,/g, ""));
  if (!Number.isFinite(n) || n < 0) return code === "USDC" ? "0.0000000" : "0.0000000";
  return n.toFixed(paymentAssetDecimals(code));
}
