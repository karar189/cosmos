/** @jsxImportSource @emotion/react */
'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Card, DataValue, Section, Core3Button as Button } from '@core3/ui-components';
import { loadDashboards, type SavedDashboard, type DashboardWidget } from '@/utils/dashboardWorkspace.storage';
import TabsSection from '@/components/common/TabsSection/TabsSection';
import { ProjectOverviewPriceChart, ProjectOverviewPolCategoriesChart } from '@/containers/projects/ProjectOverviewSection';
import GaugeChart from '@/components/common/Sidebar/ScoreCard/GaugeChart/GaugeChart';
import DataCoverageIndicator from '@/components/common/Sidebar/ScoreCard/DataCoverageIndicator/DataCoverageIndicator';
import RiskChangesCard from '@/components/common/Sidebar/ScoreCard/RiskChangesCard/RiskChangesCard';
import ScoreCardCTA from '@/components/common/Sidebar/ScoreCardCTA/ScoreCardCTA';
import type { NewsFeed } from '@/types/api/project';
import * as styles from './page.styles';

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
                  <Card>
                    <DataValue
                      label="Dashboard"
                      value={dashboard.name}
                      subvalue={{ value: 'My Dashboards', type: 'secondary' }}
                    />
                  </Card>
                  <Card>
                    <ProjectOverviewPriceChart hasToken={false} symbol="" />
                  </Card>
                  <Card>
                    <ProjectOverviewPolCategoriesChart data={undefined} />
                  </Card>
                </Section>
              </div>

              {/* Second row: GaugeChart, DataCoverageIndicator, RiskChangesCard (same as overview) */}
              <div css={styles.secondRowSectionWrapper}>
                <Section
                  showHeader={false}
                  columns={3}
                  areas={[['gauge', 'coverage', 'risks']]}
                >
                  <Card>
                    <GaugeChart
                      score={6.62}
                      rating="AAA"
                      confidence="EXCEPTIONAL"
                      change24h={0}
                    />
                  </Card>
                  <Card>
                    <DataCoverageIndicator percentage={85} />
                  </Card>
                  <Card>
                    <RiskChangesCard data={MOCK_NEWS_FEED} />
                  </Card>
                </Section>
              </div>

              {/* Edit in Workspace CTA (same style as project "Do you own this project?") */}
              <div css={styles.improveScoreContainer}>
                <p css={styles.improveScoreText}>Edit this dashboard in the workspace?</p>
                <Button variant="inverse" size="small" onClick={openInWorkspace}>
                  Edit in Workspace
                </Button>
              </div>

              {/* Saved dashboard widgets as cards */}
              {(dashboard.widgets ?? []).length > 0 && (
                <div css={styles.overviewGrid}>
                  {(dashboard.widgets ?? []).map((w: DashboardWidget) => (
                    <Card key={w.id} css={styles.widgetCard}>
                      <div>
                        <h3 css={styles.widgetCardTitle}>{w.title}</h3>
                        <p css={styles.widgetCardType}>{w.type}</p>
                      </div>
                      <div css={styles.widgetCardBody}>
                        <span css={styles.widgetPlaceholder}>
                          {w.type === 'chart' && 'Chart placeholder'}
                          {w.type === 'metric' && 'Metric placeholder'}
                          {w.type === 'table' && 'Table placeholder'}
                          {w.type === 'alert' && 'Alert placeholder'}
                        </span>
                      </div>
                    </Card>
                  ))}
                </div>
              )}

              <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginTop: 24 }}>
                <Button variant="secondary" size="small" onClick={() => router.push('/workspace/my-dashboards')}>
                  Back to My Dashboards
                </Button>
              </div>
            </div>
          ) : (
            <div key={tab.value} id={tab.value} css={styles.hiddenSection} aria-hidden="true" />
          )
        )}
      </div>
    </div>
  );
}
