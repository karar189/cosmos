/**
 * useFreighter – Connect to Freighter wallet (Stellar browser extension)
 * When user clicks "Connect Wallet", prompts Freighter to connect and returns address.
 * @see https://developers.stellar.org/docs/build/guides/freighter/integrate-freighter-react
 */

import { useState, useCallback, useEffect } from "react";
import { getAddress, isConnected, requestAccess } from "@stellar/freighter-api";

const FREIGHTER_INSTALL_URL = "https://www.freighter.app/";
const FREIGHTER_PUBLIC_KEY_STORAGE_KEY = "freighter_public_key";
const FREIGHTER_DISCONNECTED_STORAGE_KEY = "freighter_disconnected";
const FREIGHTER_STATE_EVENT = "freighter-state-changed";

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

    const setStoredPublicKey = (value: string | null) => {
      if (value) {
        localStorage.setItem(FREIGHTER_PUBLIC_KEY_STORAGE_KEY, value);
        localStorage.removeItem(FREIGHTER_DISCONNECTED_STORAGE_KEY);
      } else {
        localStorage.removeItem(FREIGHTER_PUBLIC_KEY_STORAGE_KEY);
      }
      window.dispatchEvent(new CustomEvent(FREIGHTER_STATE_EVENT, { detail: { publicKey: value } }));
    };

    const onFreighterStateChanged = (e: Event) => {
      const event = e as CustomEvent<{ publicKey?: string | null }>;
      if (typeof event.detail?.publicKey === "string") {
        setPublicKey(event.detail.publicKey);
        return;
      }
      if (event.detail?.publicKey === null) {
        setPublicKey(null);
      }
    };
    window.addEventListener(FREIGHTER_STATE_EVENT, onFreighterStateChanged as EventListener);

    const disconnectedByUser = localStorage.getItem(FREIGHTER_DISCONNECTED_STORAGE_KEY) === "true";
    const cachedPublicKey = localStorage.getItem(FREIGHTER_PUBLIC_KEY_STORAGE_KEY);
    if (cachedPublicKey) setPublicKey(cachedPublicKey);

    const check = async () => {
      try {
        const res = await isConnected();
        setIsAvailable(res?.isConnected ?? false);
        // Respect explicit in-app disconnect: don't auto-reconnect until user clicks Connect.
        if (res?.isConnected && !disconnectedByUser) {
          const addrRes = await getAddress();
          if (addrRes?.address && !addrRes?.error) {
            setPublicKey(addrRes.address);
            setStoredPublicKey(addrRes.address);
          }
        }
      } catch {
        setIsAvailable(false);
      }
    };
    check();
    return () => {
      window.removeEventListener(FREIGHTER_STATE_EVENT, onFreighterStateChanged as EventListener);
    };
  }, []);

  const connect = useCallback(async (): Promise<string | null> => {
    if (typeof window === "undefined") return null;
    setIsConnecting(true);
    try {
      const res = await requestAccess();
      if (res?.address && !res?.error) {
        setPublicKey(res.address);
        setIsAvailable(true);
        localStorage.setItem(FREIGHTER_PUBLIC_KEY_STORAGE_KEY, res.address);
        localStorage.removeItem(FREIGHTER_DISCONNECTED_STORAGE_KEY);
        window.dispatchEvent(new CustomEvent(FREIGHTER_STATE_EVENT, { detail: { publicKey: res.address } }));
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
    if (typeof window !== "undefined") {
      void fetch("/api/auth/logout", { method: "POST", credentials: "same-origin" }).catch(() => {});
      localStorage.removeItem(FREIGHTER_PUBLIC_KEY_STORAGE_KEY);
      localStorage.setItem(FREIGHTER_DISCONNECTED_STORAGE_KEY, "true");
      window.dispatchEvent(new CustomEvent(FREIGHTER_STATE_EVENT, { detail: { publicKey: null } }));
    }
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
