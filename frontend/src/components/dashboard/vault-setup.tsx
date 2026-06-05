"use client";

import { useState, useEffect, useCallback } from "react";
import {
  Vault,
  Shield,
  ShieldCheck,
  Wallet,
  CheckCircle2,
  AlertCircle,
  Loader2,
  Copy,
  ExternalLink,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

interface VaultSetupProps {
  businessId: string;
  userWalletAddress: string | null;
  onVaultCreated?: () => void;
}

type VaultType = "custodial" | "hybrid" | "external";

interface VaultInfo {
  hasVault: boolean;
  vaultAddress: string | null;
  vaultType: VaultType | null;
  vaultName: string | null;
  vaultCoSigner: string | null;
  balance: {
    xlm: string;
    usdc: string;
    xlmRaw: number;
    usdcRaw: number;
  } | null;
  network: string;
}

export function VaultSetup({ businessId, userWalletAddress, onVaultCreated }: VaultSetupProps) {
  const [vaultInfo, setVaultInfo] = useState<VaultInfo | null>(null);
  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const [selectedType, setSelectedType] = useState<VaultType>("custodial");
  const [externalAddress, setExternalAddress] = useState("");
  const [copied, setCopied] = useState(false);

  const fetchVaultInfo = useCallback(async () => {
    if (!businessId) return;
    try {
      const res = await fetch(`/api/vault/treasury?businessId=${businessId}`, {
        credentials: "same-origin",
      });
      if (res.ok) {
        const data = await res.json();
        setVaultInfo(data);
      }
    } catch (e) {
      console.error("Failed to fetch vault info:", e);
    } finally {
      setLoading(false);
    }
  }, [businessId]);

  useEffect(() => {
    fetchVaultInfo();
  }, [fetchVaultInfo]);

  async function handleCreateVault() {
    setError(null);
    setSuccess(null);
    setCreating(true);

    try {
      const body: Record<string, string> = {
        businessId,
        vaultType: selectedType,
      };

      if (selectedType === "hybrid") {
        if (!userWalletAddress) {
          setError("Connect your wallet to create a hybrid vault");
          return;
        }
        body.coSignerAddress = userWalletAddress;
      }

      if (selectedType === "external") {
        if (!externalAddress.trim() || !externalAddress.startsWith("G")) {
          setError("Enter a valid Stellar address (G...)");
          return;
        }
        body.externalAddress = externalAddress.trim();
      }

      const res = await fetch("/api/vault/treasury", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "same-origin",
        body: JSON.stringify(body),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Failed to create vault");
        return;
      }

      setSuccess(data.message || "Vault created successfully");
      await fetchVaultInfo();
      onVaultCreated?.();
    } catch (e) {
      setError("Failed to create vault");
    } finally {
      setCreating(false);
    }
  }

  function copyAddress() {
    if (vaultInfo?.vaultAddress) {
      navigator.clipboard.writeText(vaultInfo.vaultAddress);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="h-6 w-6 animate-spin text-white/30" />
      </div>
    );
  }

  if (vaultInfo?.hasVault) {
    return (
      <div className="flex flex-col gap-5 max-w-2xl">
        <div className="rounded-2xl border border-white/[0.12] bg-transparent p-6 backdrop-blur-xl">
          <div className="flex items-start gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-emerald-500/20 bg-emerald-500/10">
              <Vault className="h-5 w-5 text-emerald-400" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-white">{vaultInfo.vaultName || "Treasury Vault"}</p>
              <p className="text-xs text-white/40 mt-0.5 capitalize">
                {vaultInfo.vaultType} mode
                {vaultInfo.vaultType === "hybrid" && " · Requires your signature for withdrawals"}
                {vaultInfo.vaultType === "external" && " · Your own wallet"}
              </p>
            </div>
            <span className="inline-flex items-center gap-1 rounded-full bg-emerald-500/12 border border-emerald-500/20 text-emerald-400 px-2 py-0.5 text-[11px] font-medium">
              <CheckCircle2 className="h-3 w-3" /> Active
            </span>
          </div>

          <div className="mt-5 space-y-4">
            <div>
              <p className="text-xs text-white/40 mb-1.5">Vault Address</p>
              <div className="flex items-center gap-2">
                <code className="flex-1 rounded-lg border border-white/10 bg-white/5 px-3 py-2 font-mono text-xs text-white/80 truncate">
                  {vaultInfo.vaultAddress}
                </code>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={copyAddress}
                  className="shrink-0 h-8 w-8 p-0"
                >
                  {copied ? (
                    <CheckCircle2 className="h-4 w-4 text-emerald-400" />
                  ) : (
                    <Copy className="h-4 w-4 text-white/40" />
                  )}
                </Button>
                <a
                  href={`https://stellar.expert/explorer/${vaultInfo.network}/account/${vaultInfo.vaultAddress}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="shrink-0"
                >
                  <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                    <ExternalLink className="h-4 w-4 text-white/40" />
                  </Button>
                </a>
              </div>
            </div>

            {vaultInfo.balance && (
              <div className="grid grid-cols-2 gap-4">
                <div className="rounded-xl border border-white/10 bg-white/5 p-4">
                  <p className="text-xs text-white/40">USDC Balance</p>
                  <p className="text-2xl font-bold text-white mt-1">
                    {vaultInfo.balance.usdc}
                    <span className="ml-1 text-sm font-medium text-white/40">USDC</span>
                  </p>
                </div>
                <div className="rounded-xl border border-white/10 bg-white/5 p-4">
                  <p className="text-xs text-white/40">XLM Balance</p>
                  <p className="text-2xl font-bold text-white mt-1">
                    {vaultInfo.balance.xlm}
                    <span className="ml-1 text-sm font-medium text-white/40">XLM</span>
                  </p>
                </div>
              </div>
            )}

            {vaultInfo.vaultType === "hybrid" && vaultInfo.vaultCoSigner && (
              <div>
                <p className="text-xs text-white/40 mb-1.5">Your Co-Signer Wallet</p>
                <code className="block rounded-lg border border-white/10 bg-white/5 px-3 py-2 font-mono text-xs text-white/60 truncate">
                  {vaultInfo.vaultCoSigner}
                </code>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-5 max-w-2xl">
      <div className="rounded-2xl border border-white/[0.12] bg-transparent p-6 backdrop-blur-xl">
        <div className="flex items-start gap-3 mb-6">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-white/12 bg-white/[0.06]">
            <Vault className="h-5 w-5 text-cyan-400" />
          </div>
          <div>
            <p className="text-sm font-medium text-white">Create Treasury Vault</p>
            <p className="text-xs text-white/40 mt-0.5">
              Set up a dedicated Stellar account for your workspace to receive payments.
            </p>
          </div>
        </div>

        <RadioGroup
          value={selectedType}
          onValueChange={(v) => setSelectedType(v as VaultType)}
          className="space-y-3"
        >
          <label
            htmlFor="vault-custodial"
            className={`flex items-start gap-3 rounded-xl border p-4 cursor-pointer transition-colors ${
              selectedType === "custodial"
                ? "border-cyan-500/40 bg-cyan-500/5"
                : "border-white/10 bg-white/[0.02] hover:border-white/20"
            }`}
          >
            <RadioGroupItem value="custodial" id="vault-custodial" className="mt-0.5" />
            <div className="flex-1">
              <div className="flex items-center gap-2">
                <Shield className="h-4 w-4 text-cyan-400" />
                <span className="text-sm font-medium text-white">Custodial</span>
                <span className="text-[10px] uppercase tracking-wider text-cyan-400/60 bg-cyan-500/10 px-1.5 py-0.5 rounded">
                  Recommended
                </span>
              </div>
              <p className="text-xs text-white/40 mt-1">
                Hypertron manages your vault. Withdrawals are instant with one click.
              </p>
            </div>
          </label>

          <label
            htmlFor="vault-hybrid"
            className={`flex items-start gap-3 rounded-xl border p-4 cursor-pointer transition-colors ${
              selectedType === "hybrid"
                ? "border-cyan-500/40 bg-cyan-500/5"
                : "border-white/10 bg-white/[0.02] hover:border-white/20"
            }`}
          >
            <RadioGroupItem value="hybrid" id="vault-hybrid" className="mt-0.5" />
            <div className="flex-1">
              <div className="flex items-center gap-2">
                <ShieldCheck className="h-4 w-4 text-emerald-400" />
                <span className="text-sm font-medium text-white">Hybrid (Multisig)</span>
              </div>
              <p className="text-xs text-white/40 mt-1">
                Both you and Hypertron must sign withdrawals. Maximum security.
              </p>
              {selectedType === "hybrid" && !userWalletAddress && (
                <p className="text-xs text-amber-400 mt-2">
                  Connect your wallet first to use hybrid mode.
                </p>
              )}
            </div>
          </label>

          <label
            htmlFor="vault-external"
            className={`flex items-start gap-3 rounded-xl border p-4 cursor-pointer transition-colors ${
              selectedType === "external"
                ? "border-cyan-500/40 bg-cyan-500/5"
                : "border-white/10 bg-white/[0.02] hover:border-white/20"
            }`}
          >
            <RadioGroupItem value="external" id="vault-external" className="mt-0.5" />
            <div className="flex-1">
              <div className="flex items-center gap-2">
                <Wallet className="h-4 w-4 text-purple-400" />
                <span className="text-sm font-medium text-white">External Wallet</span>
              </div>
              <p className="text-xs text-white/40 mt-1">
                Use your own wallet. Payments go directly to your address.
              </p>
              {selectedType === "external" && (
                <div className="mt-3">
                  <Label htmlFor="external-address" className="text-xs text-white/50">
                    Your Stellar Address
                  </Label>
                  <input
                    id="external-address"
                    type="text"
                    placeholder="G..."
                    value={externalAddress}
                    onChange={(e) => setExternalAddress(e.target.value)}
                    className="mt-1.5 w-full h-9 rounded-lg border border-white/10 bg-white/5 px-3 font-mono text-xs text-white placeholder:text-white/30 focus:border-white/25 focus:outline-none"
                  />
                </div>
              )}
            </div>
          </label>
        </RadioGroup>

        {error && (
          <div className="mt-4 flex items-center gap-2 rounded-lg border border-red-500/20 bg-red-500/10 px-3 py-2">
            <AlertCircle className="h-4 w-4 text-red-400 shrink-0" />
            <p className="text-red-400 text-xs">{error}</p>
          </div>
        )}

        {success && (
          <div className="mt-4 flex items-center gap-2 rounded-lg border border-emerald-500/20 bg-emerald-500/[0.06] px-3 py-2">
            <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0" />
            <p className="text-emerald-400 text-xs">{success}</p>
          </div>
        )}

        <Button
          onClick={handleCreateVault}
          disabled={creating || (selectedType === "hybrid" && !userWalletAddress)}
          className="mt-5 w-full rounded-full border border-white/10 bg-foreground font-semibold text-background hover:opacity-90 disabled:opacity-40"
        >
          {creating ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Creating Vault...
            </>
          ) : (
            "Create Vault"
          )}
        </Button>
      </div>
    </div>
  );
}
