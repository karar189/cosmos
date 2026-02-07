import type { MultiLineChartDataPoint, MultiLineChartLine } from '@core3/ui-components';

export type PolCategoriesTimeRange = '1W' | '1M' | '6M' | '1Y' | 'All';

export type PolCategoriesChartProps = {
  /** Chart data points */
  data: MultiLineChartDataPoint[];
  /** Line configurations */
  lines: MultiLineChartLine[];
  /** Chart title. Default: "PoL Categories Dynamic" */
  title?: string;
  /** Show time range selector. Default: true */
  showTimeRange?: boolean;
  /** Initial time range. Default: '1Y' */
  initialTimeRange?: PolCategoriesTimeRange;
};

