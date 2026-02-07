/** @jsxImportSource @emotion/react */
'use client';

import { Security } from '@/types/api/project';
import { formatAmount } from '@/utils/format';
import {
  Badge,
  Card,
  DataList,
  DataListItemData,
  DataText,
  Icon,
  Section,
  SectionRank,
  Toggle,
  ToggleOption,
} from '@core3/ui-components';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import * as styles from './ProjectSecuritySection.styles';
import ProjectSecurityTable from './ProjectSecurityTable';

/**
 * Formats a date string into a localized format (e.g., "Jan 15, 2024")
 */
function formatDate(dateString: string): string {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
}

/**
 * Gets the badge color based on severity
 */
function getFixedFindingsColor(severity?: string): 'green' | 'yellow' | 'orange' | 'red' | 'gray' {
  switch (severity) {
    case 'low':
      return 'green';
    case 'medium':
      return 'yellow';
    case 'high':
      return 'orange';
    case 'critical':
      return 'red';
    default:
      return 'gray';
  }
}

interface ProjectSecuritySectionProps {
  id: string;
  data?: Security;
  isTokenProject: boolean;
  onScrollToAudits?: () => void;
}

const ProjectSecuritySection: React.FC<ProjectSecuritySectionProps> = ({
  id,
  data: securityData,
  isTokenProject,
  onScrollToAudits,
}) => {
  const { t } = useTranslation(['projects', 'common']);

  const toggleOptions: ToggleOption<string>[] = [
    {
      label: t('details.security.toggle.tokenAudits', 'Token Audits'),
      value: 'tokenAudits',
    },
    {
      label: t('details.security.toggle.productAudits', 'Product Audits'),
      value: 'productAudits',
    },
  ];

  const [selectedToggle, setSelectedToggle] = useState(
    isTokenProject && securityData?.audits?.token?.length
      ? toggleOptions[0].value
      : toggleOptions[1].value
  );

  const bugBountyList: DataListItemData[] = [
    {
      label: t('details.security.bugBounty.custody.label', 'Custody'),
      tooltip: t('details.security.bugBounty.custody.tooltip', 'Custody Tooltip'),
      value: securityData?.bugBounty?.custody || t('common:nA', 'N/A'),
    },
    {
      label: t('details.security.bugBounty.payoutPolicy.label', 'Payout Policy'),
      tooltip: t('details.security.bugBounty.payoutPolicy.tooltip', 'Payout Policy Tooltip'),
      value: securityData?.bugBounty?.payoutPolicy || t('common:nA', 'N/A'),
    },
    {
      label: t('details.security.bugBounty.attestationSla.label', 'Attestation (SLA)'),
      tooltip: t('details.security.bugBounty.attestationSla.tooltip', 'Attestation (SLA) Tooltip'),
      value: securityData?.bugBounty?.isAttestationSlaPresent
        ? t('common:yes', 'Yes')
        : t('common:no', 'No'),
    },
    {
      label: t('details.security.bugBounty.provider.label', 'Bug Bounty Provider'),
      value: securityData?.bugBounty?.provider ? (
        <Badge
          href={securityData?.bugBounty?.provider?.url}
          target="_blank"
          rel="noopener noreferrer"
          size="small"
          iconSrc={securityData?.bugBounty?.provider?.logo}
        >
          {securityData?.bugBounty?.provider?.name}
        </Badge>
      ) : (
        t('common:nA', 'N/A')
      ),
    },
  ];

  const onBadgeClick = () => {
    onScrollToAudits?.();
    setSelectedToggle('tokenAudits');
  };

  const tokenContractsList: DataListItemData[] = [
    {
      label: t('details.security.tokenContracts.isVerifiedOnChain.label', 'Verified on Chain'),
      checked: securityData?.tokenContracts?.isVerifiedOnChain,
      negative: !securityData?.tokenContracts?.isVerifiedOnChain,
      tooltip: t(
        'details.security.tokenContracts.isVerifiedOnChain.tooltip',
        'Verified on Chain Tooltip'
      ),
    },
    {
      label: t('details.security.tokenContracts.audited', 'Audited'),
      checked: !!securityData?.audits?.token?.length,
      negative: !securityData?.audits?.token?.length,
      value: securityData?.audits?.token?.length ? (
        <Badge size="small" onClick={onBadgeClick}>
          {t('details.security.tokenContracts.viewAudits', 'View {{count}} audits', {
            count: securityData?.audits?.token?.length,
          })}
          <Icon name="chevron-right" css={styles.chevronRightIcon} />
        </Badge>
      ) : null,
    },
  ];

  const sectionRank = {
    value: formatAmount(securityData?.score.current || 0, { decimalPlaces: 1 }),
    maxValue: securityData?.score.max,
    description: securityData?.score.label,
  };

  // Get the audits data based on selected toggle
  const auditsData = (() => {
    if (selectedToggle === 'tokenAudits') {
      return securityData?.audits?.token ?? [];
    }
    return securityData?.audits?.product ?? [];
  })();

  return (
    <>
      {/* Desktop Layout */}
      <div css={styles.desktopLayout}>
        <Section
          id={id}
          title={t('details.security.title', 'Security')}
          iconName="security"
          headerContent={
            <SectionRank
              value={sectionRank.value}
              maxValue={sectionRank.maxValue}
              description={sectionRank.description}
            />
          }
          areas={
            isTokenProject
              ? [
                  ['audits', 'audits', 'audits'],
                  ['bounty', 'contracts', 'monitoring'],
                ]
              : [
                  ['audits', 'audits'],
                  ['bounty', 'monitoring'],
                ]
          }
        >
          <Card
            css={styles.tableCard}
            title={isTokenProject ? null : t('details.security.toggle.productAudits', 'Product Audits')}
          >
            {isTokenProject && (
              <Toggle
                css={styles.toggle}
                size="medium"
                value={selectedToggle}
                onChange={setSelectedToggle}
                options={toggleOptions}
              />
            )}
            <ProjectSecurityTable data={auditsData} />
          </Card>
          <Card title={t('details.security.bounty', 'Bug Bounty')}>
            <DataList items={bugBountyList} />
          </Card>
          {isTokenProject && (
            <Card title={t('details.security.contracts', 'Token Contracts')}>
              <DataList items={tokenContractsList} />
            </Card>
          )}
          <Card
            title={t('details.security.monitoring.label', '3rd Party Monitoring')}
            tooltip={t('details.security.monitoring.tooltip', '3rd Party Monitoring Tooltip')}
          >
            <DataText
              positive={securityData?.thirdPartyMonitoring?.severity === 'low'}
              negative={securityData?.thirdPartyMonitoring?.severity === 'high'}
            >
              {securityData?.thirdPartyMonitoring?.label ?? t('common.unknown', 'N/A')}
            </DataText>
          </Card>
        </Section>
      </div>

      {/* Mobile Layout */}
      <div css={styles.mobileLayout}>
        {/* Section Header */}
        <div css={styles.mobileHeader}>
          <div css={styles.mobileHeaderLeft}>
            <Icon name="security" css={styles.mobileHeaderIcon} />
            <h2 css={styles.mobileHeaderTitle}>{t('details.security.title', 'Security')}</h2>
            <div css={styles.scoreBadge}>{sectionRank.value}/{sectionRank.maxValue}</div>
          </div>
          <p css={styles.mobileHeaderDescription}>{sectionRank.description}</p>
        </div>

        {/* Audits Section */}
        <div css={styles.mobileSectionCard}>
          {isTokenProject && (
            <Toggle
              css={styles.toggle}
              size="medium"
              value={selectedToggle}
              onChange={setSelectedToggle}
              options={toggleOptions}
            />
          )}
          
          {/* Render each audit as a card */}
          {auditsData.map((audit, index) => (
            <div key={index} css={styles.mobileAuditCard}>
            {/* Auditor */}
            <div css={styles.auditHeader}>
              <div css={styles.auditorLogoMobile}>
                {audit.auditor.logo && <img src={audit.auditor.logo} alt={audit.auditor.name} />}
              </div>
              <span css={styles.auditorNameMobile}>{audit.auditor.name}</span>
            </div>

            {/* Date */}
            <div css={styles.auditRow}>
              <span css={styles.auditLabel}>{t('details.security.audits.columns.date.label', 'Date')}</span>
              <span css={styles.auditValue}>{formatDate(audit.date)}</span>
            </div>

            {/* Findings Fixed */}
            <div css={styles.auditRow}>
              <div css={styles.auditLabelWithTooltip}>
                <span css={styles.auditLabel}>
                  {t('details.security.audits.columns.findingsFixed.label', 'Findings Fixed')}
                </span>
                <Icon name="info" css={styles.infoIcon} />
              </div>
              {audit.fixedFindings ? (
                <Badge size="small" color={getFixedFindingsColor(audit.fixedFindings.severity)}>
                  {audit.fixedFindings.label}
                </Badge>
              ) : (
                <span css={styles.naText}>{t('common:nA', 'N/A')}</span>
              )}
            </div>

            {/* Audit Code Access */}
            <div css={styles.auditRow}>
              <div css={styles.auditLabelWithTooltip}>
                <span css={styles.auditLabel}>
                  {t('details.security.audits.columns.auditCodeAccess.label', 'Audit Code Access')}
                </span>
                <Icon name="info" css={styles.infoIcon} />
              </div>
              <div css={styles.presentCellMobile}>
                <Icon
                  name={audit.isAuditCodeAccessPresent ? 'check-circle' : 'negative-circle'}
                  css={[styles.checkIconMobile, !audit.isAuditCodeAccessPresent && styles.negativeIconMobile]}
                />
                <span>
                  {audit.isAuditCodeAccessPresent
                    ? t('common:present.yes', 'Present')
                    : t('common:absent', 'Absent')}
                </span>
              </div>
            </div>

            {/* Relevancy */}
            <div css={styles.auditRow}>
              <div css={styles.auditLabelWithTooltip}>
                <span css={styles.auditLabel}>
                  {t('details.security.audits.columns.relevancy.label', 'Relevancy')}
                </span>
                <Icon name="info" css={styles.infoIcon} />
              </div>
              <div css={styles.presentCellMobile}>
                {audit.isChanged && <Icon name="warning-triangle" css={styles.warningIconMobile} />}
                <span>
                  {audit.isChanged
                    ? t('common:changed.yes', 'Relevant')
                    : t('common:changed.no', 'Relevant')}
                </span>
              </div>
            </div>
          </div>
        ))}
        </div>

        {/* Bug Bounty */}
        <Card title={t('details.security.bounty', 'Bug Bounty')}>
          <DataList items={bugBountyList} />
        </Card>

        {/* Token Contracts */}
        {isTokenProject && (
          <Card title={t('details.security.contracts', 'Token Contracts')}>
            <DataList items={tokenContractsList} />
          </Card>
        )}

        {/* 3rd Party Monitoring */}
        <Card
          title={t('details.security.monitoring.label', '3rd Party Monitoring')}
          tooltip={t('details.security.monitoring.tooltip', '3rd Party Monitoring Tooltip')}
        >
          <DataText
            positive={securityData?.thirdPartyMonitoring?.severity === 'low'}
            negative={securityData?.thirdPartyMonitoring?.severity === 'high'}
          >
            {securityData?.thirdPartyMonitoring?.label ?? t('common.unknown', 'N/A')}
          </DataText>
        </Card>
      </div>
    </>
  );
};

export default ProjectSecuritySection;
