"use client";

import type { ReactNode } from "react";

type DashboardPageHeaderProps = {
  /** Small caps line above the title (e.g. "Operations") */
  eyebrow?: string;
  title: ReactNode;
  description?: string;
  /** Right-aligned actions (e.g. secondary buttons) */
  end?: ReactNode;
};

/**
 * Page title block aligned with marketing mono (Solution section) typography.
 */
export function DashboardPageHeader({
  eyebrow,
  title,
  description,
  end,
}: DashboardPageHeaderProps) {
  const body = (
    <div className="min-w-0 space-y-3">
      {eyebrow ? (
        <p className="text-[11px] font-medium uppercase tracking-[0.2em] text-muted-foreground">
          {eyebrow}
        </p>
      ) : null}
      <h1 className="max-w-3xl text-3xl font-semibold tracking-tight text-foreground md:text-4xl">
        {title}
      </h1>
      {description ? (
        <p className="max-w-2xl text-sm leading-relaxed text-muted-foreground md:text-base">
          {description}
        </p>
      ) : null}
    </div>
  );

  if (end) {
    return (
      <div className="flex flex-wrap items-start justify-between gap-4">
        {body}
        <div className="shrink-0">{end}</div>
      </div>
    );
  }

  return body;
}
