import { LandingFooter, LandingNavbar } from "@/components/marketing/mono";
import React from "react";

interface Props {
  children: React.ReactNode;
}

const MarketingLayout = ({ children }: Props) => {
  return (
    <div className="marketing-mono min-h-screen bg-background font-default text-foreground antialiased">
      <LandingNavbar />
      <main className="relative z-10 w-full pt-0 [&:not(:has(#home))]:pt-24">
        {children}
      </main>
      <LandingFooter />
    </div>
  );
};

export default MarketingLayout;
