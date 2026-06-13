import { NextResponse } from "next/server";
import {
  getMoneyGramAnchorHost,
  getStellarNetwork,
  isMoneyGramSandboxEnabled,
  MONEYGRAM_TESTNET_SIGNING_KEY,
} from "@/lib/moneygram/config";

/** Public sandbox config for checkout UI (no secrets). */
export async function GET() {
  return NextResponse.json({
    enabled: isMoneyGramSandboxEnabled(),
    sandbox: getStellarNetwork() === "testnet",
    anchorHost: getMoneyGramAnchorHost(),
    anchorSigningKey:
      getStellarNetwork() === "testnet" ? MONEYGRAM_TESTNET_SIGNING_KEY : undefined,
  });
}
