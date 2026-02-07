/**
 * Review Component Styles
 * Uses the standardized style system for consistent, maintainable styling
 */

import { css } from '@emotion/react';
import {
  coloring,
  cursor,
  flex,
  size,
  spacing,
  typography,
  transitions,
} from '../../theme/styleSystem';

/**
 * Base review container
 */
export const reviewContainer = css`
  ${flex.column}
  ${spacing.gap.sm}
  ${size.width.full}
`;

/**
 * Review header with author and date
 */
export const reviewHeader = css`
  ${flex.row}
  ${flex.align.center}
  ${spacing.gap.s}
`;

/**
 * Date styling
 */
export const reviewDate = css`
  ${typography.fontSize.xs}
  ${typography.fontWeight.medium}
  ${coloring.text.secondary}
`;

/**
 * Review content text
 */
export const reviewContent = css`
  ${typography.fontFamily.primary}
  ${typography.fontSize.sm}
  ${typography.fontWeight.normal}
  ${typography.lineHeight.relaxed}
  ${coloring.text.primary}
`;

/**
 * Truncated review content with ellipsis
 */
export const reviewContentTruncated = (maxLines: number) => css`
  display: -webkit-box;
  -webkit-line-clamp: ${maxLines};
  -webkit-box-orient: vertical;
  overflow: hidden;
`;

/**
 * Base styles for review action (shared between link and button)
 */
const reviewActionBase = css`
  ${typography.fontFamily.mono}
  ${typography.fontSize.sm}
  ${typography.fontWeight.medium}
  ${typography.lineHeight.tight}
  ${typography.letterSpacing.normal}
  ${typography.textTransform.uppercase}
  ${coloring.text.primary}
  ${typography.textDecoration.none}
  ${cursor.pointer}
  ${transitions.colors}

  &:hover {
    ${coloring.text.secondary}
  }
`;

/**
 * Read full review link
 */
export const reviewLink = css`
  ${reviewActionBase}
`;

/**
 * Expand/collapse button (styled like a link)
 */
export const reviewExpandButton = css`
  ${reviewActionBase}
  background: none;
  border: none;
  padding: 0;
  text-align: left;
`;
