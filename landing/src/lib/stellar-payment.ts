/**
 * Build and submit a Stellar XLM payment (or createAccount if destination is new).
 * Used on the pay page: build unsigned XDR -> Freighter signs -> submit to Horizon.
 *
 * Optional escrow: For milestone-based flows, wire to soroban-escrow (EscrowEngine.create,
 * approve_milestone) via Soroban RPC and Contract.getFootprint(); use @stellar/stellar-sdk
 * contract client and Freighter for signing Soroban auth entries.
 */

const HORIZON_TESTNET = "https://horizon-testnet.stellar.org";
const HORIZON_MAINNET = "https://horizon.stellar.org";
const NETWORK_PASSPHRASE_TESTNET = "Test SDF Network ; September 2015";
const NETWORK_PASSPHRASE_MAINNET = "Public Global Stellar Network ; September 2015";

export type StellarNetwork = "testnet" | "public";

export function getHorizonUrl(network: StellarNetwork): string {
  return network === "testnet" ? HORIZON_TESTNET : HORIZON_MAINNET;
}

export function getNetworkPassphrase(network: StellarNetwork): string {
  return network === "testnet" ? NETWORK_PASSPHRASE_TESTNET : NETWORK_PASSPHRASE_MAINNET;
}

/** Normalize amount to 7 decimals (Stellar format). */
function normalizeAmount(amount: string): string {
  const n = parseFloat(amount);
  if (!Number.isFinite(n) || n < 0) return "0.0000000";
  return n.toFixed(7);
}

export interface BuildPaymentXdrParams {
  horizonUrl: string;
  networkPassphrase: string;
  sourcePublicKey: string;
  destinationPublicKey: string;
  amountXlm: string;
  memo?: string;
}

export type BuildPaymentXdrResult =
  | { success: true; xdr: string }
  | { success: false; error: string };

export async function buildPaymentXdr(
  params: BuildPaymentXdrParams
): Promise<BuildPaymentXdrResult> {
  const {
    horizonUrl,
    networkPassphrase,
    sourcePublicKey,
    destinationPublicKey,
    amountXlm,
    memo,
  } = params;

  try {
    const StellarSdk = await import("@stellar/stellar-sdk");
    const { Horizon } = StellarSdk;
    const { TransactionBuilder, Operation, Asset, Memo } = StellarSdk;

    const server = new Horizon.Server(horizonUrl);
    const sourceAccount = await server.loadAccount(sourcePublicKey);

    const amountStr = normalizeAmount(amountXlm);
    const fee = "100";

    const builder = new TransactionBuilder(sourceAccount, {
      fee,
      networkPassphrase,
    });

    try {
      await server.loadAccount(destinationPublicKey);
      builder.addOperation(
        Operation.payment({
          destination: destinationPublicKey,
          asset: Asset.native(),
          amount: amountStr,
        })
      );
    } catch {
      builder.addOperation(
        Operation.createAccount({
          destination: destinationPublicKey,
          startingBalance: amountStr,
        })
      );
    }

    if (memo && memo.trim()) {
      builder.addMemo(Memo.text(memo.trim().slice(0, 28)));
    }

    const transaction = builder.setTimeout(30).build();
    const xdr = transaction.toEnvelope().toXDR("base64");
    return { success: true, xdr };
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    return { success: false, error: message };
  }
}

export async function submitSignedTransaction(
  horizonUrl: string,
  networkPassphrase: string,
  signedXdr: string
): Promise<{ success: true; txHash: string } | { success: false; error: string }> {
  try {
    const StellarSdk = await import("@stellar/stellar-sdk");
    const { Horizon, Transaction } = StellarSdk;
    const server = new Horizon.Server(horizonUrl);
    const tx = new Transaction(signedXdr, networkPassphrase);
    const result = await server.submitTransaction(tx);
    return { success: true, txHash: result.hash };
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    return { success: false, error: message };
  }
}
