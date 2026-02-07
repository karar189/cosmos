/**
 * SectionContainer Component Styles
 * Uses the standardized style system for consistent, maintainable styling
 */

import { css } from '@emotion/react';
import { flex, spacing, size, borders, coloring } from '../../theme/styleSystem';

/**
 * Main section container
 */
export const sectionContainer = css`
  ${flex.column}
  ${spacing.gap.m}
  ${size.width.full}
  ${spacing.padding.m}
  ${borders.radius['2xl']}
  ${coloring.background.section}
`;
