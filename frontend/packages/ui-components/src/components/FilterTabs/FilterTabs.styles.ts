/**
 * FilterTabs Component Styles
 * Tab-style filter buttons that match the FilterMultiSelect styling
 */

import { css } from '@emotion/react';
import {
  borders,
  colors,
  cursor,
  flex,
  spacing,
  transitions,
  typography,
} from '../../theme/styleSystem';

/**
 * Tabs container
 */
export const tabsContainer = css`
  ${flex.row}
  ${flex.wrap}
  ${spacing.gap.sm}
`;

/**
 * Individual tab button - base styles
 */
export const tabButton = (isActive: boolean) => css`
  ${typography.fontSize.sm}
  ${typography.fontWeight.semibold}
  color: ${colors.neutral.black};
  background-color: ${isActive ? colors.neutral.black : 'transparent'};
  ${isActive && `color: ${colors.neutral.white};`}
  border: 1px solid ${colors.neutral.black};
  ${spacing.padding.x.m}
  ${spacing.padding.y.xs}
  ${cursor.pointer}
  ${transitions.colors}
  white-space: nowrap;
  ${borders.radius['3xl']}

  &:hover {
    background-color: ${isActive ? colors.neutral.black : colors.star.unfilled};
  }

  &:focus-visible {
    outline: 2px solid ${colors.neutral.black};
    outline-offset: 2px;
    position: relative;
    z-index: 1;
  }
`;


