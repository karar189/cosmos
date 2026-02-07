import type { Meta, StoryObj } from '@storybook/react';
import { expect, within, waitFor } from '@storybook/test';
import Strings from './Strings';

const meta = {
  title: 'Components/Strings',
  component: Strings,
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component:
          'An animated bezier strings visualization component used for decorative backgrounds. Features wave motion, interactive dots with labels, and hover effects.',
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    defaultCenterY: {
      control: { type: 'range', min: 0, max: 1, step: 0.1 },
      description: 'Default vertical center position as a fraction [0, 1]',
      table: {
        defaultValue: { summary: '0.5' },
      },
    },
    defaultCenterX: {
      control: { type: 'range', min: 0, max: 1, step: 0.1 },
      description: 'Default horizontal center position as a fraction [0, 1]',
      table: {
        defaultValue: { summary: '0.5' },
      },
    },
    defaultCenterOffset: {
      control: { type: 'number' },
      description: 'Vertical offset for the center position',
      table: {
        defaultValue: { summary: '0' },
      },
    },
    stringCount: {
      control: { type: 'number', min: 10, max: 60, step: 1 },
      description: 'Number of bezier strings to render',
      table: {
        defaultValue: { summary: '60' },
      },
    },
    className: {
      control: 'text',
      description: 'Additional CSS class name',
    },
  },
} satisfies Meta<typeof Strings>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {},
  play: async ({ canvasElement }) => {
    const canvas = canvasElement.querySelector('canvas');
    expect(canvas).toBeInTheDocument();
    expect(canvas).toBeVisible();
    
    await waitFor(() => {
      expect(canvas).toHaveAttribute('width');
      expect(canvas).toHaveAttribute('height');
    });
    
    const width = canvas?.getAttribute('width');
    const height = canvas?.getAttribute('height');
    expect(width).toBeTruthy();
    expect(height).toBeTruthy();
  },
};

export const NoLabelsAndDots: Story = {
  args: {
    config: {
      labels: {
        enabled: false,
      },
      dots: {
        enabled: false,
      },
    },
  },
  play: async ({ canvasElement }) => {
    const canvas = canvasElement.querySelector('canvas');
    expect(canvas).toBeInTheDocument();
    expect(canvas).toBeVisible();
    
    await waitFor(() => {
      expect(canvas).toHaveAttribute('width');
      expect(canvas).toHaveAttribute('height');
    });
    
    const width = canvas?.getAttribute('width');
    const height = canvas?.getAttribute('height');
    expect(width).toBeTruthy();
    expect(height).toBeTruthy();
  },
};