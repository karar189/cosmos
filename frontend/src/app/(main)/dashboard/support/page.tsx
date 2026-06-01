"use client";

import { useState } from "react";
import {
  BookOpen,
  CheckCheck,
  ChevronDown,
  Loader2,
  Mail,
  MessageCircle,
  ExternalLink,
} from "lucide-react";
import { DashboardPageHeader } from "@/components/dashboard/layout/dashboard-page-header";
import {
  WorkspacePageShell,
  workspaceHubBreadcrumbs,
} from "@/components/dashboard/workspace-hub/workspace-page-shell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/utils";

const CHANNELS = [
  {
    icon: MessageCircle,
    title: "Live chat",
    description: "Chat with our team in real time, Mon–Fri.",
    action: "Start a chat",
    href: "#",
  },
  {
    icon: Mail,
    title: "Email support",
    description: "Reach us at support@hypertron.io anytime.",
    action: "Send an email",
    href: "mailto:support@hypertron.io",
  },
  {
    icon: BookOpen,
    title: "Documentation",
    description: "Browse guides, API references, and tutorials.",
    action: "Open docs",
    href: "#",
  },
];

const FAQS = [
  {
    q: "How do I create a new workspace?",
    a: "From the Workspaces hub, click “Create Workspace” and follow the onboarding steps. You can also start from a template to get set up faster.",
  },
  {
    q: "How do I change my plan?",
    a: "Go to Billing & Plans in the sidebar, pick the tier that fits your needs, and click “Update plan”. Changes take effect immediately.",
  },
  {
    q: "How is my data secured?",
    a: "All sensitive documents are stored in the Secure Vault with encryption at rest, and wallet authentication is handled through Freighter.",
  },
  {
    q: "Can I invite team members?",
    a: "Yes. Open a workspace, go to Employee Management, and invite members by email or wallet address with role-based access.",
  },
];

const inputCls =
  "h-9 border border-ui-border/80 bg-white text-neutral-900 placeholder:text-neutral-400 focus:border-blue-500/40 focus:ring-2 focus:ring-blue-500/20 focus:ring-offset-0";

export default function SupportPage() {
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!subject.trim() || !message.trim()) return;
    setSending(true);
    setTimeout(() => {
      setSending(false);
      setSent(true);
      setSubject("");
      setMessage("");
      setTimeout(() => setSent(false), 3000);
    }, 800);
  };

  return (
    <WorkspacePageShell
      breadcrumbs={workspaceHubBreadcrumbs("Support")}
      connectMessage="Connect your wallet to contact support."
    >
      <div className="flex flex-col gap-6">
        <DashboardPageHeader
          variant="hub"
          eyebrow="Workspace"
          title="Support"
          description="Get help, browse answers, or reach out to our team."
        />

        {/* Channels */}
        <div className="grid gap-4 md:grid-cols-3">
          {CHANNELS.map(({ icon: Icon, title, description, action, href }) => (
            <a
              key={title}
              href={href}
              className="group flex flex-col rounded-xl border border-ui-border/80 bg-white p-5 shadow-sm transition-colors hover:border-blue-300"
            >
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
                <Icon className="h-5 w-5" />
              </div>
              <p className="mt-3 text-sm font-semibold text-neutral-900">{title}</p>
              <p className="mt-1 flex-1 text-xs leading-relaxed text-neutral-500">{description}</p>
              <span className="mt-3 inline-flex items-center gap-1.5 text-xs font-medium text-blue-600">
                {action}
                <ExternalLink className="h-3.5 w-3.5" />
              </span>
            </a>
          ))}
        </div>

        <div className="grid gap-6 lg:grid-cols-5">
          {/* FAQ */}
          <div className="lg:col-span-3">
            <div className="rounded-xl border border-ui-border/80 bg-white shadow-sm">
              <div className="border-b border-ui-border/80 px-5 py-4">
                <p className="text-sm font-medium text-neutral-900">Frequently asked questions</p>
                <p className="mt-0.5 text-xs text-neutral-500">Quick answers to common questions.</p>
              </div>
              <div className="divide-y divide-ui-border/70">
                {FAQS.map((faq, i) => {
                  const open = openFaq === i;
                  return (
                    <div key={faq.q}>
                      <button
                        type="button"
                        onClick={() => setOpenFaq(open ? null : i)}
                        className="flex w-full items-center justify-between gap-4 px-5 py-3.5 text-left"
                      >
                        <span className="text-sm font-medium text-neutral-800">{faq.q}</span>
                        <ChevronDown
                          className={cn(
                            "h-4 w-4 shrink-0 text-neutral-400 transition-transform",
                            open && "rotate-180"
                          )}
                        />
                      </button>
                      {open ? (
                        <p className="px-5 pb-4 text-sm leading-relaxed text-neutral-500">{faq.a}</p>
                      ) : null}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Contact form */}
          <div className="lg:col-span-2">
            <form
              onSubmit={handleSubmit}
              className="flex flex-col gap-4 rounded-xl border border-ui-border/80 bg-white p-5 shadow-sm"
            >
              <div>
                <p className="text-sm font-medium text-neutral-900">Send us a message</p>
                <p className="mt-0.5 text-xs text-neutral-500">We typically reply within one business day.</p>
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="support-subject" className="text-xs text-neutral-500">Subject</Label>
                <Input
                  id="support-subject"
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  placeholder="What do you need help with?"
                  className={inputCls}
                />
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="support-message" className="text-xs text-neutral-500">Message</Label>
                <Textarea
                  id="support-message"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Describe your issue in detail…"
                  className={cn("min-h-[120px] resize-none", inputCls)}
                />
              </div>

              <Button
                type="submit"
                disabled={sending || !subject.trim() || !message.trim()}
                className={cn(
                  "rounded-full font-semibold transition-all",
                  sent
                    ? "border-0 bg-emerald-600 text-white hover:bg-emerald-600"
                    : "border border-ui-border/80 bg-blue-600 text-white hover:bg-blue-700"
                )}
              >
                {sent ? (
                  <><CheckCheck className="mr-1.5 h-4 w-4" /> Message sent</>
                ) : sending ? (
                  <><Loader2 className="mr-1.5 h-4 w-4 animate-spin" /> Sending…</>
                ) : (
                  "Send message"
                )}
              </Button>
            </form>
          </div>
        </div>
      </div>
    </WorkspacePageShell>
  );
}
