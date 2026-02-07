import { ChartDataPoint, CoinMarketChartResponse, TransformedChartData } from "../types/coin_gecko/coin_historical";

/**
 * Transforms CoinGecko market chart range data into a format suitable for charting.
 * @param response The raw response from CoinGecko API
 * @returns Transformed chart data with summary statistics
 */
export function transformMarketChartRangeData(
  response: CoinMarketChartResponse
): TransformedChartData {
  if (!response.prices?.length) {
    throw new Error('No price data available');
  }

  // Combine the three arrays into a single array of objects
  const data: ChartDataPoint[] = response.prices.map((pricePoint, index) => ({
    timestamp: pricePoint[0],
    date: new Date(pricePoint[0]),
    price: pricePoint[1],
    marketCap: response.market_caps[index]?.[1] || 0,
    volume: response.total_volumes[index]?.[1] || 0,
  }));

  // Calculate statistics
  const prices = data.map(dataItem => dataItem.price);
  const minPrice = Math.min(...prices);
  const maxPrice = Math.max(...prices);
  const avgPrice = prices.reduce((price1, price2) => price1 + price2, 0) / prices.length;
  const totalVolume = data.reduce((sum, data_item) => sum + data_item.volume, 0);
  
  const firstPrice = data[0]?.price || 0;
  const lastPrice = data[data.length - 1]?.price || 0;
  const priceChange = lastPrice - firstPrice;
  const priceChangePercentage = firstPrice !== 0 
    ? (priceChange / firstPrice) * 100 
    : 0;

  return {
    data,
    summary: {
      startDate: data[0]?.date || new Date(),
      endDate: data[data.length - 1]?.date || new Date(),
      minPrice,
      maxPrice,
      avgPrice,
      totalVolume,
      priceChange,
      priceChangePercentage,
      dataPoints: data.length,
    },
  };
}