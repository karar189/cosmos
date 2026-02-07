/** @jsxImportSource @emotion/react */
'use client';

import { Regulatory } from '@/types/api/project';
import {
  Card,
  DataList,
  DataListItemData,
  DataText,
  Icon,
  Section,
  SectionRank,
} from '@core3/ui-components';
import * as styles from './ProjectRegulatorySection.styles';
import { useTranslation } from 'react-i18next';
import { formatAmount } from '@/utils/format';

interface ProjectRegulatorySectionProps {
  id: string;
  data?: Regulatory;
}

const ProjectRegulatorySection: React.FC<ProjectRegulatorySectionProps> = ({
  id,
  data: regulatoryData,
}) => {
  const { t } = useTranslation(['projects', 'common']);
  const hasLegal = regulatoryData?.isLegalPresent;
  const hasPublicRegistration = regulatoryData?.isPublicRegistrationPresent;
  const hasTeamTransparency = regulatoryData?.isTeamTransparencyPublic;
  const hasOperatesUnderRegulations = regulatoryData?.operatesUnderRegulations;

  const sectionRank = {
    value: formatAmount(regulatoryData?.score.current || 0, { decimalPlaces: 1 }),
    maxValue: regulatoryData?.score.max,
    description: regulatoryData?.score.label,
  };
  const regulatoryControlsList: DataListItemData[] = [
    {
      label: t('details.regulatory.regulatorySurfaceControls.kycPresent.label', 'KYC Present'),
      tooltip: t(
        'details.regulatory.regulatorySurfaceControls.kycPresent.tooltip',
        'Know Your Customer process'
      ),
      checked: regulatoryData?.regulatorySurfaceControls?.isKycPresented,
      negative: !regulatoryData?.regulatorySurfaceControls?.isKycPresented,
    },
    {
      label: t('details.regulatory.regulatorySurfaceControls.kytPresent.label', 'KYT Present'),
      tooltip: t(
        'details.regulatory.regulatorySurfaceControls.kytPresent.tooltip',
        'Know Your Transaction process'
      ),
      checked: regulatoryData?.regulatorySurfaceControls?.isKytPresented,
      negative: !regulatoryData?.regulatorySurfaceControls?.isKytPresented,
    },
  ];

  return (
    <>
      {/* Desktop Layout */}
      <div css={styles.desktopLayout}>
        <Section
          id={id}
          title={t('details.regulatory.title', 'Regulatory')}
          headerContent={
            <SectionRank
              value={sectionRank.value}
              maxValue={sectionRank.maxValue}
              description={sectionRank.description}
            />
          }
          columns={3}
          iconName="bank"
        >
      <Card title={t('details.regulatory.controls.label', 'Regulatory Surface Controls')}>
        <DataList items={regulatoryControlsList} horizontal />
      </Card>
      <Card
        title={t('details.regulatory.jurisdictionQuality.label', 'Jurisdiction Quality')}
        tooltip={t(
          'details.regulatory.jurisdictionQuality.tooltip',
          'Based on the complexity of obtaining legal status within a given jurisdiction'
        )}
      >
        <DataText disabled={!regulatoryData?.jurisdictionQuality}>{regulatoryData?.jurisdictionQuality ?? t('common:nA', 'N/A')}</DataText>
      </Card>
      <Card title={t('details.regulatory.legal.label', 'Legal / T&C')}>
        <DataText positive={hasLegal === true} negative={hasLegal === false} disabled={hasLegal === undefined}>
          {hasLegal === undefined
            ? t('common:nA', 'N/A')
            : hasLegal
              ? t('common:present.yes', 'Present')
              : t('common:present.no', 'Not Present')}
        </DataText>
      </Card>
      <Card title={t('details.regulatory.publicRegistration.label', 'Public Registration')}>
        <DataText
          positive={hasPublicRegistration === true}
          negative={hasPublicRegistration === false}
          disabled={hasPublicRegistration === undefined}
        >
          {hasPublicRegistration === undefined
            ? t('common:nA', 'N/A')
            : hasPublicRegistration
              ? t('common:present.yes', 'Present')
              : t('common:present.no', 'Not Present')}
        </DataText>
      </Card>
      <Card title={t('details.regulatory.teamTransparency.label', 'Team Transparency')}>
        <DataText positive={hasTeamTransparency === true} negative={hasTeamTransparency === false} disabled={hasTeamTransparency === undefined}>
          {hasTeamTransparency === undefined
            ? t('common:nA', 'N/A')
            : hasTeamTransparency
              ? t('common:public', 'Public')
              : t('common:private', 'Private')}
        </DataText>
      </Card>
      <Card
        title={t('details.regulatory.operatesUnderRegulations.label', 'Operates under Regulation')}
      >
        <DataText
          positive={hasOperatesUnderRegulations === true}
          negative={hasOperatesUnderRegulations === false}
          disabled={hasOperatesUnderRegulations === undefined}
        >
          {hasOperatesUnderRegulations === undefined
            ? t('common:nA', 'N/A')
            : hasOperatesUnderRegulations
              ? t('common:yes', 'Yes')
              : t('common:no', 'No')}
        </DataText>
      </Card>
        </Section>
      </div>

      {/* Mobile Layout */}
      <div css={styles.mobileLayout}>
        {/* Section Header */}
        <div css={styles.mobileHeader}>
          <div css={styles.mobileHeaderLeft}>
            <Icon name="bank" css={styles.mobileHeaderIcon} />
            <h2 css={styles.mobileHeaderTitle}>{t('details.regulatory.title', 'Regulatory')}</h2>
            <div css={styles.scoreBadge}>{sectionRank.value}/{sectionRank.maxValue}</div>
          </div>
          <p css={styles.mobileHeaderDescription}>{sectionRank.description}</p>
        </div>

        {/* Regulatory Surface Controls */}
        <Card title={t('details.regulatory.controls.label', 'Regulatory Surface Controls')}>
          <DataList items={regulatoryControlsList} horizontal />
        </Card>

        {/* Jurisdiction Quality */}
        <Card
          title={t('details.regulatory.jurisdictionQuality.label', 'Jurisdiction Quality')}
          tooltip={t(
            'details.regulatory.jurisdictionQuality.tooltip',
            'Based on the complexity of obtaining legal status within a given jurisdiction'
          )}
        >
          <DataText>{regulatoryData?.jurisdictionQuality ?? t('common:nA', 'N/A')}</DataText>
        </Card>

        {/* Legal / T&C */}
        <Card title={t('details.regulatory.legal.label', 'Legal / T&C')}>
          <DataText positive={hasLegal === true} negative={hasLegal === false}>
            {hasLegal === undefined
              ? t('common:nA', 'N/A')
              : hasLegal
                ? t('common:present.yes', 'Present')
                : t('common:present.no', 'Not Present')}
          </DataText>
        </Card>

        {/* Public Registration */}
        <Card title={t('details.regulatory.publicRegistration.label', 'Public Registration')}>
          <DataText
            positive={hasPublicRegistration === true}
            negative={hasPublicRegistration === false}
          >
            {hasPublicRegistration === undefined
              ? t('common:nA', 'N/A')
              : hasPublicRegistration
                ? t('common:present.yes', 'Present')
                : t('common:present.no', 'Not Present')}
          </DataText>
        </Card>

        {/* Team Transparency */}
        <Card title={t('details.regulatory.teamTransparency.label', 'Team Transparency')}>
          <DataText positive={hasTeamTransparency === true} negative={hasTeamTransparency === false}>
            {hasTeamTransparency === undefined
              ? t('common:nA', 'N/A')
              : hasTeamTransparency
                ? t('common:public', 'Public')
                : t('common:private', 'Private')}
          </DataText>
        </Card>

        {/* Operates under Regulation */}
        <Card
          title={t('details.regulatory.operatesUnderRegulations.label', 'Operates under Regulation')}
        >
          <DataText
            positive={hasOperatesUnderRegulations === true}
            negative={hasOperatesUnderRegulations === false}
          >
            {hasOperatesUnderRegulations === undefined
              ? t('common:nA', 'N/A')
              : hasOperatesUnderRegulations
                ? t('common:yes', 'Yes')
                : t('common:no', 'No')}
          </DataText>
        </Card>
      </div>
    </>
  );
};

export default ProjectRegulatorySection;
