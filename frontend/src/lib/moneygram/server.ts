import { Wallet, SigningKeypair } from "@stellar/typescript-wallet-sdk";
import { Memo } from "@stellar/stellar-sdk";
import {
  getMoneyGramAnchorHost,
  getMoneyGramAuthSecret,
  isMoneyGramSandboxEnabled,
  paymentLinkSep10MemoId,
  splitKycName,
} from "@/lib/moneygram/config";
import { normalizePaymentAmount } from "@/lib/stellar-assets";

export type MoneyGramDepositResult = {
  url: string;
  transactionId: string;
};

export type MoneyGramTransactionStatus = {
  id: string;
  status: string;
  stellarTransactionId?: string;
  amountIn?: string;
  amountOut?: string;
};

function getAnchor() {
  const wallet = Wallet.TestNet();
  return wallet.anchor({ homeDomain: getMoneyGramAnchorHost() });
}

async function authenticateForLink(linkId: string) {
  const anchor = getAnchor();
  const sep10 = await anchor.sep10();
  const authKey = SigningKeypair.fromSecret(getMoneyGramAuthSecret());
  const memoId = paymentLinkSep10MemoId(linkId);
  const authToken = await sep10.authenticate({ accountKp: authKey, memoId });
  return { anchor, authToken };
}

export async function initiateMoneyGramDeposit(params: {
  linkId: string;
  destinationAccount: string;
  linkMemo: string;
  amount: string;
  kycName: string;
  kycEmail: string;
}): Promise<MoneyGramDepositResult> {
  if (!isMoneyGramSandboxEnabled()) {
    throw new Error("MoneyGram sandbox is disabled or not configured for testnet.");
  }

  const { anchor, authToken } = await authenticateForLink(params.linkId);
  const { firstName, lastName } = splitKycName(params.kycName);
  const amount = normalizePaymentAmount(params.amount, "USDC");
  const memoText = params.linkMemo.trim().slice(0, 28);

  const response = await anchor.sep24().deposit({
    assetCode: "USDC",
    authToken,
    lang: "en",
    destinationAccount: params.destinationAccount.trim(),
    destinationMemo: Memo.text(memoText),
    extraFields: {
      amount,
      email: params.kycEmail.trim(),
      first_name: firstName,
      last_name: lastName,
    },
  });

  if (!response.url || !response.id) {
    throw new Error("MoneyGram did not return a deposit session URL.");
  }

  return { url: response.url, transactionId: response.id };
}

export async function getMoneyGramTransactionStatus(params: {
  linkId: string;
  transactionId: string;
}): Promise<MoneyGramTransactionStatus> {
  if (!isMoneyGramSandboxEnabled()) {
    throw new Error("MoneyGram sandbox is disabled or not configured for testnet.");
  }

  const { anchor, authToken } = await authenticateForLink(params.linkId);
  const tx = await anchor.sep24().getTransactionBy({
    authToken,
    id: params.transactionId,
  });

  return {
    id: tx.id ?? params.transactionId,
    status: String(tx.status ?? "unknown"),
    stellarTransactionId: tx.stellar_transaction_id,
    amountIn: tx.amount_in,
    amountOut: tx.amount_out,
  };
}
