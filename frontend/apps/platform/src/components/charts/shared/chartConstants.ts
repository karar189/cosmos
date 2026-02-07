/**
 * Shared chart configuration constants
 *
 * NOTE: For responsive sizing (heights, sizes, margins), use the `useChartDimensions` hook instead.
 * This file contains non-scaling constants like Y-axis domains, ticks, time ranges, and percentages.
 */

/** Y-axis ticks for PoL categories chart (inverted scale 0-100) */
export const POL_CATEGORIES_Y_TICKS = [10, 20, 30, 40, 50, 60, 70, 80, 90, 100] as const;

/** Y-axis domain for PoL categories chart (inverted: 100 to 0) */
export const POL_CATEGORIES_Y_DOMAIN: [number, number] = [100, 0];

/** Time range options for PolCategoriesChart */
export const POL_CATEGORIES_TIME_RANGES = ['1W', '1M', '6M', '1Y', 'All'] as const;

/** Time range options for PriceChart */
export const PRICE_CHART_TIME_RANGES = ['1D', '7D', '1M', '1Y', 'All'] as const;

/** Time range options for ActiveAddressesChart */
export const ACTIVE_ADDRESSES_TIME_RANGES = ['1D', '7D', '1M', '1Y', 'All'] as const;

/** Y-axis domain for Liability vs Reserves chart */
export const LIABILITY_VS_RESERVES_Y_DOMAIN: [number, number] = [102, 105];

/** Y-axis ticks for Liability vs Reserves chart */
export const LIABILITY_VS_RESERVES_Y_TICKS = [102, 103, 104, 105] as const;

/** Y-axis domain for Washtrading chart line */
export const WASHTRADING_LINE_Y_DOMAIN: [number, number] = [40, 125];

/** Y-axis domain for Washtrading chart bars */
export const WASHTRADING_BAR_Y_DOMAIN: [number, number] = [0, 1200];

/** Y-axis ticks for Washtrading chart line */
export const WASHTRADING_LINE_Y_TICKS = [40, 55, 70, 85, 100, 115, 125] as const;

/** Y-axis ticks for Washtrading chart bars */
export const WASHTRADING_BAR_Y_TICKS = [0, 62.5, 125, 187.5, 250] as const;

/** Default inner radius for Asset Distribution donut chart */
export const ASSET_DISTRIBUTION_INNER_RADIUS = '60%';

/** Default outer radius for Asset Distribution donut chart */
export const ASSET_DISTRIBUTION_OUTER_RADIUS = '90%';

/** Time range options for CommunitySentimentChart */
export const COMMUNITY_SENTIMENT_TIME_RANGES = ['1M', '1Y', 'All'] as const;
