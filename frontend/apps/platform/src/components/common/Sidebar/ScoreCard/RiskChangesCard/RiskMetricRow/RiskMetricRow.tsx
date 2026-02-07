/** @jsxImportSource @emotion/react */
'use client';

import {ProgressBar, ProgressBarColor } from '@core3/ui-components';
import * as styles from './RiskMetricRow.styles';

type colors = 'green' | 'yellow' | 'orange' | 'red' | 'auto' | 'default';
export interface RiskMetricRowProps {
  /**
   * Label for the metric (e.g., "Security", "Liquidity")
   */
  label: string;
  /**
   * Current value (0-100), or null/undefined if no data
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
  color?: colors;
  /**
   * Additional CSS class name
   */
  className?: string;
}

export default function RiskMetricRow({
  label,
  value,
  max = 100,
  color = 'auto',
  className,
}: RiskMetricRowProps) {
  const hasData = value !== null && value !== undefined && value !== 0;

  const getColor = (): ProgressBarColor => {
    if (!hasData || value === null || value === undefined) return 'default';
    
    if (color !== 'auto') {
      return color;
    }
    const percentage = (value / max) * 100;
    if (percentage < 35) {
      return 'red';
    } else if (percentage < 55) {
      return 'orange';
    } else if (percentage < 85) {
      return 'yellow';
    } else {
      return 'green';
    }
  }
  
  return (
    <div css={styles.container} className={className} data-testid="risk-metric-row">
      <p css={styles.label}>{label}</p>
      <div css={styles.rightSection}>
        {hasData ? (
          <>
            <div css={styles.progressWrapper}>
              <ProgressBar
                value={value!}
                max={max}
                color={getColor()}
                size="small"
                showLabel={false}
              />
            </div>
            <p css={styles.valueLabel}>
              {value!.toFixed(1)}
              <span css={styles.valueLabelMax}>/{max}</span>
            </p>
          </>
        ) : (
          <p css={styles.naText}>N/A</p>
        )}
      </div>
    </div>
  );
}
