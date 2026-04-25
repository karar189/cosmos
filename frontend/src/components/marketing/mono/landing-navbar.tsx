"use client";

import { cn } from "@/utils";
import { Menu, X } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useState, useEffect } from "react";

const CONTACT_HREF = "https://x.com/hypertron_hq";

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
      "fixed left-0 right-0 top-0 z-50 px-8 py-4 md:px-28 transition-all duration-300",
      !visible && "-translate-y-full",
      scrolled
        ? "bg-white/5 backdrop-blur-md"
        : "bg-transparent"
    )}>
      <div className="mx-auto flex max-w-[1600px] items-center justify-between gap-4">
        <Link href="/" className="flex shrink-0 items-center gap-2 text-foreground">
          <Image
            src="/logo.png"
            alt="Hypertron"
            width={40}
            height={40}
            className="h-9 w-9 object-contain md:h-10 md:w-10"
          />
          <span className="text-xl font-bold tracking-tight">Hypertron</span>
        </Link>

        <div className="flex items-center gap-4">
          <nav className="hidden items-center gap-1 md:flex">
            <Link
              href="/#home"
              className="px-2 py-1.5 text-sm font-medium text-muted-foreground transition-opacity hover:text-foreground"
            >
              Home
            </Link>
            <Link
              href={CONTACT_HREF}
              target="_blank"
              rel="noopener noreferrer"
              className="px-2 py-1.5 text-sm font-medium text-muted-foreground transition-opacity hover:text-foreground"
            >
              Contact us
            </Link>
          </nav>

          <Link
            href={CONTACT_HREF}
            target="_blank"
            rel="noopener noreferrer"
            className="hidden rounded-lg bg-foreground px-4 py-2 text-sm font-semibold text-background transition-opacity hover:opacity-90 sm:inline-flex"
          >
            Book a Demo
          </Link>

          <button
            type="button"
            className="flex h-10 w-10 items-center justify-center rounded-md border border-border/60 text-foreground md:hidden"
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
            "mt-3 flex flex-col gap-1 rounded-xl border border-border/40 bg-card/95 p-3 backdrop-blur-sm md:hidden",
          )}
        >
          <Link
            href="/#home"
            className="rounded-md px-3 py-2.5 text-sm text-muted-foreground hover:bg-muted/50 hover:text-foreground"
            onClick={() => setOpen(false)}
          >
            Home
          </Link>
          <Link
            href={CONTACT_HREF}
            target="_blank"
            rel="noopener noreferrer"
            className="rounded-md px-3 py-2.5 text-sm text-muted-foreground hover:bg-muted/50 hover:text-foreground"
            onClick={() => setOpen(false)}
          >
            Contact us
          </Link>
          <Link
            href={CONTACT_HREF}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-2 rounded-lg bg-foreground py-2.5 text-center text-sm font-semibold text-background"
            onClick={() => setOpen(false)}
          >
            Book a Demo
          </Link>
        </div>
      ) : null}
    </header>
  );
}
