/** @jsxImportSource @emotion/react */
'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Card, Core3Button as Button, Icon, Badge } from '@core3/ui-components';
import { loadDashboards, type SavedDashboard } from '@/utils/dashboardWorkspace.storage';

export default function MyDashboardsPage() {
  const router = useRouter();
  const [dashboards, setDashboards] = useState<SavedDashboard[]>([]);

  useEffect(() => {
    setDashboards(loadDashboards());
  }, []);

  return (
    <div style={{ maxWidth: 1400, margin: '0 auto', padding: '24px 24px' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 16, marginBottom: 16 }}>
        <div>
          <h1 style={{ margin: 0, fontSize: 28 }}>My Dashboards</h1>
          <p style={{ margin: '6px 0 0 0', opacity: 0.7 }}>
            Dashboards saved from Dashboard Workspace (stored in localStorage for hackathon).
          </p>
        </div>
        <Badge color="gray">{dashboards.length} total</Badge>
      </div>

      {dashboards.length === 0 ? (
        <Card>
          <div style={{ padding: 12, opacity: 0.75 }}>
            No dashboards yet. Build one from Agentic Builder and save it in Dashboard Workspace.
          </div>
        </Card>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: 16 }}>
          {dashboards.map((d) => (
            <Card key={d.id} title={d.name}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                  <Badge color="gray">{d.widgets?.length || 0} widgets</Badge>
                  <Badge color="gray">Updated {new Date(d.updatedAt).toLocaleString()}</Badge>
                </div>
                <Button
                  variant="primary"
                  size="small"
                  onClick={() => router.push(`/dashboard-workspace?dashboardId=${encodeURIComponent(d.id)}`)}
                >
                  <Icon name="data-stack" />
                  Open in Workspace
                </Button>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}

