import { getSocialPlatformName } from '@/utils/formatters/social-media';
import { BadgesRowCardRow, BadgeInfo } from '@/components/common/Sidebar/BadgesRowCard/BadgesRowCard';
import { ExchangeDetails } from '@/types/api/exchange';
import { formatUrl } from '@/utils/format';

/**
 * Format number with suffix (M for millions)
 */
const formatUserCount = (users: number): string => {
  if (users >= 1000000) {
    return `${(users / 1000000).toFixed(0)}M+`;
  }
  if (users >= 1000) {
    return `${(users / 1000).toFixed(0)}K+`;
  }
  return users.toString();
};

/**
 * Format date to year
 */
const formatDateOfOperation = (dateString: string): string => {
  try {
    const date = new Date(dateString);
    return date.getFullYear().toString();
  } catch {
    return dateString;
  }
};

export type aboutLabelsList = {
  users: string;
  dateOfOperation: string;
  jurisdiction: string;
  listedAssets: string;
  documentation: string;
  audits: string;
  socials: string;
}
/**
 * Build About Exchange rows from API data
 */
export const buildAboutExchangeRows = (exchangeDetails: ExchangeDetails, labels:aboutLabelsList): BadgesRowCardRow[] => {
  const rows: BadgesRowCardRow[] = [];

  // Users row
  if (exchangeDetails.users) {
    rows.push({
      label: labels.users,
      value: {
        type: 'text',
        value: formatUserCount(exchangeDetails.users),
      },
    });
  }

  // Date of Operation row
  if (exchangeDetails.dateOfOperation) {
    rows.push({
      label: labels.dateOfOperation,
      value: {
        type: 'text',
        value: formatDateOfOperation(exchangeDetails.dateOfOperation),
      },
    });
  }

  // Jurisdiction row
  if (exchangeDetails.jurisdiction) {
    rows.push({
      label: labels.jurisdiction,
      value: {
        type: 'text',
        value: exchangeDetails.jurisdiction,
      },
    });
  }

  // Listed Assets Count row
  if (exchangeDetails.listedAssetsCount) {
    rows.push({
      label: labels.listedAssets,
      value: {
        type: 'text',
        value: exchangeDetails.listedAssetsCount.toString(),
      },
    });
  }

  // Documentation row
  if (exchangeDetails.documentation) {
    rows.push({
      label: labels.documentation,
      value: {
        type: 'badge',
        value: formatUrl(exchangeDetails.documentation),
        badgeStyle: 'text',
        href: exchangeDetails.documentation,
      },
    });
  }

  // Audits row
  if (exchangeDetails.audits && exchangeDetails.audits.length > 0) {
    const badges: BadgeInfo[] = exchangeDetails.audits.map(audit => ({
      value: audit.auditor.name,
      iconSrc: audit.auditor.logo,
      href: audit.report.url,
    }));

    rows.push({
      label: labels.audits,
      value: {
        type: 'badges',
        badges,
        badgeStyle: 'text-icon',
      },
    });
  }

  // Socials row
  if (exchangeDetails.socials && exchangeDetails.socials.length > 0) {
    const badges: BadgeInfo[] = exchangeDetails.socials.map(social => ({
      value: getSocialPlatformName(social.url),
      iconSrc: social.logo,
      href: social.url,
    }));

    rows.push({
      label: labels.socials,
      value: {
        type: 'badges',
        badges,
        badgeStyle: 'icon',
      },
    });
  }

  return rows;
};

export type disclosuresLabelsList = {
  policies: string;
  attestations: string;
  legal: string;
}

/**
 * Build Disclosures rows from API data
 */
export const buildDisclosuresExchangeRows = (exchangeDetails: ExchangeDetails, labels: disclosuresLabelsList): BadgesRowCardRow[] => {
  const rows: BadgesRowCardRow[] = [];
  const { disclosures } = exchangeDetails;

  // Check if disclosures exists before accessing its properties
  if (!disclosures) {
    return rows;
  }

  // Policies & Reports row
  if (disclosures.policies?.url) {
    rows.push({
      label: labels.policies,
      value: {
        type: 'badge',
        value: disclosures.policies.url,
        badgeStyle: 'text',
      },
    });
  }

  // Attestations row
  if (disclosures.attestations?.url) {
    rows.push({
      label: labels.attestations,
      value: {
        type: 'badge',
        value: disclosures.attestations.url,
        badgeStyle: 'text',
      },
    });
  }

  // Legal Docs row
  if (disclosures.legal?.url) {
    rows.push({
      label: labels.legal,
      value: {
        type: 'badge',
        value: disclosures.legal.url,
        badgeStyle: 'text',
      },
    });
  }

  return rows;
};
