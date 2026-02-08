export type WidgetType = 'chart' | 'metric' | 'table' | 'alert';

export type WidgetSettings = {
  dataSource: 'mock' | 'coingecko' | 'stellar' | 'custom-api';
  refresh: 'realtime' | '1m' | '5m' | '15m' | '1h';
  deployment: 'local' | 'staging' | 'prod';
  parameters: string;
};

export type DashboardWidget = {
  id: string;
  widgetId: string;
  title: string;
  type: WidgetType;
  x: number;
  y: number;
  w: number;
  h: number;
  settings: WidgetSettings;
};

export type SavedDashboard = {
  id: string;
  name: string;
  createdAt: string;
  updatedAt: string;
  widgets: DashboardWidget[];
};

export const DASHBOARD_WORKSPACE_DRAFT_KEY = 'cosmops_dashboard_workspace_draft';
export const MY_DASHBOARDS_KEY = 'cosmops_my_dashboards';
export const AGENTIC_RESPONSE_KEY = 'cosmops_agentic_response';

export type AgenticBundle = {
  id: string;
  name: string;
  description: string;
  widgets: Array<{
    id: string;
    title: string;
    type: WidgetType;
    [key: string]: unknown;
  }>;
  [key: string]: unknown;
};

export type SavedAgenticResponse = {
  bundles: AgenticBundle[];
  businessName?: string;
  savedAt: string;
};

function safeJsonParse<T>(raw: string | null): T | null {
  if (!raw) return null;
  try {
    return JSON.parse(raw) as T;
  } catch {
    return null;
  }
}

export function loadDashboards(): SavedDashboard[] {
  if (typeof window === 'undefined') return [];
  const parsed = safeJsonParse<SavedDashboard[]>(window.localStorage.getItem(MY_DASHBOARDS_KEY));
  return Array.isArray(parsed) ? parsed : [];
}

export function saveDashboards(list: SavedDashboard[]) {
  if (typeof window === 'undefined') return;
  window.localStorage.setItem(MY_DASHBOARDS_KEY, JSON.stringify(list));
  // storage event doesn't fire in the same tab reliably; use a custom event
  window.dispatchEvent(new Event('cosmops_my_dashboards_updated'));
}

export function defaultWidgetSettings(): WidgetSettings {
  return {
    dataSource: 'mock',
    refresh: '5m',
    deployment: 'local',
    parameters: '',
  };
}

export function makeDraftFromBundle(bundle: any): SavedDashboard {
  const now = new Date().toISOString();
  const widgets = (bundle?.widgets || []).map((w: any, i: number) => {
    const col = (i % 4) * 3;
    const row = Math.floor(i / 4) * 5;
    return {
      id: `dw-${Date.now()}-${i}`,
      widgetId: String(w.id || `widget-${i}`),
      title: String(w.title || w.id || `Widget ${i + 1}`),
      type: (w.type as WidgetType) || 'chart',
      x: col,
      y: row,
      w: 3,
      h: 5,
      settings: defaultWidgetSettings(),
    } satisfies DashboardWidget;
  });

  return {
    id: `draft-${Date.now()}`,
    name: 'Untitled dashboard',
    createdAt: now,
    updatedAt: now,
    widgets,
  };
}

export function writeDraft(draft: SavedDashboard) {
  if (typeof window === 'undefined') return;
  window.localStorage.setItem(DASHBOARD_WORKSPACE_DRAFT_KEY, JSON.stringify(draft));
}

export function readDraft(): SavedDashboard | null {
  if (typeof window === 'undefined') return null;
  return safeJsonParse<SavedDashboard>(window.localStorage.getItem(DASHBOARD_WORKSPACE_DRAFT_KEY));
}

export function clearDraft() {
  if (typeof window === 'undefined') return;
  window.localStorage.removeItem(DASHBOARD_WORKSPACE_DRAFT_KEY);
}

export function saveAgenticResponse(data: SavedAgenticResponse) {
  if (typeof window === 'undefined') return;
  window.localStorage.setItem(AGENTIC_RESPONSE_KEY, JSON.stringify({ ...data, savedAt: new Date().toISOString() }));
}

export function readAgenticResponse(): SavedAgenticResponse | null {
  if (typeof window === 'undefined') return null;
  return safeJsonParse<SavedAgenticResponse>(window.localStorage.getItem(AGENTIC_RESPONSE_KEY));
}

export function clearAgenticResponse() {
  if (typeof window === 'undefined') return;
  window.localStorage.removeItem(AGENTIC_RESPONSE_KEY);
}

