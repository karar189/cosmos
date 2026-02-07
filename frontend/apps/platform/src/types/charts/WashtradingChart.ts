export type WashtradingChartDataPoint = {
  x: string;
  lineValue: number;
  barValue: number;
};

export type WashtradingChartProps = {
  /** Chart data points */
  data: WashtradingChartDataPoint[];
  /** Chart title. Default: "Washtrading" */
  title?: string;
  /** Subtitle. Default: "CEX Holdings vs Vol" */
  subtitle?: string;
  /** Show average badge. Default: true */
  showAverageBadge?: boolean;
  /** Custom Y-axis domain for line. If not provided, uses [40, 125] */
  lineYDomain?: [number, number];
  /** Custom Y-axis domain for bars. If not provided, uses [0, 1200] */
  barYDomain?: [number, number];
  /** Custom Y-axis ticks for line. If not provided, uses [40, 55, 70, 85, 100, 115, 125] */
  lineYTicks?: number[];
  /** Custom Y-axis ticks for bars. If not provided, uses [0, 62.5, 125, 187.5, 250] */
  barYTicks?: number[];
  /** Line color. Default: colors.text.primary */
  lineColor?: string;
  /** Bar color. Default: colors.neutral.gray300 */
  barColor?: string;
  /** Chart height. Default: 280 */
  height?: number;
  /** Bar size. Default: 12 */
  barSize?: number;
  /** Custom margin */
  margin?: {
    top?: number;
    right?: number;
    left?: number;
    bottom?: number;
  };
};

