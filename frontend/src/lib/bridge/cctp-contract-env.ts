import type { BridgeChainId, CctpContracts, CctpNetworkMode } from "@/lib/bridge/cctp-config";

const BRIDGE_KIT_CHAIN_NAMES: Record<CctpNetworkMode, Record<BridgeChainId, string>> = {
  mainnet: {
    stellar: "Stellar",
    ethereum: "Ethereum",
    avalanche: "Avalanche",
    solana: "Solana",
  },
  testnet: {
    stellar: "Stellar_Testnet",
    ethereum: "Ethereum_Sepolia",
    avalanche: "Avalanche_Fuji",
    solana: "Solana_Devnet",
  },
};

/** Circle CCTP public contract IDs — defaults from frontend/.env.example (overridable via .env). */
const CCTP_CONTRACT_DEFAULTS: Record<CctpNetworkMode, Omit<CctpContracts, "bridgeKitChainName">> = {
  testnet: {
    stellar: {
      tokenMessengerMinter: "CDNG7HXAPBWICI2E3AUBP3YZWZELJLYSB6F5CC7WLDTLTHVM74SLRTHP",
      messageTransmitter: "CBJ6MTCKKZG73PMDZCJMSFRD7DQEMI4FKDH7CGDSV4W6FHCRBCQAVVJY",
      cctpForwarder: "CA66Q2WFBND6V4UEB7RD4SAXSVIWMD6RA4X3U32ELVFGXV5PJK4T4VSZ",
      usdcContract: "CBIELTK6YBZJU5UP2WWQEUCYKLPU6AUNZ2BQ4WWFEIE3USCIHMXQDAMA",
    },
    evm: {
      tokenMessenger: "0x8FE6B999Dc680CcFDD5Bf7EB0974218be2542DAA",
      messageTransmitter: "0xE737e5cEBEEBa77EFE34D4aa090756590b1CE275",
      usdc: "0x1c7D4B196Cb0C7B01d743Fbc6116a902379C7238",
    },
    solana: {
      usdcMint: "4zMMC9srt5Ri5X14GAgXhaHii3GnPAEERYPJgZJDncDU",
    },
  },
  mainnet: {
    stellar: {
      tokenMessengerMinter: "CAE2G5Z77UP7GYPYGFOWFGW7C7J6I4YP2AFGSADRKQY62SYUFLPNFTXL",
      messageTransmitter: "CACMENFFJPJMSDAJQLX4R7K3SFZIW2LJSE3R2UMLGSWHFHS353FVXAZV",
      cctpForwarder: "CBZL2IH7F6BIDAA3WBNXYKIXSATJGMSW7K5P5MJ6STX5RXN47TZJDF5T",
      usdcContract: "CCW67TSZV3SSS2HXMBQ5JFGCKJNXKZM7UQUWUZPUTHXSTZLEO7SJMI75",
    },
    evm: {
      tokenMessenger: "0x28b5a0e9C621a5BadaA536219b3a228C8168cf5d",
      messageTransmitter: "0x81D40F21F12A8F0E3252Bccb954D722d4c464B64",
      usdc: "0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48",
    },
    solana: {
      usdcMint: "EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v",
    },
  },
};

function pickEnv(override: string | undefined, fallback: string): string {
  const value = override?.trim();
  return value || fallback;
}

function loadTestnetContracts(): Omit<CctpContracts, "bridgeKitChainName"> {
  const defaults = CCTP_CONTRACT_DEFAULTS.testnet;
  return {
    stellar: {
      tokenMessengerMinter: pickEnv(
        process.env.NEXT_PUBLIC_CCTP_TESTNET_STELLAR_TOKEN_MESSENGER,
        defaults.stellar.tokenMessengerMinter
      ),
      messageTransmitter: pickEnv(
        process.env.NEXT_PUBLIC_CCTP_TESTNET_STELLAR_MESSAGE_TRANSMITTER,
        defaults.stellar.messageTransmitter
      ),
      cctpForwarder: pickEnv(
        process.env.NEXT_PUBLIC_CCTP_TESTNET_STELLAR_FORWARDER,
        defaults.stellar.cctpForwarder
      ),
      usdcContract: pickEnv(
        process.env.NEXT_PUBLIC_CCTP_TESTNET_STELLAR_USDC_CONTRACT,
        defaults.stellar.usdcContract
      ),
    },
    evm: {
      tokenMessenger: pickEnv(
        process.env.NEXT_PUBLIC_CCTP_TESTNET_EVM_TOKEN_MESSENGER,
        defaults.evm.tokenMessenger
      ) as `0x${string}`,
      messageTransmitter: pickEnv(
        process.env.NEXT_PUBLIC_CCTP_TESTNET_EVM_MESSAGE_TRANSMITTER,
        defaults.evm.messageTransmitter
      ) as `0x${string}`,
      usdc: pickEnv(process.env.NEXT_PUBLIC_CCTP_TESTNET_EVM_USDC, defaults.evm.usdc) as `0x${string}`,
    },
    solana: {
      usdcMint: pickEnv(
        process.env.NEXT_PUBLIC_CCTP_TESTNET_SOLANA_USDC_MINT,
        defaults.solana.usdcMint
      ),
    },
  };
}

function loadMainnetContracts(): Omit<CctpContracts, "bridgeKitChainName"> {
  const defaults = CCTP_CONTRACT_DEFAULTS.mainnet;
  return {
    stellar: {
      tokenMessengerMinter: pickEnv(
        process.env.NEXT_PUBLIC_CCTP_MAINNET_STELLAR_TOKEN_MESSENGER,
        defaults.stellar.tokenMessengerMinter
      ),
      messageTransmitter: pickEnv(
        process.env.NEXT_PUBLIC_CCTP_MAINNET_STELLAR_MESSAGE_TRANSMITTER,
        defaults.stellar.messageTransmitter
      ),
      cctpForwarder: pickEnv(
        process.env.NEXT_PUBLIC_CCTP_MAINNET_STELLAR_FORWARDER,
        defaults.stellar.cctpForwarder
      ),
      usdcContract: pickEnv(
        process.env.NEXT_PUBLIC_CCTP_MAINNET_STELLAR_USDC_CONTRACT,
        defaults.stellar.usdcContract
      ),
    },
    evm: {
      tokenMessenger: pickEnv(
        process.env.NEXT_PUBLIC_CCTP_MAINNET_EVM_TOKEN_MESSENGER,
        defaults.evm.tokenMessenger
      ) as `0x${string}`,
      messageTransmitter: pickEnv(
        process.env.NEXT_PUBLIC_CCTP_MAINNET_EVM_MESSAGE_TRANSMITTER,
        defaults.evm.messageTransmitter
      ) as `0x${string}`,
      usdc: pickEnv(process.env.NEXT_PUBLIC_CCTP_MAINNET_EVM_USDC, defaults.evm.usdc) as `0x${string}`,
    },
    solana: {
      usdcMint: pickEnv(
        process.env.NEXT_PUBLIC_CCTP_MAINNET_SOLANA_USDC_MINT,
        defaults.solana.usdcMint
      ),
    },
  };
}

export function loadCctpContractsFromEnv(mode: CctpNetworkMode): CctpContracts {
  const contracts = mode === "mainnet" ? loadMainnetContracts() : loadTestnetContracts();
  return {
    ...contracts,
    bridgeKitChainName: BRIDGE_KIT_CHAIN_NAMES[mode],
  };
}

export function readOptionalEurcAddress(mode: CctpNetworkMode): string | undefined {
  const value =
    mode === "mainnet"
      ? process.env.NEXT_PUBLIC_CCTP_MAINNET_EURC?.trim()
      : process.env.NEXT_PUBLIC_CCTP_TESTNET_EURC?.trim();
  return value || undefined;
}
