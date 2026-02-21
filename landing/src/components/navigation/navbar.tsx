"use client";

import {
    NavigationMenu,
    NavigationMenuContent,
    NavigationMenuItem,
    NavigationMenuLink,
    NavigationMenuList,
    NavigationMenuTrigger,
    navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu";
import { cn, NAV_LINKS } from "@/utils";
import { useFreighter } from "@/hooks/useFreighter";
import { LucideIcon } from "lucide-react";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import MaxWidthWrapper from "../global/max-width-wrapper";
import MobileNavbar from "./mobile-navbar";
import AnimationContainer from "../global/animation-container";

const buttonClass =
    "hidden lg:flex items-center gap-2 px-4 py-2 rounded-full bg-neutral-700/60 hover:bg-neutral-600/60 text-neutral-200 text-sm font-medium border border-neutral-600/50 shadow-sm transition-colors";

function HeaderFreighterButton() {
    const { publicKey, connect, disconnect, isConnecting, truncatedAddress } = useFreighter();

    if (publicKey) {
        return (
            <>
                <Link href="/dashboard" className={buttonClass}>
                    <span className="flex items-center justify-center w-7 h-7 rounded-full bg-black text-neutral-300">
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><path d="M5 12h14M12 5l7 7-7 7" /></svg>
                    </span>
                    Dashboard
                </Link>
                <button
                    type="button"
                    onClick={disconnect}
                    className={buttonClass}
                    title={publicKey}
                >
                    {truncatedAddress ?? "Disconnect"}
                </button>
            </>
        );
    }

    return (
        <button
            type="button"
            onClick={connect}
            disabled={isConnecting}
            className={buttonClass}
        >
            <span className="flex items-center justify-center w-7 h-7 rounded-full bg-black text-neutral-300">
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><path d="M5 12h14M12 5l7 7-7 7" /></svg>
            </span>
            {isConnecting ? "Connecting…" : "Sign In"}
        </button>
    );
}

const Navbar = () => {
    const [scroll, setScroll] = useState(false);

    const handleScroll = () => {
        if (window.scrollY > 8) {
            setScroll(true);
        } else {
            setScroll(false);
        }
    };

    useEffect(() => {
        window.addEventListener("scroll", handleScroll);
        return () => {
            window.removeEventListener("scroll", handleScroll);
        };
    }, []);

    return (
        <header className={cn(
            "sticky top-0 inset-x-0 h-14 w-full border-b border-transparent z-[99999] select-none",
            scroll && "border-background/80 bg-background/40 backdrop-blur-md"
        )}>
            <AnimationContainer reverse delay={0.1} className="size-full">
                <MaxWidthWrapper className="relative flex items-center justify-between h-full min-h-24">
                    {/* 1. Left: logo */}
                    <div className="flex items-center shrink-0 z-10">
                        <Link href="/#home" className="flex items-center gap-2 text-neutral-300 hover:text-white transition-colors">
                            <span className="flex items-center justify-center w-8 h-8 rounded border border-neutral-500/50 bg-neutral-800/50 text-neutral-400" aria-hidden>
                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"><path d="M7 17L17 7M17 7h-6M17 7v6" /></svg>
                            </span>
                            <span className="text-lg font-semibold font-heading !leading-none text-white/90 hidden sm:inline">
                                Hypertron
                            </span>
                        </Link>
                    </div>

                    {/* 2. Center: nav options (absolutely centered) */}
                    <nav className="absolute left-1/2 -translate-x-1/2 hidden lg:flex items-center">
                        <NavigationMenu>
                            <NavigationMenuList className="gap-1">
                                {NAV_LINKS.map((link) => (
                                    <NavigationMenuItem key={link.title}>
                                        {link.menu ? (
                                            <>
                                                <NavigationMenuTrigger className="text-neutral-400 hover:text-neutral-200 bg-transparent text-sm font-medium">
                                                    {link.title}
                                                </NavigationMenuTrigger>
                                                <NavigationMenuContent>
                                                    <ul className={cn(
                                                        "grid gap-1 p-4 md:w-[400px] lg:w-[500px] rounded-xl",
                                                        link.title === "Features" ? "lg:grid-cols-[.75fr_1fr]" : "lg:grid-cols-2"
                                                    )}>
                                                        {link.title === "Features" && (
                                                            <li className="row-span-4 pr-2 relative rounded-lg overflow-hidden">
                                                                <div className="absolute inset-0 !z-10 h-full w-[calc(100%-10px)] bg-[linear-gradient(to_right,rgb(38,38,38,0.5)_1px,transparent_1px),linear-gradient(to_bottom,rgb(38,38,38,0.5)_1px,transparent_1px)] bg-[size:1rem_1rem]"></div>
                                                                <NavigationMenuLink asChild className="z-20 relative">
                                                                    <Link
                                                                        href="/"
                                                                        className="flex h-full w-full select-none flex-col justify-end rounded-lg bg-gradient-to-b from-muted/50 to-muted p-4 no-underline outline-none focus:shadow-md"
                                                                    >
                                                                        <h6 className="mb-2 mt-4 text-lg font-medium">
                                                                            All Features
                                                                        </h6>
                                                                        <p className="text-sm leading-tight text-muted-foreground">
                                                                            Onboarding, workflows, and payments in one place.
                                                                        </p>
                                                                    </Link>
                                                                </NavigationMenuLink>
                                                            </li>
                                                        )}
                                                        {link.menu.map((menuItem) => (
                                                            <ListItem
                                                                key={menuItem.title}
                                                                title={menuItem.title}
                                                                href={menuItem.href}
                                                                icon={menuItem.icon}
                                                            >
                                                                {menuItem.tagline}
                                                            </ListItem>
                                                        ))}
                                                    </ul>
                                                </NavigationMenuContent>
                                            </>
                                        ) : (
                                            <Link href={link.href} legacyBehavior passHref>
                                                <NavigationMenuLink className={cn(navigationMenuTriggerStyle(), "text-neutral-400 hover:text-neutral-200 bg-transparent text-sm font-medium")}>
                                                    {link.title}
                                                </NavigationMenuLink>
                                            </Link>
                                        )}
                                    </NavigationMenuItem>
                                ))}
                            </NavigationMenuList>
                        </NavigationMenu>
                    </nav>

                    {/* 3. Right: Freighter connect / dashboard */}
                    <div className="flex items-center gap-2 shrink-0 z-10">
                        <HeaderFreighterButton />
                        <MobileNavbar />
                    </div>

                </MaxWidthWrapper>
            </AnimationContainer>
        </header>
    )
};

const ListItem = React.forwardRef<
    React.ElementRef<"a">,
    React.ComponentPropsWithoutRef<"a"> & { title: string; icon: LucideIcon }
>(({ className, title, href, icon: Icon, children, ...props }, ref) => {
    return (
        <li>
            <NavigationMenuLink asChild>
                <Link
                    href={href!}
                    ref={ref}
                    className={cn(
                        "block select-none space-y-1 rounded-lg p-3 leading-none no-underline outline-none transition-all duration-100 ease-out hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground",
                        className
                    )}
                    {...props}
                >
                    <div className="flex items-center space-x-2 text-neutral-300">
                        <Icon className="h-4 w-4" />
                        <h6 className="text-sm font-medium !leading-none">
                            {title}
                        </h6>
                    </div>
                    <p title={children! as string} className="line-clamp-1 text-sm leading-snug text-muted-foreground">
                        {children}
                    </p>
                </Link>
            </NavigationMenuLink>
        </li>
    )
})
ListItem.displayName = "ListItem"

export default Navbar
