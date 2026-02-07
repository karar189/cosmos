import type { Meta, StoryObj } from '@storybook/react';
import React from 'react';
import SectionHeader from './SectionHeader';
import SectionRank from './SectionRank';

/**
 * SectionHeader provides a structured header for sections with optional icon, title, and content.
 *
 * Use it to create consistent section headers throughout your application.
 */
const meta = {
  title: 'Components/Section/SectionHeader',
  component: SectionHeader,
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component:
          'SectionHeader component provides a structured header for sections with optional icon, title, and content area. The content area can be used to render additional components like SectionRank.',
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
      control: false,
      description: 'Optional custom icon element (overrides iconName if provided)',
    },
    iconName: {
      control: 'select',
      options: ['info'],
      description: 'Icon name from the icon registry (used if icon is not provided)',
    },
    content: {
      control: false,
      description: 'Optional content to render below the title',
    },
  },
} satisfies Meta<typeof SectionHeader>;

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * Basic header with title only
 */
export const Default: Story = {
  args: {
    title: 'Security',
  },
};

/**
 * Header with icon and title (using iconName)
 */
export const WithIcon: Story = {
  args: {
    iconName: 'info',
    title: 'Information',
  },
};

/**
 * Header with custom icon element
 */
export const WithCustomIcon: Story = {
  args: {
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
        <path
          d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M12 8V12"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M12 16H12.01"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    ),
    title: 'Custom Icon',
  },
};

/**
 * Header with title and content (SectionRank)
 */
export const WithContent: Story = {
  args: {
    title: 'Security',
    content: (
      <SectionRank value={45} maxValue={100} description="average across similar projects" />
    ),
  },
};

/**
 * Header with icon, title, and content
 */
export const WithIconAndContent: Story = {
  args: {
    iconName: 'info',
    title: 'Compliance',
    content: <SectionRank value={82} maxValue={100} description="compliance score" />,
  },
};

/**
 * Header with custom content (not SectionRank)
 */
export const WithCustomContent: Story = {
  args: {
    title: 'Details',
    content: (
      <div>
        <p>This is custom content that can be anything you want.</p>
        <p>It could be text, buttons, or any other React component.</p>
      </div>
    ),
  },
};
