/** @jsxImportSource @emotion/react */
import { Financial } from '@/types/api/project';
import { formatAmount } from '@/utils/format';
import { DonutChart, DonutChartDataPoint, defaultColors } from '@core3/ui-components';
import * as styles from './ProjectFinancialAssetsChart.styles';
import { useTranslation } from 'react-i18next';
import { colors } from '@core3/ui-components/styleSystem';

type ProjectFinancialAssetsChartProps = {
  hasToken?: boolean;
  data?: NonNullable<Financial['treasuryQuality']>['assetDistribution'];
};

const CHART_SIZE = 100;

const ProjectFinancialAssetsChart: React.FC<ProjectFinancialAssetsChartProps> = ({ data, hasToken = false }) => {
  const { t } = useTranslation(['common']);

  // Check if any item has a percentage
  const hasPercentages = data?.some((item) => item.percentage !== undefined) ?? false;

  // When no percentages, show full gray chart
  if (!hasPercentages && data && data.length > 0) {
    const grayDataPoint: DonutChartDataPoint = {
      name: t('common:nA', 'N/A'),
      value: 100,
      color: colors.neutral.gray400,
    };

    return (
      <div css={styles.container}>
        <DonutChart data={[grayDataPoint]} size={CHART_SIZE} showPercentage={false} />
        <ul css={styles.dataPointsContainer(hasToken)}>
          {data.map((item, index) => (
            <li css={styles.dataPoint} key={`data-point-${index}`}>
              <span css={styles.dataPointCircle(colors.neutral.gray400)}></span>
              <span>{item.label}</span>
              <span css={styles.dataPointValue}>{t('common:nA', 'N/A')}</span>
            </li>
          ))}
        </ul>
      </div>
    );
  }

  const dataPoints: DonutChartDataPoint[] =
    data
      ?.filter((item) => item.percentage !== undefined)
      .sort((a, b) => (b.percentage ?? 0) - (a.percentage ?? 0))
      .map((item, index) => ({
        name: item.label,
        value: item.percentage!,
        color: defaultColors[index],
      })) || [];

  return (
    <div css={styles.container}>
      <DonutChart data={dataPoints} size={CHART_SIZE} />
      <ul css={styles.dataPointsContainer(hasToken)}>
        {dataPoints.map((point, index) => (
          <li css={styles.dataPoint} key={`data-point-${index}`}>
            <span css={styles.dataPointCircle(point.color as string)}></span>
            <span>{point.name}</span>
            <span css={styles.dataPointValue}>{formatAmount(point.value)}%</span>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ProjectFinancialAssetsChart;
