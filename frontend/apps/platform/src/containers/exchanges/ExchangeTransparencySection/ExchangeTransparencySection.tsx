/** @jsxImportSource @emotion/react */
'use client';

import React from 'react';
import { TransparencySection } from '@/types/api/exchange';
import {
  Badge,
  Card,
  DataText,
  Section,
  SectionRank,
  DonutChart,
  DataTable,
} from '@core3/ui-components';
import { AnimatePresence, motion } from 'motion/react';
import { useTranslation } from 'react-i18next';
import { formatAmount, formatDate } from '@/utils/format';
import type { ColumnConfig } from '@core3/ui-components';
import { colors } from '@core3/ui-components/styleSystem';
import * as styles from './ExchangeTransparencySection.styles';
import { MobileReservesMockup } from './MobileReservesMockup';

interface ExchangeTransparencySectionProps {
  id: string;
  data?: TransparencySection;
}

// Helper function to get color for donut chart legend
const getDonutColor = (_ticker: string, index: number): string => {
  const defaultColors = [
    colors.chart.operational,
    colors.chart.reputational,
    colors.chart.regulatory,
    colors.chart.security,
    colors.chart.financial,
    colors.chart.dependency,
  ];
  return defaultColors[index % defaultColors.length];
};

const ExchangeTransparencySection: React.FC<ExchangeTransparencySectionProps> = ({
  id,
  data: transparencyData,
}) => {
  const { t } = useTranslation();

  // Mocked blurred data for reserves table (3 rows)
  const mockedReservesTableData = [
    {
      ticker: 'BNB',
      address: '34xp4vRoCGJq3sGtSM7reGLVQgYemvqU2J',
      amount: 248597.58,
      valueUsd: 28267298124.76,
    },
    {
      ticker: 'BTC',
      address: '34xp4vRoCGJq3sGtSM7reGLVQgYemvqU2J',
      amount: 248597.58,
      valueUsd: 28267298124.76,
    },
    {
      ticker: 'USDT',
      address: '34xp4vRoCGJq3sGtSM7reGLVQgYemvqU2J',
      amount: 248597.58,
      valueUsd: 28267298124.76,
    },
  ];

  // Mocked blurred data for donut chart
  const mockedDonutChartData = [
    { name: 'BNB', value: 31 },
    { name: 'BTC', value: 18 },
    { name: 'USDT', value: 13 },
    { name: 'USDC', value: 8 },
  ];

  // Create columns config for reserves table with blurred rendering
  const reservesColumnsConfig: ColumnConfig<typeof mockedReservesTableData[0]>[] = [
    {
      key: 'ticker',
      name: t('exchanges.transparency.reserves.table.columns.asset', 'Asset'),
      type: 'custom',
      render: (value, row) => {
        const ticker = value as string;
        const address = row.address;
        // Get color for asset icon
        const assetColors = [
          colors.semantic.success,
          colors.chart.financial,
          colors.chart.operational,
          colors.accent.green,
        ];
        const colorIndex = mockedReservesTableData.findIndex((r) => r.ticker === ticker);
        const iconColor = assetColors[colorIndex % assetColors.length];
        return (
          <div css={styles.assetRowWrapper}>
            <div css={styles.assetIconWithColor(iconColor)} />
            <div css={styles.assetInfoWrapper}>
              <span css={styles.assetName}>
                {t('exchanges.transparency.reserves.table.assetName', 'Asset Name')}
              </span>
              <span css={styles.assetAddress}>
                {address.slice(0, 10)}...{address.slice(-10)}
              </span>
            </div>
          </div>
        );
      },
    },
    {
      key: 'amount',
      name: t('exchanges.transparency.reserves.table.columns.balance', 'Balance'),
      type: 'custom',
      render: (value) => {
        const amount = value as number;
        return (
          <span css={styles.balanceCell}>
            {amount.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </span>
        );
      },
    },
    {
      key: 'valueUsd',
      name: t('exchanges.transparency.reserves.table.columns.value', 'Value'),
      type: 'custom',
      render: (value) => {
        const valueUsd = value as number;
        return (
          <span css={styles.valueCell}>
            {formatAmount(valueUsd, { prefix: '$', compact: false, decimalPlaces: 2 })}
          </span>
        );
      },
    },
  ];

  const sectionRank = {
    value: transparencyData?.score.current || 0,
    maxValue: transparencyData?.score.max,
    description: transparencyData?.score.label,
  };

  return (
    <Section
      id={id}
      title={t('exchanges.transparency.title', 'Transparency')}
      iconName="eye-open"
      headerContent={
        <SectionRank
          value={sectionRank.value || t('common.unknown', 'NA')}
          maxValue={sectionRank.maxValue || 100} // TODO: Remove this when we have the max value
          description={sectionRank.description}
        />
      }
      areas={[
        ['walletTracking', 'lastLiabilities'],
        ['reserves', 'reserves'],
      ]}
      rows={['auto', '1fr']}
    >
      <Card title={t('exchanges.transparency.walletTracking', 'Wallet Tracking')}>
        <DataText>
          {transparencyData?.isWalletTrackingPresent
            ? t('common.yes', 'Yes')
            : t('common.no', 'No')}
        </DataText>
      </Card>
      <Card title={t('exchanges.transparency.lastLiabilitiesSnapshot', 'Last Liabilities Snapshot')}>
        <DataText disabled={!transparencyData?.lastLiabilitiesSnapshot?.totalUsd}>
          {transparencyData?.lastLiabilitiesSnapshot?.totalUsd
            ? formatAmount(transparencyData.lastLiabilitiesSnapshot.totalUsd, {
                prefix: '$',
                compact: true,
                decimalPlaces: 1,
              })
            : t('common.unknown', 'N/A')}
        </DataText>
        {transparencyData?.lastLiabilitiesSnapshot?.date && (
          <div css={styles.lastLiabilitiesDateWrapper}>
            <span css={styles.lastLiabilitiesDate}>
              ({formatDate(transparencyData.lastLiabilitiesSnapshot.date)})
            </span>
          </div>
        )}
      </Card>
      <Card
        title={t('exchanges.transparency.reserves', 'Reserves')}
        rightContent={
          <Badge color="gray" size="large" mono>
            {t('common.comingSoon', 'COMING SOON')}
          </Badge>
        }
        css={styles.reservesCard}
      >
        <div css={styles.reservesContentWrapper}>
          {/* Desktop: Full DataTable and DonutChart */}
          <div css={styles.desktopReserves}>
            <div css={styles.reservesTableWrapper}>
              <div css={styles.tableContainer}>
                <DataTable
                  data={mockedReservesTableData}
                  columnsConfig={reservesColumnsConfig}
                  enablePagination={false}
                />
              </div>
              <div css={styles.distributionCard}>
                <div css={styles.distributionTitle}>
                  {t('exchanges.transparency.reserves.distribution', 'Distribution')}
                </div>
                <div css={styles.donutChartWrapper}>
                  <DonutChart data={mockedDonutChartData} size={126} />
                </div>
                <div css={styles.legendWrapper}>
                  {mockedDonutChartData.map((item) => {
                    const dotColor = getDonutColor(item.name, mockedDonutChartData.indexOf(item));
                    return (
                      <div key={item.name} css={styles.legendItem}>
                        <div css={styles.legendItemLeft}>
                          <div css={styles.legendDotWithColor(dotColor)} />
                          <span css={styles.legendLabel}>{item.name}</span>
                        </div>
                        <span css={styles.legendValue}>{item.value}%</span>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
          
          {/* Mobile: Simplified mockup */}
          <div css={styles.mobileReserves}>
            <MobileReservesMockup />
          </div>
          
          <AnimatePresence>
            <motion.div
              css={styles.comingSoonOverlay}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
            >
              <motion.h3 css={styles.comingSoonTitle}>
                {t('common.comingSoonDataBlock', 'This Data is Coming Soon')}
              </motion.h3>
              <motion.p css={styles.comingSoonSubtitle}>
                {t(
                  'exchanges.transparency.reserves.comingSoonSubtitle',
                  'Is this your exchange? Create an account to submit your wallets data'
                )}
              </motion.p>
              <div css={styles.comingSoonButtonWrapper}>
                <button
                  css={styles.comingSoonButton}
                  onClick={() => {
                    // TODO: Handle button click - navigate to account creation
                    console.log('Create exchange account clicked');
                  }}
                >
                  {t('exchanges.transparency.reserves.createAccount', 'CREATE EXCHANGE ACCOUNT')}
                </button>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      </Card>
    </Section>
  );
};

export default ExchangeTransparencySection;

