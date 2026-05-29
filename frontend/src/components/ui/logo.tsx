import React from 'react'
import { Icons } from "@/components";
import { cn } from "@/utils";

interface Props {
    variant?: "icon" | "text" | "full";
    className?: string;
}

const HypertronWordmark = ({ className }: { className?: string }) => (
    <span className={cn("text-lg font-semibold tracking-tight text-slate-900", className)}>
        Hypertron
    </span>
);

const Logo = ({ variant = "icon", className }: Props) => {
    return (
        <>
            {variant === "icon" ? (
                <Icons.logo className={cn("w-8 h-8 transition-all", className)} />
            ) : variant === "text" ? (
                <HypertronWordmark className={className} />
            ) : (
                <div className={cn("flex h-8 w-auto items-center space-x-2 transition-all", className)}>
                    <Icons.logo className="h-8 w-8 transition-all" />
                    <HypertronWordmark className="text-base" />
                </div>
            )}
        </>
    )
};

export default Logo
