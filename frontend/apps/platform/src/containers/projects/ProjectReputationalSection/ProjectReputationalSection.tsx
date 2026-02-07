/** @jsxImportSource @emotion/react */
'use client';

import ProjectReputation from '@/components/projects/ProjectReputation/ProjectReputation';
import {
  Card,
  DataList,
  DataListItemData,
  DataText,
  GaugeChart,
  Icon,
  Section,
  SectionRank,
} from '@core3/ui-components';
import { useTranslation } from 'react-i18next';

import SocialFraudInfo from '@/components/common/SocialFraudInfo/SocialFraudInfo';
import { useChartDimensions } from '@/components/charts/shared/useChartDimensions';
import { Reputational } from '@/types/api/project';
import { getTwitterScoreByStatus } from '@/utils/charts/gaugeUtils';
import { formatAmount } from '@/utils/format';
import * as styles from './ProjectReputationalSection.styles';

interface ProjectReputationalSectionProps {
  id: string;
  data?: Reputational;
}

const ProjectReputationalSection: React.FC<ProjectReputationalSectionProps> = ({
  id,
  data: reputationalData,
}) => {
  const { t } = useTranslation(['projects', 'common']);
  const { smallGaugeSize } = useChartDimensions();

  const incidentsReactionList: DataListItemData[] = [
    {
      label: t('details.reputational.pastIncidentsReaction.mediaReactions', 'Media Reactions'),
      value: reputationalData?.pastIncidentsReaction?.mediaReactions || t('common.nA', 'N/A'),
    },
    {
      label: t('details.reputational.pastIncidentsReaction.rootCauseFixed', 'Root Cause Fixed'),
      value: reputationalData?.pastIncidentsReaction
        ? reputationalData.pastIncidentsReaction.isRootCauseFixed
          ? t('common:yes', 'Yes')
          : t('common:no', 'No')
        : t('common.nA', 'N/A'),
    },
  ];

  const redFlagsList: DataListItemData[] = [
    {
      label: t('details.reputational.redFlags.mmRedFlags', 'MM Red Flags'),
      value: reputationalData?.redFlags?.mmRedFlags,
    },
    {
      label: t('details.reputational.redFlags.investorRedFlags', 'Investor Red Flags'),
      value: reputationalData?.redFlags?.investorRedFlags,
    },
  ];

  const longevityList: DataListItemData[] = [
    {
      label: t('details.reputational.longevity.projectLaunchedAt', 'Project Launched At'),
      value: reputationalData?.longevity?.projectLaunchedAt,
    },
    {
      label: t('details.reputational.longevity.protocolLaunchedAt', 'Protocol Launched At'),
      value: reputationalData?.longevity?.protocolLaunchedAt,
    },
  ];
  const insuranceList: DataListItemData[] = [
    {
      label: t('details.reputational.insurance.custody', 'Custody'),
      value: reputationalData?.insurance?.custody,
    },
    {
      label: t('details.reputational.insurance.coverage', 'Coverage'),
      value: reputationalData?.insurance?.coverage,
    },
  ];

  const sectionRank = {
    value: formatAmount(reputationalData?.score?.current || 0, { decimalPlaces: 1 }),
    maxValue: reputationalData?.score.max,
    description: reputationalData?.score.label,
  };

  const twitterScore = reputationalData?.social?.twitter?.score;

  return (
    <>
      {/* Desktop Layout */}
      <div css={styles.desktopLayout}>
        <Section
          id={id}
          iconName="data-flow"
          title={t('details.reputational.title', 'Reputational')}
          headerContent={
            <SectionRank
              value={sectionRank.value}
              maxValue={sectionRank.maxValue}
              description={sectionRank.description}
            />
          }
          areas={[
            ['audit', 'reaction', 'redFlags', 'longevity'],
            ['social', 'social', 'social', ' insurance'],
          ]}
        >
      <Card title={t('details.reputational.auditReputation.label', 'Audit Firm Reputation')}>
        <div css={styles.auditReputationContainer}>
          <DataText>{t('details.reputational.auditReputation.topTier', 'Top-Tier')}</DataText>
          <ProjectReputation project={reputationalData?.auditReputation?.topAuditor} />
        </div>
      </Card>
      <Card
        title={t('details.reputational.pastIncidentsReaction.label', 'Past Incidents Reaction')}
      >
        <DataList items={incidentsReactionList} />
      </Card>
      <Card title={t('details.reputational.redFlags.label', 'Red Flags')}>
        <DataList items={redFlagsList} />
      </Card>
      <Card title={t('details.reputational.longevity.label', 'Longevity')}>
        <DataList items={longevityList} />
      </Card>
      <Card title={t('details.reputational.social.label', 'Social Fraud')}>
        <div css={styles.socialFraudContainer}>
          <GaugeChart
            value={getTwitterScoreByStatus(twitterScore)}
            label={reputationalData?.social?.twitter?.label}
            status={reputationalData?.social?.twitter?.score}
            size={smallGaugeSize}
          />
          <SocialFraudInfo data={reputationalData?.social} />
        </div>
      </Card>
      <Card title={t('details.reputational.insurance.label', 'Insurance')}>
        <DataList items={insuranceList} />
      </Card>
        </Section>
      </div>

      {/* Mobile Layout */}
      <div css={styles.mobileLayout}>
        {/* Section Header */}
        <div css={styles.mobileHeader}>
          <div css={styles.mobileHeaderLeft}>
            <Icon name="data-flow" css={styles.mobileHeaderIcon} />
            <h2 css={styles.mobileHeaderTitle}>{t('details.reputational.title', 'Reputational')}</h2>
            <div css={styles.scoreBadge}>{sectionRank.value}/{sectionRank.maxValue}</div>
          </div>
          <p css={styles.mobileHeaderDescription}>{sectionRank.description}</p>
        </div>

        {/* Audit Firm Reputation */}
        <Card title={t('details.reputational.auditReputation.label', 'Audit Firm Reputation')}>
          <div css={styles.auditReputationContainer}>
            <DataText>{t('details.reputational.auditReputation.topTier', 'Top-Tier')}</DataText>
            <ProjectReputation project={reputationalData?.auditReputation?.topAuditor} />
          </div>
        </Card>

        {/* Past Incidents Reaction */}
        <Card
          title={t('details.reputational.pastIncidentsReaction.label', 'Past Incidents Reaction')}
        >
          <DataList items={incidentsReactionList} />
        </Card>

        {/* Red Flags */}
        <Card title={t('details.reputational.redFlags.label', 'Red Flags')}>
          <DataList items={redFlagsList} />
        </Card>

        {/* Longevity */}
        <Card title={t('details.reputational.longevity.label', 'Longevity')}>
          <DataList items={longevityList} />
        </Card>

        {/* Social Fraud */}
        <Card title={t('details.reputational.social.label', 'Social Fraud')}>
          <div css={styles.socialFraudContainer}>
            <div css={styles.socialFraudGaugeWrapper}>
              <GaugeChart
                value={getTwitterScoreByStatus(twitterScore)}
                label={reputationalData?.social?.twitter?.label}
                status={reputationalData?.social?.twitter?.score}
                size={smallGaugeSize}
              />
            </div>
            <SocialFraudInfo data={reputationalData?.social} />
          </div>
        </Card>

        {/* Insurance */}
        <Card title={t('details.reputational.insurance.label', 'Insurance')}>
          <DataList items={insuranceList} />
        </Card>
      </div>
    </>
  );
};

export default ProjectReputationalSection;
