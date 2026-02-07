/**
 * Tooltip Component Styles
 * Uses the standardized style system for consistent, maintainable styling
 */

import { css } from '@emotion/react';
import { flex, spacing, typography } from '../../theme/styleSystem';

/**
 * Tooltip content container with gap
 */
export const tooltipContent = css`
  ${flex.column}
  ${spacing.gap.xxs}
`;

/**
 * Tooltip title styles
 */
export const tooltipTitle = css`
  ${typography.fontWeight.medium}
  ${typography.fontSize.sm}
`;