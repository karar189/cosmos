import { CommonDateFormats, formatDate } from '@/utils/formatters/date-format';
import { BadgesRowCardRow, BadgeInfo } from '@/components/common/Sidebar/BadgesRowCard/BadgesRowCard';
import { ProjectDetails } from '@/types/api/project';
import { getSocialPlatformName } from '@/utils/formatters/social-media';
import { formatUrl } from '@/utils/format';

export type aboutLabelsList = {
  chains: string;
  category: string;
  tags: string;
  launchedAt: string;
  website: string;
  socials: string;
  ucid: string;
};
/**
 * Build About Project rows from API data
 */
export const buildAboutProjectRows = (
  projectDetails: ProjectDetails,
  labels: aboutLabelsList
): BadgesRowCardRow[] => {
  const rows: BadgesRowCardRow[] = [];

  // Chains row
  if (projectDetails.chains && projectDetails.chains.length > 0) {
    const badges: BadgeInfo[] = projectDetails.chains.map((chain) => ({
      value: chain.name,
      iconSrc: chain.logo ?? undefined,
    }));

    rows.push({
      label: labels.chains,
      value: {
        type: 'badges',
        badges,
        badgeStyle: 'text-icon',
      },
    });
  }

  // Category row
  if (projectDetails.category) {
    rows.push({
      label: labels.category,
      value: {
        type: 'badge',
        value: projectDetails.category,
        badgeStyle: 'text',
      },
    });
  }

  // Tags row
  if (projectDetails.tags && projectDetails.tags.length > 0) {
    const badges: BadgeInfo[] = projectDetails.tags.map((tag) => ({
      value: tag,
    }));

    rows.push({
      label: labels.tags,
      value: {
        type: 'badges',
        badges,
        badgeStyle: 'text',
      },
    });
  }

  // Launched At row
  if (projectDetails.launchedAt) {
    rows.push({
      label: labels.launchedAt,
      value: {
        type: 'text',
        value: formatDate(
          new Date(projectDetails.launchedAt),
          CommonDateFormats.LONG_MONTH_DAY_YEAR
        ),
      },
    });
  }

  // Website row
  if (projectDetails.website?.url) {
    rows.push({
      label: labels.website,
      value: {
        type: 'badge',
        value: formatUrl(projectDetails.website.url),
        badgeStyle: 'text',
        href: projectDetails.website.url,
      },
    });
  }

  // Socials row
  if (projectDetails.socials && projectDetails.socials.length > 0) {
    const badges: BadgeInfo[] = projectDetails.socials.map((social) => ({
      value: getSocialPlatformName(social.url),
      iconSrc: social.logo ?? undefined,
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

  // UCID row
  if (projectDetails.ucid) {
    rows.push({
      label: labels.ucid,
      value: {
        type: 'text',
        value: projectDetails.ucid.toString(),
      },
    });
  }

  return rows;
};

export type disclosureLabelsList = {
  whitepaper: string;
  legal: string;
  audits: string;
};
/**
 * Build Disclosures rows from API data
 */
export const buildDisclosuresRows = (
  projectDetails: ProjectDetails,
  labels: disclosureLabelsList
): BadgesRowCardRow[] => {
  const rows: BadgesRowCardRow[] = [];
  const { disclosures } = projectDetails;

  // Whitepaper row
  if (disclosures.whitepaper?.url) {
    rows.push({
      label: labels.whitepaper,
      value: {
        type: 'badge',
        value: formatUrl(disclosures.whitepaper.url),
        badgeStyle: 'text',
        href: disclosures.whitepaper.url,
      },
    });
  }

  // Legal row
  if (disclosures.legal?.url) {
    rows.push({
      label: labels.legal,
      value: {
        type: 'badge',
        value: formatUrl(disclosures.legal.url),
        badgeStyle: 'text',
        href: disclosures.legal.url,
      },
    });
  }

  // Audits row
  if (disclosures.audits && disclosures.audits.length > 0) {
    const badges: BadgeInfo[] = disclosures.audits.map((audit) => ({
      value: audit.auditor.name,
      iconSrc: audit.auditor.logo ?? undefined,
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

  return rows;
};
