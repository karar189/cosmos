/** @jsxImportSource @emotion/react */
'use client';

import * as styles from './BadgeScore.styles';
import { Interpolation, Theme } from '@emotion/react';

export type BadgeColor = 'red' | 'orange' | 'yellow' | 'green' | 'gray';
export type BadgeSize = 'small' | 'medium';

export interface BadgeScoreProps {
  mono?: boolean;
  value?: string | number;
  subValue?: string | number;
  color: BadgeColor;
  size?: BadgeSize;
  css?: Interpolation<Theme>;
}

export default function BadgeScore({
  value,
  subValue,
  color,
  size = 'medium',
  mono = true,
  ...props
}: BadgeScoreProps) {
  const hasSubValue = !!subValue;

  return (
    <div css={styles.getBadgeContainerStyles} {...props}>
      {value && (
        <span css={styles.getValueContainerStyles({ hasSubValue, color, size, mono })}>
          {value}
        </span>
      )}
      {subValue && <span css={styles.getSubValueContainerStyles({ color, size })}>{subValue}</span>}
    </div>
  );
}
