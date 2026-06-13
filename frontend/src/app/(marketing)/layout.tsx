import { LandingFooter, LandingNavbar, MarketingSplash } from "@/components/marketing/mono";
import React from "react";

interface Props {
  children: React.ReactNode;
}

const MarketingLayout = ({ children }: Props) => {
  return (
    <MarketingSplash>
      <div className="marketing-mono flex min-h-screen flex-col bg-background font-default text-foreground antialiased has-[#home]:bg-transparent">
        <LandingNavbar />
        <main className="relative w-full shrink-0 pt-0 [&:not(:has(#home))]:pt-24">
          {children}
        </main>
        <LandingFooter className="relative z-20 shrink-0" />
      </div>
    </MarketingSplash>
  );
};

export default MarketingLayout;
