/** @jsxImportSource @emotion/react */
'use client';

import { Interpolation, Theme } from '@emotion/react';
import { forwardRef, RefObject, useImperativeHandle, useState } from 'react';
import * as styles from './HeatMap.styles';
import HeatMapCell from './HeatMapCell';

/**
 * Represents a single data point for the HeatMap.
 * @typedef {Object} HeatMapPoint
 * @property {string} date - The date string in YYYY-MM-DD format.
 * @property {number} intensity - The numeric intensity value for this date.
 */
export interface HeatMapPoint {
  date: string;
  intensity: number;
}

/**
 * Ref interface for HeatMapLegend to support hover sync from HeatMap cells.
 * @interface
 */
export interface HeatMapLegendRef {
  /**
   * Sets the hover state in the legend from a heat map cell.
   * @param {number | null} intensity - The hovered intensity (or null to clear).
   */
  setHoveredFromCell: (intensity: number | null) => void;
}

/**
 * Props for the HeatMap component.
 * @interface
 */
export interface HeatMapProps {
  /**
   * Array of data points for the heat map.
   */
  points: HeatMapPoint[];
  /**
   * Optional end date for the heatmap grid (YYYY-MM-DD). Defaults to today.
   */
  endDate?: string | Date;
  /**
   * Optional array of intensity thresholds (for color levels). Defaults to [0, 25, 50, 75, 100].
   */
  intensityLevels?: number[];
  /**
   * Number of days to render. Defaults to 30.
   */
  days?: number;
  /**
   * Ref to associated HeatMapLegend for interaction sync.
   */
  legendRef?: RefObject<HeatMapLegendRef>;
  /**
   * Optional Emotion CSS for custom container styles.
   */
  css?: Interpolation<Theme>;
}

/**
 * State representing current hover interaction for scaling and highlighting.
 * @interface
 */
export interface HoverState {
  /**
   * Source of the hover action ('cell' or 'legend').
   */
  source: 'cell' | 'legend';
  /**
   * Intensity value that is hovered.
   */
  intensity: number;
  /**
   * Optional cell index of the hovered cell (present if `source` is 'cell').
   */
  cellIndex?: number;
}

/**
 * Ref interface for imperative handle, allowing legend to update cell highlight.
 * @interface
 */
export interface HeatMapRef {
  /**
   * Set hovered state on the grid from the legend hover.
   * @param {number | null} intensity - The hovered intensity (or null to clear).
   */
  setHoveredFromLegend: (intensity: number | null) => void;
}

/**
 * The HeatMap component displays an interactive calendar grid of intensities.
 * It synchronizes hover interaction with a HeatMapLegend, and distributes data over the last `days` days.
 *
 * @param {HeatMapProps} props - The props for the HeatMap.
 * @param {React.Ref<HeatMapRef>} ref - Exposes imperative method to sync hover from legend.
 * @returns {JSX.Element} Heatmap visualization.
 */
const HeatMap = forwardRef<HeatMapRef, HeatMapProps>(
  (
    { points, endDate, intensityLevels = [0, 25, 50, 75, 100], days = 30, legendRef, ...props },
    ref
  ) => {
    /**
     * Hover state for scaling and highlighting cells based on cell or legend hover.
     */
    const [hoverState, setHoverState] = useState<HoverState | null>(null);

    useImperativeHandle(ref, () => ({
      /**
       * Sets hover highlight from the legend.
       * @param {number | null} intensity
       */
      setHoveredFromLegend: (intensity: number | null) => {
        if (intensity === null) {
          setHoverState(null);
        } else {
          setHoverState({ source: 'legend', intensity });
        }
      },
    }));

    /**
     * Handles cell hover, synchronizing state and informing the legend if present.
     * @param {number | null} intensity - The intensity of the hovered cell, or null to reset.
     * @param {number} cellIndex - The index of the hovered cell.
     */
    const handleCellHover = (intensity: number | null, cellIndex: number) => {
      if (intensity === null) {
        setHoverState(null);
        legendRef?.current?.setHoveredFromCell(null);
      } else {
        setHoverState({ source: 'cell', intensity, cellIndex });
        legendRef?.current?.setHoveredFromCell(intensity);
      }
    };

    // Build map for fast intensity lookup by date
    const today = endDate ? new Date(endDate) : new Date();
    const dateMap = new Map<string, number>();

    points.forEach((point) => {
      dateMap.set(point.date, point.intensity);
    });

    // Generate grid data for each of the past `days` days (newest first)
    const gridData: Array<{ date: string; intensity: number }> = [];
    for (let i = 0; i < days; i++) {
      const date = new Date(today);
      date.setDate(date.getDate() - i);
      const dateStr = date.toISOString().split('T')[0];
      const intensity = dateMap.get(dateStr) ?? 0;
      gridData.push({ date: dateStr, intensity });
    }

    // Pad grid to complete week rows for display purposes (add empty cells at the end for oldest dates)
    const totalCells = Math.ceil(gridData.length / 7) * 7;
    while (gridData.length < totalCells) {
      gridData.push({ date: '', intensity: 0 });
    }

    return (
      <div css={styles.heatMapContainer} data-testid="heatMapContainer" {...props}>
        <div css={styles.heatMapGrid} data-testid="heatMapGrid">
          {gridData.map((data, index) => (
            <HeatMapCell
              key={index}
              cellIndex={index}
              intensity={data.intensity}
              intensityLevels={intensityLevels}
              hoverState={hoverState}
              onHover={handleCellHover}
              date={data.date}
            />
          ))}
        </div>
      </div>
    );
  }
);

HeatMap.displayName = 'HeatMap';

export default HeatMap;
