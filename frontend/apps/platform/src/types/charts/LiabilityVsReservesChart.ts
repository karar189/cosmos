export type LiabilityVsReservesChartDataPoint = {
  x: string;
  value: number;
};

export type LiabilityVsReservesChartProps = {
  /** Chart data points */
  data: LiabilityVsReservesChartDataPoint[];
  /** Chart title. Default: "Liability vs Reserves" */
  title?: string;
  /** Custom Y-axis domain. If not provided, uses [102, 105] */
  yDomain?: [number, number];
  /** Custom Y-axis ticks. If not provided, uses [102, 103, 104, 105] */
  yTicks?: number[];
  /** Bar color. Default: colors.neutral.gray650 */
  barColor?: string;
  /** Bar width in pixels. Default: 24 */
  barSize?: number;
};

