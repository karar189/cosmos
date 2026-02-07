/** @jsxImportSource @emotion/react */
'use client';

import React from 'react';
import { SolvencySection } from '@/types/api/exchange';
import {
  Card,
  DataList,
  DataListItemData,
  DataText,
  Section,
  SectionRank,
  BarChart,
} from '@core3/ui-components';
import { useTranslation } from 'react-i18next';
import { useChartDimensions } from '@/components/charts/shared/useChartDimensions';

interface ExchangeSolvencySectionProps {
  id: string;
  data?: SolvencySection;
}

const ExchangeSolvencySection: React.FC<ExchangeSolvencySectionProps> = ({
  id,
  data: solvencyData,
}) => {
  const { t } = useTranslation();
  const { smallBarChartHeight, smallBarSize } = useChartDimensions();

  const proofOfReservesList: DataListItemData[] = solvencyData?.proofOfReserves
    ? [
        {
          label: t('exchanges.solvency.proofOfReserves.porAudit', 'PoR Audit'),
          checked: solvencyData.proofOfReserves.isProofOfReservesAuditPresent,
        },
        {
          label: t('exchanges.solvency.proofOfReserves.proofOfOwnership', 'Proof of Ownership'),
          checked: solvencyData.proofOfReserves.isProofOfOwnerPresent,
        },
        {
          label: t('exchanges.solvency.proofOfReserves.userScope', 'User Scope'),
          tooltip: t(
            'exchanges.solvency.proofOfReserves.userScopeTooltip',
            'Percentage of users included into the Proof of Reserves audit report'
          ),
          value: solvencyData.proofOfReserves.userScope,
        },
        {
          label: t('exchanges.solvency.proofOfReserves.assetComposition', 'Asset Composition'),
          tooltip: t(
            'exchanges.solvency.proofOfReserves.assetCompositionTooltip',
            'Reserve structure assets composition analysis'
          ),
          value: solvencyData.proofOfReserves.assetComposition,
        },
        {
          label: t('exchanges.solvency.proofOfReserves.regulatory', 'Regulatory'),
          tooltip: t(
            'exchanges.solvency.proofOfReserves.regulatoryTooltip',
            'Proof of Reserves auditing frequency'
          ),
          value: solvencyData.proofOfReserves.regulatory,
        },
        {
          label: t('exchanges.solvency.proofOfReserves.merkleTree', 'Merkle Tree'),
          tooltip: t(
            'exchanges.solvency.proofOfReserves.merkleTreeTooltip',
            'A cryptographic proof of client balances, enabling anyone to verify anonymously that an exchange holds their funds and that their account balances are included in the Proof of Reserves'
          ),
          value: solvencyData.proofOfReserves.merkleTree,
        },
      ]
    : [];

  // Transform liabilityVsReserves data for BarChart
  // Format: "2024" for January, "Jul" for July
  const liabilityVsReservesData =
    solvencyData?.liabilityVsReserves?.points?.map((point) => {
      // Parse date string directly to avoid timezone issues
      // Format: "2024-01-01" or "2024-07-01"
      const [year, month] = point.date.split('-').map(Number);
      // Show year for January (month 1), "Jul" for July (month 7)
      const label = month === 1 ? String(year) : 'Jul';
      return {
        x: label,
        value: point.percentage,
      };
    }) || [];

  const sectionRank = {
    value: solvencyData?.score.current || 0,
    maxValue: solvencyData?.score.max,
    description: solvencyData?.score.label,
  };

  // Pre-compute display values to reduce ternary usage in render
  const auditUsersCoverageDisplay = solvencyData?.auditUsersCoverage?.percentage
    ? `${solvencyData.auditUsersCoverage.percentage}%`
    : t('common.unknown', 'N/A');
  const isAuditCoverageDisabled = !solvencyData?.auditUsersCoverage?.percentage;

  const rehypothecationLabel = solvencyData?.rehypothecationPolicy?.label ?? t('common.unknown', 'N/A');
  const isRehypothecationDisabled = !solvencyData?.rehypothecationPolicy?.label;
  const isRehypothecationPositive = solvencyData?.rehypothecationPolicy?.severity === 'low';
  const isRehypothecationNegative = solvencyData?.rehypothecationPolicy?.severity === 'high';

  return (
    <Section
      id={id}
      title={t('exchanges.solvency.title', 'Solvency')}
      iconName="bank"
      headerContent={
        <SectionRank
          value={sectionRank.value || t('common.unknown', 'NA')}
          maxValue={sectionRank.maxValue}
          description={sectionRank.description}
        />
      }
      areas={[
        ['proofOfReserves', 'auditCoverage', 'liabilityVsReserves'],
        ['proofOfReserves', 'rehypothecation', 'liabilityVsReserves'],
      ]}
    >
      <Card title={t('exchanges.solvency.proofOfReserves.title', 'Proof of Reserves')}>
        <DataList items={proofOfReservesList} />
      </Card>
      <Card title={t('exchanges.solvency.auditUsersCoverage', 'Audit Users Coverage')}>
        <DataText mono disabled={isAuditCoverageDisabled}>{auditUsersCoverageDisplay}</DataText>
      </Card>
      <Card title={t('exchanges.solvency.liabilityVsReserves', 'Liability vs Reserves')}>
        {liabilityVsReservesData.length > 0 ? (
          <BarChart
            data={liabilityVsReservesData}
            height={smallBarChartHeight}
            yAxisLabelFormatter={(value) => `${value}%`}
            tooltipFormatter={(value) => [`${value}%`, 'Percentage']}
            barSize={smallBarSize}
          />
        ) : (
          <DataText>{t('common.noData', 'No data available')}</DataText>
        )}
      </Card>
      <Card title={t('exchanges.solvency.rehypothecationPolicy', 'Rehypothecation policy')}>
        <DataText positive={isRehypothecationPositive} negative={isRehypothecationNegative} disabled={isRehypothecationDisabled}>
          {rehypothecationLabel}
        </DataText>
      </Card>
    </Section>
  );
};

export default ExchangeSolvencySection;

