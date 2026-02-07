/**
 * HeatMap Component Styles
 * Uses the standardized style system for consistent, maintainable styling
 */

import { css } from '@emotion/react';
import {
  borders,
  coloring,
  cursor,
  flex,
  grid,
  size,
  spacing,
  typography,
} from '../../theme/styleSystem';
import { getBackgroundColor } from './heatMapUtils';

/**
 * HeatMap container
 */
export const heatMapContainer = css`
  ${flex.column}
  ${spacing.gap.l}
`;

/**
 * HeatMap grid wrapper
 * Uses responsive grid with equal-width columns that resize automatically
 */
export const heatMapGrid = css`
  ${grid.base}
  ${grid.cols(7)}
  ${size.width.full}
  ${spacing.gap.xxs}
`;

/**
 * HeatMap cell with background color based on level
 * Only static height is set; width is automatically calculated by grid
 */
export const heatMapCell = (level: number) => css`
  ${size.minWidth.custom('28px')}
  ${size.height.xsm}
  ${size.width.auto}
  ${borders.radius.base}
  ${cursor.pointer}
  ${coloring.background.custom(getBackgroundColor(level))}
`;

/**
 * HeatMap legend container
 */
export const heatMapLegend = css`
  ${flex.row}
  ${flex.align.center}
  ${spacing.gap.xxs}
`;

/**
 * Legend label
 */
export const legendLabel = css`
  ${typography.fontSize.xs}
  ${typography.fontWeight.medium}
  ${coloring.text.secondary}
`;

/**
 * Legend items container
 */
export const legendItems = css`
  ${flex.row}
  ${spacing.gap.xxs}
`;

/**
 * Legend item with background color based on level
 */
export const legendItem = (level: number) => css`
  ${size.width.sm}
  ${size.height.sm}
  ${borders.radius.base}
  ${cursor.pointer}
  ${coloring.background.custom(getBackgroundColor(level))}
`;
