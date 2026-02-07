/**
 * Utilities for transforming API data to ScoreCard props
 */

import { RiskMetric } from './RiskChangesCard/RiskMetricList';
import type { SingleLineChartDataPoint } from '@core3/ui-components';

export interface ScoreCardInternalProps {
  score: number;
  rating: string;
  confidence: string;
  change24h: number;
  dataCoverage: number;
  riskMetrics: RiskMetric[];
  chartTitle?: string;
}

export interface PolDynamicChartData {
  data: SingleLineChartDataPoint[];
  yDomain?: [number, number];
}

/**
 * Base type for score data that can be used by both projects and exchanges
 */
export type ScoreData = {
  score: {
    current: number;
    min: number;
    max: number;
  };
  grade: {
    label: string;
    tier: 'high' | 'medium' | 'low';
  };
  confidence: 'high' | 'medium' | 'low' | null;
  change24h: number | null;
  dataCoverage: {
    percentage: number | null;
  };
  categories: Array<{
    name: string;
    score: {
      current: number;
      min: number;
      max: number;
    };
  }>;
  dynamic?: {
    window: string;
    score: {
      min: number;
      max: number;
    };
    points: Array<{
      date: string;
      averagePolScore: number;
    }>;
  };
};

/**
 * Transforms score data (from projects or exchanges) to ScoreCard props
 */
export const transformToScoreCardProps = (
  data: ScoreData
): ScoreCardInternalProps => {
  return {
    score: data.score.current,
    rating: data.grade.label,
    confidence: data.confidence?.toUpperCase() ?? 'N/A',
    change24h: data.change24h ?? 0,
    dataCoverage: data.dataCoverage.percentage ?? 0,
    riskMetrics: data.categories.map((category) => ({
      label: category.name,
      value: category.score.current,
    })),
    chartTitle: 'PoL Dynamic',
  };
};

/**
 * Transforms PoL dynamic points to SingleLineChart data format
 */
export const transformPolDynamicData = (
  data: ScoreData
): PolDynamicChartData | null => {
  if (!data.dynamic?.points || data.dynamic.points.length === 0) {
    return null;
  }

  const chartData: SingleLineChartDataPoint[] = data.dynamic.points.map(
    (point) => ({
      x: point.date,
      value: point.averagePolScore,
    })
  );

  const yDomain: [number, number] | undefined =
    data.dynamic.score?.min !== undefined &&
    data.dynamic.score?.max !== undefined
      ? [data.dynamic.score.min, data.dynamic.score.max]
      : undefined;

  return {
    data: chartData,
    yDomain,
  };
};
