/** @jsxImportSource @emotion/react */
'use client';
import {
  SingleLineChart,
  SingleLineChartDataPoint,
  Toggle,
  ToggleOption,
} from '@core3/ui-components';
import useTranslation from '@/hooks/useTranslation';
import { useEffect, useMemo, useState } from 'react';
import * as styles from './ProjectOverviewPriceChart.styles';
import { formatAmount, formatDate } from '@/utils/format';
import { useTokenChart } from '@/data/api/coinGecko.queries';
import {
  ChartDataPoint,
  MarketChartRangeParams,
  MarketChartSampling,
} from '@/data/api/types/coin_gecko/coin_historical';
import { CHART_HEIGHT, CHART_X_MAX_POINTS } from '@/constants/charts';

/** CoinGecko id for Stellar (XLM) – used when no token/symbol is provided so the chart always shows data */
const STELLAR_COINGECKO_ID = 'stellar';

interface ProjectOverviewPriceChartProps {
  hasToken?: boolean;
  symbol: string;
}

const ProjectOverviewPriceChart: React.FC<ProjectOverviewPriceChartProps> = ({
  hasToken = false,
  symbol,
}) => {
  const { t } = useTranslation(['projects', 'common']);
  const [priceData, setPriceData] = useState<SingleLineChartDataPoint[]>([]);
  const [marketCapData, setMarketCapData] = useState<SingleLineChartDataPoint[]>([]);
  const [isFilteringData, setIsFilteringData] = useState(true);

  // When no symbol (e.g. dashboard), fix the graph to Stellar (XLM) so the chart always has data
  const effectiveSymbol = symbol?.trim() || STELLAR_COINGECKO_ID;

  const chartTypeOptions: ToggleOption<string>[] = [
    { value: 'price', label: t('details.overview.priceChart', 'Price Chart') },
    { value: 'marketCap', label: t('details.overview.marketCapChart', 'Market Cap Chart') },
  ];
  const timeRangeOptions: ToggleOption<number | string>[] = [
    { value: 1, label: t('common:timeRange.1D', '1D') },
    { value: 7, label: t('common:timeRange.7D', '7D') },
    { value: 30, label: t('common:timeRange.30D', '30D') },
    { value: 90, label: t('common:timeRange.90D', '90D') },
    { value: 'all', label: t('common:timeRange.all', 'All') },
  ];
  const [chartType, setChartType] = useState(chartTypeOptions[0].value);
  const [timeRange, setTimeRange] = useState(timeRangeOptions[0].value);

  const generateParams = () => {
    const params: MarketChartRangeParams = {
      id: effectiveSymbol,
      vs_currency: 'usd',
      days: timeRange === 'all' ? 'max' : timeRange.toString(),
    };
    if (typeof timeRange === 'number' && timeRange > 1) {
      params.interval = MarketChartSampling.DAILY;
    }
    return params;
  };
  const {
    data: chartData,
    isLoading,
  } = useTokenChart(generateParams(), {
    enabled: !!effectiveSymbol,
  });

  useEffect(() => {
    const formatChartData = (data: ChartDataPoint[]) => {
      if (!data || data.length === 0) return [];

      setIsFilteringData(true);
      const totalPoints = data.length;

      // For 1-day range, include time to make each point unique
      const formatTimestamp = (timestamp: number) => {
        const date = new Date(timestamp);
        if (timeRange === 1) {
          // Include hours for 1-day view: "YYYY-MM-DD HH:00"
          return `${date.toISOString().split('T')[0]} ${date.getHours().toString().padStart(2, '0')}:00`;
        }
        return date.toISOString().split('T')[0];
      };

      if (totalPoints <= CHART_X_MAX_POINTS) {
        const priceData = data.map((point) => ({
          value: point.price,
          x_axis: formatTimestamp(point.timestamp),
        }));
        const marketCapData = data.map((point) => ({
          value: point.marketCap,
          x_axis: formatTimestamp(point.timestamp),
        }));

        setPriceData(priceData);
        setMarketCapData(marketCapData);
        setIsFilteringData(false);
        return;
      }

      const samplesPerGroup = Math.ceil(totalPoints / CHART_X_MAX_POINTS);

      const sortedData = [...data].sort(
        (sample1, sample2) => sample1.timestamp - sample2.timestamp
      );

      const priceData: { value: number; x_axis: string }[] = [];
      const marketCapData: { value: number; x_axis: string }[] = [];

      for (let i = 0; i < totalPoints; i += samplesPerGroup) {
        const group = sortedData.slice(i, i + samplesPerGroup);

        if (group.length === 0) continue;

        const avgPrice = group.reduce((sum, point) => sum + point.price, 0) / group.length;
        const avgMarketCap = group.reduce((sum, point) => sum + point.marketCap, 0) / group.length;

        const midPointIndex = Math.floor(group.length / 2);
        const representativeTimestamp = group[midPointIndex].timestamp;

        priceData.push({
          value: avgPrice,
          x_axis: formatTimestamp(representativeTimestamp),
        });

        marketCapData.push({
          value: avgMarketCap,
          x_axis: formatTimestamp(representativeTimestamp),
        });
      }

      setPriceData(priceData);
      setMarketCapData(marketCapData);
      setIsFilteringData(false);
    };
    if (chartData) {
      formatChartData(chartData.data);
    }
  }, [chartData, timeRange]);

  const getChartData = () => {
    if (chartType === 'price') {
      return priceData;
    } else {
      return marketCapData;
    }
  };

  const { yDomain, yTicks } = useMemo(() => {
    const data = chartType === 'price' ? priceData : marketCapData;
    if (!data || data.length === 0) {
      return { yDomain: [0, 100] as [number, number], yTicks: [0, 25, 50, 75, 100] };
    }

    const values = data.map((point) => Number(point.value));
    const min = Math.min(...values);
    const max = Math.max(...values);

    // Add some padding to avoid data points touching edges
    const padding = (max - min) * 0.05;
    const paddedMin = Math.max(0, min - padding);
    const paddedMax = max + padding;

    const step = (paddedMax - paddedMin) / 4;
    const ticks = [
      paddedMin,
      paddedMin + step,
      paddedMin + step * 2,
      paddedMin + step * 3,
      paddedMax,
    ];

    return {
      yDomain: [paddedMin, paddedMax] as [number, number],
      yTicks: ticks,
    };
  }, [priceData, marketCapData, chartType]);

  const formatXAxisLabel = (label: string) => {
    if (timeRange === 1) {
      // Extract date part (remove time if present)
      const datePart = label.split(' ')[0];
      return formatDate(datePart, { month: 'short', day: 'numeric' });
    }
    return label;
  };

  const formatYAxisLabel = (label: string) => {
    if (chartType === 'price') {
      return formatAmount(label, { prefix: '$', decimalPlaces: 2 });
    } else {
      return formatAmount(label, { compact: true, prefix: '$', decimalPlaces: 2 });
    }
  };

  // Show chart when we have token data or when using Stellar fallback (effectiveSymbol === STELLAR_COINGECKO_ID)
  const showChart = hasToken || effectiveSymbol === STELLAR_COINGECKO_ID;
  const chartDataToShow = showChart ? getChartData() : [];
  const showLoading = showChart && (isLoading || isFilteringData);

  return (
    <>
      <div css={styles.toggleContainer}>
        <Toggle size="small" value={chartType} onChange={setChartType} options={chartTypeOptions} />
        {(!hasToken || effectiveSymbol === STELLAR_COINGECKO_ID) && (
          <Toggle
            size="small"
            value={timeRange}
            onChange={setTimeRange}
            options={timeRangeOptions}
          />
        )}
      </div>
      <SingleLineChart
        data={chartDataToShow}
        loading={showLoading}
        emptyTitle={t('details.overview.noToken.title', 'No Data')}
        emptyDescription={t('details.overview.noToken.description', 'Project does not have token yet')}
        xDataKey="x_axis"
        yDataKey="value"
        yDomain={yDomain}
        yTicks={yTicks}
        margin={{
          top: 5,
          right: 15,
          left: 0,
          bottom: 5,
        }}
        tooltipFormatter={(value, name) => [formatAmount(value, { prefix: '$', decimalPlaces: 2 }), name]}
        height={CHART_HEIGHT}
        yAxisLabelFormatter={formatYAxisLabel}
        xAxisLabelFormatter={formatXAxisLabel}
      />
    </>
  );
};

export default ProjectOverviewPriceChart;
