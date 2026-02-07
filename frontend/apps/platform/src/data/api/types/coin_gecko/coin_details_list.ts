export interface TokenDetailListResponseItem {
  id: string;                 // coin ID, e.g. "bitcoin"
  symbol: string;             // e.g. "btc"
  name: string;               // e.g. "Bitcoin"
  image: string;              // URL de la imagen

  current_price: number | null;

  market_cap: number | null;
  market_cap_rank: number | null;
  fully_diluted_valuation: number | null;

  total_volume: number | null;

  high_24h: number | null;
  low_24h: number | null;

  price_change_24h: number | null;
  price_change_percentage_24h: number | null;

  market_cap_change_24h: number | null;
  market_cap_change_percentage_24h: number | null;

  circulating_supply: number | null;
  total_supply: number | null;
  max_supply: number | null;

  ath: number | null;
  ath_change_percentage: number | null;
  ath_date: string | null;    // ISO date-time

  atl: number | null;
  atl_change_percentage: number | null;
  atl_date: string | null;    // ISO date-time

  roi: ROIData | null;

  last_updated: string;       // ISO date-time
}

export interface ROIData {
  times: number;      // ROI multiplier
  currency: string;   // ROI currency, e.g. "usd"
  percentage: number; // ROI percentage
}

// La respuesta completa del endpoint:
export type TokenDetailsListResponse = TokenDetailListResponseItem[];

export interface TokenDetailsListParams {
  vs_currency: string;               // The target currency of market data (usd, eur, jpy, etc.)
  ids?: string[];                    // Comma-separated list of coin IDs to filter (e.g. 'bitcoin,ethereum')
  names?: string[];                  // Comma-separated list of coin names to filter (e.g. 'Bitcoin,Ethereum')
  per_page?: number;                 // Total results per page
  page?: number;                     // Page through results
  price_change_percentage?: string[]; // Include price change percentage in response (e.g. ['1h', '24h', '7d', '14d', '30d', '1y'])
}