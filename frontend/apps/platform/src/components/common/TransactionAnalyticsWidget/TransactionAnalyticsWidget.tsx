/** @jsxImportSource @emotion/react */
'use client';

import { useCallback, useEffect, useState } from 'react';
import {
  Card,
  Core3Button as Button,
  Input,
  SingleLineChart,
  BarChart,
  formatDateLabel,
  BaseModal,
  LoadingSpinner,
} from '@core3/ui-components';
import { flex, spacing, typography, coloring } from '@core3/ui-components/styleSystem';
import { css } from '@emotion/react';

interface HorizonTxRecord {
  id: string;
  created_at: string;
  successful?: boolean;
}

interface HorizonResponse {
  _embedded?: { records: HorizonTxRecord[] };
}

function aggregateByDate(records: HorizonTxRecord[]): { x: string; value: number }[] {
  const byDate: Record<string, number> = {};
  for (const r of records) {
    const dateStr = r.created_at.split('T')[0];
    byDate[dateStr] = (byDate[dateStr] ?? 0) + 1;
  }
  const sorted = Object.entries(byDate).sort(([a], [b]) => a.localeCompare(b));
  return sorted.map(([x, value]) => ({ x, value }));
}

/** Stellar public keys start with G and are 56 chars. Only fetch when format is valid. */
function isValidStellarAddress(value: string): boolean {
  const trimmed = value.trim();
  return trimmed.length >= 56 && (trimmed.startsWith('G') || trimmed.startsWith('g'));
}

export interface TransactionAnalyticsWidgetProps {
  /** Stellar wallet public key (G...) from widget settings */
  stellarWallet?: string;
}

export function TransactionAnalyticsWidget({ stellarWallet }: TransactionAnalyticsWidgetProps) {
  const [wallet, setWallet] = useState(stellarWallet ?? '');
  const [modalOpen, setModalOpen] = useState(false);
  const [modalWallet, setModalWallet] = useState(stellarWallet ?? '');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [chartData, setChartData] = useState<{ x: string; value: number }[]>([]);

  const effectiveWallet = wallet || stellarWallet || '';

  const fetchTransactions = useCallback(async (accountId: string) => {
    if (!accountId.trim()) return;
    if (!isValidStellarAddress(accountId)) {
      setError('Enter a valid Stellar address (starts with G, 56 characters).');
      setChartData([]);
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(
        `/api/stellar/transactions?accountId=${encodeURIComponent(accountId.trim())}&limit=200`
      );
      const body = await res.json().catch(() => ({}));
      if (!res.ok) {
        const message = typeof body?.error === 'string' ? body.error : `Failed to load transactions (${res.status})`;
        throw new Error(message);
      }
      const data = body as HorizonResponse;
      const records = data._embedded?.records ?? [];
      setChartData(aggregateByDate(records));
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Failed to fetch transactions');
      setChartData([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (effectiveWallet && isValidStellarAddress(effectiveWallet)) {
      fetchTransactions(effectiveWallet);
    } else {
      setLoading(false);
      if (effectiveWallet && !isValidStellarAddress(effectiveWallet)) {
        setError('Enter a valid Stellar address (starts with G, 56 characters).');
      } else {
        setError(null);
      }
      setChartData([]);
    }
  }, [effectiveWallet, fetchTransactions]);

  const openModal = () => {
    setModalWallet(effectiveWallet);
    setModalOpen(true);
  };

  const applyModalWallet = () => {
    const w = modalWallet.trim();
    if (w) {
      setWallet(w);
      fetchTransactions(w);
    }
    // Keep modal open so user can see the transaction flow chart
  };

  return (
    <div css={styles.widgetWrap}>
      <Card
        css={[styles.dataCard, styles.clickableCard]}
        onClick={openModal}
      >
        <div css={styles.chartCardInner}>
          <h3 css={styles.chartCardTitle}>Transaction Analytics</h3>
          <p css={styles.hint}>Click to enter wallet or view transaction flow</p>
          {loading && (
            <div css={styles.loadingWrap}>
              <LoadingSpinner size="small" />
            </div>
          )}
          {error && !loading && (
            <p css={styles.errorText}>{error}</p>
          )}
          {!loading && !error && chartData.length > 0 && (
            <BarChart
              data={chartData}
              height={160}
              xDataKey="x"
              yDataKey="value"
              xAxisLabelFormatter={formatDateLabel}
              margin={{ top: 5, right: 0, left: 0, bottom: 20 }}
            />
          )}
          {!loading && !error && chartData.length === 0 && effectiveWallet && (
            <p css={styles.secondaryText}>No transactions found for this wallet.</p>
          )}
          {!loading && !effectiveWallet && (
            <p css={styles.secondaryText}>Enter a Stellar wallet (G...) in the workspace or click here.</p>
          )}
        </div>
      </Card>

      <BaseModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        title="Transaction Analytics"
      >
        <div css={styles.modalContent}>
          <div css={styles.field}>
            <label css={styles.label}>Stellar wallet address</label>
            <Input
              value={modalWallet}
              onChange={(e) => setModalWallet(e.target.value)}
              placeholder="e.g. G..."
            />
          </div>
          <Button variant="primary" size="small" onClick={applyModalWallet}>
            Apply &amp; show flow
          </Button>
          {modalWallet.trim() && (
            <div css={styles.flowChartWrap}>
              <h4 css={styles.flowTitle}>Transaction flow (count per day)</h4>
              {loading ? (
                <div css={styles.loadingWrap}>
                  <LoadingSpinner size="small" />
                </div>
              ) : chartData.length > 0 ? (
                <SingleLineChart
                  data={chartData}
                  height={220}
                  xAxisLabelFormatter={formatDateLabel}
                  xAxisInterval="preserveStartEnd"
                  margin={{ top: 5, right: 0, left: 0, bottom: 20 }}
                />
              ) : (
                <p css={styles.secondaryText}>Enter a wallet and click Apply to see the flow.</p>
              )}
            </div>
          )}
        </div>
      </BaseModal>
    </div>
  );
}

const styles = {
  widgetWrap: css`
    display: contents;
  `,
  dataCard: css`
    display: flex;
    flex-direction: column;
    min-height: 120px;
    overflow: hidden;
  `,
  clickableCard: css`
    cursor: pointer;
    transition: box-shadow 0.2s ease, border-color 0.2s ease;
    &:hover {
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
    }
  `,
  chartCardInner: css`
    ${flex.column}
    ${spacing.gap.s}
    ${spacing.padding.m}
  `,
  chartCardTitle: css`
    ${typography.fontFamily.primary}
    ${typography.fontSize.base}
    ${typography.fontWeight.semibold}
    ${coloring.text.primary}
    margin: 0;
  `,
  hint: css`
    ${typography.fontSize.xs}
    ${coloring.text.variants.secondary.op75}
    margin: 0;
  `,
  loadingWrap: css`
    ${flex.row}
    ${flex.align.center}
    ${flex.justify.center}
    min-height: 120px;
  `,
  errorText: css`
    ${typography.fontSize.sm}
    color: #c00;
    margin: 0;
  `,
  secondaryText: css`
    ${typography.fontSize.sm}
    ${coloring.text.variants.secondary.op75}
    margin: 0;
  `,
  modalContent: css`
    ${flex.column}
    ${spacing.gap.m}
  `,
  field: css`
    ${flex.column}
    ${spacing.gap.xs}
  `,
  label: css`
    ${typography.fontSize.sm}
    ${typography.fontWeight.medium}
    ${coloring.text.primary}
  `,
  flowChartWrap: css`
    ${flex.column}
    ${spacing.gap.s}
    ${spacing.margin.top.s}
  `,
  flowTitle: css`
    ${typography.fontSize.sm}
    ${typography.fontWeight.semibold}
    ${coloring.text.primary}
    margin: 0;
  `,
};
