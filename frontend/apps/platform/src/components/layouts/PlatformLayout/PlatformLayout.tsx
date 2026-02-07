/** @jsxImportSource @emotion/react */
'use client';

import { useState, useEffect, useRef } from 'react';
import { css } from '@emotion/react';
import HCaptcha from '@hcaptcha/react-hcaptcha';
import * as styles from './PlatformLayout.styles';
import useTranslation from '@/hooks/useTranslation';
import { useRouter } from 'next/navigation';
import { ROUTES } from '@/constants/routes';
import { Layout, LayoutProps, HeaderProps, FooterProps, Core3Button, HeaderDropdown } from '@core3/ui-components';
import CooperationModal from '@/components/common/CooperationModal';
import CooperationForm from '@/components/forms/CooperationForm';
import { AccountTypeBadge } from '@/components/common/AccountTypeBadge';
import { UserMenu } from '@/components/common/UserMenu';
import { useCooperationSubmit } from '@/hooks/useCooperationSubmit';
import { useCooperationOptions } from '@/hooks/useCooperationOptions';
import { useCooperationFormConfig } from '@/hooks/useCooperationFormConfig';
import { useAuth } from '@/hooks/useAuth';
import { useFreighter } from '@/hooks/useFreighter';
import type { CooperationFormData } from '@/types/cooperation';
import { CooperationModalContext } from './CooperationModalContext';
import PlatformSearch from '@/components/common/PlatformSearch';
import SearchModal from '@/components/common/SearchModal/SearchModal';

type HCaptchaInstance = typeof HCaptcha.prototype;

/**
 * Platform-specific layout configuration
 * Wraps the generic Layout component with pre-configured header and footer
 * for the CORE3 platform application.
 */

// Default header configuration builder (needs cooperation handler)
const getDefaultHeaderProps = (_openCooperationModal: () => void): HeaderProps => ({
  logoElement: (
    <span css={css`
      font-family: var(--font-aeonik);
      font-size: 1.5rem;
      font-weight: 700;
      color: #000;
      letter-spacing: -0.02em;
    `}>
      Cosmos
    </span>
  ),
  logoHref: ROUTES.HOME,
  logoAlt: 'Cosmos',
  menuItems: [
    { name: 'DASHBOARD', href: ROUTES.WORKSPACE.ROOT },
    { name: 'PROJECT RATINGS', href: ROUTES.RATINGS.PROJECTS },
    { name: 'EXCHANGE RATINGS', href: ROUTES.RATINGS.EXCHANGES },
  ],
  ctaText: 'CONNECT WALLET',
  ctaTextMobile: 'CONNECT',
  onCtaClick: () => {
    // Wallet connection to be wired (e.g. Stellar wallet adapter)
  },
  sticky: true, // Main header is sticky
});

// Default footer configuration builder (without tagline - added in component)
// No CORE.3 bottom image, no social links, no Methodology/Cooperation
const getDefaultFooterPropsBase = (_openCooperationModal: () => void): Omit<FooterProps, 'tagline'> => ({
  menuItems: [
    { name: 'Dashboard', href: ROUTES.WORKSPACE.ROOT },
    { name: 'Project Ratings', href: ROUTES.RATINGS.PROJECTS },
    { name: 'Exchange Ratings', href: ROUTES.RATINGS.EXCHANGES },
  ],
  socialItems: [],
});

export interface PlatformLayoutProps extends Omit<
  LayoutProps,
  'headerProps' | 'footerProps'
> {
  /**
   * Override or extend default header props
   */
  headerProps?: Partial<HeaderProps>;
  /**
   * Override or extend default footer props
   */
  footerProps?: Partial<FooterProps>;
  /**
   * Active menu item href (for highlighting current page)
   */
  activeMenuItem?: string;
  /**
   * Loading state - shows spinner when true
   */
  isLoading?: boolean;
  /**
   * Loading text to display
   */
  loadingText?: string;
  /**
   * Error state
   */
  error?: Error | null;
  /**
   * Page (project, exchange, workspace, etc.)
   */
  page?: 'project' | 'exchange' | 'workspace';
  /**
   * Refetch function for retry button
   */
  refetch?: () => void;
}

/**
 * PlatformLayout - Pre-configured layout for CORE3 Platform
 *
 * Wraps the generic Layout component with platform-specific header and footer configuration.
 * All platform pages should use this component for consistent navigation and branding.
 *
 * Features:
 * - Pre-configured header with platform navigation
 * - Pre-configured footer with platform links and branding
 * - Support for both layout variants (default and with-title)
 * - Ability to override/extend header and footer props if needed
 * - Automatic active menu item highlighting
 *
 * @example
 * ```tsx
 * // Simple usage with default configuration
 * <PlatformLayout>
 *   <YourPageContent />
 * </PlatformLayout>
 *
 * // With title variant
 * <PlatformLayout
 *   variant="with-title"
 *   title="Project Ratings"
 *   subtitle="Explore comprehensive blockchain project ratings"
 *   activeMenuItem="/ratings/projects"
 * >
 *   <YourPageContent />
 * </PlatformLayout>
 *
 * // Override specific header props
 * <PlatformLayout
 *   headerProps={{ ctaText: 'Sign In', ctaHref: '/signin' }}
 * >
 *   <YourPageContent />
 * </PlatformLayout>
 * ```
 */
export default function PlatformLayout({
  children,
  headerProps,
  footerProps,
  activeMenuItem,
  isLoading,
  error,
  page,
  refetch,
  ...layoutProps
}: PlatformLayoutProps) {
  const { t } = useTranslation(['common', 'exchanges', 'projects', 'cooperation']);
  const router = useRouter();
  
  // Authentication state
  const { isAuthenticated, user, logout } = useAuth();

  // Freighter wallet (Connect Wallet button)
  const { publicKey: walletAddress, connect: connectWallet, disconnect: disconnectWallet, isConnecting: isWalletConnecting, truncatedAddress: walletTruncated } = useFreighter();

  // Cooperation modal state
  const [cooperationModalOpen, setCooperationModalOpen] = useState(false);
  const [captchaToken, setCaptchaToken] = useState<string | null>(null);
  const captchaRef = useRef<HCaptchaInstance>(null);

  // Search modal state (single instance for both desktop and mobile)
  const [searchModalOpen, setSearchModalOpen] = useState(false);
  const openSearchModal = () => setSearchModalOpen(true);
  const closeSearchModal = () => setSearchModalOpen(false);

  // Cooperation hooks
  const { submit, isLoading: isSubmitting, isSuccess, error: submitError, reset } = useCooperationSubmit();
  const { options, isLoading: optionsLoading } = useCooperationOptions();
  const formConfig = useCooperationFormConfig();

  // Update form fields with dynamic options
  const dynamicFormFields = formConfig.fields.map((field) => {
    if (field.key === 'reasonForInterest') {
      return { ...field, options };
    }
    return field;
  });

  // Close modal on success
  useEffect(() => {
    if (isSuccess) {
      setTimeout(() => {
        setCooperationModalOpen(false);
        reset();
        setCaptchaToken(null);
        if (captchaRef.current) {
          try {
            captchaRef.current.resetCaptcha();
          } catch (error) {
            console.warn('Failed to reset captcha:', error);
          }
        }
      }, 1500); // Give user time to see success state
    }
  }, [isSuccess, reset]);

  // Global "/" keyboard shortcut to open search (single listener)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Only trigger if not already typing in an input/textarea
      if (
        e.key === '/' &&
        !searchModalOpen &&
        document.activeElement?.tagName !== 'INPUT' &&
        document.activeElement?.tagName !== 'TEXTAREA'
      ) {
        e.preventDefault();
        openSearchModal();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [searchModalOpen]);

  const handleCooperationSubmit = async (data: CooperationFormData) => {
    if (!captchaToken) {
      return; // Should not happen due to button being disabled
    }

    submit(
      { formData: data, captchaToken },
      {
        onError: () => {
          // Reset captcha on error
          setCaptchaToken(null);
          if (captchaRef.current) {
            try {
              captchaRef.current.resetCaptcha();
            } catch (error) {
              console.warn('Failed to reset captcha:', error);
            }
          }
        },
      }
    );
  };

  const handleCooperationClose = () => {
    setCooperationModalOpen(false);
    reset();
    setCaptchaToken(null);
    if (captchaRef.current) {
      try {
        captchaRef.current.resetCaptcha();
      } catch (error) {
        console.warn('Failed to reset captcha:', error);
      }
    }
  };

  const openCooperationModal = () => {
    setCooperationModalOpen(true);
  };

  const handleLogout = () => {
    logout();
    
    // If on protected route (workspace), redirect to ratings
    if (typeof window !== 'undefined' && window.location.pathname.includes('/workspace')) {
      router.push(ROUTES.RATINGS.PROJECTS);
    }
  };

  const getInfoMessage = (values: Partial<CooperationFormData>) => {
    if (values.role === 'organization') {
      return t(
        'cooperation:form.infoMessage.organization',
        "Partner with CORE3 to build trust and transparency in Web3. Whether you're integrating PoL metrics, seeking certification, or exploring collaboration opportunities - let's shape the future of digital asset credibility together."
      );
    }
    if (values.role === 'individual') {
      return t(
        'cooperation:form.infoMessage.individual',
        'Connect with CORE3 for partnership opportunities, data access, or to learn more about integrating our risk metrics into your workflow.'
      );
    }
    return null;
  };

  // Create footer tagline with translations
  const footerTagline = (
    <>
      {t('common:footer.tagline.line1')} <br />
      {t('common:footer.tagline.line2')} <br />
      {t('common:footer.tagline.line3')} <br />
      <span>{t('common:footer.tagline.line4')}</span>
    </>
  );

  // Build More dropdown for authenticated header
  const moreMenuTrigger = (
    <>
      {t('common:header.moreMenu.trigger', 'MORE')}
      <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
        <path d="M4 6l4 4 4-4H4z" />
      </svg>
    </>
  );

  const moreMenuItems: { label: string; href?: string; target?: '_blank'; onClick?: (e: React.MouseEvent) => void }[] = [];

  // Build authenticated header configuration
  const authenticatedHeaderProps: HeaderProps | null = isAuthenticated && user ? {
    logoElement: (
      <span css={css`
        font-family: var(--font-aeonik);
        font-size: 1.5rem;
        font-weight: 700;
        color: #000;
        letter-spacing: -0.02em;
      `}>
      Cosmos
    </span>
  ),
  logoHref: ROUTES.HOME,
  logoAlt: 'Cosmos',
    isAuthenticated: true,
    accountTypeBadge: (
      <AccountTypeBadge 
        accountType={user.accountType} 
        organizationName={user.organizationName}
      />
    ),
    userMenuComponent: (
      <UserMenu 
        firstName={user.firstName}
        lastName={user.lastName}
        onLogout={handleLogout}
      />
    ),
    moreMenuComponent: moreMenuItems.length > 0 ? (
      <HeaderDropdown 
        trigger={moreMenuTrigger}
        items={moreMenuItems}
      />
    ) : undefined,
    menuItems: [
      // { name: 'WORKSPACE', href: ROUTES.WORKSPACE.ROOT }, // Temporarily hidden
      { name: 'PROJECT RATINGS', href: ROUTES.RATINGS.PROJECTS },
      { name: 'EXCHANGE RATINGS', href: ROUTES.RATINGS.EXCHANGES },
    ],
    searchComponent: headerProps?.searchComponent ?? <PlatformSearch onOpenSearch={openSearchModal} />,
    sticky: true,
  } : null;

  // Default footer props with translated tagline
  const defaultFooterProps: FooterProps = {
    ...getDefaultFooterPropsBase(openCooperationModal),
    tagline: footerTagline,
  };

  // Get default header props (unauthenticated)
  const defaultHeaderProps = getDefaultHeaderProps(openCooperationModal);

  // Merge header props based on auth state
  const baseMerged = isAuthenticated && authenticatedHeaderProps ? {
    ...authenticatedHeaderProps,
    ...headerProps,
    menuItems: activeMenuItem
      ? authenticatedHeaderProps.menuItems?.map((item) => ({
          ...item,
          active: item.href === activeMenuItem,
        }))
      : authenticatedHeaderProps.menuItems,
  } : {
    ...defaultHeaderProps,
    ...headerProps,
    searchComponent: headerProps?.searchComponent ?? <PlatformSearch onOpenSearch={openSearchModal} />,
    menuItems: activeMenuItem
      ? defaultHeaderProps.menuItems?.map((item) => ({
          ...item,
          active: item.href === activeMenuItem,
        }))
      : defaultHeaderProps.menuItems,
  };

  // When not authenticated, wire Connect Wallet to Freighter
  const mergedHeaderProps: HeaderProps = isAuthenticated
    ? baseMerged
    : {
        ...baseMerged,
        ctaText: isWalletConnecting
          ? 'Connecting...'
          : walletAddress && walletTruncated
            ? walletTruncated
            : 'CONNECT WALLET',
        ctaTextMobile: walletAddress && walletTruncated ? walletTruncated : 'CONNECT',
        onCtaClick: walletAddress ? disconnectWallet : () => void connectWallet(),
      };

  // Merge default footer props with overrides
  const mergedFooterProps: FooterProps = {
    ...defaultFooterProps,
    ...footerProps,
  };

  // Loading state
  if (isLoading) {
    return (
      <PlatformLayout>
        <div css={styles.loadingContainer}>
          <div
            css={styles.loadingSpinner}
            role="status"
            aria-label={
              page === 'project'
                ? t('projects:projects.layout.loading', 'Loading projects ratings...')
                : t('exchanges:exchanges.layout.loading', 'Loading exchanges ratings...')
            }
          />
          <p css={styles.loadingText}>
            {page === 'project'
              ? t('projects:projects.layout.loading', 'Loading projects ratings...')
              : t('exchanges:exchanges.layout.loading', 'Loading exchanges ratings...')}
          </p>
        </div>
      </PlatformLayout>
    );
  }

  // Error state
  if (error) {
    const errorMessage =
      page === 'project'
        ? t(
            'projects:projects.layout.error.message',
            'We couldn\'t load the projects ratings. Please try again.'
          )
        : t(
            'exchanges:exchanges.layout.error.message',
            'We couldn\'t load the exchanges ratings. Please try again.'
          );

    return (
      <PlatformLayout>
        <div css={styles.errorContainer}>
          <h1 css={styles.errorTitle}>
            {page === 'project'
              ? t('projects:projects.layout.error.title', 'Unable to Load Project')
              : t('exchanges:exchanges.layout.error.title', 'Unable to Load Exchange')}
          </h1>
          <p css={styles.errorMessage}>
            {error instanceof Error ? error.message : errorMessage}
          </p>
          <div css={styles.errorActions}>
            <Core3Button onClick={() => refetch?.()}>
              {t('layout.retry', 'Retry')}
            </Core3Button>
            <Core3Button
              variant="secondary"
              onClick={() =>
                router.push(
                  page === 'project'
                    ? ROUTES.RATINGS.PROJECTS
                    : ROUTES.RATINGS.EXCHANGES
                )
              }
            >
              {page === 'project'
                ? t('projects:projects.layout.backToProjects', 'Back to Project Ratings')
                : t(
                    'exchanges:exchanges.layout.backToExchanges',
                    'Back to Exchange Ratings'
                  )}
            </Core3Button>
          </div>
        </div>
      </PlatformLayout>
    );
  }

  return (
    <CooperationModalContext.Provider value={{ openCooperationModal }}>
      <Layout
        headerProps={mergedHeaderProps}
        footerProps={mergedFooterProps}
        {...layoutProps}
      >
        {children}
      </Layout>

      {/* Cooperation Modal */}
      <CooperationModal open={cooperationModalOpen} onClose={handleCooperationClose}>
        <CooperationForm
          title={formConfig.title}
          fields={dynamicFormFields}
          defaultValues={formConfig.defaultValues}
          onSubmit={handleCooperationSubmit}
          onClose={handleCooperationClose}
          submitButtonText={formConfig.submitButtonText}
          cancelButtonText={formConfig.cancelButtonText}
          infoMessage={getInfoMessage}
          captchaRef={captchaRef}
          captchaToken={captchaToken}
          onCaptchaChange={setCaptchaToken}
          submissionError={submitError}
          isSubmitting={isSubmitting}
          optionsLoading={optionsLoading}
        />
      </CooperationModal>

      {/* Search Modal - single instance for both desktop and mobile */}
      <SearchModal open={searchModalOpen} onClose={closeSearchModal} />
    </CooperationModalContext.Provider>
  );
}
