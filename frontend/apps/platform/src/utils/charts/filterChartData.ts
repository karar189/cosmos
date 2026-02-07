import type { PolCategoriesTimeRange } from '@/types/charts/PolCategoriesChart';
import type { CommunitySentimentTimeRange } from '@/types/charts/CommunitySentimentChart';

/**
 * Filters chart data based on the selected time range
 * 
 * @param data - Array of chart data points
 * @param timeRange - Selected time range ('1W', '1M', '6M', '1Y', 'All')
 * @returns Filtered array of data points based on the time range
 * 
 * @example
 * const filtered = filterChartDataByTimeRange(data, '6M');
 */
export function filterChartDataByTimeRange<T extends { [key: string]: unknown }>(
  data: T[],
  timeRange: PolCategoriesTimeRange
): T[] {
  switch (timeRange) {
    case '1W':
      return data.slice(-1);
    case '1M':
      return data.slice(-1);
    case '6M':
      return data.slice(-6);
    case '1Y':
      return data;
    case 'All':
      return data;
    default:
      return data;
  }
}

/**
 * Filters community sentiment chart data based on the selected time range
 * 
 * @param data - Array of chart data points
 * @param timeRange - Selected time range ('1M', '1Y', 'All')
 * @returns Filtered array of data points based on the time range
 * 
 * @example
 * const filtered = filterCommunitySentimentDataByTimeRange(data, '1Y');
 */
export function filterCommunitySentimentDataByTimeRange<T extends { [key: string]: unknown }>(
  data: T[],
  timeRange: CommunitySentimentTimeRange
): T[] {
  switch (timeRange) {
    case '1M':
      return data.slice(-1);
    case '1Y':
      return data.slice(-12);
    case 'All':
      return data;
    default:
      return data;
  }
}

