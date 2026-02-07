/** @jsxImportSource @emotion/react */
'use client';

import { useMemo, useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Card, Core3Button as Button, Badge, Icon, Select } from '@core3/ui-components';
import { SingleLineChart, BarChart, DonutChart, GaugeChart } from '@core3/ui-components';
import useTranslation from '@/hooks/useTranslation';
import { ROUTES } from '@/constants/routes';
import * as styles from './page.styles';

const IMPORTED_WIDGETS_STORAGE_KEY = 'cosmops_imported_widgets';
const COMPLIANCE_SESSION_STORAGE_KEY = 'cosmops_compliance_session';

interface ComplianceSession {
  institutionName: string;
  institutionType: string;
  institutionTypeLabel?: string;
  lookingFor: string;
  existingAudits: string;
  analysis: string;
  analysisSource: string;
  suggestedChecklist: { id: string; name: string; category: string; description: string; priority: string }[];
  savedAt: string;
}

interface Widget {
  id: string;
  type: 'chart' | 'metric' | 'table' | 'alert';
  title: string;
  icon: string;
  category:
    | 'remittance'
    | 'fintech'
    | 'bank'
    | 'stablecoin'
    | 'ngo'
    | 'rwa'
    | 'custom';
}

function mapInstitutionTypeToWidgetCategory(institutionType?: string | null): Widget['category'] | null {
  const t = (institutionType || '').toLowerCase();
  if (!t) return null;
  if (t.includes('remittance')) return 'remittance';
  if (t.includes('fintech')) return 'fintech';
  if (t.includes('stablecoin')) return 'stablecoin';
  if (t.includes('ngo')) return 'ngo';
  if (t.includes('rwa')) return 'rwa';
  if (t.includes('neobank') || t.includes('bank')) return 'bank';
  return null;
}

function mapImportedCategory(params: {
  importedInstitutionType?: string | null;
  sessionInstitutionType?: string | null;
  fallbackCategory?: string | null;
}): Widget['category'] {
  // Prefer the institutionType stored alongside the imported widget
  const byImported = mapInstitutionTypeToWidgetCategory(params.importedInstitutionType);
  if (byImported) return byImported;

  // Fall back to the last Compliance Maker session (best effort)
  const bySession = mapInstitutionTypeToWidgetCategory(params.sessionInstitutionType);
  if (bySession) return bySession;

  // Last resort: try keyword guessing (rare)
  const c = (params.fallbackCategory || '').toLowerCase();
  if (c.includes('remittance')) return 'remittance';
  if (c.includes('fintech')) return 'fintech';
  if (c.includes('stablecoin')) return 'stablecoin';
  if (c.includes('ngo')) return 'ngo';
  if (c.includes('rwa')) return 'rwa';
  if (c.includes('neobank') || c.includes('bank')) return 'bank';

  return 'custom';
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
    category: 'custom',
  },
  {
    id: 'routing-analytics',
    type: 'chart',
    title: 'Routing Analytics',
    icon: 'data-transfer',
    category: 'custom',
  },
  {
    id: 'transaction-volume',
    type: 'chart',
    title: 'Transaction Volume',
    icon: 'candle-stick',
    category: 'custom',
  },
  {
    id: 'risk-heatmap',
    type: 'chart',
    title: 'Risk Heatmap',
    icon: 'activity',
    category: 'custom',
  },
  {
    id: 'active-routes',
    type: 'metric',
    title: 'Active Routes',
    icon: 'data-flow',
    category: 'custom',
  },
  {
    id: 'compliance-blocks',
    type: 'metric',
    title: 'Active Compliance Blocks',
    icon: 'security',
    category: 'custom',
  },
  {
    id: 'alerts-panel',
    type: 'alert',
    title: 'Recent Alerts',
    icon: 'warning-triangle',
    category: 'custom',
  },
  {
    id: 'asset-distribution',
    type: 'chart',
    title: 'Asset Distribution',
    icon: 'candle-stick',
    category: 'custom',
  },
  // ===== Remittance company =====
  { id: 'remittance-corridor-risk-monitor', type: 'chart', title: 'Corridor Risk Monitor', icon: 'activity', category: 'remittance' },
  { id: 'remittance-cross-border-volume', type: 'chart', title: 'Cross-Border Volume', icon: 'candle-stick', category: 'remittance' },
  { id: 'remittance-settlement-time-tracker', type: 'chart', title: 'Settlement Time Tracker', icon: 'candle-stick', category: 'remittance' },
  { id: 'remittance-agent-network-monitor', type: 'table', title: 'Agent Network Monitor', icon: 'data-stack', category: 'remittance' },
  { id: 'remittance-transaction-limits-tracker', type: 'chart', title: 'Transaction Limits Tracker', icon: 'data-flow', category: 'remittance' },
  { id: 'remittance-aml-screening-dashboard', type: 'alert', title: 'AML Screening Dashboard', icon: 'security', category: 'remittance' },
  { id: 'remittance-regulatory-alerts', type: 'alert', title: 'Regulatory Alerts', icon: 'warning-triangle', category: 'remittance' },
  { id: 'remittance-smurfing-detection', type: 'metric', title: 'Smurfing Detection', icon: 'activity', category: 'remittance' },

  // ===== Fintech payments =====
  { id: 'fintech-payment-analytics', type: 'chart', title: 'Payment Analytics', icon: 'candle-stick', category: 'fintech' },
  { id: 'fintech-fraud-detection-dashboard', type: 'alert', title: 'Fraud Detection Dashboard', icon: 'warning-triangle', category: 'fintech' },
  { id: 'fintech-compliance-score-gauge', type: 'chart', title: 'Compliance Score', icon: 'security', category: 'fintech' },
  { id: 'fintech-payment-volume-by-method', type: 'chart', title: 'Payment Volume by Method', icon: 'data-transfer', category: 'fintech' },
  { id: 'fintech-chargeback-monitor', type: 'chart', title: 'Chargeback Monitor', icon: 'activity', category: 'fintech' },
  { id: 'fintech-authorization-rates', type: 'chart', title: 'Authorization Rates', icon: 'data-flow', category: 'fintech' },
  { id: 'fintech-payment-routing-optimizer', type: 'table', title: 'Payment Routing Optimizer', icon: 'data-stack', category: 'fintech' },
  { id: 'fintech-sanctions-screening', type: 'alert', title: 'Sanctions Screening', icon: 'security', category: 'fintech' },

  // ===== Bank / Neobank =====
  { id: 'bank-kyc-kyb-dashboard', type: 'table', title: 'KYC/KYB Dashboard', icon: 'security', category: 'bank' },
  { id: 'bank-transaction-monitoring', type: 'alert', title: 'Transaction Monitoring', icon: 'warning-triangle', category: 'bank' },
  { id: 'bank-risk-scoring-engine', type: 'chart', title: 'Risk Scoring Engine', icon: 'activity', category: 'bank' },
  { id: 'bank-account-opening-metrics', type: 'chart', title: 'Account Opening Metrics', icon: 'candle-stick', category: 'bank' },
  { id: 'bank-lending-portfolio-health', type: 'chart', title: 'Lending Portfolio Health', icon: 'candle-stick', category: 'bank' },
  { id: 'bank-liquidity-monitor', type: 'chart', title: 'Liquidity Monitor', icon: 'data-flow', category: 'bank' },
  { id: 'bank-regulatory-reporting-status', type: 'table', title: 'Regulatory Reporting Status', icon: 'data-stack', category: 'bank' },
  { id: 'bank-customer-segmentation', type: 'chart', title: 'Customer Segmentation', icon: 'data-transfer', category: 'bank' },
  { id: 'bank-large-value-transfer-monitor', type: 'alert', title: 'Large-Value Transfer Monitor', icon: 'warning-triangle', category: 'bank' },

  // ===== Stablecoin issuer =====
  { id: 'stablecoin-reserve-monitoring', type: 'chart', title: 'Reserve Monitoring', icon: 'security', category: 'stablecoin' },
  { id: 'stablecoin-redemption-tracker', type: 'table', title: 'Redemption Tracker', icon: 'data-stack', category: 'stablecoin' },
  { id: 'stablecoin-peg-stability-monitor', type: 'chart', title: 'Peg Stability Monitor', icon: 'activity', category: 'stablecoin' },
  { id: 'stablecoin-circulation-analytics', type: 'chart', title: 'Circulation Analytics', icon: 'candle-stick', category: 'stablecoin' },
  { id: 'stablecoin-attestation-status', type: 'table', title: 'Attestation Status', icon: 'check-circle', category: 'stablecoin' },
  { id: 'stablecoin-mint-burn-volume', type: 'chart', title: 'Mint/Burn Volume', icon: 'data-flow', category: 'stablecoin' },
  { id: 'stablecoin-bank-balance-monitor', type: 'metric', title: 'Bank Balance Monitor', icon: 'data-transfer', category: 'stablecoin' },
  { id: 'stablecoin-regulatory-compliance', type: 'alert', title: 'Regulatory Compliance', icon: 'warning-triangle', category: 'stablecoin' },

  // ===== NGO =====
  { id: 'ngo-donation-tracker', type: 'chart', title: 'Donation Tracker', icon: 'candle-stick', category: 'ngo' },
  { id: 'ngo-fund-flow-monitor', type: 'chart', title: 'Fund Flow Monitor', icon: 'activity', category: 'ngo' },
  { id: 'ngo-compliance-checker', type: 'alert', title: 'Compliance Checker', icon: 'security', category: 'ngo' },
  { id: 'ngo-beneficiary-verification', type: 'table', title: 'Beneficiary Verification', icon: 'data-stack', category: 'ngo' },
  { id: 'ngo-impact-metrics', type: 'chart', title: 'Impact Metrics', icon: 'data-flow', category: 'ngo' },
  { id: 'ngo-donor-compliance', type: 'metric', title: 'Donor Compliance', icon: 'check-circle', category: 'ngo' },
  { id: 'ngo-regulatory-reporting', type: 'table', title: 'Regulatory Reporting', icon: 'data-stack', category: 'ngo' },
  { id: 'ngo-expense-ratio-monitor', type: 'chart', title: 'Expense Ratio Monitor', icon: 'data-transfer', category: 'ngo' },

  // ===== RWA platform =====
  { id: 'rwa-asset-tokenization-tracker', type: 'table', title: 'Asset Tokenization Tracker', icon: 'data-stack', category: 'rwa' },
  { id: 'rwa-rwa-compliance-monitor', type: 'alert', title: 'RWA Compliance Monitor', icon: 'warning-triangle', category: 'rwa' },
  { id: 'rwa-yield-analytics', type: 'chart', title: 'Yield Analytics', icon: 'candle-stick', category: 'rwa' },
  { id: 'rwa-proof-of-reserve', type: 'chart', title: 'Proof of Reserve', icon: 'security', category: 'rwa' },
  { id: 'rwa-asset-performance', type: 'chart', title: 'Asset Performance', icon: 'activity', category: 'rwa' },
  { id: 'rwa-investor-accreditation', type: 'table', title: 'Investor Accreditation', icon: 'check-circle', category: 'rwa' },
  { id: 'rwa-secondary-market-activity', type: 'chart', title: 'Secondary Market Activity', icon: 'data-flow', category: 'rwa' },
  { id: 'rwa-asset-valuation-tracker', type: 'metric', title: 'Asset Valuation Tracker', icon: 'data-transfer', category: 'rwa' },
  { id: 'rwa-custody-monitor', type: 'alert', title: 'Custody Monitor', icon: 'warning-triangle', category: 'rwa' },

  // ===== Custom =====
  { id: 'custom-metric', type: 'metric', title: 'Custom Metric', icon: 'tools', category: 'custom' },
  { id: 'custom-chart', type: 'chart', title: 'Custom Chart', icon: 'tools', category: 'custom' },
  { id: 'custom-table', type: 'table', title: 'Custom Table', icon: 'tools', category: 'custom' },
  { id: 'custom-alert', type: 'alert', title: 'Custom Alert', icon: 'tools', category: 'custom' },
  { id: 'custom-api-integration-status', type: 'metric', title: 'API Integration Status', icon: 'data-transfer', category: 'custom' },
  { id: 'custom-compliance-calendar', type: 'table', title: 'Compliance Calendar', icon: 'data-stack', category: 'custom' },
  { id: 'custom-team-activity-log', type: 'table', title: 'Team Activity Log', icon: 'data-stack', category: 'custom' },
  { id: 'custom-external-dashboard-link', type: 'table', title: 'External Dashboard Link', icon: 'data-transfer', category: 'custom' },
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
  const router = useRouter();
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [dashboardWidgets, setDashboardWidgets] = useState<DashboardWidget[]>([]);
  const [isDragging, setIsDragging] = useState<string | null>(null);
  const [importedWidgetDefs, setImportedWidgetDefs] = useState<
    Array<{ id: string; name: string; category: string; description?: string; institutionType?: string }>
  >([]);
  const [complianceSession, setComplianceSession] = useState<ComplianceSession | null>(null);

  useEffect(() => {
    try {
      const raw = typeof window !== 'undefined' ? window.localStorage.getItem(IMPORTED_WIDGETS_STORAGE_KEY) : null;
      if (!raw) return;
      const list = JSON.parse(raw) as Array<{
        id: string;
        name: string;
        category: string;
        description?: string;
        institutionType?: string;
      }>;
      setImportedWidgetDefs(list);
    } catch {
      setImportedWidgetDefs([]);
    }
  }, []);

  const importedWidgets: Widget[] = useMemo(() => {
    return importedWidgetDefs.map((w) => ({
      id: w.id,
      type: 'metric',
      title: w.name,
      icon: 'check-circle',
      category: mapImportedCategory({
        importedInstitutionType: w.institutionType,
        sessionInstitutionType: complianceSession?.institutionType,
        fallbackCategory: w.category,
      }),
    }));
  }, [importedWidgetDefs, complianceSession?.institutionType]);

  useEffect(() => {
    try {
      const raw = typeof window !== 'undefined' ? window.localStorage.getItem(COMPLIANCE_SESSION_STORAGE_KEY) : null;
      if (!raw) return;
      const session = JSON.parse(raw) as ComplianceSession;
      setComplianceSession(session);
    } catch {
      setComplianceSession(null);
    }
  }, []);

  const categories = [
    { value: 'all', label: 'All Widgets' },
    { value: 'remittance', label: 'Remittance company' },
    { value: 'fintech', label: 'Fintech payments' },
    { value: 'bank', label: 'Bank / Neobank' },
    { value: 'stablecoin', label: 'Stablecoin issuer' },
    { value: 'ngo', label: 'NGO' },
    { value: 'rwa', label: 'RWA platform' },
    { value: 'custom', label: 'Custom' },
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
        if (
          widget.id === 'stablecoin-peg-stability-monitor' ||
          widget.id === 'bank-liquidity-monitor' ||
          widget.id === 'fintech-compliance-score-gauge' ||
          widget.id === 'rwa-proof-of-reserve' ||
          widget.id === 'remittance-transaction-limits-tracker'
        ) {
          return (
            <GaugeChart
              value={72}
              label={widget.title}
              status="Example"
              size={220}
            />
          );
        }
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
        if (widget.id === 'fintech-payment-volume-by-method' || widget.id === 'ngo-expense-ratio-monitor') {
          return (
            <DonutChart
              data={assetDistributionData}
              dataKey="value"
              nameKey="name"
              height={200}
            />
          );
        }
        if (widget.id === 'stablecoin-mint-burn-volume' || widget.id === 'ngo-impact-metrics') {
          return (
            <BarChart
              data={transactionVolumeData}
              xDataKey="x"
              yDataKey="value"
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
        if (widget.type === 'table') {
          return (
            <div>
              <div style={{ fontSize: 12, opacity: 0.7, marginBottom: 8 }}>Example table</div>
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 12 }}>
                <thead>
                  <tr>
                    <th style={{ textAlign: 'left', borderBottom: '1px solid #e5e7eb', padding: '6px 4px' }}>Item</th>
                    <th style={{ textAlign: 'left', borderBottom: '1px solid #e5e7eb', padding: '6px 4px' }}>Status</th>
                    <th style={{ textAlign: 'left', borderBottom: '1px solid #e5e7eb', padding: '6px 4px' }}>Updated</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td style={{ borderBottom: '1px solid #f3f4f6', padding: '6px 4px' }}>{widget.title}</td>
                    <td style={{ borderBottom: '1px solid #f3f4f6', padding: '6px 4px' }}>OK</td>
                    <td style={{ borderBottom: '1px solid #f3f4f6', padding: '6px 4px' }}>2m ago</td>
                  </tr>
                  <tr>
                    <td style={{ borderBottom: '1px solid #f3f4f6', padding: '6px 4px' }}>Rule set</td>
                    <td style={{ borderBottom: '1px solid #f3f4f6', padding: '6px 4px' }}>Review</td>
                    <td style={{ borderBottom: '1px solid #f3f4f6', padding: '6px 4px' }}>1h ago</td>
                  </tr>
                </tbody>
              </table>
            </div>
          );
        }
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

      {complianceSession && (
        <Card title="From Compliance Maker" css={styles.complianceSessionCard}>
          <div css={styles.complianceSessionContent}>
            <div css={styles.complianceSessionRow}>
              <span css={styles.complianceSessionLabel}>Institution:</span>
              <strong>{complianceSession.institutionName}</strong>
            </div>
            <div css={styles.complianceSessionRow}>
              <span css={styles.complianceSessionLabel}>Type:</span>
              <span>{complianceSession.institutionTypeLabel || complianceSession.institutionType}</span>
            </div>
            <div css={styles.complianceSessionSnippet}>
              <span css={styles.complianceSessionLabel}>Analysis snippet:</span>
              <p css={styles.complianceSessionAnalysis}>
                {(complianceSession.analysis || '').slice(0, 280)}
                {(complianceSession.analysis || '').length > 280 ? '…' : ''}
              </p>
            </div>
            <div css={styles.complianceSessionMeta}>
              <span css={styles.complianceSessionSaved}>
                Saved {new Date(complianceSession.savedAt).toLocaleString()}
                {complianceSession.suggestedChecklist?.length > 0 &&
                  ` · ${complianceSession.suggestedChecklist.length} recommended widgets`}
              </span>
              <Button
                variant="secondary"
                size="small"
                onClick={() => router.push(ROUTES.WORKSPACE.COMPLIANCE_MAKER)}
              >
                <Icon name="tools" />
                Open Compliance Maker
              </Button>
            </div>
          </div>
        </Card>
      )}

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
