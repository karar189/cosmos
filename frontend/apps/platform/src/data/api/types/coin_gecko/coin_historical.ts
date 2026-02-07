// Main response interface from CoinGecko API for market chart data
export interface CoinMarketChartResponse {
  prices: [number, number][];        // [timestamp_unix_ms, price]
  market_caps: [number, number][];   // [timestamp_unix_ms, market_cap]
  total_volumes: [number, number][]; // [timestamp_unix_ms, volume]
}
export enum MarketChartSampling {
  FIVE_MINUTES = '5m',
  HOURLY = 'hourly',
  DAILY = 'daily',
}
// Main request parameters for the /coins/{id}/market_chart endpoint
export interface MarketChartRangeParams {
  id: string;           // coin ID (e.g., 'bitcoin')
  vs_currency: string;  // target currency (e.g., 'usd')
  days: string;        // number of days (e.g., '1', '7', '30', 'max')
  interval?: MarketChartSampling; // optional, auto granularity if not specified
  precision?: 'full' | '0' | '1' | '2' | '3' | '4' | '5' | '6' | '7' | '8' | '9' | '10' | '11' | '12' | '13' | '14' | '15' | '16' | '17' | '18';
}

// Main specific types for each array
type PricePoint = [timestamp: number, price: number];
type MarketCapPoint = [timestamp: number, marketCap: number];
type VolumePoint = [timestamp: number, volume: number];

export interface TypedCoinMarketChartResponse {
  prices: PricePoint[];
  market_caps: MarketCapPoint[];
  total_volumes: VolumePoint[];
}

// Transformed version for use in charts (easier to work with)
export interface ChartDataPoint {
  timestamp: number;      // Unix timestamp in milliseconds
  date: Date;            // Converted date
  price: number;
  marketCap: number;
  volume: number;
}

export interface TransformedChartData {
  data: ChartDataPoint[];
  summary: {
    startDate: Date;
    endDate: Date;
    minPrice: number;
    maxPrice: number;
    avgPrice: number;
    totalVolume: number;
    priceChange: number;
    priceChangePercentage: number;
    dataPoints: number;
  };
}