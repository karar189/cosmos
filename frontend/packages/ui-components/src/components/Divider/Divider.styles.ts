/**
 * Divider Component Styles
 * Uses the standardized style system for consistent, maintainable styling
 */

import { css } from '@emotion/react';
import { coloring, size, spacing } from '../../theme/styleSystem';

/**
 * Base divider styles
 */
export const divider = css`
  ${coloring.background.neutral.gray300}
`;

/**
 * Horizontal divider styles
 * Full width with vertical margins
 */
export const dividerHorizontal = css`
  ${size.width.full}
  ${size.height.xs}
  ${size.height.custom('1px')}
  ${spacing.margin.y.sm}
`;

/**
 * Vertical divider styles
 * Full height with horizontal margins
 */
export const dividerVertical = css`
  ${size.width.custom('1px')}
  ${size.height.full}
  ${spacing.margin.x.m}
`;

/**
 * Remove vertical margins for horizontal divider
 */
export const dividerNoVerticalMargin = css`
  ${spacing.margin.y.zero}
`;

/**
 * Remove horizontal margins for vertical divider
 */
export const dividerNoHorizontalMargin = css`
  ${spacing.margin.x.zero}
`;
