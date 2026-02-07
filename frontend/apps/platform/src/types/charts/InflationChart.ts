export type InflationChartDataPoint = {
  x: string;
  value: number;
};

export type InflationChartProps = {
  /** Chart data */
  data: InflationChartDataPoint[];
  /** Chart title */
  title?: string;
  /** Subtitle text */
  subtitle?: string;
  /** Range indicator text */
  rangeIndicator?: string;
  /** Custom Y-axis domain */
  yDomain?: [number, number];
  /** Custom Y-axis ticks */
  yTicks?: number[];
};

