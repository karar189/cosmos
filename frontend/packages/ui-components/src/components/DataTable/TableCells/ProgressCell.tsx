/** @jsxImportSource @emotion/react */
'use client';

import Skeleton from '@mui/material/Skeleton';
import * as styles from './ProgressCell.styles';

export interface ProgressCellProps {
  /** Value as a string with percentage (e.g., "75%") or as a number (0-100) */
  value: string | number;
  
  /** Optional: Show skeleton loading state */
  loading?: boolean;
}

/**
 * ProgressCell - Cell component for displaying a progress bar with percentage
 * 
 * Color is determined automatically based on value thresholds.
 * 
 * @example
 * ```tsx
 * <ProgressCell value="75%" />
 * <ProgressCell value={75} />
 * ```
 */
export function ProgressCell({ value, loading = false }: ProgressCellProps) {
  // Show skeleton when loading
  if (loading) {
    return (
      <div css={styles.container}>
        <Skeleton width="100%" height={16} />
        <Skeleton width={40} height={20} />
      </div>
    );
  }
  
  // Parse the numeric value
  const numericValue = typeof value === 'string' ? parseInt(value) : value;
  
  // Determine color based on coverage percentage
  const getColor = () => {
    if (numericValue >= 90) return styles.colorGreen;
    if (numericValue >= 50) return styles.colorAccentOrange;
    if (numericValue >= 30) return styles.colorOrange;
    return styles.colorRed;
  };
  
  const displayValue = typeof value === 'string' ? value : `${value}%`;
  
  return (
    <div css={styles.container}>
      <div css={styles.bar}>
        <div
          css={[styles.progress, getColor()]}
          style={{ width: displayValue }}
        />
      </div>
      <div css={styles.text}>{displayValue}</div>
    </div>
  );
}

