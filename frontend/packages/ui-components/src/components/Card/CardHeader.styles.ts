/**
 * CardHeader Component Styles
 * Uses the standardized style system for consistent, maintainable styling
 */

import { css } from '@emotion/react';
import {
  coloring,
  flex,
  size,
  spacing,
  typography,
} from '../../theme/styleSystem';

/**
 * Card header container
 */
export const cardHeader = css`
  ${flex.row}
  ${flex.align.center}
  ${spacing.gap.s}
  ${size.width.full}
  position: relative;
`;

/**
 * Icon container in card header
 */
export const cardHeaderIcon = css`
  ${coloring.text.primary}
  ${size.width.xsm}
  ${size.height.xsm}
`;

/**
 * Card header title
 */
export const cardHeaderTitle = (titleType: 'primary' | 'secondary') => css`
  ${typography.fontFamily.primary}
  ${titleType === 'primary' ? typography.fontSize.base : typography.fontSize.sm}
  ${typography.fontWeight.medium}
  ${typography.lineHeight.normal}
  ${titleType === 'primary' ? coloring.text.primary : coloring.text.secondary}
`;

/**
 * Card header right content
 */
export const cardHeaderRightContent = css`
  ${spacing.margin.left.auto}
`;
