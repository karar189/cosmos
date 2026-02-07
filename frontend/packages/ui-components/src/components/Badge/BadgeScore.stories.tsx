import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { expect, within } from '@storybook/test';
import BadgeScore from './BadgeScore';

/**
 * BadgeScore is a pill-shaped component used to display values with optional sub-values.
 * Supports multiple colors and sizes with automatic opacity handling.
 */
const meta = {
  title: 'Components/Badge/BadgeScore',
  component: BadgeScore,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component:
          'A flexible pill-shaped badge component for displaying values with optional sub-values. Automatically handles opacity for backgrounds based on whether a sub-value is present.',
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    value: {
      control: 'text',
      description: 'Main value to display (string or number)',
    },
    subValue: {
      control: 'text',
      description: 'Optional sub-value to display (string or number)',
    },
    color: {
      control: 'select',
      options: ['red', 'orange', 'yellow', 'green', 'gray'],
      description: 'Color variant of the badge',
    },
    size: {
      control: 'select',
      options: ['small', 'medium'],
      description: 'Size variant of the badge',
      table: {
        defaultValue: { summary: 'medium' },
      },
    },
  },
} satisfies Meta<typeof BadgeScore>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    value: 15,
    color: 'red',
    size: 'medium',
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    
    const value = canvas.getByText('15');
    expect(value).toBeInTheDocument();
    expect(value).toBeVisible();
  },
};

export const WithSubValue: Story = {
  args: {
    value: 89,
    subValue: 'AAA',
    color: 'green',
    size: 'medium',
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    
    const value = canvas.getByText('89');
    expect(value).toBeInTheDocument();
    expect(value).toBeVisible();
    
    const subValue = canvas.getByText('AAA');
    expect(subValue).toBeInTheDocument();
    expect(subValue).toBeVisible();
  },
};

export const AllColors: Story = {
  args: {
    value: 15,
    color: 'red',
  },
  render: () => (
    <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
      <BadgeScore value={15} color="red" />
      <BadgeScore value={15} color="orange" />
      <BadgeScore value={15} color="yellow" />
      <BadgeScore value={15} color="green" />
      <BadgeScore value={15} color="gray" />
    </div>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    
    // Check that all 5 badges with value 15 are displayed
    const values = canvas.getAllByText('15');
    expect(values).toHaveLength(5);
    
    values.forEach((value) => {
      expect(value).toBeVisible();
    });
  },
};

export const AllSizes: Story = {
  args: {
    value: 15,
    color: 'red',
    size: 'medium',
  },
  render: () => (
    <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
      <BadgeScore value={15} color="red" size="small" />
      <BadgeScore value={15} color="red" size="medium" />
    </div>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    
    // Check that both badges with value 15 are displayed (small and medium sizes)
    const values = canvas.getAllByText('15');
    expect(values).toHaveLength(2);
    
    values.forEach((value) => {
      expect(value).toBeVisible();
    });
  },
};