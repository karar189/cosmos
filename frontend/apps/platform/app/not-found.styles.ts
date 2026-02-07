/**
 * Not Found Page Styles
 * Uses the standardized style system for consistent, maintainable styling
 */

import { css } from '@emotion/react';
import {
  flex,
  spacing,
  overflow,
  typography,
  colors,
  size,
  position,
  breakpoints,
  pointerEvents,
} from '@core3/ui-components/styleSystem';

export const container = css`
  ${position.relative}
  ${size.height.screen}
  background-color: ${colors.background.paper};
  ${overflow.hidden}
`;

/**
 * Main gradient background container
 * Full viewport height with gradient background
 */
export const gradientBackground = css`
  ${position.absolute}
  transform: translate(-35%, -25%);
  ${position.top.zero}
  ${position.left.zero}
  width: 1000px;
  height: 1000px;
  background-color: rgba(255, 253, 234, 1);
  background: radial-gradient(
    circle,
    rgba(213, 252, 146, 0.6) 0%,
    rgba(255, 249, 183, 0.8) 30%,
    rgba(255, 255, 255, 0) 70%,
    rgba(255, 255, 255, 0) 100%
  );
  ${pointerEvents.none}

  ${breakpoints.md} {
    width: 1500px;
    height: 1500px;
    transform: translate(-35%, -35%);
  }
`;

/**
 * Not found section container
 * Centered layout with full viewport height
 */
export const notFoundSection = css`
  ${size.height.full}
  ${position.relative}
  ${flex.center}
  ${spacing.padding.y.l}
`;

/**
 * Not found container with centered content
 */
export const notFoundContainer = css`
  ${size.width.full}
  ${size.height.full}
  ${flex.center}
  ${spacing.padding.x.m}

  ${breakpoints.sm} {
    ${spacing.padding.x.l}
  }
`;

/**
 * Not found content wrapper
 * Vertical flex layout with centered alignment
 */
export const notFoundContent = css`
  ${flex.column}
  ${flex.align.center}
  ${spacing.gap.xxxl}
  ${typography.textAlign.center}
  ${size.maxWidth.lg}
`;

/**
 * Logo wrapper with bottom margin
 */
export const logoWrapper = css`
  ${spacing.margin.bottom.s}
`;

/**
 * Error code wrapper containing 404 and ERROR label
 */
export const errorCodeWrapper = css`
  ${flex.column}
  ${flex.align.center}
  ${spacing.gap.m}
`;

/**
 * Main 404 error code with responsive font sizing
 */
export const errorCode = css`
  ${typography.fontFamily.primary}
  ${typography.fontWeight.bold}
  ${typography.letterSpacing.normal}
  ${typography.lineHeight.tighter}
  font-size: 8rem;

  ${breakpoints.sm} {
    font-size: 10rem;
  }

  ${breakpoints.md} {
    font-size: 12rem;
  }

  ${breakpoints.lg} {
    font-size: 14rem;
  }
`;

/**
 * ERROR label in monospace font
 */
export const errorLabel = css`
  ${typography.fontFamily.mono}
  ${typography.fontSize.base}
  ${typography.fontWeight.bold}
  ${typography.letterSpacing.wider}
  ${typography.textTransform.uppercase}

  ${breakpoints.md} {
    ${typography.fontSize.lg}
  }
`;

/**
 * Main heading
 */
export const heading = css`
  ${typography.fontFamily.primary}
  ${typography.fontWeight.medium}
  ${typography.fontSize['2xl']}
  ${typography.lineHeight.tight}
  ${typography.letterSpacing.normal}
  ${spacing.margin.bottom.l}

  ${breakpoints.sm} {
    ${typography.fontSize['3xl']}
  }

  ${breakpoints.md} {
    ${typography.fontSize['4xl']}
  }
`;

/**
 * Description text with max-width constraint
 */
export const description = css`
  ${typography.fontSize.sm}
  ${typography.lineHeight.relaxed}
  ${typography.fontWeight.normal}
  color: ${colors.text.secondary};
  ${size.maxWidth.md}

  ${breakpoints.md} {
    ${typography.fontSize.base}
  }
`;
