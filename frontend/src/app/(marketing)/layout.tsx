import { LandingFooter, LandingNavbar, MarketingSplash } from "@/components/marketing/mono";
import React from "react";

interface Props {
  children: React.ReactNode;
}

const MarketingLayout = ({ children }: Props) => {
  return (
    <MarketingSplash>
      <div className="marketing-mono flex min-h-screen flex-col bg-background font-default text-foreground antialiased">
        <LandingNavbar />
        <main className="relative z-10 w-full shrink-0 pt-0 [&:not(:has(#home))]:pt-24">
          {children}
        </main>
        <LandingFooter />
      </div>
    </MarketingSplash>
  );
};

export default MarketingLayout;
