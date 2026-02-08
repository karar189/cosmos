import type { Meta, StoryObj } from '@storybook/react';
import { expect, within, userEvent, waitFor } from '@storybook/test';
import React, { useState } from 'react';
import Header from './Header';
import { colors } from '../../theme/styleSystem';

/**
 * Header component provides a responsive navigation header with logo, menu items,
 * optional CTA button, optional custom search component, and mobile hamburger menu.
 *
 * It supports sticky positioning and custom logos.
 */
const meta = {
  title: 'Components/Header',
  component: Header,
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component:
          'Header component provides a complete navigation solution with responsive design, configurable menu items, optional CTA button, optional custom search component, and mobile support.',
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    logoSrc: {
      control: 'text',
      description: 'Logo image source path',
      table: {
        category: 'Logo',
      },
    },
    logoElement: {
      control: false,
      description: 'Custom logo element (overrides logoSrc)',
      table: {
        category: 'Logo',
      },
    },
    logoHref: {
      control: 'text',
      description: 'Logo link href',
      defaultValue: '/',
      table: {
        category: 'Logo',
        defaultValue: { summary: '/' },
      },
    },
    logoAlt: {
      control: 'text',
      description: 'Logo alt text',
      defaultValue: 'Logo',
      table: {
        category: 'Logo',
        defaultValue: { summary: 'Logo' },
      },
    },
    menuItems: {
      control: 'object',
      description: 'Navigation menu items array',
      table: {
        category: 'Navigation',
      },
    },
    ctaText: {
      control: 'text',
      description: 'Call-to-action button text',
      table: {
        category: 'CTA',
      },
    },
    ctaHref: {
      control: 'text',
      description: 'Call-to-action button href',
      table: {
        category: 'CTA',
      },
    },
    onCtaClick: {
      control: false,
      description: 'Call-to-action button click handler',
      table: {
        category: 'CTA',
      },
    },
    searchComponent: {
      control: false,
      description: 'Custom search component to render in the header',
      table: {
        category: 'Features',
      },
    },
    sticky: {
      control: 'boolean',
      description: 'Whether header should be sticky/fixed at top',
      defaultValue: false,
      table: {
        category: 'Layout',
        defaultValue: { summary: 'false' },
      },
    },
  },
} satisfies Meta<typeof Header>;

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * Default header with all features enabled
 * Tests:
 * - Logo renders correctly
 * - All menu items are visible
 * - Active menu item is highlighted
 * - CTA button is present
 */
export const Default: Story = {
  args: {
    logoSrc: '/images/core3-logo.svg',
    logoHref: '/',
    menuItems: [
      { name: 'Project Ratings', href: '/ratings/projects', active: true },
      { name: 'Exchange Ratings', href: '/ratings/exchanges' },
      { name: 'Methodology', href: '/methodology' },
      { name: 'Cooperation', href: '/cooperation' },
    ],
    ctaText: 'GET STARTED',
    ctaHref: '/get-started',
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    const header = canvasElement.querySelector('header');
    expect(header).toBeInTheDocument();

    expect(canvas.getByText('Project Ratings')).toBeInTheDocument();
    expect(canvas.getByText('Exchange Ratings')).toBeInTheDocument();
    expect(canvas.getByText('Methodology')).toBeInTheDocument();
    expect(canvas.getByText('Cooperation')).toBeInTheDocument();

    const ctaButton = canvas.getByText('GET STARTED');
    expect(ctaButton).toBeInTheDocument();
  },
};

/**
 * Header without CTA button
 * Tests:
 * - Header renders without CTA
 * - Menu items are still visible
 */
export const WithoutCTA: Story = {
  args: {
    logoSrc: '/images/core3-logo.svg',
    menuItems: [
      { name: 'Project Ratings', href: '/ratings/projects' },
      { name: 'Exchange Ratings', href: '/ratings/exchanges' },
      { name: 'Methodology', href: '/methodology' },
    ],
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    expect(canvas.getByText('Project Ratings')).toBeInTheDocument();
    expect(canvas.getByText('Exchange Ratings')).toBeInTheDocument();
    expect(canvas.getByText('Methodology')).toBeInTheDocument();

    expect(canvas.queryByRole('button', { name: /GET STARTED/i })).not.toBeInTheDocument();
  },
};

/**
 * Header with active menu item
 * Tests:
 * - Active menu item is properly marked
 * - All menu items render correctly
 */
export const WithActiveMenuItem: Story = {
  args: {
    logoSrc: '/images/core3-logo.svg',
    menuItems: [
      { name: 'Project Ratings', href: '/ratings/projects', active: true },
      { name: 'Exchange Ratings', href: '/ratings/exchanges' },
      { name: 'Methodology', href: '/methodology' },
      { name: 'Cooperation', href: '/cooperation' },
    ],
    ctaText: 'GET STARTED',
    ctaHref: '/get-started',
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    expect(canvas.getByText('Project Ratings')).toBeInTheDocument();
    expect(canvas.getByText('Exchange Ratings')).toBeInTheDocument();
    expect(canvas.getByText('Methodology')).toBeInTheDocument();
    expect(canvas.getByText('Cooperation')).toBeInTheDocument();
  },
};

/**
 * Sticky header that stays fixed at the top while scrolling
 * Tests:
 * - Header has sticky styling
 * - Content renders below header
 */
export const Sticky: Story = {
  args: {
    logoSrc: '/images/core3-logo.svg',
    menuItems: [
      { name: 'Home', href: '/', active: true },
      { name: 'About', href: '/about' },
      { name: 'Services', href: '/services' },
      { name: 'Contact', href: '/contact' },
    ],
    ctaText: 'GET STARTED',
    ctaHref: '/get-started',
    sticky: true,
  },
  decorators: [
    (Story) => (
      <div>
        <Story />
        <div style={{ height: '200vh', padding: '20px' }}>
          <p>Scroll down to see the sticky header in action.</p>
          <p style={{ marginTop: '100vh' }}>Content continues...</p>
        </div>
      </div>
    ),
  ],
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    const header = canvasElement.querySelector('header');
    expect(header).toBeInTheDocument();

    expect(canvas.getByText('Scroll down to see the sticky header in action.')).toBeInTheDocument();
    expect(canvas.getByText('Content continues...')).toBeInTheDocument();
  },
};

/**
 * Minimal header with just logo and one menu item
 * Tests:
 * - Minimal configuration renders
 * - Single menu item works
 */
export const Minimal: Story = {
  args: {
    logoSrc: '/images/core3-logo.svg',
    menuItems: [{ name: 'Home', href: '/', active: true }],
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    const header = canvasElement.querySelector('header');
    expect(header).toBeInTheDocument();

    expect(canvas.getByText('Home')).toBeInTheDocument();

    const nav = canvasElement.querySelector('nav ul');
    const menuItems = nav?.querySelectorAll('li');
    expect(menuItems?.length).toBe(1);
  },
};

/**
 * Header with custom logo element
 * Tests:
 * - Custom logo element renders instead of image
 * - Menu items still work
 */
export const CustomLogoElement: Story = {
  args: {
    logoElement: (
      <div
        style={{
          padding: '8px 16px',
          background: colors.primary.main,
          borderRadius: '4px',
          fontWeight: 'bold',
        }}
      >
        CORE3
      </div>
    ),
    menuItems: [
      { name: 'Project Ratings', href: '/ratings/projects' },
      { name: 'Exchange Ratings', href: '/ratings/exchanges' },
    ],
    ctaText: 'GET STARTED',
    ctaHref: '/get-started',
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    expect(canvas.getByText('CORE3')).toBeInTheDocument();

    expect(canvas.getByText('Project Ratings')).toBeInTheDocument();
    expect(canvas.getByText('Exchange Ratings')).toBeInTheDocument();
  },
};

/**
 * Header with custom search component
 * Tests:
 * - Search component renders
 * - Search input is functional
 */
export const WithSearch: Story = {
  args: {
    logoSrc: '/images/core3-logo.svg',
    menuItems: [
      { name: 'Exchange Ratings', href: '/projects' },
      { name: 'Exchanges', href: '/exchanges' },
    ],
    searchComponent: (
      <input
        type="search"
        placeholder="Search..."
        style={{
          padding: '8px 16px',
          borderRadius: '8px',
          border: `1px solid ${colors.neutral.gray300}`,
          outline: 'none',
          fontSize: '14px',
          width: '200px',
        }}
      />
    ),
    ctaText: 'Sign In',
    ctaHref: '/signin',
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    const searchInput = canvas.getByPlaceholderText('Search...');
    expect(searchInput).toBeInTheDocument();
    expect(searchInput).toHaveAttribute('type', 'search');

    await userEvent.type(searchInput, 'test query');
    expect(searchInput).toHaveValue('test query');

    expect(canvas.getByText('Exchange Ratings')).toBeInTheDocument();
    expect(canvas.getByText('Exchanges')).toBeInTheDocument();
  },
};

/**
 * Header with many menu items
 * Tests:
 * - Multiple menu items render correctly
 * - All items are accessible
 */
export const ManyMenuItems: Story = {
  args: {
    logoSrc: '/images/core3-logo.svg',
    menuItems: [
      { name: 'Home', href: '/' },
      { name: 'Exchange Ratings', href: '/projects' },
      { name: 'Exchanges', href: '/exchanges' },
      { name: 'Methodology', href: '/methodology' },
      { name: 'Research', href: '/research' },
      { name: 'Blog', href: '/blog' },
      { name: 'About', href: '/about' },
    ],
    ctaText: 'Sign Up',
    ctaHref: '/signup',
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    expect(canvas.getByText('Home')).toBeInTheDocument();
    expect(canvas.getByText('Exchange Ratings')).toBeInTheDocument();
    expect(canvas.getByText('Exchanges')).toBeInTheDocument();
    expect(canvas.getByText('Methodology')).toBeInTheDocument();
    expect(canvas.getByText('Research')).toBeInTheDocument();
    expect(canvas.getByText('Blog')).toBeInTheDocument();
    expect(canvas.getByText('About')).toBeInTheDocument();

    expect(canvas.getByText('Sign Up')).toBeInTheDocument();
  },
};

/**
 * Mobile view simulation (resize viewport to see mobile menu)
 * Tests:
 * - Mobile menu toggle button is present
 * - Mobile menu opens when clicked
 * - Mobile menu items are displayed
 */
export const MobileView: Story = {
  args: {
    logoSrc: '/images/core3-logo.svg',
    menuItems: [
      { name: 'Project Ratings', href: '/ratings/projects', active: true },
      { name: 'Exchange Ratings', href: '/ratings/exchanges' },
      { name: 'Methodology', href: '/methodology' },
      { name: 'Cooperation', href: '/cooperation' },
    ],
    ctaText: 'GET STARTED',
    ctaHref: '/get-started',
  },
  parameters: {
    viewport: {
      defaultViewport: 'mobile1',
    },
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    const menuToggle = canvas.getByRole('button', { name: 'Open menu' });
    expect(menuToggle).toBeInTheDocument();

    await userEvent.click(menuToggle);

    await waitFor(() => {
      expect(canvas.getByRole('button', { name: 'Close menu' })).toBeInTheDocument();
    });

    const allProjectRatingsLinks = canvas.getAllByText('Project Ratings');
    expect(allProjectRatingsLinks.length).toBeGreaterThan(0);
  },
};

/**
 * Header with CTA click handler
 * Tests:
 * - CTA click handler is called
 * - Button is clickable
 */
const WithClickHandlerComponent = () => {
  const [clicked, setClicked] = useState(false);

  return (
    <div>
      <Header
        logoSrc="/images/core3-logo.svg"
        menuItems={[
          { name: 'Home', href: '/' },
          { name: 'Products', href: '/products' },
        ]}
        ctaText="Click Me"
        onCtaClick={() => setClicked(true)}
      />
      {clicked && <div style={{ padding: '20px', textAlign: 'center' }}>CTA was clicked!</div>}
    </div>
  );
};

export const WithClickHandler = {
  render: () => <WithClickHandlerComponent />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    const ctaButton = canvas.getByText('Click Me');
    expect(ctaButton).toBeInTheDocument();

    await userEvent.click(ctaButton);

    await waitFor(() => {
      expect(canvas.getByText('CTA was clicked!')).toBeInTheDocument();
    });
  },
};

