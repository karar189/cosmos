"use client";

import { useEffect, useState } from "react";
import { cn } from "@/utils";
import { Separator } from "@/components/ui/separator";
import { SidebarTrigger } from "@/components/ui/sidebar";

type HeaderProps = React.HTMLAttributes<HTMLElement> & {
  fixed?: boolean;
};

export function DashboardHeader({
  className,
  fixed,
  children,
  ...props
}: HeaderProps) {
  const [offset, setOffset] = useState(0);

  useEffect(() => {
    const onScroll = () => {
      setOffset(
        document.body.scrollTop || document.documentElement.scrollTop
      );
    };
    document.addEventListener("scroll", onScroll, { passive: true });
    return () => document.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={cn(
        "z-50 h-14 border-b border-border bg-background",
        fixed && "sticky top-0 w-full peer/header",
        offset > 10 && fixed && "bg-background/95 shadow-sm backdrop-blur supports-[backdrop-filter]:bg-background/60",
        className
      )}
      {...props}
    >
      <div className="relative flex h-full items-center gap-3 px-4 sm:gap-4">
        {children}
      </div>
    </header>
  );
}
