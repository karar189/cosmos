/** @jsxImportSource @emotion/react */
'use client';

import { ExampleLabel } from '@/components/common/ExampleLabel';
import useTranslation from '@/hooks/useTranslation';
import { colors } from '@core3/ui-components/styleSystem';
import { Toggle, ToggleOption } from '@core3/ui-components';
import { useMemo, useState } from 'react';
import {
  BarChart as RechartsBarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from 'recharts';
import * as styles from './InstitutionComplianceChecklistChart.styles';

const CHART_HEIGHT = 270;

type TimeRangeValue = 7 | 30 | 180 | 365 | 'all';

const CATEGORIES: { key: string; name: string; color: string }[] = [
  { key: 'dependency', name: 'Dependency', color: colors.chart.dependency },
  { key: 'financial', name: 'Financial', color: colors.chart.financial },
  { key: 'operational', name: 'Operational', color: colors.chart.operational },
  { key: 'regulatory', name: 'Regulatory', color: colors.chart.regulatory },
  { key: 'reputational', name: 'Reputational', color: colors.chart.reputational },
  { key: 'security', name: 'Security', color: colors.chart.security },
];

/** Mock scores per category (0–100). Vary slightly by time range for demo. */
function getMockData(timeRange: TimeRangeValue): { name: string; value: number; fill: string }[] {
  const base = [78, 82, 71, 88, 75, 85];
  const spread = timeRange === 'all' ? 4 : timeRange === 365 ? 3 : 2;
  return CATEGORIES.map((cat, i) => ({
    name: cat.name,
    value: Math.min(100, Math.max(0, base[i] + (Math.random() - 0.5) * spread * 2)),
    fill: cat.color,
  }));
}

export default function InstitutionComplianceChecklistChart() {
  const { t } = useTranslation(['projects', 'common']);
  const timeRangeOptions: ToggleOption<TimeRangeValue>[] = [
    { value: 7, label: t('common:timeRange.1W', '1W') },
    { value: 30, label: t('common:timeRange.1M', '1M') },
    { value: 180, label: t('common:timeRange.6M', '6M') },
    { value: 365, label: t('common:timeRange.1Y', '1Y') },
    { value: 'all', label: t('common:timeRange.all', 'All') },
  ];
  const [timeRange, setTimeRange] = useState<TimeRangeValue>(180);

  const chartData = useMemo(() => getMockData(timeRange), [timeRange]);

  return (
    <>
      <div css={styles.headerWrapper}>
        <div css={styles.titleRow}>
          <h3 css={styles.chartTitle}>Institution Compliance Checklist</h3>
          <div css={styles.exampleLabelWrapper}>
            <ExampleLabel
              label={t('common:exampleData.label', 'Example')}
              tooltip={t('common:exampleData.tooltip', 'Example Tooltip')}
              tooltipTitle={t('common:exampleData.tooltipTitle', 'Data Example')}
            />
          </div>
        </div>
        <div css={styles.toggleWrapper}>
          <Toggle
            size="small"
            value={timeRange}
            onChange={setTimeRange}
            options={timeRangeOptions}
          />
        </div>
      </div>
      <div css={styles.chartWrapper}>
        <ResponsiveContainer width="100%" height={CHART_HEIGHT}>
          <RechartsBarChart data={chartData} margin={{ top: 8, right: 8, left: 8, bottom: 8 }}>
            <XAxis
              dataKey="name"
              tick={{ fill: colors.neutral.gray700, fontSize: 12 }}
              axisLine={false}
              tickLine={false}
              tickMargin={8}
              interval={0}
            />
            <YAxis
              orientation="right"
              domain={[0, 100]}
              tick={{ fill: colors.neutral.gray600, fontSize: 11 }}
              axisLine={false}
              tickLine={false}
              tickMargin={8}
              width={28}
            />
            <Tooltip
              contentStyle={{
                background: colors.background.paper,
                border: `1px solid ${colors.neutral.gray200}`,
                borderRadius: 8,
                fontSize: 12,
              }}
              formatter={(value: number) => [String(value), 'Score']}
              labelFormatter={(label) => label}
            />
            <Bar dataKey="value" radius={[4, 4, 0, 0]} barSize={48} isAnimationActive={true}>
              {chartData.map((entry, index) => (
                <Cell key={entry.name} fill={entry.fill} />
              ))}
            </Bar>
          </RechartsBarChart>
        </ResponsiveContainer>
      </div>
      <div css={styles.legendRow}>
        {CATEGORIES.map((cat) => (
          <span key={cat.key} css={styles.legendItem}>
            <span css={styles.legendDot(cat.color)} />
            {cat.name}
          </span>
        ))}
      </div>
    </>
  );
}
