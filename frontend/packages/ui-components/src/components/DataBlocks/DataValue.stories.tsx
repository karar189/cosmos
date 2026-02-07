import type { Meta, StoryObj } from '@storybook/react';
import React from 'react';
import { expect, within } from '@storybook/test';
import DataValue from './DataValue';
import { colors } from '../../theme/styleSystem';

/**
 * DataValue displays a label, value, and optional subvalue with color coding for positive/negative states.
 *
 * Use it to present key metrics with visual indicators for positive or negative changes.
 */
const meta = {
  title: 'Components/DataBlocks/DataValue',
  component: DataValue,
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component:
          'DataValue component displays a label, main value, and optional subvalue. The value can be color-coded using positive or negative props to indicate trends or changes.',
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    label: {
      description: 'Label text displayed above the value',
      control: 'text',
    },
    value: {
      description: 'Main value to display (string or React node)',
      control: 'text',
    },
    subvalue: {
      description:
        'Optional subvalue displayed next to the main value (object with value, positive, negative, type properties)',
      control: 'object',
    },
    tooltip: {
      description: 'Optional tooltip text',
      control: 'text',
    },
    tooltipIcon: {
      description: 'Optional icon name for tooltip',
      control: 'text',
    },
  },
} satisfies Meta<typeof DataValue>;

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * Basic data value with label and value
 */
export const Basic: Story = {
  args: {
    label: 'Trading Volume',
    value: '$4.37B',
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    
    expect(canvas.getByText('Trading Volume')).toBeInTheDocument();
    expect(canvas.getByText('$4.37B')).toBeInTheDocument();
  },
};

/**
 * Data value with positive subvalue (green)
 */
export const Positive: Story = {
  args: {
    label: 'Trading Volume',
    value: '$4.37B',
    subvalue: { value: '+12.5%', positive: true },
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    
    expect(canvas.getByText('Trading Volume')).toBeInTheDocument();
    expect(canvas.getByText('$4.37B')).toBeInTheDocument();
    expect(canvas.getByText('+12.5%')).toBeInTheDocument();
  },
};

/**
 * Data value with negative subvalue (red)
 */
export const Negative: Story = {
  args: {
    label: 'Trading Volume',
    value: '$4.37B',
    subvalue: { value: '-8.2%', negative: true },
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    
    expect(canvas.getByText('Trading Volume')).toBeInTheDocument();
    expect(canvas.getByText('$4.37B')).toBeInTheDocument();
    expect(canvas.getByText('-8.2%')).toBeInTheDocument();
  },
};

/**
 * Data value with subvalue (percentage change)
 */
export const WithSubvalue: Story = {
  args: {
    label: 'Trading Volume',
    value: '$4.37B',
    subvalue: { value: '-15.5%', negative: true },
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    
    expect(canvas.getByText('Trading Volume')).toBeInTheDocument();
    expect(canvas.getByText('$4.37B')).toBeInTheDocument();
    expect(canvas.getByText('-15.5%')).toBeInTheDocument();
  },
};

/**
 * Data value with multiple subvalues
 */
export const WithMultipleSubvalues: Story = {
  args: {
    label: 'Trading Volume',
    value: '$4.37B',
    subvalue: [
      { value: '-15.5%', negative: true },
      { value: '-$763,276,148', negative: true, type: 'secondary' },
    ],
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    
    expect(canvas.getByText('Trading Volume')).toBeInTheDocument();
    expect(canvas.getByText('$4.37B')).toBeInTheDocument();
    expect(canvas.getByText('-15.5%')).toBeInTheDocument();
    expect(canvas.getByText('-$763,276,148')).toBeInTheDocument();
  },
};

/**
 * Data value with positive change
 */
export const PositiveChange: Story = {
  args: {
    label: 'Total Revenue',
    value: '$12.5M',
    subvalue: [
      { value: '+23.4%', positive: true },
      { value: '+$2,350,000', positive: true, type: 'secondary' },
    ],
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    
    expect(canvas.getByText('Total Revenue')).toBeInTheDocument();
    expect(canvas.getByText('$12.5M')).toBeInTheDocument();
    expect(canvas.getByText('+23.4%')).toBeInTheDocument();
    expect(canvas.getByText('+$2,350,000')).toBeInTheDocument();
  },
};

/**
 * Data value with tooltip
 */
export const WithTooltip: Story = {
  args: {
    label: 'Active Users',
    value: '1,234',
    subvalue: { value: '+12%', positive: true },
    tooltip: 'Number of users who have logged in within the last 30 days',
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    
    expect(canvas.getByText('Active Users')).toBeInTheDocument();
    expect(canvas.getByText('1,234')).toBeInTheDocument();
    expect(canvas.getByText('+12%')).toBeInTheDocument();
    
    // Check that tooltip icon is present
    const tooltipIcon = canvasElement.querySelector('svg');
    expect(tooltipIcon).toBeInTheDocument();
  },
};

/**
 * Data value with React node value
 */
export const WithReactNodeValue: Story = {
  args: {
    label: 'Status',
    value: (
      <span>
        <span style={{ color: colors.semantic.success }}>●</span> Active
      </span>
    ),
    subvalue: { value: 'Last updated: 2h ago', type: 'secondary' },
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    
    expect(canvas.getByText('Status')).toBeInTheDocument();
    expect(canvas.getByText('Active')).toBeInTheDocument();
    expect(canvas.getByText('Last updated: 2h ago')).toBeInTheDocument();
  },
};
