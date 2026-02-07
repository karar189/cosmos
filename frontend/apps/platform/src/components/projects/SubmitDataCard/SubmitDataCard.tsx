/** @jsxImportSource @emotion/react */
'use client';

import { useState } from 'react';
import { Alert, CardContainer, Core3Button, Icon } from '@core3/ui-components';
import { copyToClipboard, getEmailTemplate, openEmailClient } from '@/utils/emailTemplate';
import useTranslation from '@/hooks/useTranslation';
import * as styles from './SubmitDataCard.styles';

export interface SubmitDataCardProps {
  /**
   * Project name to use in the email template
   * @default '<PROJECT_NAME>'
   */
  projectName?: string;
}

/**
 * SubmitDataCard Component
 * 
 * Displays information and tools for submitting project data to CORE3.
 * Includes:
 * - Email template with copy functionality
 * - Quick email client launcher
 * - Warning alert about corporate email
 * 
 * @example
 * ```tsx
 * <SubmitDataCard projectName="Uniswap" />
 * ```
 */
export default function SubmitDataCard({ projectName = '<PROJECT_NAME>' }: SubmitDataCardProps) {
  const { t } = useTranslation('projects');
  const [copied, setCopied] = useState(false);
  const [emailCopied, setEmailCopied] = useState(false);
  
  const emailTemplate = getEmailTemplate({
    greeting: t('submitData.emailTemplate.greeting', 'Dear CORE3 team,'),
    message: t('submitData.emailTemplate.message', "I'm contacting you on behalf of {{projectName}} to provide documentation to improve our data coverage and PoL rating in CORE3, following your Project Data Submission Guide (insurance/custody, monitoring, treasury contracts, licenses, audits, etc.).", { projectName }),
    closing: t('submitData.emailTemplate.closing', 'Please let me know if you require any specific formats or additional details for {{projectName}}', { projectName }),
  });
  const emailAddress = 'data-submissions@core3.io';
  const emailSubject = t('submitData.emailSubject', 'Data Submission for {{projectName}}', { projectName });

  const handleCopy = async () => {
    const success = await copyToClipboard(emailTemplate);
    if (success) {
      setCopied(true);
      setTimeout(() => setCopied(false), 500);
    }
  };

  const handleOpenEmail = () => {
    openEmailClient(emailAddress, emailSubject, emailTemplate);
  };

  const handleCopyEmail = async () => {
    const success = await copyToClipboard(emailAddress);
    if (success) {
      setEmailCopied(true);
      setTimeout(() => setEmailCopied(false), 2000);
    }
  };

  return (
    <CardContainer paddingSize="l" css={styles.container}>
      <h2 css={styles.title}>{t('submitData.title', 'Submit Data')}</h2>
      
      <div css={styles.emailSection}>
        <div css={styles.emailLabel}>
          <span css={styles.emailLabelText}>
            {t('submitData.sendEmailTo', 'Send email to')}{' '}
            <a href={`mailto:${emailAddress}`} css={styles.emailLink}>
              {emailAddress}
            </a>
          </span>
          <div css={styles.copyIconWrapper}>
            <button
              css={styles.copyIconButton}
              onClick={handleCopyEmail}
              aria-label={t('submitData.ariaLabels.copyEmail', 'Copy email address')}
            >
              <Icon name="copy" />
            </button>
            {emailCopied && (
              <span css={styles.copiedTooltip}>
                {t('submitData.copied', 'Copied!')}
              </span>
            )}
          </div>
        </div>

        <p css={styles.instructionsText}>
          {t('submitData.instructions', 'Copy and paste the message below to your email, or open email client:')}
        </p>

        <div css={styles.templateBox}>
          <p css={styles.templateText}>{emailTemplate}</p>

          <div css={styles.buttonsRow}>
            <button css={styles.copyButtonWrapper} onClick={handleCopy}>
              <Icon name="copy" css={styles.copyIcon} />
              <span css={styles.buttonText}>
                {copied ? t('submitData.copied', 'COPIED!') : t('submitData.copy', 'COPY')}
              </span>
            </button>

            <Core3Button onClick={handleOpenEmail} variant="primary" animated size="small">
              {t('submitData.openEmailClient', 'OPEN EMAIL CLIENT')}
            </Core3Button>
          </div>
        </div>
      </div>

      <Alert severity="warning">
        {t('submitData.warning', 'Please ensure you use a corporate email address associated with this project, so we can verify your identity')}
      </Alert>
    </CardContainer>
  );
}

