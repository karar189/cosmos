"use client";

import { Suspense, useState, useCallback, useRef, useEffect } from "react";
import { motion, useScroll, useTransform, useSpring } from "framer-motion";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Mail, Wallet } from "lucide-react";
import { LaunchEmailSignInButton } from "./launch-email-sign-in-button";
import { DarkVeil } from "./dark-veil";
import { HeroDashboardPreview } from "./hero-dashboard-preview";
import { ShinyText } from "@/components/ui/shiny-text";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { isPrivyConfigured } from "@/lib/privy-config";
import {
  INVITE_VERIFIED_KEY,
  LAUNCH_QUERY_PARAM,
  isInviteVerifiedInSession,
  safeReturnUrl,
} from "@/lib/launch-auth";

const BOOK_DEMO = "https://calendly.com/kararsweta/30min";
/** Static invite gate for Launch (replace with server validation when ready). */
const VALID_INVITE_CODE = "INVITE101";

type LaunchStep = "invite" | "sign-in";

function markInviteVerified() {
  try {
    sessionStorage.setItem(INVITE_VERIFIED_KEY, "1");
  } catch {
    // ignore
  }
}

function MonoHeroInner() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const privyOn = isPrivyConfigured();
  const returnUrl = safeReturnUrl(searchParams.get("returnUrl"));
  const [launchOpen, setLaunchOpen] = useState(false);
  const [launchStep, setLaunchStep] = useState<LaunchStep>("invite");
  const [inviteCode, setInviteCode] = useState("");
  const [inviteError, setInviteError] = useState<string | null>(null);
  const [configError, setConfigError] = useState<string | null>(null);

  useEffect(() => {
    if (searchParams.get("reason") === "config") {
      setConfigError("Server auth is not fully configured. Contact support if this persists.");
    }
    if (searchParams.get(LAUNCH_QUERY_PARAM) !== "1") return;

    setLaunchOpen(true);
    if (isInviteVerifiedInSession()) {
      setLaunchStep("sign-in");
    }

    const url = new URL(window.location.href);
    url.searchParams.delete(LAUNCH_QUERY_PARAM);
    url.searchParams.delete("returnUrl");
    url.searchParams.delete("reason");
    window.history.replaceState({}, "", url.pathname + (url.search || "") + url.hash);
  }, [searchParams]);

  const resetLaunchState = useCallback(() => {
    setInviteCode("");
    setInviteError(null);
    setLaunchStep("invite");
  }, []);

  // Scroll-linked 3D tilt for the dashboard preview
  const previewRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: previewRef,
    offset: ["start 95%", "start 30%"],
  });
  // 0 = dashboard entering viewport (tilted), 1 = centered (upright)
  const rotateX = useSpring(useTransform(scrollYProgress, [0, 1], [22, 0]), {
    stiffness: 140,
    damping: 24,
    mass: 0.5,
  });
  const scale = useSpring(useTransform(scrollYProgress, [0, 1], [0.94, 1]), {
    stiffness: 140,
    damping: 24,
    mass: 0.5,
  });

  const handleLaunchOpenChange = (open: boolean) => {
    setLaunchOpen(open);
    if (!open) resetLaunchState();
  };

  const handleInviteSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = inviteCode.trim();
    if (trimmed !== VALID_INVITE_CODE) {
      setInviteError("Invalid invite code. Try again or contact us for access.");
      return;
    }
    setInviteError(null);
    markInviteVerified();
    setLaunchStep("sign-in");
  };

  const finishLaunchAndGoToDashboard = useCallback(() => {
    setLaunchOpen(false);
    resetLaunchState();
    router.push(returnUrl);
  }, [resetLaunchState, router, returnUrl]);

  const handleWalletSignIn = () => {
    markInviteVerified();
    setLaunchOpen(false);
    resetLaunchState();
    router.push(`/session/wallet?returnUrl=${encodeURIComponent(returnUrl)}`);
  };

  const handleBackToInvite = () => {
    setLaunchStep("invite");
    setInviteError(null);
  };

  return (
    <section
      id="home"
      className="relative flex w-full flex-col items-center overflow-hidden bg-black px-6 pb-16 pt-28 text-center md:px-8 md:pt-40"
    >
      <div className="pointer-events-none absolute inset-0 z-0" style={{ position: "absolute", inset: 0 }} aria-hidden>
        <DarkVeil resolutionScale={0.6} />
      </div>

      <div
        className="pointer-events-none absolute inset-0 z-[1] bg-gradient-to-b from-slate-950/70 via-blue-950/20 to-slate-950/85"
        aria-hidden
      />

      {/* Subtle grid overlay */}
      <div
        className="pointer-events-none absolute inset-0 z-[1] opacity-[0.18] [background-image:linear-gradient(rgba(255,255,255,0.06)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.06)_1px,transparent_1px)] [background-size:64px_64px] [mask-image:radial-gradient(ellipse_60%_60%_at_50%_30%,black,transparent)]"
        aria-hidden
      />

      <div className="relative z-10 mx-auto flex w-full max-w-4xl flex-col items-center">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0 }}
          className="mb-6 relative flex flex-wrap items-center justify-center gap-2.5 rounded-full px-4 py-2 overflow-hidden ring-1 ring-white/10"
          style={{ background: "rgba(255,255,255,0.05)", backdropFilter: "blur(12px)" }}
        >
          <span className="relative flex h-2 w-2">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
            <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-400" />
          </span>
          <span className="rounded-full bg-white px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-[0.12em] text-black">
            Stellar
          </span>
          <ShinyText
            text="B2B workflows & pooled settlement"
            speed={3}
            color="rgba(255,255,255,0.6)"
            shineColor="#ffffff"
            spread={100}
            className="text-sm font-medium"
          />
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="mb-5 max-w-3xl text-4xl font-semibold leading-[1.05] tracking-[-2px] text-foreground drop-shadow-sm sm:text-5xl md:text-7xl"
        >
          Unified B2B onboarding{" "}
          <span className="relative whitespace-nowrap">
            <span className="font-serif font-normal italic text-white/90">and</span>
          </span>{" "}
          <span className="bg-gradient-to-br from-white via-white to-blue-200/80 bg-clip-text text-transparent">
            private settlement.
          </span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.25 }}
          className="mb-8 max-w-xl text-base leading-relaxed text-white/65 drop-shadow-sm md:text-[15px]"
        >
          Replace fragmented tools and exposed financial data. Hypertron combines onboarding, payments, AI-assisted workflows, and a privacy layer into a single programmable B2B infrastructure.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="mx-auto grid w-full max-w-lg grid-cols-1 gap-3 sm:grid-cols-2"
        >
          <motion.div
            className="w-full"
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.98 }}
          >
            <Link
              href={BOOK_DEMO}
              target="_blank"
              rel="noopener noreferrer"
              data-testid="hero-book-demo-btn"
              className="flex h-12 w-full items-center justify-center rounded-full bg-foreground px-8 text-base font-semibold text-background"
            >
              Book a Demo
            </Link>
          </motion.div>
          <motion.div
            className="w-full"
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.98 }}
          >
            <Button
              type="button"
              variant="outline"
              data-testid="hero-launch-btn"
              onClick={() => setLaunchOpen(true)}
              className="flex h-12 w-full items-center justify-center rounded-full border-white/25 bg-transparent px-8 text-base font-semibold text-white hover:bg-white/10 hover:text-white"
            >
              Launch
            </Button>
          </motion.div>
        </motion.div>

        <Dialog open={launchOpen} onOpenChange={handleLaunchOpenChange}>
          <DialogContent className="border-white/10 bg-zinc-950 py-8 text-foreground sm:max-w-md sm:py-10">
            {launchStep === "invite" ? (
              <>
                <DialogHeader>
                  <DialogTitle className="text-white">Enter invite code</DialogTitle>
                  <DialogDescription className="text-zinc-400">
                    Hypertron is invite-only during early access. Enter your code to continue.
                  </DialogDescription>
                </DialogHeader>
                <form onSubmit={handleInviteSubmit} className="grid gap-4 py-4">
                  <div className="grid gap-2">
                    <Label htmlFor="hypertron-invite-code" className="text-zinc-300">
                      Invite code
                    </Label>
                    <Input
                      id="hypertron-invite-code"
                      name="inviteCode"
                      autoComplete="off"
                      placeholder="e.g. INVITE101"
                      value={inviteCode}
                      onChange={(ev) => {
                        setInviteCode(ev.target.value);
                        if (inviteError) setInviteError(null);
                      }}
                      className="border-white/15 bg-black/40 text-white placeholder:text-zinc-600"
                    />
                    {inviteError ? (
                      <p className="text-sm text-red-400" role="alert">
                        {inviteError}
                      </p>
                    ) : null}
                  </div>
                  <DialogFooter className="gap-2 sm:gap-0">
                    <Button
                      type="button"
                      variant="ghost"
                      className="text-zinc-400 hover:text-white"
                      onClick={() => handleLaunchOpenChange(false)}
                    >
                      Cancel
                    </Button>
                    <Button type="submit" className="bg-white text-black hover:bg-white/90">
                      Continue
                    </Button>
                  </DialogFooter>
                </form>
              </>
            ) : (
              <>
                <DialogHeader>
                  <DialogTitle className="text-white">Choose how to sign in</DialogTitle>
                  <DialogDescription className="text-zinc-400">
                    Use your work email for the dashboard, or connect a Stellar wallet for on-chain actions.
                  </DialogDescription>
                </DialogHeader>
                {configError ? (
                  <p className="text-sm text-amber-400 px-1" role="alert">
                    {configError}
                  </p>
                ) : null}
                <div className="grid gap-3 py-4">
                  {privyOn ? (
                    <LaunchEmailSignInButton
                      returnUrl={returnUrl}
                      onSuccess={finishLaunchAndGoToDashboard}
                      active={launchOpen && launchStep === "sign-in"}
                    />
                  ) : (
                    <p className="rounded-lg border border-amber-500/30 bg-amber-500/10 px-3 py-2 text-sm text-amber-100/90">
                      Email sign-in is not configured. Use Stellar wallet below, or set Privy env vars.
                    </p>
                  )}

                  <Button
                    type="button"
                    variant="outline"
                    className="h-auto w-full flex-col items-start gap-1 rounded-xl border-white/20 bg-transparent px-4 py-4 text-left hover:bg-white/[0.06]"
                    onClick={handleWalletSignIn}
                  >
                    <span className="flex w-full items-center gap-3">
                      <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-amber-500/15 text-amber-200">
                        <Wallet className="h-5 w-5" />
                      </span>
                      <span className="flex flex-col gap-0.5">
                        <span className="text-sm font-semibold text-white">Connect Stellar wallet</span>
                        <span className="text-xs font-normal text-zinc-400">
                          Freighter — payments, withdrawals, and signing
                        </span>
                      </span>
                    </span>
                  </Button>
                </div>
                <DialogFooter className="flex-col gap-2 sm:flex-row sm:justify-between">
                  <Button
                    type="button"
                    variant="ghost"
                    className="text-zinc-400 hover:text-white"
                    onClick={handleBackToInvite}
                  >
                    Back
                  </Button>
                  <Button
                    type="button"
                    variant="ghost"
                    className="text-zinc-400 hover:text-white"
                    onClick={() => handleLaunchOpenChange(false)}
                  >
                    Cancel
                  </Button>
                </DialogFooter>
              </>
            )}
          </DialogContent>
        </Dialog>

        {/* Trust strip */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.45 }}
          className="mt-10 flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-[11px] uppercase tracking-[0.18em] text-white/35"
        >
          <span className="flex items-center gap-1.5">
            <span className="h-1 w-1 rounded-full bg-white/40" /> Soroban-native
          </span>
          <span className="flex items-center gap-1.5">
            <span className="h-1 w-1 rounded-full bg-white/40" /> Privacy by design
          </span>
          <span className="flex items-center gap-1.5">
            <span className="h-1 w-1 rounded-full bg-white/40" /> Audit-ready
          </span>
          <span className="flex items-center gap-1.5">
            <span className="h-1 w-1 rounded-full bg-white/40" /> Invite-only
          </span>
        </motion.div>
      </div>

      {/* Dashboard preview with scroll-linked 3D tilt */}
      <div
        ref={previewRef}
        className="relative z-10 mt-16 w-full max-w-5xl px-4 md:mt-20"
        style={{ perspective: "1800px", perspectiveOrigin: "50% 0%" }}
      >
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.5 }}
          style={{
            rotateX,
            scale,
            transformStyle: "preserve-3d",
            transformOrigin: "50% 100%",
          }}
          className="relative will-change-transform"
        >
          {/* Glow beneath the frame */}
          <div
            className="pointer-events-none absolute -inset-x-10 -top-12 h-40 rounded-full blur-3xl"
            style={{ background: "radial-gradient(ellipse at center, rgba(59,130,246,0.35), transparent 70%)" }}
          />
          {/* Frame */}
          <div
            className="pointer-events-none relative overflow-hidden rounded-2xl select-none"
            style={{
              boxShadow: "0 0 0 1px rgba(255,255,255,0.1), 0 32px 80px rgba(0,0,0,0.6)",
            }}
          >
            {/* Title bar */}
            <div className="flex items-center gap-2 border-b border-white/[0.07] bg-white/[0.04] px-4 py-3 backdrop-blur-sm">
            <div className="flex gap-1.5">
              <div className="h-3 w-3 rounded-full bg-[#ff5f57]" />
              <div className="h-3 w-3 rounded-full bg-[#febc2e]" />
              <div className="h-3 w-3 rounded-full bg-[#28c840]" />
            </div>
            <div className="mx-auto flex items-center gap-2 rounded-md bg-white/[0.06] px-3 py-1">
              <span className="font-mono text-[11px] tracking-wide text-white/45">
                app.hypertron.xyz/dashboard
              </span>
            </div>
          </div>

          <HeroDashboardPreview />
          </div>
        </motion.div>
      </div>

      <div
        className="pointer-events-none absolute inset-x-0 bottom-0 z-[2] h-32 bg-gradient-to-t from-background to-transparent"
        aria-hidden
      />
    </section>
  );
}

export function MonoHero() {
  return (
    <Suspense fallback={null}>
      <MonoHeroInner />
    </Suspense>
  );
}
