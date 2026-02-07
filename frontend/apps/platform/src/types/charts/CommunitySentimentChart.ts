import type { StackedBarChartDataPoint } from '@core3/ui-components';

export type CommunitySentimentTimeRange = '1M' | '1Y' | 'All';

export type CommunitySentimentChartProps = {
  /** Chart data points */
  data: StackedBarChartDataPoint[];
  /** Chart title. Default: "Community Sentiment" */
  title?: string;
  /** Initial time range. Default: "1Y" */
  initialTimeRange?: CommunitySentimentTimeRange;
  /** Chart height. Default: 300 */
  height?: number;
  /** Color for positive values. Default: colors.chart.positive */
  positiveColor?: string;
  /** Color for negative values. Default: colors.chart.negative */
  negativeColor?: string;
  /** Show time range controls. Default: true */
  showTimeRange?: boolean;
  /** Show legend. Default: true */
  showLegend?: boolean;
};

