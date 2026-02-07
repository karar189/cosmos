/** @jsxImportSource @emotion/react */
'use client';

import { useState, useImperativeHandle, forwardRef, RefObject } from 'react';
import { motion } from 'motion/react';
import * as styles from './HeatMap.styles';
import { HeatMapRef } from './HeatMap';
import { getIntensityRange } from './heatMapUtils';
import { Interpolation, Theme } from '@emotion/react';

/**
 * Props for the HeatMapLegend component.
 * @interface
 */
export interface HeatMapLegendProps {
  /**
   * Array of intensity values, corresponding to the heat map levels.
   */
  intensities?: number[];
  /**
   * Ref to the HeatMap component for synchronized hover state.
   */
  heatMapRef?: RefObject<HeatMapRef>;
  /**
   * Optional label displayed before the legend (e.g., 'Less').
   */
  prevLabel?: string | React.ReactNode;
  /**
   * Optional label displayed after the legend (e.g., 'More').
   */
  nextLabel?: string | React.ReactNode;
  css?: Interpolation<Theme>;
}

/**
 * Ref interface for imperative handle to synchronize hover state from the HeatMap cells.
 * @interface
 */
export interface HeatMapLegendRef {
  /**
   * Set legend's hovered state from a heat map cell (by intensity).
   * @param intensity - The intensity value or null to clear hover.
   */
  setHoveredFromCell: (intensity: number | null) => void;
}

/**
 * HeatMapLegend visually represents the intensity scale of the HeatMap component.
 * Integrates with the HeatMap via ref to provide synchronized hover interactions.
 *
 * @param {HeatMapLegendProps} props - Props for the HeatMapLegend.
 * @param {React.Ref<HeatMapLegendRef>} ref - Ref for imperative hover sync from HeatMap.
 * @returns {JSX.Element} Rendered legend component.
 */
const HeatMapLegend = forwardRef<HeatMapLegendRef, HeatMapLegendProps>(
  ({ intensities = [0, 25, 50, 75, 100], heatMapRef, prevLabel, nextLabel, ...props }, ref) => {
    /**
     * Stores the intensity currently hovered on the legend or from the heatmap.
     */
    const [hoveredIntensity, setHoveredIntensity] = useState<number | null>(null);
    /**
     * Source of the hover state, either from a cell or the legend itself.
     */
    const [_, setHoveredSource] = useState<'cell' | 'legend' | null>(null);

    // Expose imperative method to set hover from HeatMap cell.
    useImperativeHandle(ref, () => ({
      /**
       * Updates the legend's hovered intensity from a cell (called by HeatMap via ref).
       * @param intensity - The intensity value to show as hovered, or null to clear.
       */
      setHoveredFromCell: (intensity: number | null) => {
        if (intensity === null) {
          setHoveredIntensity(null);
          setHoveredSource(null);
        } else {
          const range = getIntensityRange(intensity, intensities);
          setHoveredIntensity(range);
          setHoveredSource('cell');
        }
      },
    }));

    /**
     * Handles pointer hover events on legend items.
     * Triggers hover sync with the HeatMap via ref.
     *
     * @param intensity - The intensity level hovered (or null if not hovering).
     */
    const handleLegendHover = (intensity: number | null) => {
      if (intensity === null) {
        setHoveredIntensity(null);
        setHoveredSource(null);
        heatMapRef?.current?.setHoveredFromLegend(null);
      } else {
        setHoveredIntensity(intensity);
        setHoveredSource('legend');
        heatMapRef?.current?.setHoveredFromLegend(intensity);
      }
    };

    return (
      <div css={styles.heatMapLegend} data-testid="heatMapLegend" {...props}>
        {prevLabel && <span css={styles.legendLabel}>{prevLabel}</span>}
        <div css={styles.legendItems} data-testid="legendItems">
          {intensities.map((intensity, index) => {
            const isScaled = hoveredIntensity === intensity;
            // Determining color level with a cap at 4 for compatibility/styling
            const colorLevel = Math.min(index, 4);

            return (
              <motion.div
                key={index}
                css={styles.legendItem(colorLevel)}
                data-testid="legendItem"
                animate={{
                  scale: isScaled ? 1.2 : 1,
                }}
                whileHover={{
                  scale: 1.2,
                }}
                transition={{
                  type: 'spring',
                  stiffness: 400,
                  damping: 17,
                }}
                onMouseEnter={() => handleLegendHover(intensity)}
                onMouseLeave={() => handleLegendHover(null)}
              />
            );
          })}
        </div>
        {nextLabel && <span css={styles.legendLabel}>{nextLabel}</span>}
      </div>
    );
  }
);

HeatMapLegend.displayName = 'HeatMapLegend';

export default HeatMapLegend;
