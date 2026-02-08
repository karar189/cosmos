'use client';

import { useEffect, useState } from 'react';
import dynamic from 'next/dynamic';

const LandingPage = dynamic(
  () => import('./LandingPage').then((m) => ({ default: m.LandingPage })),
  { ssr: false }
);

const loadingFallback = (
  <div
    style={{
      minHeight: '100vh',
      width: '100%',
      backgroundColor: '#000',
    }}
  />
);

export function LandingPageClient() {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  if (!mounted) return loadingFallback;
  return <LandingPage />;
}
