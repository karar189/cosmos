import type { Meta, StoryObj } from '@storybook/react';
import React from 'react';
import FormHeader from './FormHeader';

/**
 * Header component provides a header with a title and subtitle.
 */
const meta = {
  title: 'Common/FormHeader',
  component: FormHeader,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component:
          'FormHeader component for a form header with a title and subtitle.',
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    title: {
      control: 'text',
      description: 'Title',
    },
    children: {
      control: false,
      description: 'Children',
    },
  },
} satisfies Meta<typeof FormHeader>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    title: 'Reset Password',
  },
  render: (args) => (
    <FormHeader {...args}>
      <div>
        Enter your
        <span style={{ fontWeight: 'bold' }}>email</span> to reset your password
      </div>
    </FormHeader>
  ),
};

export const WithoutChildren: Story = {
  args: {
    title: 'Title',
  },
  render: (args) => <FormHeader {...args} />,
};
