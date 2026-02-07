/** @jsxImportSource @emotion/react */
'use client';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useState } from 'react';

/**
 * Providers Component
 * 
 * Wraps the application with necessary context providers.
 * Creates a QueryClient instance for TanStack React Query.
 */
export default function Providers({ children }: { children: React.ReactNode }) {
  // Create QueryClient instance (useState ensures it's only created once per component lifecycle)
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            // Disable automatic refetching on window focus for better UX
            refetchOnWindowFocus: false,
            // Retry failed requests twice
            retry: 2,
            // Consider data stale after 5 minutes
            staleTime: 5 * 60 * 1000,
          },
        },
      })
  );

  return (
    <QueryClientProvider client={queryClient}>
      {children}
    </QueryClientProvider>
  );
}

