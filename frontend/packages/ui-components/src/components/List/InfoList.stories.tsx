import type { Meta, StoryObj } from '@storybook/react';
import InfoList from './InfoList';

/**
 * InfoList displays a grid of InfoListItems for presenting methodology or features.
 */
const meta = {
  title: 'Components/InfoList',
  component: InfoList,
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component: 'A responsive grid container for displaying multiple InfoListItems. Adapts from single column on mobile to multiple columns on larger screens.',
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    items: {
      description: 'Array of items to display in the list',
    },
  },
} satisfies Meta<typeof InfoList>;

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * Single item list
 */
export const SingleItem: Story = {
  args: {
    items: [
      {
        count: '01',
        title: 'Collect',
        description:
          'CORE3 aggregates verified intelligence across nine categories - from code security and financial telemetry to operational resilience.',
      },
    ],
  },
};

/**
 * Two items list
 */
export const TwoItems: Story = {
  args: {
    items: [
      {
        count: '01',
        title: 'Collect',
        description:
          'CORE3 aggregates verified intelligence across nine categories - from code security and financial telemetry to operational resilience.',
      },
      {
        count: '02',
        title: 'Model PoL',
        description:
          'The Probability of Loss (PoL) model processes over 128+ data layers to quantify the likelihood of financial loss.',
      },
    ],
  },
};

/**
 * Complete methodology list (4 items)
 */
export const MethodologySteps: Story = {
  args: {
    items: [
      {
        count: '01',
        title: 'Collect',
        description:
          'CORE3 aggregates verified intelligence across nine categories - from code security and financial telemetry to operational resilience and behavioral reputation. Data flows from autonomous scanners, analytics modules, and project self-reporting.',
      },
      {
        count: '02',
        title: 'Model PoL',
        description:
          'The Probability of Loss (PoL) model processes over 128+ data layers to quantify the likelihood of financial loss. AI-driven analytics compare security, financial, operational, reputational and dependency metrics.',
      },
      {
        count: '03',
        title: 'Publish & Alert',
        description:
          'Every project receives a public profile with historical PoL, allowing users to trace improvement and detect early risk signals. CORE3 displays major PoL shifts through dedicated dashboards.',
      },
      {
        count: '04',
        title: 'Improve',
        description:
          'PoL is not a verdict - it\'s a roadmap. Projects receive actionable insights and tailored guidance to reduce their risk exposure. Each verified improvement instantly reflects in PoL.',
      },
    ],
  },
};

/**
 * Empty list
 */
export const EmptyList: Story = {
  args: {
    items: [],
  },
};

