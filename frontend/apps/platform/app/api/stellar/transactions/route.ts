import { NextRequest, NextResponse } from 'next/server';

const HORIZON_MAINNET = 'https://horizon.stellar.org';
const HORIZON_TESTNET = 'https://horizon-testnet.stellar.org';

export interface HorizonTransactionRecord {
  id: string;
  created_at: string;
  successful: boolean;
  [key: string]: unknown;
}

export interface HorizonTransactionsResponse {
  _embedded: { records: HorizonTransactionRecord[] };
  [key: string]: unknown;
}

/** Stellar public keys start with G and are 56 chars (base32). */
function looksLikeStellarPublicKey(value: string): boolean {
  const trimmed = value.trim();
  return trimmed.length >= 56 && (trimmed.startsWith('G') || trimmed.startsWith('g'));
}

/**
 * Proxy to Stellar Horizon: GET /accounts/:account_id/transactions
 * Used by Transaction Analytics widget to fetch wallet transactions.
 */
export async function GET(request: NextRequest) {
  try {
    const accountId = request.nextUrl.searchParams.get('accountId') ?? request.nextUrl.searchParams.get('wallet');
    if (!accountId || typeof accountId !== 'string') {
      return NextResponse.json({ error: 'Missing accountId or wallet' }, { status: 400 });
    }
    const trimmed = accountId.trim();
    if (!looksLikeStellarPublicKey(trimmed)) {
      return NextResponse.json(
        { error: 'Invalid Stellar address. Use a public key starting with G (56 characters).' },
        { status: 400 }
      );
    }
    const limit = Math.min(Number(request.nextUrl.searchParams.get('limit')) || 200, 200);
    const path = `/accounts/${encodeURIComponent(trimmed)}/transactions?limit=${limit}&order=desc`;

    const fetchFromHorizon = (baseUrl: string) =>
      fetch(`${baseUrl}${path}`);

    // Try mainnet first
    let response = await fetchFromHorizon(HORIZON_MAINNET);
    // If 404 on mainnet, try testnet (account may be on testnet, e.g. testnet.steexp.com)
    if (response.status === 404) {
      response = await fetchFromHorizon(HORIZON_TESTNET);
    }

    if (!response.ok) {
      const text = await response.text();
      let userMessage: string;
      if (response.status === 404) {
        userMessage = 'Account not found on mainnet or testnet. Check that the Stellar address (G...) is correct.';
        try {
          const horizonErr = JSON.parse(text) as { detail?: string; title?: string };
          if (horizonErr.detail && horizonErr.detail.length < 200) {
            userMessage = horizonErr.detail;
          }
        } catch {
          // use default userMessage
        }
      } else {
        userMessage = `Horizon error: ${response.status}`;
      }
      return NextResponse.json(
        { error: userMessage, status: response.status },
        { status: response.status }
      );
    }
    const data: HorizonTransactionsResponse = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error('Stellar transactions API error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
