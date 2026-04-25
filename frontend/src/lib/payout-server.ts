/**
 * Server-only: send XLM from pool account to recipient.
 * Used for Phase 4 withdraw payout. Requires POOL_PAYOUT_SECRET or SOROBAN_COMMIT_SOURCE_SECRET.
 */

import { Keypair } from "@stellar/stellar-sdk";

const HORIZON_TESTNET = "https://horizon-testnet.stellar.org";
const HORIZON_MAINNET = "https://horizon.stellar.org";
const NETWORK_PASSPHRASE_TESTNET = "Test SDF Network ; September 2015";
const NETWORK_PASSPHRASE_MAINNET = "Public Global Stellar Network ; September 2015";

export type StellarNetwork = "testnet" | "public";

function getHorizonUrl(network: StellarNetwork): string {
  return network === "testnet" ? HORIZON_TESTNET : HORIZON_MAINNET;
}

function getNetworkPassphrase(network: StellarNetwork): string {
  return network === "testnet" ? NETWORK_PASSPHRASE_TESTNET : NETWORK_PASSPHRASE_MAINNET;
}

function normalizeAmount(amount: string): string {
  const n = parseFloat(amount);
  if (!Number.isFinite(n) || n < 0) return "0.0000000";
  return n.toFixed(7);
}

export type PayoutResult =
  | { success: true; txHash: string }
  | { success: false; error: string };

/**
 * Build, sign, and submit a payment from the pool account to recipient.
 * Uses POOL_PAYOUT_SECRET or SOROBAN_COMMIT_SOURCE_SECRET.
 */
export async function sendPayout(
  recipientAddress: string,
  amountXlm: string,
  network: StellarNetwork
): Promise<PayoutResult> {
  const secret =
    process.env.POOL_PAYOUT_SECRET?.trim() ||
    process.env.SOROBAN_COMMIT_SOURCE_SECRET?.trim();
  if (!secret) {
    return { success: false, error: "POOL_PAYOUT_SECRET or SOROBAN_COMMIT_SOURCE_SECRET not set" };
  }

  const keypair = Keypair.fromSecret(secret);
  const horizonUrl = getHorizonUrl(network);
  const networkPassphrase = getNetworkPassphrase(network);

  try {
    const {
      Horizon,
      TransactionBuilder,
      Operation,
      Asset,
    } = await import("@stellar/stellar-sdk");
    const server = new Horizon.Server(horizonUrl);
    const sourceAccount = await server.loadAccount(keypair.publicKey());
    const amountStr = normalizeAmount(amountXlm);

    const builder = new TransactionBuilder(sourceAccount, {
      fee: "100",
      networkPassphrase,
    });

    try {
      await server.loadAccount(recipientAddress);
      builder.addOperation(
        Operation.payment({
          destination: recipientAddress,
          asset: Asset.native(),
          amount: amountStr,
        })
      );
    } catch {
      builder.addOperation(
        Operation.createAccount({
          destination: recipientAddress,
          startingBalance: amountStr,
        })
      );
    }

    const tx = builder.setTimeout(30).build();
    tx.sign(keypair);
    const result = await server.submitTransaction(tx);
    return { success: true, txHash: result.hash };
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    return { success: false, error: message };
  }
}
