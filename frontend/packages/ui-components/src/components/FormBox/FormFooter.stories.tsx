import type { Meta, StoryObj } from '@storybook/react';
import FormFooter from './FormFooter';

/**
 * FormFooter is a standardized footer component used throughout the project for form layouts.
 */
const meta = {
  title: 'Form/Footer',
  component: FormFooter,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component:
          'A reusable form footer component with consistent padding and vertical spacing with justify-content: space-between for optimal form layout.',
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    footer: {
      control: 'text',
      description: 'Footer text to be rendered inside the FormFooter',
    },
    link: {
      control: 'text',
      description: 'Link text to be rendered inside the FormFooter',
      defaultValue: 'Contact us',
      type: 'string',
    },
  },
} satisfies Meta<typeof FormFooter>;

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * Default FormFooter with simple text content
 */
export const Default: Story = {
  args: {
    footer: 'Have issues?',
    link: 'Contact us at support@core3.com',
  },
};
