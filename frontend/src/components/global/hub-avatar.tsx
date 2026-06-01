"use client";

import Avvvatars from "avvvatars-react";
import { cn } from "@/utils";

/** Avvvatars shape for `value`, with Hypertron blue palette (overrides default hash colors). */
export function HubAvatar({
  value,
  size = 40,
  className,
}: {
  value: string;
  size?: number;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "hub-avatar-blue shrink-0 overflow-hidden rounded-full",
        className
      )}
    >
      <Avvvatars value={value} style="shape" size={size} />
    </div>
  );
}
