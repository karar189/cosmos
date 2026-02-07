/**
 * SectionGrid Component Styles
 * Uses the standardized style system for consistent, maintainable styling
 */

import { css } from '@emotion/react';
import { breakpoints, display, flex, grid, size, spacing } from '../../theme/styleSystem';
import type { GridAreas, GridTemplate } from './SectionGrid';

interface SectionGridStylesParams {
  columns?: GridTemplate;
  rows?: GridTemplate;
  areas?: GridAreas;
  gap: 'xs' | 's' | 'm' | 'l' | 'xl' | 'xxl' | 'xxxl' | 'xxxxl';
  autoFit?: string;
  autoFill?: string;
}

/**
 * Converts GridTemplate to CSS string
 */
function gridTemplateToString(template: GridTemplate): string {
  if (typeof template === 'number') {
    return `repeat(${template}, 1fr)`;
  }
  if (typeof template === 'string') {
    return template;
  }
  // Array case
  return template.map((item) => (typeof item === 'number' ? `${item}fr` : item)).join(' ');
}

/**
 * Converts GridAreas to CSS grid-template-areas string
 */
function gridAreasToString(areas: GridAreas): string {
  return areas.map((row) => `"${row.join(' ')}"`).join(' ');
}

/**
 * Main section grid container
 */
export const sectionGrid = ({
  columns,
  rows,
  areas,
  gap,
  autoFit,
  autoFill,
}: SectionGridStylesParams) => {
  // Determine grid template columns
  let gridTemplateColumns: string | undefined;
  let gridTemplateRows: string | undefined;
  let gridTemplateAreas: string | undefined;

  // Priority: autoFit/autoFill > areas > columns/rows

  if (autoFit) {
    gridTemplateColumns = `repeat(auto-fit, minmax(${autoFit}, 1fr))`;
  } else if (autoFill) {
    gridTemplateColumns = `repeat(auto-fill, minmax(${autoFill}, 1fr))`;
  } else if (areas) {
    // When using areas, we need to set up columns and rows based on the areas
    gridTemplateAreas = gridAreasToString(areas);
    // If columns/rows not provided, infer from areas
    if (!columns && areas.length > 0) {
      const maxCols = Math.max(...areas.map((row) => row.length));
      gridTemplateColumns = `repeat(${maxCols}, 1fr)`;
    }
    if (!rows && areas.length > 0) {
      gridTemplateRows = `repeat(${areas.length}, auto)`;
    }
  }

  // Apply columns if not set by autoFit/autoFill/areas
  if (!gridTemplateColumns) {
    if (columns) {
      gridTemplateColumns = gridTemplateToString(columns);
    }
  }

  // Apply rows if not set by areas
  if (!gridTemplateRows) {
    if (rows) {
      gridTemplateRows = gridTemplateToString(rows);
    }
  }

  return css`
    ${size.width.full}
    
    /* Mobile: Stack all cards vertically */
    ${display.flex}
    ${flex.column}
    ${spacing.gap[gap]}
    
    /* Desktop: Use grid layout */
    ${breakpoints.md} {
      ${grid.base}
      ${gridTemplateColumns && `grid-template-columns: ${gridTemplateColumns};`}
      ${gridTemplateRows && `grid-template-rows: ${gridTemplateRows};`}
      ${gridTemplateAreas && `grid-template-areas: ${gridTemplateAreas};`}
    }
  `;
};
