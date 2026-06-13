import type { ReactNode } from "react";
import { DocBackground } from "@/components/doc/doc-background";
import { DocMobileNav } from "@/components/doc/doc-page-view";

export default function DocLayout({ children }: { children: ReactNode }) {
  return (
    <div className="doc-shell relative">
      <DocBackground />
      <div className="relative z-10">
        <DocMobileNav />
        {children}
      </div>
    </div>
  );
}
