/** @jsxImportSource @emotion/react */
'use client';

import StarIcon from '../Icon/icons/StarIcon';
import * as styles from './Stars.styles';

export interface StarsProps {
  /**
   * Maximum number of stars to display
   * @default 3
   */
  max?: number;
  /**
   * Number of filled stars (1, 2, 3, etc.)
   */
  value: number;
}

export default function Stars({ max = 3, value }: StarsProps) {
  const filledCount = Math.max(0, Math.min(value, max));
  const stars = Array.from({ length: max }, (_, index) => {
    const isFilled = index < filledCount;
    return <StarIcon key={index} css={styles.getStarStyles(isFilled)} />;
  });

  return <div css={styles.container} className='stars-container'>{stars}</div>;
}
