/** @jsxImportSource @emotion/react */
'use client';

import * as styles from './PercentageBar.styles';

export interface PercentageBarProps {
  /** First (left/green) percentage value */
  firstValue: number;
  /** Label for the first percentage */
  firstLabel: string;
  /** Second (right/red) percentage value */
  secondValue: number;
  /** Label for the second percentage */
  secondLabel: string;
}

/**
 * PercentageBar component
 * Displays a horizontal bar split between two values (green/red)
 * with labels showing the percentage and description for each segment
 */
export default function PercentageBar({
  firstValue,
  firstLabel,
  secondValue,
  secondLabel,
}: PercentageBarProps) {
  return (
    <div css={styles.container}>
      <div>
        <div css={styles.labels}>
          <div css={styles.labelItem}>
            <span css={styles.labelDot(true)} />
            <span>{firstLabel}</span>
          </div>
          <div css={styles.labelItem}>
            <span css={styles.labelDot(false)} />
            <span>{secondLabel}</span>
          </div>
        </div>
        
        <div css={styles.values}>
          <div>
            <span>{firstValue}</span>
            <span css={styles.labelValuePercentage}>({firstValue}%)</span>
          </div>

          <div>
            <span>{secondValue}</span>
            <span css={styles.labelValuePercentage}>({secondValue}%)</span>
          </div>
        </div>
      </div>
      
      <div css={styles.bar}>
        <div css={styles.barSegmentLeft(firstValue)} />
        <div css={styles.barSegmentRight(secondValue)} />
      </div>
    </div>
  );
}

