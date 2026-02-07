/**
 * useChartDimensions Hook
 *
 * Provides responsive chart dimensions that scale with root font-size.
 * All values are defined at 16px base and automatically scale on larger displays:
 * - 2560px+ (1440p/4K): 1.5× scale
 * - 3840px+ (true 4K): 2× scale
 */
'use client';

import { useEffect, useState } from 'react';
import { getRootFontSize } from '@core3/ui-components/styleSystem';

// Base values at 16px root font-size
const BASE = {
  // Chart heights
  singleLineChartHeight: 300,
  multiLineChartHeight: 400,
  washtradingChartHeight: 280,
  communitySentimentChartHeight: 300,
  smallBarChartHeight: 200,

  // Chart sizes (for donut/gauge charts)
  assetDistributionChartSize: 150,
  socialFraudChartSize: 250,
  sidebarGaugeSize: 300,
  smallGaugeSize: 230,

  // Bar sizes
  washtradingBarSize: 12,
  smallBarSize: 32,

  // Margins
  defaultMargin: { top: 5, right: 0, left: 20, bottom: 80 },
  singleLineMargin: { top: 5, right: 0, left: 0, bottom: 5 },
  washtradingMargin: { top: 10, right: -5, left: -51, bottom: 20 },
} as const;

export interface ChartDimensions {
  // Scale factor (1 at 16px, 1.5 at 24px, 2 at 32px)
  scale: number;

  // Chart heights
  singleLineChartHeight: number;
  multiLineChartHeight: number;
  washtradingChartHeight: number;
  communitySentimentChartHeight: number;
  smallBarChartHeight: number;

  // Chart sizes
  assetDistributionChartSize: number;
  socialFraudChartSize: number;
  sidebarGaugeSize: number;
  smallGaugeSize: number;

  // Bar sizes
  washtradingBarSize: number;
  smallBarSize: number;

  // Margins (scaled)
  defaultMargin: { top: number; right: number; left: number; bottom: number };
  singleLineMargin: { top: number; right: number; left: number; bottom: number };
  washtradingMargin: { top: number; right: number; left: number; bottom: number };
}

/**
 * Hook that provides responsive chart dimensions.
 * All dimensions scale with the root font-size for consistent UX across screen sizes.
 *
 * @example
 * ```tsx
 * const { singleLineChartHeight, scale } = useChartDimensions();
 *
 * <ResponsiveContainer height={singleLineChartHeight}>
 *   <LineChart ... />
 * </ResponsiveContainer>
 * ```
 */
export function useChartDimensions(): ChartDimensions {
  const [rootSize, setRootSize] = useState(16);

  useEffect(() => {
    const updateRootSize = () => setRootSize(getRootFontSize());
    updateRootSize();
    window.addEventListener('resize', updateRootSize);
    return () => window.removeEventListener('resize', updateRootSize);
  }, []);

  const scale = rootSize / 16;

  // Helper to scale margin objects
  const scaleMargin = (margin: { top: number; right: number; left: number; bottom: number }) => ({
    top: Math.round(margin.top * scale),
    right: Math.round(margin.right * scale),
    left: Math.round(margin.left * scale),
    bottom: Math.round(margin.bottom * scale),
  });

  return {
    scale,

    // Heights
    singleLineChartHeight: Math.round(BASE.singleLineChartHeight * scale),
    multiLineChartHeight: Math.round(BASE.multiLineChartHeight * scale),
    washtradingChartHeight: Math.round(BASE.washtradingChartHeight * scale),
    communitySentimentChartHeight: Math.round(BASE.communitySentimentChartHeight * scale),
    smallBarChartHeight: Math.round(BASE.smallBarChartHeight * scale),

    // Sizes
    assetDistributionChartSize: Math.round(BASE.assetDistributionChartSize * scale),
    socialFraudChartSize: Math.round(BASE.socialFraudChartSize * scale),
    sidebarGaugeSize: Math.round(BASE.sidebarGaugeSize * scale),
    smallGaugeSize: Math.round(BASE.smallGaugeSize * scale),

    // Bar sizes
    washtradingBarSize: Math.round(BASE.washtradingBarSize * scale),
    smallBarSize: Math.round(BASE.smallBarSize * scale),

    // Margins
    defaultMargin: scaleMargin(BASE.defaultMargin),
    singleLineMargin: scaleMargin(BASE.singleLineMargin),
    washtradingMargin: scaleMargin(BASE.washtradingMargin),
  };
}

// Re-export base values for documentation/testing
export { BASE as CHART_BASE_VALUES };

