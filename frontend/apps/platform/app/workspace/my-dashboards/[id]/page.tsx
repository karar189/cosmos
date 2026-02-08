/** @jsxImportSource @emotion/react */
'use client';

import { useEffect, useState, useRef } from 'react';
import { useParams, useRouter } from 'next/navigation';
import {
  Card,
  DataList,
  DataValue,
  Section,
  Core3Button as Button,
  SingleLineChart,
  formatDateLabel,
  HeatMap,
  HeatMapLegend,
  HeatMapLegendRef,
  HeatMapRef,
  type HeatMapPoint,
} from '@core3/ui-components';
import type { DataListItemData } from '@core3/ui-components';
import { loadDashboards, type SavedDashboard } from '@/utils/dashboardWorkspace.storage';
import { TransactionAnalyticsWidget } from '@/components/common/TransactionAnalyticsWidget';
import TabsSection from '@/components/common/TabsSection/TabsSection';
import { ProjectOverviewPriceChart } from '@/containers/projects/ProjectOverviewSection';
import { InstitutionComplianceChecklistChart } from '@/components/common/InstitutionComplianceChecklistChart';
import RiskChangesCard from '@/components/common/Sidebar/ScoreCard/RiskChangesCard/RiskChangesCard';
import { GenerateSmartContractModal } from '@/components/common/GenerateSmartContractModal';
import type { NewsFeed } from '@/types/api/project';
import * as styles from './page.styles';

const RWA_SMART_CONTRACT_TYPES = [
  'Tokenization Contract',
  'Compliance / KYC Contract',
  'Custody / Escrow Contract',
  'Governance Contract',
  'Distribution / Revenue Share Contract',
] as const;

/** Mock compliance score trend (last 14 days) - like PoL Dynamic in overview */
function getMockComplianceScoreTrend(): { x: string; value: number }[] {
  const points: { x: string; value: number }[] = [];
  for (let i = 13; i >= 0; i--) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    points.push({
      x: d.toISOString().split('T')[0],
      value: 5.2 + Math.random() * 1.8 + (13 - i) * 0.04,
    });
  }
  return points;
}

/** Mock heatmap points (last 28 days) - GitHub-style activity */
function getMockHeatmapPoints(): HeatMapPoint[] {
  const points: HeatMapPoint[] = [];
  for (let i = 27; i >= 0; i--) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    points.push({
      date: d.toISOString().split('T')[0],
      intensity: Math.floor(Math.random() * 5) * 25,
    });
  }
  return points;
}

/** Mock line chart data (last 14 days) - for volume / analytics */
function getMockLineChartData(base = 50, spread = 30): { x: string; value: number }[] {
  const points: { x: string; value: number }[] = [];
  for (let i = 13; i >= 0; i--) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    points.push({
      x: d.toISOString().split('T')[0],
      value: base + Math.random() * spread,
    });
  }
  return points;
}

const MOCK_COMPLIANCE_SCORE_TREND = getMockComplianceScoreTrend();
const MOCK_HEATMAP_POINTS = getMockHeatmapPoints();
const MOCK_TRANSACTION_VOLUME = getMockLineChartData(80, 40);
const MOCK_ROUTING_ANALYTICS = getMockLineChartData(60, 35);
const MOCK_ASSET_DISTRIBUTION = getMockLineChartData(20, 80);
const MOCK_NEWS_FEED: NewsFeed = {
  topRisks: [
    { date: '2025-11-28', content: 'Missing ISO certification.' },
    {
      date: '2023-05-11',
      content:
        'Ethereum Beacon Chain experienced finality issues multiple epochs due to a consensus client bug, temporarily halting finalization; no funds were lost.',
    },
  ],
  recentChanges: [
    { date: '2025-02-01', content: 'Dashboard widgets updated from workspace.' },
  ],
};

function shouldRenderTab(value: string, hash: string | null): boolean {
  if (!hash) return value === 'overview';
  return hash === value;
}

export default function DashboardViewPage() {
  const params = useParams();
  const router = useRouter();
  const id = typeof params?.id === 'string' ? params.id : '';
  const [dashboard, setDashboard] = useState<SavedDashboard | null>(null);
  const [hash, setHash] = useState<string | null>(null);
  const heatMapRef = useRef<HeatMapRef>(null);
  const heatMapLegendRef = useRef<HeatMapLegendRef>(null);
  const [generateModalOpen, setGenerateModalOpen] = useState(false);
  const [generateModalContractType, setGenerateModalContractType] = useState('');

  const smartContractsList: DataListItemData[] = RWA_SMART_CONTRACT_TYPES.map((contractType) => ({
    label: contractType,
    value: (
      <Button
        variant="secondary"
        size="small"
        onClick={() => {
          setGenerateModalContractType(contractType);
          setGenerateModalOpen(true);
        }}
      >
        Generate
      </Button>
    ),
    checked: false,
  }));

  useEffect(() => {
    const list = loadDashboards();
    const found = list.find((d) => d.id === id) ?? null;
    setDashboard(found);
  }, [id]);

  useEffect(() => {
    const onHash = () =>
      setHash(typeof window !== 'undefined' ? (window.location.hash?.slice(1) || 'overview') : 'overview');
    onHash();
    window.addEventListener('hashchange', onHash);
    return () => window.removeEventListener('hashchange', onHash);
  }, []);

  const tabs = [{ label: 'Overview', value: 'overview' }];

  const openInWorkspace = () => {
    if (dashboard) router.push(`/dashboard-workspace?dashboardId=${encodeURIComponent(dashboard.id)}`);
  };

  if (id && dashboard === null) {
    return (
      <div css={styles.pageContainer}>
        <div css={styles.notFoundContainer}>
          <h1 css={styles.notFoundTitle}>Dashboard not found</h1>
          <p css={styles.notFoundText}>
            This dashboard may have been removed or the link is invalid.
          </p>
          <Button
            variant="secondary"
            size="small"
            css={{ marginTop: 16 }}
            onClick={() => router.push('/workspace/my-dashboards')}
          >
            Back to My Dashboards
          </Button>
        </div>
      </div>
    );
  }

  if (!dashboard) {
    return (
      <div css={styles.pageContainer}>
        <div css={styles.notFoundContainer}>
          <p css={styles.notFoundText}>Loading…</p>
        </div>
      </div>
    );
  }

  const widgetCount = dashboard.widgets?.length ?? 0;
  /** When true, show default chart cards so Overview always has charts & metrics (e.g. new or empty dashboard). */
  const showDefaultCharts = widgetCount === 0;
  const hasWidget = (id: string) =>
    dashboard.widgets?.some((w) => w.widgetId === id) || showDefaultCharts;

  const transactionAnalyticsWidget = dashboard.widgets?.find((w) => w.widgetId === 'transaction-analytics');
  const stellarWalletFromSettings =
    transactionAnalyticsWidget?.settings?.parameters != null
      ? (() => {
          try {
            const p = JSON.parse(transactionAnalyticsWidget.settings.parameters);
            return typeof p?.stellarWallet === 'string' ? p.stellarWallet : undefined;
          } catch {
            return undefined;
          }
        })()
      : undefined;

  const updatedLabel = dashboard.updatedAt
    ? new Date(dashboard.updatedAt).toLocaleDateString(undefined, {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
      })
    : '—';

  return (
    <div css={styles.pageContainer}>
      <div css={styles.titleRow}>
        <h1 css={styles.pageTitle}>{dashboard.name}</h1>
      </div>

      <div css={styles.stickyTabsContainer}>
        <TabsSection data={tabs} />
      </div>

      <div css={styles.tabsContent}>
        {tabs.map((tab) =>
          shouldRenderTab(tab.value, hash) ? (
            <div key={tab.value} id={tab.value}>
              {/* Summary cards above charts: first row = Widgets / Last updated / Dashboard, second row = charts */}
              <div css={styles.overviewSectionWrapper}>
                <Section
                  id="overview"
                  showHeader={false}
                  columns={6}
                  areas={[
                    ['item3', 'item3', 'item4', 'item4', 'item5', 'item5'],
                    ['item1', 'item1', 'item1', 'item2', 'item2', 'item2'],
                  ]}
                >
                  <Card>
                    <DataValue
                      label="Widgets"
                      value={String(widgetCount)}
                      subvalue={{ value: 'widgets in this dashboard', type: 'secondary' }}
                    />
                  </Card>
                  <Card>
                    <DataValue
                      label="Last updated"
                      value={updatedLabel}
                      subvalue={{ value: 'Saved from workspace', type: 'secondary' }}
                    />
                  </Card>
                  <Card css={styles.dashboardNameCard}>
                    <DataValue
                      label=""
                      value={dashboard.name}
                      subvalue={{ value: 'My Dashboards', type: 'secondary' }}
                    />
                  </Card>
                  <Card>
                    <ProjectOverviewPriceChart hasToken={false} symbol="" />
                  </Card>
                  <Card>
                    <InstitutionComplianceChecklistChart />
                  </Card>
                </Section>
              </div>

              {/* Charts & metrics: Section + Card for each widget */}
              <div css={styles.chartsSectionWrapper}>
                <Section
                  id="charts-metrics"
                  title="Charts & metrics"
                  showHeader={true}
                  columns={2}
                  gap="m"
                >
                  {/* Compliance Score Trend (overview: PoL Dynamic) */}
                  {hasWidget('compliance-score') && (
                    <Card css={styles.dataCard}>
                      <div css={styles.chartCardInner}>
                        <h3 css={styles.chartCardTitle}>Compliance Score Trend</h3>
                        <SingleLineChart
                          data={MOCK_COMPLIANCE_SCORE_TREND}
                          height={160}
                          xAxisLabelFormatter={formatDateLabel}
                          xAxisInterval="preserveStartEnd"
                          margin={{ top: 5, right: 0, left: 0, bottom: 20 }}
                        />
                      </div>
                    </Card>
                  )}
                  {/* Risk Heatmap (overview: GitHub activity heatmap) */}
                  {hasWidget('risk-heatmap') && (
                    <Card css={styles.dataCard}>
                      <div css={styles.chartCardInner}>
                        <h3 css={styles.chartCardTitle}>Risk Heatmap</h3>
                        <HeatMapLegend
                          intensities={[0, 25, 50, 75, 100]}
                          prevLabel="Less"
                          nextLabel="More"
                          ref={heatMapLegendRef}
                          heatMapRef={heatMapRef}
                        />
                        <HeatMap
                          ref={heatMapRef}
                          points={MOCK_HEATMAP_POINTS}
                          intensityLevels={[0, 25, 50, 75, 100]}
                          days={28}
                          legendRef={heatMapLegendRef}
                        />
                      </div>
                    </Card>
                  )}
                  {/* Recent Alerts (overview: RiskChangesCard / Top Risks) */}
                  {hasWidget('alerts-panel') && (
                    <Card css={styles.dataCard}>
                      <RiskChangesCard data={MOCK_NEWS_FEED} />
                    </Card>
                  )}
                  {/* Transaction Volume (overview-style chart) */}
                  {hasWidget('transaction-volume') && (
                    <Card css={styles.dataCard}>
                      <div css={styles.chartCardInner}>
                        <h3 css={styles.chartCardTitle}>Transaction Volume</h3>
                        <SingleLineChart
                          data={MOCK_TRANSACTION_VOLUME}
                          height={160}
                          xAxisLabelFormatter={formatDateLabel}
                          xAxisInterval="preserveStartEnd"
                          margin={{ top: 5, right: 0, left: 0, bottom: 20 }}
                        />
                      </div>
                    </Card>
                  )}
                  {/* Asset Distribution (overview-style metric/chart) */}
                  {hasWidget('asset-distribution') && (
                    <Card css={styles.dataCard}>
                      <div css={styles.chartCardInner}>
                        <h3 css={styles.chartCardTitle}>Asset Distribution</h3>
                        <SingleLineChart
                          data={MOCK_ASSET_DISTRIBUTION}
                          height={160}
                          xAxisLabelFormatter={formatDateLabel}
                          xAxisInterval="preserveStartEnd"
                          margin={{ top: 5, right: 0, left: 0, bottom: 20 }}
                        />
                      </div>
                    </Card>
                  )}
                  {/* Routing Analytics (overview-style chart) */}
                  {hasWidget('routing-analytics') && (
                    <Card css={styles.dataCard}>
                      <div css={styles.chartCardInner}>
                        <h3 css={styles.chartCardTitle}>Routing Analytics</h3>
                        <SingleLineChart
                          data={MOCK_ROUTING_ANALYTICS}
                          height={160}
                          xAxisLabelFormatter={formatDateLabel}
                          xAxisInterval="preserveStartEnd"
                          margin={{ top: 5, right: 0, left: 0, bottom: 20 }}
                        />
                      </div>
                    </Card>
                  )}
                  {/* Transaction Analytics (Stellar wallet transactions: bar chart + flow on click) */}
                  {hasWidget('transaction-analytics') && (
                    <TransactionAnalyticsWidget stellarWallet={stellarWalletFromSettings} />
                  )}
                  {/* Active Routes (overview-style DataValue metric) */}
                  {hasWidget('active-routes') && (
                    <Card css={styles.dataCard}>
                      <DataValue
                        label="Active Routes"
                        value="12"
                        subvalue={{ value: 'routes in last 24h', type: 'secondary' }}
                      />
                    </Card>
                  )}
                  {/* Active Compliance Blocks (overview-style DataValue metric) */}
                  {hasWidget('compliance-blocks') && (
                    <Card css={styles.dataCard}>
                      <DataValue
                        label="Active Compliance Blocks"
                        value="8"
                        subvalue={{ value: 'blocks in workspace', type: 'secondary' }}
                      />
                    </Card>
                  )}
                </Section>
              </div>

              {/* Smart Contracts for RWAs (mandatory section, Documentation-style) */}
              <Card css={styles.smartContractsCard}>
                <h3 css={styles.smartContractsTitle}>Smart Contracts for RWAs</h3>
                <DataList items={smartContractsList} />
              </Card>

              {/* Edit in Workspace CTA (same style as project "Do you own this project?") */}
              <div css={styles.improveScoreContainer}>
                <p css={styles.improveScoreText}>Edit this dashboard in the workspace?</p>
                <Button variant="inverse" size="small" onClick={openInWorkspace}>
                  Edit in Workspace
                </Button>
              </div>
            </div>
          ) : (
            <div key={tab.value} id={tab.value} css={styles.hiddenSection} aria-hidden="true" />
          )
        )}
      </div>

      <GenerateSmartContractModal
        open={generateModalOpen}
        onClose={() => setGenerateModalOpen(false)}
        contractType={generateModalContractType}
      />
    </div>
  );
}
