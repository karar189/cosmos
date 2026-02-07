/** @jsxImportSource @emotion/react */
'use client';

import Skeleton from '@mui/material/Skeleton';
import { BadgeColor } from '../../Badge';
import BadgeScore from '../../Badge/BadgeScore';

function getBadgeColorByScore(score: number): BadgeColor {
  if (score >= 0 && score <= 25) return 'green';
  if (score >= 26 && score <= 50) return 'yellow';
  if (score >= 51 && score <= 75) return 'orange';
  if (score >= 76 && score <= 100) return 'red';
  return 'gray';
}

export interface BadgeCellProps {
  /** Value object containing score and grade */
  value: {
    score: number;
    grade: string;
  };

  /** Optional: Show skeleton loading state */
  loading?: boolean;
}

/**
 * BadgeCell - Cell component for displaying a score with a grade badge
 *
 * @example
 * ```tsx
 * <BadgeCell value={{ score: 35, grade: 'AAA' }} />
 * ```
 */
export function BadgeCell({ value, loading = false }: BadgeCellProps) {
  if (loading) {
    return <Skeleton width={80} height={24} />;
  }

  const color = getBadgeColorByScore(value.score);

  return <BadgeScore value={value.score} subValue={value.grade} color={color} size="small" />;
}
