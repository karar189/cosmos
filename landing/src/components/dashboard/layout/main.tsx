"use client";

import { cn } from "@/utils";

type MainProps = React.HTMLAttributes<HTMLElement> & {
  fixed?: boolean;
  fluid?: boolean;
};

export function DashboardMain({
  fixed,
  className,
  fluid,
  ...props
}: MainProps) {
  return (
    <main
      data-layout={fixed ? "fixed" : "auto"}
      className={cn(
        "flex-1 px-4 py-6 md:px-6",
        fixed && "flex grow flex-col overflow-hidden",
        !fluid && "mx-auto w-full max-w-6xl",
        className
      )}
      {...props}
    />
  );
}
