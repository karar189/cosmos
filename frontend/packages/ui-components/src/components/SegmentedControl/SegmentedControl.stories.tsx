import type { Meta, StoryObj } from '@storybook/react';
import { expect, within, userEvent, waitFor } from '@storybook/test';
import SegmentedControl from './SegmentedControl';
import React, { useState } from 'react';
import { colors } from '../../theme/styleSystem';

/**
 * SegmentedControl is a tab-like component for selecting one option from a set.
 * It provides a visually distinct way to switch between views or modes.
 */
const meta = {
  title: 'Components/SegmentedControl',
  component: SegmentedControl,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component:
          'A segmented control component for switching between multiple options. Features a pill-shaped design with smooth animations and supports both controlled and uncontrolled usage.',
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    options: {
      control: 'object',
      description: 'Array of available options with label and value',
    },
    value: {
      control: 'text',
      description: 'Currently selected value (controlled)',
    },
    defaultValue: {
      control: 'text',
      description: 'Default selected value (uncontrolled)',
    },
    onChange: {
      action: 'changed',
      description: 'Callback when selection changes',
    },
  },
} satisfies Meta<typeof SegmentedControl>;

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * Two options - simple binary choice
 */
export const TwoOptions: Story = {
  args: {
    options: [
      { label: 'List', value: 'list' },
      { label: 'Grid', value: 'grid' },
    ],
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    
    expect(canvas.getByText('List')).toBeInTheDocument();
    expect(canvas.getByText('Grid')).toBeInTheDocument();
    
    const listButton = canvas.getByRole('button', { name: 'List' });
    const gridButton = canvas.getByRole('button', { name: 'Grid' });
    
    expect(listButton).toBeInTheDocument();
    expect(gridButton).toBeInTheDocument();
    
    expect(listButton).toHaveAttribute('aria-pressed', 'true');
    expect(gridButton).toHaveAttribute('aria-pressed', 'false');
  },
};

/**
 * Three options - common use case
 */
export const ThreeOptions: Story = {
  args: {
    options: [
      { label: 'Day', value: 'day' },
      { label: 'Week', value: 'week' },
      { label: 'Month', value: 'month' },
    ],
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    
    expect(canvas.getByText('Day')).toBeInTheDocument();
    expect(canvas.getByText('Week')).toBeInTheDocument();
    expect(canvas.getByText('Month')).toBeInTheDocument();
    
    const dayButton = canvas.getByRole('button', { name: 'Day' });
    expect(dayButton).toHaveAttribute('aria-pressed', 'true');
  },
};

/**
 * Four options
 */
export const FourOptions: Story = {
  args: {
    options: [
      { label: '1H', value: '1h' },
      { label: '24H', value: '24h' },
      { label: '7D', value: '7d' },
      { label: '30D', value: '30d' },
    ],
  },
};

/**
 * Five options
 */
export const FiveOptions: Story = {
  args: {
    options: [
      { label: '1D', value: '1d' },
      { label: '1W', value: '1w' },
      { label: '1M', value: '1m' },
      { label: '3M', value: '3m' },
      { label: '1Y', value: '1y' },
    ],
  },
};

/**
 * With default value selected
 */
export const WithDefaultValue: Story = {
  args: {
    options: [
      { label: 'Overview', value: 'overview' },
      { label: 'Details', value: 'details' },
      { label: 'History', value: 'history' },
    ],
    defaultValue: 'details',
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    
    expect(canvas.getByText('Overview')).toBeInTheDocument();
    expect(canvas.getByText('Details')).toBeInTheDocument();
    expect(canvas.getByText('History')).toBeInTheDocument();
    
    const detailsButton = canvas.getByRole('button', { name: 'Details' });
    expect(detailsButton).toHaveAttribute('aria-pressed', 'true');
    
    const overviewButton = canvas.getByRole('button', { name: 'Overview' });
    expect(overviewButton).toHaveAttribute('aria-pressed', 'false');
  },
};

/**
 * Long labels
 */
export const LongLabels: Story = {
  args: {
    options: [
      { label: 'Dashboard', value: 'dashboard' },
      { label: 'Analytics', value: 'analytics' },
      { label: 'Settings', value: 'settings' },
    ],
  },
};

/**
 * Short labels (icons or abbreviations)
 */
export const ShortLabels: Story = {
  args: {
    options: [
      { label: 'S', value: 'small' },
      { label: 'M', value: 'medium' },
      { label: 'L', value: 'large' },
      { label: 'XL', value: 'xlarge' },
    ],
  },
};

const InteractiveComponent = () => {
  const [value, setValue] = useState('week');
  
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', alignItems: 'center' }}>
      <SegmentedControl
        options={[
          { label: 'Day', value: 'day' },
          { label: 'Week', value: 'week' },
          { label: 'Month', value: 'month' },
        ]}
        value={value}
        onChange={setValue}
      />
      <div style={{ fontSize: '14px', color: colors.text.secondary }}>
        Selected: <strong>{value}</strong>
      </div>
      <button
        style={{
          padding: '8px 16px',
          fontSize: '12px',
          border: `1px solid ${colors.neutral.gray300}`,
          borderRadius: '4px',
          cursor: 'pointer',
        }}
        onClick={() => setValue('day')}
      >
        Reset to Day
      </button>
    </div>
  );
};

/**
 * Controlled example - external state management
 */
export const Controlled: Story = {
  args: {
    options: [],
  },
  render: () => <InteractiveComponent />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    
    expect(canvas.getByText('Day')).toBeInTheDocument();
    expect(canvas.getByText('Week')).toBeInTheDocument();
    expect(canvas.getByText('Month')).toBeInTheDocument();
    
    expect(canvas.getByText('Selected:')).toBeInTheDocument();
    expect(canvas.getByText('week')).toBeInTheDocument();
    
    const weekButton = canvas.getByRole('button', { name: 'Week' });
    expect(weekButton).toHaveAttribute('aria-pressed', 'true');
    
    const dayButton = canvas.getByRole('button', { name: 'Day' });
    await userEvent.click(dayButton);
    
    await waitFor(() => {
      expect(canvas.getByText('day')).toBeInTheDocument();
    });
    
    expect(dayButton).toHaveAttribute('aria-pressed', 'true');
    
    const resetButton = canvas.getByRole('button', { name: 'Reset to Day' });
    await userEvent.click(resetButton);
    
    await waitFor(() => {
      expect(canvas.getByText('day')).toBeInTheDocument();
    });
  },
};

const DashboardDemoComponent = () => {
  const [selected, setSelected] = useState('overview');
  
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px', alignItems: 'center' }}>
      <div style={{ textAlign: 'center' }}>
        <h3 style={{ marginBottom: '8px' }}>Dashboard Navigation</h3>
        <p style={{ fontSize: '0.875rem', color: colors.text.secondary }}>Interactive demo showing state management</p>
      </div>
      
      <SegmentedControl
        options={[
          { label: 'Overview', value: 'overview' },
          { label: 'Analytics', value: 'analytics' },
          { label: 'Reports', value: 'reports' },
          { label: 'Settings', value: 'settings' },
        ]}
        value={selected}
        onChange={setSelected}
      />
      
      <div style={{
        padding: '24px',
        border: `1px solid ${colors.neutral.gray300}`,
        borderRadius: '8px',
        minWidth: '300px',
        textAlign: 'center',
      }}>
        <div style={{ fontSize: '0.875rem', color: colors.text.secondary, marginBottom: '8px' }}>
          Current Section
        </div>
        <div style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>
          {selected.charAt(0).toUpperCase() + selected.slice(1)}
        </div>
      </div>
    </div>
  );
};

export const DashboardDemo: Story = {
  args: {
    options: [],
  },
  render: () => <DashboardDemoComponent />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    
    expect(canvas.getByText('Dashboard Navigation')).toBeInTheDocument();
    expect(canvas.getByText('Analytics')).toBeInTheDocument();
    expect(canvas.getByText('Reports')).toBeInTheDocument();
    expect(canvas.getByText('Settings')).toBeInTheDocument();
    
    const overviewButton = canvas.getByRole('button', { name: 'Overview' });
    expect(overviewButton).toHaveAttribute('aria-pressed', 'true');
    
    expect(canvas.getByText('Current Section')).toBeInTheDocument();
    
    const analyticsButton = canvas.getByRole('button', { name: 'Analytics' });
    await userEvent.click(analyticsButton);
    
    expect(analyticsButton).toHaveAttribute('aria-pressed', 'true');
  },
};

/**
 * Time period selector
 */
export const TimePeriod: Story = {
  args: {
    options: [
      { label: '1H', value: '1h' },
      { label: '1D', value: '1d' },
      { label: '1W', value: '1w' },
      { label: '1M', value: '1m' },
      { label: 'ALL', value: 'all' },
    ],
    defaultValue: '1d',
  },
};

/**
 * View mode selector
 */
export const ViewMode: Story = {
  args: {
    options: [
      { label: 'Cards', value: 'cards' },
      { label: 'List', value: 'list' },
      { label: 'Table', value: 'table' },
    ],
    defaultValue: 'cards',
  },
};

/**
 * Chart type selector
 */
export const ChartType: Story = {
  args: {
    options: [
      { label: 'Line', value: 'line' },
      { label: 'Bar', value: 'bar' },
      { label: 'Area', value: 'area' },
      { label: 'Pie', value: 'pie' },
    ],
    defaultValue: 'line',
  },
};
