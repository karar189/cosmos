import type { Meta, StoryObj } from '@storybook/react';
import FormHeader from './FormBoxHeader';

/**
 * FormHeader is a standardized header component for form layouts.
 * It displays a back navigation on the left (optional) and user email with avatar on the right.
 */
const meta = {
  title: 'Form/Header',
  component: FormHeader,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component:
          'A reusable form header component with optional back navigation and user email display with avatar.',
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    email: {
      control: 'text',
      description: 'User email to display in the header',
    },
    backText: {
      control: 'text',
      description:
        'Optional back navigation text (e.g., "Change account type")',
    },
    onBackClick: {
      action: 'back clicked',
      description: 'Callback function when back button is clicked',
    },
  },
} satisfies Meta<typeof FormHeader>;

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * Default FormHeader with email and back navigation
 */
export const Default: Story = {
  args: {
    email: 'johndoe@uniswap.org',
    backText: 'Change account type',
  },
};

/**
 * FormHeader with only email (no back navigation)
 */
export const WithoutBackNavigation: Story = {
  args: {
    email: 'johndoe@uniswap.org',
  },
};

/**
 * FormHeader with different back text
 */
export const WithWorkspaceBack: Story = {
  args: {
    email: 'johndoe@uniswap.org',
    backText: 'Change workspace type',
  },
};
