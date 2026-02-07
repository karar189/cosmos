/** @jsxImportSource @emotion/react */
'use client';

import Skeleton from '@mui/material/Skeleton';
import * as styles from './NumberCell.styles';

export type NumberFormat = 'money' | 'percentage' | 'number' | 'compact' | 'change';

export interface NumberCellProps {
  /** Single value mode: the value to display */
  value?: string | number;
  
  /** Single value mode: format type */
  format?: NumberFormat;
  
  /** Dual value mode: primary value (usually percentage or main metric) */
  primary?: string | number;
  
  /** Dual value mode: secondary value (usually absolute number) */
  secondary?: string | number;
  
  /** Dual value mode: format for primary value */
  primaryFormat?: NumberFormat;
  
  /** Dual value mode: format for secondary value */
  secondaryFormat?: NumberFormat;
  
  /** Optional: Text alignment */
  align?: 'left' | 'center' | 'right';
  
  /** Optional: Show skeleton loading state */
  loading?: boolean;
}

/**
 * NumberCell - Reusable cell component for displaying numeric data
 * 
 * Supports both single and dual value modes with various format options.
 * 
 * @example
 * ```tsx
 * // Single value
 * <NumberCell value="$1.2M" format="money" />
 * 
 * // Dual values (change with percentage and value)
 * <NumberCell 
 *   primary="+12.5%" 
 *   secondary="$1.2M"
 *   primaryFormat="percentage"
 *   secondaryFormat="money"
 * />
 * ```
 */
export function NumberCell({
  value,
  format = 'number',
  primary,
  secondary,
  primaryFormat = 'percentage',
  secondaryFormat = 'money',
  align = 'right',
  loading = false,
}: NumberCellProps) {
  // Show skeleton when loading
  if (loading) {
    return (
      <div css={[styles.container, styles.alignStyles[align]]}>
        <Skeleton width={60} height={20} />
      </div>
    );
  }
  
  // Determine if in dual value mode
  const isDualMode = primary !== undefined;
  
  // Format a value based on its format type
  const formatValue = (val: string | number, fmt: NumberFormat): string => {
    if (typeof val === 'string') return val;
    
    switch (fmt) {
      case 'money':
        return new Intl.NumberFormat('en-US', {
          style: 'currency',
          currency: 'USD',
          minimumFractionDigits: 0,
          maximumFractionDigits: 2,
        }).format(val);
        
      case 'percentage':
        return `${val > 0 ? '+' : ''}${val}%`;
        
      case 'compact':
        return new Intl.NumberFormat('en-US', {
          notation: 'compact',
          compactDisplay: 'short',
        }).format(val);
        
      case 'change':
        return `${val > 0 ? '+' : ''}${val}`;
        
      case 'number':
      default:
        return new Intl.NumberFormat('en-US').format(val);
    }
  };
  
  // Single value mode
  if (!isDualMode && value !== undefined) {
    const formattedValue = typeof value === 'string' ? value : formatValue(value, format);
    
    return (
      <div css={[styles.container, styles.alignStyles[align]]}>
        <div css={styles.singleValue}>
          {formattedValue}
        </div>
      </div>
    );
  }
  
  // Dual value mode
  if (isDualMode) {
    const formattedPrimary = typeof primary === 'string' ? primary : formatValue(primary, primaryFormat);
    const formattedSecondary = secondary 
      ? (typeof secondary === 'string' ? secondary : formatValue(secondary, secondaryFormat))
      : undefined;
    
    return (
      <div css={[styles.container, styles.alignStyles[align]]}>
        <div css={styles.primaryValue}>
          {formattedPrimary}
        </div>
        {formattedSecondary && (
          <div css={styles.secondaryValue}>
            {formattedSecondary}
          </div>
        )}
      </div>
    );
  }
  
  return null;
}

