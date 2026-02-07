export type PriceChartDataPoint = {
  date: string;
  value: number;
};

export type PriceChartType = 'price' | 'marketCap';

export type PriceChartTimeRange = '1D' | '7D' | '1M' | '1Y' | 'All';

export type PriceChartProps = {
  /** Price chart data */
  priceData: PriceChartDataPoint[];
  /** Market cap chart data */
  marketCapData: PriceChartDataPoint[];
  /** Initial chart type. Default: 'price' */
  initialChartType?: PriceChartType;
  /** Initial time range. Default: '7D' */
  initialTimeRange?: PriceChartTimeRange;
  /** Show chart type toggle. Default: true */
  showChartTypeToggle?: boolean;
  /** Show time range selector. Default: true */
  showTimeRange?: boolean;
  /** Custom Y-axis domain for price chart. If not provided, uses [55, 80] */
  priceYDomain?: [number, number];
  /** Custom Y-axis ticks for price chart. If not provided, uses [60, 65, 70, 75] */
  priceYTicks?: number[];
};

