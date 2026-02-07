import type { GaugeChartProps } from '@core3/ui-components';

export type SocialFraudChartProps = {
  /** Chart title. Default: "Social Fraud" */
  title?: string;
  /** Gauge value (0-100) */
  value: number;
  /** Label to display below the gauge */
  label: string;
  /** Status text to display below the label */
  status: string;
  /** Size of the gauge chart. Default: 250 */
  size?: number;
  /** Custom color stops for the gauge gradient */
  colorStops?: GaugeChartProps['colorStops'];
  /** Color of the indicator */
  indicatorColor?: string;
};

