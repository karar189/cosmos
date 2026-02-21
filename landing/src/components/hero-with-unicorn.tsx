'use client';

import { useEffect, useRef } from 'react';
import Link from 'next/link';
import { ArrowRightIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';

const UNICORN_PROJECT_ID = 'rRzTRPRw92XqXB3CREo3';
const UNICORN_SDK_URL = 'https://cdn.jsdelivr.net/gh/hiunicornstudio/unicornstudio.js@v2.0.5/dist/unicornStudio.umd.js';

function hideUnicornBadge() {
  const selectors = [
    'a[href*="unicorn.studio"]',
    '[class*="badge"]',
    '[class*="attribution"]',
    '[id*="badge"]',
    '[id*="attribution"]',
    '[data-us-badge]',
  ];
  selectors.forEach((sel) => {
    try {
      document.querySelectorAll(sel).forEach((el) => {
        const html = el as HTMLElement;
        html.style.setProperty('display', 'none', 'important');
        html.style.setProperty('visibility', 'hidden', 'important');
        html.style.setProperty('opacity', '0', 'important');
        html.style.setProperty('pointer-events', 'none', 'important');
      });
    } catch {
      // ignore
    }
  });
  document.querySelectorAll('a, span, div').forEach((el) => {
    const text = (el.textContent || '').toLowerCase();
    if (text.includes('unicorn.studio') || text.includes('made with unicorn')) {
      (el as HTMLElement).style.setProperty('display', 'none', 'important');
    }
  });
}

function initUnicorn() {
  const u = (window as unknown as { UnicornStudio?: { init: () => void } }).UnicornStudio;
  if (u?.init) {
    u.init();
  }
}

export function HeroWithUnicorn() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    hideUnicornBadge();
    const id = setInterval(hideUnicornBadge, 500);
    const t = setTimeout(() => clearInterval(id), 15000);

    // Load Unicorn Studio SDK and init (embed div is already in DOM)
    const win = window as unknown as { UnicornStudio?: { init: () => void; isInitialized?: boolean } };
    if (win.UnicornStudio?.init) {
      if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initUnicorn);
      } else {
        initUnicorn();
      }
    } else {
      win.UnicornStudio = { isInitialized: false, init: () => {} };
      const script = document.createElement('script');
      script.src = UNICORN_SDK_URL;
      script.onload = () => {
        if (document.readyState === 'loading') {
          document.addEventListener('DOMContentLoaded', initUnicorn);
        } else {
          initUnicorn();
        }
      };
      (document.head || document.body).appendChild(script);
    }

    return () => {
      clearInterval(id);
      clearTimeout(t);
    };
  }, []);

  return (
    <section className="relative w-full min-h-screen h-screen overflow-hidden bg-black">
      {/* Unicorn Studio embed - script-based, full viewport */}
      <div
        ref={containerRef}
        data-us-project={UNICORN_PROJECT_ID}
        className="absolute inset-0 w-full h-full [&>canvas]:!w-full [&>canvas]:!h-full"
        style={{ width: '100%', height: '100%' }}
      />

      {/* Hero content: same horizontal padding & max-width as navbar (MaxWidthWrapper) */}
      <div className="absolute inset-0 z-10 mx-auto w-full max-w-full md:max-w-screen-xl px-4 md:px-12 lg:px-20 ">
        {/* Hero text block: three-tier layout (small top, large headline, small bottom-right) */}
        <div className="absolute left-4 md:left-12 lg:left-20 bottom-0 z-10 flex flex-col items-start justify-end max-w-[42rem] pointer-events-none pb-28 md:pb-36 lg:pb-44 pt-8">
          {/* Top: small subheading, left-aligned, light grey */}
          <p className="text-sm text-white/50 tracking-wide mb-6 md:mb-4">
            B2B onboarding & payments for Web3
          </p>
          {/* Main: very large stacked headline, left-aligned */}
          <h1 className="font-heading text-white font-semibold tracking-tight leading-[1.15] mb-0">
            <span className="block text-2xl sm:text-3xl md:text-4xl lg:text-4xl">The Fastest Way to</span>
            <span className="block text-2xl sm:text-3xl md:text-4xl lg:text-4xl">Onboard Clients and </span>
            <span className="block text-2xl sm:text-3xl md:text-4xl lg:text-4xl text-white/60">Get Paid in Web3</span>
          </h1>
        </div>

        {/* Right glassmorphic container: small right-aligned description (like bottom block in reference) */}
        <div className="absolute right-4 md:right-12 lg:right-20 bottom-28 md:bottom-36 z-10 w-[280px] sm:w-[320px] md:w-[360px] p-5 md:p-6 bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl flex flex-col gap-4 pointer-events-auto items-end text-right">
        <p className="text-sm text-white/50 leading-relaxed">
          Replace manual processes with automated workflows, escrow, approvals, and real-time tracking.
        </p>
        <Button
          asChild
          className="w-full sm:w-auto bg-white/90 hover:bg-white text-black border-0 shadow-lg font-medium"
        >
          <Link href="/auth/sign-in" className="flex items-center justify-center">
            Get started for free
            <ArrowRightIcon className="w-4 h-4 ml-2" />
          </Link>
        </Button>
        </div>
      </div>

      {/* Bottom cover to hide Unicorn badge */}
      <div className="absolute bottom-0 left-0 right-0 h-20 bg-gradient-to-t from-black/80 to-transparent z-[5] pointer-events-none" aria-hidden />
    </section>
  );
}
