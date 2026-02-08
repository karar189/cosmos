'use client';

import { useEffect } from 'react';
import UnicornScene from 'unicornstudio-react/next';
import styles from './LandingPage.module.css';

const UNICORN_HERO_PROJECT_ID = 'VAJPJvLTEm86EQJv2Otu';

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
      {/* Hero: full-viewport animation + left-bottom text block */}
      <section className={styles.section}>
        <UnicornScene
          projectId={UNICORN_HERO_PROJECT_ID}
          width="100vw"
          height="100vh"
          className={styles.embedWrapper}
          lazyLoad={false}
        />
        <div className={styles.heroTextBlock}>
          <p className={styles.heroSubheading}>Where trust meets data.</p>
          <h1 className={styles.heroHeadline}>
            <span className={styles.heroHeadlineLine}>Intelligence</span>
            <span className={styles.heroHeadlineLine}>that moves markets.</span>
          </h1>
          <p className={styles.heroDescription}>
            Institutional-grade risk ratings and compliance on Stellar.
          </p>
        </div>
        <div className={styles.glassBox}>
          <div className={styles.glassBoxTop}>
            <span className={styles.glassBoxIcon} aria-hidden>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
                <path d="M12 4v16M4 12h16M6 6l12 12M18 6L6 18" />
              </svg>
            </span>
            <span className={styles.glassBoxNav}>
              <span className={styles.glassBoxChevron}>&lt;</span>
              <span className={styles.glassBoxChevron}>&gt;</span>
            </span>
          </div>
          <div className={styles.glassBoxBottom}>
            <span className={styles.glassBoxDot} />
            <span className={styles.glassBoxLabel}>
              <span className={styles.glassBoxLabelLine}>STELLAR /</span>
              <span className={styles.glassBoxLabelLine}>INSTITUTIONAL</span>
            </span>
          </div>
        </div>
        <div className={styles.badgeCover} />
      </section>
    </>
  );
}
