/** @jsxImportSource @emotion/react */
'use client';

import { motion } from 'motion/react';
import { Tooltip } from '../Tooltip';
import { HoverState } from './HeatMap';
import * as styles from './HeatMap.styles';
import { getIntensityLevel } from './heatMapUtils';

/**
 * Props for the HeatMapCell component.
 */
export interface HeatMapCellProps {
  /** The index position of the cell within the heatmap grid. */
  cellIndex: number;
  /** The intensity value to render for this cell. */
  intensity: number;
  /** The list of intensity threshold values that define color grouping. */
  intensityLevels: number[];
  /** The current hover state shared with legend or other cells. */
  hoverState: HoverState | null;
  /** Handler to inform parent of mouse hover events. */
  onHover: (intensity: number | null, cellIndex: number) => void;
  /** The ISO date string associated with this cell, if any. */
  date?: string;
}

/**
 * Determines whether the heat map cell should be scaled (animated) based on the current hover state.
 *
 * @param {number} cellIndex - The index of the cell in the heat map.
 * @param {number} intensity - The intensity of the cell.
 * @param {number[]} intensityLevels - The list of intensity thresholds.
 * @param {HoverState | null} hoverState - The current hover state of the heat map interaction.
 * @returns {boolean} True if this cell should be scaled/highlighted, false otherwise.
 */
const shouldScale = (
  cellIndex: number,
  intensity: number,
  intensityLevels: number[],
  hoverState: HoverState | null
): boolean => {
  if (!hoverState || intensity === 0) return false;
  if (hoverState.source === 'cell') {
    return hoverState.cellIndex === cellIndex;
  }
  if (hoverState.source === 'legend') {
    const hoveredThreshold = hoverState.intensity;
    const thresholdIndex = intensityLevels.indexOf(hoveredThreshold);
    if (thresholdIndex === -1) return false;
    if (hoveredThreshold === 0) return intensity === 0;
    const lowerBound = thresholdIndex > 0 ? intensityLevels[thresholdIndex - 1] : 0;
    return intensity > lowerBound && intensity <= hoveredThreshold;
  }
  return false;
};

/**
 * Formats a date string into a user-friendly label for the cell tooltip.
 *
 * @param {string} dateStr - The ISO date string to format.
 * @returns {string} The formatted date label.
 */
const formatDate = (dateStr: string): string => {
  if (!dateStr) return '';
  const date = new Date(dateStr);
  return date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
};

/**
 * Renders a single cell for the heatmap grid.
 *
 * - The cell's appearance is determined by its intensity and the given intensity thresholds.
 * - Cell is animated (scaled up) if either it or its group is hovered via the legend.
 * - A tooltip is shown on hover if the cell has a non-zero intensity and a date.
 *
 * @param {HeatMapCellProps} props - The props for the HeatMapCell component.
 * @returns {JSX.Element} The rendered cell element.
 */
export default function HeatMapCell({
  cellIndex,
  intensity,
  intensityLevels,
  hoverState,
  onHover,
  date,
}: HeatMapCellProps) {
  const level = getIntensityLevel(intensity, intensityLevels);
  const isScaled = shouldScale(cellIndex, intensity, intensityLevels, hoverState);

  const tooltipTitle = date
    ? `${formatDate(date)}: ${intensity} interaction${intensity !== 1 ? 's' : ''}`
    : `${intensity} interaction${intensity !== 1 ? 's' : ''}`;

  const cellContent = (
    <motion.div
      css={styles.heatMapCell(level)}
      animate={{
        scale: isScaled ? 1.15 : 1,
      }}
      whileHover={{
        scale: level > 0 ? 1.15 : 1,
      }}
      transition={{
        type: 'spring',
        stiffness: 400,
        damping: 17,
      }}
      onMouseEnter={() => level > 0 && onHover(intensity, cellIndex)}
      onMouseLeave={() => onHover(null, cellIndex)}
    />
  );

  if (level === 0 || !date) {
    return cellContent;
  }

  return (
    <Tooltip title={tooltipTitle} placement="top" enterDelay={200} leaveDelay={0}>
      {cellContent}
    </Tooltip>
  );
}
