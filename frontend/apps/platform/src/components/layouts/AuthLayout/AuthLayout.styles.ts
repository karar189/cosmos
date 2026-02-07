/**
 * Auth Page Styles
 * Uses the standardized style system for consistent, maintainable styling
 */

import { css } from '@emotion/react';
import {
  flex,
  spacing,
  typography,
  colors,
  size,
  position,
  breakpoints,
  transform,
  gradients,
  pointerEvents,
  display,
  overflow,
} from '@core3/ui-components/styleSystem';

export const container = css`
  ${position.relative}
  ${size.width.screen}
  ${size.height.screen}
  ${size.minHeight.screen}
  background-color: ${colors.background.paper};
  ${overflow.hidden}
  -ms-overflow-style: none;
  scrollbar-width: none;
  &::-webkit-scrollbar {
    ${display.none}
    ${size.width.zero}
    ${size.height.zero}
  }
  &::-webkit-scrollbar-track {
    ${display.none}
  }
  &::-webkit-scrollbar-thumb {
    ${display.none}
  }
`;

/**
 * Main gradient background container
 * Full viewport height with gradient background
 */
export const gradientBackground = css`
  ${position.absolute}
  ${position.top.zero}
  ${position.left.zero}
  ${position.bottom.zero}
  ${position.right.zero}
  ${size.width.full}
  background: ${gradients.authorizationRadial};
  ${pointerEvents.none}
`;

/**
 * Strings container at bottom
 */
export const stringsContainer = css`
  ${display.none}

  ${breakpoints.md} {
    ${display.block}
    ${position.absolute}
    ${position.bottom.zero}
    ${position.left.zero}
    ${transform.translate.xy('-25%', '50%')}
    ${position.zIndex.base}
    ${pointerEvents.none}
  }
`;

export const strings = css`
  ${size.width['8xl']}
  ${size.minHeight['6xl']}

  ${breakpoints.lg} {
    ${size.minWidth.full}
    ${size.minHeight['6xl']}
  }
`;

/**
 * Main content section
 */
export const contentSection = css`
  ${size.width.full}
  ${size.height.full}
  ${position.relative}
  ${flex.column}
  ${flex.align.center}
  ${position.zIndex.dropdown}
  ${spacing.padding.x.zero}
  ${spacing.padding.y.zero}
  ${overflow.y.auto}

  ${breakpoints.md} {
    ${flex.row}
    ${flex.align.start}
    ${spacing.padding.x.m}
    ${spacing.padding.y.l}
    ${overflow.y.hidden}
  }
`;

/**
 * Left side content
 */
export const leftSide = css`
  ${flex.column}
  ${flex.justify.start}
  ${flex.align.center}
  ${spacing.gap.l}
  ${spacing.padding.top.xl}
  ${spacing.padding.bottom.zero}
  ${spacing.padding.x.zero}
  ${size.width.full}
  ${typography.textAlign.center}

  ${breakpoints.lg} {
    ${flex.align.start}
    ${spacing.gap.xl}
    ${spacing.padding.y.xxl}
    ${spacing.padding.x.xl}
    ${size.width.half}
    ${typography.textAlign.left}
  }

  ${breakpoints.xlg} {
    ${spacing.padding.top.xxxxl}
    ${spacing.padding.x.xxxl}
    ${spacing.gap.xxl}
  }
`;

/**
 * Right side content - area where auth forms/children render
 */
export const rightSide = css`
  ${flex.column}
  ${flex.justify.start}
  ${flex.align.center}
  ${spacing.padding.top.zero}
  ${spacing.padding.bottom.l}
  ${spacing.padding.x.zero}
  ${size.width.full}
  ${size.height.auto}
  box-sizing: border-box;
  ${overflow.y.auto}

  ${breakpoints.md} {
    ${flex.justify.center}
    ${flex.align.start}
    ${spacing.padding.y.xl}
    ${spacing.padding.x.xl}
    ${spacing.padding.bottom.xl}
    ${spacing.padding.left.xl}
    ${overflow.y.auto}
  }

  ${breakpoints.lg} {
    ${size.width.half}
    ${size.height.full}
  }
`;

/**
 * Logo wrapper
 */
export const logoWrapper = css`
  ${display.flex}
  ${flex.column}
  ${flex.align.center}
  ${spacing.gap.m}

  ${breakpoints.lg} {
    ${flex.align.start}
  }
`;

/**
 * Main content area on left
 */
export const mainContent = css`
  ${display.none}

  ${breakpoints.lg} {
    ${display.flex}
    ${flex.column}
    ${flex.align.start}
    ${spacing.gap.l}
    ${spacing.margin.top.l}
  }

  ${breakpoints.xxxl} {
    ${size.maxWidth.full}
  }
`;

/**
 * Main heading - MEASURE RISK. BUILD TRUST.
 */
export const mainHeading = css`
  ${typography.fontFamily.primary}
  ${typography.fontWeight.semibold}
  ${typography.lineHeight.tighter}
  ${typography.letterSpacing.normal}
  ${typography.fontSize['3xl']}
  color: ${colors.text.primary};
  ${typography.textAlign.center}

  ${breakpoints.sm} {
    ${typography.fontSize['4xl']}
  }

  ${breakpoints.md} {
    ${typography.fontSize['5xl']}
    ${typography.textAlign.left}
  }

  ${breakpoints.lg} {
    ${typography.fontSize['7xl']}
  }
`;

/**
 * Subheading text
 */
export const description = css`
  ${typography.fontFamily.primary}
  ${typography.fontWeight.normal}
  ${typography.fontSize.xs}
  ${typography.lineHeight.relaxed}
  color: ${colors.text.primary};
  ${typography.textAlign.center}

  ${breakpoints.md} {
    ${typography.fontSize.sm}
    ${typography.textAlign.left}
  }
`;

/**
 * Subheading text
 */
export const subheading = css`
  ${typography.fontFamily.primary}
  ${typography.fontWeight.medium}
  ${typography.lineHeight.tighter}
  ${typography.letterSpacing.normal}
  ${typography.fontSize['3xl']}
  color: ${colors.text.primary};
  ${spacing.margin.zero}
  ${typography.textAlign.center}

  ${breakpoints.sm} {
    ${typography.fontSize['4xl']}
  }

  ${breakpoints.md} {
    ${typography.fontSize['5xl']}
    ${typography.textAlign.left}
  }

  ${breakpoints.lg} {
    ${typography.fontSize['7xl']}
  }
`;

export const contentContainer = css`
  ${flex.column}
  ${flex.justify.start}
  ${size.width.full}
  ${size.height.full}
  ${position.relative}
  ${position.zIndex.dropdown}
`;

export const loadingContainer = css`
  ${flex.column}
  ${flex.justify.center}
  ${size.height.screen}
  ${size.width.screen}
  ${position.relative}
  ${position.zIndex.dropdown}
`;
