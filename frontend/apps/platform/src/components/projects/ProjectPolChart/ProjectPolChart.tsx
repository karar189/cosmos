import { ProbabilityOfLossDynamic } from '@/types/api/projectsStatistic';
import { formatAmount, formatDate } from '@/utils/format';
import { SingleLineChart, SingleLineChartDataPoint } from '@core3/ui-components';

interface ProjectPolChartProps {
  data?: ProbabilityOfLossDynamic;
}

const PROJECT_POL_CHART_HEIGHT = 110;
const ticks = [20, 40, 60, 80, 100];

const ProjectPolChart: React.FC<ProjectPolChartProps> = ({ data }) => {
  const chartData: SingleLineChartDataPoint[] =
    data?.points.map((point) => ({
      x: point.date,
      y: point.averagePolScore,
    })) ?? [];

  // Use 'preserveStartEnd' to automatically space labels while ensuring
  // first and last labels are always shown, preventing overlap
  const labelInterval: number | 'preserveStartEnd' = chartData.length > 5 ? 'preserveStartEnd' : 0;

  return (
    <SingleLineChart
      data={chartData}
      xDataKey="x"
      yDataKey="y"
      yTicks={ticks}
      yDomain={[20, 100]}
      xAxisLabelFormatter={(label) => formatDate(label, { month: 'short', day: 'numeric' })}
      yAxisLabelFormatter={(label) => formatAmount(label)}
      tooltipFormatter={(value, name) => [formatAmount(value), name]}
      xAxisInterval={labelInterval}
      height={PROJECT_POL_CHART_HEIGHT}
      margin={{
        top: 5,
        right: 0,
        left: 0,
        bottom: 20,
      }}
    />
  );
};

export default ProjectPolChart;
