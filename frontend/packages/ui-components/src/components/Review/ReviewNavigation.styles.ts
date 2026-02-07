/**
 * ReviewNavigation Component Styles
 * Uses the standardized style system for consistent, maintainable styling
 */

import { css } from '@emotion/react';
import {
  borders,
  coloring,
  cursor,
  flex,
  opacity,
  size,
  spacing,
  transform,
  transitions,
} from '../../theme/styleSystem';

/**
 * Navigation container
 */
export const navigationContainer = css`
  ${flex.row}
  ${flex.align.center}
  ${spacing.gap.s}
`;

/**
 * Navigation button base styles
 */
export const navigationButton = css`
  ${flex.center}
  ${size.width.lg}
  ${size.height.lg}
  ${coloring.background.transparent}

  ${borders.none}
  ${cursor.pointer}
  ${transitions.all}
  ${coloring.badge.gray.text}

  &:hover:not(:disabled) {
    ${coloring.background.secondary}
    ${coloring.text.primary}
  }

  &:disabled {
    ${opacity.half}
    ${cursor.notAllowed}
    ${coloring.text.secondary}
  }
  &:focus {
    ${transform.scale(0.95)}
  }
`;

/**
 * Navigation button icon
 */
export const navigationIcon = css`
  ${size.width.sm}
  ${size.height.sm}
`;
