'use client';

import dynamic from 'next/dynamic';

const LandingPage = dynamic(
  () => import('./LandingPage').then((m) => ({ default: m.LandingPage })),
  {
    ssr: false,
    loading: () => (
      <div
        style={{
          minHeight: '100vh',
          width: '100%',
          backgroundColor: '#000',
        }}
      />
    ),
  }
);

export function LandingPageClient() {
  return <LandingPage />;
}
