import { useState, useEffect } from 'react';

/**
 * Hook to prevent hydration mismatches between server and client rendering.
 * Returns true only after the component has mounted on the client.
 * 
 * Use this when you need to conditionally render content that depends on
 * client-only APIs or browser-specific features to ensure the server-rendered
 * HTML matches the initial client render.
 * 
 * @example
 * ```tsx
 * const mounted = useMounted();
 * if (!mounted) return null; // or return a loading state
 * 
 * // Safe to use client-only APIs like localStorage
 * const value = localStorage.getItem('key');
 * ```
 */
export function useMounted(): boolean {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return mounted;
}

export default useMounted;

