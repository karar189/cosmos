/**
 * WorkspaceSidebar Component Styles
 * Uses the standardized style system for consistent, maintainable styling
 */

import { css } from '@emotion/react';
import {
  flex,
  spacing,
  size,
  coloring,
  borders,
  typography,
  colors,
} from '@core3/ui-components/styleSystem';

/**
 * Sidebar container
 */
export const sidebar = css`
  ${flex.column}
  ${size.width.custom('280px')}
  ${size.height.full}
  ${spacing.padding.top.l}
  ${spacing.padding.bottom.xxxxl}
  ${spacing.padding.left.s}
  ${spacing.padding.right.s}
  ${coloring.background.project}
  border-right: 1px solid ${colors.neutral.gray300};
  overflow-y: auto;
`;

/**
 * Main navigation section
 */
export const sidebarMainSection = css`
  ${flex.column}
  ${spacing.gap.xs}
  ${flex.item.grow}
`;

/**
 * Utility section (bottom)
 */
export const sidebarUtilitySection = css`
  ${flex.column}
  ${spacing.gap.m}
`;

/**
 * Sidebar item wrapper
 */
export const sidebarItemWrapper = css`
  ${flex.row}
  ${flex.align.center}
  ${spacing.padding.top.s}
  ${spacing.padding.bottom.s}
  ${spacing.padding.left.m}
  ${spacing.padding.right.m}
  ${borders.radius.full}
  ${spacing.gap.m}
  text-decoration: none;
  cursor: pointer;
  transition: background-color 0.2s ease;

  &:hover {
    background-color: ${colors.neutral.gray100};
  }
`;

/**
 * Active sidebar item
 */
export const sidebarItemActive = css`
  background-color: ${colors.neutral.gray100};
`;

/**
 * Sidebar item container
 */
export const sidebarItem = css`
  ${flex.row}
  ${flex.align.center}
  ${spacing.gap.m}
  ${size.width.full}
`;

/**
 * Sidebar item icon (main nav - gray)
 */
export const sidebarItemIcon = css`
  ${size.width.custom('24px')}
  ${size.height.custom('24px')}
  ${flex.item.shrink0}
  ${coloring.text.secondary}
`;

/**
 * Sidebar item icon (utility - black)
 */
export const sidebarItemIconUtility = css`
  ${size.width.custom('24px')}
  ${size.height.custom('24px')}
  ${flex.item.shrink0}
  ${coloring.text.primary}
`;

/**
 * Sidebar item text (main nav - gray)
 */
export const sidebarItemText = css`
  ${typography.fontFamily.primary}
  ${typography.fontSize.base}
  ${typography.fontWeight.medium}
  ${typography.lineHeight.normal}
  ${typography.letterSpacing.normal}
  ${coloring.text.variants.secondary.op50}
  ${flex.item.grow}
`;

/**
 * Sidebar item text (utility - black)
 */
export const sidebarItemTextUtility = css`
  ${typography.fontFamily.primary}
  ${typography.fontSize.base}
  ${typography.fontWeight.medium}
  ${typography.lineHeight.normal}
  ${typography.letterSpacing.normal}
  ${coloring.text.primary}
  ${flex.item.grow}
`;

