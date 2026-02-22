import {
  LayoutDashboard,
  Link2,
  Wallet,
  Settings,
  Zap,
  Users,
  Bot,
  FileText,
  CreditCard,
} from "lucide-react";
import type { SidebarData } from "@/components/dashboard/layout/types";

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
    {
      title: "Dashboard",
      items: [
        {
          title: "Overview",
          url: "/dashboard",
          icon: LayoutDashboard,
        },
        {
          title: "Payment Links",
          url: "/dashboard",
          icon: Link2,
        },
        {
          title: "Receive Address",
          url: "/dashboard",
          icon: Wallet,
        },
        {
          title: "Settings",
          url: "/dashboard/settings",
          icon: Settings,
        },
      ],
    },
    {
      title: "FEATURES",
      items: [
        {
          title: "Employee Management",
          url: "/dashboard/employee-management",
          icon: Users,
        },
        {
          title: "Custom AI Assistant",
          url: "/dashboard/ai-assistant",
          icon: Bot,
        },
        {
          title: "Templates + Document Vault",
          url: "/dashboard/documents",
          icon: FileText,
        },
        {
          title: "Payment Solution",
          url: "/dashboard/payments",
          icon: CreditCard,
        },
      ],
    },
  ],
};
