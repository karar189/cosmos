/** @jsxImportSource @emotion/react */
'use client';

import RiskMetricRow from '../RiskMetricRow/RiskMetricRow';
import * as styles from './RiskMetricList.styles';

export interface RiskMetric {
  /**
   * Label for the metric
   */
  label: string;
  /**
   * Current value (0-100 or custom max), or null/undefined if no data
   */
  value: number | null | undefined;
  /**
   * Maximum value
   * @default 100
   */
  max?: number;
  /**
   * Color of the progress bar
   * @default 'default'
   */
  color?: 'green' | 'yellow' | 'orange' | 'red' | 'default';
}

export interface RiskMetricListProps {
  /**
   * Array of risk metrics to display
   */
  metrics: RiskMetric[];
  /**
   * Additional CSS class name
   */
  className?: string;
}

export default function RiskMetricList({
  metrics,
  className,
}: RiskMetricListProps) {
  return (
    <div css={styles.container} className={className} data-testid="risk-metric-list">
      {metrics.map((metric, index) => (
        <RiskMetricRow
          key={`${metric.label}-${index}`}
          label={metric.label}
          value={metric.value}
          max={metric.max}
          color={metric.color}
        />
      ))}
    </div>
  );
}
