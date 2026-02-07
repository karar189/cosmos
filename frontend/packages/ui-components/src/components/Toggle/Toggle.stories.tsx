import type { Meta, StoryObj } from '@storybook/react';
import { expect, within, userEvent, waitFor } from '@storybook/test';
import React, { useState } from 'react';
import Toggle, { type ToggleOption } from './Toggle';

const meta = {
  title: 'Components/Toggle',
  component: Toggle,
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component:
          'A reusable toggle component for selecting between options. Supports both ToggleButtonGroup and Button styles. Can be used for chart type selection, time range selection, or any other toggle use case.',
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    value: {
      description: 'Current selected value',
      control: 'text',
    },
    onChange: {
      description: 'Callback when value changes',
      action: 'changed',
    },
    options: {
      description: 'Array of toggle options',
      control: 'object',
    },
    useButtonStyle: {
      description: 'Use button style instead of toggle button style',
      control: 'boolean',
      table: {
        defaultValue: { summary: 'false' },
      },
    },
    ariaLabel: {
      description: 'Aria label for the toggle group',
      control: 'text',
    },
  },
} satisfies Meta<typeof Toggle>;

export default meta;
type Story = StoryObj<typeof meta>;

type RenderStory = Omit<Story, 'args'> & {
  render: () => React.ReactElement;
};

const chartTypeOptions: ToggleOption<'price' | 'marketCap'>[] = [
  { value: 'price', label: 'Price Chart', ariaLabel: 'price chart' },
  { value: 'marketCap', label: 'Market Cap Chart', ariaLabel: 'market cap chart' },
];

const timeRangeOptions: ToggleOption<'1D' | '7D' | '1M' | '1Y' | 'All'>[] = [
  { value: '1D', label: '1D' },
  { value: '7D', label: '7D' },
  { value: '1M', label: '1M' },
  { value: '1Y', label: '1Y' },
  { value: 'All', label: 'All' },
];

const ToggleWithState = ({
  initialValue,
  options,
  useButtonStyle = false,
  ariaLabel,
}: {
  initialValue: string;
  options: ToggleOption<string>[];
  useButtonStyle?: boolean;
  ariaLabel?: string;
}) => {
  const [value, setValue] = useState(initialValue);
  return (
    <Toggle
      value={value}
      onChange={setValue}
      options={options}
      useButtonStyle={useButtonStyle}
      ariaLabel={ariaLabel}
    />
  );
};

export const Default: RenderStory = {
  render: () => (
    <ToggleWithState
      initialValue="price"
      options={chartTypeOptions}
      ariaLabel="Chart type"
    />
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    
    const priceButton = canvas.getByRole('button', { name: /price chart/i });
    const marketCapButton = canvas.getByRole('button', { name: /market cap chart/i });
    
    expect(priceButton).toBeInTheDocument();
    expect(marketCapButton).toBeInTheDocument();
    
    expect(priceButton).toHaveAttribute('aria-pressed', 'true');
    expect(marketCapButton).toHaveAttribute('aria-pressed', 'false');
    
    await userEvent.click(marketCapButton);
    
    await waitFor(() => {
      expect(marketCapButton).toHaveAttribute('aria-pressed', 'true');
      expect(priceButton).toHaveAttribute('aria-pressed', 'false');
    });
    
    await userEvent.click(priceButton);
    
    await waitFor(() => {
      expect(priceButton).toHaveAttribute('aria-pressed', 'true');
      expect(marketCapButton).toHaveAttribute('aria-pressed', 'false');
    });
  },
};

export const ButtonStyle: RenderStory = {
  render: () => (
    <ToggleWithState
      initialValue="7D"
      options={timeRangeOptions}
      useButtonStyle={true}
    />
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    
    const button1D = canvas.getByRole('button', { name: '1D' });
    const button7D = canvas.getByRole('button', { name: '7D' });
    const button1M = canvas.getByRole('button', { name: '1M' });
    const button1Y = canvas.getByRole('button', { name: '1Y' });
    const buttonAll = canvas.getByRole('button', { name: 'All' });
    
    expect(button1D).toBeInTheDocument();
    expect(button7D).toBeInTheDocument();
    expect(button1M).toBeInTheDocument();
    expect(button1Y).toBeInTheDocument();
    expect(buttonAll).toBeInTheDocument();
    
    await userEvent.click(button1M);
    
    await waitFor(() => {
      expect(button1M).toBeVisible();
    });
    
    await userEvent.click(buttonAll);
    
    await waitFor(() => {
      expect(buttonAll).toBeVisible();
    });
  },
};

export const ChartTypeToggle: RenderStory = {
  render: () => (
    <ToggleWithState
      initialValue="price"
      options={chartTypeOptions}
      ariaLabel="Chart type"
    />
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    
    const priceButton = canvas.getByRole('button', { name: /price chart/i });
    const marketCapButton = canvas.getByRole('button', { name: /market cap chart/i });
    
    expect(priceButton).toHaveAttribute('aria-pressed', 'true');
    
    await userEvent.click(marketCapButton);
    
    await waitFor(() => {
      expect(marketCapButton).toHaveAttribute('aria-pressed', 'true');
    });
  },
};

export const TimeRangeSelector: RenderStory = {
  render: () => (
    <ToggleWithState
      initialValue="1Y"
      options={timeRangeOptions}
      useButtonStyle={true}
    />
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    
    const button1Y = canvas.getByRole('button', { name: '1Y' });
    const button1D = canvas.getByRole('button', { name: '1D' });
    
    expect(button1Y).toBeVisible();
    
    await userEvent.click(button1D);
    
    await waitFor(() => {
      expect(button1D).toBeVisible();
    });
  },
};

export const CustomOptions: RenderStory = {
  render: () => {
    const customOptions: ToggleOption<'option1' | 'option2' | 'option3'>[] = [
      { value: 'option1', label: 'Option 1', ariaLabel: 'First option' },
      { value: 'option2', label: 'Option 2', ariaLabel: 'Second option' },
      { value: 'option3', label: 'Option 3', ariaLabel: 'Third option' },
    ];
    return (
      <ToggleWithState
        initialValue="option1"
        options={customOptions}
        ariaLabel="Custom options"
      />
    );
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    
    const option1 = canvas.getByRole('button', { name: /first option/i });
    const option2 = canvas.getByRole('button', { name: /second option/i });
    const option3 = canvas.getByRole('button', { name: /third option/i });
    
    expect(option1).toBeInTheDocument();
    expect(option2).toBeInTheDocument();
    expect(option3).toBeInTheDocument();
    
    expect(option1).toHaveAttribute('aria-pressed', 'true');
    
    await userEvent.click(option2);
    
    await waitFor(() => {
      expect(option2).toHaveAttribute('aria-pressed', 'true');
      expect(option1).toHaveAttribute('aria-pressed', 'false');
    });
    
    await userEvent.click(option3);
    
    await waitFor(() => {
      expect(option3).toHaveAttribute('aria-pressed', 'true');
      expect(option2).toHaveAttribute('aria-pressed', 'false');
    });
  },
};

export const MultipleToggles: RenderStory = {
  render: () => (
    <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
      <ToggleWithState
        initialValue="price"
        options={chartTypeOptions}
        ariaLabel="Chart type"
      />
      <ToggleWithState
        initialValue="7D"
        options={timeRangeOptions}
        useButtonStyle={true}
      />
    </div>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    
    const priceButton = canvas.getByRole('button', { name: /price chart/i });
    const button7D = canvas.getByRole('button', { name: '7D' });
    const button1M = canvas.getByRole('button', { name: '1M' });
    
    expect(priceButton).toHaveAttribute('aria-pressed', 'true');
    expect(button7D).toBeVisible();
    
    await userEvent.click(button1M);
    
    await waitFor(() => {
      expect(button1M).toBeVisible();
    });
    
    expect(priceButton).toHaveAttribute('aria-pressed', 'true');
  },
};