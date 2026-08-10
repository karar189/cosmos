"use client";

import { useState } from "react";
import {
  BadgeCheck,
  Calendar,
  Check,
  CheckCircle2,
  ChevronRight,
  Clock,
  Copy,
  Info,
  Loader2,
  Lock,
  Share2,
  Shield,
  ShieldCheck,
  Wallet,
  Zap,
} from "lucide-react";
import { useQRCode } from "next-qrcode";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { formatPreviewDateTime } from "@/components/dashboard/payments/payment-link-preview-utils";
import { PaymentBrandAvatar } from "@/components/global/hub-avatar";
import type { PaymentAssetCode } from "@/lib/stellar-assets";
import { cn } from "@/utils";

export const PAY_CHECKOUT_TABS = [
  { id: "wallet" as const, label: "Wallet", icon: null },
  { id: "qr" as const, label: "QR Code", icon: null },
  { id: "onramp" as const, label: "On-Ramp", icon: null },
];

export type PayCheckoutTabId = "wallet" | "qr" | "onramp";

export const BRAND_FEATURES = [
  { icon: Zap, title: "Fast", desc: "Instant USDC transfer" },
  { icon: Shield, title: "Secure", desc: "On Stellar Network" },
  { icon: Lock, title: "Private", desc: "Opt-in privacy enabled" },
] as const;

export function splitPaymentDescription(description: string) {
  const trimmed = description.trim();
  if (!trimmed) return { label: "Payment for", subject: "Your order" };
  const prefix = "Payment for ";
  if (trimmed.toLowerCase().startsWith(prefix.toLowerCase())) {
    return { label: "Payment for", subject: trimmed.slice(prefix.length) };
  }
  return { label: "Payment for", subject: trimmed };
}

/** Light checkout panel styles (public pay page + preview). */
export function payCheckoutStyles() {
  return {
    shell: "bg-white shadow-[0_8px_30px_rgba(15,23,42,0.08)]",
    checkout: "bg-white text-slate-900",
    muted: "text-slate-500",
    heading: "text-slate-900",
    label: "text-slate-700",
    usdBadge: "border-slate-200 bg-slate-50 text-slate-600",
    card: "border-slate-200 bg-slate-50/90",
    cardSoft: "border-slate-200 bg-slate-50/60",
    cardFlat: "border-slate-200 bg-white",
    cardTitle: "text-slate-900",
    cardMeta: "text-slate-500",
    tabInactive:
      "border-slate-200 bg-white text-slate-600 hover:border-slate-300",
    tabActiveWallet: "border-blue-500 bg-blue-50 text-blue-700 shadow-sm",
    tabActiveOnramp: "border-violet-500 bg-violet-50 text-violet-700 shadow-sm",
    divider: "bg-slate-200",
    link: "text-blue-600 hover:text-blue-700",
    select: "border-slate-200 bg-white text-slate-900",
    emeraldBadge: "border-emerald-200 bg-emerald-50 text-emerald-700 hover:bg-emerald-50",
    footerBorder: "border-slate-100",
    footerText: "text-slate-500",
    footerIcon: "text-slate-400",
    outlineBtn:
      "border border-slate-200 bg-white text-violet-700 shadow-none hover:bg-violet-50 hover:text-violet-800",
    stepNum: "bg-violet-100 text-violet-700",
    stepText: "text-slate-600",
    stepChevron: "text-slate-300",
    vaultName: "text-slate-700",
  };
}

export type PayCheckoutStyles = ReturnType<typeof payCheckoutStyles>;

export function CheckoutBrandPanel({
  businessName,
  description,
  logoUrl,
  avatarSeed,
  styles: s,
}: {
  businessName: string;
  description: string;
  logoUrl?: string | null;
  avatarSeed?: string;
  styles: PayCheckoutStyles;
}) {
  const paymentDesc = splitPaymentDescription(description);

  return (
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
          <PaymentBrandAvatar
            businessName={businessName}
            logoUrl={logoUrl}
            seed={avatarSeed}
            size={36}
          />
          <div className="flex items-center gap-1.5">
            <span className="text-sm font-semibold text-white">{businessName}</span>
            <BadgeCheck className="h-4 w-4 shrink-0 text-sky-200" />
          </div>
        </div>
        <div>
          <p className="text-sm text-white/80">{paymentDesc.label}</p>
          <p className="mt-0.5 text-lg font-semibold leading-snug text-white">{paymentDesc.subject}</p>
        </div>
        <ul className="space-y-3">
          {BRAND_FEATURES.map(({ icon: Icon, title, desc }) => (
            <li key={title} className="flex items-start gap-3">
              <Icon className="mt-0.5 h-4 w-4 shrink-0 text-sky-200" />
              <div>
                <p className="text-sm font-semibold text-white">{title}</p>
                <p className="text-xs text-white/80">{desc}</p>
              </div>
            </li>
          ))}
        </ul>
      </div>
      <div className="relative mt-4 flex items-center gap-2 text-xs text-white/80">
        <Shield className="h-3.5 w-3.5 shrink-0 text-sky-200" />
        Secured by Hypertron
      </div>
    </div>
  );
}

export const ON_RAMP_PARTNERS = [
  {
    id: "moneygram",
    name: "MoneyGram",
    desc: "Cash pickup · Bank transfer · Cards",
    badge: "Best rate",
    time: "1–5 min est. time",
    logo: "/onramp/moneygram.svg",
  },
  {
    id: "banxa",
    name: "Banxa",
    desc: "Credit / Debit Card · Apple Pay",
    badge: "Secure",
    time: "2–10 min est. time",
    logo: "/onramp/banxa.png",
  },
  {
    id: "alchemy",
    name: "Alchemy Pay",
    desc: "Cards · Local methods",
    badge: "Low fees",
    time: "3–15 min est. time",
    logo: "/onramp/alchemypay.png",
  },
] as const;

export function CheckoutPayerDetails({
  styles: s,
  kycName,
  kycEmail,
  onKycNameChange,
  onKycEmailChange,
  kycComplete,
  idPrefix = "pay",
}: {
  styles: PayCheckoutStyles;
  kycName: string;
  kycEmail: string;
  onKycNameChange: (v: string) => void;
  onKycEmailChange: (v: string) => void;
  kycComplete: boolean;
  idPrefix?: string;
}) {
  return (
    <div className={cn("mt-3 space-y-3 rounded-xl border px-3.5 py-3", s.cardSoft)}>
      <p className={cn("text-xs font-medium", s.label)}>Your details (for receipt)</p>
      <div className="grid gap-2.5 sm:grid-cols-2">
        <div className="space-y-1">
          <Label htmlFor={`${idPrefix}-kyc-name`} className={cn("text-[11px]", s.cardMeta)}>
            Name
          </Label>
          <Input
            id={`${idPrefix}-kyc-name`}
            value={kycName}
            onChange={(e) => onKycNameChange(e.target.value)}
            placeholder="Your name"
            className="h-9 border-slate-200 bg-white text-sm text-slate-900"
          />
        </div>
        <div className="space-y-1">
          <Label htmlFor={`${idPrefix}-kyc-email`} className={cn("text-[11px]", s.cardMeta)}>
            Email
          </Label>
          <Input
            id={`${idPrefix}-kyc-email`}
            type="email"
            value={kycEmail}
            onChange={(e) => onKycEmailChange(e.target.value)}
            placeholder="you@example.com"
            className="h-9 border-slate-200 bg-white text-sm text-slate-900"
          />
        </div>
      </div>
      {kycComplete ? (
        <p className="flex items-center gap-1.5 text-xs font-medium text-emerald-600">
          <CheckCircle2 className="h-3.5 w-3.5" /> Ready to continue
        </p>
      ) : (
        <p className={cn("text-[11px]", s.cardMeta)}>Required before paying or using the QR code.</p>
      )}
    </div>
  );
}

export function CheckoutTrustFooter({ styles: s }: { styles: PayCheckoutStyles }) {
  return (
    <div
      className={cn(
        "mt-auto flex shrink-0 flex-wrap gap-x-3 gap-y-1 border-t pt-3 text-[10px]",
        s.footerBorder,
        s.footerText
      )}
    >
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

export function QrCheckoutPanel({
  styles: s,
  currency,
  payPageUrl,
  copyAddress,
  privateEnabled,
  onPrivateChange,
  privateSwitchDisabled = false,
  expiresAt,
  detailsComplete = true,
}: {
  styles: PayCheckoutStyles;
  currency: PaymentAssetCode;
  payPageUrl: string;
  copyAddress: string;
  privateEnabled: boolean;
  onPrivateChange: (v: boolean) => void;
  privateSwitchDisabled?: boolean;
  expiresAt: Date | null;
  /** When false, QR and actions stay locked until payer details are filled (live pay page). */
  detailsComplete?: boolean;
}) {
  const { Canvas: QRCanvas } = useQRCode();
  const [copied, setCopied] = useState<"address" | "qr" | null>(null);
  const qrSize = 132;

  async function copyText(text: string, kind: "address" | "qr") {
    await navigator.clipboard.writeText(text);
    setCopied(kind);
    setTimeout(() => setCopied(null), 1800);
  }

  function openPayLink() {
    if (payPageUrl) window.open(payPageUrl, "_blank", "noopener,noreferrer");
  }

  return (
    <div className="flex min-h-0 flex-1 flex-col overflow-hidden">
      <div
        className={cn(
          "mt-1 flex shrink-0 items-start justify-between gap-3 rounded-xl border px-3.5 py-2.5",
          s.cardSoft
        )}
      >
        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-1.5">
            <p className={cn("text-sm font-medium", s.cardTitle)}>Private settlement (opt-in)</p>
            {!privateSwitchDisabled ? (
              <span className="rounded-full border border-amber-500/40 bg-amber-500/15 px-1.5 py-px text-[9px] font-semibold uppercase tracking-wide text-amber-800 dark:text-amber-200">
                Beta
              </span>
            ) : null}
            <Info className={cn("h-3.5 w-3.5", s.footerIcon)} />
          </div>
          <p className={cn("mt-0.5 text-[11px]", s.cardMeta)}>
            {privateSwitchDisabled
              ? "Private settlement is not configured for this deployment."
              : "Testnet beta — hash-memo payment + on-chain commitment. Not audited."}
          </p>
        </div>
        <Switch
          checked={privateEnabled}
          onCheckedChange={onPrivateChange}
          disabled={privateSwitchDisabled}
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
              <div className={cn(!detailsComplete && "pointer-events-none select-none blur-md")}>
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
              {!detailsComplete ? (
                <div className="absolute inset-0 flex items-center justify-center rounded-xl bg-white/75 px-3 text-center backdrop-blur-sm">
                  <p className={cn("text-xs font-medium", s.cardTitle)}>
                    Enter your name and email above to unlock
                  </p>
                </div>
              ) : null}
            </div>
          </div>

          <div className="flex min-w-0 flex-1 flex-col gap-2.5">
            <div className={cn("flex items-center justify-between gap-2 rounded-lg border px-3 py-2", s.cardFlat)}>
              <div className="flex min-w-0 items-center gap-2">
                <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-blue-600 text-[9px] font-bold text-white">
                  $
                </div>
                <p className={cn("truncate text-xs font-medium", s.cardTitle)}>
                  {currency} on Stellar
                </p>
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
                disabled={!detailsComplete}
                className={cn(
                  "h-8 gap-1 px-2 text-[11px] !bg-white !text-violet-700 hover:!bg-violet-50",
                  s.outlineBtn
                )}
                onClick={() => void copyText(copyAddress, "address")}
              >
                <Copy className="h-3 w-3" />
                {copied === "address" ? "Copied" : "Copy"}
              </Button>
              <Button
                type="button"
                variant="outline"
                size="sm"
                className={cn(
                  "h-8 gap-1 px-2 text-[11px] !bg-white !text-violet-700 hover:!bg-violet-50",
                  s.outlineBtn
                )}
                onClick={openPayLink}
                disabled={!payPageUrl || !detailsComplete}
              >
                <Wallet className="h-3 w-3" />
                Open
              </Button>
              <Button
                type="button"
                variant="outline"
                size="sm"
                className={cn(
                  "h-8 gap-1 px-2 text-[11px] !bg-white !text-violet-700 hover:!bg-violet-50",
                  s.outlineBtn
                )}
                onClick={() => void copyText(payPageUrl, "qr")}
                disabled={!payPageUrl || !detailsComplete}
              >
                <Share2 className="h-3 w-3" />
                Share
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div
        className={cn(
          "mt-auto flex shrink-0 items-center justify-between gap-3 border-t pt-3 text-[11px]",
          s.footerBorder,
          s.footerText
        )}
      >
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

export type OnRampFlowStatus =
  | "idle"
  | "starting"
  | "awaiting_user"
  | "confirming"
  | "success"
  | "error";

export function OnRampCheckoutPanel({
  vaultName,
  styles: s,
  currency = "USDC",
  displayAmount,
  moneygramEnabled = false,
  kycComplete = false,
  onRampStatus = "idle",
  onRampError = null,
  confirmationStatus = "idle",
  onStartMoneyGram,
}: {
  vaultName: string;
  styles: PayCheckoutStyles;
  currency?: PaymentAssetCode;
  displayAmount?: string;
  moneygramEnabled?: boolean;
  kycComplete?: boolean;
  onRampStatus?: OnRampFlowStatus;
  onRampError?: string | null;
  confirmationStatus?: "idle" | "confirming" | "confirmed" | "timeout";
  onStartMoneyGram?: () => void;
}) {
  const steps = [
    "Choose on-ramp partner",
    "Complete fiat payment",
    `${currency} delivered to ${vaultName}`,
  ] as const;

  const hasValidAmount =
    Boolean(displayAmount) && displayAmount !== "—" && Number.isFinite(Number(displayAmount));
  const moneygramReady =
    moneygramEnabled && currency === "USDC" && kycComplete && hasValidAmount;
  const isProcessing = onRampStatus === "starting" || onRampStatus === "confirming";

  return (
    <div className="flex min-h-0 flex-1 flex-col overflow-hidden">
      <div className="mt-1 shrink-0">
        <h3 className={cn("text-sm font-semibold", s.cardTitle)}>Buy {currency} with fiat</h3>
        <p className={cn("mt-0.5 text-xs", s.cardMeta)}>
          Pay via a partner — {currency} is delivered to{" "}
          <span className={cn("font-medium", s.vaultName)}>{vaultName}</span>.
        </p>
        {moneygramEnabled ? (
          <p className={cn("mt-1 text-[10px]", s.footerText)}>MoneyGram sandbox · Stellar testnet</p>
        ) : null}
      </div>

      {onRampStatus === "success" || onRampStatus === "awaiting_user" || onRampStatus === "confirming" ? (
        <div className="mt-3 rounded-xl border border-violet-200 bg-violet-50 p-4 text-center">
          <CheckCircle2 className="mx-auto h-7 w-7 text-violet-600" />
          <p className="mt-1.5 text-sm font-semibold text-violet-900">
            {onRampStatus === "success" ? "Payment recorded" : "Complete payment in MoneyGram"}
          </p>
          {onRampStatus === "awaiting_user" ? (
            <p className="mt-1.5 text-xs text-violet-800">
              Finish cash-in in the MoneyGram window. USDC will be sent to the merchant vault with
              your payment memo.
            </p>
          ) : null}
          {confirmationStatus === "confirming" ? (
            <p className="mt-1.5 inline-flex items-center justify-center gap-1.5 text-xs text-violet-800">
              <Loader2 className="h-3.5 w-3.5 animate-spin" />
              Waiting for USDC delivery on Stellar…
            </p>
          ) : confirmationStatus === "confirmed" ? (
            <p className="mt-1.5 text-xs font-medium text-violet-800">
              Payment recorded — the merchant has been notified.
            </p>
          ) : confirmationStatus === "timeout" ? (
            <p className="mt-1.5 text-xs text-violet-800/90">
              Still processing. Sandbox deposits can take a few minutes after MoneyGram confirms.
            </p>
          ) : null}
        </div>
      ) : (
        <ul className="mt-2.5 min-h-0 flex-1 space-y-2 overflow-y-auto pr-0.5">
          {ON_RAMP_PARTNERS.map((partner) => {
            const isMoneyGram = partner.id === "moneygram";
            const partnerEnabled = isMoneyGram && moneygramReady && !isProcessing;
            const showSoon = !isMoneyGram || !moneygramEnabled;

            return (
              <li
                key={partner.id}
                className={cn("flex items-center gap-2.5 rounded-lg border px-3 py-2.5", s.cardFlat)}
              >
                <div className="flex h-8 w-8 shrink-0 items-center justify-center overflow-hidden rounded-md border border-slate-200/90 bg-white p-1">
                  <img
                    src={partner.logo}
                    alt=""
                    className="h-full w-full object-contain"
                    aria-hidden
                  />
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
                  disabled={!partnerEnabled}
                  onClick={isMoneyGram ? onStartMoneyGram : undefined}
                  title={
                    isMoneyGram
                      ? moneygramEnabled
                        ? "Start MoneyGram sandbox deposit"
                        : "Set MONEYGRAM_AUTH_SECRET (testnet) to enable"
                      : "Coming soon"
                  }
                  className={cn(
                    "h-8 shrink-0 px-3 text-xs text-white",
                    partnerEnabled
                      ? "bg-violet-600 hover:bg-violet-500"
                      : "bg-violet-600/60"
                  )}
                >
                  {isProcessing && isMoneyGram ? (
                    <Loader2 className="h-3.5 w-3.5 animate-spin" />
                  ) : showSoon ? (
                    "Soon"
                  ) : (
                    "Start"
                  )}
                </Button>
              </li>
            );
          })}
        </ul>
      )}

      {onRampStatus === "error" && onRampError ? (
        <p className="mt-2 rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-xs text-red-700">
          {onRampError}
        </p>
      ) : null}

      {!moneygramEnabled && currency === "USDC" ? (
        <p className={cn("mt-2 text-[10px]", s.footerText)}>
          Sandbox wiring ready — add <code className="text-[10px]">MONEYGRAM_AUTH_SECRET</code>{" "}
          (testnet key registered at{" "}
          <a
            href="https://developer.moneygram.com"
            target="_blank"
            rel="noopener noreferrer"
            className="text-violet-600 hover:underline"
          >
            developer.moneygram.com
          </a>
          ) and keep <code className="text-[10px]">NEXT_PUBLIC_STELLAR_NETWORK=testnet</code>.
        </p>
      ) : null}

      <div className={cn("mt-2 shrink-0 border-t pt-2.5", s.footerBorder)}>
        <p className={cn("text-[11px] font-semibold", s.cardTitle)}>How it works</p>
        <div className="mt-1.5 flex items-start gap-1">
          {steps.map((step, i) => (
            <div key={step} className="flex min-w-0 flex-1 items-start gap-1">
              <span
                className={cn(
                  "flex h-5 w-5 shrink-0 items-center justify-center rounded-full text-[10px] font-semibold",
                  s.stepNum
                )}
              >
                {i + 1}
              </span>
              <p className={cn("text-[10px] leading-tight", s.stepText)}>{step}</p>
              {i < steps.length - 1 ? (
                <ChevronRight
                  className={cn("mx-0.5 mt-0.5 hidden h-3 w-3 shrink-0 lg:block", s.stepChevron)}
                />
              ) : null}
            </div>
          ))}
        </div>
      </div>

      <CheckoutTrustFooter styles={s} />
    </div>
  );
}
