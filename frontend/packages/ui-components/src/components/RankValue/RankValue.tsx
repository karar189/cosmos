/** @jsxImportSource @emotion/react */
'use client';

import { getBadgeColorByScore } from '../../utils';
import * as styles from './RankValue.styles';

export type RankValueColor = 'green' | 'yellow' | 'orange' | 'red' | 'gray';

/**
 * RankValue component - Displays a value out of a maximum (e.g., "45/100")
 */
export interface RankValueProps {
  value: number | string;
  maxValue: number | string;
  /** Color variant based on score quality */
  color?: RankValueColor;
}

export default function RankValue({ value, maxValue, color }: RankValueProps) {
  // Calculate percentage and get color
  const numValue = typeof value === 'string' ? parseFloat(value) : value;
  const numMax = typeof maxValue === 'string' ? parseFloat(maxValue) : maxValue;
  const percentage = isNaN(numValue) || isNaN(numMax) || numMax === 0 
    ? NaN 
    : (numValue / numMax) * 100;
  
  const displayColor = color ?? (isNaN(percentage) ? 'gray' : getBadgeColorByScore(percentage));
  
  return (
    <span css={styles.rankValue(displayColor)}>
      {value}/{maxValue}
    </span>
  );
}
