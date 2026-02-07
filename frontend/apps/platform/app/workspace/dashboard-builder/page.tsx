/** @jsxImportSource @emotion/react */
'use client';

import { useState, useEffect } from 'react';
import { Card, Core3Button as Button, Badge, Icon, Select } from '@core3/ui-components';
import { SingleLineChart, BarChart, DonutChart, GaugeChart } from '@core3/ui-components';
import useTranslation from '@/hooks/useTranslation';
import * as styles from './page.styles';

const IMPORTED_WIDGETS_STORAGE_KEY = 'cosmops_imported_widgets';

interface Widget {
  id: string;
  type: 'chart' | 'metric' | 'table' | 'alert';
  title: string;
  icon: string;
  category: 'compliance' | 'routing' | 'analytics' | 'monitoring';
}

function mapImportedCategory(cat: string): Widget['category'] {
  const c = (cat || '').toLowerCase();
  if (c === 'monitoring' || c === 'risk' || c === 'detection') return 'monitoring';
  if (c === 'routing' || c === 'operations') return 'routing';
  if (c === 'analytics' || c === 'reporting' || c === 'audit' || c === 'tracking') return 'analytics';
  return 'compliance';
}

interface DashboardWidget {
  id: string;
  widgetId: string;
  x: number;
  y: number;
  width: number;
  height: number;
}

const availableWidgets: Widget[] = [
  {
    id: 'compliance-score',
    type: 'chart',
    title: 'Compliance Score Trend',
    icon: 'candle-stick',
    category: 'compliance',
  },
  {
    id: 'routing-analytics',
    type: 'chart',
    title: 'Routing Analytics',
    icon: 'data-transfer',
    category: 'routing',
  },
  {
    id: 'transaction-volume',
    type: 'chart',
    title: 'Transaction Volume',
    icon: 'candle-stick',
    category: 'analytics',
  },
  {
    id: 'risk-heatmap',
    type: 'chart',
    title: 'Risk Heatmap',
    icon: 'activity',
    category: 'monitoring',
  },
  {
    id: 'active-routes',
    type: 'metric',
    title: 'Active Routes',
    icon: 'data-flow',
    category: 'routing',
  },
  {
    id: 'compliance-blocks',
    type: 'metric',
    title: 'Active Compliance Blocks',
    icon: 'security',
    category: 'compliance',
  },
  {
    id: 'alerts-panel',
    type: 'alert',
    title: 'Recent Alerts',
    icon: 'warning-triangle',
    category: 'monitoring',
  },
  {
    id: 'asset-distribution',
    type: 'chart',
    title: 'Asset Distribution',
    icon: 'candle-stick',
    category: 'analytics',
  },
];

// Mock chart data
const complianceScoreData = [
  { x: 'Mon', value: 75 },
  { x: 'Tue', value: 78 },
  { x: 'Wed', value: 82 },
  { x: 'Thu', value: 85 },
  { x: 'Fri', value: 88 },
];

const transactionVolumeData = [
  { x: 'Jan', value: 1200 },
  { x: 'Feb', value: 1500 },
  { x: 'Mar', value: 1800 },
  { x: 'Apr', value: 2100 },
];

const assetDistributionData = [
  { name: 'USD', value: 45 },
  { name: 'EUR', value: 30 },
  { name: 'GBP', value: 15 },
  { name: 'XLM', value: 10 },
];

export default function DashboardBuilderPage() {
  const { t } = useTranslation('workspace');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [dashboardWidgets, setDashboardWidgets] = useState<DashboardWidget[]>([]);
  const [isDragging, setIsDragging] = useState<string | null>(null);
  const [importedWidgets, setImportedWidgets] = useState<Widget[]>([]);

  useEffect(() => {
    try {
      const raw = typeof window !== 'undefined' ? window.localStorage.getItem(IMPORTED_WIDGETS_STORAGE_KEY) : null;
      if (!raw) return;
      const list = JSON.parse(raw) as Array<{ id: string; name: string; category: string; description?: string }>;
      const mapped: Widget[] = list.map((w) => ({
        id: w.id,
        type: 'metric',
        title: w.name,
        icon: 'check-circle',
        category: mapImportedCategory(w.category),
      }));
      setImportedWidgets(mapped);
    } catch {
      setImportedWidgets([]);
    }
  }, []);

  const categories = [
    { value: 'all', label: 'All Widgets' },
    { value: 'compliance', label: 'Compliance' },
    { value: 'routing', label: 'Routing' },
    { value: 'analytics', label: 'Analytics' },
    { value: 'monitoring', label: 'Monitoring' },
  ];

  const allWidgets = [...availableWidgets, ...importedWidgets];
  const filteredWidgets =
    selectedCategory === 'all'
      ? allWidgets
      : allWidgets.filter((w) => w.category === selectedCategory);

  const handleAddWidget = (widgetId: string) => {
    const newWidget: DashboardWidget = {
      id: `widget-${Date.now()}`,
      widgetId,
      x: 0,
      y: dashboardWidgets.length * 200,
      width: 400,
      height: 300,
    };
    setDashboardWidgets([...dashboardWidgets, newWidget]);
  };

  const handleRemoveWidget = (widgetId: string) => {
    setDashboardWidgets(dashboardWidgets.filter((w) => w.id !== widgetId));
  };

  const renderWidget = (widget: Widget) => {
    switch (widget.type) {
      case 'chart':
        if (widget.id === 'compliance-score') {
          return (
            <SingleLineChart
              data={complianceScoreData}
              xDataKey="x"
              yDataKey="value"
              height={200}
            />
          );
        }
        if (widget.id === 'transaction-volume') {
          return (
            <BarChart
              data={transactionVolumeData}
              xDataKey="x"
              yDataKey="value"
              height={200}
            />
          );
        }
        if (widget.id === 'asset-distribution') {
          return (
            <DonutChart
              data={assetDistributionData}
              dataKey="value"
              nameKey="name"
              height={200}
            />
          );
        }
        return <div>Chart Widget: {widget.title}</div>;

      case 'metric':
        return (
          <div css={styles.metricWidget}>
            <div css={styles.metricValue}>1,234</div>
            <div css={styles.metricLabel}>{widget.title}</div>
          </div>
        );

      case 'alert':
        return (
          <div css={styles.alertWidget}>
            <div css={styles.alertItem}>
              <Badge color="red" label="High" />
              <span>Suspicious transaction detected</span>
            </div>
            <div css={styles.alertItem}>
              <Badge color="orange" label="Medium" />
              <span>Route optimization available</span>
            </div>
          </div>
        );

      default:
        return <div>{widget.title}</div>;
    }
  };

  return (
    <div css={styles.pageContainer}>
      <header css={styles.headerSection}>
        <div css={styles.headerTitleBlock}>
          <div css={styles.headerTitleRow}>
            <h1 css={styles.pageTitle}>Dashboard Builder</h1>
            <Button variant="primary" size="small" css={styles.headerSaveButton}>
              Save Dashboard
            </Button>
          </div>
          <p css={styles.pageDescription}>
            Build custom dashboards with drag-and-drop widgets for your institution
          </p>
        </div>
      </header>

      <div css={styles.twoColumnLayout}>
        <aside css={styles.leftColumn}>
          <Card title="Available Widgets" css={styles.widgetsPanel}>
            <div css={styles.categoryFilter}>
              <Select
                value={selectedCategory}
                onChange={setSelectedCategory}
                options={categories}
              />
            </div>
            <div css={styles.widgetsList}>
              {filteredWidgets.map((widget) => (
                <div
                  key={widget.id}
                  css={styles.widgetItem}
                  onClick={() => handleAddWidget(widget.id)}
                >
                  <Icon name={widget.icon} />
                  <span>{widget.title}</span>
                </div>
              ))}
            </div>
          </Card>
        </aside>

        <div css={styles.rightColumn}>
          <div css={styles.rightColumnScroll}>
            <Card title="Dashboard Canvas">
            {dashboardWidgets.length === 0 ? (
              <div css={styles.emptyDashboard}>
                <Icon name="data-stack" css={styles.emptyIcon} />
                <p css={styles.emptyText}>
                  Drag widgets from the panel or click to add them to your dashboard
                </p>
              </div>
            ) : (
              <div css={styles.widgetsGrid}>
                {dashboardWidgets.map((dashboardWidget) => {
                  const widget = allWidgets.find((w) => w.id === dashboardWidget.widgetId);
                  if (!widget) return null;

                  return (
                    <div key={dashboardWidget.id} css={styles.dashboardWidgetContainer}>
                      <Card
                        title={widget.title}
                        icon={widget.icon}
                        css={styles.dashboardWidgetCard}
                        rightContent={
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleRemoveWidget(dashboardWidget.id);
                            }}
                            css={styles.widgetRemoveButton}
                            aria-label="Remove widget"
                          >
                            <Icon name="minus-circle" />
                          </button>
                        }
                      >
                        <div css={styles.widgetContent}>{renderWidget(widget)}</div>
                      </Card>
                    </div>
                  );
                })}
              </div>
            )}
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
