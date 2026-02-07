import type { Meta, StoryObj } from '@storybook/react';
import { expect, within } from '@storybook/test';
import LoadingSpinner from './LoadingSpinner';

/**
 * LoadingSpinner is a circular progress indicator component.
 * It displays an indeterminate spinner for loading states.
 */
const meta = {
  title: 'Components/LoadingSpinner',
  component: LoadingSpinner,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: 'A circular indeterminate progress indicator for loading states. Uses MUI CircularProgress with custom black styling.',
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    size: {
      control: 'number',
      description: 'Size of the loading spinner in pixels',
      table: {
        defaultValue: { summary: '40' },
      },
    },
  },
} satisfies Meta<typeof LoadingSpinner>;

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * Default loading spinner
 */
export const Default: Story = {
  args: {},

  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    const spinner = canvas.getByLabelText('Loading');
    expect(spinner).toBeInTheDocument();

    const progressbar = canvas.getByRole('progressbar');
    expect(progressbar).toBeInTheDocument();
  },
};

/**
 * Small loading spinner
 */
export const Small: Story = {
  args: {
    size: 20,
  },

  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    
    const spinner = canvas.getByLabelText('Loading');
    expect(spinner).toBeInTheDocument();

    const progressbar = canvas.getByRole('progressbar');
    expect(progressbar).toBeInTheDocument();

    const svg = spinner.querySelector('svg');
    expect(svg).toBeInTheDocument();
  },
};

/**
 * Medium loading spinner
 */
export const Medium: Story = {
  args: {
    size: 40,
  },

  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    
    const spinner = canvas.getByLabelText('Loading');
    expect(spinner).toBeInTheDocument();
    
    const progressbar = canvas.getByRole('progressbar');
    expect(progressbar).toBeInTheDocument();
    
    const svg = spinner.querySelector('svg');
    expect(svg).toBeInTheDocument();
  },
};

/**
 * Large loading spinner
 */
export const Large: Story = {
  args: {
    size: 60,
  },

  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    
    const spinner = canvas.getByLabelText('Loading');
    expect(spinner).toBeInTheDocument();
    
    const progressbar = canvas.getByRole('progressbar');
    expect(progressbar).toBeInTheDocument();

    const svg = spinner.querySelector('svg');
    expect(svg).toBeInTheDocument();
  },
};