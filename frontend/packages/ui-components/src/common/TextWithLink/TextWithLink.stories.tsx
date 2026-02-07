import type { Meta, StoryObj } from '@storybook/react';
import React from 'react';
import TextWithLink from './TextWIthLink';

/**
 * Header component provides a header with a title and subtitle.
 */
const meta = {
  title: 'Common/TextWithLink',
  component: TextWithLink,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: 'TextWithLink component for a text with a link.',
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    text: {
      control: 'text',
      description: 'Text',
    },
    linkLabel: {
      control: false,
      description: 'Link',
    },
    linkUrl: {
      control: 'text',
      description: 'Link URL',
    },
  },
} satisfies Meta<typeof TextWithLink>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    text: "Don't have an account?",
    linkLabel: 'Sign up',
    linkUrl: 'https://www.google.com',
  },
  render: (args) => <TextWithLink {...args} />,
};
