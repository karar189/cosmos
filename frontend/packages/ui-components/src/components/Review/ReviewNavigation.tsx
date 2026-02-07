/** @jsxImportSource @emotion/react */
'use client';

import { Interpolation, Theme } from '@emotion/react';
import { Icon } from '../Icon';
import * as styles from './ReviewNavigation.styles';

export interface ReviewNavigationProps {
  /** Callback when previous button is clicked */
  onPrev?: () => void;
  /** Callback when next button is clicked */
  onNext?: () => void;
  /** Whether previous button is disabled */
  prevDisabled?: boolean;
  /** Whether next button is disabled */
  nextDisabled?: boolean;
  /** Custom container styles */
  css?: Interpolation<Theme>;
}

/**
 * ReviewNavigation component - Navigation buttons for reviews (prev/next)
 */
export default function ReviewNavigation({
  onPrev,
  onNext,
  prevDisabled = false,
  nextDisabled = false,
  ...props
}: ReviewNavigationProps) {
  return (
    <nav css={styles.navigationContainer} {...props}>
      <button
        type="button"
        css={styles.navigationButton}
        onClick={onPrev}
        disabled={prevDisabled}
        aria-label="Previous review"
      >
        <Icon name="chevron-left" css={styles.navigationIcon} />
      </button>
      <button
        type="button"
        css={styles.navigationButton}
        onClick={onNext}
        disabled={nextDisabled}
        aria-label="Next review"
      >
        <Icon name="chevron-right" css={styles.navigationIcon} />
      </button>
    </nav>
  );
}
