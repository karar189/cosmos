'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import UnicornScene from 'unicornstudio-react/next';
import { ROUTES } from '@/constants/routes';
import styles from './LandingPage.module.css';

const UNICORN_HERO_PROJECT_ID = 'VAJPJvLTEm86EQJv2Otu';
/** Waitlist: "Join the alpha" / full-screen animation */
const UNICORN_WAITLIST_PROJECT_ID = 'kZqalJ7yfFPj2fkAH6Zt';

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
  // Hide by text content (e.g. "Made with unicorn.studio")
  document.querySelectorAll('a, span, div').forEach((el) => {
    const text = (el.textContent || '').toLowerCase();
    if (text.includes('unicorn.studio') || text.includes('made with unicorn')) {
      (el as HTMLElement).style.setProperty('display', 'none', 'important');
    }
  });
}

export function LandingPage() {
  useEffect(() => {
    hideUnicornBadge();
    const id = setInterval(hideUnicornBadge, 500);
    const t = setTimeout(() => clearInterval(id), 15000);
    return () => {
      clearInterval(id);
      clearTimeout(t);
    };
  }, []);

  return (
    <>
      {/* Hero: full-viewport animation only */}
      <section className={styles.section}>
        <UnicornScene
          projectId={UNICORN_HERO_PROJECT_ID}
          width="100vw"
          height="100vh"
          className={styles.embedWrapper}
          lazyLoad={false}
        />
        <div className={styles.badgeCover} />
      </section>

      {/* Waitlist: full-screen animation behind "Join the alpha" */}
      <section className={styles.waitlistSection}>
        <UnicornScene
          projectId={UNICORN_WAITLIST_PROJECT_ID}
          width="100vw"
          height="100vh"
          className={styles.waitlistEmbed}
          lazyLoad={false}
        />
        <div className={styles.waitlistContent}>
          <h2 className={styles.waitlistHeadline}>Join the alpha</h2>
          <Link href={ROUTES.RATINGS.PROJECTS} className={styles.ctaButton}>
            Get access
          </Link>
        </div>
        <div className={styles.waitlistBadgeCover} />
      </section>
    </>
  );
}
