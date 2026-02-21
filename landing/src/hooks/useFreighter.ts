/**
 * useFreighter – Connect to Freighter wallet (Stellar browser extension)
 * When user clicks "Connect Wallet", prompts Freighter to connect and returns address.
 * @see https://developers.stellar.org/docs/build/guides/freighter/integrate-freighter-react
 */

import { useState, useCallback, useEffect } from "react";

const FREIGHTER_INSTALL_URL = "https://www.freighter.app/";

export interface UseFreighterResult {
  /** Current Stellar address when connected */
  publicKey: string | null;
  /** Connect to Freighter; prompts user to allow the site. Returns address or null on cancel/error */
  connect: () => Promise<string | null>;
  /** Disconnect (clear stored address in this app only) */
  disconnect: () => void;
  /** True while connect() is in progress */
  isConnecting: boolean;
  /** True if Freighter extension is available */
  isAvailable: boolean;
  /** Truncated address for display, e.g. "GABC...XYZ" */
  truncatedAddress: string | null;
}

function truncateAddress(addr: string, start = 4, end = 4): string {
  if (addr.length <= start + end) return addr;
  return `${addr.slice(0, start)}...${addr.slice(-end)}`;
}

export function useFreighter(): UseFreighterResult {
  const [publicKey, setPublicKey] = useState<string | null>(null);
  const [isConnecting, setIsConnecting] = useState(false);
  const [isAvailable, setIsAvailable] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const check = async () => {
      try {
        const Freighter = (await import("@stellar/freighter-api")).default;
        const res = await Freighter.isConnected();
        setIsAvailable(res?.isConnected ?? false);
        if (res?.isConnected) {
          const addrRes = await Freighter.getAddress();
          if (addrRes?.address && !addrRes?.error) setPublicKey(addrRes.address);
        }
      } catch {
        setIsAvailable(false);
      }
    };
    check();
  }, []);

  const connect = useCallback(async (): Promise<string | null> => {
    if (typeof window === "undefined") return null;
    setIsConnecting(true);
    try {
      const Freighter = (await import("@stellar/freighter-api")).default;
      const res = await Freighter.requestAccess();
      if (res?.address && !res?.error) {
        setPublicKey(res.address);
        setIsAvailable(true);
        return res.address;
      }
      if (res?.error) {
        const msg = String(res.error?.message ?? res.error);
        if (
          msg.toLowerCase().includes("not installed") ||
          msg.toLowerCase().includes("freighter")
        ) {
          window.open(FREIGHTER_INSTALL_URL, "_blank");
        }
      }
      return null;
    } catch (err) {
      const message = err instanceof Error ? err.message : String(err);
      if (
        message.toLowerCase().includes("not installed") ||
        message.toLowerCase().includes("freighter")
      ) {
        window.open(FREIGHTER_INSTALL_URL, "_blank");
      }
      console.warn("Freighter connect error:", err);
      return null;
    } finally {
      setIsConnecting(false);
    }
  }, []);

  const disconnect = useCallback(() => {
    setPublicKey(null);
  }, []);

  const truncatedAddress = publicKey ? truncateAddress(publicKey) : null;

  return {
    publicKey,
    connect,
    disconnect,
    isConnecting,
    isAvailable,
    truncatedAddress,
  };
}
