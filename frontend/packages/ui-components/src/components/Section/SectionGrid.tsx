/** @jsxImportSource @emotion/react */
'use client';

import React from 'react';
import * as styles from './SectionGrid.styles';

/**
 * Grid column/row definition
 * - Number: Equal fractional units (e.g., 3 → "repeat(3, 1fr)")
 * - String: Direct CSS value (e.g., "1fr 2fr 1fr" or "repeat(3, 1fr)")
 * - Array of strings: Explicit column/row sizes (e.g., ["1fr", "2fr", "1fr"])
 * - Array of numbers: Shorthand for equal fractional units (e.g., [1, 2, 1] → "1fr 2fr 1fr")
 */
export type GridTemplate = number | string | (string | number)[];

/**
 * Grid areas definition as a 2D array
 * Each row is an array of area names
 * @example [['header', 'header'], ['sidebar', 'content']]
 */
export type GridAreas = string[][];

export interface SectionGridProps {
  children?: React.ReactNode;
  id?: string;
  /**
   * Grid columns definition
   * - Number: Equal columns (e.g., 3 → "repeat(3, 1fr)")
   * - String: CSS value (e.g., "1fr 2fr 1fr")
   * - Array: Explicit sizes (e.g., ["1fr", "2fr", "1fr"] or [1, 2, 1])
   * @example columns={3}
   * @example columns={["1fr", "2fr", "1fr"]}
   * @example columns={[1, 2, 1]} // Shorthand for ["1fr", "2fr", "1fr"]
   */
  columns?: GridTemplate;
  /**
   * Grid rows definition
   * - Number: Equal rows (e.g., 2 → "repeat(2, 1fr)")
   * - String: CSS value (e.g., "auto 1fr")
   * - Array: Explicit sizes (e.g., ["auto", "1fr"] or [1, 2])
   * @example rows={2}
   * @example rows={["auto", "1fr"]}
   * @example rows={[1, 2]} // Shorthand for ["1fr", "2fr"]
   */
  rows?: GridTemplate;
  /**
   * Grid template areas as a 2D array
   * Defines named grid areas for layout
   * @example areas={[['header', 'header'], ['sidebar', 'content']]}
   */
  areas?: GridAreas;
  /**
   * Gap between grid items
   * Uses spacing system values: xs, s, m, l, xl, xxl, xxxl, xxxxl
   * @default "m"
   */
  gap?: 'xs' | 's' | 'm' | 'l' | 'xl' | 'xxl' | 'xxxl' | 'xxxxl';
  /**
   * Auto-fit grid with minimum column width
   * Overrides columns if provided
   * @example "250px"
   */
  autoFit?: string;
  /**
   * Auto-fill grid with minimum column width
   * Overrides columns if provided
   * @example "250px"
   */
  autoFill?: string;
}

/**
 * SectionGrid component - Grid container for section content
 * Provides flexible grid layout options for positioning children
 *
 * When `areas` prop is provided, automatically assigns grid-area styles
 * to children based on their order and the unique area names in the areas array.
 */
export default function SectionGrid({
  children,
  id,
  columns,
  rows,
  areas,
  gap = 'm',
  autoFit,
  autoFill,
}: SectionGridProps) {
  // Automatically assign grid areas to children if areas are defined
  const processedChildren = React.useMemo(() => {
    if (!areas) {
      return children;
    }

    // Get unique area names in order of first appearance
    const uniqueAreaNames: string[] = [];
    const seenAreas = new Set<string>();

    areas.forEach((row) => {
      row.forEach((areaName) => {
        if (!seenAreas.has(areaName)) {
          seenAreas.add(areaName);
          uniqueAreaNames.push(areaName);
        }
      });
    });

    // Filter out non-element children (e.g., false from conditional rendering)
    // and map valid elements with their grid area styles
    const validChildren: React.ReactElement[] = [];
    React.Children.forEach(children, (child) => {
      if (React.isValidElement(child)) {
        validChildren.push(child);
      }
    });

    // Map valid children and inject gridArea styles
    return validChildren.map((child, index) => {
      const areaName = uniqueAreaNames[index];
      if (!areaName) {
        return child;
      }

      // Merge existing style with gridArea
      const existingStyle = child.props.style || {};
      const newStyle = {
        ...existingStyle,
        gridArea: areaName,
      };

      return React.cloneElement(child, { style: newStyle, key: child.key ?? index });
    });
  }, [children, areas]);

  return (
    <div
      id={id}
      css={styles.sectionGrid({
        columns,
        rows,
        areas,
        gap,
        autoFit,
        autoFill,
      })}
    >
      {processedChildren}
    </div>
  );
}
