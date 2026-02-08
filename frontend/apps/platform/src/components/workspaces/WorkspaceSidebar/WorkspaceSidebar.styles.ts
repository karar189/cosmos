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
  ${size.width.custom('200px')}
  ${size.height.full}
  ${spacing.padding.top.m}
  ${spacing.padding.bottom.xxxxl}
  ${spacing.padding.left.xs}
  ${spacing.padding.right.xs}
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

export const sidebarDashboardsSection = css`
  ${flex.column}
  ${spacing.gap.xs}
  ${spacing.padding.top.m}
  ${spacing.margin.top.m}
  border-top: 1px solid ${colors.neutral.gray200};
`;

export const sectionHeaderRow = css`
  ${flex.row}
  ${flex.align.center}
  ${flex.justify.between}
  ${spacing.padding.left.s}
  ${spacing.padding.right.s}
  ${spacing.padding.bottom.xs}
`;

export const sectionTitle = css`
  ${typography.fontFamily.primary}
  ${typography.fontSize.xs}
  ${typography.fontWeight.bold}
  ${coloring.text.variants.secondary.op65}
  letter-spacing: 0.06em;
  text-transform: uppercase;
  margin: 0;
`;

export const viewAllLink = css`
  ${typography.fontFamily.primary}
  ${typography.fontSize.xs}
  ${typography.fontWeight.medium}
  color: ${colors.semantic.primary};
  text-decoration: none;

  &:hover {
    text-decoration: underline;
  }
`;

/**
 * Sidebar item wrapper
 */
export const sidebarItemWrapper = css`
  ${flex.row}
  ${flex.align.center}
  ${spacing.padding.top.xs}
  ${spacing.padding.bottom.xs}
  ${spacing.padding.left.s}
  ${spacing.padding.right.s}
  ${borders.radius.full}
  ${spacing.gap.s}
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
  ${spacing.gap.s}
  ${size.width.full}
`;

/**
 * Sidebar item icon (main nav - gray)
 */
export const sidebarItemIcon = css`
  ${size.width.custom('20px')}
  ${size.height.custom('20px')}
  ${flex.item.shrink0}
  ${coloring.text.secondary}
`;

/**
 * Sidebar item icon (utility - black)
 */
export const sidebarItemIconUtility = css`
  ${size.width.custom('20px')}
  ${size.height.custom('20px')}
  ${flex.item.shrink0}
  ${coloring.text.primary}
`;

/**
 * Sidebar item text (main nav - gray)
 */
export const sidebarItemText = css`
  ${typography.fontFamily.primary}
  ${typography.fontSize.sm}
  ${typography.fontWeight.medium}
  ${typography.lineHeight.normal}
  ${typography.letterSpacing.normal}
  ${coloring.text.variants.secondary.op50}
  ${flex.item.grow}
`;

// My Dashboards items extend base sidebar item styles
export const dashboardItemWrapper = css`
  ${sidebarItemWrapper}
  ${spacing.padding.left.s}
  ${spacing.padding.right.s}
`;

export const dashboardItemText = css`
  ${sidebarItemText}
  ${coloring.text.variants.secondary.op75}
`;

/**
 * Sidebar item text (utility - black)
 */
export const sidebarItemTextUtility = css`
  ${typography.fontFamily.primary}
  ${typography.fontSize.sm}
  ${typography.fontWeight.medium}
  ${typography.lineHeight.normal}
  ${typography.letterSpacing.normal}
  ${coloring.text.primary}
  ${flex.item.grow}
`;

