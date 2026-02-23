import {
  LayoutDashboard,
  Link2,
  Settings,
  Zap,
  Users,
  Bot,
  FileText,
  FolderArchive,
  CreditCard,
  ShieldCheck,
} from "lucide-react";
import type { NavGroup, SidebarData } from "@/components/dashboard/layout/types";

/** Widget id (from settings) -> sidebar link. Used to show only selected widgets in FEATURES. */
export const FEATURES_BY_WIDGET: { widgetId: string; title: string; url: string; icon: typeof Users }[] = [
  { widgetId: "payments", title: "Payment Solution", url: "/dashboard/payments", icon: CreditCard },
  { widgetId: "doc-hub", title: "Templates", url: "/dashboard/documents", icon: FileText },
  { widgetId: "ai-assistant", title: "Custom AI Assistant", url: "/dashboard/ai-assistant", icon: Bot },
  { widgetId: "employee-mgmt", title: "Employee Management", url: "/dashboard/employee-management", icon: Users },
  { widgetId: "compliance", title: "Compliance checker", url: "/dashboard/compliance-checker", icon: ShieldCheck },
  { widgetId: "document-vault", title: "Document vault", url: "/dashboard/document-vault", icon: FolderArchive },
];

export const DASHBOARD_GROUP: NavGroup = {
  title: "Dashboard",
  items: [
    { title: "Overview", url: "/dashboard", icon: LayoutDashboard },
    { title: "Payment Links", url: "/dashboard", icon: Link2 },
    { title: "Settings", url: "/dashboard/settings", icon: Settings },
  ],
};

/** Build FEATURES nav group showing only links for selected widget ids. If none selected, show all. */
export function getFeaturesNavGroup(selectedWidgets: string[]): NavGroup {
  const set = new Set(selectedWidgets);
  const items =
    set.size === 0
      ? FEATURES_BY_WIDGET.map(({ title, url, icon }) => ({ title, url, icon }))
      : FEATURES_BY_WIDGET.filter((f) => set.has(f.widgetId)).map(({ title, url, icon }) => ({ title, url, icon }));
  return { title: "FEATURES", items };
}

export const sidebarData: SidebarData = {
  user: {
    name: "Wallet",
    email: "Connect to view",
    avatar: "",
  },
  teams: [
    {
      name: "Stellar Payments",
      logo: Zap,
      plan: "Payment links",
    },
  ],
  navGroups: [
    DASHBOARD_GROUP,
    getFeaturesNavGroup([]), // default: show all when no preference
  ],
};
