/** @jsxImportSource @emotion/react */
'use client';

import React from 'react';
import { SecuritySection } from '@/types/api/exchange';
import {
  Badge,
  Card,
  DataList,
  DataListItemData,
  DataText,
  Section,
  SectionRank,
  Icon,
  Tooltip,
} from '@core3/ui-components';
import { useTranslation } from 'react-i18next';
import * as sectionStyles from './ExchangeSecuritySection.styles';

interface ExchangeSecuritySectionProps {
  id: string;
  data?: SecuritySection;
}

const ExchangeSecuritySection: React.FC<ExchangeSecuritySectionProps> = ({
  id,
  data: securityData,
}) => {
  const { t } = useTranslation();

  const serverSecurityList: DataListItemData[] = securityData?.server
    ? [
        {
          label: t('exchanges.security.server.sslTlsCertificate', 'SSL/TLS Certificate'),
          tooltip: t(
            'exchanges.security.server.sslTlsCertificateTooltip',
            "Ensures secure data transmission between user browsers and the exchange's servers by encrypting communications"
          ),
          value:
            securityData.server.sslTlsCertificate.score === null ||
            securityData.server.sslTlsCertificate.score === undefined ||
            securityData.server.sslTlsCertificate.maxScore === null ||
            securityData.server.sslTlsCertificate.maxScore === undefined
              ? t('common.unknown', 'N/A')
              : `${securityData.server.sslTlsCertificate.score}/${securityData.server.sslTlsCertificate.maxScore}`,
          ...(securityData.server.sslTlsCertificate.score ===
          securityData.server.sslTlsCertificate.maxScore
            ? { checked: true }
            : securityData.server.sslTlsCertificate.score === null ||
              securityData.server.sslTlsCertificate.score === undefined
            ? { negative: true }
            : {}),
        },
        {
          label: t('exchanges.security.server.wafCdn', 'WAF / CDN'),
          tooltip: t('exchanges.security.server.wafCdnTooltip', 'Protects against web-based threats while enhancing website performance and availability globally'),
          ...(securityData.server.wasCdn.score === securityData.server.wasCdn.maxScore
            ? { checked: true }
            : securityData.server.wasCdn.score === null ||
              securityData.server.wasCdn.score === undefined
            ? { negative: true }
            : {}),
        },
        {
          label: t('exchanges.security.server.spfDnssec', 'SPF & DNSSEC'),
          tooltip: t('exchanges.security.server.spfDnssecTooltip', 'Validates email sources to prevent spoofing and secures DNS queries against tampering, respectively'),
          checked: true, // Assuming present if in data
        },
        {
          label: t('exchanges.security.server.httpHeaders', 'HTTP headers'),
          tooltip: t('exchanges.security.server.httpHeadersTooltip', 'Utilize security directives in web communications to protect users from common vulnerabilities like cross-site scripting and clickjacking'),
          checked: true, // Present if in data structure
        },
        {
          label: t('exchanges.security.server.spamDbPresence', 'Spam DB Presence'),
          value: securityData.server.spamDbPresence,
        },
      ]
    : [];

  const userSecurityList: DataListItemData[] = securityData?.user
    ? [
        {
          label: t('exchanges.security.user.twoFactor', '2‑factor authentication'),
          ...(securityData.user.isTwoFactorAuthenticationPresent
            ? { checked: true }
            : { negative: true }),
        },
        {
          label: t('exchanges.security.user.antiPhishing', 'Anti‑phishing code'),
          ...(securityData.user.isAntiPhishingProtectionPresent
            ? { checked: true }
            : { negative: true }),
        },
        {
          label: t('exchanges.security.user.withdrawalWhitelist', 'Withdrawal whitelist'),
          ...(securityData.user.isWithdrawalWhitelistingPresent
            ? { checked: true }
            : { negative: true }),
        },
        {
          label: t('exchanges.security.user.captcha', 'Captcha'),
          ...(securityData.user.isCaptchaProtectionPresent
            ? { checked: true }
            : { negative: true }),
        },
        {
          label: t('exchanges.security.user.deviceManagement', 'Device Management'),
          value: securityData.user.deviceManagement,
        },
      ]
    : [];

  const bugBountyList: DataListItemData[] = securityData?.bugBounty
    ? [
        {
          label: t('exchanges.security.bugBounty.status', 'Status'),
          tooltip: t('exchanges.security.bugBounty.statusTooltip', 'The hosting party of the bug bounty program'),
          value: securityData.bugBounty.status.label,
        },
        {
          label: t('exchanges.security.bugBounty.payoutRange', 'Payout Range'),
          tooltip: t('exchanges.security.bugBounty.payoutRangeTooltip', 'Reward range of the bug bounty program'),
          value: securityData.bugBounty.payoutRange,
        },
        {
          label: t('exchanges.security.bugBounty.provider', 'Bug Bounty Provider'),
          value: (
            <Badge
              size="small"
              iconSrc={securityData.bugBounty.provider.logo ?? undefined}
              href={securityData.bugBounty.provider.url}
              target="_blank"
              rel="noopener noreferrer"
            >
              {securityData.bugBounty.provider.name}
            </Badge>
          ),
        },
      ]
    : [];

  const certificationsList: DataListItemData[] =
    securityData?.server.certificationTags?.map((cert) => ({
      label: cert.value && cert.value.toLowerCase() !== 'yes' ? `${cert.label} ${cert.value}` : cert.label,
      tooltip: cert.tooltip,
      checked: true,
    })) || [];

  const sectionRank = {
    value: securityData?.score.current || 0,
    maxValue: securityData?.score.max,
    description: securityData?.score.label,
  };

  return (
    <Section
      id={id}
      title={t('exchanges.security.title', 'Security')}
      iconName="security"
      headerContent={
        <SectionRank
          value={sectionRank.value}
          maxValue={sectionRank.maxValue}
          description={sectionRank.description}
        />
      }
      areas={[
        ['serverSecurity', 'userSecurity', 'penetrationTest'],
        ['serverSecurity', 'userSecurity', 'insurance'],
        ['serverSecurity', 'userSecurity', 'bugBounty'],
        ['certifications', 'certifications', 'certifications'],
      ]}
    >
      <Card title={t('exchanges.security.serverSecurity', 'Server Security')}>
        <DataList items={serverSecurityList} />
        {securityData?.server?.cookieFlags && securityData.server.cookieFlags.length > 0 && (
          <div css={sectionStyles.cookieFlagsSection}>
            <span css={sectionStyles.cookieFlagsLabel}>
              {t('exchanges.security.server.cookieFlags', 'Cookie Flags')}
            </span>
            <div css={sectionStyles.badgeContainer}>
              {securityData.server.cookieFlags.map((flag) => (
                <Badge key={flag} size="small" color="white">
                  {flag.replace(/\s+/g, '')}
                </Badge>
              ))}
            </div>
          </div>
        )}
      </Card>
      <Card title={t('exchanges.security.userSecurity', 'User Security')}>
        <DataList items={userSecurityList} />
        {securityData?.user?.passwordRequirements && securityData.user.passwordRequirements.length > 0 && (
          <div css={sectionStyles.cookieFlagsSection}>
            <span css={sectionStyles.cookieFlagsLabel}>
              {t('exchanges.security.user.passwordRequirements', 'Password Requirements')}
            </span>
            <div css={sectionStyles.badgeContainer}>
              {securityData.user.passwordRequirements.map((req) => (
                <Badge key={req} size="small" color="white">
                  {req}
                </Badge>
              ))}
            </div>
          </div>
        )}
      </Card>
      <Card title={t('exchanges.security.penetrationTest.title', 'Penetration Test')}>
        <div css={sectionStyles.penetrationRow}>
          <DataText disabled={!securityData?.penetrationTest?.coverage?.percentage}>
            {securityData?.penetrationTest?.coverage?.percentage
              ? `${securityData.penetrationTest.coverage.percentage}%`
              : t('common.unknown', 'N/A')}
          </DataText>
          <span css={sectionStyles.penetrationLabel}>
            {t('exchanges.security.penetrationTest.coverage', 'Score Coverage')}
          </span>
        </div>
      </Card>
      <Card title={t('exchanges.security.insuranceFund', 'Insurance Fund')}>
        <DataText positive={securityData?.isInsuranceFundPresent} negative={!securityData?.isInsuranceFundPresent}>
          {securityData?.isInsuranceFundPresent
            ? t('common.present', 'Present')
            : t('common.notPresent', 'Not Present')}
        </DataText>
      </Card>
      <Card title={t('exchanges.security.bugBountySection.title', 'Bug Bounty')}>
        <DataList items={bugBountyList} />
      </Card>
      <Card
        title={t('exchanges.security.certifications', 'Certifications')}
        tooltip={t('exchanges.security.certificationsTooltip', 'Security certifications and compliance standards achieved by the exchange')}
      >
        <div css={sectionStyles.certificationsRow}>
          {certificationsList.map((cert, index) => (
            <div key={index} css={sectionStyles.certificationItem}>
              <Icon name="check-circle" css={sectionStyles.certificationCheckmark} />
              <span css={sectionStyles.certificationLabel}>
                {cert.label}
              </span>
              {cert.tooltip && (
                <Tooltip
                  title={cert.tooltip}
                  tooltipIconCss={sectionStyles.certificationTooltipIcon}
                />
              )}
            </div>
          ))}
        </div>
      </Card>
    </Section>
  );
};

export default ExchangeSecuritySection;

