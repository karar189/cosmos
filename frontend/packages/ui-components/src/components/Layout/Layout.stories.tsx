import type { Meta, StoryObj } from '@storybook/react';
import { expect, within } from '@storybook/test';
import React from 'react';
import Layout from './Layout';
import { Card } from '../Card';
import { Section } from '../Section';
import { DataList } from '../DataBlocks';
import { colors } from '../../theme/styleSystem';

/**
 * Layout component provides a complete page structure with header, optional title section,
 * content area, and footer. Supports two variants: default and with-title.
 */
const meta = {
  title: 'Components/Layout',
  component: Layout,
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component:
          'Layout component provides a complete page layout solution with configurable header, optional title section, main content area, and footer. Supports two variants for different use cases.',
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: 'select',
      options: ['default', 'with-title'],
      description: 'Layout variant',
      defaultValue: 'default',
      table: {
        category: 'Layout',
        defaultValue: { summary: 'default' },
      },
    },
    titleSectionContent: {
      control: false,
      description: 'Custom content for title section (for with-title variant)',
      table: {
        category: 'Content',
      },
    },
    children: {
      control: false,
      description: 'Main content',
      table: {
        category: 'Content',
      },
    },
    headerProps: {
      control: 'object',
      description: 'Props passed to Header component',
      table: {
        category: 'Header',
      },
    },
    footerProps: {
      control: 'object',
      description: 'Props passed to Footer component',
      table: {
        category: 'Footer',
      },
    },
    showHeader: {
      control: 'boolean',
      description: 'Whether to show header',
      defaultValue: true,
      table: {
        category: 'Header',
        defaultValue: { summary: 'true' },
      },
    },
    showFooter: {
      control: 'boolean',
      description: 'Whether to show footer',
      defaultValue: true,
      table: {
        category: 'Footer',
        defaultValue: { summary: 'true' },
      },
    },
  },
} satisfies Meta<typeof Layout>;

export default meta;
type Story = StoryObj<typeof meta>;

const SampleContent = () => (
  <div style={{ padding: '48px 24px', maxWidth: '1280px', margin: '0 auto' }}>
    <Section title="Example Section" columns={3} gap="m">
      <Card>
        <DataList
          items={[
            { label: 'Total Projects', value: '1,234' },
            { label: 'Active Users', value: '50K+' },
          ]}
        />
      </Card>
      <Card>
        <DataList
          items={[
            { label: 'Total Volume', value: '$1.5B' },
            { label: 'Transactions', value: '2.5M' },
          ]}
        />
      </Card>
      <Card>
        <DataList
          items={[
            { label: 'Exchanges', value: '156' },
            { label: 'Countries', value: '45' },
          ]}
        />
      </Card>
    </Section>
  </div>
);

/**
 * Default layout with header and footer
 */
export const Default: Story = {
  args: {
    variant: 'default',
    headerProps: {
      logoSrc: '/images/core3-logo.svg',
      menuItems: [
        { name: 'Project Ratings', href: '/ratings/projects', active: true },
        { name: 'Exchange Ratings', href: '/ratings/exchanges' },
        { name: 'Methodology', href: '/methodology' },
      ],
      ctaText: 'GET STARTED',
      ctaHref: '/get-started',
    },
    footerProps: {
      menuItems: [
        { name: 'Ratings', href: '/ratings' },
        { name: 'Methodology', href: '/methodology' },
        { name: 'About', href: '/about' },
      ],
      socialItems: [
        { name: 'X', href: 'https://x.com' },
        { name: 'LinkedIn', href: 'https://linkedin.com' },
      ],
      tagline: 'Crypto Organisation of Regulatory Elaboration',
    },
    children: <SampleContent />,
  },

  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    const layoutContainer = canvasElement.querySelector('[data-scroll-container="true"]');
    expect(layoutContainer).toBeInTheDocument();

    const gradientBg = layoutContainer?.querySelector('div:first-child');
    expect(gradientBg).toBeInTheDocument();

    const header = canvasElement.querySelector('header');
    expect(header).toBeInTheDocument();

    const headerCanvas = within(header!);
    expect(headerCanvas.getByText('Project Ratings')).toBeInTheDocument();
    expect(headerCanvas.getByText('Exchange Ratings')).toBeInTheDocument();
    expect(headerCanvas.getByText('Methodology')).toBeInTheDocument();
    expect(canvas.getByText('GET STARTED')).toBeInTheDocument();

    const main = canvasElement.querySelector('main');
    expect(main).toBeInTheDocument();
    expect(canvas.getByText('Example Section')).toBeInTheDocument();

    const footer = canvasElement.querySelector('footer');
    expect(footer).toBeInTheDocument();
    expect(canvas.getByText('Ratings')).toBeInTheDocument();
    expect(canvas.getByText('About')).toBeInTheDocument();
  },
};

/**
 * Layout with title section
 */
export const WithTitle: Story = {
  args: {
    variant: 'with-title',
    titleSectionContent: (
      <>
        <h1
          style={{
            fontSize: '48px',
            fontWeight: 500,
            lineHeight: 0.8,
            margin: 0,
            textTransform: 'uppercase',
          }}
        >
          <strong style={{ fontWeight: 700, display: 'block' }}>explore</strong>{' '}
          1,000+ projects.
        </h1>
      </>
    ),
    headerProps: {
      logoSrc: '/images/core3-logo.svg',
      menuItems: [
        { name: 'Project Ratings', href: '/ratings/projects', active: true },
        { name: 'Exchange Ratings', href: '/ratings/exchanges' },
        { name: 'Methodology', href: '/methodology' },
      ],
      ctaText: 'GET STARTED',
      sticky: true,
    },
    footerProps: {
      menuItems: [
        { name: 'Privacy', href: '/privacy' },
        { name: 'Terms', href: '/terms' },
      ],
      socialItems: [{ name: 'Twitter', href: 'https://twitter.com' }],
    },
    children: <SampleContent />,
  },

  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    const layoutContainer = canvasElement.querySelector('[data-scroll-container="true"]');
    expect(layoutContainer).toBeInTheDocument();
    expect(canvas.getByText('Project Ratings')).toBeInTheDocument();
    expect(canvas.getByText('explore')).toBeInTheDocument();
    expect(canvas.getByText('1,000+ projects.')).toBeInTheDocument();

    const h1 = canvasElement.querySelector('h1');
    expect(h1).toBeInTheDocument();
    expect(h1?.textContent).toContain('explore');

    const main = canvasElement.querySelector('main');
    expect(main).toBeInTheDocument();
    expect(canvas.getByText('Example Section')).toBeInTheDocument();
    expect(canvas.getByText('Privacy')).toBeInTheDocument();
    expect(canvas.getByText('Terms')).toBeInTheDocument();
  },
};

/**
 * Layout without header
 */
export const WithoutHeader: Story = {
  args: {
    variant: 'default',
    showHeader: false,
    footerProps: {
      menuItems: [
        { name: 'Home', href: '/' },
        { name: 'About', href: '/about' },
      ],
    },
    children: (
      <div style={{ padding: '48px 24px', textAlign: 'center' }}>
        <h1>Content without Header</h1>
        <p>This layout has no header, only footer.</p>
      </div>
    ),
  },

  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    const layoutContainer = canvasElement.querySelector('[data-scroll-container="true"]');
    expect(layoutContainer).toBeInTheDocument();

    const header = canvasElement.querySelector('header');
    expect(header).not.toBeInTheDocument();

    const main = canvasElement.querySelector('main');
    expect(main).toBeInTheDocument();
    expect(canvas.getByText('Content without Header')).toBeInTheDocument();
    expect(canvas.getByText('This layout has no header, only footer.')).toBeInTheDocument();

    const footer = canvasElement.querySelector('footer');
    expect(footer).toBeInTheDocument();
    expect(canvas.getByText('Home')).toBeInTheDocument();
    expect(canvas.getByText('About')).toBeInTheDocument();
  },
};

/**
 * Layout without footer
 */
export const WithoutFooter: Story = {
  args: {
    variant: 'default',
    showFooter: false,
    headerProps: {
      logoSrc: '/images/core3-logo.svg',
      menuItems: [
        { name: 'Home', href: '/' },
        { name: 'Dashboard', href: '/dashboard' },
      ],
    },
    children: (
      <div style={{ padding: '48px 24px', textAlign: 'center' }}>
        <h1>Content without Footer</h1>
        <p>This layout has no footer, only header.</p>
      </div>
    ),
  },

  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    const layoutContainer = canvasElement.querySelector('[data-scroll-container="true"]');
    expect(layoutContainer).toBeInTheDocument();

    const header = canvasElement.querySelector('header');
    expect(header).toBeInTheDocument();
    expect(canvas.getByText('Home')).toBeInTheDocument();
    expect(canvas.getByText('Dashboard')).toBeInTheDocument();

    const main = canvasElement.querySelector('main');
    expect(main).toBeInTheDocument();
    expect(canvas.getByText('Content without Footer')).toBeInTheDocument();
    expect(canvas.getByText('This layout has no footer, only header.')).toBeInTheDocument();

    const footer = canvasElement.querySelector('footer');
    expect(footer).not.toBeInTheDocument();
  },
};

/**
 * Minimal layout with just content
 */
export const ContentOnly: Story = {
  args: {
    variant: 'default',
    showHeader: false,
    showFooter: false,
    children: (
      <div
        style={{
          padding: '48px 24px',
          textAlign: 'center',
          minHeight: '100vh',
        }}
      >
        <h1>Content Only</h1>
        <p>This layout has no header or footer, just the content area.</p>
      </div>
    ),
  },

  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    const layoutContainer = canvasElement.querySelector('[data-scroll-container="true"]');
    expect(layoutContainer).toBeInTheDocument();

    const header = canvasElement.querySelector('header');
    expect(header).not.toBeInTheDocument();

    const footer = canvasElement.querySelector('footer');
    expect(footer).not.toBeInTheDocument();

    const main = canvasElement.querySelector('main');
    expect(main).toBeInTheDocument();
    expect(canvas.getByText('Content Only')).toBeInTheDocument();
    expect(canvas.getByText('This layout has no header or footer, just the content area.')).toBeInTheDocument();
  },
};

/**
 * With title but no subtitle
 */
export const TitleOnly: Story = {
  args: {
    variant: 'with-title',
    titleSectionContent: (
      <h1 style={{ fontSize: '48px', fontWeight: 700, margin: 0 }}>
        Exchange Ratings
      </h1>
    ),
    headerProps: {
      logoSrc: '/images/core3-logo.svg',
      menuItems: [
        { name: 'Projects', href: '/projects' },
        { name: 'Exchanges', href: '/exchanges', active: true },
      ],
    },
    footerProps: {
      menuItems: [{ name: 'Contact', href: '/contact' }],
    },
    children: <SampleContent />,
  },

  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    const layoutContainer = canvasElement.querySelector('[data-scroll-container="true"]');
    expect(layoutContainer).toBeInTheDocument();

    const header = canvasElement.querySelector('header');
    expect(header).toBeInTheDocument();
    const headerCanvas = within(header!);
    expect(headerCanvas.getByText('Projects')).toBeInTheDocument();
    expect(headerCanvas.getByText('Exchanges')).toBeInTheDocument();

    const h1 = canvasElement.querySelector('h1');
    expect(h1).toBeInTheDocument();
    expect(canvas.getByText('Exchange Ratings')).toBeInTheDocument();

    const main = canvasElement.querySelector('main');
    expect(main).toBeInTheDocument();
    expect(canvas.getByText('Example Section')).toBeInTheDocument();
    expect(canvas.getByText('Contact')).toBeInTheDocument();
  },
};

/**
 * With long title and subtitle
 */
export const LongTitles: Story = {
  args: {
    variant: 'with-title',
    titleSectionContent: (
      <>
        <h1 style={{ fontSize: '48px', fontWeight: 700, margin: 0 }}>
          Comprehensive Blockchain Project Ratings and Analysis Platform
        </h1>
        <p
          style={{
            fontSize: '18px',
            color: colors.text.secondary,
            margin: '16px 0 0 0',
            maxWidth: '800px',
          }}
        >
          Access in-depth ratings, security audits, and analytical insights for
          thousands of blockchain projects across multiple chains. Our
          methodology combines automated analysis with expert review to provide
          the most accurate and up-to-date project assessments.
        </p>
      </>
    ),
    headerProps: {
      logoSrc: '/images/core3-logo.svg',
      menuItems: [{ name: 'Home', href: '/' }],
    },
    footerProps: {
      menuItems: [{ name: 'About', href: '/about' }],
    },
    children: <SampleContent />,
  },

  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    const layoutContainer = canvasElement.querySelector('[data-scroll-container="true"]');
    expect(layoutContainer).toBeInTheDocument();

    const h1 = canvasElement.querySelector('h1');
    expect(h1).toBeInTheDocument();
    expect(canvas.getByText('Comprehensive Blockchain Project Ratings and Analysis Platform')).toBeInTheDocument();

    const description = canvasElement.querySelector('p');
    expect(description).toBeInTheDocument();
    expect(canvas.getByText(/Access in-depth ratings, security audits/)).toBeInTheDocument();
    expect(canvas.getByText(/methodology combines automated analysis/)).toBeInTheDocument();
    expect(canvas.getByText('Home')).toBeInTheDocument();
    expect(canvas.getByText('About')).toBeInTheDocument();
  },
};

/**
 * Minimal header and footer
 */
export const MinimalHeaderFooter: Story = {
  args: {
    variant: 'default',
    headerProps: {
      logoSrc: '/images/core3-logo.svg',
    },
    footerProps: {
      menuItems: [{ name: 'Privacy', href: '/privacy' }],
    },
    children: (
      <div style={{ padding: '48px 24px', textAlign: 'center' }}>
        <h1>Minimal Layout</h1>
        <p>Simple header with just logo, and basic footer.</p>
      </div>
    ),
  },

  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    const layoutContainer = canvasElement.querySelector('[data-scroll-container="true"]');
    expect(layoutContainer).toBeInTheDocument();

    const header = canvasElement.querySelector('header');
    expect(header).toBeInTheDocument();

    const main = canvasElement.querySelector('main');
    expect(main).toBeInTheDocument();
    expect(canvas.getByText('Minimal Layout')).toBeInTheDocument();
    expect(canvas.getByText('Simple header with just logo, and basic footer.')).toBeInTheDocument();

    const footer = canvasElement.querySelector('footer');
    expect(footer).toBeInTheDocument();
    expect(canvas.getByText('Privacy')).toBeInTheDocument();
  },
};

/**
 * Full-featured layout with sticky header
 */
export const StickyHeader: Story = {
  args: {
    variant: 'with-title',
    titleSectionContent: (
      <>
        <h1 style={{ fontSize: '48px', fontWeight: 700, margin: 0 }}>
          Project Dashboard
        </h1>
        <p
          style={{ fontSize: '18px', color: colors.text.secondary, margin: '16px 0 0 0' }}
        >
          Monitor and analyze your favorite projects
        </p>
      </>
    ),
    headerProps: {
      logoSrc: '/images/core3-logo.svg',
      menuItems: [
        { name: 'Dashboard', href: '/dashboard', active: true },
        { name: 'Projects', href: '/projects' },
        { name: 'Exchanges', href: '/exchanges' },
      ],
      ctaText: 'Sign In',
      sticky: true,
    },
    footerProps: {
      menuItems: [
        { name: 'About', href: '/about' },
        { name: 'Contact', href: '/contact' },
      ],
      socialItems: [
        { name: 'Twitter', href: 'https://twitter.com' },
        { name: 'GitHub', href: 'https://github.com' },
      ],
      logoSrc: '/images/footer-logo.webp',
    },
    children: (
      <div style={{ padding: '48px 24px' }}>
        <SampleContent />
        <div
          style={{ height: '100vh', padding: '48px 24px', textAlign: 'center' }}
        >
          <p>Scroll to see sticky header in action</p>
        </div>
      </div>
    ),
  },

  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    const layoutContainer = canvasElement.querySelector('[data-scroll-container="true"]');
    expect(layoutContainer).toBeInTheDocument();

    const header = canvasElement.querySelector('header');
    expect(header).toBeInTheDocument();

    const headerCanvas = within(header!);
    expect(headerCanvas.getByText('Dashboard')).toBeInTheDocument();
    expect(headerCanvas.getByText('Projects')).toBeInTheDocument();
    expect(headerCanvas.getByText('Exchanges')).toBeInTheDocument();
    expect(headerCanvas.getByText('Sign In')).toBeInTheDocument();

    const h1 = canvasElement.querySelector('h1');
    expect(h1).toBeInTheDocument();
    expect(canvas.getByText('Project Dashboard')).toBeInTheDocument();
    expect(canvas.getByText('Monitor and analyze your favorite projects')).toBeInTheDocument();

    const main = canvasElement.querySelector('main');
    expect(main).toBeInTheDocument();
    expect(canvas.getByText('Scroll to see sticky header in action')).toBeInTheDocument();
    expect(canvas.getByText('Example Section')).toBeInTheDocument();

    const footer = canvasElement.querySelector('footer');
    expect(footer).toBeInTheDocument();
    expect(canvas.getByText('About')).toBeInTheDocument();
    expect(canvas.getByText('Contact')).toBeInTheDocument();
    expect(canvas.getByText('Twitter')).toBeInTheDocument();
    expect(canvas.getByText('GitHub')).toBeInTheDocument();
  },
};

/**
 * Platform-style layout with title section
 */
export const PlatformLayout: Story = {
  args: {
    variant: 'with-title',
    titleSectionContent: (
      <h1
        style={{
          fontSize: '48px',
          fontWeight: 500,
          lineHeight: 0.8,
          margin: 0,
          textTransform: 'uppercase',
        }}
      >
        <strong style={{ fontWeight: 700, display: 'block' }}>explore</strong>{' '}
        1,000+ projects.
      </h1>
    ),
    headerProps: {
      logoSrc: '/images/core3-logo.svg',
      menuItems: [
        { name: 'PROJECT RATINGS', href: '/ratings/projects', active: true },
        { name: 'EXCHANGE RATINGS', href: '/ratings/exchanges' },
        { name: 'METHODOLOGY', href: '/methodology' },
        { name: 'COOPERATION', href: '/cooperation' },
      ],
      ctaText: 'GET STARTED',
      sticky: true,
    },
    footerProps: {
      menuItems: [
        { name: 'Ratings', href: '#' },
        { name: 'Methodology', href: '#' },
        { name: 'Listing', href: '#' },
        { name: 'Cooperation', href: '#' },
        { name: 'About', href: '#' },
      ],
      socialItems: [
        { name: 'X', href: '#' },
        { name: 'Linkedin', href: '#' },
        { name: 'Telegram', href: '#' },
      ],
      logoSrc: '/images/footer-logo.webp',
      tagline: (
        <>
          Crypto <br />
          Organisation of <br />
          Regulatory <br />
          <span>Elaboration</span>
        </>
      ),
    },
    children: <SampleContent />,
  },

  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    const layoutContainer = canvasElement.querySelector('[data-scroll-container="true"]');
    expect(layoutContainer).toBeInTheDocument();

    const header = canvasElement.querySelector('header');
    expect(header).toBeInTheDocument();
    expect(canvas.getByText('PROJECT RATINGS')).toBeInTheDocument();
    expect(canvas.getByText('EXCHANGE RATINGS')).toBeInTheDocument();
    expect(canvas.getByText('METHODOLOGY')).toBeInTheDocument();
    expect(canvas.getByText('COOPERATION')).toBeInTheDocument();
    expect(canvas.getByText('GET STARTED')).toBeInTheDocument();

    const h1 = canvasElement.querySelector('h1');
    expect(h1).toBeInTheDocument();
    expect(canvas.getByText('explore')).toBeInTheDocument();
    expect(canvas.getByText('1,000+ projects.')).toBeInTheDocument();

    const main = canvasElement.querySelector('main');
    expect(main).toBeInTheDocument();
    expect(canvas.getByText('Example Section')).toBeInTheDocument();

    const footer = canvasElement.querySelector('footer');
    expect(footer).toBeInTheDocument();
    expect(canvas.getByText('Ratings')).toBeInTheDocument();
    expect(canvas.getByText('Listing')).toBeInTheDocument();
    expect(canvas.getByText('Cooperation')).toBeInTheDocument();
    expect(canvas.getByText('X')).toBeInTheDocument();
    expect(canvas.getByText('Linkedin')).toBeInTheDocument();
    expect(canvas.getByText('Telegram')).toBeInTheDocument();
    expect(canvas.getByText(/Crypto/i)).toBeInTheDocument();
    expect(canvas.getByText(/Organisation of/i)).toBeInTheDocument();
    expect(canvas.getByText(/Regulatory/i)).toBeInTheDocument();
    expect(canvas.getByText(/Elaboration/i)).toBeInTheDocument();
  },
};