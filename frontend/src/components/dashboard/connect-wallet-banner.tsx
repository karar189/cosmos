"use client";

import { Wallet } from "lucide-react";
import { usePathname } from "next/navigation";
import { WalletLinkDialog } from "@/components/auth/wallet-link-dialog";

type Props = {
  show: boolean;
};

/** Shown for Privy-only sessions before a Stellar wallet is linked. */
export function ConnectWalletBanner({ show }: Props) {
  const pathname = usePathname();
  if (!show) return null;

  const returnUrl = pathname && pathname.startsWith("/") ? pathname : "/dashboard";

  return (
    <div className="mb-6 flex flex-col gap-3 rounded-xl border border-amber-400/25 bg-amber-400/10 px-4 py-3 sm:flex-row sm:items-center sm:justify-between">
      <div className="flex items-start gap-3">
        <Wallet className="mt-0.5 h-5 w-5 shrink-0 text-amber-200" />
        <div>
          <p className="text-sm font-medium text-amber-50">Link your Stellar wallet</p>
          <p className="text-xs text-amber-100/70 mt-0.5">
            Payments, withdrawals, and business profile still use Freighter. Connect once to enable on-chain features.
          </p>
        </div>
      </div>
      <WalletLinkDialog
        returnUrl={returnUrl}
        triggerClassName="shrink-0 border-amber-400/30 text-amber-50 hover:bg-amber-400/15"
      />
    </div>
  );
}
