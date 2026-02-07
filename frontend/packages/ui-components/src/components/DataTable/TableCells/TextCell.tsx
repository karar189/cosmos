/** @jsxImportSource @emotion/react */
'use client';

import Skeleton from '@mui/material/Skeleton';
import * as styles from './TextCell.styles';

export interface TextCellProps {
  /** Value to display */
  value: string | number;
  
  /** Optional: Text alignment */
  align?: 'left' | 'center' | 'right';
  
  /** Optional: Font weight */
  weight?: 'normal' | 'medium' | 'semibold' | 'bold';
  
  /** Optional: Show skeleton loading state */
  loading?: boolean;
}

/**
 * TextCell - Simple text cell component
 * 
 * Basic text display with alignment and weight options.
 * 
 * @example
 * ```tsx
 * <TextCell value="Category Name" />
 * <TextCell value="DeFi" align="right" weight="medium" />
 * ```
 */
export function TextCell({ 
  value, 
  align = 'left', 
  weight = 'normal',
  loading = false 
}: TextCellProps) {
  if (loading) {
    return <Skeleton width={80} height={20} />;
  }
  
  return (
    <div css={[
      styles.container,
      styles.alignStyles[align],
      styles.weightStyles[weight],
    ]}>
      {value}
    </div>
  );
}

