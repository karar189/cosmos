/** @jsxImportSource @emotion/react */
'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Card, Core3Button as Button, Icon, Badge } from '@core3/ui-components';
import { loadDashboards, type SavedDashboard } from '@/utils/dashboardWorkspace.storage';
import * as styles from './page.styles';

export default function MyDashboardsPage() {
  const router = useRouter();
  const [dashboards, setDashboards] = useState<SavedDashboard[]>([]);

  const refresh = () => setDashboards(loadDashboards());

  useEffect(() => {
    refresh();
    const onStorage = () => refresh();
    const onCustom = () => refresh();
    window.addEventListener('storage', onStorage);
    window.addEventListener('cosmops_my_dashboards_updated', onCustom);
    return () => {
      window.removeEventListener('storage', onStorage);
      window.removeEventListener('cosmops_my_dashboards_updated', onCustom);
    };
  }, []);

  const openDashboard = (d: SavedDashboard) => {
    router.push(`/workspace/my-dashboards/${encodeURIComponent(d.id)}#overview`);
  };

  const editDashboard = (d: SavedDashboard, e: React.MouseEvent) => {
    e.stopPropagation();
    router.push(`/dashboard-workspace?dashboardId=${encodeURIComponent(d.id)}`);
  };

  return (
    <div css={styles.pageContainer}>
      <header css={styles.pageHeader}>
        <div css={styles.titleBlock}>
          <h1 css={styles.pageTitle}>Dashboards</h1>
          <p css={styles.pageSubtitle}>
            All dashboards saved from Dashboard Workspace. Click a row to open that dashboard.
          </p>
        </div>
        <Badge color="gray">{dashboards.length} saved</Badge>
      </header>

      <div css={styles.tableCard}>
        <div css={styles.tableHeader}>
          <h2 css={styles.tableTitle}>All dashboards</h2>
        </div>
        <div css={styles.tableWrapper}>
          {dashboards.length === 0 ? (
            <div css={styles.emptyTable}>
              <Icon name="data-stack" css={styles.emptyTableIcon} />
              <p css={styles.emptyTableText}>
                No dashboards yet. Build one in Compliance Maker or Dashboard Workspace and save it here.
              </p>
            </div>
          ) : (
            <table css={styles.table}>
              <thead>
                <tr>
                  <th css={styles.th}>Name</th>
                  <th css={styles.th}>Widgets</th>
                  <th css={styles.th}>Updated</th>
                  <th css={styles.th} style={{ width: 140 }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {dashboards.map((d) => (
                  <tr
                    key={d.id}
                    css={styles.tableRow}
                    onClick={() => openDashboard(d)}
                  >
                    <td css={[styles.td, styles.dashboardNameCell]}>{d.name}</td>
                    <td css={[styles.td, styles.metaCell]}>{d.widgets?.length ?? 0}</td>
                    <td css={[styles.td, styles.metaCell]}>
                      {d.updatedAt ? new Date(d.updatedAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' }) : '—'}
                    </td>
                    <td css={[styles.td, styles.actionsCell]} onClick={(e) => e.stopPropagation()}>
                      <Button
                        variant="primary"
                        size="small"
                        onClick={() => openDashboard(d)}
                      >
                        Open
                      </Button>
                      <Button
                        variant="secondary"
                        size="small"
                        onClick={(e) => editDashboard(d, e)}
                      >
                        <Icon name="tools" />
                        Edit
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
}
