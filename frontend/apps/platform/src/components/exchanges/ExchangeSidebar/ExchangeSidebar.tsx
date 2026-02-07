/** @jsxImportSource @emotion/react */
'use client';

import { BadgesRowCard, RiskChangesCard, ScoreCard } from '@/components/common/Sidebar';
import useTranslation from '@/hooks/useTranslation';
import { ExchangeApiResponse } from '@/types/api/exchange';
import { Sidebar } from '@core3/ui-components';
import {
  aboutLabelsList,
  buildAboutExchangeRows,
  buildDisclosuresExchangeRows,
  disclosuresLabelsList,
} from './exchangeSidebar.utils';

export interface ExchangeSidebarProps {
  /**
   * Complete API response data
   */
  data: ExchangeApiResponse;
}

export default function ExchangeSidebar({ data }: ExchangeSidebarProps) {
  const { t } = useTranslation('sidebar');

  const { exchangeDetails } = data;

  const aboutLables: aboutLabelsList = {
    users: t('labels.users', 'Users'),
    dateOfOperation: t('labels.dateOfOperation', 'Date of Operation'),
    jurisdiction: t('labels.jurisdiction', 'Jurisdiction'),
    listedAssets: t('labels.listedAssets', 'Listed Assets'),
    documentation: t('labels.documentation', 'Documentation'),
    audits: t('labels.audits', 'Audits'),
    socials: t('labels.socials', 'Socials'),
  };
  const disclosuresLabels: disclosuresLabelsList = {
    policies: t('labels.policies', 'Policies & Reports'),
    attestations: t('labels.attestations', 'Attestations'),
    legal: t('labels.legalDocs', 'Legal Docs'),
  };
  // Build rows for BadgesRowCard components
  const aboutRows = buildAboutExchangeRows(exchangeDetails, aboutLables);
  const disclosuresRows = buildDisclosuresExchangeRows(exchangeDetails, disclosuresLabels);

  return (
    <Sidebar
      title={t('title.exchange', 'Security Score')}
    >
      {/* Security Score Card with Gauge, Data Coverage, Risk Metrics, and Chart */}
      <ScoreCard data={exchangeDetails.security} isSecurityScore={true} />

      {/* Risk Changes with Top Risks / Recent Changes tabs */}
      <RiskChangesCard data={exchangeDetails.newsFeed} />

      {/* About Exchange */}
      <BadgesRowCard
        title={`${t('sections.aboutTitle', 'About')} ${exchangeDetails.name}`}
        rows={aboutRows}
        description={exchangeDetails.description}
      />

      {/* Disclosures - only show if there are items */}
      {disclosuresRows.length > 0 && (
        <BadgesRowCard title={t('sections.disclosuresTitle', 'Disclosures')} rows={disclosuresRows} />
      )}
    </Sidebar>
  );
}
