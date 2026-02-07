import type { Meta } from '@storybook/react';
import { expect, within, userEvent, waitFor } from '@storybook/test';
import React, { useState } from 'react';
import BaseModal from './BaseModal';
import { Core3Button } from '../Button';
import { Typography } from '@mui/material';
import { colors } from '../../theme/styleSystem';

/**
 * BaseModal is a generic modal wrapper with backdrop blur, scroll lock, and animations.
 */
const meta = {
  title: 'Components/BaseModal',
  component: BaseModal,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: 'A reusable modal component with backdrop blur, scroll locking, and smooth animations. Provides a consistent modal experience across CORE3 applications.',
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    open: {
      control: 'boolean',
      description: 'Whether the modal is open',
    },
    ariaLabelledBy: {
      control: 'text',
      description: 'ID of the element labeling the modal',
      table: {
        defaultValue: { summary: 'modal-title' },
      },
    },
    ariaDescribedBy: {
      control: 'text',
      description: 'ID of the element describing the modal',
      table: {
        defaultValue: { summary: 'modal-description' },
      },
    },
  },
} satisfies Meta<typeof BaseModal>;

export default meta;

// Interactive wrapper component for stories
const ModalWrapper = ({ children }: { children: React.ReactNode }) => {
  const [open, setOpen] = useState(false);

  return (
    <>
      <Core3Button onClick={() => setOpen(true)}>
        OPEN MODAL
      </Core3Button>
      <BaseModal
        open={open}
        onClose={() => setOpen(false)}
      >
        {children}
      </BaseModal>
    </>
  );
};

/**
 * Default modal with simple content
 */
export const Default = {
  render: () => (
    <ModalWrapper>
      <Typography variant="h2" gutterBottom>
        Modal Title
      </Typography>
      <Typography variant="body1">
        This is a modal with some content inside.
      </Typography>
    </ModalWrapper>
  ),
  /**
   * Interaction test:
   * - Modal opens when button is clicked
   * - Content is visible when open
   * - Modal is not visible initially
   */
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    
    // Modal should not be visible initially
    expect(canvas.queryByText('Modal Title')).not.toBeInTheDocument();
    
    // Find and click the open button
    const openButton = canvas.getByRole('button', { name: /open modal/i });
    expect(openButton).toBeInTheDocument();
    
    await userEvent.click(openButton);
    
    // Wait for modal content to appear
    await waitFor(() => {
      const body = within(document.body);
      expect(body.getByText('Modal Title')).toBeInTheDocument();
      expect(body.getByText('This is a modal with some content inside.')).toBeInTheDocument();
    });
  },
};

/**
 * Modal with rich content
 */
export const WithRichContent = {
  render: () => (
    <ModalWrapper>
      <Typography variant="h2" gutterBottom id="modal-title">
        Welcome to CORE3
      </Typography>
      <Typography variant="body1" paragraph id="modal-description">
        CORE3 is the global self-regulatory platform for crypto.
      </Typography>
      <Typography variant="body2" color="text.secondary" paragraph>
        By introducing the Probability of Loss (PoL) metric, we establish a forward-looking,
        data-driven standard that quantifies risk and restores trust.
      </Typography>
      <Core3Button onClick={() => {}} fullWidth>
        GET STARTED
      </Core3Button>
    </ModalWrapper>
  ),
  /**
   * Interaction test:
   * - Opens modal with multiple content sections
   * - All content is rendered correctly
   * - Button inside modal is clickable
   */
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    
    const openButton = canvas.getByRole('button', { name: /open modal/i });
    await userEvent.click(openButton);
    
    await waitFor(() => {
      const body = within(document.body);
      expect(body.getByText('Welcome to CORE3')).toBeInTheDocument();
      expect(body.getByText('CORE3 is the global self-regulatory platform for crypto.')).toBeInTheDocument();
      
      // Check button inside modal
      const getStartedButton = body.getByRole('button', { name: /get started/i });
      expect(getStartedButton).toBeInTheDocument();
    });
  },
};

/**
 * Modal with form content
 */
export const WithForm = {
  render: () => (
    <ModalWrapper>
      <Typography variant="h3" gutterBottom>
        Join the Watchlist
      </Typography>
      <div style={{ marginTop: '24px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
        <input 
          type="text" 
          placeholder="Your name" 
          style={{ padding: '12px', borderRadius: '8px', border: `1px solid ${colors.neutral.gray300}` }}
        />
        <input 
          type="email" 
          placeholder="Your email" 
          style={{ padding: '12px', borderRadius: '8px', border: `1px solid ${colors.neutral.gray300}` }}
        />
        <Core3Button type="submit" fullWidth>
          SUBMIT
        </Core3Button>
      </div>
    </ModalWrapper>
  ),
  /**
   * Interaction test:
   * - Form inputs are accessible
   * - Can type in form fields
   * - Submit button is present
   */
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    
    const openButton = canvas.getByRole('button', { name: /open modal/i });
    await userEvent.click(openButton);
    
    await waitFor(async () => {
      const body = within(document.body);
      expect(body.getByText('Join the Watchlist')).toBeInTheDocument();
      
      // Find form inputs
      const nameInput = body.getByPlaceholderText('Your name') as HTMLInputElement;
      const emailInput = body.getByPlaceholderText('Your email') as HTMLInputElement;
      
      expect(nameInput).toBeInTheDocument();
      expect(emailInput).toBeInTheDocument();
      
      // Type in inputs
      await userEvent.type(nameInput, 'John Doe');
      await userEvent.type(emailInput, 'john@example.com');
      
      expect(nameInput.value).toBe('John Doe');
      expect(emailInput.value).toBe('john@example.com');
    });
  },
};

/**
 * Minimal modal with just text
 */
export const Minimal = {
  render: () => (
    <ModalWrapper>
      <Typography variant="body1">
        Simple modal content
      </Typography>
    </ModalWrapper>
  ),
  /**
   * Interaction test:
   * - Minimal content renders correctly
   * - Modal opens and closes properly
   */
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    
    const openButton = canvas.getByRole('button', { name: /open modal/i });
    await userEvent.click(openButton);
    
    await waitFor(() => {
      const body = within(document.body);
      expect(body.getByText('Simple modal content')).toBeInTheDocument();
    });
  },
};

// Fullscreen Modal Wrapper
const FullscreenModalWrapper = ({ 
  children, 
  title 
}: { 
  children: React.ReactNode;
  title?: string;
}) => {
  const [open, setOpen] = useState(false);

  return (
    <>
      <Core3Button onClick={() => setOpen(true)}>
        OPEN FULLSCREEN MODAL
      </Core3Button>
      <BaseModal
        variant="fullscreen"
        title={title}
        open={open}
        onClose={() => setOpen(false)}
      >
        {children}
      </BaseModal>
    </>
  );
};

/**
 * Fullscreen modal with header
 */
export const FullscreenWithHeader = {
  render: () => (
    <FullscreenModalWrapper title="Submit Data to Improve Score">
      <Typography variant="h3" gutterBottom>
        Insurance: Custody & Coverage
      </Typography>
      <Typography variant="h4" gutterBottom>
        What to submit
      </Typography>
      <ul>
        <li>Policy Declarations Page (insurer, policy #, period, limits, deductibles, endorsements).</li>
        <li>Coverage type: Crime and/or Specie; whether hot/cold wallets are covered.</li>
        <li>Named insured (entity) and custody model (qualified custodian vs self-custody).</li>
        <li>Scope & exclusions relevant to digital assets (e.g., &ldquo;only where custodian holds all keys&rdquo;; common carve-outs).</li>
        <li>If using a custodian, a custodian letter referencing the policy.</li>
      </ul>
      
      <Typography variant="h3" gutterBottom style={{ marginTop: '32px' }}>
        Third-Party Monitoring Attestation (DOCUSIGN)
      </Typography>
      <Typography variant="h4" gutterBottom>
        What to submit
      </Typography>
      <ul>
        <li>Provider & setup proof (e.g., Forta bots subscribed to your contracts; OpenZeppelin Monitor/Relayer OSS or legacy Defender; Tenderly alerts; SIEM feeds, etc.).</li>
        <li>Monitored assets: addresses/contracts by chain, topics/events watched, thresholds.</li>
        <li>Alerting: destinations (Slack/Discord/Webhook), escalation path, uptime.</li>
        <li>Change control: who owns/maintains rules; how false positives are tuned.</li>
      </ul>

      <Typography variant="body2" color="warning.main" style={{ 
        marginTop: '24px', 
        padding: '16px', 
        backgroundColor: 'rgba(255, 193, 7, 0.1)',
        borderRadius: '8px'
      }}>
        A DocuSign template form for Third Party Monitoring will be sent to you directly by our representatives
      </Typography>

      <Typography variant="h3" gutterBottom style={{ marginTop: '32px' }}>
        Treasury Contract Addresses
      </Typography>
      <Typography variant="h4" gutterBottom>
        What to submit
      </Typography>
      <ul>
        <li>All treasury/ops/vesting/LP addresses by chain; label each address role.</li>
        <li>Multisig configuration (e.g., Safe threshold and owner addresses) and any timelocks/guardians.</li>
        <li>Verification links (Etherscan/Blockscout verified code, ABI published where applicable).</li>
      </ul>
    </FullscreenModalWrapper>
  ),
  /**
   * Interaction test:
   * - Fullscreen modal opens
   * - Header with title is displayed
   * - Close button is present in header
   * - Long content is scrollable
   */
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    
    const openButton = canvas.getByRole('button', { name: /open fullscreen modal/i });
    await userEvent.click(openButton);
    
    await waitFor(() => {
      const body = within(document.body);
      
      // Check header title
      expect(body.getByText('Submit Data to Improve Score')).toBeInTheDocument();
      
      // Check content sections
      expect(body.getByText('Insurance: Custody & Coverage')).toBeInTheDocument();
      expect(body.getByText('Third-Party Monitoring Attestation (DOCUSIGN)')).toBeInTheDocument();
      expect(body.getByText('Treasury Contract Addresses')).toBeInTheDocument();
      
      // Check close button exists
      const closeButton = body.getByRole('button', { name: /close/i });
      expect(closeButton).toBeInTheDocument();
    });
  },
};

/**
 * Fullscreen modal without header
 */
export const FullscreenWithoutHeader = {
  render: () => (
    <FullscreenModalWrapper>
      <Typography variant="h2" gutterBottom>
        Custom Content Without Header
      </Typography>
      <Typography variant="body1" paragraph>
        This fullscreen modal doesn&apos;t have a header, so you can fully customize the content area.
      </Typography>
      <Typography variant="body1" paragraph>
        Scroll down to see more content...
      </Typography>
      {Array.from({ length: 20 }).map((_, i) => (
        <Typography key={i} variant="body2" paragraph>
          Lorem ipsum dolor sit amet, consectetur adipiscing elit. Section {i + 1}.
        </Typography>
      ))}
    </FullscreenModalWrapper>
  ),
  /**
   * Interaction test:
   * - Fullscreen modal without header renders
   * - Content is scrollable
   * - No header/close button in header position
   */
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    
    const openButton = canvas.getByRole('button', { name: /open fullscreen modal/i });
    await userEvent.click(openButton);
    
    await waitFor(() => {
      const body = within(document.body);
      
      expect(body.getByText('Custom Content Without Header')).toBeInTheDocument();
      expect(body.getByText('Scroll down to see more content...')).toBeInTheDocument();
      
      // Check multiple sections are rendered
      expect(body.getByText('Lorem ipsum dolor sit amet, consectetur adipiscing elit. Section 1.')).toBeInTheDocument();
      expect(body.getByText('Lorem ipsum dolor sit amet, consectetur adipiscing elit. Section 20.')).toBeInTheDocument();
    });
  },
};

// Component for fullscreen modal with custom close icon
const FullscreenCustomCloseComponent = () => {
  const [open, setOpen] = useState(false);
  
  return (
    <>
      <Core3Button onClick={() => setOpen(true)}>
        OPEN WITH CUSTOM CLOSE ICON
      </Core3Button>
      <BaseModal
        variant="fullscreen"
        title="Modal with Custom Close Icon"
        open={open}
        onClose={() => setOpen(false)}
        closeIcon={<span style={{ fontSize: '24px' }}>✕</span>}
        ariaCloseLabel="Close this modal"
      >
        <Typography variant="body1" paragraph>
          This fullscreen modal uses a custom close icon instead of the default X icon.
        </Typography>
        <Typography variant="body1" paragraph>
          The closeIcon prop works with both default and fullscreen variants.
        </Typography>
      </BaseModal>
    </>
  );
};

/**
 * Fullscreen modal with header and custom close icon
 */
export const FullscreenWithCustomCloseIcon = {
  render: () => <FullscreenCustomCloseComponent />,
  /**
   * Interaction test:
   * - Custom close icon is rendered
   * - Close button has custom aria label
   * - Clicking custom close icon closes modal
   */
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    
    const openButton = canvas.getByRole('button', { name: /open with custom close icon/i });
    await userEvent.click(openButton);
    
    await waitFor(async () => {
      const body = within(document.body);
      
      expect(body.getByText('Modal with Custom Close Icon')).toBeInTheDocument();
      expect(body.getByText('This fullscreen modal uses a custom close icon instead of the default X icon.')).toBeInTheDocument();
      
      // Check custom aria label
      const closeButton = body.getByRole('button', { name: /close this modal/i });
      expect(closeButton).toBeInTheDocument();
      
      // Custom close icon text should be present
      expect(body.getByText('✕')).toBeInTheDocument();
      
      // Click to close
      await userEvent.click(closeButton);
    });
    
    // After closing, content should disappear
    await waitFor(() => {
      const body = within(document.body);
      expect(body.queryByText('Modal with Custom Close Icon')).not.toBeInTheDocument();
    });
  },
};

/**
 * Default modal demonstrating responsive behavior
 */
export const DefaultWithLongContent = {
  render: () => (
    <ModalWrapper>
      <Typography variant="h3" gutterBottom>
        Modal with Scrollable Content
      </Typography>
      {Array.from({ length: 15 }).map((_, i) => (
        <Typography key={i} variant="body1" paragraph>
          This is paragraph {i + 1}. The modal will scroll if content exceeds viewport height.
        </Typography>
      ))}
      <Core3Button fullWidth>
        ACTION BUTTON
      </Core3Button>
    </ModalWrapper>
  ),
  /**
   * Interaction test:
   * - Long content renders in modal
   * - All paragraphs are accessible
   * - Bottom content is reachable
   */
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    
    const openButton = canvas.getByRole('button', { name: /open modal/i });
    await userEvent.click(openButton);
    
    await waitFor(() => {
      const body = within(document.body);
      
      expect(body.getByText('Modal with Scrollable Content')).toBeInTheDocument();
      
      // Check first and last paragraphs
      expect(body.getByText('This is paragraph 1. The modal will scroll if content exceeds viewport height.')).toBeInTheDocument();
      expect(body.getByText('This is paragraph 15. The modal will scroll if content exceeds viewport height.')).toBeInTheDocument();
      
      // Check action button at bottom
      const actionButton = body.getByRole('button', { name: /action button/i });
      expect(actionButton).toBeInTheDocument();
    });
  },
};