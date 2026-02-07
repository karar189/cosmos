import type { Meta, StoryObj } from '@storybook/react';
import { expect } from '@storybook/test';
import StackedBarChart from './StackedBarChart';
import { colors } from '../../../theme/styleSystem';

/**
 * StackedBarChart is a reusable chart component for displaying positive/negative sentiment or distribution.
 * It features rounded bars and a central axis.
 */
const meta = {
  title: 'Components/Charts/StackedBarChart',
  component: StackedBarChart,
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component:
          'A reusable stacked bar chart for displaying diverging data (positive/negative). Useful for sentiment analysis.',
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    data: {
      description: 'Array of data points with name, positive, and negative properties',
      control: 'object',
    },
    height: {
      description: 'Height of the chart',
      control: 'number',
    },
    positiveColor: {
      description: 'Color for positive bars',
      control: 'color',
    },
    negativeColor: {
      description: 'Color for negative bars',
      control: 'color',
    },
  },
} satisfies Meta<typeof StackedBarChart>;

export default meta;
type Story = StoryObj<typeof meta>;

const sentimentData = [
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

/**
 * Community Sentiment chart showing positive (Green) and negative (Red) sentiment over time.
 */
export const CommunitySentiment: Story = {
  args: {
    data: sentimentData,
    height: 300,
    positiveColor: colors.chart.positive,
    negativeColor: colors.chart.negative,
  },
  play: async ({ canvasElement }) => {    
    // Check that chart is rendered (Recharts renders SVG)
    const svg = canvasElement.querySelector('svg');
    expect(svg).toBeInTheDocument();
    expect(svg).toBeVisible();
    
    // Check for bars (rect elements in SVG)
    const bars = svg?.querySelectorAll('rect');
    expect(bars?.length).toBeGreaterThan(0);
    
    // Verify ResponsiveContainer is present
    const responsiveContainer = canvasElement.querySelector('.recharts-responsive-container');
    expect(responsiveContainer).toBeInTheDocument();
  },
};

