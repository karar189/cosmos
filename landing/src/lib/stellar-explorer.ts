/**
 * Stellar explorer URLs (StellarExpert). Use for mainnet (public) and testnet tx/account links.
 */

export const STELLAR_NETWORK = (process.env.NEXT_PUBLIC_STELLAR_NETWORK || "testnet") as "testnet" | "public";

const EXPLORER_TX_BASE =
  STELLAR_NETWORK === "testnet"
    ? "https://stellar.expert/explorer/testnet/tx"
    : "https://stellar.expert/explorer/public/tx";

/** Full StellarExpert URL for a transaction (mainnet or testnet from env). */
export function getExplorerTxUrl(txHash: string): string {
  return `${EXPLORER_TX_BASE}/${txHash}`;
}
