/**
 * TableFilters Component Styles
 * Styles for table filter controls
 */

import { css } from '@emotion/react';
import {
  background,
  borders,
  breakpoints,
  colors,
  cursor,
  display,
  flex,
  size,
  spacing,
  spacingValues,
  transitions,
  typography,
  whiteSpace,
} from '../../styleSystem';

/**
 * Filters container - main wrapper
 */
export const filtersContainer = css`
  ${display.none}
  
  ${breakpoints.md} {
    ${display.flex}
    ${flex.row}
    ${flex.justify.between}
    ${flex.wrap}
    ${spacing.gap.sm}
    ${spacing.margin.bottom.l}
  }
`;

/**
 * Filters group - for grouping multiple filters together
 */
export const filtersGroup = css`
  ${flex.row}
  ${flex.wrap}
  ${spacing.gap.sm}
  flex: 0 1 auto;
`;

/**
 * Center group - takes up available space and centers content
 */
export const filtersGroupCenter = css`
  ${filtersGroup}
  flex: 1 1 auto;
  ${flex.justify.center}
`;

/**
 * End group - pushes to the right
 */
export const filtersGroupEnd = css`
  ${filtersGroup}
  ${spacing.margin.left.auto}
`;

/**
 * Search input wrapper
 */
export const searchInputWrapper = css`
  ${size.minWidth.custom('250px')}
  flex: 1 1 auto;
  ${size.maxWidth.sm}
`;

/**
 * Clear filters button
 */
export const clearFiltersButton = css`
  ${typography.fontFamily.mono}
  ${typography.fontSize.sm}
  ${typography.fontWeight.bold}
  color: ${colors.neutral.gray500};
  ${background.none}
  ${borders.none}
  ${cursor.pointer}
  ${spacing.padding.x.m}
  ${spacing.padding.y.s}
  ${transitions.colors}
  ${whiteSpace.nowrap}
  ${spacing.padding.zero}

  &:hover {
    color: ${colors.text.primary};
  }
  
  &:focus-visible {
    outline: 2px solid ${colors.neutral.black};
    outline-offset: 2px;
    border-radius: ${spacingValues.xs};
  }
`;

