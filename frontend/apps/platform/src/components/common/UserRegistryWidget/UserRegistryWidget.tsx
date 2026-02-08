/** @jsxImportSource @emotion/react */
'use client';

import { useMemo, useState, useCallback } from 'react';
import {
  Card,
  Core3Button as Button,
  DataTable,
  BaseModal,
  NumberCell,
  type ColumnConfig,
  type SortingState,
} from '@core3/ui-components';
import { formatAmount, formatPercentage } from '@/utils/format';
import ScoreCard from '@/components/common/Sidebar/ScoreCard/ScoreCard';
import type { ScoreData } from '@/components/common/Sidebar/ScoreCard/scoreCard.utils';
import {
  parseUserRegistryParameters,
  buildMockRows,
  buildMockReliabilityScore,
} from './UserRegistryWidget.utils';
import type { UserRegistryRow } from './UserRegistryWidget.types';
import * as styles from './UserRegistryWidget.styles';

export interface UserRegistryWidgetProps {
  /** JSON string: { network, wallets: [{ address }] } */
  parameters?: string | null;
}

export function UserRegistryWidget({ parameters }: UserRegistryWidgetProps) {
  const config = useMemo(() => parseUserRegistryParameters(parameters ?? null), [parameters]);
  const rows = useMemo(() => buildMockRows(config), [config]);

  const [reliabilityOpen, setReliabilityOpen] = useState(false);
  const [reliabilityWallet, setReliabilityWallet] = useState<UserRegistryRow | null>(null);
  const [sorting, setSorting] = useState<SortingState<UserRegistryRow>>([]);
  const [flaggedAddresses, setFlaggedAddresses] = useState<Set<string>>(new Set());
  const [flaggedPopupOpen, setFlaggedPopupOpen] = useState(false);

  const openReliability = useCallback((row: UserRegistryRow) => {
    setReliabilityWallet(row);
    setReliabilityOpen(true);
  }, []);

  const handleReport = useCallback(() => {
    if (reliabilityWallet) {
      setFlaggedAddresses((prev) => new Set(prev).add(reliabilityWallet.address));
      setReliabilityOpen(false);
      setFlaggedPopupOpen(true);
    }
  }, [reliabilityWallet]);

  const reliabilityScoreData: ScoreData | null = reliabilityWallet
    ? (buildMockReliabilityScore(reliabilityWallet.address) as ScoreData)
    : null;

  const columnsConfig: ColumnConfig<UserRegistryRow>[] = useMemo(
    () => [
      {
        key: 'rank',
        name: '#',
        type: 'id',
        enableSorting: false,
        width: 48,
      },
      {
        key: 'address',
        name: 'User wallets',
        type: 'custom',
        width: 140,
        render: (_value, row) => (
          <div css={[styles.walletCell, flaggedAddresses.has(row.address) && styles.walletCellFlagged]}>
            <span css={styles.walletAddress}>{row.shortAddress}</span>
          </div>
        ),
        sortingFn: (a, b) => a.address.localeCompare(b.address),
      },
      {
        key: 'transactionVolume',
        name: 'Transaction volume',
        type: 'custom',
        width: 160,
        render: (_value, row) => (
          <NumberCell
            primary={formatAmount(row.transactionVolume, { prefix: '$', decimalPlaces: 0 })}
            align="left"
            loading={false}
          />
        ),
        sortingFn: (a, b) => a.transactionVolume - b.transactionVolume,
      },
      {
        key: 'transactionVolumeChange24h',
        name: 'Volume change (24h)',
        type: 'custom',
        width: 160,
        render: (_value, row) => (
          <NumberCell
            primary={formatPercentage(row.transactionVolumeChange24h)}
            align="left"
            loading={false}
          />
        ),
        sortingFn: (a, b) => a.transactionVolumeChange24h - b.transactionVolumeChange24h,
      },
      {
        key: 'assetCount',
        name: 'Most assets',
        type: 'custom',
        width: 120,
        render: (_value, row) => (
          <NumberCell primary={String(row.assetCount)} align="left" loading={false} />
        ),
        sortingFn: (a, b) => a.assetCount - b.assetCount,
      },
      {
        key: 'reliability',
        name: '',
        type: 'custom',
        enableSorting: false,
        width: 160,
        render: (_value, row) => (
          <Button
            variant="secondary"
            size="small"
            css={styles.reliabilityButton}
            onClick={() => openReliability(row)}
          >
            Check reliability
          </Button>
        ),
      },
    ],
    [openReliability, flaggedAddresses]
  );

  return (
    <>
      <Card>
        <div css={styles.tableContainer}>
          {rows.length === 0 ? (
            <div css={styles.emptyState}>
              <p>No wallets configured.</p>
              <p>Add wallets JSON in the Dashboard Workspace (network + wallets with address).</p>
            </div>
          ) : (
            <DataTable
              data={rows}
              columnsConfig={columnsConfig}
              sorting={sorting}
              onSortingChange={setSorting}
              loading={false}
            />
          )}
        </div>
      </Card>

      <BaseModal
        open={reliabilityOpen}
        onClose={() => setReliabilityOpen(false)}
        title="Wallet Reliability"
      >
        <div css={styles.modalContent}>
          {reliabilityWallet && reliabilityScoreData && (
            <>
              <p css={styles.walletShort}>
                Wallet: {reliabilityWallet.shortAddress}
              </p>
              <ScoreCard data={reliabilityScoreData} />
              <Button variant="primary" size="small" onClick={handleReport}>
                Report
              </Button>
            </>
          )}
        </div>
      </BaseModal>

      <BaseModal
        open={flaggedPopupOpen}
        onClose={() => setFlaggedPopupOpen(false)}
        title="Wallet flagged"
      >
        <div css={styles.flaggedPopupContent}>
          <p>This wallet has been flagged.</p>
          <Button variant="primary" size="small" onClick={() => setFlaggedPopupOpen(false)}>
            OK
          </Button>
        </div>
      </BaseModal>
    </>
  );
}
