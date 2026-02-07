/** @jsxImportSource @emotion/react */
"use client";

import { formatAmount, formatPercentage } from "@/utils/format";
import { Card, DataValue, Section, BlurOverlay, Icon, SingleLineChart, Tooltip, formatDateLabel } from "@core3/ui-components";
import { useTranslation } from "react-i18next";
import { ExchangeApiResponse } from "@/types/api/exchange";
import { useExchangeTradeDetails } from "@/data/api/coinGecko.queries";
import ExchangeOverviewTradeVolumeChart from "./ExchangeOverviewTradeVolumeChart";
import GaugeChart from '@/components/common/Sidebar/ScoreCard/GaugeChart/GaugeChart';
import DataCoverageIndicator from '@/components/common/Sidebar/ScoreCard/DataCoverageIndicator/DataCoverageIndicator';
import { RiskMetricsList } from '@/components/common/Sidebar/ScoreCard/RiskChangesCard/RiskMetricList';
import RiskChangesCard from '@/components/common/Sidebar/ScoreCard/RiskChangesCard/RiskChangesCard';
import BadgesRowCard from '@/components/common/Sidebar/BadgesRowCard/BadgesRowCard';
import {
  transformToScoreCardProps,
  transformPolDynamicData,
} from '@/components/common/Sidebar/ScoreCard/scoreCard.utils';
import {
  aboutLabelsList,
  buildAboutExchangeRows,
  buildDisclosuresExchangeRows,
  disclosuresLabelsList,
} from '@/components/exchanges/ExchangeSidebar/exchangeSidebar.utils';
import { ExampleLabel } from '@/components/common/ExampleLabel';
import * as styles from './ExchangeOverviewSection.styles';
import * as scoreCardStyles from '@/components/common/Sidebar/ScoreCard/ScoreCard.styles';
interface ExchangeOverviewSectionProps {
  id: string;
  data?: ExchangeApiResponse;
  securityData?: ExchangeApiResponse['exchangeDetails']['security'];
  newsFeed?: ExchangeApiResponse['exchangeDetails']['newsFeed'];
}

const ExchangeOverviewSection: React.FC<ExchangeOverviewSectionProps> = ({
  id,
  data,
  securityData,
  newsFeed,
}) => {
  const { t } = useTranslation(['exchanges', 'common', 'sidebar']);


  const {data: tradingVolumeDetails, isLoading: _isTradingVolumeLoading, error: _tradingVolumeError} = useExchangeTradeDetails(data?.exchangeDetails.name || '');

  const statusStyle = (value: number) => {
    if (value > 0) {
      return { positive: true };
    } else if (value < 0) {
      return { negative: true };
    }

    return;
  };

  const tradingVolumeFormatted = tradingVolumeDetails ? formatAmount(tradingVolumeDetails?.trade_volume_24h, {
    prefix: "$",
    decimalPlaces: 2,
    compact: true,
  }) : t("common:notAvailable", "N/A");
  const tradingVolumeChangeUsdFormatted = formatAmount(tradingVolumeDetails?.trade_volume_change_24h ?? 0, {
    prefix: "$",
    decimalPlaces: 0,
  });
  const tradingVolumeChangePercentageFormatted =formatPercentage(
    tradingVolumeDetails?.trade_volume_change_percentage_24h ?? 0
  );

  const tradingVolumeSubvalue = tradingVolumeDetails ? [
    { value: tradingVolumeChangePercentageFormatted, ...statusStyle(tradingVolumeDetails.trade_volume_change_percentage_24h ?? 0) },
    { value: tradingVolumeChangeUsdFormatted, type: "secondary" as const },
  ] : undefined;
  const exchangeAge = 3;

  // Transform security data for mobile layout
  const securityProps = securityData ? transformToScoreCardProps(securityData) : null;
  const securityChartData = securityData ? transformPolDynamicData(securityData) : null;
  const labelInterval: number | 'preserveStartEnd' =
    securityChartData?.data.length && securityChartData.data.length > 5 ? 'preserveStartEnd' : 0;

  // Build rows for BadgesRowCard
  const aboutLabels: aboutLabelsList = {
    users: t('sidebar:labels.users', 'Users'),
    dateOfOperation: t('sidebar:labels.dateOfOperation', 'Date of Operation'),
    jurisdiction: t('sidebar:labels.jurisdiction', 'Jurisdiction'),
    listedAssets: t('sidebar:labels.listedAssets', 'Listed Assets'),
    documentation: t('sidebar:labels.documentation', 'Documentation'),
    audits: t('sidebar:labels.audits', 'Audits'),
    socials: t('sidebar:labels.socials', 'Socials'),
  };
  const disclosuresLabels: disclosuresLabelsList = {
    policies: t('sidebar:labels.policies', 'Policies & Reports'),
    attestations: t('sidebar:labels.attestations', 'Attestations'),
    legal: t('sidebar:labels.legalDocs', 'Legal Docs'),
  };
  const aboutRows = data?.exchangeDetails ? buildAboutExchangeRows(data.exchangeDetails, aboutLabels) : [];
  const disclosuresRows = data?.exchangeDetails ? buildDisclosuresExchangeRows(data.exchangeDetails, disclosuresLabels) : [];

  return (
    <>
      {/* Desktop Layout */}
      <div css={styles.desktopOverviewSection}>
        <Section
          id={id}
          showHeader={false}
          columns={6}
          areas={[
            ["item1", "item1", "item1", "item2", "item2", "item2"],
            ["item3", "item3", "item4", "item4", "item5", "item5"],
          ]}
        >
          <Card>
            <ExchangeOverviewTradeVolumeChart exchange={tradingVolumeDetails?.name || ''} />
          </Card>
          <Card>
            <BlurOverlay
              text={t("common:commingSoonDataBlock", "This Data is Coming Soon")}
            />
          </Card>
          <Card>
            <DataValue
              label={t("exchanges.overview.tradingVolume", "Trading Volume")}
              value={tradingVolumeFormatted}
              subvalue={tradingVolumeSubvalue}
              disabled={!tradingVolumeDetails}
            />
          </Card>
          <Card>
            <DataValue
              label={t("exchanges.overview.listedAssets", "Listed Assets")}
              value={data?.listedAssets?.total}
            />
          </Card>
          <Card>
            <DataValue
              label={t("exchanges.overview.exchangeAge", "Exchange Age")}
              value={exchangeAge}
              subvalue={{ value: t("common.years", "years") }}
            />
          </Card>
        </Section>
      </div>

      {/* Mobile Layout */}
      {securityData && securityProps && (
        <div css={styles.mobileSecuritySection}>
          {/* 1. Security Score Section - Top */}
          <div css={styles.sectionHeader}>
            <h2 css={styles.sectionTitle}>
              {t('sidebar:title.exchange', 'Security Score')}
            </h2>
            <Tooltip
              title={t(
                'sidebar:title.exchangeTooltip',
                'Exchange security assessment based on technical controls and operational practices'
              )}
            />
          </div>

          {/* Gauge Chart */}
          <div css={styles.gaugeChartWrapper}>
            <div css={styles.gaugeChartMobile}>
              <GaugeChart
                score={securityProps.score}
                rating={securityProps.rating}
                confidence={securityProps.confidence}
                change24h={securityProps.change24h}
                isSecurityScore={true}
              />
            </div>
          </div>

          {/* Data Coverage */}
          <div css={styles.dataCoverageCard}>
            <DataCoverageIndicator percentage={securityProps.dataCoverage} />
          </div>

          {/* Risk Metrics Bar Charts */}
          <div css={styles.riskMetricsCard}>
            <RiskMetricsList metrics={securityProps.riskMetrics} />
          </div>

          {/* Security Dynamic Chart */}
          {securityChartData && (
            <div css={styles.securityDynamicCard}>
              <div css={scoreCardStyles.chartHeaderContainer}>
                <div css={scoreCardStyles.chartHeader}>
                  <Icon name="activity" css={scoreCardStyles.chartHeaderIcon} />
                  <p css={scoreCardStyles.chartHeaderTitle}>
                    {t('sidebar:scoreCard.securityDynamic.label', 'Security Dynamic')}
                  </p>
                  <Tooltip
                    title={t(
                      'sidebar:scoreCard.securityDynamic.tooltip',
                      'The Security Score change over time'
                    )}
                  />
                </div>
                <ExampleLabel
                  bordered
                  label={t('common:exampleData.label', 'Example')}
                  tooltip={t('common:exampleData.tooltip', 'Example Tooltip')}
                  tooltipTitle={t('common:exampleData.tooltipTitle', 'Data Example')}
                />
              </div>
              <SingleLineChart
                data={securityChartData.data}
                height={140}
                yDomain={securityChartData.yDomain}
                xAxisLabelFormatter={formatDateLabel}
                xAxisInterval={labelInterval}
                margin={{
                  top: 5,
                  right: 0,
                  left: 0,
                  bottom: 20,
                }}
              />
            </div>
          )}
        </div>
      )}

      {/* 2 & 3 Combined: Charts and Data Cards in Same Container */}
      <div css={styles.mobileChartsAndDataSection}>
        <Card>
          <ExchangeOverviewTradeVolumeChart exchange={tradingVolumeDetails?.name || ''} />
        </Card>
        <Card>
          <BlurOverlay
            text={t("common:commingSoonDataBlock", "This Data is Coming Soon")}
          />
        </Card>
        <Card>
          <DataValue
            label={t("exchanges.overview.tradingVolume", "Trading Volume")}
            value={tradingVolumeFormatted}
            subvalue={tradingVolumeSubvalue}
            disabled={!tradingVolumeDetails}
          />
        </Card>
        <Card>
          <DataValue
            label={t("exchanges.overview.listedAssets", "Listed Assets")}
            value={data?.listedAssets?.total}
          />
        </Card>
        <Card>
          <DataValue
            label={t("exchanges.overview.exchangeAge", "Exchange Age")}
            value={exchangeAge}
            subvalue={{ value: t("common.years", "years") }}
          />
        </Card>
      </div>

      {/* 4. Rest of Security Score Section */}
      {newsFeed && data?.exchangeDetails && (
        <div css={styles.mobileSidebarContent}>
          {/* Risk Changes with Top Risks / Recent Changes tabs */}
          <RiskChangesCard data={newsFeed} />

          {/* About Exchange */}
          <BadgesRowCard
            title={`${t('sidebar:sections.aboutTitle', 'About')} ${data.exchangeDetails.name}`}
            description={data.exchangeDetails.description}
            rows={aboutRows}
          />

          {/* Disclosures */}
          <BadgesRowCard title={t('sidebar:sections.disclosuresTitle', 'Disclosures')} rows={disclosuresRows} />
        </div>
      )}
    </>
  );
};

export default ExchangeOverviewSection;
