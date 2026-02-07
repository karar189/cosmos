import type { Meta, StoryObj } from '@storybook/react';
import { expect, within, userEvent } from '@storybook/test';
import Input from './Input';

/**
 * Input component provides a text input with optional search icon.
 */
const meta = {
  title: 'Components/Input',
  component: Input,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: 'Input component for text entry with search icon support.',
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    showSearchIcon: {
      control: 'boolean',
      description: 'Show search icon',
      defaultValue: false,
    },
    variant: {
      control: 'select',
      options: ['default', 'search'],
      description: 'Input variant',
      defaultValue: 'default',
    },
    placeholder: {
      control: 'text',
      description: 'Placeholder text',
    },
    disabled: {
      control: 'boolean',
      description: 'Disabled state',
    },
  },
} satisfies Meta<typeof Input>;

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * Default input with basic text entry
 */
export const Default: Story = {
  args: {
    placeholder: 'Enter text...',
  },
  /**
   * Interaction test:
   * - Renders with correct placeholder
   * - Can type text into the input
   * - Input value updates correctly
   */
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const input = canvas.getByPlaceholderText('Enter text...') as HTMLInputElement;

    expect(input).toBeInTheDocument();
    expect(input).toHaveAttribute('placeholder', 'Enter text...');
    expect(input.value).toBe('');

    await userEvent.type(input, 'Hello World');

    expect(input.value).toBe('Hello World');
  },
};

/**
 * Input with search icon
 */
export const WithSearchIcon: Story = {
  args: {
    placeholder: 'Search projects and exchanges',
    showSearchIcon: true,
    variant: 'search',
  },
  /**
   * Interaction test:
   * - Renders search icon
   * - Can type search text
   * - Search icon remains visible while typing
   */
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const input = canvas.getByPlaceholderText('Search projects and exchanges') as HTMLInputElement;

    expect(input).toBeInTheDocument();

    const searchIcon = canvasElement.querySelector('svg[viewBox="0 0 16 16"]');
    expect(searchIcon).toBeInTheDocument();

    await userEvent.type(input, 'project search');

    expect(input.value).toBe('project search');
    expect(searchIcon).toBeInTheDocument();
  },
};

/**
 * Disabled input that cannot be edited
 */
export const Disabled: Story = {
  args: {
    placeholder: 'Disabled input',
    disabled: true,
  },
  /**
   * Interaction test:
   * - Renders as disabled
   * - Cannot type text
   * - Maintains disabled state
   */
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const input = canvas.getByPlaceholderText('Disabled input') as HTMLInputElement;

    expect(input).toBeInTheDocument();
    expect(input).toBeDisabled();
    expect(input.value).toBe('');

    await userEvent.type(input, 'This should not appear');

    expect(input.value).toBe('');
  },
};