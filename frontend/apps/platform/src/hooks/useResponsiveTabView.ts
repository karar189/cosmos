import { useState, useEffect } from 'react';

/**
 * Hook to manage responsive tab view behavior
 * 
 * On mobile (< 900px): Shows only active tab section, disables scroll observer
 * On desktop (>= 900px): Shows all sections, enables scroll observer
 * 
 * @param activeValue - The currently active tab value
 * @param defaultValue - Default tab value if activeValue is null
 * @returns Object with isMobile flag, helper to check if tab should render, and effective active value
 */
export function useResponsiveTabView(activeValue: string | null, defaultValue: string = 'overview') {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 900);
    };

    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // On mobile, use activeValue or default; on desktop, doesn't matter (all render)
  const effectiveValue = activeValue || defaultValue;

  const shouldRenderTab = (tabValue: string) => {
    if (!isMobile) return true;
    return tabValue === effectiveValue;
  };

  return {
    isMobile,
    shouldRenderTab,
    effectiveValue,
  };
}
