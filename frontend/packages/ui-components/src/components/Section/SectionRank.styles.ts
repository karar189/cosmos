/**
 * SectionRank Component Styles
 * Uses the standardized style system for consistent, maintainable styling
 */

import { css } from '@emotion/react';
import { flex, spacing, typography, coloring } from '../../theme/styleSystem';

/**
 * Section rank container
 */
export const sectionRank = css`
  ${flex.row}
  ${flex.align.center}
  ${spacing.gap.s}
`;

/**
 * Section rank description text
 */
export const sectionRankDescription = css`
  ${typography.fontFamily.primary}
  ${typography.fontSize.sm}
  ${typography.fontWeight.medium}
  ${typography.lineHeight.normal}
  ${coloring.text.secondary}
`;
