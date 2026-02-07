/**
 * useProjectHeaderScroll Hook
 * 
 * Tracks scroll position and provides motion values for shrinking project header.
 * Uses Framer Motion's useScroll and useTransform for smooth animations.
 * 
 * @returns Motion values for logo size, text scale, badge opacity
 * 
 * @example
 * ```tsx
 * const { logoSize, textScale, badgesOpacity } = useProjectHeaderScroll();
 * 
 * <motion.img style={{ width: logoSize, height: logoSize }} />
 * <motion.div style={{ scale: textScale }} />
 * ```
 */

import { useMotionValue, useTransform } from 'motion/react';
import { useEffect, useRef, useState } from 'react';
import { spacingPx, getRootFontSize } from '@core3/ui-components/styleSystem';

// Design values in pixels (at 16px base) - will scale with root font-size
const LOGO_SIZE_INITIAL_PX = 88;
const LOGO_SIZE_SHRUNK_PX = 40;
const BADGES_MAX_HEIGHT_PX = 100;
const BACK_BUTTON_HEIGHT_PX = 40;

// Scroll thresholds in pixels (at 16px base) - will scale with root font-size
const SCROLL_THRESHOLD_FULL_PX = 100; // Full shrink happens at 100px scroll
const SCROLL_THRESHOLD_BADGES_PX = 50; // Badges fade faster
const SCROLL_THRESHOLD_BACK_PX = 30; // Back button fades fastest

export function useProjectHeaderScroll() {
  const scrollY = useMotionValue(0);
  const rafRef = useRef<number | null>(null);
  
  // Track root font-size for responsive scaling (changes on breakpoints)
  const [rootSize, setRootSize] = useState(16);
  
  useEffect(() => {
    // Update root font size on mount and window resize
    const updateRootSize = () => {
      setRootSize(getRootFontSize());
    };
    updateRootSize();
    window.addEventListener('resize', updateRootSize);
    return () => window.removeEventListener('resize', updateRootSize);
  }, []);
  
  // Scale factor based on current root font-size
  const scale = rootSize / 16;
  
  // Scaled thresholds and sizes
  const SCROLL_THRESHOLD_FULL = SCROLL_THRESHOLD_FULL_PX * scale;
  const SCROLL_THRESHOLD_BADGES = SCROLL_THRESHOLD_BADGES_PX * scale;
  const SCROLL_THRESHOLD_BACK = SCROLL_THRESHOLD_BACK_PX * scale;
  const LOGO_SIZE_INITIAL = LOGO_SIZE_INITIAL_PX * scale;
  const LOGO_SIZE_SHRUNK = LOGO_SIZE_SHRUNK_PX * scale;
  const BADGES_MAX_HEIGHT = BADGES_MAX_HEIGHT_PX * scale;
  const BACK_BUTTON_HEIGHT = BACK_BUTTON_HEIGHT_PX * scale;
  
  // Track scroll on the layout container
  useEffect(() => {
    const container = document.querySelector('[data-scroll-container]') as HTMLElement;
    if (!container) return;
    
    // Disable scroll anchoring to prevent feedback loop
    container.style.overflowAnchor = 'none';
    
    const handleScroll = () => {
      // Use requestAnimationFrame to batch updates and prevent jitter
      if (rafRef.current) {
        cancelAnimationFrame(rafRef.current);
      }
      rafRef.current = requestAnimationFrame(() => {
        scrollY.set(container.scrollTop);
      });
    };
    
    container.addEventListener('scroll', handleScroll, { passive: true });
    return () => {
      container.removeEventListener('scroll', handleScroll);
      if (rafRef.current) {
        cancelAnimationFrame(rafRef.current);
      }
    };
  }, [scrollY]);
  
  // Logo size: 88px (initial) -> 40px (scrolled)
  const logoSize = useTransform(
    scrollY,
    [0, SCROLL_THRESHOLD_FULL],
    [LOGO_SIZE_INITIAL, LOGO_SIZE_SHRUNK]
  );
  
  // Text scale: 1 (48px) -> 0.667 (32px when base is 48px)
  const textScale = useTransform(
    scrollY,
    [0, SCROLL_THRESHOLD_FULL],
    [1, 0.667]
  );
  
  // Badges opacity: 1 (visible) -> 0 (hidden)
  const badgesOpacity = useTransform(
    scrollY,
    [0, SCROLL_THRESHOLD_BADGES],
    [1, 0]
  );
  
  // Badges max-height: 100px -> 0 (actually collapses the space)
  const badgesMaxHeight = useTransform(
    scrollY,
    [0, SCROLL_THRESHOLD_BADGES],
    [BADGES_MAX_HEIGHT, 0]
  );
  
  // Back button opacity: fades out when scrolling
  const backButtonOpacity = useTransform(
    scrollY,
    [0, SCROLL_THRESHOLD_BACK],
    [1, 0]
  );
  
  // Back button max-height for collapse
  const backButtonMaxHeight = useTransform(
    scrollY,
    [0, SCROLL_THRESHOLD_BACK],
    [BACK_BUTTON_HEIGHT, 0]
  );
  
  // Header padding bottom: 32px (xl) -> 12px (sm)
  const headerPaddingBottom = useTransform(
    scrollY,
    [0, SCROLL_THRESHOLD_FULL],
    [spacingPx.xl * scale, spacingPx.sm * scale]
  );
  
  // Header padding top: 24px (l) -> 48px (xxl) on scroll
  const headerPaddingTop = useTransform(
    scrollY,
    [0, SCROLL_THRESHOLD_FULL],
    [spacingPx.l * scale, spacingPx.xxl * scale]
  );
  
  return {
    logoSize,
    textScale,
    badgesOpacity,
    badgesMaxHeight,
    backButtonOpacity,
    backButtonMaxHeight,
    headerPaddingBottom,
    headerPaddingTop,
    scrollY,
  };
}

