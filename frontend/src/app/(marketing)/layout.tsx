import { LandingFooter, LandingNavbar, MarketingSplash } from "@/components/marketing/mono";
import React from "react";

interface Props {
  children: React.ReactNode;
}

const MarketingLayout = ({ children }: Props) => {
  return (
    <MarketingSplash>
      <div className="marketing-mono min-h-screen bg-background font-default text-foreground antialiased has-[.doc-shell]:min-h-0 [&:has(.doc-shell)]:bg-transparent has-[.doc-shell]:[&>footer]:pt-10 has-[.doc-shell]:[&>footer]:md:pt-12">
        <LandingNavbar />
        <main className="relative z-10 w-full pt-0 [&:not(:has(#home))]:pt-24 [&:has(.doc-shell)]:pt-0">
          {children}
        </main>
        <LandingFooter />
      </div>
    </MarketingSplash>
  );
};

export default MarketingLayout;
