/**
 * ProgressCell Component Styles
 * Styles for progress bar display in table cells
 */

import { css } from '@emotion/react';
import {
  borders,
  colors,
  flex,
  overflow,
  size,
  spacing,
  spacingValues,
  typography,
} from '../../../styleSystem';

/**
 * Container for the cell content
 */
export const container = css`
  ${flex.centerCross}
  ${spacing.gap.s}
`;

/**
 * Progress bar background
 */
export const bar = css`
  ${flex.item.grow}
  height: ${spacingValues.s};
  background: ${colors.neutral.gray300};
  ${borders.radius.sm}
  ${overflow.hidden}
`;

/**
 * Progress fill
 */
export const progress = css`
  ${size.height.full}
  ${borders.radius.sm}
`;

/**
 * Percentage text
 */
export const text = css`
  ${typography.fontFamily.mono}
  ${typography.fontSize.sm}
  ${typography.fontWeight.medium}
`;

/**
 * Color variants
 */
export const colorGreen = css`
  background-color: ${colors.status.green};
`;

export const colorAccentOrange = css`
  background-color: ${colors.accent.orange};
`;

export const colorOrange = css`
  background-color: ${colors.status.orange};
`;

export const colorRed = css`
  background-color: ${colors.status.red};
`;

