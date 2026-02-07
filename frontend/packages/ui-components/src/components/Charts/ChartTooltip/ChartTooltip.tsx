/** @jsxImportSource @emotion/react */
'use client';

import React from 'react';
import { Box } from '@mui/material';
import { Badge } from '../../Badge';
import { formatMonthToDate } from '../../../utils/formatting';
import * as styles from './ChartTooltip.styles';

export type ChartTooltipItem = {
  /** Label/name for this item */
  label: string;
  /** Value to display */
  value: string | number;
  /** Color for the dot and badge */
  color: string;
};

export type ChartTooltipProps = {
  /** Date/label to display at the top */
  date?: string;
  /** Array of items to display in the tooltip */
  items: ChartTooltipItem[];
  /** Custom formatter for date label */
  dateFormatter?: (date: string) => string;
};

/**
 * ChartTooltip component for displaying chart tooltips with Badge components
 * Used in MultiLineChart and other chart components
 */
export default function ChartTooltip({
  date,
  items,
  dateFormatter,
}: ChartTooltipProps) {
  const formatDate = (dateLabel: string | undefined): string => {
    if (!dateLabel) return '';
    if (dateFormatter) return dateFormatter(dateLabel);
    
    // Use formatting utility for month abbreviations, otherwise return as-is
    return formatMonthToDate(dateLabel);
  };

  return (
    <Box css={styles.tooltip}>
      {date && <Box css={styles.tooltipDate}>{formatDate(date)}</Box>}
      <Box css={styles.tooltipList}>
        {items.map((item, index) => (
          <Box key={index} css={styles.tooltipItem}>
            <Box
              css={styles.tooltipDot}
              style={{ backgroundColor: item.color }}
            />
            <Box css={styles.tooltipLabel}>{item.label}</Box>
            <Box
              css={styles.tooltipBadgeWrapper}
              style={{
                '--badge-bg': `${item.color}20`,
                '--badge-color': item.color,
              } as React.CSSProperties}
            >
              <Badge
                color="default"
                size="small"
              >
                {item.value}
              </Badge>
            </Box>
          </Box>
        ))}
      </Box>
    </Box>
  );
}

