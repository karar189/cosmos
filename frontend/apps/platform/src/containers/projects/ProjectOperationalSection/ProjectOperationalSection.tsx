/** @jsxImportSource @emotion/react */
'use client';

import { Operational } from '@/types/api/project';
import { formatAmount, formatUrl } from '@/utils/format';
import {
  Badge,
  Card,
  DataList,
  DataListItemData,
  DataText,
  HeatMap,
  HeatMapLegend,
  HeatMapLegendRef,
  HeatMapRef,
  Icon,
  Section,
  SectionRank,
  SingleLineChart,
} from '@core3/ui-components';
import { useRef } from 'react';
import { useTranslation } from 'react-i18next';
import * as styles from './ProjectOperationalSection.styles';

const SINGLE_LINE_CHART_HEIGHT = 200;

interface ProjectOperationalSectionProps {
  id: string;
  data?: Operational;
  isTokenProject: boolean;
}

const ProjectOperationalSection: React.FC<ProjectOperationalSectionProps> = ({
  id,
  data: operationalData,
  isTokenProject,
}) => {
  const heatMapLegendRef = useRef<HeatMapLegendRef>(null);
  const heatMapRef = useRef<HeatMapRef>(null);
  const { t } = useTranslation();

  const teamTrackRecordsList: DataListItemData[] = [
    {
      label: t('details.operational.teamTrackRecords.isEducationRelevant', 'Education'),
      value: operationalData?.teamTrackRecords?.isEducationRelevant
        ? t('common:relevant.yes', 'Relevant')
        : t('common:relevant.no', 'Not Relevant'),
      checked: operationalData?.teamTrackRecords?.isEducationRelevant,
    },
    {
      label: t('details.operational.teamTrackRecords.isWorkExperienceRelevant', 'Work Experience'),
      value: operationalData?.teamTrackRecords?.isWorkExperienceRelevant
        ? t('common:relevant.yes', 'Relevant')
        : t('common:relevant.no', 'Not Relevant'),
      checked: operationalData?.teamTrackRecords?.isWorkExperienceRelevant,
    },
    {
      label: t(
        'details.operational.teamTrackRecords.isBusinessExperienceRelevant',
        'Business Experience'
      ),
      value: operationalData?.teamTrackRecords?.isBusinessExperienceRelevant
        ? t('common:relevant.yes', 'Relevant')
        : t('common:relevant.no', 'Not Relevant'),
      checked: operationalData?.teamTrackRecords?.isBusinessExperienceRelevant,
    },
  ];

  const liquidityRisksList: DataListItemData[] = [
    {
      label: t('details.operational.liquidityRisks.dexLpToMcap', 'DEX LP to MCap'),
      value: operationalData?.liquidityRisks?.dexLpToMcap,
    },
    {
      label: t('details.operational.liquidityRisks.cexVolToMcap', 'CEX Vol to MCap'),
      value: operationalData?.liquidityRisks?.cexVolToMcap,
    },
    {
      label: t('details.operational.liquidityRisks.orderbookToMcap', 'Orderbook to MCap'),
      value: operationalData?.liquidityRisks?.orderbookToMcap,
    },
    {
      label: t('details.operational.liquidityRisks.cexQuality', 'CEX Quality'),
      value: operationalData?.liquidityRisks?.cexQuality,
    },
    {
      label: t('details.operational.liquidityRisks.dexLpState', 'DEX LP State'),
      value: operationalData?.liquidityRisks?.dexLpState,
    },
  ];

  const documentationList: DataListItemData[] =
    operationalData?.documentation?.map((doc) => ({
      label: doc.label,
      value: (
        <Badge
          size="small"
          css={styles.badge}
          href={doc.url}
          target="_blank"
          rel="noopener noreferrer"
        >
          {formatUrl(doc.url)}
        </Badge>
      ),
      checked: true,
    })) || [];

  const sectionRank = {
    value: formatAmount(operationalData?.score.current || 0, { decimalPlaces: 1 }),
    maxValue: operationalData?.score.max,
    description: operationalData?.score.label,
  };
  const certifications = operationalData?.certifications;
  const certificationsList: DataListItemData[] = [
    {
      label: t('details.operational.certifications.iso.label', 'ISO 27001'),
      ...(certifications?.iso ? { checked: true } : { negative: true }),
    },
    {
      label: t('details.operational.certifications.ccss.label', 'CCSS'),
      ...(certifications?.ccss ? { checked: true } : { negative: true }),
    },
  ];

  const githubHeatmapPoints = operationalData?.githubActivity?.heatmap?.points ?? [];
  const githubHeatmapIntensities = operationalData?.githubActivity?.heatmap?.intensities;
  const githubHeatmapDays = 28;
  
  const githubHeatmapEndDate = githubHeatmapPoints.length > 0
    ? githubHeatmapPoints
        .map((point) => new Date(point.date))
        .filter((date) => !Number.isNaN(date.getTime()))
        .sort((a, b) => b.getTime() - a.getTime())[0]?.toISOString().split('T')[0]
    : undefined;

  return (
    <>
      {/* Desktop Layout */}
      <div css={styles.desktopLayout}>
        <Section
          id={id}
          iconName="tools"
          title={t('details.operational.title', 'Operational')}
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
                  ['githubActivity', 'githubActivity', 'teamTrackRecords'],
                  ['liquidityRisks', 'documentation', 'washtrading'],
                  ['certifications', 'certifications', 'certifications'],
                ]
              : [
                  ['githubActivity', 'teamTrackRecords', 'documentation'],
                  ['certifications', 'certifications', 'certifications'],
                ]
          }
        >
      <Card
        title={t('details.operational.githubActivity.label', 'Github Activity')}
        rightContent={
          isTokenProject && (
            <HeatMapLegend
              intensities={githubHeatmapIntensities}
              nextLabel={t('common:more', 'More')}
              prevLabel={t('common:less', 'Less')}
              ref={heatMapLegendRef}
              heatMapRef={heatMapRef}
            />
          )
        }
      >
        <div css={styles.githubActivityCard({ isTokenProject })}>
          <DataText
            label={t('details.operational.githubActivity.lastWeekCommits', 'Last Week Commits')}
          >
            {operationalData?.githubActivity?.commitsCount7d ??
              t('common:nA', 'N/A')}
          </DataText>
          {!isTokenProject && (
            <HeatMapLegend
              css={styles.heatMapLegend}
              intensities={githubHeatmapIntensities}
              nextLabel={t('common:more', 'More')}
              prevLabel={t('common:less', 'Less')}
              ref={heatMapLegendRef}
              heatMapRef={heatMapRef}
            />
          )}
          <HeatMap
            css={styles.heatMap({ isTokenProject })}
            ref={heatMapRef}
            points={githubHeatmapPoints}
            intensityLevels={githubHeatmapIntensities}
            days={githubHeatmapDays}
            endDate={githubHeatmapEndDate}
            legendRef={heatMapLegendRef}
          />
        </div>
      </Card>
      <Card title={t('details.operational.teamTrackRecords.label', 'Team Track Records')}>
        <DataList items={teamTrackRecordsList} checkPosition="right" />
      </Card>
      {isTokenProject && (
        <Card title={t('details.operational.liquidityRisks.label', 'Liquidity Risks')}>
          <DataList items={liquidityRisksList} />
        </Card>
      )}
      <Card title={t('details.operational.documentation.label', 'Documentation')}>
        <DataList items={documentationList} />
      </Card>
      {isTokenProject && (
        <Card
          title={t('details.operational.washtrading.label', 'Washtrading')}
          tooltip={t(
            'details.operational.washtrading.tooltip',
            'Asset holdings to trading volume over time ratio'
          )}
        >
          <SingleLineChart
            height={SINGLE_LINE_CHART_HEIGHT}
            xAxisInterval="preserveStartEnd"
            emptyDescription={t('common:comingSoon', 'This Data is Coming Soon')}
          />
        </Card>
      )}
      <Card
        title={t('details.operational.certifications.label', 'Certifications')}
        tooltip={t(
          'details.operational.certifications.tooltip',
          'Security standards that guide companies in building strong internal policies, processes, and controls to reduce security risks'
        )}
      >
        <DataList
          css={styles.certificationsList}
          items={certificationsList}
          horizontal
          contentAlign="left"
        />
      </Card>
        </Section>
      </div>

      {/* Mobile Layout */}
      <div css={styles.mobileLayout}>
        {/* Section Header */}
        <div css={styles.mobileHeader}>
          <div css={styles.mobileHeaderLeft}>
            <Icon name="tools" css={styles.mobileHeaderIcon} />
            <h2 css={styles.mobileHeaderTitle}>{t('details.operational.title', 'Operational')}</h2>
            <div css={styles.scoreBadge}>{sectionRank.value}/{sectionRank.maxValue}</div>
          </div>
          <p css={styles.mobileHeaderDescription}>{sectionRank.description}</p>
        </div>

        {/* Github Activity */}
        <Card
          title={t('details.operational.githubActivity.label', 'Github Activity')}
          rightContent={
            isTokenProject && (
              <HeatMapLegend
              intensities={githubHeatmapIntensities}
                nextLabel={t('common:more', 'More')}
                prevLabel={t('common:less', 'Less')}
                ref={heatMapLegendRef}
                heatMapRef={heatMapRef}
              />
            )
          }
        >
          <div css={styles.githubActivityCard({ isTokenProject })}>
            <DataText
              label={t('details.operational.githubActivity.lastWeekCommits', 'Last Week Commits')}
            >
              {operationalData?.githubActivity?.commitsCount7d ??
                t('common:nA', 'N/A')}
            </DataText>
            {!isTokenProject && (
              <HeatMapLegend
                css={styles.heatMapLegend}
              intensities={githubHeatmapIntensities}
                nextLabel={t('common:more', 'More')}
                prevLabel={t('common:less', 'Less')}
                ref={heatMapLegendRef}
                heatMapRef={heatMapRef}
              />
            )}
            <HeatMap
              css={styles.heatMap({ isTokenProject })}
              ref={heatMapRef}
              points={githubHeatmapPoints}
              intensityLevels={githubHeatmapIntensities}
              days={githubHeatmapDays}
              endDate={githubHeatmapEndDate}
              legendRef={heatMapLegendRef}
            />
          </div>
        </Card>

        {/* Team Track Records */}
        <Card title={t('details.operational.teamTrackRecords.label', 'Team Track Record')}>
          <DataList items={teamTrackRecordsList} checkPosition="right" />
        </Card>

        {/* Liquidity Risks */}
        {isTokenProject && (
          <Card title={t('details.operational.liquidityRisks.label', 'Liquidity Risks')}>
            <DataList items={liquidityRisksList} />
          </Card>
        )}

        {/* Documentation */}
        <Card title={t('details.operational.documentation.label', 'Documentation')}>
          <DataList items={documentationList} />
        </Card>

        {/* Washtrading */}
        {isTokenProject && (
          <Card
            title={t('details.operational.washtrading.label', 'Washtrading')}
            tooltip={t(
              'details.operational.washtrading.tooltip',
              'Asset holdings to trading volume over time ratio'
            )}
          >
            <SingleLineChart
              height={SINGLE_LINE_CHART_HEIGHT}
              xAxisInterval="preserveStartEnd"
              emptyDescription={t('common:comingSoon', 'This Data is Coming Soon')}
            />
          </Card>
        )}

        {/* Certifications */}
        <Card
          title={t('details.operational.certifications.label', 'Certifications')}
          tooltip={t(
            'details.operational.certifications.tooltip',
            'Security standards that guide companies in building strong internal policies, processes, and controls to reduce security risks'
          )}
        >
          <DataList
            css={styles.certificationsList}
            items={certificationsList}
            horizontal
            contentAlign="left"
          />
        </Card>
      </div>
    </>
  );
};

export default ProjectOperationalSection;
