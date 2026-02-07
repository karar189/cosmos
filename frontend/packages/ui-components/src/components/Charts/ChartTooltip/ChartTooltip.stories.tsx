import type { Meta, StoryObj } from '@storybook/react';
import { expect, within } from '@storybook/test';
import ChartTooltip from './ChartTooltip';
import type { ChartTooltipItem } from './ChartTooltip';
import { colors } from '../../../styleSystem';

/**
 * ChartTooltip is a reusable tooltip component for displaying chart data points.
 * It displays a date, colored dots, labels, and badge values for each data series.
 */
const meta = {
  title: 'Components/Charts/ChartTooltip',
  component: ChartTooltip,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component:
          'A reusable tooltip component for charts that displays date, colored indicators, labels, and badge values. Used in MultiLineChart and other chart components.',
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    date: {
      description: 'Date/label to display at the top of the tooltip',
      control: 'text',
    },
    items: {
      description: 'Array of items to display in the tooltip',
      control: 'object',
    },
    dateFormatter: {
      description: 'Custom formatter function for the date label',
      control: false,
    },
  },
} satisfies Meta<typeof ChartTooltip>;

export default meta;
type Story = StoryObj<typeof meta>;

const sampleItems: ChartTooltipItem[] = [
  {
    label: 'Security',
    value: 45,
    color: colors.chart.security,
  },
  {
    label: 'Financial',
    value: 30,
    color: colors.chart.financial,
  },
  {
    label: 'Operational',
    value: 60,
    color: colors.chart.operational,
  },
  {
    label: 'Reputational',
    value: 30,
    color: colors.chart.reputational,
  },
  {
    label: 'Regulatory',
    value: 85,
    color: colors.chart.regulatory,
  },
  {
    label: 'Dependency',
    value: 65,
    color: colors.chart.dependency,
  },
];

/**
 * Basic tooltip with default settings
 */
export const Default: Story = {
  args: {
    date: 'Jan 15, 2025',
    items: sampleItems,
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    
    // Check that date is displayed (may be formatted by formatMonthToDate)
    // Use a more specific regex to match date format (Jan followed by digits) to avoid matching labels
    expect(canvas.getByText(/Jan.*\d/)).toBeInTheDocument();
    
    // Check that all item labels are displayed
    expect(canvas.getByText('Security')).toBeInTheDocument();
    expect(canvas.getByText('Financial')).toBeInTheDocument();
    expect(canvas.getByText('Operational')).toBeInTheDocument();
    expect(canvas.getByText('Reputational')).toBeInTheDocument();
    expect(canvas.getByText('Regulatory')).toBeInTheDocument();
    expect(canvas.getByText('Dependency')).toBeInTheDocument();
    
    // Check that values are displayed (some values appear multiple times, so use getAllByText)
    const value45 = canvas.getAllByText('45');
    expect(value45.length).toBeGreaterThan(0);
    const value30 = canvas.getAllByText('30');
    expect(value30.length).toBeGreaterThan(0);
    expect(canvas.getByText('60')).toBeInTheDocument();
    expect(canvas.getByText('85')).toBeInTheDocument();
    expect(canvas.getByText('65')).toBeInTheDocument();
  },
};

/**
 * Tooltip with month abbreviation (will be formatted automatically)
 */
export const WithMonthAbbreviation: Story = {
  args: {
    date: 'Jan',
    items: sampleItems,
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    
    // Check that date is displayed (formatted - formatMonthToDate adds day and year)
    expect(canvas.getByText(/Jan/i)).toBeInTheDocument();
    
    // Check that items are displayed
    expect(canvas.getByText('Security')).toBeInTheDocument();
    expect(canvas.getByText('Financial')).toBeInTheDocument();
    expect(canvas.getByText('Operational')).toBeInTheDocument();
  },
};

/**
 * Tooltip without date
 */
export const WithoutDate: Story = {
  args: {
    items: sampleItems,
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    
    // Check that items are still displayed
    expect(canvas.getByText('Security')).toBeInTheDocument();
    expect(canvas.getByText('Financial')).toBeInTheDocument();
    expect(canvas.getByText('Operational')).toBeInTheDocument();
    expect(canvas.getByText('Reputational')).toBeInTheDocument();
    expect(canvas.getByText('Regulatory')).toBeInTheDocument();
    expect(canvas.getByText('Dependency')).toBeInTheDocument();
    
    // Check that values are displayed (some values appear multiple times)
    const value45 = canvas.getAllByText('45');
    expect(value45.length).toBeGreaterThan(0);
    const value30 = canvas.getAllByText('30');
    expect(value30.length).toBeGreaterThan(0);
    expect(canvas.getByText('60')).toBeInTheDocument();
    expect(canvas.getByText('85')).toBeInTheDocument();
    expect(canvas.getByText('65')).toBeInTheDocument();
  },
};

/**
 * Tooltip with custom date formatter
 */
export const WithCustomDateFormatter: Story = {
  args: {
    date: '2025-01-15',
    items: sampleItems,
    dateFormatter: (date: string) => {
      // Custom formatter example
      const d = new Date(date);
      return d.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
      });
    },
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    
    // Check that formatted date is displayed (should be formatted by custom formatter)
    // Use a more specific regex to match date format
    expect(canvas.getByText(/Jan.*\d/)).toBeInTheDocument();
    
    // Check that items are displayed
    expect(canvas.getByText('Security')).toBeInTheDocument();
    expect(canvas.getByText('Financial')).toBeInTheDocument();
    expect(canvas.getByText('Operational')).toBeInTheDocument();
  },
};

/**
 * Tooltip with fewer items
 */
export const FewItems: Story = {
  args: {
    date: 'Jun 15, 2025',
    items: [
      {
        label: 'Security',
        value: 38,
        color: colors.chart.security,
      },
      {
        label: 'Financial',
        value: 35,
        color: colors.chart.financial,
      },
      {
        label: 'Operational',
        value: 42,
        color: colors.chart.operational,
      },
    ],
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    
    // Check that date is displayed (may be formatted by formatMonthToDate)
    // Use a more specific regex to match date format (Jun followed by digits) to avoid matching labels
    expect(canvas.getByText(/Jun.*\d/)).toBeInTheDocument();
    
    // Check that only 3 items are displayed
    expect(canvas.getByText('Security')).toBeInTheDocument();
    expect(canvas.getByText('Financial')).toBeInTheDocument();
    expect(canvas.getByText('Operational')).toBeInTheDocument();
    
    // Check that values are displayed
    expect(canvas.getByText('38')).toBeInTheDocument();
    expect(canvas.getByText('35')).toBeInTheDocument();
    expect(canvas.getByText('42')).toBeInTheDocument();
    
    // Verify that other items from sampleItems are NOT present
    expect(canvas.queryByText('Reputational')).not.toBeInTheDocument();
    expect(canvas.queryByText('Regulatory')).not.toBeInTheDocument();
    expect(canvas.queryByText('Dependency')).not.toBeInTheDocument();
  },
};

/**
 * Tooltip with string values
 */
export const WithStringValues: Story = {
  args: {
    date: 'Mar 15, 2025',
    items: [
      {
        label: 'Price',
        value: '$65.50',
        color: colors.chart.security,
      },
      {
        label: 'Market Cap',
        value: '$1.2B',
        color: colors.chart.financial,
      },
    ],
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    
    // Check that date is displayed (may be formatted by formatMonthToDate)
    // Use a more specific regex to match date format (Mar followed by digits) to avoid matching "Market Cap"
    expect(canvas.getByText(/Mar\s+\d+/)).toBeInTheDocument();
    
    // Check that labels are displayed
    expect(canvas.getByText('Price')).toBeInTheDocument();
    expect(canvas.getByText('Market Cap')).toBeInTheDocument();
    
    // Check that string values are displayed (use getAllByText in case values appear multiple times)
    const value65_50 = canvas.getAllByText('$65.50');
    expect(value65_50.length).toBeGreaterThan(0);
    const value1_2B = canvas.getAllByText('$1.2B');
    expect(value1_2B.length).toBeGreaterThan(0);
  },
};

/**
 * PoL Categories example (matches MultiLineChart usage)
 */
export const PolCategoriesExample: Story = {
  args: {
    date: 'Jun',
    items: [
      {
        label: 'Dependency',
        value: 45,
        color: colors.chart.dependency,
      },
      {
        label: 'Regulatory',
        value: 80,
        color: colors.chart.regulatory,
      },
      {
        label: 'Reputational',
        value: 60,
        color: colors.chart.reputational,
      },
      {
        label: 'Operational',
        value: 42,
        color: colors.chart.operational,
      },
      {
        label: 'Financial',
        value: 35,
        color: colors.chart.financial,
      },
      {
        label: 'Security',
        value: 38,
        color: colors.chart.security,
      },
    ],
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    
    // Check that date is displayed (formatted - formatMonthToDate adds day and year)
    expect(canvas.getByText(/Jun/i)).toBeInTheDocument();
    
    // Check that all 6 category labels are displayed
    expect(canvas.getByText('Dependency')).toBeInTheDocument();
    expect(canvas.getByText('Regulatory')).toBeInTheDocument();
    expect(canvas.getByText('Reputational')).toBeInTheDocument();
    expect(canvas.getByText('Operational')).toBeInTheDocument();
    expect(canvas.getByText('Financial')).toBeInTheDocument();
    expect(canvas.getByText('Security')).toBeInTheDocument();
    
    // Check that values are displayed
    expect(canvas.getByText('45')).toBeInTheDocument();
    expect(canvas.getByText('80')).toBeInTheDocument();
    expect(canvas.getByText('60')).toBeInTheDocument();
    expect(canvas.getByText('42')).toBeInTheDocument();
    expect(canvas.getByText('35')).toBeInTheDocument();
    expect(canvas.getByText('38')).toBeInTheDocument();
  },
};

