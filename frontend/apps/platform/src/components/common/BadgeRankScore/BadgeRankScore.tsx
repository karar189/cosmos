/** @jsxImportSource @emotion/react */
'use client';

import { getBadgeColorByLevel, getBadgeColorByScore, getBadgeColorByPolScore, getBadgeColorBySecurityScore, getColorBySeverity } from '@/utils/badge';
import { BadgeColor, BadgeScore, BadgeSize } from '@core3/ui-components';

import * as styles from './BadgeRankScore.styles';

export interface BadgeScoreProps {
  score?: number;
  level?: string;
  showColor?: boolean;
  size?: BadgeSize;
  severity?: string;
  /** If true, treats score as PoL (Probability of Loss) with inverted color logic */
  isPol?: boolean;
  /** If true, treats score as Security Score (high = good, low = bad) */
  isSecurityScore?: boolean;
}

export default function BadgeRankScore({
  score,
  level,
  showColor = true,
  size = 'small',
  severity,
  isPol = false,
  isSecurityScore = false,
}: BadgeScoreProps) {
  const color: BadgeColor = (() => {
    if (severity) return getColorBySeverity(severity);
    if (!score && level) return getBadgeColorByLevel(level);
    if (score && showColor) {
      // Use appropriate color logic based on score type
      if (isPol) return getBadgeColorByPolScore(score);
      if (isSecurityScore) return getBadgeColorBySecurityScore(score);
      return getBadgeColorByScore(score);
    }
    return 'gray';
  })();

  return (
    <BadgeScore
      css={styles.badgeRankScore}
      value={score}
      subValue={level}
      color={color}
      size={size}
    />
  );
}
