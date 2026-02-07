/**
 * Mock Chart Data
 * Sample data for chart components
 */

import type { MultiLineChartDataPoint, MultiLineChartLine } from '@core3/ui-components';
import type { PriceChartDataPoint } from '@/types/charts/PriceChart';
import type { InflationChartDataPoint } from '@/types/charts/InflationChart';
import type { TVLChartDataPoint, TVLStatusBadge } from '@/types/charts/TVLChart';
import type { ActiveAddressesChartDataPoint } from '@/types/charts/ActiveAddressesChart';
import type { LiabilityVsReservesChartDataPoint } from '@/types/charts/LiabilityVsReservesChart';
import type { WashtradingChartDataPoint } from '@/types/charts/WashtradingChart';
import type { AssetDistributionChartDataPoint } from '@/types/charts/AssetDistributionChart';
import type { StackedBarChartDataPoint } from '@core3/ui-components';
import { colors } from '@core3/ui-components/styleSystem';

/** Mock price chart data */
export const mockPriceData: PriceChartDataPoint[] = [
  { date: 'Mar 3', value: 60 },
  { date: 'Mar 4', value: 70 },
  { date: 'Mar 5', value: 73 },
  { date: 'Mar 6', value: 66 },
  { date: 'Mar 7', value: 72 },
  { date: 'Mar 8', value: 75 },
];

/** Mock market cap chart data */
export const mockMarketCapData: PriceChartDataPoint[] = [
  { date: 'Mar 3', value: 580 },
  { date: 'Mar 4', value: 680 },
  { date: 'Mar 5', value: 710 },
  { date: 'Mar 6', value: 640 },
  { date: 'Mar 7', value: 700 },
  { date: 'Mar 8', value: 730 },
];

/** Mock PoL categories chart data */
export const mockPolCategoriesData: MultiLineChartDataPoint[] = [
  { x: 'Jan', security: 45, financial: 45, operational: 60, reputational: 30, regulatory: 85, dependency: 65 },
  { x: 'Feb', security: 25, financial: 30, operational: 55, reputational: 35, regulatory: 90, dependency: 60 },
  { x: 'Mar', security: 30, financial: 30, operational: 50, reputational: 40, regulatory: 88, dependency: 58 },
  { x: 'Apr', security: 35, financial: 35, operational: 45, reputational: 45, regulatory: 85, dependency: 55 },
  { x: 'May', security: 40, financial: 40, operational: 40, reputational: 50, regulatory: 82, dependency: 50 },
  { x: 'Jun', security: 38, financial: 35, operational: 42, reputational: 60, regulatory: 80, dependency: 45 },
  { x: 'Jul', security: 35, financial: 30, operational: 45, reputational: 55, regulatory: 82, dependency: 40 },
  { x: 'Aug', security: 32, financial: 25, operational: 48, reputational: 50, regulatory: 84, dependency: 38 },
  { x: 'Sep', security: 30, financial: 20, operational: 50, reputational: 45, regulatory: 86, dependency: 35 },
  { x: 'Oct', security: 28, financial: 15, operational: 45, reputational: 40, regulatory: 87, dependency: 32 },
  { x: 'Nov', security: 35, financial: 10, operational: 35, reputational: 35, regulatory: 85, dependency: 30 },
  { x: 'Dec', security: 40, financial: 35, operational: 30, reputational: 30, regulatory: 85, dependency: 30 },
];

/** Default category lines configuration for PoL categories chart */
export const mockDefaultCategoryLines: MultiLineChartLine[] = [
  { key: 'security', name: 'Security', color: colors.chart.security, dataKey: 'security' },
  { key: 'financial', name: 'Financial', color: colors.chart.financial, dataKey: 'financial' },
  { key: 'operational', name: 'Operational', color: colors.chart.operational, dataKey: 'operational' },
  { key: 'reputational', name: 'Reputational', color: colors.chart.reputational, dataKey: 'reputational' },
  { key: 'regulatory', name: 'Regulatory', color: colors.chart.regulatory, dataKey: 'regulatory' },
  { key: 'dependency', name: 'Dependency', color: colors.chart.dependency, dataKey: 'dependency' },
];

/** Mock inflation chart data */
export const mockInflationData: InflationChartDataPoint[] = [
  { x: '2023', value: 5.2 },
  { x: 'Jul', value: 7.5 },
  { x: '2024', value: 7.0 },
  { x: 'Jul', value: 8.5 },
  { x: '2025', value: 6.8 },
  { x: 'Jul', value: 9.8 },
];

/** Mock TVL chart data */
export const mockTVLData: TVLChartDataPoint[] = [
  { x: '2023', value: 610 },
  { x: 'Jul', value: 860 },
  { x: '2024', value: 895 },
  { x: 'Jul', value: 790 },
  { x: '2025', value: 920 },
  { x: 'Jul', value: 980 },
];

export const mockTVLStatusBadges: TVLStatusBadge[] = [
  { label: 'Uptrend' },
  { label: 'No suspicious spikes' },
];

/** Mock active addresses chart data */
export const mockActiveAddressesData: ActiveAddressesChartDataPoint[] = [
  { x: 'Mar 3', value: 580 },
  { x: 'Mar 4', value: 880 },
  { x: 'Mar 5', value: 920 },
  { x: 'Mar 6', value: 780 },
  { x: 'Mar 7', value: 910 },
  { x: 'Mar 8', value: 980 },
];

/** Mock liability vs reserves chart data */
export const mockLiabilityVsReservesData: LiabilityVsReservesChartDataPoint[] = [
  { x: '2023', value: 103.2 },
  { x: 'Jul', value: 104.1 },
  { x: '2024', value: 104.8 },
  { x: 'Jul', value: 104.2 },
  { x: '2025', value: 104.6 },
  { x: 'Jul', value: 105.2 },
];

/** Mock washtrading chart data */
export const mockWashtradingData: WashtradingChartDataPoint[] = [
  { x: 'Mar 3', lineValue: 60, barValue: 120 },
  { x: 'Mar 4', lineValue: 75, barValue: 150 },
  { x: 'Mar 5', lineValue: 85, barValue: 200 },
  { x: 'Mar 6', lineValue: 50, barValue: 80 },
  { x: 'Mar 7', lineValue: 90, barValue: 180 },
  { x: 'Mar 8', lineValue: 95, barValue: 140 },
  { x: 'Mar 9', lineValue: 88, barValue: 160 },
  { x: 'Mar 10', lineValue: 92, barValue: 170 },
  { x: 'Mar 11', lineValue: 78, barValue: 130 },
  { x: 'Mar 12', lineValue: 85, barValue: 145 },
  { x: 'Mar 13', lineValue: 80, barValue: 125 },
  { x: 'Mar 14', lineValue: 88, barValue: 155 },
  { x: 'Mar 15', lineValue: 90, barValue: 165 },
  { x: 'Mar 16', lineValue: 82, barValue: 135 },
  { x: 'Mar 17', lineValue: 87, barValue: 150 },
  { x: 'Mar 18', lineValue: 91, barValue: 175 },
  { x: 'Mar 19', lineValue: 93, barValue: 185 },
  { x: 'Mar 20', lineValue: 95, barValue: 195 },
  { x: 'Mar 21', lineValue: 97, barValue: 205 },
  { x: 'Mar 22', lineValue: 99, barValue: 215 },
  { x: 'Mar 23', lineValue: 101, barValue: 225 },
  { x: 'Mar 24', lineValue: 103, barValue: 235 },
  { x: 'Mar 25', lineValue: 105, barValue: 245 },
  { x: 'Mar 26', lineValue: 107, barValue: 255 },
  { x: 'Mar 27', lineValue: 109, barValue: 265 },
  { x: 'Mar 28', lineValue: 111, barValue: 275 },
  { x: 'Mar 29', lineValue: 113, barValue: 285 },
  { x: 'Mar 30', lineValue: 115, barValue: 295 },
  { x: 'Mar 31', lineValue: 117, barValue: 305 },
  { x: 'Apr 1', lineValue: 119, barValue: 315 },
  { x: 'Apr 2', lineValue: 121, barValue: 325 },
];

/** Mock asset distribution chart data */
export const mockAssetDistributionData: AssetDistributionChartDataPoint[] = [
  { name: 'Stable', value: 65, color: '#388E3C' },
  { name: 'Native', value: 23, color: '#26A69A' },
  { name: 'Project', value: 12, color: '#7CB342' },
];

/** Mock social fraud chart data */
export const mockSocialFraudData = {
  value: 75,
  label: 'Twitter Score',
  status: 'Good',
};

/** Mock community sentiment chart data */
export const mockCommunitySentimentData: StackedBarChartDataPoint[] = [
  { name: 'Jan', positive: 65, negative: 55 },
  { name: 'Feb', positive: 40, negative: 70 },
  { name: 'Mar', positive: 80, negative: 45 },
  { name: 'Apr', positive: 55, negative: 10 },
  { name: 'May', positive: 60, negative: 35 },
  { name: 'Jun', positive: 58, negative: 25 },
  { name: 'Jul', positive: 10, negative: 65 },
  { name: 'Aug', positive: 75, negative: 25 },
  { name: 'Sep', positive: 45, negative: 50 },
  { name: 'Oct', positive: 60, negative: 10 },
  { name: 'Nov', positive: 40, negative: 10 },
  { name: 'Dec', positive: 20, negative: 10 },
];

