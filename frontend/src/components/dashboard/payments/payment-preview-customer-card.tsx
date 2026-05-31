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

type CustomerPreviewCardProps = {
  preview: PaymentLinkPreviewData;
  businessName: string;
  linkId: string;
  usdApprox: string;
  expiresAt: Date | null;
};

export function PaymentPreviewCustomerCard({
  preview,
  businessName,
  linkId,
  usdApprox,
  expiresAt,
}: CustomerPreviewCardProps) {
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

  const isQr = activePayTab === "qr";

  return (
    <div className="payment-customer-preview overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-[0_8px_30px_rgba(15,23,42,0.08)] dark:border-white/10">
      <div className="grid grid-cols-1 lg:grid-cols-[280px_minmax(0,1fr)] lg:min-h-[680px]">
        {/* Brand panel */}
        <div
          className={cn(
            "payment-preview-brand relative flex min-h-[360px] flex-col justify-between overflow-hidden p-8 lg:min-h-full",
            isQr
              ? "bg-gradient-to-b from-[#1e1b4b] via-[#1e3a8a] to-[#172554]"
              : "bg-gradient-to-b from-[#4c1d95] via-[#5b21b6] to-[#2563eb]"
          )}
        >
          <div
            className="pointer-events-none absolute inset-0 opacity-40"
            aria-hidden
            style={{
              backgroundImage: isQr
                ? "radial-gradient(circle at 20% 90%, rgba(96,165,250,0.2) 0%, transparent 50%), radial-gradient(circle at 80% 10%, rgba(129,140,248,0.15) 0%, transparent 45%)"
                : "radial-gradient(circle at 15% 85%, rgba(255,255,255,0.18) 0%, transparent 45%), radial-gradient(circle at 85% 15%, rgba(147,197,253,0.25) 0%, transparent 40%)",
            }}
          />

          {isQr ? (
            <>
              <div className="relative space-y-6">
                <div className="flex items-center gap-2.5">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white shadow-sm">
                    <span className="payment-preview-brand-logo-letter text-sm font-bold">
                      {businessName.charAt(0).toUpperCase()}
                    </span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className="text-sm font-semibold">{businessName}</span>
                    <BadgeCheck className="h-4 w-4 shrink-0 text-sky-200" />
                  </div>
                </div>
                <div>
                  <p className="payment-preview-brand-muted text-sm">{paymentDesc.label}</p>
                  <p className="mt-1 text-xl font-semibold leading-snug sm:text-2xl">
                    {paymentDesc.subject}
                  </p>
                </div>
                <ul className="space-y-4">
                  {BRAND_FEATURES.map(({ icon: Icon, title, desc }) => (
                    <li key={title} className="flex items-start gap-3">
                      <Icon className="mt-0.5 h-4 w-4 shrink-0 text-sky-200" />
                      <div>
                        <p className="text-sm font-semibold">{title}</p>
                        <p className="payment-preview-brand-muted text-xs">{desc}</p>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
              <div className="payment-preview-brand-muted relative mt-8 flex items-center gap-2 text-xs lg:mt-0">
                <Shield className="h-3.5 w-3.5 shrink-0" />
                Secured by Hypertron
              </div>
            </>
          ) : (
            <>
              <div className="relative space-y-5">
                <div className="flex items-center gap-2.5">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white shadow-sm">
                    <span className="payment-preview-brand-logo-letter text-sm font-bold">
                      {businessName.charAt(0).toUpperCase()}
                    </span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className="text-sm font-semibold">{businessName}</span>
                    <BadgeCheck className="h-4 w-4 shrink-0 text-sky-200" />
                  </div>
                </div>
                <p className="text-lg font-semibold leading-snug sm:text-xl">{preview.description}</p>
              </div>
              <div className="relative mt-10 space-y-3 lg:mt-0">
                <p className="payment-preview-brand-muted text-sm leading-relaxed">
                  Thank you for your business. Please complete your payment securely.
                </p>
                <div className="payment-preview-brand-muted flex items-center gap-2 text-xs">
                  <Shield className="h-3.5 w-3.5 shrink-0" />
                  Secured by Hypertron
                </div>
              </div>
            </>
          )}
        </div>

        {/* Checkout panel */}
        <div className="payment-preview-checkout flex min-h-[560px] flex-col p-8 sm:p-9 lg:min-h-full">
          <AmountHeader amount={preview.amount} usdApprox={usdApprox} />

          <PayWithTabs tabs={tabs} activePayTab={activePayTab} onChange={setActivePayTab} />

          {activePayTab === "wallet" ? (
            <WalletCheckoutBody />
          ) : activePayTab === "qr" ? (
            <QrCheckoutBody
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
            <OnRampCheckoutBody vaultName={vaultName} />
          )}
        </div>
      </div>
    </div>
  );
}

function AmountHeader({ amount, usdApprox }: { amount: string; usdApprox: string }) {
  return (
    <div>
      <p className="text-sm text-slate-500">Amount to pay</p>
      <p className="mt-1 text-[1.75rem] font-semibold leading-tight tracking-tight text-slate-900 sm:text-3xl">
        {amount} <span className="text-xl font-medium text-slate-500">USDC</span>
      </p>
      <span className="mt-2 inline-flex rounded-full border border-slate-200 bg-slate-50 px-2.5 py-0.5 text-xs text-slate-600">
        ≈ ${usdApprox} USD
      </span>
    </div>
  );
}

function PayWithTabs({
  tabs,
  activePayTab,
  onChange,
}: {
  tabs: ReadonlyArray<(typeof PAY_TABS)[number]>;
  activePayTab: PayTabId;
  onChange: (tab: PayTabId) => void;
}) {
  return (
    <div className="mt-6 space-y-3">
      <p className="text-sm font-medium text-slate-700">Pay with</p>
      <div className="flex flex-wrap gap-2">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const active = activePayTab === tab.id;
          const activeCls =
            tab.id === "onramp"
              ? "border-violet-500 bg-violet-50 text-violet-700 shadow-sm"
              : "border-blue-500 bg-blue-50 text-blue-700 shadow-sm";
          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => onChange(tab.id)}
              className={cn(
                "inline-flex items-center gap-2 rounded-lg border px-3 py-2 text-sm font-medium transition-colors",
                active
                  ? activeCls
                  : "border-slate-200 bg-white text-slate-600 hover:border-slate-300"
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

function WalletCheckoutBody() {
  return (
    <>
      <div className="mt-5 flex items-center justify-between gap-3 rounded-xl border border-slate-200 bg-slate-50/90 px-4 py-3.5">
        <div className="flex min-w-0 items-center gap-3">
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-blue-600 text-xs font-bold text-white">
            S
          </div>
          <div className="min-w-0">
            <p className="truncate text-sm font-medium text-slate-900">USDC on Stellar</p>
            <p className="text-xs text-slate-500">Recommended network</p>
          </div>
        </div>
        <Badge className="shrink-0 border-emerald-200 bg-emerald-50 text-[11px] text-emerald-700 hover:bg-emerald-50">
          Fast &amp; low fees
        </Badge>
      </div>

      <Button type="button" className="mt-5 h-12 w-full gap-2 bg-blue-600 text-white hover:bg-blue-500">
        <Wallet className="h-4 w-4" />
        Pay with Stellar Wallet
      </Button>

      <button
        type="button"
        className="mt-2.5 inline-flex items-center gap-1.5 text-sm text-blue-600 hover:text-blue-700"
      >
        Don&apos;t have a wallet? Create one instantly
        <ExternalLink className="h-3.5 w-3.5" />
      </button>

      <div className="my-5 flex items-center gap-3">
        <div className="h-px flex-1 bg-slate-200" />
        <span className="text-xs text-slate-400">or</span>
        <div className="h-px flex-1 bg-slate-200" />
      </div>

      <Select defaultValue="other">
        <SelectTrigger className="h-10 border-slate-200 bg-white text-slate-900">
          <SelectValue placeholder="Pay with another wallet" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="other">Pay with another wallet</SelectItem>
          <SelectItem value="freighter">Freighter</SelectItem>
          <SelectItem value="xbull">xBull</SelectItem>
        </SelectContent>
      </Select>

      <CheckoutTrustFooter />
    </>
  );
}

function QrCheckoutBody({
  privateEnabled,
  onPrivateChange,
  payPageUrl,
  receiveAddress,
  copied,
  onCopyAddress,
  onShareQr,
  expiresAt,
}: {
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

  return (
    <>
      <div className="mt-5 flex items-start justify-between gap-4 rounded-xl border border-slate-200 bg-slate-50/60 px-4 py-3.5">
        <div className="min-w-0">
          <div className="flex items-center gap-1.5">
            <p className="text-sm font-medium text-slate-900">Private settlement (opt-in)</p>
            <Info className="h-3.5 w-3.5 text-slate-400" />
          </div>
          <p className="mt-0.5 text-xs text-slate-500">
            Settle this payment privately with on-chain proof.
          </p>
        </div>
        <Switch
          checked={privateEnabled}
          onCheckedChange={onPrivateChange}
          className="shrink-0 data-[state=checked]:bg-blue-600"
        />
      </div>

      <div className="mt-6 flex flex-1 flex-col">
        <h3 className="text-base font-semibold text-slate-900">Scan with any wallet</h3>
        <p className="mt-1 text-sm text-slate-500">
          Use your wallet app to scan the QR code and complete the payment.
        </p>

        <div className="mt-5 flex justify-center">
          <div className="relative rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            {payPageUrl ? (
              <>
                <QRCanvas
                  text={payPageUrl}
                  options={{ errorCorrectionLevel: "H", width: 200, margin: 1 }}
                />
                <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
                  <div className="flex h-11 w-11 items-center justify-center rounded-full border-4 border-white bg-violet-600 text-sm font-bold text-white shadow-sm">
                    S
                  </div>
                </div>
              </>
            ) : (
              <div className="flex h-[200px] w-[200px] items-center justify-center bg-slate-50 text-xs text-slate-400">
                Loading QR…
              </div>
            )}
          </div>
        </div>

        <div className="mt-5 flex items-center justify-between gap-3 rounded-xl border border-slate-200 bg-white px-4 py-3">
          <div className="flex min-w-0 items-center gap-3">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-blue-600 text-[10px] font-bold text-white">
              $
            </div>
            <p className="text-sm font-medium text-slate-900">USDC on Stellar</p>
          </div>
          <Badge className="gap-1 border-emerald-200 bg-emerald-50 text-emerald-700 hover:bg-emerald-50">
            <Check className="h-3 w-3" />
            Verified
          </Badge>
        </div>

        <div className="my-5 flex items-center gap-3">
          <div className="h-px flex-1 bg-slate-200" />
          <span className="text-xs text-slate-400">or</span>
          <div className="h-px flex-1 bg-slate-200" />
        </div>

        <div className="grid grid-cols-1 gap-2 sm:grid-cols-3">
          <Button
            type="button"
            variant="outline"
            className="h-10 gap-2 border-slate-200 text-violet-700 hover:bg-violet-50"
            onClick={onCopyAddress}
          >
            <Copy className="h-4 w-4" />
            {copied === "address" ? "Copied" : "Copy Address"}
          </Button>
          <Button
            type="button"
            variant="outline"
            className="h-10 gap-2 border-slate-200 text-violet-700 hover:bg-violet-50"
          >
            <Wallet className="h-4 w-4" />
            Open in Wallet
          </Button>
          <Button
            type="button"
            variant="outline"
            className="h-10 gap-2 border-slate-200 text-violet-700 hover:bg-violet-50"
            onClick={onShareQr}
          >
            <Share2 className="h-4 w-4" />
            {copied === "qr" ? "Copied" : "Share QR"}
          </Button>
        </div>
      </div>

      <div className="mt-auto flex items-center justify-between gap-3 border-t border-slate-100 pt-5 text-xs text-slate-500">
        <span className="inline-flex items-center gap-1.5">
          <Clock className="h-3.5 w-3.5 shrink-0 text-slate-400" />
          {expiresAt
            ? `Link expires on ${formatPreviewDateTime(expiresAt)}`
            : "Link does not expire"}
        </span>
        <Calendar className="h-4 w-4 shrink-0 text-slate-400" />
      </div>
    </>
  );
}

function OnRampCheckoutBody({ vaultName }: { vaultName: string }) {
  const steps = [
    "Choose on-ramp partner",
    "Complete fiat payment",
    `USDC delivered to ${vaultName}`,
  ] as const;

  return (
    <>
      <div className="mt-5 flex flex-1 flex-col">
        <h3 className="text-base font-semibold text-slate-900">Buy USDC with fiat</h3>
        <p className="mt-1 text-sm text-slate-500">
          Choose your preferred on-ramp partner to pay and we&apos;ll deliver USDC to{" "}
          <span className="font-medium text-slate-700">{vaultName}</span>.
        </p>

        <ul className="mt-5 space-y-3">
          {ON_RAMP_PARTNERS.map((partner) => (
            <li
              key={partner.id}
              className="flex flex-col gap-3 rounded-xl border border-slate-200 bg-white p-4 sm:flex-row sm:items-center sm:justify-between"
            >
              <div className="flex min-w-0 flex-1 items-start gap-3">
                <div
                  className={cn(
                    "flex h-10 w-10 shrink-0 items-center justify-center rounded-lg text-sm font-bold text-white",
                    partner.iconClass
                  )}
                >
                  {partner.initial}
                </div>
                <div className="min-w-0">
                  <p className="text-sm font-semibold text-slate-900">{partner.name}</p>
                  <p className="text-xs text-slate-500">{partner.desc}</p>
                  <div className="mt-2 flex flex-wrap items-center gap-2">
                    <Badge className="border-emerald-200 bg-emerald-50 text-[10px] text-emerald-700 hover:bg-emerald-50">
                      {partner.badge}
                    </Badge>
                    <span className="text-[11px] text-slate-400">{partner.time}</span>
                  </div>
                </div>
              </div>
              <Button
                type="button"
                className="h-9 shrink-0 bg-violet-600 px-5 text-white hover:bg-violet-500 sm:ml-2"
              >
                Continue
              </Button>
            </li>
          ))}
        </ul>

        <div className="mt-8">
          <p className="text-sm font-semibold text-slate-900">How it works</p>
          <div className="mt-4 flex flex-col gap-4 sm:flex-row sm:items-start">
            {steps.map((step, i) => (
              <div key={step} className="flex min-w-0 flex-1 items-center gap-2">
                <div className="flex min-w-0 flex-1 items-start gap-2.5">
                  <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-violet-100 text-xs font-semibold text-violet-700">
                    {i + 1}
                  </span>
                  <p className="pt-0.5 text-xs leading-snug text-slate-600">{step}</p>
                </div>
                {i < steps.length - 1 ? (
                  <ChevronRight className="hidden h-4 w-4 shrink-0 text-slate-300 sm:block" />
                ) : null}
              </div>
            ))}
          </div>
        </div>
      </div>

      <CheckoutTrustFooter />
    </>
  );
}

function CheckoutTrustFooter() {
  return (
    <div className="mt-auto flex flex-wrap gap-x-4 gap-y-2 border-t border-slate-100 pt-6 text-[11px] text-slate-500">
      <span className="inline-flex items-center gap-1.5">
        <ShieldCheck className="h-3.5 w-3.5 text-slate-400" />
        Private &amp; secure payments
      </span>
      <span className="inline-flex items-center gap-1.5">
        <Shield className="h-3.5 w-3.5 text-slate-400" />
        Opt-in privacy available
      </span>
      <span className="inline-flex items-center gap-1.5">
        <Check className="h-3.5 w-3.5 text-slate-400" />
        Proof of payment
      </span>
    </div>
  );
}
