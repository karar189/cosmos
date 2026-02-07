import type { Meta, StoryObj } from '@storybook/react';
import { expect, within, userEvent } from '@storybook/test';
import Radio from './Radio';

const meta = {
  title: 'Components/Radio',
  component: Radio,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component:
          'An accessible radio button component for selecting a single option from a set.',
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    size: {
      control: 'select',
      options: ['sm', 'md'],
      description: 'Visual size of the radio control',
      table: {
        defaultValue: { summary: 'md' },
      },
    },
    disabled: {
      control: 'boolean',
      description: 'Whether the radio is disabled',
      table: {
        defaultValue: { summary: 'false' },
      },
    },
    name: {
      control: 'text',
      description: 'Name attribute for grouping radios',
    },
    value: {
      control: 'text',
      description: 'Value associated with this radio',
    },
    defaultChecked: {
      control: 'boolean',
      description: 'Initial checked state (uncontrolled)',
    },
  },
} satisfies Meta<typeof Radio>;

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * Default radio
 */
export const Default: Story = {
  args: {
    name: 'example',
    value: 'a',
  },

  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    
    const radio = canvas.getByRole('radio') as HTMLInputElement;
    expect(radio).toBeInTheDocument();
    expect(radio).toHaveAttribute('type', 'radio');
    expect(radio).toHaveAttribute('name', 'example');
    expect(radio).toHaveAttribute('value', 'a');
    expect(radio).not.toBeChecked();

    await userEvent.click(radio);
    expect(radio).toBeChecked();
  },
};

/**
 * Initially checked (uncontrolled)
 */
export const Checked: Story = {
  args: {
    name: 'checked-demo',
    value: 'yes',
    defaultChecked: true,
  },

  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    
    const radio = canvas.getByRole('radio') as HTMLInputElement;
    expect(radio).toBeInTheDocument();
    expect(radio).toBeChecked();
    expect(radio).toHaveAttribute('name', 'checked-demo');
    expect(radio).toHaveAttribute('value', 'yes');
  },
};
