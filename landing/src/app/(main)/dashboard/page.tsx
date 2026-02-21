"use client";

import { Button } from "@/components/ui/button";
import { PaymentLinkGenerator } from "@/components/payment-link-generator";
import { useFreighter } from "@/hooks/useFreighter";
import { useRouter } from "next/navigation";

export default function DashboardPage() {
  const router = useRouter();
  const { publicKey, connect, disconnect, isConnecting } = useFreighter();

  if (!publicKey) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
        <h1 className="text-xl font-medium">Dashboard</h1>
        <p className="text-muted-foreground">Connect your Stellar wallet to create payment links.</p>
        <Button onClick={connect} disabled={isConnecting}>
          {isConnecting ? "Connecting…" : "Connect with Freighter"}
        </Button>
        <Button variant="outline" onClick={() => router.push("/")}>
          Back to home
        </Button>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center p-6 md:p-10">
      <div className="w-full max-w-2xl flex items-center justify-between mb-8">
        <h1 className="text-xl font-medium">Dashboard</h1>
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => router.push("/")}>
            Home
          </Button>
          <Button variant="ghost" onClick={disconnect}>
            Disconnect
          </Button>
        </div>
      </div>
      <div className="w-full max-w-2xl">
        <PaymentLinkGenerator creatorPublicKey={publicKey} />
      </div>
    </div>
  );
}
