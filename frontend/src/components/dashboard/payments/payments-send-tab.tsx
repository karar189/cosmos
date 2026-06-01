"use client";

import { useMemo, useState } from "react";
import {
  ArrowRight,
  Calendar,
  CheckCheck,
  ChevronDown,
  Clock,
  Copy,
  Mail,
  Shield,
  User,
  Wallet,
  Zap,
  Building2,
} from "lucide-react";
import { useDashboardTheme } from "@/components/dashboard/dashboard-theme-provider";
import {
  MethodCard,
  SectionInfo,
  usePaymentsStyles,
} from "@/components/dashboard/payments/payments-shared";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { fallbackBusiness } from "@/data/fallback";
import { cn } from "@/utils";

const SAVED_CONTACTS = [
  { id: "c1", name: "Dev Contractor", detail: "GABC…7K2M", type: "wallet" as const },
  { id: "c2", name: "Marcus Lee", detail: "marcus@acme.io", type: "email" as const },
  { id: "c3", name: "CloudHost Inc", detail: "GBCD…9P4Q", type: "wallet" as const },
];

const DELIVERY_METHODS = [
  { id: "wallet", label: "Stellar Wallet", sub: "Instant on-chain", icon: Wallet, enabled: true },
  { id: "email", label: "Email Link", sub: "Claim via secure link", icon: Mail, enabled: true },
  { id: "priority", label: "Priority Rail", sub: "Faster settlement", icon: Zap, enabled: true },
  { id: "bank", label: "Bank Transfer", sub: "Coming soon", icon: Building2, enabled: false },
] as const;

export function PaymentsSendTab() {
  const { theme } = useDashboardTheme();
  const { t, inputCls, labelCls, hintCls, sectionTitle, cardCls, panelCls } = usePaymentsStyles(theme);

  const [recipient, setRecipient] = useState("");
  const [amount, setAmount] = useState("500.00");
  const [memo, setMemo] = useState("Invoice #1042 — May retainer");
  const [timing, setTiming] = useState<"now" | "schedule">("now");
  const [scheduleDate, setScheduleDate] = useState("");
  const [privateSend, setPrivateSend] = useState(false);
  const [methods, setMethods] = useState<Record<string, boolean>>({
    wallet: true,
    email: false,
    priority: false,
    bank: false,
  });
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const [copied, setCopied] = useState(false);

  const vaultName = useMemo(() => {
    const base = fallbackBusiness.name?.trim() || "Hypertron";
    return base.endsWith("Vault") ? base : `${base} Vault`;
  }, []);

  const feeEstimate = useMemo(() => {
    const num = parseFloat(amount.replace(/,/g, "")) || 0;
    const baseFee = methods.priority ? 0.5 : 0.01;
    const pctFee = methods.priority ? num * 0.001 : 0;
    return (baseFee + pctFee).toFixed(2);
  }, [amount, methods.priority]);

  const filteredContacts = useMemo(() => {
    const q = recipient.trim().toLowerCase();
    if (!q || q.length < 2) return [];
    return SAVED_CONTACTS.filter(
      (c) => c.name.toLowerCase().includes(q) || c.detail.toLowerCase().includes(q)
    );
  }, [recipient]);

  function selectContact(contact: (typeof SAVED_CONTACTS)[number]) {
    setRecipient(`${contact.name} · ${contact.detail}`);
  }

  function selectDeliveryMethod(id: string) {
    setMethods({ wallet: false, email: false, priority: false, bank: false, [id]: true });
  }

  async function handleSend(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    await new Promise((r) => setTimeout(r, 900));
    setLoading(false);
    setSent(true);
  }

  function copyReceipt() {
    navigator.clipboard.writeText("TX-8F2A9C1D — Sent 500.00 USDC to recipient");
    setCopied(true);
    setTimeout(() => setCopied(false), 1800);
  }

  return (
    <div className={cardCls}>
      <div className="mb-5">
        <h1 className={cn("text-xl font-semibold tracking-tight sm:text-2xl", t.pageHeading)}>
          Send a Payment
        </h1>
        <p className={cn("mt-1 text-sm", t.pageSubheading)}>
          Transfer USDC instantly to wallets, saved contacts, or via secure email link.
        </p>
      </div>

      {sent ? (
        <div
          className={cn(
            "mb-6 flex flex-col gap-3 rounded-lg border p-4 sm:flex-row sm:items-center sm:justify-between",
            t.dark ? "border-emerald-500/30 bg-emerald-500/10" : "border-emerald-200 bg-emerald-50/80"
          )}
        >
          <div className="min-w-0">
            <p className={cn("text-sm font-medium", t.dark ? "text-emerald-200" : "text-emerald-800")}>
              {timing === "schedule" ? "Payment scheduled" : "Payment sent successfully"}
            </p>
            <p className={cn("mt-0.5 text-xs", t.pageSubheading)}>
              {amount} USDC → {recipient || "recipient"} · TX-8F2A9C1D
            </p>
          </div>
          <Button type="button" size="sm" variant="outline" className={cn("shrink-0 gap-2", t.outlineBtn)} onClick={copyReceipt}>
            {copied ? <CheckCheck className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
            {copied ? "Copied" : "Copy receipt"}
          </Button>
        </div>
      ) : null}

      <form onSubmit={handleSend} className="flex flex-col gap-6">
        <div className="grid grid-cols-1 gap-5 lg:grid-cols-2 lg:items-start">
          <div className="flex flex-col gap-5">
            <div className="space-y-2">
              <Label htmlFor="recipient" className={labelCls}>
                Recipient
              </Label>
              <div className="relative">
                <Input
                  id="recipient"
                  value={recipient}
                  onChange={(e) => setRecipient(e.target.value)}
                  placeholder="Name, email, or Stellar wallet address"
                  className={cn(inputCls, "pr-10")}
                  required
                  autoComplete="off"
                />
                <User className={cn("pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2", t.cardMuted)} />
              </div>
              {filteredContacts.length > 0 ? (
                <ul
                  className={cn(
                    "overflow-hidden rounded-lg border text-sm shadow-sm",
                    t.dark ? "border-white/10 bg-slate-900" : "border-slate-200 bg-white"
                  )}
                  role="listbox"
                >
                  {filteredContacts.map((contact) => (
                    <li key={contact.id}>
                      <button
                        type="button"
                        role="option"
                        aria-selected={recipient.includes(contact.detail)}
                        onClick={() => selectContact(contact)}
                        className={cn(
                          "flex w-full items-center justify-between gap-3 px-3 py-2.5 text-left transition-colors",
                          t.dark ? "hover:bg-white/10" : "hover:bg-slate-50"
                        )}
                      >
                        <span className={cn("font-medium", t.pageHeading)}>{contact.name}</span>
                        <span className={cn("truncate text-xs", t.pageSubheading)}>{contact.detail}</span>
                      </button>
                    </li>
                  ))}
                </ul>
              ) : recipient.length >= 2 && !SAVED_CONTACTS.some((c) => recipient.includes(c.name)) ? (
                <p className={hintCls}>No saved contacts match — you can still send to this address.</p>
              ) : null}
            </div>

            <div className="space-y-2">
              <Label htmlFor="send-amount" className={labelCls}>
                Amount
              </Label>
              <div
                className={cn(
                  "flex overflow-hidden rounded-lg border focus-within:ring-2 focus-within:ring-blue-500/20",
                  t.dark ? "border-white/10" : "border-slate-200"
                )}
              >
                <Input
                  id="send-amount"
                  type="text"
                  inputMode="decimal"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  className={cn(inputCls, "h-11 flex-1 rounded-none border-0 focus-visible:ring-0")}
                  required
                />
                <div
                  className={cn(
                    "flex items-center gap-2 border-l px-3 text-sm font-medium",
                    t.dark ? "border-white/10 bg-white/5 text-slate-200" : "border-slate-200 bg-slate-50 text-slate-700"
                  )}
                >
                  <span className="flex h-5 w-5 items-center justify-center rounded-full bg-blue-600 text-[10px] font-bold text-white">
                    $
                  </span>
                  USDC
                </div>
              </div>
              <p className={hintCls}>
                Available: <span className="font-medium text-emerald-600">38,210.00 USDC</span>
              </p>
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="memo" className={labelCls}>
                  Memo / Note <span className={cn("font-normal", t.pageSubheading)}>(optional)</span>
                </Label>
                <span className={hintCls}>{memo.length}/200</span>
              </div>
              <Textarea
                id="memo"
                value={memo}
                maxLength={200}
                onChange={(e) => setMemo(e.target.value)}
                placeholder="Add a note visible to the recipient"
                rows={3}
                className={cn(
                  "resize-none text-sm focus:ring-2 focus:ring-blue-500/20",
                  t.dark
                    ? "border-white/10 bg-white/5 text-slate-100 placeholder:text-slate-500"
                    : "border-slate-200 bg-white text-slate-900 placeholder:text-slate-400"
                )}
              />
            </div>

            <div className="space-y-3">
              <Label className={labelCls}>When to send</Label>
              <div className="grid grid-cols-2 gap-3">
                {(
                  [
                    { id: "now" as const, label: "Send now", sub: "Arrives in ~3 seconds", icon: Zap },
                    { id: "schedule" as const, label: "Schedule", sub: "Pick date & time", icon: Clock },
                  ] as const
                ).map((opt) => {
                  const Icon = opt.icon;
                  const active = timing === opt.id;
                  return (
                    <button
                      key={opt.id}
                      type="button"
                      onClick={() => setTiming(opt.id)}
                      className={cn(
                        "flex items-start gap-3 rounded-lg border p-3 text-left transition-colors",
                        active
                          ? t.dark
                            ? "border-blue-500/50 bg-blue-500/10"
                            : "border-blue-300 bg-blue-50/60"
                          : t.dark
                            ? "border-white/10 bg-white/5 hover:border-white/20"
                            : "border-slate-200 bg-white hover:border-slate-300"
                      )}
                    >
                      <Icon className={cn("mt-0.5 h-4 w-4 shrink-0", active ? "text-blue-600" : t.cardMuted)} />
                      <div>
                        <p className={cn("text-sm font-medium", t.pageHeading)}>{opt.label}</p>
                        <p className={cn("text-[11px]", t.pageSubheading)}>{opt.sub}</p>
                      </div>
                    </button>
                  );
                })}
              </div>
              {timing === "schedule" ? (
                <div className="relative">
                  <Input
                    type="datetime-local"
                    value={scheduleDate}
                    onChange={(e) => setScheduleDate(e.target.value)}
                    className={cn(inputCls, "pr-10")}
                    required
                  />
                  <Calendar className={cn("pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2", t.cardMuted)} />
                </div>
              ) : null}
            </div>
          </div>

          <div className={panelCls}>
            <div className="flex items-center gap-2">
              <h2 className={sectionTitle}>Source &amp; Fees</h2>
              <SectionInfo className={t.cardMuted} />
            </div>

            <button
              type="button"
              className={cn(
                "flex w-full items-center gap-3 rounded-lg border px-4 py-3 text-left transition-colors",
                t.dark ? "border-white/10 bg-white/5 hover:bg-white/10" : "border-slate-200 bg-white hover:border-slate-300"
              )}
            >
              <div
                className={cn(
                  "flex h-10 w-10 shrink-0 items-center justify-center rounded-lg",
                  t.dark ? "bg-white/10" : "bg-slate-100"
                )}
              >
                <Wallet className={cn("h-5 w-5", t.dark ? "text-slate-300" : "text-slate-600")} />
              </div>
              <div className="min-w-0 flex-1">
                <p className={cn("text-sm font-semibold", t.pageHeading)}>{vaultName}</p>
                <p className={cn("text-xs", t.pageSubheading)}>Sending from</p>
              </div>
              <ArrowRight className={cn("h-4 w-4 shrink-0", t.cardMuted)} />
            </button>

            <div
              className={cn(
                "space-y-2 rounded-lg border px-4 py-3 text-sm",
                t.dark ? "border-white/10 bg-white/5" : "border-slate-200 bg-white"
              )}
            >
              <div className="flex justify-between">
                <span className={t.pageSubheading}>Network fee</span>
                <span className={cn("font-medium tabular-nums", t.pageHeading)}>{feeEstimate} USDC</span>
              </div>
              <div className="flex justify-between">
                <span className={t.pageSubheading}>Recipient receives</span>
                <span className={cn("font-semibold tabular-nums", t.pageHeading)}>
                  {amount || "0.00"} USDC
                </span>
              </div>
              <div className={cn("border-t pt-2", t.cardDivider)}>
                <div className="flex justify-between">
                  <span className={cn("font-medium", t.pageHeading)}>Total debit</span>
                  <span className={cn("font-semibold tabular-nums", t.pageHeading)}>
                    {(parseFloat(amount.replace(/,/g, "") || "0") + parseFloat(feeEstimate)).toLocaleString("en-US", {
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2,
                    })}{" "}
                    USDC
                  </span>
                </div>
              </div>
            </div>

            <div
              className={cn(
                "space-y-3 rounded-lg border px-4 py-3",
                t.dark ? "border-white/10 bg-white/5" : "border-slate-200 bg-white"
              )}
            >
              <div className="flex items-start justify-between gap-4">
                <div>
                  <div className="flex items-center gap-1.5">
                    <p className={cn("text-sm font-medium", t.pageHeading)}>Private Send</p>
                    <SectionInfo className={t.cardMuted} />
                  </div>
                  <p className={cn("mt-1 text-xs leading-relaxed", t.pageSubheading)}>
                    Obscure amount and memo on the public ledger.
                  </p>
                </div>
                <Switch
                  checked={privateSend}
                  onCheckedChange={setPrivateSend}
                  className="shrink-0 data-[state=checked]:bg-blue-600"
                />
              </div>
              {privateSend ? (
                <div className={cn("flex gap-3 rounded-lg px-3 py-2.5", t.dark ? "bg-blue-500/10" : "bg-blue-50")}>
                  <Shield className={cn("mt-0.5 h-4 w-4 shrink-0 text-blue-600", t.dark && "text-blue-400")} />
                  <p className={cn("text-xs leading-relaxed", t.dark ? "text-blue-200" : "text-blue-800")}>
                    A private proof-of-payment receipt will be shared with the recipient only.
                  </p>
                </div>
              ) : null}
            </div>

            <div className="flex items-center gap-2">
              <Badge
                variant="outline"
                className={cn(
                  "text-[11px]",
                  t.dark ? "border-emerald-500/30 text-emerald-300" : "border-emerald-200 text-emerald-700"
                )}
              >
                Stellar · USDC
              </Badge>
              <span className={cn("text-xs", t.pageSubheading)}>Est. arrival: ~3 sec</span>
            </div>
          </div>
        </div>

        <div className={cn("space-y-3 border-t pt-6", t.dark ? "border-white/10" : "border-slate-200")}>
          <div>
            <div className="flex items-center gap-2">
              <h2 className={sectionTitle}>Delivery Method</h2>
              <SectionInfo className={t.cardMuted} />
            </div>
            <p className={cn("mt-0.5 text-xs", t.pageSubheading)}>How the recipient receives funds.</p>
          </div>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
            {DELIVERY_METHODS.map((method) => (
              <MethodCard
                key={method.id}
                {...method}
                checked={methods[method.id]}
                onToggle={selectDeliveryMethod}
                theme={theme}
              />
            ))}
          </div>
        </div>

        <div className="flex flex-col items-stretch gap-2 border-t pt-4 sm:flex-row sm:items-center sm:justify-between">
          <p className={cn("text-xs", t.pageSubheading)}>
            By sending, you confirm the recipient details are correct. Transfers cannot be reversed.
          </p>
          <Button
            type="submit"
            disabled={loading || !recipient.trim()}
            className="h-11 min-w-[180px] bg-blue-600 px-6 text-white hover:bg-blue-500"
          >
            {loading ? "Processing…" : timing === "schedule" ? "Schedule Payment" : "Send Payment"}
          </Button>
        </div>
      </form>
    </div>
  );
}
