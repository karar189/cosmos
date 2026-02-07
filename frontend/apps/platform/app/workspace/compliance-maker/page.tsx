/** @jsxImportSource @emotion/react */
'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Card, Core3Button as Button, Select, Icon, Badge, Section } from '@core3/ui-components';
import useTranslation from '@/hooks/useTranslation';
import { ROUTES } from '@/constants/routes';
import * as styles from './page.styles';

const IMPORTED_WIDGETS_STORAGE_KEY = 'cosmops_imported_widgets';

function getImportedWidgets(): ComplianceWidget[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = window.localStorage.getItem(IMPORTED_WIDGETS_STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function addWidgetToImports(widget: ComplianceWidget) {
  const list = getImportedWidgets();
  if (list.some((w) => w.id === widget.id)) return;
  list.push(widget);
  window.localStorage.setItem(IMPORTED_WIDGETS_STORAGE_KEY, JSON.stringify(list));
}

interface InstitutionType {
  id: string;
  name: string;
  widgets: {
    name: string;
    description: string;
    priority: 'high' | 'medium' | 'low';
    category: string;
  }[];
}

const institutionTypes: InstitutionType[] = [
  { 
    id: 'rwa', 
    name: 'RWA (Real World Assets)', 
    widgets: [
      { name: 'Asset Tokenization Tracker', description: 'Real-time monitoring of tokenized assets, on-chain representation, and reserve backing status', priority: 'high', category: 'Monitoring' },
      { name: 'RWA Compliance Monitor', description: 'Automated regulatory scanning across 40+ jurisdictions for asset classification changes', priority: 'high', category: 'Compliance' },
      { name: 'Yield Analytics', description: 'Track and report yield distributions with tax reporting and regulatory disclosures', priority: 'medium', category: 'Analytics' },
      { name: 'Regulatory Reporting', description: 'Auto-generate SEC, MAS, FCA reports with ISO 20022 formatted outputs', priority: 'medium', category: 'Reporting' },
      { name: 'Proof-of-Reserve Oracle', description: 'On-chain attestation of off-chain collateral via oracle integration', priority: 'high', category: 'Verification' },
      { name: 'Soroban Enforcement Module', description: 'Smart contract-based freeze/clawback capabilities for regulatory compliance', priority: 'low', category: 'Enforcement' },
    ]
  },
  { 
    id: 'stablecoin', 
    name: 'Stablecoin / Fiat Issuers', 
    widgets: [
      { name: 'Reserve Monitoring', description: 'Real-time fiat reserve tracking, bank balance monitoring, and collateral composition analysis', priority: 'high', category: 'Monitoring' },
      { name: 'Redemption Tracker', description: 'Monitor redemption requests, processing times, and SLA compliance metrics', priority: 'high', category: 'Operations' },
      { name: 'Regulatory Compliance', description: 'Multi-jurisdiction engine covering MiCA, NYDFS, MAS, and 30+ frameworks', priority: 'high', category: 'Compliance' },
      { name: 'Audit Dashboard', description: 'Continuous audit trail with real-time attestation and external auditor integration', priority: 'medium', category: 'Audit' },
      { name: 'Trustline Analytics', description: 'Holder risk distribution analysis and geo-distribution monitoring', priority: 'medium', category: 'Analytics' },
      { name: 'Freeze/Unfreeze Panel', description: 'Administrative controls for token freezing with full audit trail', priority: 'low', category: 'Enforcement' },
    ]
  },
  { 
    id: 'neobank', 
    name: 'Neobanks', 
    widgets: [
      { name: 'KYC/KYB Dashboard', description: 'Centralized identity verification with risk scoring, document verification, and tiered KYC', priority: 'high', category: 'Identity' },
      { name: 'Transaction Monitoring', description: 'AI-powered real-time monitoring detecting structuring, smurfing, and suspicious patterns', priority: 'high', category: 'Monitoring' },
      { name: 'Risk Scoring Engine', description: 'Dynamic customer risk scoring based on behavior, geography, and network analysis', priority: 'high', category: 'Risk' },
      { name: 'Regulatory Reporting', description: 'Automated STR, SAR, CTR generation with compliance deadline tracking', priority: 'medium', category: 'Reporting' },
      { name: 'Large-Value Transfer Monitor', description: 'Threshold-based monitoring for high-value transactions with escalation workflows', priority: 'medium', category: 'Monitoring' },
      { name: 'Jurisdiction Rule Engine', description: 'Configurable rules per operating jurisdiction with automatic enforcement', priority: 'low', category: 'Compliance' },
    ]
  },
  { 
    id: 'ngo', 
    name: 'NGOs / Aid Organizations', 
    widgets: [
      { name: 'Donation Tracker', description: 'End-to-end tracking of donations with source verification and donor compliance documentation', priority: 'high', category: 'Tracking' },
      { name: 'Fund Flow Monitor', description: 'Visual mapping of fund flows from receipt to final beneficiary with diversion detection', priority: 'high', category: 'Monitoring' },
      { name: 'Compliance Checker', description: 'Real-time sanctions screening against OFAC, EU, UN lists with automated blocking', priority: 'high', category: 'Compliance' },
      { name: 'Transparency Dashboard', description: 'Public-facing reports showing fund utilization rates and beneficiary impact metrics', priority: 'medium', category: 'Reporting' },
      { name: 'Geo-Risk Scoring', description: 'High-risk region assessment for all operational corridors', priority: 'medium', category: 'Risk' },
      { name: 'Wallet Behavior Profiler', description: 'Beneficiary verification through transaction pattern analysis', priority: 'low', category: 'Analytics' },
    ]
  },
  { 
    id: 'remittance', 
    name: 'Remittance Companies', 
    widgets: [
      { name: 'Corridor Risk Monitor', description: 'Real-time risk scoring using FATF data, sanctions lists, and historical transaction analysis', priority: 'high', category: 'Risk' },
      { name: 'Transaction Limits Engine', description: 'Configurable daily/weekly/monthly limits per customer, corridor, and agent', priority: 'high', category: 'Enforcement' },
      { name: 'AML Screening', description: 'Real-time screening against OFAC, EU, UN lists with fuzzy matching and alias detection', priority: 'high', category: 'Compliance' },
      { name: 'Regulatory Compliance', description: 'Multi-jurisdiction money transmitter license tracking and reporting', priority: 'medium', category: 'Compliance' },
      { name: 'Smurfing Detection', description: 'AI-powered detection of transaction structuring across customer accounts', priority: 'medium', category: 'Detection' },
      { name: 'Memo Validator', description: 'Enforce memo requirements on all transfers with validation rules', priority: 'low', category: 'Enforcement' },
    ]
  },
  { 
    id: 'fintech', 
    name: 'Fintech Payment Apps', 
    widgets: [
      { name: 'Payment Analytics', description: 'Real-time payment flows, success rates, failure patterns, and ISO 20022 formatting', priority: 'high', category: 'Analytics' },
      { name: 'Fraud Detection', description: 'AI-powered fraud scoring detecting account takeovers, velocity abuse, and coordinated fraud', priority: 'high', category: 'Detection' },
      { name: 'Compliance Score', description: 'Organization-wide compliance score across all regulatory frameworks with gap analysis', priority: 'high', category: 'Compliance' },
      { name: 'User Risk Assessment', description: 'Dynamic risk profiling based on onboarding data, behavior, and device patterns', priority: 'medium', category: 'Risk' },
      { name: 'Sanctions Screening', description: 'Real-time screening on all payment flows with automated blocking', priority: 'medium', category: 'Compliance' },
      { name: 'ISO 20022 Formatter', description: 'Auto-format Stellar transactions into ISO 20022 bank messages', priority: 'low', category: 'Integration' },
    ]
  },
];

interface ComplianceWidget {
  id: string;
  name: string;
  category: string;
  description: string;
  priority: 'high' | 'medium' | 'low';
  enabled: boolean;
}

export default function ComplianceMakerPage() {
  useTranslation('workspace');
  const [institutionType, setInstitutionType] = useState<string>('');
  const [lookingFor, setLookingFor] = useState<string>('');
  const [existingAudits, setExistingAudits] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [aiAnalysis, setAiAnalysis] = useState<string>('');
  const [suggestedChecklist, setSuggestedChecklist] = useState<ComplianceWidget[]>([]);
  const [analysisSource, setAnalysisSource] = useState<string>('');
  const [hasSubmitted, setHasSubmitted] = useState(false);
  const [importedIds, setImportedIds] = useState<Set<string>>(new Set());
  const [selectedWidgetIds, setSelectedWidgetIds] = useState<Set<string>>(new Set());
  const router = useRouter();

  useEffect(() => {
    const stored = getImportedWidgets();
    setImportedIds(new Set(stored.map((w) => w.id)));
  }, []);

  const toggleWidgetSelection = (id: string) => {
    setSelectedWidgetIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const handleImportSelectedToDashboard = () => {
    const toImport = suggestedChecklist.filter((w) => selectedWidgetIds.has(w.id));
    toImport.forEach((w) => addWidgetToImports(w));
    setImportedIds((prev) => new Set([...prev, ...selectedWidgetIds]));
    setSelectedWidgetIds(new Set());
    router.push(ROUTES.WORKSPACE.DASHBOARD_BUILDER);
  };

  const handleSubmit = async () => {
    if (!institutionType || !lookingFor) return;

    setIsSubmitting(true);
    setHasSubmitted(true);
    setAiAnalysis('');
    setSuggestedChecklist([]);
    
    const selectedInst = institutionTypes.find(t => t.id === institutionType);

    try {
      const response = await fetch('/api/compliance/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ institutionType, lookingFor, existingAudits }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || `API error ${response.status}`);
      }

      setAiAnalysis(data.analysis || 'Unable to generate analysis.');
      setAnalysisSource(data.source || 'ai');
    } catch (error) {
      console.error('Error calling AI:', error);
      setAiAnalysis('Analysis generated from built-in compliance engine. Connect OpenAI for personalized recommendations.');
      setAnalysisSource('fallback');
    } finally {
      const checklist: ComplianceWidget[] = selectedInst?.widgets.map((widget, index) => ({
        id: `widget-${index}`,
        name: widget.name,
        category: widget.category,
        description: widget.description,
        priority: widget.priority,
        enabled: true,
      })) || [];
      setSuggestedChecklist(checklist);
      setIsSubmitting(false);
    }
  };

  const priorityColor = (p: string) => {
    if (p === 'high') return 'red' as const;
    if (p === 'medium') return 'orange' as const;
    return 'gray' as const;
  };

  const renderAnalysis = (text: string) => {
    const lines = text.split('\n');
    return lines.map((line, i) => {
      const trimmed = line.trim();
      if (trimmed.startsWith('## ')) {
        return <h2 key={i} css={styles.analysisH2}>{trimmed.replace('## ', '')}</h2>;
      }
      if (trimmed.startsWith('### ')) {
        return <h3 key={i} css={styles.analysisH3}>{trimmed.replace('### ', '')}</h3>;
      }
      if (trimmed.startsWith('- **')) {
        const match = trimmed.match(/^- \*\*(.+?)\*\*:?\s*(.*)/);
        if (match) {
          return (
            <div key={i} css={styles.analysisBullet}>
              <span css={styles.bulletDot}>&#8226;</span>
              <span><strong>{match[1]}</strong>{match[2] ? `: ${match[2]}` : ''}</span>
            </div>
          );
        }
      }
      if (trimmed.startsWith('- ')) {
        return (
          <div key={i} css={styles.analysisBullet}>
            <span css={styles.bulletDot}>&#8226;</span>
            <span>{trimmed.replace('- ', '')}</span>
          </div>
        );
      }
      if (/^\d+\.\s\*\*/.test(trimmed)) {
        const match = trimmed.match(/^\d+\.\s\*\*(.+?)\*\*\s*[—–-]?\s*(.*)/);
        if (match) {
          return (
            <div key={i} css={styles.analysisNumbered}>
              <span css={styles.numberedIcon}><Icon name="check-circle" css={styles.numberedCheckIcon} /></span>
              <span><strong>{match[1]}</strong> — {match[2]}</span>
            </div>
          );
        }
      }
      if (trimmed === '') return <div key={i} css={styles.analysisSpacer} />;
      return <p key={i} css={styles.analysisParagraph}>{trimmed}</p>;
    });
  };

  return (
    <div css={styles.pageContainer}>
      {/* Section header (project-overview style) */}
      <div css={styles.pageSectionHeader}>
        <div>
          <h1 css={styles.pageSectionTitle}>Compliance Maker</h1>
          <p css={styles.sectionDescription}>
            Configure your compliance checklist with AI-powered recommendations
          </p>
        </div>
      </div>

      <div css={styles.twoColumnLayout}>
        {/* Left Column - Form (visual blocks) */}
        <div css={styles.leftColumn}>
          <section css={styles.institutionOnboardingSection}>
            <h2 css={styles.institutionOnboardingTitle}>Institution Onboarding</h2>
            <div css={styles.formContent}>
              <div css={styles.formBlock}>
                <label css={styles.label}>
                  1. Type of Institution <span css={styles.required}>*</span>
                </label>
                <Select
                  value={institutionType}
                  onChange={(val: string | number) => setInstitutionType(String(val))}
                  options={institutionTypes.map((type) => ({
                    value: type.id,
                    label: type.name,
                  }))}
                />
              </div>
              <div css={styles.formBlock}>
                <label css={styles.label}>
                  2. What are you looking for? <span css={styles.required}>*</span>
                </label>
                <textarea
                  css={styles.textarea}
                  value={lookingFor}
                  onChange={(e) => setLookingFor(e.target.value)}
                  placeholder="Describe your compliance needs, goals, and requirements..."
                  rows={3}
                />
              </div>
              <div css={styles.formBlock}>
                <label css={styles.label}>
                  3. Existing audits & security rails?
                </label>
                <textarea
                  css={styles.textarea}
                  value={existingAudits}
                  onChange={(e) => setExistingAudits(e.target.value)}
                  placeholder="Describe your current security infrastructure..."
                  rows={3}
                />
              </div>
              <div css={styles.submitButtonWrapper}>
                <Button
                  variant="primary"
                  size="large"
                  onClick={handleSubmit}
                  disabled={!institutionType || !lookingFor || isSubmitting}
                >
                  {isSubmitting ? 'Analyzing...' : 'Submit & Analyze'}
                  <Icon name="data-transfer" />
                </Button>
              </div>
            </div>
          </section>
        </div>

        {/* Right Column - Section + Cards (project-overview style) */}
        <div css={styles.rightColumn}>
          <Section
            id="ai-analysis"
            showHeader={true}
            iconName="tools"
            title="AI Analysis & Recommendations"
            areas={[['analysis']]}
            columns={1}
          >
            <div css={styles.analysisSectionContent}>
              {!hasSubmitted ? (
                <Card css={styles.emptyStateCard}>
                  <div css={styles.emptyState}>
                    <Icon name="tools" css={styles.emptyStateIcon} />
                    <p css={styles.emptyStateText}>
                      Fill out the form and submit to get AI-powered compliance recommendations.
                    </p>
                    <p css={styles.emptyStateSubtext}>
                      Our engine analyzes your institution type, requirements, and infrastructure to generate a personalized checklist.
                    </p>
                  </div>
                </Card>
              ) : (
                <>
                  {isSubmitting && (
                    <Card css={styles.loadingCard}>
                      <div css={styles.loadingState}>
                        <div css={styles.loadingDots}>
                          <span css={styles.dot} />
                          <span css={styles.dot} />
                          <span css={styles.dot} />
                        </div>
                        <p css={styles.loadingText}>Analyzing compliance requirements...</p>
                      </div>
                    </Card>
                  )}
                  {aiAnalysis && !isSubmitting && (
                    <Card css={styles.analysisResultCard}>
                      <div css={styles.aiAnalysisHeader}>
                        <Icon name="tools" css={styles.aiAnalysisIcon} />
                        <span css={styles.aiAnalysisLabel}>Compliance Analysis</span>
                        {analysisSource && (
                          <Badge color={analysisSource === 'openai' ? 'green' : 'gray'}>
                            {analysisSource === 'openai' ? 'AI Generated' : 'Built-in Engine'}
                          </Badge>
                        )}
                      </div>
                      <div css={styles.aiAnalysisBody}>
                        {renderAnalysis(aiAnalysis)}
                      </div>
                    </Card>
                  )}
                </>
              )}
            </div>
          </Section>

          {/* Recommended Checklist - Section with card grid + single Import button */}
          {suggestedChecklist.length > 0 && (
            <>
            <Section
              id="recommended-checklist"
              showHeader={true}
              iconName="checkmark"
              title="Recommended Checklist"
              headerContent={
                <p css={styles.checklistSectionNote}>
                  {suggestedChecklist.length} widgets — select cards, then use Import below
                  {importedIds.size > 0 && ` (${importedIds.size} already in Dashboard)`}
                </p>
              }
              columns={2}
              gap="m"
            >
              {suggestedChecklist.map((item) => (
                <div
                  key={item.id}
                  role="button"
                  tabIndex={0}
                  onClick={() => toggleWidgetSelection(item.id)}
                  onKeyDown={(e) => e.key === 'Enter' && toggleWidgetSelection(item.id)}
                  css={[
                    styles.widgetCardWrapper,
                    selectedWidgetIds.has(item.id) && styles.widgetCardWrapperSelected,
                  ]}
                >
                  <Card title={item.name} css={styles.widgetCard}>
                    <div css={styles.widgetCardSelectIndicator}>
                      {selectedWidgetIds.has(item.id) ? (
                        <Icon name="check-circle" css={styles.widgetCardSelectIcon} />
                      ) : (
                        <span css={styles.widgetCardSelectEmpty} />
                      )}
                      <span css={styles.widgetCardSelectLabel}>
                        {selectedWidgetIds.has(item.id) ? 'Selected' : 'Select'}
                      </span>
                    </div>
                    <p css={styles.widgetCardDescription}>{item.description}</p>
                    <div css={styles.widgetCardBadges}>
                      <Badge color={priorityColor(item.priority)}>{item.priority}</Badge>
                      <Badge color="gray">{item.category}</Badge>
                    </div>
                  </Card>
                </div>
              ))}
            </Section>
              <div css={styles.importButtonContainer}>
                <Button
                  variant="primary"
                  size="medium"
                  onClick={handleImportSelectedToDashboard}
                  disabled={selectedWidgetIds.size === 0}
                >
                  <Icon name="data-transfer" css={styles.importButtonIcon} />
                  Import to Dashboard {selectedWidgetIds.size > 0 ? `(${selectedWidgetIds.size})` : ''}
                </Button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
