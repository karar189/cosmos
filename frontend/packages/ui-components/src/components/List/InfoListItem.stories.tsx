import type { Meta, StoryObj } from '@storybook/react';
import InfoListItem from './InfoListItem';

/**
 * InfoListItem displays a single item in an information list with a count, title, and description.
 */
const meta = {
  title: 'Components/InfoListItem',
  component: InfoListItem,
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component: 'A list item component displaying numbered information with title and description. Used in methodology and feature sections.',
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    count: {
      control: 'text',
      description: 'Numeric or text count/identifier for the item',
    },
    title: {
      control: 'text',
      description: 'Title of the info item',
    },
    description: {
      control: 'text',
      description: 'Detailed description of the item',
    },
  },
  decorators: [
    (Story) => (
      <div style={{ maxWidth: '600px' }}>
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof InfoListItem>;

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * Default info list item
 */
export const Default: Story = {
  args: {
    count: '01',
    title: 'Collect',
    description:
      'CORE3 aggregates verified intelligence across nine categories - from code security and financial telemetry to operational resilience and behavioral reputation.',
  },
};

/**
 * Second item in a sequence
 */
export const SecondItem: Story = {
  args: {
    count: '02',
    title: 'Model PoL',
    description:
      'The Probability of Loss (PoL) model processes over 128+ data layers to quantify the likelihood of financial loss.',
  },
};

/**
 * Third item in a sequence
 */
export const ThirdItem: Story = {
  args: {
    count: '03',
    title: 'Publish & Alert',
    description:
      'Every project receives a public profile with historical PoL, allowing users to trace improvement and detect early risk signals.',
  },
};

/**
 * Fourth item in a sequence
 */
export const FourthItem: Story = {
  args: {
    count: '04',
    title: 'Improve',
    description:
      'PoL is not a verdict - it\'s a roadmap. Projects receive actionable insights and tailored guidance to reduce their risk exposure.',
  },
};

/**
 * Item with short description
 */
export const ShortDescription: Story = {
  args: {
    count: '01',
    title: 'Quick Info',
    description: 'A brief description of the feature.',
  },
};

/**
 * Item with very long description
 */
export const LongDescription: Story = {
  args: {
    count: '05',
    title: 'Comprehensive Analysis',
    description:
      'This is an example of a very long description that might span multiple lines and paragraphs. CORE3 continuously aggregates on-chain and off-chain data, applies AI-driven analytics, and validates findings through expert review. Each project receives a dynamic PoL score that reflects real-time risk across multiple dimensions including security, financial health, operational resilience, governance structure, and market behavior. The system is designed to be transparent, verifiable, and actionable.',
  },
};

