/** @jsxImportSource @emotion/react */
'use client';
import {
  CardHeader,
  SingleLineChart,
  SingleLineChartDataPoint,
  Toggle,
  ToggleOption,
} from '@core3/ui-components';
import useTranslation from '@/hooks/useTranslation';
import { useEffect, useMemo, useState } from 'react';
import { formatAmount, formatDate } from '@/utils/format';
import { useExchangeTradingChart } from '@/data/api/coinGecko.queries';
import { CHART_HEIGHT, CHART_X_MAX_POINTS } from '@/constants/charts';
import { ExchangeTradingChartPoint } from '@/data/api/types/coin_gecko/exchange_historical';
interface ExchangeOverviewTradeVolumeChartProps {
  exchange: string;
}

const ExchangeOverviewTradeVolumeChart: React.FC<ExchangeOverviewTradeVolumeChartProps> = ({
  exchange,
}) => {
  const { t } = useTranslation(['exchanges', 'common']);
  const [tradeData, setTradeData] = useState<SingleLineChartDataPoint[]>([]);

  const timeRangeOptions: ToggleOption<number | string>[] = [
    { value: 1, label: t('common:timeRange.1D', '1D') },
    { value: 7, label: t('common:timeRange.7D', '7D') },
    { value: 30, label: t('common:timeRange.30D', '30D') },
    { value: 365, label: t('common:timeRange.1Y', '1Y') },
  ];

  const [timeRange, setTimeRange] = useState(timeRangeOptions[0].value);
  const {
    data: chartData,
    isLoading
  } = useExchangeTradingChart({
      exchange_id: exchange,
      days: timeRange.toString(),
    }, {
    enabled: !!exchange, // Only fetch when exchange exists
  });

  useEffect(() => {
    const formatChartData = (data: ExchangeTradingChartPoint[]) => {
      if (!data || data.length === 0) return [];

      const totalPoints = data.length;

      // For 1-day range, include time to make each point unique
      const formatTimestamp = (date: Date) => {
        if (timeRange == 1) {
          return `${date.getHours().toString()}:00`;
        }
        if( timeRange == 30 ) {
          // Include date and month for up to 30-day view: "MMM DD"
          return formatDate(date.toISOString().split('T')[0], { month: 'short', day: 'numeric' });
        }
        if( timeRange == 365 ) {
          // Return month short name
          return date.toLocaleString('default', { month: 'short' });
        }
        // For longer ranges, just return date: "YYYY-MM-DD"
        return formatDate(date.toISOString().split('T')[0], { month: 'short', day: 'numeric' });
      };

      if (totalPoints <= CHART_X_MAX_POINTS) {
        const tradeVolume = data.map((point) => ({
          value: point.volume,
          x_axis: formatTimestamp(point.date),
        }));

        setTradeData(tradeVolume);
        return;
      }

      const samplesPerGroup = Math.ceil(totalPoints / CHART_X_MAX_POINTS);

      const sortedData = [...data].sort(
        (sample1, sample2) => sample1.timestamp - sample2.timestamp
      );

      const tradeVolume: { value: number; x_axis: string }[] = [];

      for (let i = 0; i < totalPoints; i += samplesPerGroup) {
        const group = sortedData.slice(i, i + samplesPerGroup);

        if (group.length === 0) continue;

        const avgVolume = group.reduce((sum, point) => sum + point.volume, 0) / group.length;

        const midPointIndex = Math.floor(group.length / 2);
        const representativeDate = group[midPointIndex].date;
        tradeVolume.push({
          value: avgVolume,
          x_axis: formatTimestamp(representativeDate),
        });
      }

      setTradeData(tradeVolume);
    };
    if (chartData) {
      formatChartData(chartData);
    }
  }, [chartData, timeRange]);

  const { yDomain, yTicks } = useMemo(() => {
    if (!tradeData || tradeData.length === 0) {
      return { yDomain: [0, 100] as [number, number], yTicks: [0, 25, 50, 75, 100] };
    }

    const values = tradeData.map((point) => Number(point.value));
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
  }, [tradeData]);

  const formatYAxisLabel = (label: string) => formatAmount(label, { compact: true, prefix: '$', decimalPlaces: 2 });
  
  const formatTooltipValue = (value: number): [string, string] => [
    formatAmount(value, { compact: true, prefix: '$', decimalPlaces: 0 }),
    t('exchanges:details.overview.tradingVolume', 'Trading Volume')
  ];

  const dataAvailable = tradeData && tradeData.length > 0;
  return (
    <>
      <CardHeader
        title={t('exchanges:details.overview.tradingVolumeChart', 'Trading Volume Chart')}
        rightContent={
            <Toggle
              size="small"
              value={timeRange}
              onChange={setTimeRange}
              options={timeRangeOptions}
            />
        }
      />
      <SingleLineChart
        data={dataAvailable ? tradeData : []}
        loading={isLoading}
        emptyDescription={
          dataAvailable ? undefined : t('common:comingSoon', 'This Data is Coming Soon')
        }
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
        height={CHART_HEIGHT}
        yAxisLabelFormatter={formatYAxisLabel}
        tooltipFormatter={formatTooltipValue}
      />
    </>
  );
};

export default ExchangeOverviewTradeVolumeChart;
