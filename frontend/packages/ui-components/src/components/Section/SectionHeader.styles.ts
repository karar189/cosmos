/**
 * SectionHeader Component Styles
 * Uses the standardized style system for consistent, maintainable styling
 */

import { css } from '@emotion/react';
import { coloring, flex, size, spacing, typography } from '../../theme/styleSystem';

/**
 * Section header container
 */
export const sectionHeader = css`
  ${flex.row}
  ${flex.align.center}
  ${spacing.gap.s}
  ${size.width.full}
`;

/**
 * Top row of section header (icon + title)
 */
export const sectionHeaderTop = css`
  ${flex.row}
  ${flex.align.center}
  ${flex.justify.start}
  ${spacing.gap.m}
`;

/**
 * Icon container in section header
 */
export const sectionHeaderIcon = css`
  ${size.width.md}
  ${size.height.md}
`;

/**
 * Section header title
 */
export const sectionHeaderTitle = css`
  ${typography.fontFamily.primary}
  ${typography.fontSize.xl}
  ${typography.fontWeight.medium}
  ${typography.lineHeight.relaxed}
  ${coloring.text.primary}
`;
