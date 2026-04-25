"use client";

import { Button } from "@/components/ui/button";
import { useFreighter } from "@/hooks/useFreighter";
import { useRouter } from "next/navigation";
import { DashboardMain } from "@/components/dashboard/layout/main";
import { ZkCommitmentPool } from "@/components/zk-commitment-pool";

export default function SecureVaultPage() {
  const router = useRouter();
  const { publicKey } = useFreighter();

  if (!publicKey) {
    return (
      <div className="flex min-h-[60vh] flex-col items-center justify-center gap-4">
        <p className="text-white/40 text-center text-sm">Connect your wallet to access the secure vault.</p>
        <Button onClick={() => router.push("/dashboard")}>Go to Dashboard</Button>
      </div>
    );
  }

  return (
    <DashboardMain>
      <div className="flex flex-col gap-8">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Secure Vault</h1>
          <p className="mt-1 text-sm text-white/40">Zero-knowledge commitment pool for private transactions.</p>
        </div>
        <ZkCommitmentPool publicKey={publicKey} />
      </div>
    </DashboardMain>
  );
}
