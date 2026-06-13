import { createHash } from "crypto";
import type { StellarNetwork } from "@/lib/stellar-payment";

/** MoneyGram Ramps sandbox anchor (Stellar testnet). */
export const MONEYGRAM_TESTNET_ANCHOR_HOST = "extstellar.moneygram.com";

/** MoneyGram signing key published in their docs (testnet). */
export const MONEYGRAM_TESTNET_SIGNING_KEY =
  "GCUZ6YLL5RQBTYLTTQLPCM73C5XAIUGK2TIMWQH7HPSGWVS2KJ2F3CHS";

export function getStellarNetwork(): StellarNetwork {
  return (process.env.NEXT_PUBLIC_STELLAR_NETWORK || "testnet") as StellarNetwork;
}

/** Sandbox wiring is testnet-only until production KYB + mainnet anchor are configured. */
export function isMoneyGramSandboxEnabled(): boolean {
  if (process.env.MONEYGRAM_ENABLED === "false") return false;
  if (getStellarNetwork() !== "testnet") return false;
  return Boolean(process.env.MONEYGRAM_AUTH_SECRET?.trim());
}

export function getMoneyGramAnchorHost(): string {
  return (process.env.MONEYGRAM_ANCHOR_HOME_DOMAIN || MONEYGRAM_TESTNET_ANCHOR_HOST).trim();
}

export function getMoneyGramAuthSecret(): string {
  const secret = process.env.MONEYGRAM_AUTH_SECRET?.trim();
  if (!secret) {
    throw new Error(
      "MoneyGram sandbox is not configured. Set MONEYGRAM_AUTH_SECRET (testnet S-key registered with MoneyGram)."
    );
  }
  return secret;
}

/** Stable positive memo id (≤64 bits) for custodial SEP-10 sessions per payment link. */
export function paymentLinkSep10MemoId(linkId: string): string {
  const digest = createHash("sha256").update(linkId).digest();
  const value = digest.readUInt32BE(0) & 0x7fffffff;
  return String(value || 1);
}

export function splitKycName(fullName: string): { firstName: string; lastName: string } {
  const trimmed = fullName.trim();
  if (!trimmed) return { firstName: "Guest", lastName: "User" };
  const parts = trimmed.split(/\s+/);
  if (parts.length === 1) return { firstName: parts[0], lastName: parts[0] };
  return { firstName: parts[0], lastName: parts.slice(1).join(" ") };
}
