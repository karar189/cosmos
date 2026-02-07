/**
 * CardContainer Component Styles
 * Uses the standardized style system for consistent, maintainable styling
 */

import { css } from '@emotion/react';
import { flex, spacing, borders, coloring, overflow } from '../../theme/styleSystem';

/**
 * Main card container
 */
export const cardContainer = css`
  ${flex.column}
  ${spacing.gap.m}
  ${spacing.padding.m}
  ${borders.radius['2xl']}
  ${coloring.background.neutral.default}
  ${overflow.hidden}
`;

/**
 * Card container with large padding (24px)
 */
export const cardContainerLargePadding = css`
  ${flex.column}
  ${spacing.gap.m}
  ${spacing.padding.l}
  ${borders.radius['2xl']}
  ${coloring.background.neutral.default}
  ${overflow.hidden}
`;
