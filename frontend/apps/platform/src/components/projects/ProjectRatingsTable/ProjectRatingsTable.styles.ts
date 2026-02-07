/**
 * ProjectRatingsTable Component Styles
 * Styles for the project ratings table
 */

import {
  borders,
  breakpoints,
  coloring,
  colors,
  cursor,
  display,
  flex,
  opacity,
  overflow,
  position,
  size,
  sizeValues,
  spacing,
  spacingValues,
  transitions,
  typography,
} from '@core3/ui-components/styleSystem';
import { css } from '@emotion/react';

/**
 * Container for the table with scrolling
 */
export const tableContainer = css`
  ${size.width.full}
  ${spacing.margin.bottom.xl}
`;

/**
 * Mobile filters/sorting buttons container
 */
export const mobileFiltersContainer = css`
  ${display.flex}
  ${flex.row}
  ${spacing.gap.s}
  ${spacing.margin.bottom.l}
  
  ${breakpoints.md} {
    ${display.none}
  }
`;

/**
 * Filter/Sort button
 */
export const filterButton = css`
  ${flex.row}
  ${flex.align.center}
  ${spacing.gap.s}
  ${spacing.padding.y.s}
  ${spacing.padding.x.m}
  ${typography.fontSize.base}
  ${typography.fontWeight.medium}
  ${coloring.text.primary}
  background: transparent;
  border: ${spacingValues.hairline} solid ${colors.neutral.gray700};
  ${borders.radius.full}
  ${cursor.pointer}
  ${transitions.all}
  flex: 1;

  &:hover {
    background-color: ${colors.background.hover};
  }

  &:focus-visible {
    outline: ${spacingValues.xxxs} solid ${colors.primary.main};
    outline-offset: ${spacingValues.xxxs};
  }
  
  svg, img {
    width: ${sizeValues.xsm};
    height: ${sizeValues.xsm};
    color: ${colors.neutral.gray600};
  }
  
  & > :last-child {
    margin-left: auto;
  }
`;

/**
 * Filter count badge
 */
export const filterBadge = css`
  ${display.flex}
  ${flex.center}
  ${size.width.custom('22px')}
  ${size.height.custom('22px')}
  ${borders.radius.circle}
  background-color: ${colors.text.primary};
  color: ${colors.neutral.white};
  ${typography.fontSize.xs}
  ${typography.fontWeight.semibold}
`;

/**
 * Bottom sheet actions container
 */
export const bottomSheetActions = css`
  ${display.flex}
  ${flex.row}
  ${spacing.gap.m}
  ${spacing.margin.top.l}
  ${spacing.padding.bottom.m}
`;

/**
 * Cancel button
 */
export const cancelButton = css`
  flex: 1;
  ${display.flex}
  ${flex.center}
  ${spacing.padding.y.s}
  ${spacing.padding.x.l}
  ${typography.fontSize.base}
  ${typography.fontWeight.semibold}
  ${typography.fontFamily.mono}
  ${typography.textTransform.uppercase}
  ${typography.letterSpacing.normal}
  ${coloring.text.primary}
  background: transparent;
  border: ${spacingValues.hairline} solid ${colors.neutral.gray700};
  ${borders.radius.full}
  ${cursor.pointer}
  ${transitions.all}

  &:hover {
    background-color: ${colors.background.hover};
  }

  &:focus-visible {
    outline: ${spacingValues.xxxs} solid ${colors.primary.main};
    outline-offset: ${spacingValues.xxxs};
  }
`;

/**
 * Apply button
 */
export const applyButton = css`
  flex: 1.4;
  ${flex.center}
  ${spacing.padding.xxs}
  background: transparent;
  border: ${spacingValues.hairline} solid ${colors.text.primary};
  ${borders.radius.full}
  ${cursor.pointer}
  ${transitions.all}

  &:focus-visible {
    outline: ${spacingValues.xxxs} solid ${colors.primary.main};
    outline-offset: ${spacingValues.xxxs};
  }
  
  & > span {
    ${display.flex}
    ${flex.center}
    ${size.width.full}
    ${spacing.padding.y.s}
    ${spacing.padding.x.l}
    ${typography.fontSize.base}
    ${typography.fontWeight.semibold}
    ${typography.fontFamily.mono}
    ${typography.textTransform.uppercase}
    ${typography.letterSpacing.widest}
    color: ${colors.neutral.white};
    background-color: ${colors.text.primary};
    ${borders.radius.full}
    ${transitions.all}
  }
  
  &:hover > span {
    opacity: 0.9;
  }
`;

/**
 * Clickable project cell
 */
export const clickableProject = css`
  ${flex.row}
  ${spacing.gap.s}
  ${cursor.pointer}
  ${transitions.opacity}
  ${flex.align.center}

  &:hover {
    ${opacity.higher}
  }

  &:focus-visible {
    outline: ${spacingValues.xxxs} solid ${colors.primary.main};
    outline-offset: ${spacingValues.xxxs};
    ${borders.radius.base}
  }
`;

/**
 * Project logo
 */
export const projectLogo = css`
  ${position.relative}
  ${overflow.hidden}
  ${size.width.md}
  ${size.height.md}
  ${borders.radius.full}
  ${coloring.background.primary}
`;

/**
 * Project info
 */
export const projectInfo = css`
  ${flex.column}
  ${spacing.gap.xxxs}
`;

/**
 * Project name text
 */
export const projectName = css`
  ${typography.fontSize.base}
  ${typography.fontWeight.semibold}
  ${coloring.text.primary}
`;

/**
 * Project chain text (secondary)
 */
export const projectChain = css`
  ${typography.fontSize.sm}
  ${coloring.text.secondary}
`;

/**
 * Mobile card list container
 */
export const mobileCardList = css`
  ${display.flex}
  ${flex.column}
  ${spacing.gap.l}
  
  ${breakpoints.md} {
    ${display.none}
  }
`;

/**
 * Hide desktop table on mobile
 */
export const desktopTableWrapper = css`
  ${display.none}
  
  ${breakpoints.md} {
    ${display.block}
  }
`;
