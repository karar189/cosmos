/**
 * TooltipIcon Component Styles
 * Uses the standardized style system for consistent, maintainable styling
 */

import { css } from '@emotion/react';
import { coloring, display, size, transitions } from '../../theme/styleSystem';

/**
 * Tooltip icon container
 */
export const tooltipIcon = css`
  ${display.block}
  ${coloring.text.secondary}
  ${transitions.colors}
  ${size.width.sm}
  ${size.height.sm}
  cursor: help;
  &:hover {
    ${coloring.text.primary}
  }
`;

/**
 * Tooltip icon container
 */
export const tooltipIconContainer = css`
  ${display.block}
  ${size.width.sm}
  ${size.height.sm}
`;
