/** @jsxImportSource @emotion/react */
'use client';

import * as styles from './ProgressBar.styles';

export type ProgressBarColor = 'green' | 'yellow' | 'orange' | 'red' | 'default';

export interface ProgressBarProps {
  /**
   * Current value (0-100)
   */
  value: number;
  /**
   * Maximum value
   * @default 100
   */
  max?: number;
  /**
   * Color of the progress bar
   * @default 'default'
   */
  color?: ProgressBarColor;
  /**
   * Size of the progress bar
   * @default 'medium'
   */
  size?: 'small' | 'medium' | 'large';

  /**
   * Label style to display
   * @default 'fraction'
   */
  labelStyle?: 'fraction' | 'percentage';
  /**
   * Additional CSS class name
   */
  className?: string;
  /**
   * Show label with value/max
   * @default false
   */
  showLabel?: boolean;
}

export default function ProgressBar({
  value,
  max = 100,
  color = 'default',
  size = 'medium',
  labelStyle = 'fraction',
  className,
  showLabel = false,
}: ProgressBarProps) {
  const percentage = Math.min(Math.max((value / max) * 100, 0), 100);

  return (
    <div css={styles.container} className={className}>
      <div css={[styles.track, styles.sizes[size]]}>
        <div
          css={[styles.fill, styles.colors[color], styles.sizes[size]]}
          style={{ width: `${percentage}%` }}
          role="progressbar"
          aria-valuenow={value}
          aria-valuemin={0}
          aria-valuemax={max}
        />
      </div>
      {showLabel && (
        labelStyle === 'fraction' ? (
          <span css={styles.label}>
            {value}
            <span css={styles.labelMax}>/{max}</span>
          </span>
        ) : labelStyle === 'percentage' ? (
          <span css={styles.label}>
            {Math.round(percentage)}%
          </span>
        ) : null
      )}
    </div>
  );
}
