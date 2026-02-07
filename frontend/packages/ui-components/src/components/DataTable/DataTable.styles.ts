/**
 * DataTable Component Styles
 * Generic table component styles
 */

import { css } from '@emotion/react';
import {
  borders,
  breakpoints,
  coloring,
  colors,
  display,
  flex,
  opacity,
  overflow,
  size,
  sizeValues,
  spacing,
  typography,
} from '../../styleSystem';

import type { ScrollableConfig } from './DataTable';

export const tableContainer = css`
  ${size.width.full}
`;

export const table = css`
  ${size.width.full}
  ${borders.collapse.collapse}
  table-layout: fixed;
`;

/**
 * Scrollable wrapper - wraps the table when scrollable prop is provided
 */
export const scrollableWrapper = (config: ScrollableConfig) => {
  const {
    maxVisibleRows,
    rowHeight = 56,
    headerHeight = 48,
    maxHeight,
  } = config;

  // Calculate max height from rows or use direct maxHeight value
  const calculatedMaxHeight = maxHeight
    ? typeof maxHeight === 'number'
      ? `${maxHeight}px`
      : maxHeight
    : maxVisibleRows
      ? `${headerHeight + rowHeight * maxVisibleRows}px`
      : 'auto';

  return css`
    max-height: ${calculatedMaxHeight};
    ${overflow.y.auto}
    ${overflow.x.hidden}
    ${spacing.padding.right.l}
  `;
};

/**
 * Table styles when in scrollable mode - makes header sticky
 */
export const scrollableTable = css`
  thead {
    position: sticky;
    top: 0;
    z-index: 1;
    ${coloring.background.neutral.white}
  }
`;

export const row = (hasCustomRowAfter: boolean) => css`
  ${hasCustomRowAfter ? borders.none : borders.bottom}
  border-color: ${colors.neutral.gray300};
`;

export const td = css`
  ${spacing.padding.y.s}
  ${typography.fontSize.sm}
  color: ${colors.text.primary}
`;

export const noResultsContainer = css`
  ${flex.column}
  ${flex.centerCross}
  ${spacing.padding.y.xxl}
`;

export const noResultsIcon = css`
  ${opacity.medium}
`;

export const noResultsContent = css`
  ${flex.column}
  ${flex.centerCross}
  ${spacing.gap.xs}
  ${spacing.margin.top.s}
  ${spacing.margin.bottom.l}
`;

export const noResultsTitle = css`
  ${typography.fontSize.base}
  ${typography.fontWeight.medium}
  color: ${colors.text.primary};
`;

export const noResultsDescription = css`
  ${typography.fontSize.sm}
  ${typography.fontWeight.medium}
  color: ${colors.text.secondary};
`;

export const noResultsButton = css`
  width: min(100%, ${sizeValues['4xl']});
`;

/**
 * Adds right padding to right-aligned columns that aren't the last column.
 * This creates visual separation between right-aligned content and the next column.
 */
export const cellAlignPadding = (
  align: 'left' | 'center' | 'right' | undefined,
  isLastColumn: boolean
) => {
  if (align === 'right' && !isLastColumn) {
    return css`
      ${spacing.padding.right.xl}
    `;
  }
  return null;
};

/**
 * Alignment styles for custom cell content
 */
export const customCellContainer = css`
  ${flex.row}
  ${size.width.full}
`;

export const customCellAlignStyles = {
  left: css`
    ${flex.justify.start}
  `,
  center: css`
    ${flex.justify.center}
  `,
  right: css`
    ${flex.justify.end}
  `,
};

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
 * Desktop table wrapper - hides table on mobile when mobileCardRenderer is provided
 */
export const desktopTableWrapper = css`
  ${display.none}
  
  ${breakpoints.md} {
    ${display.block}
  }
`;

export const mobileCard = css`
  ${display.flex}
  ${flex.column}
  ${spacing.gap.s}
  ${spacing.padding.y.m}
  ${spacing.padding.x.m}
  ${borders.radius['2xl']}
  ${coloring.background.paper}
  ${borders.all}
  border-color: ${colors.neutral.gray300};
`;

export const mobileCardHeader = css`
  ${typography.fontSize.base}
  ${typography.fontWeight.semibold}
  ${coloring.text.primary}
`;

export const mobileCardBody = css`
  ${display.flex}
  ${flex.column}
  ${spacing.gap.xs}
`;

export const mobileCardRow = css`
  ${display.flex}
  ${flex.row}
  ${flex.justify.between}
  ${flex.align.start}
  ${spacing.gap.s}
`;

export const mobileCardLabel = css`
  ${typography.fontSize.sm}
  ${typography.fontWeight.medium}
  ${coloring.text.secondary}
`;

export const mobileCardValue = css`
  ${typography.fontSize.sm}
  ${typography.fontWeight.medium}
  ${coloring.text.primary}
  text-align: right;
`;