export type TVLChartDataPoint = {
  x: string;
  value: number;
};

export type TVLStatusBadge = {
  label: string;
};

export type TVLChartProps = {
  /** Chart data */
  data: TVLChartDataPoint[];
  /** Chart title */
  title?: string;
  /** Last update text */
  lastUpdate?: string;
  /** Status badges */
  statusBadges?: TVLStatusBadge[];
  /** Custom Y-axis domain */
  yDomain?: [number, number];
  /** Custom Y-axis ticks */
  yTicks?: number[];
};

