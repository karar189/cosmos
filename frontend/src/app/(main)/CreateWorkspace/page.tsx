"use client";

import {
  useEffect,
  useRef,
  useState,
  type ChangeEvent,
  type DragEvent,
  type ReactNode,
} from "react";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  ArrowRight,
  AlertTriangle,
  BarChart3,
  BriefcaseBusiness,
  Building2,
  Check,
  CheckCircle2,
  ChevronDown,
  ChevronRight,
  CreditCard,
  Eye,
  ExternalLink,
  FileText,
  Filter,
  Globe2,
  ImageUp,
  Landmark,
  LifeBuoy,
  MoreHorizontal,
  Network,
  Plus,
  Rocket,
  Search,
  Server,
  ShieldCheck,
  Sparkles,
  Trash2,
  Users,
  UserRound,
  Wallet,
  Workflow,
  X,
  type LucideIcon,
} from "lucide-react";
import { HypertronLogoMark } from "@/components/global/hypertron-logo-mark";
import { Button } from "@/components/ui/button";
import { cn } from "@/utils";

type WorkspaceType = {
  id: string;
  title: string;
  description: string;
  icon: LucideIcon;
  iconClassName: string;
  iconBackground: string;
};

type TeamSize = "1-5" | "5-20" | "20-50" | "50+";
type WalletProvider = "freighter" | "metamask" | "walletconnect" | "coinbase" | "phantom";
type TeamRole = "" | "owner" | "admin" | "manager" | "member" | "viewer";
type PermissionLevel = "full-access" | "operations-access" | "view-only";
type IntegrationCategory = "all" | "communication" | "productivity" | "ai" | "developer";

type TeamInvite = {
  id: string;
  email: string;
  nickname: string;
  role: TeamRole;
  permission: PermissionLevel;
};

type WorkspaceDraft = {
  currentStep: 1 | 2 | 3 | 4 | 5 | 6;
  workspaceType: string;
  businessName: string;
  website: string;
  teamSize: TeamSize;
  logoDataUrl: string;
  logoName: string;
  operationModules: string[];
  operationModulesTouched: boolean;
  walletProvider: WalletProvider;
  supportedChains: string[];
  inviteMembers: TeamInvite[];
  integrations: string[];
};

const WORKSPACE_DRAFT_KEY = "hypertron:create-workspace:draft";
const MAX_LOGO_SIZE_BYTES = 2 * 1024 * 1024;

const DEFAULT_DRAFT: WorkspaceDraft = {
  currentStep: 1,
  workspaceType: "web3-startup",
  businessName: "",
  website: "",
  teamSize: "1-5",
  logoDataUrl: "",
  logoName: "",
  operationModules: [],
  operationModulesTouched: false,
  walletProvider: "freighter",
  supportedChains: ["ethereum", "polygon", "arbitrum", "base", "solana"],
  inviteMembers: [
    { id: "invite-1", email: "", nickname: "", role: "", permission: "full-access" },
  ],
  integrations: [],
};

const STEPS = [
  "Workspace Type",
  "Workspace Details",
  "Operations Setup",
  "Treasury Setup",
  "Invite Team",
  "Integrations",
  "Compliance Preferences",
  "Review & Create",
];

const TEAM_SIZES: { value: TeamSize; label: string }[] = [
  { value: "1-5", label: "1 - 5" },
  { value: "5-20", label: "5 - 20" },
  { value: "20-50", label: "20 - 50" },
  { value: "50+", label: "50+" },
];

const WORKSPACE_TYPES: WorkspaceType[] = [
  {
    id: "web3-startup",
    title: "Web3 Startup / Protocol",
    description: "For early-stage and growth-stage web3 companies",
    icon: Rocket,
    iconClassName: "text-[#5b46ff]",
    iconBackground: "bg-[#f0edff]",
  },
  {
    id: "dao",
    title: "DAO",
    description: "For decentralized autonomous organizations",
    icon: Network,
    iconClassName: "text-[#ff8a18]",
    iconBackground: "bg-[#fff3e6]",
  },
  {
    id: "agency",
    title: "Agency",
    description: "For web3 marketing, development and service agencies",
    icon: BriefcaseBusiness,
    iconClassName: "text-[#18b678]",
    iconBackground: "bg-[#e5f8ef]",
  },
  {
    id: "foundation",
    title: "Foundation / Ecosystem",
    description: "For foundations and ecosystem organizations",
    icon: Landmark,
    iconClassName: "text-[#4c6fff]",
    iconBackground: "bg-[#edf0ff]",
  },
  {
    id: "infrastructure",
    title: "Infrastructure Provider",
    description: "For tools, platforms and infrastructure teams",
    icon: Server,
    iconClassName: "text-[#2783ff]",
    iconBackground: "bg-[#eaf3ff]",
  },
  {
    id: "service-company",
    title: "Service Company",
    description: "For web3 native service and consulting firms",
    icon: UserRound,
    iconClassName: "text-[#f33aa7]",
    iconBackground: "bg-[#fff0f8]",
  },
  {
    id: "enterprise",
    title: "Enterprise Team",
    description: "For large organizations exploring or building in web3",
    icon: Building2,
    iconClassName: "text-[#ff991f]",
    iconBackground: "bg-[#fff5e5]",
  },
  {
    id: "other",
    title: "Other",
    description: "Something else",
    icon: MoreHorizontal,
    iconClassName: "text-[#657091]",
    iconBackground: "bg-[#f1f3f9]",
  },
];

const OPERATION_MODULES: WorkspaceType[] = [
  {
    id: "treasury",
    title: "Treasury",
    description: "Manage multi-chain treasury and wallets",
    icon: Wallet,
    iconClassName: "text-[#5b46ff]",
    iconBackground: "bg-[#f0edff]",
  },
  {
    id: "payments",
    title: "Payments",
    description: "Send, receive and track payments",
    icon: CreditCard,
    iconClassName: "text-[#ff8a18]",
    iconBackground: "bg-[#fff3e6]",
  },
  {
    id: "contributor-management",
    title: "Contributor Management",
    description: "Onboard, manage and pay contributors",
    icon: Users,
    iconClassName: "text-[#3976ff]",
    iconBackground: "bg-[#eaf2ff]",
  },
  {
    id: "compliance-monitoring",
    title: "Compliance Monitoring",
    description: "Monitor and stay compliant",
    icon: ShieldCheck,
    iconClassName: "text-[#54c94d]",
    iconBackground: "bg-[#edfbed]",
  },
  {
    id: "regulations-feed",
    title: "Regulations Feed",
    description: "Real-time updates on regulatory changes",
    icon: FileText,
    iconClassName: "text-[#f05445]",
    iconBackground: "bg-[#fff0ed]",
  },
  {
    id: "risk-reports",
    title: "Risk Reports",
    description: "Identify and manage operational risks",
    icon: AlertTriangle,
    iconClassName: "text-[#7047f2]",
    iconBackground: "bg-[#f4f0ff]",
  },
  {
    id: "client-operations",
    title: "Client Operations",
    description: "Manage clients, projects and deliverables",
    icon: UserRound,
    iconClassName: "text-[#2c9fb4]",
    iconBackground: "bg-[#e9f9fb]",
  },
  {
    id: "agency-operations",
    title: "Agency Operations",
    description: "Manage your agency workflows",
    icon: Building2,
    iconClassName: "text-[#e43d81]",
    iconBackground: "bg-[#fff0f6]",
  },
  {
    id: "workflow-automation",
    title: "Workflow Automation",
    description: "Automate repetitive operations",
    icon: Workflow,
    iconClassName: "text-[#6438ec]",
    iconBackground: "bg-[#f2efff]",
  },
];

const SUGGESTED_ROLES: {
  id: Exclude<TeamRole, "">;
  title: string;
  description: string;
  seats: string;
  icon: LucideIcon;
  iconClassName: string;
  iconBackground: string;
  seatsClassName: string;
}[] = [
  {
    id: "owner",
    title: "Owner",
    description: "Full control of workspace and all settings",
    seats: "1 seat",
    icon: ShieldCheck,
    iconClassName: "text-[#5b46ff]",
    iconBackground: "bg-[#f0edff]",
    seatsClassName: "bg-[#f0edff] text-[#5945ff]",
  },
  {
    id: "admin",
    title: "Admin",
    description: "Manage team, settings and operations",
    seats: "2 seats",
    icon: UserRound,
    iconClassName: "text-[#2783ff]",
    iconBackground: "bg-[#eaf3ff]",
    seatsClassName: "bg-[#edf4ff] text-[#3976ff]",
  },
  {
    id: "manager",
    title: "Manager",
    description: "Manage operations and workflows",
    seats: "5 seats",
    icon: BarChart3,
    iconClassName: "text-[#18b678]",
    iconBackground: "bg-[#e5f8ef]",
    seatsClassName: "bg-[#e8f9ef] text-[#18a765]",
  },
  {
    id: "member",
    title: "Member",
    description: "View and contribute to assigned tasks",
    seats: "10 seats",
    icon: UserRound,
    iconClassName: "text-[#ff8a18]",
    iconBackground: "bg-[#fff3e6]",
    seatsClassName: "bg-[#e8f9ef] text-[#18a765]",
  },
  {
    id: "viewer",
    title: "Viewer",
    description: "View only access to workspace data",
    seats: "Unlimited",
    icon: Eye,
    iconClassName: "text-[#61709a]",
    iconBackground: "bg-[#f1f2fb]",
    seatsClassName: "bg-[#f0edff] text-[#5945ff]",
  },
];

type IntegrationOption = {
  id: string;
  title: string;
  description: string;
  logo: string;
  category: Exclude<IntegrationCategory, "all">;
  recommended?: boolean;
};

const INTEGRATIONS: IntegrationOption[] = [
  {
    id: "slack",
    title: "Slack",
    description: "Get notifications and collaborate with your team",
    logo: "/integrations/slack.png",
    category: "communication",
    recommended: true,
  },
  {
    id: "gmail",
    title: "Gmail",
    description: "Send and receive emails from your workspace",
    logo: "/integrations/gmail.png",
    category: "communication",
    recommended: true,
  },
  {
    id: "notion",
    title: "Notion",
    description: "Sync docs, tasks and knowledge with your workspace",
    logo: "/integrations/notion.png",
    category: "productivity",
    recommended: true,
  },
  {
    id: "gdrive",
    title: "Google Drive",
    description: "Store and manage files securely",
    logo: "/integrations/gdrive.png",
    category: "productivity",
    recommended: true,
  },
  {
    id: "telegram",
    title: "Telegram",
    description: "Receive real-time alerts and updates",
    logo: "/integrations/telegram.png",
    category: "communication",
    recommended: true,
  },
  {
    id: "discord",
    title: "Discord",
    description: "Connect your community conversations",
    logo: "/integrations/discord.png",
    category: "communication",
  },
  {
    id: "github",
    title: "GitHub",
    description: "Track repositories and engineering activity",
    logo: "/integrations/github.png",
    category: "developer",
  },
  {
    id: "calendar",
    title: "Calendar",
    description: "Coordinate events and shared schedules",
    logo: "/integrations/calendar.png",
    category: "productivity",
  },
  {
    id: "openai",
    title: "OpenAI",
    description: "Power intelligent workspace automations",
    logo: "/integrations/openai.png",
    category: "ai",
  },
  {
    id: "anthropic",
    title: "Anthropic",
    description: "Connect Claude for AI-assisted workflows",
    logo: "/integrations/anthropic.png",
    category: "ai",
  },
];

const INTEGRATION_CATEGORIES: { id: IntegrationCategory; title: string }[] = [
  { id: "all", title: "All" },
  { id: "communication", title: "Communication" },
  { id: "productivity", title: "Productivity" },
  { id: "ai", title: "AI" },
  { id: "developer", title: "Developer" },
];

type TreasuryOption = {
  id: string;
  title: string;
  logo: ReactNode;
  recommended?: boolean;
};

type ChainOption = {
  id: string;
  title: string;
  logo: ReactNode;
};

function WalletLogo({ wallet }: { wallet: WalletProvider }) {
  return <img src={`/assets/wallets/${wallet}.png`} alt="" className="h-12 w-12 object-contain" aria-hidden />;
}

function ChainLogo({ chain }: { chain: string }) {
  const logoPaths: Record<string, string> = {
    ethereum: "/assets/chains/ethereum.png",
    polygon: "/assets/chains/polygon.png",
    arbitrum: "/assets/chains/arbitrum.png",
    base: "/assets/chains/base.png",
    solana: "/assets/chains/solana.png",
    "bnb-chain": "/assets/chains/binance.png",
    stellar: "/assets/chains/stellar.png",
  };

  return <img src={logoPaths[chain]} alt="" className="h-8 w-8 shrink-0 object-contain" aria-hidden />;
}

const TREASURY_PROVIDERS: TreasuryOption[] = [
  { id: "freighter", title: "Freighter", logo: <WalletLogo wallet="freighter" />, recommended: true },
  { id: "metamask", title: "MetaMask", logo: <WalletLogo wallet="metamask" /> },
  { id: "walletconnect", title: "WalletConnect", logo: <WalletLogo wallet="walletconnect" /> },
  { id: "coinbase", title: "Coinbase Wallet", logo: <WalletLogo wallet="coinbase" /> },
  { id: "phantom", title: "Phantom", logo: <WalletLogo wallet="phantom" /> },
];

const SUPPORTED_CHAINS: ChainOption[] = [
  { id: "ethereum", title: "Ethereum", logo: <ChainLogo chain="ethereum" /> },
  { id: "polygon", title: "Polygon", logo: <ChainLogo chain="polygon" /> },
  { id: "arbitrum", title: "Arbitrum", logo: <ChainLogo chain="arbitrum" /> },
  { id: "base", title: "Base", logo: <ChainLogo chain="base" /> },
  { id: "solana", title: "Solana", logo: <ChainLogo chain="solana" /> },
  { id: "bnb-chain", title: "BNB Chain", logo: <ChainLogo chain="bnb-chain" /> },
  { id: "stellar", title: "Stellar", logo: <ChainLogo chain="stellar" /> },
];

function loadWorkspaceDraft(): WorkspaceDraft {
  if (typeof window === "undefined") return DEFAULT_DRAFT;
  try {
    const raw = sessionStorage.getItem(WORKSPACE_DRAFT_KEY);
    if (!raw) return DEFAULT_DRAFT;
    const parsed = JSON.parse(raw) as Partial<WorkspaceDraft>;
    return {
      ...DEFAULT_DRAFT,
      ...parsed,
      currentStep:
        parsed.currentStep === 6
          ? 6
          : parsed.currentStep === 5
            ? 5
            : parsed.currentStep === 4
              ? 4
              : parsed.currentStep === 3
                ? 3
                : parsed.currentStep === 2
                  ? 2
                  : 1,
      teamSize: TEAM_SIZES.some((size) => size.value === parsed.teamSize)
        ? (parsed.teamSize as TeamSize)
        : DEFAULT_DRAFT.teamSize,
      operationModules: parsed.operationModulesTouched && Array.isArray(parsed.operationModules)
        ? parsed.operationModules.filter((id): id is string =>
            OPERATION_MODULES.some((operationModule) => operationModule.id === id)
          )
        : DEFAULT_DRAFT.operationModules,
      operationModulesTouched: parsed.operationModulesTouched === true,
      walletProvider: TREASURY_PROVIDERS.some((provider) => provider.id === parsed.walletProvider)
        ? (parsed.walletProvider as WalletProvider)
        : DEFAULT_DRAFT.walletProvider,
      supportedChains: Array.isArray(parsed.supportedChains)
        ? parsed.supportedChains.filter((id): id is string =>
            SUPPORTED_CHAINS.some((chain) => chain.id === id)
          )
        : DEFAULT_DRAFT.supportedChains,
      inviteMembers: Array.isArray(parsed.inviteMembers)
        ? parsed.inviteMembers.flatMap((invite, index) => {
            if (!invite || typeof invite !== "object") return [];
            const member = invite as Partial<TeamInvite>;
            return [
              {
                id: typeof member.id === "string" ? member.id : `invite-${index + 1}`,
                email: typeof member.email === "string" ? member.email : "",
                nickname: typeof member.nickname === "string" ? member.nickname : "",
                role: SUGGESTED_ROLES.some((role) => role.id === member.role)
                  ? (member.role as TeamRole)
                  : "",
                permission:
                  member.permission === "operations-access" || member.permission === "view-only"
                    ? member.permission
                    : "full-access",
              },
            ];
          })
        : DEFAULT_DRAFT.inviteMembers,
      integrations: Array.isArray(parsed.integrations)
        ? parsed.integrations.filter((id): id is string =>
            INTEGRATIONS.some((integration) => integration.id === id)
          )
        : DEFAULT_DRAFT.integrations,
    };
  } catch {
    return DEFAULT_DRAFT;
  }
}

function SetupProgress({ currentStep }: { currentStep: number }) {
  const progress = Math.round((currentStep / STEPS.length) * 100);

  return (
    <div className="w-[232px] rounded-2xl border border-white/80 bg-white/80 px-4 py-3 shadow-[0_8px_30px_rgba(76,69,145,0.08)] backdrop-blur-md">
      <div className="flex items-center justify-between gap-4 text-xs">
        <span className="font-medium text-[#526080]">Setup Progress</span>
        <span className="font-semibold text-[#12182a]">{progress}%</span>
      </div>
      <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-[#ebe9fb]">
        <div
          className="h-full rounded-full bg-[#5945ff] transition-[width] duration-300"
          style={{ width: `${progress}%` }}
        />
      </div>
    </div>
  );
}

function ProgressRail({ currentStep }: { currentStep: number }) {
  return (
    <aside className="flex w-full shrink-0 flex-col rounded-3xl border border-white/70 bg-white/55 px-6 py-7 shadow-[0_18px_55px_rgba(101,101,156,0.06)] backdrop-blur-sm lg:w-[292px]">
      <h2 className="text-xl font-semibold tracking-tight text-[#10162a]">Workspace Setup</h2>
      <p className="mt-1 text-sm text-[#526080]">Step {currentStep} of 8</p>

      <ol className="mt-8 flex gap-4 overflow-x-auto pb-2 lg:block lg:space-y-0 lg:overflow-visible lg:pb-0">
        {STEPS.map((step, index) => {
          const stepNumber = index + 1;
          const isCompleted = stepNumber < currentStep;
          const isActive = stepNumber === currentStep;
          return (
            <li
              key={step}
              className="relative flex min-w-[192px] gap-4 pb-7 last:pb-0 lg:min-w-0"
            >
              {index < STEPS.length - 1 ? (
                <span
                  className="absolute left-[15px] top-8 hidden h-[calc(100%-0.15rem)] w-px bg-[#e1e4f0] lg:block"
                  aria-hidden
                />
              ) : null}
              <span
                className={cn(
                  "relative z-10 flex h-8 w-8 shrink-0 items-center justify-center rounded-full border text-sm font-medium",
                  isCompleted
                    ? "border-[#5945ff] bg-white text-[#5945ff]"
                    : isActive
                    ? "border-[#5945ff] bg-[#5945ff] text-white shadow-[0_5px_13px_rgba(89,69,255,0.25)]"
                    : "border-[#cad2e4] bg-white/75 text-[#536382]"
                )}
              >
                {isCompleted ? <Check className="h-4 w-4" strokeWidth={2.4} /> : stepNumber}
              </span>
              <span className="min-w-0 pt-0.5">
                <span
                  className={cn(
                    "block text-sm font-medium leading-5",
                    isActive ? "text-[#5945ff]" : "text-[#526080]"
                  )}
                >
                  {step}
                </span>
                <span
                  className={cn(
                    "mt-0.5 block text-xs leading-5",
                    isActive
                      ? "font-medium text-[#5945ff]"
                      : isCompleted
                        ? "text-[#526080]"
                        : "text-[#526080]"
                  )}
                >
                  {isCompleted ? "Completed" : isActive ? "In progress" : "Upcoming"}
                </span>
              </span>
            </li>
          );
        })}
      </ol>

      <div className="mt-auto hidden rounded-2xl border border-[#e4e7f0] bg-white/55 p-4 lg:block">
        <div className="flex items-center gap-3">
          <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#f1efff]">
            <LifeBuoy className="h-4 w-4 text-[#5945ff]" strokeWidth={2} />
          </span>
          <span className="text-sm font-semibold text-[#151a2b]">Need help?</span>
        </div>
        <p className="mt-3 text-xs leading-5 text-[#526080]">
          Learn more about setting up your workspace.
        </p>
        <a
          href="#"
          className="mt-4 inline-flex items-center gap-1 text-xs font-medium text-[#5945ff] underline underline-offset-2"
        >
          View Guide
          <ExternalLink className="h-3 w-3" />
        </a>
      </div>
    </aside>
  );
}

function WorkspaceTypeCard({
  workspaceType,
  selected,
  onSelect,
}: {
  workspaceType: WorkspaceType;
  selected: boolean;
  onSelect: () => void;
}) {
  const Icon = workspaceType.icon;

  return (
    <button
      type="button"
      onClick={onSelect}
      className={cn(
        "relative min-h-[192px] rounded-2xl border bg-white/55 p-5 text-left transition-all duration-200 hover:-translate-y-0.5 hover:border-[#aaa0ff] hover:bg-white/80 hover:shadow-[0_12px_24px_rgba(66,61,122,0.08)]",
        selected
          ? "border-[#7664ff] bg-white/85 shadow-[0_12px_30px_rgba(89,69,255,0.08)] ring-1 ring-[#7664ff]/15"
          : "border-[#e2e6f0]"
      )}
      aria-pressed={selected}
    >
      {selected ? (
        <span className="absolute right-3 top-3 flex h-5 w-5 items-center justify-center rounded-full bg-[#5945ff] text-[12px] font-bold leading-none text-white">
          ✓
        </span>
      ) : null}
      <span
        className={cn(
          "flex h-11 w-11 items-center justify-center rounded-xl",
          workspaceType.iconBackground
        )}
      >
        <Icon className={cn("h-5 w-5", workspaceType.iconClassName)} strokeWidth={2.2} />
      </span>
      <span className="mt-5 block text-sm font-semibold text-[#151a2b]">
        {workspaceType.title}
      </span>
      <span className="mt-2 block text-xs leading-5 text-[#526080]">
        {workspaceType.description}
      </span>
    </button>
  );
}

function WorkspaceTypeStep({
  draft,
  onSelectType,
  onContinue,
}: {
  draft: WorkspaceDraft;
  onSelectType: (workspaceType: string) => void;
  onContinue: () => void;
}) {
  return (
    <>
      <div>
        <span className="inline-flex rounded-full bg-[#f1efff] px-3 py-1 text-[11px] font-semibold tracking-wide text-[#5945ff]">
          STEP 1 OF 8
        </span>
        <h1 className="mt-6 text-3xl font-semibold tracking-[-0.03em] text-[#10162a]">
          What are you building?
        </h1>
        <p className="mt-2 text-sm text-[#526080]">
          This helps us personalize your workspace experience.
        </p>
      </div>

      <div className="mt-9 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {WORKSPACE_TYPES.map((workspaceType) => (
          <WorkspaceTypeCard
            key={workspaceType.id}
            workspaceType={workspaceType}
            selected={draft.workspaceType === workspaceType.id}
            onSelect={() => onSelectType(workspaceType.id)}
          />
        ))}
      </div>

      <div className="mt-auto flex flex-col gap-4 pt-8 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex max-w-xl items-center gap-3 rounded-xl border border-[#ebe9fb] bg-gradient-to-r from-[#fbfaff] to-[#f6f4ff] px-4 py-3">
          <Sparkles className="h-4 w-4 shrink-0 text-[#5945ff]" strokeWidth={2} />
          <p className="text-xs text-[#526080]">
            You can always change this later in workspace settings.
          </p>
        </div>
        <Button
          type="button"
          onClick={onContinue}
          className="h-12 shrink-0 rounded-xl bg-gradient-to-r from-[#5945ff] to-[#3724f7] px-8 text-sm font-medium text-white shadow-[0_10px_24px_rgba(89,69,255,0.22)] hover:from-[#4e3bf2] hover:to-[#2f1ee5]"
        >
          Continue
          <ArrowRight className="ml-3 h-4 w-4" strokeWidth={1.8} />
        </Button>
      </div>
    </>
  );
}

function WorkspaceDetailsStep({
  draft,
  onUpdate,
  onBack,
  onContinue,
}: {
  draft: WorkspaceDraft;
  onUpdate: (updates: Partial<WorkspaceDraft>) => void;
  onBack: () => void;
  onContinue: () => void;
}) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [logoError, setLogoError] = useState("");

  const handleLogoFile = (file?: File) => {
    if (!file) return;
    if (!["image/jpeg", "image/png", "image/svg+xml"].includes(file.type)) {
      setLogoError("Upload a JPG, PNG, or SVG file.");
      return;
    }
    if (file.size > MAX_LOGO_SIZE_BYTES) {
      setLogoError("Logo must be smaller than 2 MB.");
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result !== "string") return;
      onUpdate({ logoDataUrl: reader.result, logoName: file.name });
      setLogoError("");
    };
    reader.readAsDataURL(file);
  };

  const handleInputChange = (event: ChangeEvent<HTMLInputElement>) => {
    handleLogoFile(event.target.files?.[0]);
    event.target.value = "";
  };

  const handleDrop = (event: DragEvent<HTMLButtonElement>) => {
    event.preventDefault();
    handleLogoFile(event.dataTransfer.files?.[0]);
  };

  const isReady = draft.businessName.trim().length > 0 && draft.website.trim().length > 0;

  return (
    <>
      <div>
        <span className="inline-flex rounded-full bg-[#f1efff] px-3 py-1 text-[11px] font-semibold tracking-wide text-[#5945ff]">
          STEP 2 OF 8
        </span>
        <h1 className="mt-6 text-3xl font-semibold tracking-[-0.03em] text-[#10162a]">
          Let&apos;s set up the basics
        </h1>
        <p className="mt-2 text-sm text-[#526080]">You can always change these later.</p>
      </div>

      <div className="mt-10 grid gap-8 xl:grid-cols-[minmax(0,1fr)_360px]">
        <div className="space-y-7">
          <label className="block">
            <span className="text-sm font-semibold text-[#151a2b]">Business Name</span>
            <span className="mt-1 block text-xs text-[#526080]">
              This is how your workspace will appear inside Hypertron.
            </span>
            <span className="relative mt-3 block">
              <input
                type="text"
                value={draft.businessName}
                onChange={(event) => onUpdate({ businessName: event.target.value })}
                placeholder="e.g. Hypertron Labs"
                className="h-14 w-full rounded-xl border border-[#dfe3ef] bg-white/75 px-4 pr-12 text-sm text-[#151a2b] outline-none transition focus:border-[#7664ff] focus:ring-2 focus:ring-[#7664ff]/10"
              />
              {draft.businessName.trim() ? (
                <CheckCircle2 className="absolute right-4 top-1/2 h-5 w-5 -translate-y-1/2 text-[#39b86b]" />
              ) : null}
            </span>
          </label>

          <label className="block">
            <span className="text-sm font-semibold text-[#151a2b]">Website Link</span>
            <span className="mt-1 block text-xs text-[#526080]">
              Add the website your team uses for this workspace.
            </span>
            <span className="relative mt-3 block">
              <Globe2 className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-[#7b86a4]" />
              <input
                type="url"
                value={draft.website}
                onChange={(event) => onUpdate({ website: event.target.value })}
                placeholder="https://yourcompany.xyz"
                className="h-14 w-full rounded-xl border border-[#dfe3ef] bg-white/75 pl-11 pr-4 text-sm text-[#151a2b] outline-none transition focus:border-[#7664ff] focus:ring-2 focus:ring-[#7664ff]/10"
              />
            </span>
          </label>

          <fieldset>
            <legend className="text-sm font-semibold text-[#151a2b]">Team Size</legend>
            <p className="mt-1 text-xs text-[#526080]">Helps us tailor your experience.</p>
            <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
              {TEAM_SIZES.map((size) => {
                const selected = draft.teamSize === size.value;
                return (
                  <button
                    key={size.value}
                    type="button"
                    onClick={() => onUpdate({ teamSize: size.value })}
                    className={cn(
                      "flex h-14 items-center justify-center gap-2 rounded-xl border bg-white/60 text-sm font-medium transition hover:border-[#aaa0ff] hover:bg-white/80",
                      selected
                        ? "border-[#7664ff] bg-[#faf9ff] text-[#5945ff] ring-1 ring-[#7664ff]/15"
                        : "border-[#dfe3ef] text-[#34405e]"
                    )}
                    aria-pressed={selected}
                  >
                    <Users className="h-4 w-4" strokeWidth={2} />
                    {size.label}
                  </button>
                );
              })}
            </div>
          </fieldset>
        </div>

        <div>
          <h2 className="text-sm font-semibold text-[#151a2b]">
            Logo <span className="font-normal text-[#526080]">(Optional)</span>
          </h2>
          <p className="mt-1 text-xs text-[#526080]">
            Upload your logo to personalize your workspace.
          </p>
          <input
            ref={fileInputRef}
            type="file"
            accept=".jpg,.jpeg,.png,.svg,image/jpeg,image/png,image/svg+xml"
            onChange={handleInputChange}
            className="hidden"
          />
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            onDragOver={(event) => event.preventDefault()}
            onDrop={handleDrop}
            className="mt-3 flex min-h-[280px] w-full flex-col items-center justify-center rounded-2xl border border-dashed border-[#cfd4ee] bg-gradient-to-br from-white/55 to-[#fbfaff] px-6 text-center transition hover:border-[#9387ff] hover:bg-white/80"
          >
            {draft.logoDataUrl ? (
              <>
                <span className="flex h-28 w-28 items-center justify-center overflow-hidden rounded-2xl border border-[#e1defa] bg-white p-3 shadow-[0_10px_25px_rgba(89,69,255,0.08)]">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={draft.logoDataUrl}
                    alt={`${draft.businessName || "Workspace"} logo preview`}
                    className="max-h-full max-w-full object-contain"
                  />
                </span>
                <span className="mt-4 max-w-full truncate text-sm font-semibold text-[#151a2b]">
                  {draft.logoName || "Uploaded logo"}
                </span>
                <span className="mt-1 text-xs text-[#5945ff]">Click or drop a file to replace</span>
              </>
            ) : (
              <>
                <span className="flex h-20 w-20 items-center justify-center rounded-2xl border border-[#e1defa] bg-[#f8f7ff]">
                  <ImageUp className="h-8 w-8 text-[#5945ff]" strokeWidth={1.7} />
                </span>
                <span className="mt-5 text-sm font-semibold text-[#151a2b]">Upload Logo</span>
                <span className="mt-2 text-xs text-[#526080]">Drag &amp; drop or click to upload</span>
                <span className="mt-5 text-xs text-[#526080]">JPG, PNG or SVG. Max 2 MB</span>
              </>
            )}
          </button>
          {logoError ? <p className="mt-2 text-xs text-red-600">{logoError}</p> : null}
        </div>
      </div>

      <div className="mt-auto flex flex-col-reverse gap-3 border-t border-[#e7e9f1] pt-7 sm:flex-row sm:items-center sm:justify-between">
        <Button
          type="button"
          variant="outline"
          onClick={onBack}
          className="h-12 rounded-xl border-[#dfe3ef] bg-white/55 px-6 text-sm font-medium text-[#34405e] hover:bg-white hover:text-[#151a2b]"
        >
          <ArrowLeft className="mr-3 h-4 w-4" strokeWidth={1.8} />
          Back
        </Button>
        <Button
          type="button"
          disabled={!isReady}
          onClick={onContinue}
          className="h-12 rounded-xl bg-gradient-to-r from-[#5945ff] to-[#3724f7] px-8 text-sm font-medium text-white shadow-[0_10px_24px_rgba(89,69,255,0.22)] hover:from-[#4e3bf2] hover:to-[#2f1ee5]"
        >
          Continue
          <ArrowRight className="ml-3 h-4 w-4" strokeWidth={1.8} />
        </Button>
      </div>
    </>
  );
}

function OperationsSetupStep({
  draft,
  onToggle,
  onBack,
  onContinue,
}: {
  draft: WorkspaceDraft;
  onToggle: (moduleId: string) => void;
  onBack: () => void;
  onContinue: () => void;
}) {
  return (
    <>
      <div className="flex flex-col gap-5 xl:flex-row xl:items-start xl:justify-between">
        <div>
          <span className="inline-flex rounded-full bg-[#f1efff] px-3 py-1 text-[11px] font-semibold tracking-wide text-[#5945ff]">
            STEP 3 OF 8
          </span>
          <h1 className="mt-6 text-3xl font-semibold tracking-[-0.03em] text-[#10162a]">
            Enable your operations modules
          </h1>
          <p className="mt-2 text-sm text-[#526080]">
            Choose the modules you want to enable. You can change this later.
          </p>
        </div>
        <div className="flex max-w-sm items-center gap-3 rounded-xl border border-[#ebe9fb] bg-gradient-to-r from-[#fbfaff] to-[#f6f4ff] px-4 py-3">
          <Sparkles className="h-4 w-4 shrink-0 text-[#5945ff]" strokeWidth={2} />
          <p className="text-xs leading-5 text-[#526080]">
            You can enable or disable modules anytime from workspace settings.
          </p>
        </div>
      </div>

      <div className="mt-10 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {OPERATION_MODULES.map((operationModule) => {
          const Icon = operationModule.icon;
          const selected = draft.operationModules.includes(operationModule.id);
          return (
            <button
              key={operationModule.id}
              type="button"
              onClick={() => onToggle(operationModule.id)}
              className={cn(
                "relative flex min-h-[142px] gap-4 rounded-2xl border bg-white/55 p-5 text-left transition-all duration-200 hover:-translate-y-0.5 hover:border-[#aaa0ff] hover:bg-white/80 hover:shadow-[0_12px_24px_rgba(66,61,122,0.08)]",
                selected
                  ? "border-[#d8d7ee] bg-white/78"
                  : "border-[#e2e6f0] bg-white/35 opacity-75"
              )}
              aria-pressed={selected}
            >
              <span
                className={cn(
                  "flex h-11 w-11 shrink-0 items-center justify-center rounded-xl",
                  operationModule.iconBackground
                )}
              >
                <Icon
                  className={cn("h-5 w-5", operationModule.iconClassName)}
                  strokeWidth={2.1}
                />
              </span>
              <span className="min-w-0 pr-5">
                <span className="block text-sm font-semibold text-[#151a2b]">
                  {operationModule.title}
                </span>
                <span className="mt-3 block text-xs leading-5 text-[#526080]">
                  {operationModule.description}
                </span>
              </span>
              <span
                className={cn(
                  "absolute right-4 top-4 flex h-5 w-5 items-center justify-center rounded border transition",
                  selected
                    ? "border-[#5945ff] bg-[#5945ff] text-white"
                    : "border-[#cfd4e4] bg-white text-transparent"
                )}
                aria-hidden
              >
                <Check className="h-3.5 w-3.5" strokeWidth={2.6} />
              </span>
            </button>
          );
        })}
      </div>

      <div className="mt-auto flex flex-col-reverse gap-3 border-t border-[#e7e9f1] pt-7 sm:flex-row sm:items-center sm:justify-between">
        <Button
          type="button"
          variant="outline"
          onClick={onBack}
          className="h-12 rounded-xl border-[#dfe3ef] bg-white/55 px-6 text-sm font-medium text-[#34405e] hover:bg-white hover:text-[#151a2b]"
        >
          <ArrowLeft className="mr-3 h-4 w-4" strokeWidth={1.8} />
          Back
        </Button>
        <Button
          type="button"
          disabled={draft.operationModules.length === 0}
          onClick={onContinue}
          className="h-12 rounded-xl bg-gradient-to-r from-[#5945ff] to-[#3724f7] px-8 text-sm font-medium text-white shadow-[0_10px_24px_rgba(89,69,255,0.22)] hover:from-[#4e3bf2] hover:to-[#2f1ee5]"
        >
          Continue
          <ArrowRight className="ml-3 h-4 w-4" strokeWidth={1.8} />
        </Button>
      </div>
    </>
  );
}

function CompactStepProgress({ currentStep }: { currentStep: number }) {
  return (
    <div className="hidden items-center gap-2 lg:flex" aria-label={`Step ${currentStep} of 8`}>
      {STEPS.map((step, index) => {
        const stepNumber = index + 1;
        const isCompleted = stepNumber < currentStep;
        const isActive = stepNumber === currentStep;
        return (
          <span
            key={step}
            className={cn(
              "flex h-6 w-6 items-center justify-center rounded-full border text-[10px] font-semibold",
              isCompleted
                ? "border-[#a89bff] bg-[#a89bff] text-white"
                : isActive
                  ? "border-[#5945ff] bg-[#5945ff] text-white"
                  : "border-[#cfd4e4] bg-white/60 text-[#7b86a4]"
            )}
          >
            {isCompleted ? <Check className="h-3 w-3" strokeWidth={2.6} /> : stepNumber}
          </span>
        );
      })}
    </div>
  );
}

function TreasurySetupStep({
  draft,
  onSelectProvider,
  onToggleChain,
  onBack,
  onContinue,
}: {
  draft: WorkspaceDraft;
  onSelectProvider: (provider: WalletProvider) => void;
  onToggleChain: (chainId: string) => void;
  onBack: () => void;
  onContinue: () => void;
}) {
  return (
    <>
      <div>
        <span className="inline-flex rounded-full bg-[#f1efff] px-3 py-1 text-[11px] font-semibold tracking-wide text-[#5945ff]">
          STEP 4 OF 8
        </span>
        <h1 className="mt-6 text-3xl font-semibold tracking-[-0.03em] text-[#10162a]">
          Connect your treasury
        </h1>
        <p className="mt-2 text-sm text-[#526080]">
          Connect a wallet or multi-sig to manage your funds across chains.
        </p>
      </div>

      <div className="mt-9 grid gap-5 xl:grid-cols-[minmax(0,1.55fr)_minmax(320px,0.95fr)]">
        <section className="rounded-2xl border border-[#e1e5ef] bg-white/48 p-5">
          <h2 className="text-sm font-semibold text-[#151a2b]">Connect Wallet / Multi-sig</h2>
          <p className="mt-1 text-xs text-[#526080]">Select your preferred wallet provider.</p>

          <div className="mt-7 grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
            {TREASURY_PROVIDERS.map((provider) => {
              const selected = draft.walletProvider === provider.id;
              return (
                <button
                  key={provider.id}
                  type="button"
                  onClick={() => onSelectProvider(provider.id as WalletProvider)}
                  className={cn(
                    "relative flex min-h-[152px] flex-col items-center justify-center rounded-xl border px-3 py-4 text-center transition-all duration-200 hover:-translate-y-0.5 hover:border-[#aaa0ff] hover:bg-white/80",
                    selected
                      ? "border-[#7664ff] bg-[#fbfaff] shadow-[0_10px_20px_rgba(89,69,255,0.06)]"
                      : "border-[#e1e5ef] bg-white/55"
                  )}
                  aria-pressed={selected}
                >
                  <span
                    className={cn(
                      "absolute right-3 top-3 flex h-4 w-4 items-center justify-center rounded-full border",
                      selected
                        ? "border-[#5945ff] bg-[#5945ff] text-white"
                        : "border-[#d5dbea] bg-white text-transparent"
                    )}
                    aria-hidden
                  >
                    <Check className="h-2.5 w-2.5" strokeWidth={2.8} />
                  </span>
                  {provider.logo}
                  <span className="mt-4 text-[11px] font-semibold leading-4 text-[#151a2b]">
                    {provider.title}
                  </span>
                  {provider.recommended ? (
                    <span className="mt-2 rounded-full bg-[#f0edff] px-2 py-0.5 text-[9px] font-semibold text-[#5945ff]">
                      Recommended
                    </span>
                  ) : null}
                </button>
              );
            })}
          </div>

          <div className="my-6 flex items-center gap-3 text-xs text-[#7b86a4]">
            <span className="h-px flex-1 bg-[#e1e5ef]" />
            or
            <span className="h-px flex-1 bg-[#e1e5ef]" />
          </div>

          <button
            type="button"
            className="flex h-12 w-full items-center gap-3 rounded-xl border border-[#e1e5ef] bg-white/55 px-4 text-left text-xs font-medium text-[#34405e] transition hover:border-[#c8cef0] hover:bg-white/85"
          >
            <Wallet className="h-4 w-4 text-[#657091]" strokeWidth={1.8} />
            <span className="flex-1">Import existing treasury addresses</span>
            <ChevronRight className="h-4 w-4 text-[#657091]" strokeWidth={1.8} />
          </button>

          <div className="mt-7 flex items-center gap-3 text-xs text-[#526080]">
            <ShieldCheck className="h-4 w-4 shrink-0 text-[#7664ff]" strokeWidth={1.9} />
            <p>Your keys are never stored. We only read data to help you operate.</p>
          </div>
        </section>

        <section className="rounded-2xl border border-[#e1e5ef] bg-white/48 p-5">
          <h2 className="text-sm font-semibold text-[#151a2b]">Select supported chains</h2>
          <p className="mt-1 text-xs text-[#526080]">
            Choose the networks where your treasury operates.
          </p>

          <div className="mt-6 overflow-hidden rounded-xl border border-[#e1e5ef] bg-white/62">
            {SUPPORTED_CHAINS.map((chain, index) => {
              const selected = draft.supportedChains.includes(chain.id);
              return (
                <button
                  key={chain.id}
                  type="button"
                  onClick={() => onToggleChain(chain.id)}
                  className={cn(
                    "flex w-full items-center gap-3 px-3 py-2.5 text-left transition hover:bg-[#f8f8ff]",
                    index > 0 && "border-t border-[#eef0f5]"
                  )}
                  aria-pressed={selected}
                >
                  {chain.logo}
                  <span className="flex-1 text-xs font-semibold text-[#151a2b]">{chain.title}</span>
                  <span
                    className={cn(
                      "flex h-5 w-5 items-center justify-center rounded border",
                      selected
                        ? "border-[#5945ff] bg-[#5945ff] text-white"
                        : "border-[#cfd4e4] bg-white text-transparent"
                    )}
                    aria-hidden
                  >
                    <Check className="h-3.5 w-3.5" strokeWidth={2.6} />
                  </span>
                </button>
              );
            })}
          </div>

          <button
            type="button"
            className="mt-3 flex h-12 w-full items-center gap-3 rounded-xl border border-[#e1e5ef] bg-white/55 px-4 text-left text-xs font-medium text-[#34405e] transition hover:border-[#c8cef0] hover:bg-white/85"
          >
            <Plus className="h-4 w-4 text-[#657091]" strokeWidth={1.8} />
            Add Custom Chain
          </button>
        </section>
      </div>

      <div className="mt-auto grid gap-3 border-t border-[#e7e9f1] pt-7 sm:grid-cols-[1fr_auto_1fr] sm:items-center">
        <Button
          type="button"
          variant="outline"
          onClick={onBack}
          className="h-12 w-full rounded-xl border-[#dfe3ef] bg-white/55 px-6 text-sm font-medium text-[#34405e] hover:bg-white hover:text-[#151a2b] sm:w-fit"
        >
          <ArrowLeft className="mr-3 h-4 w-4" strokeWidth={1.8} />
          Back
        </Button>
        <CompactStepProgress currentStep={4} />
        <Button
          type="button"
          disabled={draft.supportedChains.length === 0}
          onClick={onContinue}
          className="h-12 w-full rounded-xl bg-gradient-to-r from-[#5945ff] to-[#3724f7] px-8 text-sm font-medium text-white shadow-[0_10px_24px_rgba(89,69,255,0.22)] hover:from-[#4e3bf2] hover:to-[#2f1ee5] sm:ml-auto sm:w-fit"
        >
          Continue
          <ArrowRight className="ml-3 h-4 w-4" strokeWidth={1.8} />
        </Button>
      </div>
    </>
  );
}

function GoogleLogo() {
  return (
    <svg viewBox="0 0 24 24" className="h-4 w-4" aria-hidden>
      <path fill="#4285F4" d="M21.6 12.2c0-.7-.1-1.4-.2-2.1H12v3.9h5.4a4.7 4.7 0 0 1-2 3.1v2.6h3.3c1.9-1.8 2.9-4.4 2.9-7.5" />
      <path fill="#34A853" d="M12 22c2.7 0 5-.9 6.7-2.4L15.4 17c-.9.6-2.1 1-3.4 1-2.6 0-4.9-1.8-5.7-4.2H2.9v2.7A10 10 0 0 0 12 22" />
      <path fill="#FBBC05" d="M6.3 13.8a6 6 0 0 1 0-3.7V7.5H2.9a10 10 0 0 0 0 9z" />
      <path fill="#EA4335" d="M12 6c1.5 0 2.9.5 3.9 1.5l2.9-2.9A9.8 9.8 0 0 0 12 2a10 10 0 0 0-9.1 5.5l3.4 2.6C7.1 7.7 9.4 6 12 6" />
    </svg>
  );
}

function InviteTeamStep({
  draft,
  onUpdateMember,
  onAddMember,
  onRemoveMember,
  onBack,
  onContinue,
}: {
  draft: WorkspaceDraft;
  onUpdateMember: (memberId: string, updates: Partial<TeamInvite>) => void;
  onAddMember: () => void;
  onRemoveMember: (memberId: string) => void;
  onBack: () => void;
  onContinue: () => void;
}) {
  return (
    <>
      <div>
        <span className="inline-flex rounded-full bg-[#f1efff] px-3 py-1 text-[11px] font-semibold tracking-wide text-[#5945ff]">
          STEP 5 OF 8
        </span>
        <h1 className="mt-6 text-3xl font-semibold tracking-[-0.03em] text-[#10162a]">
          Invite your team
        </h1>
        <p className="mt-2 text-sm text-[#526080]">
          Add team members who will collaborate in this workspace.
        </p>
      </div>

      <div className="mt-8 border-t border-[#e7e9f1] pt-7">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-sm font-semibold text-[#151a2b]">Invite Members</h2>
            <p className="mt-1 text-xs text-[#526080]">
              You can add or invite team members now or do it later.
            </p>
          </div>
          <Button
            type="button"
            variant="outline"
            className="h-11 w-full rounded-xl border-[#dfe3ef] bg-white/55 px-5 text-xs font-medium text-[#34405e] hover:bg-white hover:text-[#151a2b] sm:w-fit"
          >
            <GoogleLogo />
            <span className="ml-2">Import from Google</span>
          </Button>
        </div>

        <div className="mt-5 rounded-xl border border-[#e1e5ef] bg-white/45 p-4">
          <div className="space-y-4">
            {draft.inviteMembers.map((member) => (
              <div
                key={member.id}
                className="grid gap-3 xl:grid-cols-[minmax(0,1.2fr)_minmax(130px,0.72fr)_minmax(150px,0.86fr)_minmax(170px,1fr)_48px] xl:items-end"
              >
                <label className="block">
                  <span className="mb-2 block text-xs font-semibold text-[#526080]">
                    Email address
                  </span>
                  <input
                    type="email"
                    value={member.email}
                    onChange={(event) => onUpdateMember(member.id, { email: event.target.value })}
                    placeholder="name@company.com"
                    className="h-12 w-full rounded-lg border border-[#dfe3ef] bg-white/65 px-4 text-sm text-[#151a2b] outline-none transition placeholder:text-[#8791aa] focus:border-[#8c7dff] focus:bg-white focus:ring-4 focus:ring-[#7664ff]/10"
                  />
                </label>
                <label className="block">
                  <span className="mb-2 block text-xs font-semibold text-[#526080]">
                    Nickname
                  </span>
                  <input
                    type="text"
                    value={member.nickname}
                    onChange={(event) =>
                      onUpdateMember(member.id, { nickname: event.target.value })
                    }
                    placeholder="e.g. Soumik"
                    className="h-12 w-full rounded-lg border border-[#dfe3ef] bg-white/65 px-4 text-sm text-[#151a2b] outline-none transition placeholder:text-[#8791aa] focus:border-[#8c7dff] focus:bg-white focus:ring-4 focus:ring-[#7664ff]/10"
                  />
                </label>
                <label className="block">
                  <span className="mb-2 block text-xs font-semibold text-[#526080]">Role</span>
                  <span className="relative block">
                    <select
                      value={member.role}
                      onChange={(event) =>
                        onUpdateMember(member.id, { role: event.target.value as TeamRole })
                      }
                      className="h-12 w-full appearance-none rounded-lg border border-[#dfe3ef] bg-white/65 px-4 pr-10 text-sm text-[#526080] outline-none transition focus:border-[#8c7dff] focus:bg-white focus:ring-4 focus:ring-[#7664ff]/10"
                    >
                      <option value="">Select role</option>
                      {SUGGESTED_ROLES.map((role) => (
                        <option key={role.id} value={role.id}>
                          {role.title}
                        </option>
                      ))}
                    </select>
                    <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#657091]" strokeWidth={1.8} />
                  </span>
                </label>
                <label className="block">
                  <span className="mb-2 block text-xs font-semibold text-[#526080]">
                    Permission Level
                  </span>
                  <span className="relative block">
                    <select
                      value={member.permission}
                      onChange={(event) =>
                        onUpdateMember(member.id, {
                          permission: event.target.value as PermissionLevel,
                        })
                      }
                      className="h-12 w-full appearance-none rounded-lg border border-[#dfe3ef] bg-white/65 px-4 pr-10 text-sm text-[#526080] outline-none transition focus:border-[#8c7dff] focus:bg-white focus:ring-4 focus:ring-[#7664ff]/10"
                    >
                      <option value="full-access">Full access</option>
                      <option value="operations-access">Operations access</option>
                      <option value="view-only">View only</option>
                    </select>
                    <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#657091]" strokeWidth={1.8} />
                  </span>
                </label>
                <Button
                  type="button"
                  variant="outline"
                  size="icon"
                  onClick={() => onRemoveMember(member.id)}
                  className="h-12 w-12 rounded-lg border-[#dfe3ef] bg-white/65 text-[#657091] hover:border-[#ffcaca] hover:bg-[#fff7f7] hover:text-[#db5555]"
                  aria-label={`Remove ${member.email || "team member"}`}
                >
                  <Trash2 className="h-4 w-4" strokeWidth={1.8} />
                </Button>
              </div>
            ))}
          </div>

          <Button
            type="button"
            variant="outline"
            onClick={onAddMember}
            className="mt-4 h-10 rounded-lg border-[#cfc9ff] bg-white/55 px-4 text-xs font-medium text-[#34405e] hover:bg-white hover:text-[#5945ff]"
          >
            <Plus className="mr-2 h-4 w-4 text-[#5945ff]" strokeWidth={1.8} />
            Add another member
          </Button>
        </div>

        <div className="mt-7">
          <h2 className="text-sm font-semibold text-[#151a2b]">Suggested Roles</h2>
          <p className="mt-1 text-xs text-[#526080]">
            Choose a role to assign the right permissions.
          </p>
          <div className="mt-4 grid gap-4 sm:grid-cols-2 xl:grid-cols-5">
            {SUGGESTED_ROLES.map((role) => {
              const Icon = role.icon;
              return (
                <article
                  key={role.id}
                  className="flex min-h-[172px] flex-col rounded-xl border border-[#e1e5ef] bg-white/45 p-4"
                >
                  <span
                    className={cn(
                      "flex h-10 w-10 items-center justify-center rounded-lg",
                      role.iconBackground
                    )}
                  >
                    <Icon className={cn("h-5 w-5", role.iconClassName)} strokeWidth={2} />
                  </span>
                  <h3 className="mt-4 text-sm font-semibold text-[#151a2b]">{role.title}</h3>
                  <p className="mt-2 text-xs leading-5 text-[#526080]">{role.description}</p>
                  <span
                    className={cn(
                      "mt-auto w-fit rounded-full px-2 py-0.5 text-[10px] font-semibold",
                      role.seatsClassName
                    )}
                  >
                    {role.seats}
                  </span>
                </article>
              );
            })}
          </div>
        </div>
      </div>

      <div className="mt-auto grid gap-3 border-t border-[#e7e9f1] pt-7 sm:grid-cols-[1fr_auto_1fr] sm:items-center">
        <Button
          type="button"
          variant="outline"
          onClick={onBack}
          className="h-12 w-full rounded-xl border-[#dfe3ef] bg-white/55 px-6 text-sm font-medium text-[#34405e] hover:bg-white hover:text-[#151a2b] sm:w-fit"
        >
          <ArrowLeft className="mr-3 h-4 w-4" strokeWidth={1.8} />
          Back
        </Button>
        <CompactStepProgress currentStep={5} />
        <Button
          type="button"
          onClick={onContinue}
          className="h-12 w-full rounded-xl bg-gradient-to-r from-[#5945ff] to-[#3724f7] px-8 text-sm font-medium text-white shadow-[0_10px_24px_rgba(89,69,255,0.22)] hover:from-[#4e3bf2] hover:to-[#2f1ee5] sm:ml-auto sm:w-fit"
        >
          Continue
          <ArrowRight className="ml-3 h-4 w-4" strokeWidth={1.8} />
        </Button>
      </div>
    </>
  );
}

function IntegrationLogo({ integration }: { integration: IntegrationOption }) {
  return (
    <img
      src={integration.logo}
      alt=""
      className="h-10 w-10 shrink-0 rounded-lg object-contain"
      aria-hidden
    />
  );
}

function IntegrationsSetupStep({
  draft,
  onToggle,
  onToggleRecommended,
  onBack,
}: {
  draft: WorkspaceDraft;
  onToggle: (integrationId: string) => void;
  onToggleRecommended: () => void;
  onBack: () => void;
}) {
  const [category, setCategory] = useState<IntegrationCategory>("all");
  const [query, setQuery] = useState("");
  const connectedIntegrations = draft.integrations ?? [];
  const recommended = INTEGRATIONS.filter((integration) => integration.recommended);
  const allRecommendedConnected = recommended.every((integration) =>
    connectedIntegrations.includes(integration.id)
  );
  const filteredIntegrations = INTEGRATIONS.filter((integration) => {
    const matchesCategory = category === "all" || integration.category === category;
    const normalizedQuery = query.trim().toLowerCase();
    const matchesQuery =
      normalizedQuery.length === 0 ||
      integration.title.toLowerCase().includes(normalizedQuery) ||
      integration.description.toLowerCase().includes(normalizedQuery);
    return matchesCategory && matchesQuery;
  });
  const categoryCounts = INTEGRATION_CATEGORIES.reduce<Record<IntegrationCategory, number>>(
    (counts, currentCategory) => {
      counts[currentCategory.id] =
        currentCategory.id === "all"
          ? INTEGRATIONS.length
          : INTEGRATIONS.filter((integration) => integration.category === currentCategory.id).length;
      return counts;
    },
    { all: 0, communication: 0, productivity: 0, ai: 0, developer: 0 }
  );

  return (
    <>
      <div className="flex flex-col gap-5 xl:flex-row xl:items-start xl:justify-between">
        <div>
          <span className="inline-flex rounded-full bg-[#f1efff] px-3 py-1 text-[11px] font-semibold tracking-wide text-[#5945ff]">
            STEP 6 OF 8
          </span>
          <h1 className="mt-5 text-3xl font-semibold tracking-[-0.03em] text-[#10162a]">
            Connect your favorite integrations
          </h1>
          <p className="mt-2 text-sm text-[#526080]">
            Connect the tools you already use. You can add or remove integrations anytime.
          </p>
        </div>
        <div className="flex max-w-[300px] items-center gap-3 rounded-xl border border-[#e5e1ff] bg-[#f8f6ff] px-4 py-3 text-xs leading-5 text-[#526080]">
          <Sparkles className="h-5 w-5 shrink-0 text-[#5945ff]" strokeWidth={1.9} />
          <span className="font-medium">Secure, read-only connections with enterprise-grade security.</span>
        </div>
      </div>

      <div className="mt-7 flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
        <div className="flex max-w-full overflow-x-auto rounded-xl border border-[#e1e5ef] bg-white/55 p-1">
          {INTEGRATION_CATEGORIES.map((integrationCategory) => (
            <button
              key={integrationCategory.id}
              type="button"
              onClick={() => setCategory(integrationCategory.id)}
              className={cn(
                "whitespace-nowrap rounded-lg px-4 py-2 text-xs font-medium transition",
                category === integrationCategory.id
                  ? "bg-white text-[#5945ff] shadow-sm"
                  : "text-[#526080] hover:bg-white/70 hover:text-[#34405e]"
              )}
              aria-pressed={category === integrationCategory.id}
            >
              {integrationCategory.title} ({categoryCounts[integrationCategory.id]})
            </button>
          ))}
        </div>
        <div className="flex gap-3">
          <label className="relative block min-w-0 flex-1 xl:w-[250px]">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#657091]" strokeWidth={1.8} />
            <input
              type="search"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Search integrations..."
              className="h-11 w-full rounded-xl border border-[#dfe3ef] bg-white/55 pl-10 pr-4 text-xs text-[#151a2b] outline-none transition placeholder:text-[#8791aa] focus:border-[#8c7dff] focus:bg-white focus:ring-4 focus:ring-[#7664ff]/10"
            />
          </label>
          <Button
            type="button"
            variant="outline"
            className="h-11 rounded-xl border-[#dfe3ef] bg-white/55 px-4 text-xs font-medium text-[#34405e] hover:bg-white hover:text-[#151a2b]"
          >
            <Filter className="mr-2 h-4 w-4" strokeWidth={1.8} />
            Filter
          </Button>
        </div>
      </div>

      {category === "all" && query.trim().length === 0 ? (
        <div className="mt-7">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-2 text-sm font-semibold text-[#151a2b]">
              <Sparkles className="h-4 w-4 text-[#5945ff]" strokeWidth={2} />
              Recommended for you
            </div>
            <button
              type="button"
              onClick={onToggleRecommended}
              className="flex items-center gap-2 text-xs font-medium text-[#526080] transition hover:text-[#5945ff]"
            >
              Select All Recommended
              <span
                className={cn(
                  "flex h-5 w-5 items-center justify-center rounded border",
                  allRecommendedConnected
                    ? "border-[#5945ff] bg-[#5945ff] text-white"
                    : "border-[#cfd4e4] bg-white text-transparent"
                )}
                aria-hidden
              >
                <Check className="h-3.5 w-3.5" strokeWidth={2.6} />
              </span>
            </button>
          </div>
          <div className="mt-4 grid gap-3 md:grid-cols-2 xl:grid-cols-5">
            {recommended.map((integration) => {
              const connected = connectedIntegrations.includes(integration.id);
              return (
                <article
                  key={integration.id}
                  className={cn(
                    "relative flex min-h-[190px] flex-col rounded-xl border p-4 transition",
                    connected
                      ? "border-[#cfc9ff] bg-[#fbfaff] shadow-[0_10px_20px_rgba(89,69,255,0.05)]"
                      : "border-[#e1e5ef] bg-white/45"
                  )}
                >
                  <button
                    type="button"
                    onClick={() => onToggle(integration.id)}
                    className={cn(
                      "absolute right-3 top-3 flex h-5 w-5 items-center justify-center rounded border transition hover:border-[#5945ff]",
                      connected
                        ? "border-[#5945ff] bg-[#5945ff] text-white"
                        : "border-[#cfd4e4] bg-white text-transparent"
                    )}
                    aria-label={`${connected ? "Deselect" : "Select"} ${integration.title}`}
                    aria-pressed={connected}
                  >
                    <Check className="h-3.5 w-3.5" strokeWidth={2.6} />
                  </button>
                  <IntegrationLogo integration={integration} />
                  <h3 className="mt-4 text-sm font-semibold text-[#151a2b]">{integration.title}</h3>
                  <p className="mt-2 text-xs leading-5 text-[#526080]">{integration.description}</p>
                  <button
                    type="button"
                    className="mt-auto flex h-8 items-center justify-center rounded-full border border-[#dcd7ff] bg-white/65 text-xs font-semibold text-[#5945ff] transition hover:bg-[#f8f6ff]"
                  >
                    Connect
                  </button>
                </article>
              );
            })}
          </div>
        </div>
      ) : null}

      <div className="mt-7">
        <div className="flex items-center justify-between gap-4">
          <h2 className="text-sm font-semibold text-[#151a2b]">
            {category === "all" && query.trim().length === 0 ? "All Integrations" : "Matching Integrations"}
          </h2>
          <span className="text-xs font-medium text-[#5945ff]">
            {filteredIntegrations.length} integration{filteredIntegrations.length === 1 ? "" : "s"}
          </span>
        </div>
        {filteredIntegrations.length > 0 ? (
          <div className="mt-4 grid gap-3 sm:grid-cols-2 xl:grid-cols-5">
            {filteredIntegrations.map((integration) => {
              return (
                <article
                  key={integration.id}
                  className="flex min-h-[84px] items-center gap-3 rounded-xl border border-[#e1e5ef] bg-white/45 p-3"
                >
                  <IntegrationLogo integration={integration} />
                  <div className="min-w-0 flex-1">
                    <h3 className="truncate text-xs font-semibold text-[#151a2b]">
                      {integration.title}
                    </h3>
                    <button
                      type="button"
                      className="mt-2 h-7 w-full rounded-full border border-[#dcd7ff] bg-white/65 px-3 text-[11px] font-semibold text-[#5945ff] transition hover:bg-[#f8f6ff]"
                    >
                      Connect
                    </button>
                  </div>
                </article>
              );
            })}
          </div>
        ) : (
          <div className="mt-4 rounded-xl border border-dashed border-[#dfe3ef] bg-white/35 px-5 py-8 text-center text-sm text-[#657091]">
            No integrations match your search.
          </div>
        )}
      </div>

      <div className="mt-auto grid gap-3 border-t border-[#e7e9f1] pt-7 sm:grid-cols-[1fr_auto_1fr] sm:items-center">
        <Button
          type="button"
          variant="outline"
          onClick={onBack}
          className="h-12 w-full rounded-xl border-[#dfe3ef] bg-white/55 px-6 text-sm font-medium text-[#34405e] hover:bg-white hover:text-[#151a2b] sm:w-fit"
        >
          <ArrowLeft className="mr-3 h-4 w-4" strokeWidth={1.8} />
          Back
        </Button>
        <CompactStepProgress currentStep={6} />
        <Button
          type="button"
          className="h-12 w-full rounded-xl bg-gradient-to-r from-[#5945ff] to-[#3724f7] px-8 text-sm font-medium text-white shadow-[0_10px_24px_rgba(89,69,255,0.22)] hover:from-[#4e3bf2] hover:to-[#2f1ee5] sm:ml-auto sm:w-fit"
        >
          Continue
          <ArrowRight className="ml-3 h-4 w-4" strokeWidth={1.8} />
        </Button>
      </div>
    </>
  );
}

export default function CreateWorkspacePage() {
  const router = useRouter();
  const [draft, setDraft] = useState<WorkspaceDraft>(DEFAULT_DRAFT);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    setDraft(loadWorkspaceDraft());
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    sessionStorage.setItem(WORKSPACE_DRAFT_KEY, JSON.stringify(draft));
  }, [draft, hydrated]);

  const updateDraft = (updates: Partial<WorkspaceDraft>) => {
    setDraft((current) => ({ ...current, ...updates }));
  };

  const showDetails = () => {
    updateDraft({ currentStep: 2 });
  };

  const showWorkspaceTypes = () => {
    updateDraft({ currentStep: 1 });
  };

  const showOperationsSetup = () => {
    updateDraft({ currentStep: 3 });
  };

  const showTreasurySetup = () => {
    updateDraft({ currentStep: 4 });
  };

  const showInviteTeam = () => {
    updateDraft({ currentStep: 5 });
  };

  const showIntegrationsSetup = () => {
    updateDraft({ currentStep: 6 });
  };

  const toggleOperationModule = (moduleId: string) => {
    setDraft((current) => ({
      ...current,
      operationModulesTouched: true,
      operationModules: current.operationModules.includes(moduleId)
        ? current.operationModules.filter((id) => id !== moduleId)
        : [...current.operationModules, moduleId],
    }));
  };

  const toggleSupportedChain = (chainId: string) => {
    setDraft((current) => ({
      ...current,
      supportedChains: current.supportedChains.includes(chainId)
        ? current.supportedChains.filter((id) => id !== chainId)
        : [...current.supportedChains, chainId],
    }));
  };

  const updateInviteMember = (memberId: string, updates: Partial<TeamInvite>) => {
    setDraft((current) => ({
      ...current,
      inviteMembers: current.inviteMembers.map((member) =>
        member.id === memberId ? { ...member, ...updates } : member
      ),
    }));
  };

  const addInviteMember = () => {
    setDraft((current) => ({
      ...current,
      inviteMembers: [
        ...current.inviteMembers,
        {
          id: `invite-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
          email: "",
          nickname: "",
          role: "",
          permission: "full-access",
        },
      ],
    }));
  };

  const removeInviteMember = (memberId: string) => {
    setDraft((current) => ({
      ...current,
      inviteMembers: current.inviteMembers.filter((member) => member.id !== memberId),
    }));
  };

  const toggleIntegration = (integrationId: string) => {
    setDraft((current) => ({
      ...current,
      integrations: (current.integrations ?? []).includes(integrationId)
        ? (current.integrations ?? []).filter((id) => id !== integrationId)
        : [...(current.integrations ?? []), integrationId],
    }));
  };

  const toggleRecommendedIntegrations = () => {
    const recommendedIds = INTEGRATIONS.filter((integration) => integration.recommended).map(
      (integration) => integration.id
    );
    setDraft((current) => {
      const currentIntegrations = current.integrations ?? [];
      const allRecommendedConnected = recommendedIds.every((id) => currentIntegrations.includes(id));
      return {
        ...current,
        integrations: allRecommendedConnected
          ? currentIntegrations.filter((id) => !recommendedIds.includes(id))
          : Array.from(new Set([...currentIntegrations, ...recommendedIds])),
      };
    });
  };

  return (
    <main className="min-h-screen bg-transparent px-4 py-5 sm:px-6 lg:px-8">
      <header className="mx-auto flex max-w-[1480px] items-center justify-between gap-5">
        <button
          type="button"
          onClick={() => router.push("/dashboard")}
          className="flex items-center gap-3 rounded-xl px-1 py-1 text-left"
          aria-label="Back to dashboard"
        >
          <HypertronLogoMark size={38} />
          <span className="text-lg font-semibold tracking-tight text-[#111729]">Hypertron</span>
        </button>
        <div className="flex items-center gap-3">
          <div className="hidden sm:block">
            <SetupProgress currentStep={draft.currentStep} />
          </div>
          <Button
            type="button"
            variant="outline"
            size="icon"
            onClick={() => router.push("/dashboard")}
            className="h-12 w-12 rounded-full border-white/90 bg-white/65 text-[#526080] shadow-[0_8px_30px_rgba(76,69,145,0.06)] hover:bg-white hover:text-[#252d47]"
            aria-label="Close workspace setup"
          >
            <X className="h-5 w-5" strokeWidth={1.8} />
          </Button>
        </div>
      </header>

      <div className="mx-auto mt-6 max-w-[1480px] sm:hidden">
        <SetupProgress currentStep={draft.currentStep} />
      </div>

      <div className="mx-auto mt-6 flex max-w-[1480px] flex-col gap-5 lg:h-[calc(100vh-7.75rem)] lg:min-h-[700px] lg:flex-row">
        <ProgressRail currentStep={draft.currentStep} />

        <section className="flex min-w-0 flex-1 flex-col rounded-3xl border border-white/80 bg-white/65 p-6 shadow-[0_18px_60px_rgba(101,101,156,0.08)] backdrop-blur-sm sm:p-8 lg:p-12">
          {draft.currentStep === 1 ? (
            <WorkspaceTypeStep
              draft={draft}
              onSelectType={(workspaceType) => updateDraft({ workspaceType })}
              onContinue={showDetails}
            />
          ) : draft.currentStep === 2 ? (
            <WorkspaceDetailsStep
              draft={draft}
              onUpdate={updateDraft}
              onBack={showWorkspaceTypes}
              onContinue={showOperationsSetup}
            />
          ) : draft.currentStep === 3 ? (
            <OperationsSetupStep
              draft={draft}
              onToggle={toggleOperationModule}
              onBack={showDetails}
              onContinue={showTreasurySetup}
            />
          ) : draft.currentStep === 4 ? (
            <TreasurySetupStep
              draft={draft}
              onSelectProvider={(walletProvider) => updateDraft({ walletProvider })}
              onToggleChain={toggleSupportedChain}
              onBack={showOperationsSetup}
              onContinue={showInviteTeam}
            />
          ) : draft.currentStep === 5 ? (
            <InviteTeamStep
              draft={draft}
              onUpdateMember={updateInviteMember}
              onAddMember={addInviteMember}
              onRemoveMember={removeInviteMember}
              onBack={showTreasurySetup}
              onContinue={showIntegrationsSetup}
            />
          ) : (
            <IntegrationsSetupStep
              draft={draft}
              onToggle={toggleIntegration}
              onToggleRecommended={toggleRecommendedIntegrations}
              onBack={showInviteTeam}
            />
          )}
        </section>
      </div>
    </main>
  );
}
