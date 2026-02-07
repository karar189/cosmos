/**
 * ReviewList Component Styles
 * Uses the standardized style system for consistent, maintainable styling
 */

import { css } from '@emotion/react';
import { flex, patterns, size, spacing, spacingValues } from '../../theme/styleSystem';

/**
 * Base review list container
 */
export const reviewList = ({
  horizontal,
  itemsPerRow = 3,
}: {
  horizontal: boolean;
  itemsPerRow: number;
}) => css`
  ${horizontal ? flex.row : flex.column}
  ${flex.wrap.wrap}
  ${spacing.gap.m}
  ${patterns.resetList}
  & > li.review-list-divider {
    ${size.width.auto}
  }
  & > li:not(.review-list-divider) {
    ${size.width.custom(
      `calc(100% / ${itemsPerRow} - ${spacingValues.m} * 2 + ${spacingValues.m} / 2)`
    )}
  }
`;

/**
 * Review list item
 */
export const reviewListItem = css`
  list-style: none;
`;
