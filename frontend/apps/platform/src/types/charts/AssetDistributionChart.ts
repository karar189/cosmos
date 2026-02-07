export type AssetDistributionChartDataPoint = {
  name: string;
  value: number;
  color: string;
};

export type AssetDistributionChartProps = {
  /** Chart data points */
  data: AssetDistributionChartDataPoint[];
  /** Chart title. Default: "Asset Distribution" */
  title?: string;
  /** Donut chart size. Default: 200 */
  size?: number;
  /** Inner radius of the donut. Default: "60%" */
  innerRadius?: number | string;
  /** Outer radius of the donut. Default: "90%" */
  outerRadius?: number | string;
  /** Show percentage in tooltip. Default: true */
  showPercentage?: boolean;
};

