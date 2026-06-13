"use client";

import { cn } from "@/utils";
import { Menu, X } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useState, useEffect } from "react";
import { homeLaunchPath } from "@/lib/launch-auth";

const BOOK_DEMO = "https://calendly.com/kararsweta/30min";
const CONTACT_HREF = "https://x.com/hypertron_hq";
const DOCS_HREF = "/doc";
const SIGN_IN_HREF = homeLaunchPath("/dashboard");

export function LandingNavbar() {
  const [open, setOpen] = useState(false);
  const [visible, setVisible] = useState(true);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    let lastY = window.scrollY;
    const onScroll = () => {
      const currentY = window.scrollY;
      setVisible(currentY < lastY || currentY < 60);
      setScrolled(currentY > 20);
      lastY = currentY;
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header className={cn(
      "fixed left-0 right-0 top-0 z-50 px-6 py-3 md:px-10 transition-all duration-300",
      !visible && "-translate-y-full",
      scrolled
        ? "bg-black/40 backdrop-blur-xl border-b border-white/[0.06]"
        : "bg-transparent"
    )}>
      <div className="mx-auto flex max-w-[1400px] items-center justify-between gap-4">
        <Link href="/" className="flex shrink-0 items-center gap-2 text-foreground">
          <Image
            src="/logo.png"
            alt="Hypertron"
            width={36}
            height={36}
            className="h-8 w-8 object-contain md:h-9 md:w-9"
          />
          <span className="text-lg font-bold tracking-tight">Hypertron</span>
        </Link>

        <nav className="absolute left-1/2 hidden -translate-x-1/2 items-center gap-1 rounded-full border border-white/[0.07] bg-white/[0.03] px-1.5 py-1 backdrop-blur-md md:flex">
          <Link
            href="/#solution"
            className="rounded-full px-3.5 py-1.5 text-sm font-medium text-white/65 transition-colors hover:bg-white/[0.06] hover:text-white"
          >
            Product
          </Link>
          <Link
            href="/#how-it-works"
            className="rounded-full px-3.5 py-1.5 text-sm font-medium text-white/65 transition-colors hover:bg-white/[0.06] hover:text-white"
          >
            How it works
          </Link>
          <Link
            href={DOCS_HREF}
            className="rounded-full px-3.5 py-1.5 text-sm font-medium text-white/65 transition-colors hover:bg-white/[0.06] hover:text-white"
          >
            Docs
          </Link>
          <Link
            href={CONTACT_HREF}
            target="_blank"
            rel="noopener noreferrer"
            className="rounded-full px-3.5 py-1.5 text-sm font-medium text-white/65 transition-colors hover:bg-white/[0.06] hover:text-white"
          >
            Contact
          </Link>
        </nav>

        <div className="flex items-center gap-3">
          <Link
            href={SIGN_IN_HREF}
            data-testid="navbar-sign-in-btn"
            className="hidden rounded-full border border-white/20 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-white/10 sm:inline-flex"
          >
            Sign in
          </Link>
          <Link
            href={BOOK_DEMO}
            target="_blank"
            rel="noopener noreferrer"
            className="hidden rounded-full bg-foreground px-4 py-2 text-sm font-semibold text-background transition-opacity hover:opacity-90 sm:inline-flex"
          >
            Book a Demo
          </Link>

          <button
            type="button"
            className="flex h-10 w-10 items-center justify-center rounded-full border border-white/15 text-foreground md:hidden"
            onClick={() => setOpen((o) => !o)}
            aria-expanded={open}
            aria-label={open ? "Close menu" : "Open menu"}
          >
            {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {open ? (
        <div
          className={cn(
            "mt-3 flex flex-col gap-1 rounded-2xl border border-white/[0.08] bg-black/80 p-3 backdrop-blur-xl md:hidden",
          )}
        >
          <Link
            href="/#solution"
            className="rounded-md px-3 py-2.5 text-sm text-white/70 hover:bg-white/[0.06] hover:text-white"
            onClick={() => setOpen(false)}
          >
            Product
          </Link>
          <Link
            href="/#how-it-works"
            className="rounded-md px-3 py-2.5 text-sm text-white/70 hover:bg-white/[0.06] hover:text-white"
            onClick={() => setOpen(false)}
          >
            How it works
          </Link>
          <Link
            href={DOCS_HREF}
            className="rounded-md px-3 py-2.5 text-sm text-white/70 hover:bg-white/[0.06] hover:text-white"
            onClick={() => setOpen(false)}
          >
            Docs
          </Link>
          <Link
            href={CONTACT_HREF}
            target="_blank"
            rel="noopener noreferrer"
            className="rounded-md px-3 py-2.5 text-sm text-white/70 hover:bg-white/[0.06] hover:text-white"
            onClick={() => setOpen(false)}
          >
            Contact us
          </Link>
          <Link
            href={SIGN_IN_HREF}
            className="rounded-md px-3 py-2.5 text-sm text-white/70 hover:bg-white/[0.06] hover:text-white"
            onClick={() => setOpen(false)}
          >
            Sign in
          </Link>
          <Link
            href={BOOK_DEMO}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-2 rounded-full bg-foreground py-2.5 text-center text-sm font-semibold text-background"
            onClick={() => setOpen(false)}
          >
            Book a Demo
          </Link>
        </div>
      ) : null}
    </header>
  );
}
