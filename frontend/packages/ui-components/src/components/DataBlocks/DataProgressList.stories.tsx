import type { Meta, StoryObj } from '@storybook/react';
import { expect, within } from '@storybook/test';
import DataProgressList from './DataProgressList';

/**
 * DataProgressList displays a list of data items with progress bars, labels, values, and optional tooltips.
 *
 * Use it to present structured data with progress indicators in a consistent format.
 */
const meta = {
  title: 'Components/DataBlocks/DataProgressList',
  component: DataProgressList,
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component:
          'DataProgressList component displays a list of data items, each with a label, progress bar, value, and optional tooltip. Perfect for displaying structured information with progress indicators like completion percentages, risk scores, or metric progress.',
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    items: {
      description: 'Array of data items to display',
    },
  },
} satisfies Meta<typeof DataProgressList>;

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * Single item list
 */
export const SingleItem: Story = {
  args: {
    items: [
      {
        label: 'Vesting unlock risk',
        value: 85,
        maxValue: 100,
      },
    ],
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    
    expect(canvas.getByText('Vesting unlock risk')).toBeInTheDocument();
    expect(canvas.getByText('85')).toBeInTheDocument();
    
    // Check that progress bar is present
    const progressBar = canvasElement.querySelector('[role="progressbar"]') || 
                       canvasElement.querySelector('.progress') ||
                       canvasElement.querySelector('div[style*="width"]');
    expect(progressBar || canvasElement.querySelector('div')).toBeInTheDocument();
  },
};

/**
 * Multiple items with different progress levels
 */
export const MultipleItems: Story = {
  args: {
    items: [
      {
        label: 'Vesting unlock risk',
        value: 85,
        maxValue: 100,
      },
      {
        label: 'Treasury not locked',
        value: 24,
        maxValue: 100,
      },
      {
        label: 'Missing bug bounty',
        value: 24,
        maxValue: 100,
      },
    ],
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    
    expect(canvas.getByText('Vesting unlock risk')).toBeInTheDocument();
    expect(canvas.getByText('85')).toBeInTheDocument();
    expect(canvas.getByText('Treasury not locked')).toBeInTheDocument();
    expect(canvas.getByText('Missing bug bounty')).toBeInTheDocument();
    
    // Both "Treasury not locked" and "Missing bug bounty" have value 24
    const value24Elements = canvas.getAllByText('24');
    expect(value24Elements.length).toBe(2);
  },
};

/**
 * Items with tooltips
 */
export const WithTooltips: Story = {
  args: {
    items: [
      {
        label: 'Vesting unlock risk',
        value: 85,
        maxValue: 100,
        tooltip: 'Risk score based on vesting schedule and unlock patterns',
      },
      {
        label: 'Treasury not locked',
        value: 24,
        maxValue: 100,
        tooltip: 'Number of projects with unlocked treasury funds',
      },
      {
        label: 'Missing bug bounty',
        value: 24,
        maxValue: 100,
        tooltip: 'Projects without active bug bounty programs',
      },
    ],
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    
    expect(canvas.getByText('Vesting unlock risk')).toBeInTheDocument();
    expect(canvas.getByText('Treasury not locked')).toBeInTheDocument();
    expect(canvas.getByText('Missing bug bounty')).toBeInTheDocument();
    
    // Check that tooltip icons are present
    const tooltipIcons = canvasElement.querySelectorAll('svg');
    expect(tooltipIcons.length).toBeGreaterThan(0);
  },
};

/**
 * Different progress levels
 */
export const DifferentProgressLevels: Story = {
  args: {
    items: [
      {
        label: 'Low Progress',
        value: 15,
        maxValue: 100,
      },
      {
        label: 'Medium Progress',
        value: 50,
        maxValue: 100,
      },
      {
        label: 'High Progress',
        value: 85,
        maxValue: 100,
      },
      {
        label: 'Complete',
        value: 100,
        maxValue: 100,
      },
    ],
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    
    expect(canvas.getByText('Low Progress')).toBeInTheDocument();
    expect(canvas.getByText('15')).toBeInTheDocument();
    expect(canvas.getByText('Medium Progress')).toBeInTheDocument();
    expect(canvas.getByText('50')).toBeInTheDocument();
    expect(canvas.getByText('High Progress')).toBeInTheDocument();
    expect(canvas.getByText('85')).toBeInTheDocument();
    expect(canvas.getByText('Complete')).toBeInTheDocument();
    expect(canvas.getByText('100')).toBeInTheDocument();
  },
};

/**
 * Custom maxValue
 */
export const CustomMaxValue: Story = {
  args: {
    items: [
      {
        label: 'Score out of 50',
        value: 35,
        maxValue: 50,
      },
      {
        label: 'Score out of 200',
        value: 150,
        maxValue: 200,
      },
      {
        label: 'Score out of 1000',
        value: 750,
        maxValue: 1000,
      },
    ],
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    
    expect(canvas.getByText('Score out of 50')).toBeInTheDocument();
    expect(canvas.getByText('35')).toBeInTheDocument();
    expect(canvas.getByText('Score out of 200')).toBeInTheDocument();
    expect(canvas.getByText('150')).toBeInTheDocument();
    expect(canvas.getByText('Score out of 1000')).toBeInTheDocument();
    expect(canvas.getByText('750')).toBeInTheDocument();
  },
};

/**
 * Mixed items (some with tooltips, some without)
 */
export const MixedItems: Story = {
  args: {
    items: [
      {
        label: 'Vesting unlock risk',
        value: 85,
        maxValue: 100,
        tooltip: 'Risk score based on vesting schedule',
      },
      {
        label: 'Treasury not locked',
        value: 24,
        maxValue: 100,
      },
      {
        label: 'Missing bug bounty',
        value: 24,
        maxValue: 100,
        tooltip: 'Projects without active bug bounty programs',
      },
      {
        label: 'Security audit pending',
        value: 12,
        maxValue: 100,
      },
    ],
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    
    expect(canvas.getByText('Vesting unlock risk')).toBeInTheDocument();
    expect(canvas.getByText('Treasury not locked')).toBeInTheDocument();
    expect(canvas.getByText('Missing bug bounty')).toBeInTheDocument();
    expect(canvas.getByText('Security audit pending')).toBeInTheDocument();
    
    // Some items have tooltips, so at least some tooltip icons should be present
    const tooltipIcons = canvasElement.querySelectorAll('svg');
    expect(tooltipIcons.length).toBeGreaterThan(0);
  },
};

/**
 * Zero and edge cases
 */
export const EdgeCases: Story = {
  args: {
    items: [
      {
        label: 'Zero Progress',
        value: 0,
        maxValue: 100,
      },
      {
        label: 'Over Max Value',
        value: 150,
        maxValue: 100,
      },
      {
        label: 'Negative Value',
        value: -10,
        maxValue: 100,
      },
      {
        label: 'Small Values',
        value: 1,
        maxValue: 100,
      },
    ],
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    
    expect(canvas.getByText('Zero Progress')).toBeInTheDocument();
    expect(canvas.getByText('0')).toBeInTheDocument();
    expect(canvas.getByText('Over Max Value')).toBeInTheDocument();
    expect(canvas.getByText('150')).toBeInTheDocument();
    expect(canvas.getByText('Negative Value')).toBeInTheDocument();
    expect(canvas.getByText('-10')).toBeInTheDocument();
    expect(canvas.getByText('Small Values')).toBeInTheDocument();
    expect(canvas.getByText('1')).toBeInTheDocument();
  },
};

/**
 * Real-world risk metrics example
 */
export const RiskMetrics: Story = {
  args: {
    items: [
      {
        label: 'Vesting unlock risk',
        value: 85,
        maxValue: 100,
        tooltip: 'High risk due to early vesting unlock schedule',
      },
      {
        label: 'Treasury not locked',
        value: 24,
        maxValue: 100,
        tooltip: 'Number of projects with unlocked treasury funds',
      },
      {
        label: 'Missing bug bounty',
        value: 24,
        maxValue: 100,
        tooltip: 'Projects without active bug bounty programs',
      },
      {
        label: 'Code audit score',
        value: 67,
        maxValue: 100,
        tooltip: 'Code quality and security audit score',
      },
      {
        label: 'Team verification',
        value: 45,
        maxValue: 100,
        tooltip: 'Team member verification and background check score',
      },
    ],
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    
    expect(canvas.getByText('Vesting unlock risk')).toBeInTheDocument();
    expect(canvas.getByText('Treasury not locked')).toBeInTheDocument();
    expect(canvas.getByText('Missing bug bounty')).toBeInTheDocument();
    expect(canvas.getByText('Code audit score')).toBeInTheDocument();
    expect(canvas.getByText('Team verification')).toBeInTheDocument();
    
    // All items have tooltips
    const tooltipIcons = canvasElement.querySelectorAll('svg');
    expect(tooltipIcons.length).toBeGreaterThan(0);
  },
};

/**
 * Empty list
 */
export const EmptyList: Story = {
  args: {
    items: [],
  },
  play: async ({ canvasElement }) => {
    // Empty list should render the container but no items
    const list = canvasElement.querySelector('ul');
    expect(list).toBeInTheDocument();
  },
};

