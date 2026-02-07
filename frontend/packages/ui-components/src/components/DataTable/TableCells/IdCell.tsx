/** @jsxImportSource @emotion/react */
'use client';

import Skeleton from '@mui/material/Skeleton';
import * as styles from './IdCell.styles';

export interface IdCellProps {
  /** Value to display */
  value: number | string;
  
  /** Optional: Show skeleton loading state */
  loading?: boolean;
}

/**
 * IdCell - Cell component for displaying ID/number values
 * 
 * Typically used for row numbers or identifiers.
 * 
 * @example
 * ```tsx
 * <IdCell value={1} />
 * <IdCell value="001" />
 * ```
 */
export function IdCell({ value, loading = false }: IdCellProps) {
  if (loading) {
    return <Skeleton width={30} height={20} />;
  }
  
  return <div css={styles.container}>{value}</div>;
}

