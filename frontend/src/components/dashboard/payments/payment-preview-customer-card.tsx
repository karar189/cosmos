"use client";

import { useEffect, useMemo, useState } from "react";
import {
  BadgeCheck,
  Calendar,
  Check,
  Clock,
  ChevronRight,
  Copy,
  ExternalLink,
  Info,
  Lock,
  QrCode,
  Share2,
  Shield,
  ShieldCheck,
  Wallet,
  Zap,
  Building2,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { fallbackBusiness } from "@/data/fallback";
import type { PaymentLinkPreviewData } from "@/components/dashboard/payments/payment-link-preview-utils";
import { formatPreviewDateTime } from "@/components/dashboard/payments/payment-link-preview-utils";
import { useDashboardTheme } from "@/components/dashboard/dashboard-theme-provider";
import { cn } from "@/utils";
import { useQRCode } from "next-qrcode";

const PAY_TABS = [
  { id: "wallet", label: "Wallet", icon: Wallet },
  { id: "qr", label: "QR Code", icon: QrCode },
  { id: "onramp", label: "On-Ramp", icon: Building2 },
] as const;

type PayTabId = (typeof PAY_TABS)[number]["id"];

const BRAND_FEATURES = [
  { icon: Zap, title: "Fast", desc: "Instant USDC transfer" },
  { icon: Shield, title: "Secure", desc: "On Stellar Network" },
  { icon: Lock, title: "Private", desc: "Opt-in privacy enabled" },
] as const;

const ON_RAMP_PARTNERS = [
  {
    id: "moneygram",
    name: "MoneyGram",
    desc: "Cash pickup · Bank transfer · Cards",
    badge: "Best rate",
    time: "1–5 min est. time",
    initial: "M",
    iconClass: "bg-red-600",
  },
  {
    id: "banxa",
    name: "Banxa",
    desc: "Credit / Debit Card · Apple Pay",
    badge: "Secure",
    time: "2–10 min est. time",
    initial: "B",
    iconClass: "bg-blue-600",
  },
  {
    id: "alchemy",
    name: "Alchemy Pay",
    desc: "Cards · Local methods",
    badge: "Low fees",
    time: "3–15 min est. time",
    initial: "A",
    iconClass: "bg-violet-600",
  },
] as const;

function splitPaymentDescription(description: string) {
  const prefix = "Payment for ";
  if (description.toLowerCase().startsWith(prefix.toLowerCase())) {
    return { label: "Payment for", subject: description.slice(prefix.length) };
  }
  return { label: "Payment for", subject: description };
}

function previewCheckoutStyles(dark: boolean) {
  return {
    shell: dark
      ? "bg-[#0c1222] shadow-[0_8px_30px_rgba(0,0,0,0.45)]"
      : "bg-white shadow-[0_8px_30px_rgba(15,23,42,0.08)]",
    checkout: dark ? "bg-[#0c1222] text-slate-100" : "bg-white text-slate-900",
    muted: dark ? "text-slate-400" : "text-slate-500",
    heading: dark ? "text-slate-50" : "text-slate-900",
    label: dark ? "text-slate-300" : "text-slate-700",
    usdBadge: dark
      ? "border-white/10 bg-white/5 text-slate-300"
      : "border-slate-200 bg-slate-50 text-slate-600",
    card: dark ? "border-white/10 bg-white/5" : "border-slate-200 bg-slate-50/90",
    cardSoft: dark ? "border-white/10 bg-white/5" : "border-slate-200 bg-slate-50/60",
    cardFlat: dark ? "border-white/10 bg-white/5" : "border-slate-200 bg-white",
    cardTitle: dark ? "text-slate-100" : "text-slate-900",
    cardMeta: dark ? "text-slate-400" : "text-slate-500",
    tabInactive: dark
      ? "border-white/10 bg-white/5 text-slate-400 hover:border-white/20 hover:text-slate-200"
      : "border-slate-200 bg-white text-slate-600 hover:border-slate-300",
    tabActiveWallet: dark
      ? "border-blue-500/60 bg-blue-500/15 text-blue-200 shadow-sm"
      : "border-blue-500 bg-blue-50 text-blue-700 shadow-sm",
    tabActiveOnramp: dark
      ? "border-violet-500/60 bg-violet-500/15 text-violet-200 shadow-sm"
      : "border-violet-500 bg-violet-50 text-violet-700 shadow-sm",
    divider: dark ? "bg-white/10" : "bg-slate-200",
    link: dark ? "text-blue-400 hover:text-blue-300" : "text-blue-600 hover:text-blue-700",
    select: dark
      ? "border-white/10 bg-white/5 text-slate-100"
      : "border-slate-200 bg-white text-slate-900",
    emeraldBadge: dark
      ? "border-emerald-500/30 bg-emerald-500/10 text-emerald-300 hover:bg-emerald-500/10"
      : "border-emerald-200 bg-emerald-50 text-emerald-700 hover:bg-emerald-50",
    footerBorder: dark ? "border-white/10" : "border-slate-100",
    footerText: dark ? "text-slate-400" : "text-slate-500",
    footerIcon: dark ? "text-slate-500" : "text-slate-400",
    outlineBtn: dark
      ? "border-white/10 bg-white/5 text-violet-300 hover:bg-white/10"
      : "border-slate-200 text-violet-700 hover:bg-violet-50",
    stepNum: dark ? "bg-violet-500/20 text-violet-200" : "bg-violet-100 text-violet-700",
    stepText: dark ? "text-slate-400" : "text-slate-600",
    stepChevron: dark ? "text-slate-600" : "text-slate-300",
    vaultName: dark ? "text-slate-200" : "text-slate-700",
  };
}

type PreviewCheckoutStyles = ReturnType<typeof previewCheckoutStyles>;

type CustomerPreviewCardProps = {
  preview: PaymentLinkPreviewData;
  businessName: string;
  linkId: string;
  usdApprox: string;
  expiresAt: Date | null;
  className?: string;
};

export function PaymentPreviewCustomerCard({
  preview,
  businessName,
  linkId,
  usdApprox,
  expiresAt,
  className,
}: CustomerPreviewCardProps) {
  const { theme } = useDashboardTheme();
  const dark = theme === "dark";
  const s = previewCheckoutStyles(dark);
  const [activePayTab, setActivePayTab] = useState<PayTabId>("wallet");
  const [privateEnabled, setPrivateEnabled] = useState(preview.privateSettlement);
  const [payPageUrl, setPayPageUrl] = useState("");
  const [copied, setCopied] = useState<"address" | "qr" | null>(null);

  const enabledTabs = PAY_TABS.filter((tab) => preview.methods.includes(tab.id));
  const tabs = enabledTabs.length ? enabledTabs : PAY_TABS;
  const paymentDesc = useMemo(() => splitPaymentDescription(preview.description), [preview.description]);
  const vaultName = useMemo(() => {
    const base = businessName.trim() || "Hypertron";
    return base.endsWith("Vault") ? base : `${base} Vault`;
  }, [businessName]);
  const receiveAddress = fallbackBusiness.receiveAddress?.trim() || fallbackBusiness.walletAddress;

  useEffect(() => {
    setPrivateEnabled(preview.privateSettlement);
  }, [preview.privateSettlement]);

  useEffect(() => {
    if (typeof window === "undefined") return;
    setPayPageUrl(preview.linkUrl ?? `${window.location.origin}/pay/${linkId}`);
  }, [preview.linkUrl, linkId]);

  async function copyText(text: string, kind: "address" | "qr") {
    await navigator.clipboard.writeText(text);
    setCopied(kind);
    setTimeout(() => setCopied(null), 1800);
  }

  return (
    <div
      className={cn(
        "payment-customer-preview flex h-full min-h-[620px] flex-col overflow-hidden rounded-2xl border-0",
        s.shell,
        className
      )}
    >
      <div className="grid min-h-0 flex-1 grid-cols-1 lg:grid-cols-[280px_minmax(0,1fr)]">
        {/* Brand panel — shared dark style for all payment methods */}
        <div className="payment-preview-brand relative flex h-full min-h-[320px] flex-col justify-between overflow-hidden bg-gradient-to-b from-[#1e1b4b] via-[#1e3a8a] to-[#172554] p-6 lg:min-h-0">
          <div
            className="pointer-events-none absolute inset-0 opacity-40"
            aria-hidden
            style={{
              backgroundImage:
                "radial-gradient(circle at 20% 90%, rgba(96,165,250,0.2) 0%, transparent 50%), radial-gradient(circle at 80% 10%, rgba(129,140,248,0.15) 0%, transparent 45%)",
            }}
          />

          <div className="relative space-y-4">
            <div className="flex items-center gap-2.5">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-white shadow-sm">
                <span className="payment-preview-brand-logo-letter text-sm font-bold">
                  {businessName.charAt(0).toUpperCase()}
                </span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="text-sm font-semibold text-white">{businessName}</span>
                <BadgeCheck className="h-4 w-4 shrink-0 text-sky-200" />
              </div>
            </div>
            <div>
              <p className="payment-preview-brand-muted text-sm text-white/80">{paymentDesc.label}</p>
              <p className="mt-0.5 text-lg font-semibold leading-snug text-white">{paymentDesc.subject}</p>
            </div>
            <ul className="space-y-3">
              {BRAND_FEATURES.map(({ icon: Icon, title, desc }) => (
                <li key={title} className="flex items-start gap-3">
                  <Icon className="mt-0.5 h-4 w-4 shrink-0 text-sky-200" />
                  <div>
                    <p className="text-sm font-semibold text-white">{title}</p>
                    <p className="payment-preview-brand-muted text-xs text-white/80">{desc}</p>
                  </div>
                </li>
              ))}
            </ul>
          </div>
          <div className="payment-preview-brand-muted relative mt-4 flex items-center gap-2 text-xs text-white/80">
            <Shield className="h-3.5 w-3.5 shrink-0 text-sky-200" />
            Secured by Hypertron
          </div>
        </div>

        {/* Checkout panel */}
        <div className={cn("payment-preview-checkout flex h-full min-h-0 flex-col overflow-hidden p-6 sm:p-7", s.checkout)}>
          <AmountHeader amount={preview.amount} usdApprox={usdApprox} styles={s} />

          <PayWithTabs tabs={tabs} activePayTab={activePayTab} onChange={setActivePayTab} styles={s} />

          <div className="mt-4 flex min-h-0 flex-1 flex-col overflow-hidden">
            {activePayTab === "wallet" ? (
              <WalletCheckoutBody styles={s} />
            ) : activePayTab === "qr" ? (
              <QrCheckoutBody
                styles={s}
                privateEnabled={privateEnabled}
                onPrivateChange={setPrivateEnabled}
                payPageUrl={payPageUrl}
                receiveAddress={receiveAddress}
                copied={copied}
                onCopyAddress={() => void copyText(receiveAddress, "address")}
                onShareQr={() => void copyText(payPageUrl, "qr")}
                expiresAt={expiresAt}
              />
            ) : (
              <OnRampCheckoutBody vaultName={vaultName} styles={s} />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function AmountHeader({
  amount,
  usdApprox,
  styles: s,
}: {
  amount: string;
  usdApprox: string;
  styles: PreviewCheckoutStyles;
}) {
  return (
    <div className="shrink-0">
      <p className={cn("text-sm", s.muted)}>Amount to pay</p>
      <p className={cn("mt-0.5 text-2xl font-semibold leading-tight tracking-tight", s.heading)}>
        {amount} <span className={cn("text-lg font-medium", s.muted)}>USDC</span>
      </p>
      <span className={cn("mt-1.5 inline-flex rounded-full border px-2.5 py-0.5 text-xs", s.usdBadge)}>
        ≈ ${usdApprox} USD
      </span>
    </div>
  );
}

function PayWithTabs({
  tabs,
  activePayTab,
  onChange,
  styles: s,
}: {
  tabs: ReadonlyArray<(typeof PAY_TABS)[number]>;
  activePayTab: PayTabId;
  onChange: (tab: PayTabId) => void;
  styles: PreviewCheckoutStyles;
}) {
  return (
    <div className="mt-1 shrink-0 space-y-2.5">
      <p className={cn("text-sm font-medium", s.label)}>Pay with</p>
      <div className="flex flex-wrap gap-2">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const active = activePayTab === tab.id;
          const activeCls =
            tab.id === "onramp" ? s.tabActiveOnramp : s.tabActiveWallet;
          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => onChange(tab.id)}
              className={cn(
                "inline-flex items-center gap-2 rounded-lg border px-3 py-2 text-sm font-medium transition-colors",
                active ? activeCls : s.tabInactive
              )}
            >
              <Icon className="h-4 w-4" />
              {tab.label}
            </button>
          );
        })}
      </div>
    </div>
  );
}

function WalletCheckoutBody({ styles: s }: { styles: PreviewCheckoutStyles }) {
  return (
    <div className="flex min-h-0 flex-1 flex-col overflow-hidden">
      <div className={cn("mt-3 flex items-center justify-between gap-3 rounded-xl border px-3.5 py-3", s.card)}>
        <div className="flex min-w-0 items-center gap-3">
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-blue-600 text-xs font-bold text-white">
            S
          </div>
          <div className="min-w-0">
            <p className={cn("truncate text-sm font-medium", s.cardTitle)}>USDC on Stellar</p>
            <p className={cn("text-xs", s.cardMeta)}>Recommended network</p>
          </div>
        </div>
        <Badge className={cn("shrink-0 text-[11px]", s.emeraldBadge)}>
          Fast &amp; low fees
        </Badge>
      </div>

      <Button type="button" className="mt-3 h-10 w-full gap-2 bg-blue-600 text-white hover:bg-blue-500">
        <Wallet className="h-4 w-4" />
        Pay with Stellar Wallet
      </Button>

      <button type="button" className={cn("mt-2 inline-flex items-center gap-1.5 text-sm", s.link)}>
        Don&apos;t have a wallet? Create one instantly
        <ExternalLink className="h-3.5 w-3.5" />
      </button>

      <div className="my-3 flex items-center gap-3">
        <div className={cn("h-px flex-1", s.divider)} />
        <span className={cn("text-xs", s.footerText)}>or</span>
        <div className={cn("h-px flex-1", s.divider)} />
      </div>

      <Select defaultValue="other">
        <SelectTrigger className={cn("h-10", s.select)}>
          <SelectValue placeholder="Pay with another wallet" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="other">Pay with another wallet</SelectItem>
          <SelectItem value="freighter">Freighter</SelectItem>
          <SelectItem value="xbull">xBull</SelectItem>
        </SelectContent>
      </Select>

      <CheckoutTrustFooter styles={s} />
    </div>
  );
}

function QrCheckoutBody({
  styles: s,
  privateEnabled,
  onPrivateChange,
  payPageUrl,
  copied,
  onCopyAddress,
  onShareQr,
  expiresAt,
}: {
  styles: PreviewCheckoutStyles;
  privateEnabled: boolean;
  onPrivateChange: (v: boolean) => void;
  payPageUrl: string;
  receiveAddress: string;
  copied: "address" | "qr" | null;
  onCopyAddress: () => void;
  onShareQr: () => void;
  expiresAt: Date | null;
}) {
  const { Canvas: QRCanvas } = useQRCode();
  const qrSize = 132;

  return (
    <div className="flex min-h-0 flex-1 flex-col overflow-hidden">
      <div className={cn("mt-1 flex shrink-0 items-start justify-between gap-3 rounded-xl border px-3.5 py-2.5", s.cardSoft)}>
        <div className="min-w-0">
          <div className="flex items-center gap-1.5">
            <p className={cn("text-sm font-medium", s.cardTitle)}>Private settlement (opt-in)</p>
            <Info className={cn("h-3.5 w-3.5", s.footerIcon)} />
          </div>
          <p className={cn("mt-0.5 text-[11px]", s.cardMeta)}>
            Settle this payment privately with on-chain proof.
          </p>
        </div>
        <Switch
          checked={privateEnabled}
          onCheckedChange={onPrivateChange}
          className="shrink-0 data-[state=checked]:bg-blue-600"
        />
      </div>

      <div className="mt-3 min-h-0 flex-1 overflow-hidden">
        <h3 className={cn("text-sm font-semibold", s.cardTitle)}>Scan with any wallet</h3>
        <p className={cn("mt-0.5 text-xs", s.cardMeta)}>
          Use your wallet app to scan the QR code and complete the payment.
        </p>

        <div className="mt-3 flex flex-col gap-3 sm:flex-row sm:items-start">
          <div className="flex shrink-0 justify-center sm:justify-start">
            <div className="payment-preview-qr-surface relative rounded-xl border border-slate-200 bg-white p-2.5 shadow-sm">
              {payPageUrl ? (
                <>
                  <QRCanvas
                    text={payPageUrl}
                    options={{ errorCorrectionLevel: "H", width: qrSize, margin: 1 }}
                  />
                  <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
                    <div className="flex h-8 w-8 items-center justify-center rounded-full border-[3px] border-white bg-violet-600 text-[10px] font-bold text-white">
                      S
                    </div>
                  </div>
                </>
              ) : (
                <div
                  className="flex items-center justify-center bg-slate-100 text-xs text-slate-500"
                  style={{ width: qrSize, height: qrSize }}
                >
                  Loading…
                </div>
              )}
            </div>
          </div>

          <div className="flex min-w-0 flex-1 flex-col gap-2.5">
            <div className={cn("flex items-center justify-between gap-2 rounded-lg border px-3 py-2", s.cardFlat)}>
              <div className="flex min-w-0 items-center gap-2">
                <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-blue-600 text-[9px] font-bold text-white">
                  $
                </div>
                <p className={cn("truncate text-xs font-medium", s.cardTitle)}>USDC on Stellar</p>
              </div>
              <Badge className={cn("gap-0.5 px-1.5 text-[10px]", s.emeraldBadge)}>
                <Check className="h-2.5 w-2.5" />
                Verified
              </Badge>
            </div>

            <div className="grid grid-cols-3 gap-1.5">
              <Button
                type="button"
                variant="outline"
                size="sm"
                className={cn("h-8 gap-1 px-2 text-[11px]", s.outlineBtn)}
                onClick={onCopyAddress}
              >
                <Copy className="h-3 w-3" />
                {copied === "address" ? "Copied" : "Copy"}
              </Button>
              <Button
                type="button"
                variant="outline"
                size="sm"
                className={cn("h-8 gap-1 px-2 text-[11px]", s.outlineBtn)}
              >
                <Wallet className="h-3 w-3" />
                Open
              </Button>
              <Button
                type="button"
                variant="outline"
                size="sm"
                className={cn("h-8 gap-1 px-2 text-[11px]", s.outlineBtn)}
                onClick={onShareQr}
              >
                <Share2 className="h-3 w-3" />
                Share
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className={cn("mt-auto flex shrink-0 items-center justify-between gap-3 border-t pt-3 text-[11px]", s.footerBorder, s.footerText)}>
        <span className="inline-flex min-w-0 items-center gap-1.5">
          <Clock className={cn("h-3 w-3 shrink-0", s.footerIcon)} />
          <span className="truncate">
            {expiresAt
              ? `Expires ${formatPreviewDateTime(expiresAt)}`
              : "Link does not expire"}
          </span>
        </span>
        <Calendar className={cn("h-3.5 w-3.5 shrink-0", s.footerIcon)} />
      </div>
    </div>
  );
}

function OnRampCheckoutBody({
  vaultName,
  styles: s,
}: {
  vaultName: string;
  styles: PreviewCheckoutStyles;
}) {
  const steps = [
    "Choose on-ramp partner",
    "Complete fiat payment",
    `USDC delivered to ${vaultName}`,
  ] as const;

  return (
    <div className="flex min-h-0 flex-1 flex-col overflow-hidden">
      <div className="mt-1 shrink-0">
        <h3 className={cn("text-sm font-semibold", s.cardTitle)}>Buy USDC with fiat</h3>
        <p className={cn("mt-0.5 text-xs", s.cardMeta)}>
          Pay via a partner — USDC is delivered to{" "}
          <span className={cn("font-medium", s.vaultName)}>{vaultName}</span>.
        </p>
      </div>

      <ul className="mt-2.5 min-h-0 flex-1 space-y-2 overflow-y-auto pr-0.5">
        {ON_RAMP_PARTNERS.map((partner) => (
          <li
            key={partner.id}
            className={cn("flex items-center gap-2.5 rounded-lg border px-3 py-2.5", s.cardFlat)}
          >
            <div
              className={cn(
                "flex h-8 w-8 shrink-0 items-center justify-center rounded-md text-xs font-bold text-white",
                partner.iconClass
              )}
            >
              {partner.initial}
            </div>
            <div className="min-w-0 flex-1">
              <div className="flex flex-wrap items-center gap-x-2 gap-y-0.5">
                <p className={cn("text-xs font-semibold", s.cardTitle)}>{partner.name}</p>
                <Badge className={cn("px-1.5 py-0 text-[9px]", s.emeraldBadge)}>
                  {partner.badge}
                </Badge>
              </div>
              <p className={cn("truncate text-[10px]", s.cardMeta)}>{partner.desc}</p>
              <p className={cn("text-[10px]", s.footerText)}>{partner.time}</p>
            </div>
            <Button
              type="button"
              size="sm"
              className="h-8 shrink-0 bg-violet-600 px-3 text-xs text-white hover:bg-violet-500"
            >
              Continue
            </Button>
          </li>
        ))}
      </ul>

      <div className={cn("mt-2 shrink-0 border-t pt-2.5", s.footerBorder)}>
        <p className={cn("text-[11px] font-semibold", s.cardTitle)}>How it works</p>
        <div className="mt-1.5 flex items-start gap-1">
          {steps.map((step, i) => (
            <div key={step} className="flex min-w-0 flex-1 items-start gap-1">
              <span className={cn("flex h-5 w-5 shrink-0 items-center justify-center rounded-full text-[10px] font-semibold", s.stepNum)}>
                {i + 1}
              </span>
              <p className={cn("text-[10px] leading-tight", s.stepText)}>{step}</p>
              {i < steps.length - 1 ? (
                <ChevronRight className={cn("mx-0.5 mt-0.5 hidden h-3 w-3 shrink-0 lg:block", s.stepChevron)} />
              ) : null}
            </div>
          ))}
        </div>
      </div>

      <CheckoutTrustFooter styles={s} />
    </div>
  );
}

function CheckoutTrustFooter({ styles: s }: { styles: PreviewCheckoutStyles }) {
  return (
    <div className={cn("mt-auto flex shrink-0 flex-wrap gap-x-3 gap-y-1 border-t pt-3 text-[10px]", s.footerBorder, s.footerText)}>
      <span className="inline-flex items-center gap-1.5">
        <ShieldCheck className={cn("h-3.5 w-3.5", s.footerIcon)} />
        Private &amp; secure payments
      </span>
      <span className="inline-flex items-center gap-1.5">
        <Shield className={cn("h-3.5 w-3.5", s.footerIcon)} />
        Opt-in privacy available
      </span>
      <span className="inline-flex items-center gap-1.5">
        <Check className={cn("h-3.5 w-3.5", s.footerIcon)} />
        Proof of payment
      </span>
    </div>
  );
}
