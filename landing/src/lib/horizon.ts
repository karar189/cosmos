/**
 * Server-side Horizon helpers for payment attribution (pool + memo).
 * Uses /accounts/{id}/payments to find incoming payments, then matches by transaction memo.
 */

import { getHorizonUrl, type StellarNetwork } from "./stellar-payment";

export interface HorizonTransaction {
  id: string;
  source_account?: string;
  memo?: string;
  memo_type?: string;
  created_at: string;
  successful: boolean;
}

/** Horizon payment record (payment operation). */
interface HorizonPayment {
  id: string;
  from: string;
  to: string;
  type: string;
  transaction_hash: string;
  created_at: string;
  transaction?: { memo_type?: string; memo?: string };
}

/** Decode memo from Horizon tx. With join=transactions, Horizon may return memo already decoded (plain string); otherwise it's base64. */
function decodeMemo(tx: { memo_type?: string; memo?: string }): string | null {
  if (tx.memo_type !== "text") return null;
  if (!tx.memo) return "";
  const raw = String(tx.memo).trim();
  if (!raw) return "";
  // When Horizon embeds transaction (join=transactions), memo is often already plain text.
  if (!/^[A-Za-z0-9+/]+=*$/.test(raw)) return raw;
  try {
    const decoded = Buffer.from(raw, "base64").toString("utf8");
    return decoded || raw;
  } catch {
    return raw;
  }
}

/** Get transaction memo (fetch full tx if not in payment record). */
async function getTransactionMemo(
  txHash: string,
  network: StellarNetwork
): Promise<string | null> {
  const base = getHorizonUrl(network);
  const res = await fetch(`${base}/transactions/${encodeURIComponent(txHash)}`, {
    cache: "no-store",
  });
  if (!res.ok) return null;
  const tx = (await res.json()) as { memo_type?: string; memo?: string };
  return decodeMemo(tx);
}

/** Get memo hash from tx as hex (32 bytes). For memo_type "hash", memo is base64. */
function getMemoHashHex(tx: { memo_type?: string; memo?: string }): string | null {
  if (tx.memo_type !== "hash" || !tx.memo) return null;
  try {
    const raw = String(tx.memo).trim();
    const buf = Buffer.from(raw, "base64");
    if (buf.length !== 32) return null;
    return buf.toString("hex");
  } catch {
    return null;
  }
}

/** Get the source (payer) account of a transaction. */
export async function getTransactionSourceAccount(
  txHash: string,
  network: StellarNetwork
): Promise<string | null> {
  const base = getHorizonUrl(network);
  const res = await fetch(`${base}/transactions/${encodeURIComponent(txHash)}`, {
    cache: "no-store",
  });
  if (!res.ok) return null;
  const tx = (await res.json()) as { source_account?: string };
  return tx.source_account ?? null;
}

/**
 * Find an incoming payment to the account with the given memo.
 * Uses /accounts/{id}/payments so we only consider payment operations (incoming when to === accountId).
 */
export async function findPaymentToAccountByMemo(
  accountId: string,
  memoFilter: string,
  network: StellarNetwork,
  limit = 100
): Promise<{ txHash: string; memo: string; sourceAccount: string } | null> {
  const base = getHorizonUrl(network);
  const pool = accountId.trim();
  const want = memoFilter.trim();

  // Get payments where this account participated; we want incoming (to === pool).
  // join=transactions embeds tx so we can read memo without extra request.
  const url = `${base}/accounts/${encodeURIComponent(pool)}/payments?limit=${limit}&order=desc&join=transactions`;
  const res = await fetch(url, { cache: "no-store" });
  if (!res.ok) {
    if (process.env.NODE_ENV === "development") {
      console.warn("[Horizon] payments fetch failed", res.status, await res.text());
    }
    return null;
  }

  const data = (await res.json()) as { _embedded?: { records?: HorizonPayment[] } };
  const records = data._embedded?.records ?? [];

  for (const payment of records) {
    if (payment.type !== "payment") continue;
    if (payment.to !== pool) continue; // only incoming to pool

    const txHash = payment.transaction_hash;
    let memo: string | null = null;
    if (payment.transaction?.memo_type != null) {
      memo = decodeMemo(payment.transaction);
    }
    if (memo === null) {
      memo = await getTransactionMemo(txHash, network);
    }
    if (memo === null) continue;
    if (memo.trim() !== want) continue;

    const sourceAccount =
      payment.from ?? (await getTransactionSourceAccount(txHash, network)) ?? "";
    return { txHash, memo: memo.trim(), sourceAccount };
  }
  return null;
}

/** Incoming payment with hash memo (for dark pool). */
export interface PaymentWithHashMemo {
  txHash: string;
  memoHashHex: string;
  sourceAccount: string;
  amount: string;
}

/**
 * Fetch recent incoming payments to the pool that have a hash memo.
 * Used to match dark-pool payments to PendingPaymentMemo.
 */
export async function findPaymentsToAccountWithHashMemo(
  accountId: string,
  network: StellarNetwork,
  limit = 100
): Promise<PaymentWithHashMemo[]> {
  const base = getHorizonUrl(network);
  const pool = accountId.trim();
  const url = `${base}/accounts/${encodeURIComponent(pool)}/payments?limit=${limit}&order=desc&join=transactions`;
  const res = await fetch(url, { cache: "no-store" });
  if (!res.ok) return [];

  const data = (await res.json()) as { _embedded?: { records?: HorizonPayment[] } };
  const records = data._embedded?.records ?? [];
  const out: PaymentWithHashMemo[] = [];

  for (const payment of records) {
    if (payment.type !== "payment") continue;
    if (payment.to !== pool) continue;
    const memoHashHex = payment.transaction
      ? getMemoHashHex(payment.transaction)
      : null;
    if (!memoHashHex) continue;
    const sourceAccount =
      payment.from ?? (await getTransactionSourceAccount(payment.transaction_hash, network)) ?? "";
    out.push({
      txHash: payment.transaction_hash,
      memoHashHex,
      sourceAccount,
      amount: (payment as { amount?: string }).amount ?? "0",
    });
  }
  return out;
}
