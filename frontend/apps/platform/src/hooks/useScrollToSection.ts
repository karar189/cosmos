'use client';

import { useCallback, useEffect, useRef, useState } from 'react';

interface UseScrollToSectionOptions {
  /** Offset from top of viewport in px. */
  offset?: number;
  /** Update hash in URL while scrolling. */
  updateHash?: boolean;
  /** If true, track sections and update hash based on scroll position. */
  handleObserveScroll?: boolean;
  /** IDs of sections to track. */
  sectionIds?: string[];
}

/**
 * Find the scroll container or return document element as fallback.
 * @returns {HTMLElement}
 */
function getScrollContainer(): HTMLElement {
  const dataContainer = document.querySelector('[data-scroll-container]');
  if (dataContainer instanceof HTMLElement) {
    return dataContainer;
  }
  return document.documentElement;
}

/**
 * React hook for scrolling to sections and updating the URL hash.
 * @param {UseScrollToSectionOptions} options
 * @returns {{
 *   scrollToSection: (sectionId: string) => void,
 *   hash: string | null,
 *   setHash: (id: string) => void,
 *   scrollToCurrentSection: () => void
 * }}
 */
export function useScrollToSection(options: UseScrollToSectionOptions = {}) {
  const { offset = 0, updateHash = true, handleObserveScroll = false, sectionIds = [] } = options;

  const [hash, setHash] = useState<string | null>(null);
  const hashRef = useRef<string | null>(null);
  const isScrollingRef = useRef(false);
  const scrollIdleTimeoutRef = useRef<number | null>(null);

  // Sync hashRef with state
  hashRef.current = hash;

  /**
   * Scroll to a section by id.
   * @param {string} sectionId
   */
  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    const scrollContainer = getScrollContainer();

    if (element) {
      isScrollingRef.current = true;
      const containerRect = scrollContainer.getBoundingClientRect();
      const elementRect = element.getBoundingClientRect();
      const relativeTop = elementRect.top - containerRect.top + scrollContainer.scrollTop;
      const targetPosition = relativeTop - offset;

      scrollContainer.scrollTo({
        top: targetPosition,
        behavior: 'smooth',
      });

      if (updateHash && sectionId !== hashRef.current) {
        try {
          window.history.replaceState(null, '', `#${sectionId}`);
        } catch {
          // Safari throws SecurityError if replaceState is called too frequently
        }
        setHash(sectionId);
      }
    }
  };

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const hashValue = window.location.hash.slice(1);
      const isMobile = window.innerWidth < 900;
      
      // On mobile, don't scroll on initial load (stay at top)
      if (hashValue && !isMobile) {
        setHash(hashValue);
        isScrollingRef.current = true;
        requestAnimationFrame(() => {
          const element = document.getElementById(hashValue);
          const scrollContainer = getScrollContainer();

          if (element) {
            const containerRect = scrollContainer.getBoundingClientRect();
            const elementRect = element.getBoundingClientRect();
            const relativeTop = elementRect.top - containerRect.top + scrollContainer.scrollTop;
            const targetPosition = relativeTop - offset;

            scrollContainer.scrollTo({
              top: targetPosition,
              behavior: 'smooth',
            });
          }
        });
      } else if (hashValue) {
        // On mobile, just set the hash without scrolling
        setHash(hashValue);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  
  // Listen for hash changes (for mobile tab switching)
  useEffect(() => {
    const handleHashChange = () => {
      const hashValue = window.location.hash.slice(1);
      if (hashValue) {
        setHash(hashValue);
      }
    };
    
    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  useEffect(() => {
    if (!handleObserveScroll || sectionIds.length === 0) return;

    const scrollContainer = getScrollContainer();

    /**
     * Find and update the active section based on scroll position.
     */
    const updateActiveSection = () => {
      if (!updateHash) return;

      let closestSection: string | null = null;
      let closestDistance = Infinity;

      sectionIds.forEach((sectionId) => {
        const element = document.getElementById(sectionId);
        if (!element) return;

        const rect = element.getBoundingClientRect();
        const distance = Math.abs(rect.top - offset);

        if (rect.top <= offset + 100 && rect.bottom > offset) {
          if (distance < closestDistance) {
            closestDistance = distance;
            closestSection = sectionId;
          }
        }
      });

      // Only update if the hash actually changed
      if (closestSection && closestSection !== hashRef.current) {
        try {
          window.history.replaceState(null, '', `#${closestSection}`);
        } catch {
          // Safari throws SecurityError if replaceState is called too frequently
        }
        setHash(closestSection);
      }
    };

    /**
     * Handle scroll event and update section hash.
     */
    const handleScroll = () => {
      if (scrollIdleTimeoutRef.current) {
        window.clearTimeout(scrollIdleTimeoutRef.current);
      }

      scrollIdleTimeoutRef.current = window.setTimeout(() => {
        isScrollingRef.current = false;
        updateActiveSection();
      }, 100);

      if (!isScrollingRef.current) {
        updateActiveSection();
      }
    };

    scrollContainer.addEventListener('scroll', handleScroll, { passive: true });

    // Set first section as default if no hash in URL
    const existingHash = window.location.hash.slice(1);
    if (!existingHash && sectionIds.length > 0) {
      try {
        window.history.replaceState(null, '', `#${sectionIds[0]}`);
      } catch {
        // Safari throws SecurityError if replaceState is called too frequently
      }
      setHash(sectionIds[0]);
    }

    return () => {
      scrollContainer.removeEventListener('scroll', handleScroll);
      if (scrollIdleTimeoutRef.current) {
        window.clearTimeout(scrollIdleTimeoutRef.current);
      }
    };
  }, [handleObserveScroll, sectionIds, offset, updateHash]);

  /**
   * Scroll to the section matching the current hash.
   */
  const scrollToCurrentSection = useCallback(() => {
    if (hashRef.current) {
      scrollToSection(hashRef.current);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return { scrollToSection, hash, setHash, scrollToCurrentSection };
}
