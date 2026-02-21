import { HelpCircleIcon, FileTextIcon, LineChartIcon, Link2Icon, WalletIcon, NewspaperIcon } from "lucide-react";

export const NAV_LINKS = [
    {
        title: "Features",
        href: "/features",
        menu: [
            { title: "Workflows", tagline: "One link for onboarding and payments.", href: "/features/link-shortening", icon: Link2Icon },
            { title: "Document Vault", tagline: "Collect and store client documents.", href: "/features/password-protection", icon: FileTextIcon },
            { title: "Payment & escrow", tagline: "Secure payments and release on milestones.", href: "/features/analytics", icon: WalletIcon },
            { title: "Tracking", tagline: "Real-time progress and completion status.", href: "/features/qr-codes", icon: LineChartIcon },
        ],
    },
    {
        title: "Pricing",
        href: "/pricing",
    },
    {
        title: "Enterprise",
        href: "/enterprise",
    },
    {
        title: "Resources",
        href: "/resources",
        menu: [
            {
                title: "Blog",
                tagline: "Read articles on the latest trends in tech.",
                href: "/resources/blog",
                icon: NewspaperIcon,
            },
            {
                title: "Help",
                tagline: "Get answers to your questions.",
                href: "/resources/help",
                icon: HelpCircleIcon,
            },
        ]
    },
    {
        title: "Changelog",
        href: "/changelog",
    },
];
