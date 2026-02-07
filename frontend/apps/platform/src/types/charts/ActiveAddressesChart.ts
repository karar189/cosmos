export type ActiveAddressesTimeRange = '1D' | '7D' | '1M' | '1Y' | 'All';

export type ActiveAddressesChartDataPoint = {
  x: string;
  value: number;
};

export type ActiveAddressesChartProps = {
  /** Chart data */
  data: ActiveAddressesChartDataPoint[];
  /** Chart title */
  title?: string;
  /** Show time range selector */
  showTimeRange?: boolean;
  /** Initial time range */
  initialTimeRange?: ActiveAddressesTimeRange;
  /** Custom Y-axis domain */
  yDomain?: [number, number];
  /** Custom Y-axis ticks */
  yTicks?: number[];
  /** Show info icon */
  showInfoIcon?: boolean;
};

