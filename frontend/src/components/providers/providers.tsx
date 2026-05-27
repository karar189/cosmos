"use client";

import React from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { HypertronPrivyProvider } from "@/components/providers/privy-provider";
import { PrivyAuthSync } from "@/components/auth/privy-auth-sync";

interface Props {
  children: React.ReactNode;
}

const Providers = ({ children }: Props) => {
  const client = new QueryClient();
  return (
    <QueryClientProvider client={client}>
      <HypertronPrivyProvider>
        <PrivyAuthSync />
        {children}
      </HypertronPrivyProvider>
    </QueryClientProvider>
  );
};

export default Providers;
