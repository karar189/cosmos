import type { Meta, StoryObj } from '@storybook/react';
import { expect, within } from '@storybook/test';
import Core3Button from './Core3Button';

/**
 * Core3Button is the primary button component for CORE3 applications.
 * It features custom styling with a bordered pill shape design and supports animations.
 */
const meta = {
  title: 'Components/Core3Button',
  component: Core3Button,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: 'The main button component used throughout CORE3 applications. Features a distinctive pill shape with border styling and optional animations.',
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: 'select',
      options: ['primary', 'secondary'],
      description: 'Visual style variant of the button',
      table: {
        defaultValue: { summary: 'primary' },
      },
    },
    animated: {
      control: 'boolean',
      description: 'Whether the button has breathing animation',
      table: {
        defaultValue: { summary: 'false' },
      },
    },
    disabled: {
      control: 'boolean',
      description: 'Whether the button is disabled',
      table: {
        defaultValue: { summary: 'false' },
      },
    },
    fullWidth: {
      control: 'boolean',
      description: 'Whether the button takes full width',
      table: {
        defaultValue: { summary: 'false' },
      },
    },
    type: {
      control: 'select',
      options: ['button', 'submit', 'reset'],
      description: 'HTML button type',
      table: {
        defaultValue: { summary: 'button' },
      },
    },
    children: {
      control: 'text',
      description: 'Button text content',
      table: {
        defaultValue: { summary: 'JOIN THE WATCHLIST' },
      },
    },
  },
} satisfies Meta<typeof Core3Button>;

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * Primary button variant - the default style with black background
 */
export const Primary: Story = {
  args: {
    children: 'JOIN THE WATCHLIST',
    variant: 'primary',
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    
    const button = canvas.getByRole('button', { name: 'JOIN THE WATCHLIST' });
    expect(button).toBeInTheDocument();
    expect(button).toBeVisible();
    expect(button).toBeEnabled();
  },
};

/**
 * Secondary button variant - alternative styling
 */
export const Secondary: Story = {
  args: {
    children: 'LEARN MORE',
    variant: 'secondary',
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    
    const button = canvas.getByRole('button', { name: 'LEARN MORE' });
    expect(button).toBeInTheDocument();
    expect(button).toBeVisible();
    expect(button).toBeEnabled();
  },
};

/**
 * Animated button with breathing effect
 */
export const Animated: Story = {
  args: {
    children: 'JOIN THE WATCHLIST',
    animated: true,
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    
    const button = canvas.getByRole('button', { name: 'JOIN THE WATCHLIST' });
    expect(button).toBeInTheDocument();
    expect(button).toBeVisible();
    expect(button).toBeEnabled();
  },
};

/**
 * Disabled state
 */
export const Disabled: Story = {
  args: {
    children: 'SUBMIT',
    disabled: true,
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    
    const button = canvas.getByRole('button', { name: 'SUBMIT' });
    expect(button).toBeInTheDocument();
    expect(button).toBeVisible();
    expect(button).toBeDisabled();
  },
};

/**
 * Full width button
 */
export const FullWidth: Story = {
  args: {
    children: 'CONTINUE',
    fullWidth: true,
  },
  parameters: {
    layout: 'padded',
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    
    const button = canvas.getByRole('button', { name: 'CONTINUE' });
    expect(button).toBeInTheDocument();
    expect(button).toBeVisible();
    expect(button).toBeEnabled();
  },
};

/**
 * Custom text example
 */
export const CustomText: Story = {
  args: {
    children: 'GO TO HOMEPAGE',
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    
    const button = canvas.getByRole('button', { name: 'GO TO HOMEPAGE' });
    expect(button).toBeInTheDocument();
    expect(button).toBeVisible();
    expect(button).toBeEnabled();
  },
};

/**
 * Animated + Secondary combination
 */
export const AnimatedSecondary: Story = {
  args: {
    children: 'OUR METHODOLOGY',
    variant: 'secondary',
    animated: true,
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    
    const button = canvas.getByRole('button', { name: 'OUR METHODOLOGY' });
    expect(button).toBeInTheDocument();
    expect(button).toBeVisible();
    expect(button).toBeEnabled();
  },
};

/**
 * Submit button type
 */
export const SubmitButton: Story = {
  args: {
    children: 'SEND REQUEST',
    type: 'submit',
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    
    const button = canvas.getByRole('button', { name: 'SEND REQUEST' });
    expect(button).toBeInTheDocument();
    expect(button).toBeVisible();
    expect(button).toBeEnabled();
    expect(button).toHaveAttribute('type', 'submit');
  },
};

