/**
 * Private settlement (hash memos, relayer, PoolManager commits).
 * Disabled for v1 — enable when relayer + Soroban pool are production-ready.
 *
 * TODO(production-privacy): set ENABLE_PRIVATE_SETTLEMENT=true after audit + mainnet pool deploy.
 */
export const ENABLE_PRIVATE_SETTLEMENT = false;

export function isPrivateSettlementEnabled(): boolean {
  if (process.env.NEXT_PUBLIC_ENABLE_PRIVATE_SETTLEMENT === "true") return true;
  return ENABLE_PRIVATE_SETTLEMENT;
}
