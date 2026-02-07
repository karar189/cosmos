import { css } from '@emotion/react';
import { flex, spacing, colors, breakpoints, size, borders, typography, spacingValues, sizeNumberValues,overflow, patterns, position, background, display, sizeValues } from '@core3/ui-components/styleSystem';

// Layout constants
const SIDEBAR_WIDTH = sizeValues.sidebar;

export const contentRow = css`
  ${flex.row}
  ${flex.item.grow}
  ${position.relative}
  ${size.minHeight.screen}
  ${background.project}
`;

export const leftColumn = css`
  ${flex.column}
  ${flex.item.grow}
  ${size.width.full}
  ${size.minWidth.zero}
  
  ${breakpoints.lg} {
    ${size.width.custom(`calc(100% - ${SIDEBAR_WIDTH})`)}
  }
`;

export const sidebarColumn = css`
  ${display.none}

  ${breakpoints.lg} {
    ${display.block}
    ${position.sticky}
    ${position.top.custom(`${sizeNumberValues.header}px`)}
    ${flex.self.start}
    ${size.width.custom(SIDEBAR_WIDTH)}
    ${size.minWidth.zero}
    ${size.maxHeight.custom(`calc(100vh - ${sizeNumberValues.header}px)`)}
    ${overflow.y.auto}
    ${background.inherit}
    ${patterns.smoothScroll}    
    &::-webkit-scrollbar-thumb {
      background-color: ${colors.neutral.gray300};
      ${borders.radius.sm}
    }
    
    &::-webkit-scrollbar-thumb:hover {
      background-color: ${colors.neutral.gray400};
    }
  }
`;

export const contentArea = css`
  ${flex.column}
  ${spacing.gap.l}
  ${spacing.padding.bottom.l}
  ${size.width.full}
`;

export const mainContent = css`
  ${flex.column}
  ${spacing.gap.l}
`;

export const loadingContainer = css`
  ${flex.center}
  ${flex.column}
  ${spacing.gap.l}
  ${spacing.padding.xxxxl}
  ${size.minHeight.custom(`calc(100vh - ${sizeNumberValues.header}px)`)}
  ${size.width.full}
`;

export const loadingSpinner = css`
  width: ${spacingValues.xxl};
  height: ${spacingValues.xxl};
  border: ${spacingValues.xxs} solid ${colors.neutral.gray200};
  border-top-color: ${colors.primary.main};
  ${borders.radius.full}
  animation: spin 1s linear infinite;

  @keyframes spin {
    to {
      transform: rotate(360deg);
    }
  }
`;

export const loadingText = css`
  color: ${colors.text.secondary};
  ${typography.fontSize.base}
`;

export const errorContainer = css`
  ${flex.center}
  ${flex.column}
  ${spacing.gap.l}
  ${spacing.padding.xxxxl}
  ${size.minHeight.custom('60vh')}
  ${size.width.full}
  ${typography.textAlign.center}
`;

export const errorTitle = css`
  ${typography.fontSize.xl}
  ${typography.fontWeight.semibold}
  color: ${colors.text.primary};
  ${spacing.margin.zero}
`;

export const errorMessage = css`
  color: ${colors.text.secondary};
  ${size.maxWidth.custom('500px')}
`;

export const errorActions = css`
  ${flex.row}
  ${spacing.gap.m}
  ${spacing.margin.top.l}
`;
