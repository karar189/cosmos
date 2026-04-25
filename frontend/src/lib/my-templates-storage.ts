/**
 * Saved templates (dashboard bundles) from Compliance Maker.
 * Stored in localStorage; replace with API when backend is ready.
 */
const MY_TEMPLATES_KEY = "hypertron_my_templates";

export type WidgetType = "chart" | "metric" | "table" | "alert";

export type WidgetSettings = {
  dataSource: "mock" | "coingecko" | "stellar" | "custom-api";
  refresh: "realtime" | "1m" | "5m" | "15m" | "1h";
  deployment: "local" | "staging" | "prod";
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

export function defaultWidgetSettings(): WidgetSettings {
  return {
    dataSource: "mock",
    refresh: "5m",
    deployment: "local",
    parameters: "",
  };
}

/** Legacy shape for templates that only stored minimal widget info */
export type SavedTemplateWidget = {
  id: string;
  title: string;
  type: string;
  category?: string;
};

export type SavedTemplate = {
  id: string;
  name: string;
  businessName?: string;
  savedAt: string;
  bundleId: string;
  bundleName: string;
  description?: string;
  /** Full workspace layout; when present, workspace loads these. */
  widgets?: DashboardWidget[];
};

export function loadSavedTemplates(): SavedTemplate[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(MY_TEMPLATES_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as unknown;
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export function getTemplateById(id: string): SavedTemplate | null {
  return loadSavedTemplates().find((t) => t.id === id) ?? null;
}

export function saveTemplate(
  template: Omit<SavedTemplate, "id" | "savedAt"> & { widgets?: DashboardWidget[] }
): SavedTemplate {
  const list = loadSavedTemplates();
  const newOne: SavedTemplate = {
    ...template,
    id: `tpl-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`,
    savedAt: new Date().toISOString(),
  };
  list.unshift(newOne);
  window.localStorage.setItem(MY_TEMPLATES_KEY, JSON.stringify(list));
  return newOne;
}

export function updateTemplate(
  id: string,
  updates: Partial<Pick<SavedTemplate, "name" | "description" | "widgets">>
): SavedTemplate | null {
  const list = loadSavedTemplates();
  const idx = list.findIndex((t) => t.id === id);
  if (idx === -1) return null;
  list[idx] = { ...list[idx], ...updates, savedAt: new Date().toISOString() };
  window.localStorage.setItem(MY_TEMPLATES_KEY, JSON.stringify(list));
  return list[idx];
}

/** Build DashboardWidget[] from a Compliance Maker bundle (e.g. when saving from Onboarding). */
export function widgetsFromBundle(bundle: {
  widgets?: Array< { id: string; title: string; type: string }>;
}): DashboardWidget[] {
  const list = bundle?.widgets ?? [];
  const settings = defaultWidgetSettings();
  return list.map((w, i) => {
    const col = (i % 4) * 3;
    const row = Math.floor(i / 4) * 5;
    return {
      id: `dw-${Date.now()}-${i}`,
      widgetId: String(w.id || `widget-${i}`),
      title: String(w.title || w.id || `Widget ${i + 1}`),
      type: (w.type as WidgetType) || "chart",
      x: col,
      y: row,
      w: 3,
      h: 5,
      settings,
    };
  });
}
