import type { Meta, StoryObj } from '@storybook/react';
import { expect, within } from '@storybook/test';
import CardHeader from './CardHeader';

/**
 * CardHeader provides a structured header for cards with optional icon, title, and tooltip.
 *
 * Use it to create consistent card headers throughout your application.
 */
const meta = {
  title: 'Components/Card/CardHeader',
  component: CardHeader,
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component:
          'CardHeader component provides a structured header for cards with optional icon, title, and tooltip. The tooltip icon appears automatically when a tooltip string is provided.',
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    title: {
      control: 'text',
      description: 'Header title text',
    },
    icon: {
      control: 'text',
      description: 'Optional icon name (IconName)',
    },
    tooltip: {
      control: 'text',
      description: 'Optional tooltip text. When provided, a tooltip icon will be shown.',
    },
  },
} satisfies Meta<typeof CardHeader>;

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * Basic header with title only
 */
export const Default: Story = {
  args: {
    title: 'Card Title',
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    
    const title = canvas.getByRole('heading', { name: 'Card Title' });
    expect(title).toBeInTheDocument();
    expect(title).toBeVisible();
  },
};

/**
 * Header with icon and title (using Icon component)
 */
export const WithIcon: Story = {
  args: {
    icon: 'info',
    title: 'Information',
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    
    const title = canvas.getByRole('heading', { name: 'Information' });
    expect(title).toBeInTheDocument();
    expect(title).toBeVisible();
    
    // Check that icon is present (Icon component renders an SVG)
    const svg = canvasElement.querySelector('svg');
    expect(svg).toBeInTheDocument();
  },
};

/**
 * Header with title and tooltip
 */
export const WithTooltip: Story = {
  args: {
    title: 'Security',
    tooltip:
      'This section displays security metrics and compliance information for your organization.',
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    
    const title = canvas.getByRole('heading', { name: 'Security' });
    expect(title).toBeInTheDocument();
    expect(title).toBeVisible();
    
    // Check that tooltip icon is present (Tooltip component renders an SVG)
    const svg = canvasElement.querySelector('svg');
    expect(svg).toBeInTheDocument();
  },
};

/**
 * Header with icon, title, and tooltip
 */
export const WithIconAndTooltip: Story = {
  args: {
    icon: 'info',
    title: 'Compliance',
    tooltip: 'Compliance score based on industry standards and regulatory requirements.',
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    
    const title = canvas.getByRole('heading', { name: 'Compliance' });
    expect(title).toBeInTheDocument();
    expect(title).toBeVisible();
    
    // Check that icons are present (both icon and tooltip icon render SVGs)
    const svgs = canvasElement.querySelectorAll('svg');
    expect(svgs.length).toBeGreaterThan(0);
  },
};

/**
 * Header with long tooltip text
 */
export const LongTooltip: Story = {
  args: {
    title: 'Data Protection',
    tooltip:
      'This metric measures how well your organization protects sensitive data. It includes encryption standards, access controls, and data retention policies.',
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    
    const title = canvas.getByRole('heading', { name: 'Data Protection' });
    expect(title).toBeInTheDocument();
    expect(title).toBeVisible();
    
    // Check that tooltip icon is present
    const svg = canvasElement.querySelector('svg');
    expect(svg).toBeInTheDocument();
  },
};
