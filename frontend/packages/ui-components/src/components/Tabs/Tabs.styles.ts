/**
 * Tabs Component Styles
 * Uses the standardized style system for consistent, maintainable styling
 */

import { css } from '@emotion/react';
import { coloring, typography, colors, borders, spacing, breakpoints } from '../../theme/styleSystem';

/**
 * Tabs container
 */
export const tabs = css`
  ${borders.bottom}
  border-color: ${colors.border.default};
  padding-left: 0;
  padding-right: 0;

  .MuiTabs-flexContainer {
    justify-content: flex-start;
  }

  .MuiTabs-indicator {
    ${coloring.background.primary}
  }
  
  .MuiTabs-scroller {
    overflow-x: auto !important;
    -webkit-overflow-scrolling: touch;
    
    /* Hide scrollbar but keep functionality */
    scrollbar-width: none;
    -ms-overflow-style: none;
    
    &::-webkit-scrollbar {
      display: none;
    }
  }

  ${breakpoints.md} {
    ${spacing.padding.x.m}
  }
`;

/**
 * Individual tab
 */
export const tab = css`
  ${typography.fontFamily.primary}
  ${typography.fontSize.base}
  ${typography.fontWeight.medium}
  ${typography.letterSpacing.normal}
  ${typography.lineHeight.relaxed}
  ${typography.textTransform.capitalize}
  ${coloring.text.secondary}

  ${spacing.padding.x.sm}
  ${spacing.padding.y.s}
  &.Mui-selected {
    ${coloring.text.primary}
  }

  &:hover {
    ${coloring.text.primary}
  }
`;

/**
 * Tab panel container
 */
export const tabPanel = css`
  ${spacing.padding.l}
`;
