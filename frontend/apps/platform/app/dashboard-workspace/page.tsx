/** @jsxImportSource @emotion/react */
'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Rnd } from 'react-rnd';
import WorkspaceLayout from '@/components/layouts/WorkspaceLayout/WorkspaceLayout';
import { Card, Core3Button as Button, Input, Icon, Badge, Select } from '@core3/ui-components';
import {
  type DashboardWidget,
  type SavedDashboard,
  type WidgetSettings,
  type WidgetType,
  clearAgenticResponse,
  clearDraft,
  defaultWidgetSettings,
  loadDashboards,
  makeDraftFromBundle,
  readAgenticResponse,
  readDraft,
  saveDashboards,
} from '@/utils/dashboardWorkspace.storage';
import * as styles from './page.styles';

function clamp(n: number, min: number, max: number) {
  return Math.max(min, Math.min(max, n));
}

const DRAG_HANDLE_CLASS = 'dashboard-widget-drag-handle';

export default function DashboardWorkspacePage() {
  const router = useRouter();
  const search = useSearchParams();
  const dashboardId = search.get('dashboardId');
  const importParam = search.get('import');

  const [dashboardName, setDashboardName] = useState<string>('Untitled dashboard');
  const [widgets, setWidgets] = useState<DashboardWidget[]>([]);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [status, setStatus] = useState<string>('');
  const [addWidgetId, setAddWidgetId] = useState<string>('compliance-score');
  const stageRef = useRef<HTMLDivElement | null>(null);
  const [stageWidth, setStageWidth] = useState<number>(1200);

  const selected = useMemo(
    () => widgets.find((w) => w.id === selectedId) || null,
    [widgets, selectedId]
  );

  // User Registry is always available regardless of AI-generated bundles
  const widgetCatalog: Array<{ id: string; title: string; type: WidgetType }> = [
    { id: 'user-registry', title: 'User Registry', type: 'table' },
    { id: 'compliance-score', title: 'Compliance Score Trend', type: 'chart' },
    { id: 'routing-analytics', title: 'Routing Analytics', type: 'chart' },
    { id: 'transaction-volume', title: 'Transaction Volume', type: 'chart' },
    { id: 'transaction-analytics', title: 'Transaction Analytics', type: 'chart' },
    { id: 'risk-heatmap', title: 'Risk Heatmap', type: 'chart' },
    { id: 'active-routes', title: 'Active Routes', type: 'metric' },
    { id: 'compliance-blocks', title: 'Active Compliance Blocks', type: 'metric' },
    { id: 'alerts-panel', title: 'Recent Alerts', type: 'alert' },
    { id: 'asset-distribution', title: 'Asset Distribution', type: 'chart' },
  ];

  const addWidget = (widgetId: string) => {
    const def = widgetCatalog.find((w) => w.id === widgetId);
    if (!def) return;

    const maxBottom = widgets.reduce((acc, w) => Math.max(acc, w.y + w.h), 0);
    const defaultParams =
      widgetId === 'user-registry'
        ? JSON.stringify(
            {
              network: 'stellar',
              wallets: [
                { address: 'GDBTQ7V63WLGFKUQMWNKJLOFGXVT7XXWBNCF2UULAWJ54Y4X6GVDSWAP' },
                { address: 'GBRPYHIL2CI3DJ5T3D4VOUKB5E4YGJ2E2LZ6J5DA7MK34F5X2WTFW6AS' },
              ],
            },
            null,
            2
          )
        : defaultWidgetSettings().parameters;

    const next: DashboardWidget = {
      id: `dw-${Date.now()}`,
      widgetId: def.id,
      title: def.title,
      type: def.type,
      x: 0,
      y: maxBottom + 1,
      w: 3,
      h: 5,
      settings: {
        ...defaultWidgetSettings(),
        parameters: defaultParams,
      },
    };

    setWidgets((prev) => [...prev, next]);
    setSelectedId(next.id);
  };

  useEffect(() => {
    if (typeof window === 'undefined') return;

    // Load existing saved dashboard by id, else load draft from import, else saved agentic response, else empty.
    const saved = loadDashboards();
    if (dashboardId) {
      const found = saved.find((d) => d.id === dashboardId);
      if (found) {
        setDashboardName(found.name);
        setWidgets(found.widgets || []);
        setSelectedId(found.widgets?.[0]?.id || null);
        if (importParam) router.replace('/dashboard-workspace');
        return;
      }
    }

    const draft = readDraft();
    if (draft) {
      setDashboardName(draft.name || 'Untitled dashboard');
      setWidgets(draft.widgets || []);
      setSelectedId(draft.widgets?.[0]?.id || null);
      clearDraft();
      if (importParam) router.replace('/dashboard-workspace');
      return;
    }

    const agentic = readAgenticResponse();
    if (agentic?.bundles?.length) {
      const bundle = agentic.bundles[0];
      const fromBundle = makeDraftFromBundle(bundle);
      const name = agentic.businessName ? `${agentic.businessName} · ${bundle.name}` : (fromBundle.name || 'Untitled dashboard');
      setDashboardName(name);
      setWidgets(fromBundle.widgets || []);
      setSelectedId(fromBundle.widgets?.[0]?.id || null);
      clearAgenticResponse();
      if (importParam) router.replace('/dashboard-workspace');
      return;
    }

    setDashboardName('Untitled dashboard');
    setWidgets([]);
    setSelectedId(null);
  }, [dashboardId]);

  const rowHeight = 32;
  const colWidth = Math.max(48, Math.floor(stageWidth / 12));

  useEffect(() => {
    const el = stageRef.current;
    if (!el || typeof ResizeObserver === 'undefined') return;

    const ro = new ResizeObserver(() => {
      // clientWidth excludes scrollbar; matches the usable stage width
      setStageWidth(el.clientWidth || 1200);
    });
    ro.observe(el);
    // set initial
    setStageWidth(el.clientWidth || 1200);
    return () => ro.disconnect();
  }, []);

  const updateWidget = (id: string, patch: Partial<DashboardWidget>) => {
    setWidgets((prev) => prev.map((w) => (w.id === id ? { ...w, ...patch } : w)));
  };

  const updateSelectedSettings = (patch: Partial<WidgetSettings>) => {
    if (!selected) return;
    updateWidget(selected.id, { settings: { ...selected.settings, ...patch } });
  };

  const removeWidget = (id: string) => {
    setWidgets((prev) => prev.filter((w) => w.id !== id));
    setSelectedId((prev) => (prev === id ? null : prev));
  };

  const saveDashboard = () => {
    const name = dashboardName.trim() || 'Untitled dashboard';
    const now = new Date().toISOString();
    const list = loadDashboards();

    const existingIdx = dashboardId ? list.findIndex((d) => d.id === dashboardId) : -1;
    const id = dashboardId || `dash-${Date.now()}`;
    const createdAt = existingIdx >= 0 ? list[existingIdx].createdAt : now;

    const next: SavedDashboard = {
      id,
      name,
      createdAt,
      updatedAt: now,
      widgets,
    };

    if (existingIdx >= 0) list[existingIdx] = next;
    else list.unshift(next);

    saveDashboards(list);
    setStatus('Saved to My Dashboards');

    // Keep editor URL stable with dashboardId so reloading opens the saved dashboard
    if (!dashboardId) {
      router.replace(`/dashboard-workspace?dashboardId=${encodeURIComponent(id)}`);
    }
    setTimeout(() => setStatus(''), 2200);
  };

  return (
    <WorkspaceLayout>
      <div css={styles.pageContainer}>
        <div css={styles.headerRow}>
          <div css={styles.titleBlock}>
            <h1 css={styles.pageTitle}>Dashboard Workspace</h1>
            <p css={styles.pageSubtitle}>
              Customize widget size, location, parameters, data sources, and deployment. Save to “My Dashboards”.
            </p>
          </div>

          <div css={styles.headerActions}>
            <Badge color="gray">{widgets.length} widgets</Badge>
            {status && <Badge color="green">{status}</Badge>}
            <Button variant="primary" size="small" onClick={saveDashboard}>
              <Icon name="data-transfer" />
              Save
            </Button>
          </div>
        </div>

        <div css={styles.editorLayout}>
          {/* Canvas (big whiteboard) */}
          <Card css={styles.canvasCard} title="Canvas">
            <div css={styles.canvasScroll}>
              <div ref={stageRef} css={styles.canvasStage}>
                {widgets.map((w) => {
                  const isSelected = selectedId === w.id;
                  const pxX = w.x * colWidth;
                  const pxY = w.y * rowHeight;
                  const pxW = Math.max(colWidth, w.w * colWidth);
                  const pxH = Math.max(rowHeight * 3, w.h * rowHeight);

                  return (
                    <Rnd
                      key={w.id}
                      bounds="parent"
                      dragGrid={[colWidth, rowHeight]}
                      resizeGrid={[colWidth, rowHeight]}
                      minWidth={colWidth}
                      minHeight={rowHeight * 3}
                      // Dragging is restricted to the header so resizing doesn't accidentally drag.
                      dragHandleClassName={DRAG_HANDLE_CLASS}
                      enableResizing={{
                        top: true,
                        right: true,
                        bottom: true,
                        left: true,
                        topRight: true,
                        bottomLeft: true,
                        bottomRight: true,
                        topLeft: true,
                      }}
                      resizeHandleComponent={{
                        top: <div css={styles.resizeHandleTop} />,
                        right: <div css={styles.resizeHandleRight} />,
                        bottom: <div css={styles.resizeHandleBottom} />,
                        left: <div css={styles.resizeHandleLeft} />,
                        topLeft: <div css={styles.resizeHandleCornerTL} />,
                        topRight: <div css={styles.resizeHandleCornerTR} />,
                        bottomLeft: <div css={styles.resizeHandleCornerBL} />,
                        bottomRight: <div css={styles.resizeHandleCornerBR} />,
                      }}
                      size={{ width: pxW, height: pxH }}
                      position={{ x: pxX, y: pxY }}
                      onDragStart={() => setSelectedId(w.id)}
                      onDragStop={(_, d) => {
                        const nextX = clamp(Math.round(d.x / colWidth), 0, 12 - w.w);
                        const nextY = Math.max(0, Math.round(d.y / rowHeight));
                        updateWidget(w.id, { x: nextX, y: nextY });
                      }}
                      onResizeStart={() => setSelectedId(w.id)}
                      onResizeStop={(_, __, ref, ___, position) => {
                        const newW = clamp(Math.round(ref.offsetWidth / colWidth), 1, 12);
                        const newH = clamp(Math.round(ref.offsetHeight / rowHeight), 2, 200);
                        const newX = clamp(Math.round(position.x / colWidth), 0, 12 - newW);
                        const newY = Math.max(0, Math.round(position.y / rowHeight));
                        updateWidget(w.id, { x: newX, y: newY, w: newW, h: newH });
                      }}
                    >
                      <div
                        css={[styles.widgetBox, isSelected && styles.widgetBoxSelected]}
                        onMouseDown={() => setSelectedId(w.id)}
                      >
                        <div css={styles.widgetHeader} className={DRAG_HANDLE_CLASS}>
                          <p css={styles.widgetTitle}>{w.title}</p>
                          <div>
                            <Badge color="gray">{w.type}</Badge>
                          </div>
                        </div>
                        <div css={styles.widgetBody}>
                          <p css={styles.widgetPlaceholder}>
                            Drag the header to move. Drag any edge/corner to resize (up/down changes length).
                          </p>
                        </div>
                      </div>
                    </Rnd>
                  );
                })}
              </div>
            </div>
          </Card>

          {/* Single side panel: widgets + inspector */}
          <Card css={styles.panelCard} title="Dashboard Panel">
            <div css={styles.panelInner}>
              <div css={styles.field}>
                <p css={styles.label}>Dashboard name</p>
                <Input value={dashboardName} onChange={(e) => setDashboardName(e.target.value)} />
              </div>

              <div css={styles.field}>
                <p css={styles.label}>Add widget</p>
                <div css={styles.controlRow}>
                  <Select
                    value={addWidgetId}
                    onChange={(v) => setAddWidgetId(String(v))}
                    options={widgetCatalog.map((w) => ({ value: w.id, label: w.title }))}
                  />
                  <Button variant="primary" size="small" onClick={() => addWidget(addWidgetId)}>
                    <Icon name="plus-circle" />
                    Add
                  </Button>
                </div>
                <p css={styles.smallNote}>
                  Tip: Drag widgets on the canvas. Click a widget to show resize handles and settings here.
                </p>
              </div>

              <div css={styles.widgetList}>
                {widgets.length === 0 ? (
                  <div>
                    <p css={styles.smallNote}>
                      No widgets yet. Add one above, or go to Compliance Maker and build widget combinations (Lean/Balanced/Comprehensive).
                    </p>
                    <Button variant="secondary" size="small" onClick={() => router.push('/workspace/compliance-maker')}>
                      <Icon name="tools" />
                      Open Compliance Maker
                    </Button>
                  </div>
                ) : (
                  widgets.map((w) => (
                    <div key={w.id} css={styles.widgetListItem}>
                      <div css={styles.widgetListItemLeft}>
                        <p css={styles.widgetListItemTitle}>{w.title}</p>
                        <p css={styles.widgetListItemMeta}>
                          {w.type} · x:{w.x} y:{w.y} · {w.w}×{w.h}
                        </p>
                      </div>
                      <div css={styles.controlRow}>
                        <Button variant="secondary" size="small" onClick={() => setSelectedId(w.id)}>
                          Select
                        </Button>
                        <Button
                          variant="secondary"
                          size="small"
                          css={styles.dangerButton}
                          onClick={() => removeWidget(w.id)}
                        >
                          Remove
                        </Button>
                      </div>
                    </div>
                  ))
                )}
              </div>

              <div css={styles.field}>
                <p css={styles.panelTitle}>Inspector</p>
                {!selected ? (
                  <p css={styles.smallNote}>Select a widget on the canvas to edit it.</p>
                ) : (
                  <>
                    <p css={styles.panelTitle}>{selected.title}</p>
                    <div css={styles.controlRow}>
                      <Badge color="gray">{selected.type}</Badge>
                      <Badge color="gray">
                        x:{selected.x} y:{selected.y} · {selected.w}×{selected.h}
                      </Badge>
                      <Badge color="gray">Resize: {selectedId === selected.id ? 'enabled' : 'disabled'}</Badge>
                    </div>

                  <div css={styles.field}>
                    <p css={styles.label}>Data source</p>
                    <Select
                      value={selected.settings.dataSource}
                      onChange={(v) => updateSelectedSettings({ dataSource: String(v) as WidgetSettings['dataSource'] })}
                      options={[
                        { value: 'mock', label: 'Mock data' },
                        { value: 'coingecko', label: 'CoinGecko' },
                        { value: 'stellar', label: 'Stellar' },
                        { value: 'custom-api', label: 'Custom API' },
                      ]}
                    />
                  </div>

                  <div css={styles.field}>
                    <p css={styles.label}>Refresh</p>
                    <Select
                      value={selected.settings.refresh}
                      onChange={(v) => updateSelectedSettings({ refresh: String(v) as WidgetSettings['refresh'] })}
                      options={[
                        { value: 'realtime', label: 'Real-time' },
                        { value: '1m', label: 'Every 1 min' },
                        { value: '5m', label: 'Every 5 min' },
                        { value: '15m', label: 'Every 15 min' },
                        { value: '1h', label: 'Every 1 hour' },
                      ]}
                    />
                  </div>

                  <div css={styles.field}>
                    <p css={styles.label}>Deployment</p>
                    <Select
                      value={selected.settings.deployment}
                      onChange={(v) => updateSelectedSettings({ deployment: String(v) as WidgetSettings['deployment'] })}
                      options={[
                        { value: 'local', label: 'Local' },
                        { value: 'staging', label: 'Staging' },
                        { value: 'prod', label: 'Production' },
                      ]}
                    />
                  </div>

                  {selected.widgetId === 'transaction-analytics' && (
                    <div css={styles.field}>
                      <p css={styles.label}>Stellar wallet address</p>
                      <Input
                        value={(() => {
                          try {
                            const p = JSON.parse(selected.settings.parameters || '{}');
                            return typeof p.stellarWallet === 'string' ? p.stellarWallet : '';
                          } catch {
                            return '';
                          }
                        })()}
                        onChange={(e) => {
                          const wallet = e.target.value.trim();
                          try {
                            const p = JSON.parse(selected.settings.parameters || '{}');
                            updateSelectedSettings({
                              parameters: JSON.stringify({ ...p, stellarWallet: wallet }, null, 0),
                            });
                          } catch {
                            updateSelectedSettings({
                              parameters: JSON.stringify({ stellarWallet: wallet }, null, 0),
                            });
                          }
                        }}
                        placeholder="e.g. G..."
                      />
                      <p css={styles.smallNote}>
                        Public key (G...) of the Stellar account. Used to fetch transactions in the dashboard.
                      </p>
                    </div>
                  )}
                  {selected.widgetId === 'user-registry' && (
                    <div css={styles.field}>
                      <p css={styles.label}>Wallets JSON</p>
                      <textarea
                        css={styles.textarea}
                        value={selected.settings.parameters}
                        onChange={(e) => updateSelectedSettings({ parameters: e.target.value })}
                        placeholder='{"network":"stellar","wallets":[{"address":"G..."}]}'
                        rows={8}
                      />
                      <p css={styles.smallNote}>
                        JSON with network and wallets array. Each wallet: {"{ \"address\": \"G...\" }"}. Used when the widget is created.
                      </p>
                    </div>
                  )}
                  <div css={styles.field}>
                    <p css={styles.label}>Parameters</p>
                    <textarea
                      css={styles.textarea}
                      value={selected.settings.parameters}
                      onChange={(e) => updateSelectedSettings({ parameters: e.target.value })}
                      placeholder='e.g. {"threshold": 0.9, "asset": "USDC"}'
                      rows={6}
                    />
                    <p css={styles.smallNote}>
                      Hackathon note: parameters are stored as free-form text (JSON recommended).
                    </p>
                  </div>
                  </>
                )}
              </div>
            </div>
          </Card>
        </div>
      </div>
    </WorkspaceLayout>
  );
}
