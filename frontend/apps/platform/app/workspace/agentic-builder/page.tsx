'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { ROUTES } from '@/constants/routes';

/**
 * Agentic Builder is merged into Compliance Maker.
 * Redirect legacy /workspace/agentic-builder to Compliance Maker.
 */
export default function AgenticBuilderRedirect() {
  const router = useRouter();

  useEffect(() => {
    router.replace(ROUTES.WORKSPACE.COMPLIANCE_MAKER);
  }, [router]);

<<<<<<< Updated upstream
  const businessTypeHintPresets = [
    'Remittance company',
    'Fintech payments',
    'Bank / Neobank',
    'Stablecoin issuer',
    'NGO',
    'RWA platform',
  ];

  const formatUsd = (n: number) =>
    new Intl.NumberFormat(undefined, { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(n);

  const formatHours = (n: number) => `${Math.round(n * 10) / 10}h/mo`;

  const parseCsv = (s: string) =>
    (s || '')
      .split(',')
      .map((x) => x.trim())
      .filter(Boolean);

  const toOptionalInt = (s: string) => {
    const v = Number.parseInt((s || '').trim(), 10);
    return Number.isFinite(v) && v >= 0 ? v : undefined;
  };

  const toOptionalFloat = (s: string) => {
    const v = Number.parseFloat((s || '').trim());
    return Number.isFinite(v) && v >= 0 ? v : undefined;
  };

  const handleAgenticSubmit = async () => {
    setAgentError('');
    setAgentResponse(null);

    if (!agentBusinessName.trim() || agentBusinessDescription.trim().length < 20) {
      setAgentError('Please add a business name and a description (at least ~20 characters).');
      return;
    }

    const body = {
      business_name: agentBusinessName.trim(),
      business_description: agentBusinessDescription.trim(),
      business_type_hint: agentBusinessTypeHint.trim() || undefined,
      geographies: parseCsv(agentGeographies),
      products: parseCsv(agentProducts),
      monthly_transactions: toOptionalInt(agentMonthlyTransactions),
      avg_transaction_value_usd: toOptionalFloat(agentAvgTxnValue),
      ops_hourly_rate_usd: toOptionalFloat(agentOpsRate) ?? 65,
      compliance_hourly_rate_usd: toOptionalFloat(agentComplianceRate) ?? 85,
      platform_cost_usd_per_month: toOptionalFloat(agentPlatformCost),
      constraints: agentConstraints.trim() || undefined,
    };

    setAgentLoading(true);
    try {
      // Call same-origin proxy to avoid browser CORS issues
      const res = await fetch(`/api/agentic/widgets/recommendations`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });

      const data = (await res.json()) as AgenticRecommendationsResponse | { error?: string; detail?: unknown };
      if (!res.ok) {
        const msg =
          (data as any)?.error ||
          (typeof (data as any)?.detail === 'string' ? (data as any).detail : '') ||
          `Request failed (${res.status})`;
        throw new Error(msg);
      }

      setAgentResponse(data as AgenticRecommendationsResponse);
    } catch (e) {
      const raw = e instanceof Error ? e.message : 'Failed to generate recommendations.';
      // When the browser blocks cross-origin requests, fetch often throws "Failed to fetch"
      const friendly =
        raw.toLowerCase().includes('failed to fetch')
          ? 'Failed to reach the Agentic backend. If you are using Render, the free tier may be sleeping—retry in a few seconds. (Backend URL is configured via COSMOS_AI_URL / NEXT_PUBLIC_COSMOS_AI_URL.)'
          : raw;
      setAgentError(friendly);
    } finally {
      setAgentLoading(false);
    }
  };

  const handleCustomizeBundle = (bundle: AgenticRecommendationsResponse['bundles'][number]) => {
    const draft = makeDraftFromBundle(bundle);
    const base = agentBusinessName.trim() || 'Dashboard';
    draft.name = `${base} · ${bundle.name}`;
    writeDraft(draft);
    router.push('/dashboard-workspace');
  };

  return (
    <div css={styles.pageContainer}>
      <div css={styles.pageSectionHeader}>
        <div>
          <h1 css={styles.pageSectionTitle}>Agentic Builder</h1>
          <p css={styles.sectionDescription}>
            Describe your business and get the best widget combinations with quantified time + cost savings.
          </p>
        </div>
      </div>

      <Section
        id="agentic-builder"
        showHeader={true}
        iconName="tools"
        title="Agentic Builder"
        columns={1}
      >
        <div css={styles.agenticSectionContent}>
          <Card css={styles.agenticFormCard}>
            <div css={styles.agenticFormGrid}>
              <div css={styles.formBlock}>
                <label css={styles.label}>Business name <span css={styles.required}>*</span></label>
                <Input
                  value={agentBusinessName}
                  onChange={(e) => setAgentBusinessName(e.target.value)}
                  placeholder="e.g. StellarPayouts"
                />
              </div>
              <div css={styles.formBlock}>
                <label css={styles.label}>Business type hint</label>
                <Input
                  value={agentBusinessTypeHint}
                  onChange={(e) => setAgentBusinessTypeHint(e.target.value)}
                  placeholder="Pick a preset below, or type your own…"
                />
                <div css={styles.hintSuggestions}>
                  {businessTypeHintPresets.map((label) => (
                    <button
                      key={label}
                      type="button"
                      css={styles.hintSuggestionButton}
                      onClick={() => setAgentBusinessTypeHint(label)}
                    >
                      {label}
                    </button>
                  ))}
                  <button
                    type="button"
                    css={styles.hintSuggestionButton}
                    onClick={() => setAgentBusinessTypeHint('')}
                    aria-label="Use custom hint"
                    title="Custom"
                  >
                    Custom
                  </button>
                </div>
              </div>

              <div css={[styles.formBlock, styles.agenticFullWidth]}>
                <label css={styles.label}>Business description <span css={styles.required}>*</span></label>
                <textarea
                  css={styles.textarea}
                  value={agentBusinessDescription}
                  onChange={(e) => setAgentBusinessDescription(e.target.value)}
                  placeholder="What do you do, who are your customers, what do you want to monitor/optimize?"
                  rows={4}
                />
              </div>

              <div css={styles.formBlock}>
                <label css={styles.label}>Geographies (comma-separated)</label>
                <Input
                  value={agentGeographies}
                  onChange={(e) => setAgentGeographies(e.target.value)}
                  placeholder="e.g. US, IN, PH"
                />
              </div>
              <div css={styles.formBlock}>
                <label css={styles.label}>Products (comma-separated)</label>
                <Input
                  value={agentProducts}
                  onChange={(e) => setAgentProducts(e.target.value)}
                  placeholder="e.g. cross-border payouts, cards"
                />
              </div>

              <div css={styles.formBlock}>
                <label css={styles.label}>Monthly transactions</label>
                <Input
                  value={agentMonthlyTransactions}
                  onChange={(e) => setAgentMonthlyTransactions(e.target.value)}
                  placeholder="e.g. 120000"
                />
              </div>
              <div css={styles.formBlock}>
                <label css={styles.label}>Avg transaction value (USD)</label>
                <Input
                  value={agentAvgTxnValue}
                  onChange={(e) => setAgentAvgTxnValue(e.target.value)}
                  placeholder="e.g. 120"
                />
              </div>

              <div css={styles.formBlock}>
                <label css={styles.label}>Ops hourly rate (USD)</label>
                <Input
                  value={agentOpsRate}
                  onChange={(e) => setAgentOpsRate(e.target.value)}
                  placeholder="e.g. 65"
                />
              </div>
              <div css={styles.formBlock}>
                <label css={styles.label}>Compliance hourly rate (USD)</label>
                <Input
                  value={agentComplianceRate}
                  onChange={(e) => setAgentComplianceRate(e.target.value)}
                  placeholder="e.g. 85"
                />
              </div>

              <div css={styles.formBlock}>
                <label css={styles.label}>Platform cost (USD/month)</label>
                <Input
                  value={agentPlatformCost}
                  onChange={(e) => setAgentPlatformCost(e.target.value)}
                  placeholder="e.g. 2500"
                />
              </div>
              <div css={styles.formBlock}>
                <label css={styles.label}>Constraints</label>
                <Input
                  value={agentConstraints}
                  onChange={(e) => setAgentConstraints(e.target.value)}
                  placeholder="e.g. OFAC screening required, budget-conscious"
                />
              </div>
            </div>

            {agentError && <p css={styles.agenticError}>{agentError}</p>}

            <div css={styles.agenticActionsRow}>
              <Button
                variant="primary"
                size="medium"
                onClick={handleAgenticSubmit}
                disabled={agentLoading}
              >
                {agentLoading ? 'Building…' : 'Build widget combinations'}
                <Icon name="tools" />
              </Button>
            </div>
          </Card>

          {agentLoading && (
            <Card css={styles.bundleCard}>
              <div css={styles.loadingState}>
                <div css={styles.loadingDots}>
                  <span css={styles.dot} />
                  <span css={styles.dot} />
                  <span css={styles.dot} />
                </div>
                <p css={styles.loadingText}>Generating widget combinations…</p>
              </div>
            </Card>
          )}

          {agentResponse && !agentLoading && (
            <>
              <Card css={styles.bundleCard}>
                <div css={styles.bundleHeader}>
                  <h3 css={styles.bundleTitle}>Business profile</h3>
                  <div css={styles.bundleTotals}>
                    <Badge color="gray">{agentResponse.source === 'openai' ? 'AI' : 'Heuristic'}</Badge>
                    <Badge color="gray">
                      Confidence {Math.round((agentResponse.business_profile.confidence || 0) * 100)}%
                    </Badge>
                  </div>
                </div>
                <p css={styles.widgetWhy}>{agentResponse.business_profile.rationale}</p>
                <div css={styles.widgetBadges}>
                  {(agentResponse.business_profile.inferred_categories || []).map((c) => (
                    <Badge key={c} color="gray">{c}</Badge>
                  ))}
                </div>
              </Card>

              {agentResponse.bundles.map((bundle) => (
                <Card key={bundle.id} css={styles.bundleCard} title={bundle.name}>
                  <div css={styles.bundleHeader}>
                    <div>
                      <p css={styles.widgetWhy}>{bundle.description}</p>
                    </div>
                    <div css={styles.bundleTotals}>
                      <Badge color="green">{formatHours(bundle.totals.time_saved_hours_per_month)}</Badge>
                      <Badge color="green">{formatUsd(bundle.totals.cost_savings_usd_per_month)}/mo</Badge>
                      {bundle.totals.roi_percent !== null && (
                        <Badge color="gray">ROI {bundle.totals.roi_percent}%</Badge>
                      )}
                      <Button
                        variant="primary"
                        size="small"
                        onClick={() => handleCustomizeBundle(bundle)}
                      >
                        Customize
                        <Icon name="data-stack" />
                      </Button>
                    </div>
                  </div>

                  <div css={styles.widgetList}>
                    {bundle.widgets.map((w) => (
                      <div key={w.id} css={styles.widgetRow}>
                        <div css={styles.widgetRowTop}>
                          <p css={styles.widgetName}>{w.title}</p>
                          <div css={styles.widgetBadges}>
                            <Badge color="gray">{w.category}</Badge>
                            <Badge color="gray">{w.type}</Badge>
                            <Badge color="green">{formatHours(w.impact.time_saved_hours_per_month)}</Badge>
                            <Badge color="green">{formatUsd(w.impact.cost_savings_usd_per_month)}/mo</Badge>
                          </div>
                        </div>
                        <p css={styles.widgetWhy}>{w.why}</p>
                      </div>
                    ))}
                  </div>
                </Card>
              ))}
            </>
          )}
        </div>
      </Section>
    </div>
  );
=======
  return null;
>>>>>>> Stashed changes
}
