#!/usr/bin/env bash
# Deploy PoolManager and EscrowEngine to Stellar MAINNET from the CLI.
#
# Prerequisites:
#   1. Stellar CLI installed: https://developers.stellar.org/docs/tools/cli/stellar-cli
#   2. A MAINNET account with XLM (real funds). Create/import a key:
#      stellar keys generate deployer-mainnet --network mainnet
#      # Then fund it with XLM via an exchange or another wallet (no faucet on mainnet).
#   3. Built WASM (run from repo root or contracts/):
#      cd soroban/contracts && cargo build --target wasm32v1-none --release
#
# Usage:
#   cd soroban/contracts
#   ./deploy-mainnet.sh [SOURCE_KEY_NAME_OR_SECRET] [pool|escrow]
#   pool   = deploy only PoolManager
#   escrow = deploy only EscrowEngine
#   (omit) = deploy both
#
# If you don't pass a source, the script uses SOURCE_KEY or SOROBAN_SECRET_KEY from the environment.
#
# Mainnet requires an RPC URL (CLI has no default). The script uses
# https://soroban-mainnet.stellar.org unless you set SOROBAN_RPC_MAINNET.
#
# If you get DNS/connection errors, try an alternative (no API key needed):
#   SOROBAN_RPC_MAINNET=https://soroban-rpc.mainnet.stellar.gateway.fm ./deploy-mainnet.sh deployer-mainnet
# Or with ValidationCloud (requires API key): https://mainnet.stellar.validationcloud.io/v1/<your-api-key>
# Or GetBlock Stellar Mainnet: https://go.getblock.us/<your-endpoint-id>
#
# Use https:// (not http://), port 443. Network passphrase: Public Global Stellar Network ; September 2015
#
# Balance: Have at least ~25-30 XLM on the deployer account. Some RPCs (e.g. gateway.fm) return
# high resource-fee estimates for contract install; with only 20-22 XLM you may see TxInsufficientBalance.
# If you see InsufficientRefundableFee, do not set RESOURCE_FEE (let the CLI use the simulated fee)
# and ensure the account has 25-30+ XLM. Optional: set RESOURCE_FEE_STROOPS and/or INCLUSION_FEE_STROOPS
# to override fees (1 XLM = 10_000_000 stroops).
#
# Timeouts/400s: The CLI has no configurable request timeout. If you see "Request timeout" or
# "status_code: 400", the script retries. Set DEPLOY_RETRIES=5 and DEPLOY_RETRY_DELAY=60
# to wait longer between retries (default: 3 retries, 30s delay).

set -e

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
cd "$SCRIPT_DIR"

TARGET_DIR="target/wasm32v1-none/release"
POOL_WASM="$TARGET_DIR/poolmanager.wasm"
ESCROW_WASM="$TARGET_DIR/escrowengine.wasm"

SOURCE="${1:-${SOURCE_KEY:-$SOROBAN_SECRET_KEY}}"
DEPLOY_WHICH="${2:-all}"   # all | pool | escrow

if [ -z "$SOURCE" ]; then
  echo "Usage: $0 [SOURCE_KEY_NAME_OR_SECRET] [pool|escrow]"
  echo "  pool   = deploy only PoolManager"
  echo "  escrow = deploy only EscrowEngine"
  echo "  (omit second arg) = deploy both"
  echo "  Or set SOURCE_KEY or SOROBAN_SECRET_KEY in the environment."
  echo ""
  echo "One-time setup (create a mainnet deployer key and fund it with XLM):"
  echo "  stellar keys generate deployer-mainnet --network mainnet"
  echo "  # Fund the account with XLM (no mainnet faucet — use an exchange or wallet)."
  echo ""
  echo "Then run: $0 deployer-mainnet   (or $0 deployer-mainnet pool  for PoolManager only)"
  exit 1
fi

if ! command -v stellar &> /dev/null; then
  echo "Stellar CLI not found. Install it first: https://developers.stellar.org/docs/tools/cli/stellar-cli"
  exit 1
fi

case "$DEPLOY_WHICH" in
  pool)   [ ! -f "$POOL_WASM" ] && { echo "WASM not found: $POOL_WASM"; exit 1; } ;;
  escrow) [ ! -f "$ESCROW_WASM" ] && { echo "WASM not found: $ESCROW_WASM"; exit 1; } ;;
  all)
    if [ ! -f "$POOL_WASM" ] || [ ! -f "$ESCROW_WASM" ]; then
      echo "WASM files not found. Build first (Soroban needs wasm32v1-none):"
      echo "  cargo build --target wasm32v1-none --release"
      exit 1
    fi ;;
  *) echo "Unknown target: $DEPLOY_WHICH (use pool, escrow, or omit for both)"; exit 1 ;;
esac

# Mainnet has no default RPC in the CLI ("Bring Your Own"); set explicitly.
# Default: stellar.org. Override with SOROBAN_RPC_MAINNET if you get connection errors.
SOROBAN_RPC_MAINNET="${SOROBAN_RPC_MAINNET:-https://soroban-mainnet.stellar.org}"
MAINNET_PASSPHRASE="Public Global Stellar Network ; September 2015"

# Optional fee overrides (stroops; 1 XLM = 10_000_000). Leave unset to use simulated fees.
EXTRA_ARGS=()
[ -n "${RESOURCE_FEE_STROOPS:-}" ] && EXTRA_ARGS+=(--resource-fee "$RESOURCE_FEE_STROOPS")
[ -n "${INCLUSION_FEE_STROOPS:-}" ] && EXTRA_ARGS+=(--inclusion-fee "$INCLUSION_FEE_STROOPS")

# Retries for timeout/400 (CLI has no request-timeout setting). Increase to wait longer.
DEPLOY_RETRIES="${DEPLOY_RETRIES:-3}"
DEPLOY_RETRY_DELAY="${DEPLOY_RETRY_DELAY:-30}"

run_deploy() {
  local wasm="$1"
  stellar contract deploy --wasm "$wasm" --source "$SOURCE" --rpc-url "$SOROBAN_RPC_MAINNET" --network-passphrase "$MAINNET_PASSPHRASE" "${EXTRA_ARGS[@]}"
}

# Streams deploy output to the terminal and saves to LOGFILE for parsing contract ID.
# Retries on timeout/400. You see all logs in real time.
retry_deploy() {
  local wasm="$1" name="$2" logfile="$3" i=1
  while true; do
    echo "Attempt $i/$DEPLOY_RETRIES: $name..."
    if run_deploy "$wasm" 2>&1 | tee "$logfile"; then
      return 0
    fi
    local out
    out=$(cat "$logfile")
    if [[ "$out" =~ (Request timeout|submission timeout|status_code: 400|Transport) ]] && [ "$i" -lt "$DEPLOY_RETRIES" ]; then
      echo "Retrying in ${DEPLOY_RETRY_DELAY}s..."
      sleep "$DEPLOY_RETRY_DELAY"
      i=$((i + 1))
    else
      echo "Deploy failed. Last output (see above for full logs):"
      echo "$out"
      return 1
    fi
  done
}

POOL_LOG=$(mktemp)
ESCROW_LOG=$(mktemp)
trap 'rm -f "$POOL_LOG" "$ESCROW_LOG"' EXIT

echo "Deploying to Stellar MAINNET (source: ${SOURCE:0:8}..., RPC: $SOROBAN_RPC_MAINNET) [target: $DEPLOY_WHICH]"
echo "Retries: $DEPLOY_RETRIES, delay: ${DEPLOY_RETRY_DELAY}s (set DEPLOY_RETRIES/DEPLOY_RETRY_DELAY to change)"
echo ""

POOL_ID=""
ESCROW_ID=""

if [ "$DEPLOY_WHICH" = "pool" ] || [ "$DEPLOY_WHICH" = "all" ]; then
  echo "1/2 Deploying PoolManager..."
  retry_deploy "$POOL_WASM" "PoolManager" "$POOL_LOG"
  POOL_ID=$(grep -oE 'C[A-Z0-9]{55}' "$POOL_LOG" | tail -1 || echo "")
  echo "   -> Contract ID: $POOL_ID"
  echo ""
fi

if [ "$DEPLOY_WHICH" = "escrow" ] || [ "$DEPLOY_WHICH" = "all" ]; then
  if [ "$DEPLOY_WHICH" = "escrow" ]; then
    echo "Deploying EscrowEngine..."
  else
    echo "2/2 Deploying EscrowEngine..."
  fi
  retry_deploy "$ESCROW_WASM" "EscrowEngine" "$ESCROW_LOG"
  ESCROW_ID=$(grep -oE 'C[A-Z0-9]{55}' "$ESCROW_LOG" | tail -1 || echo "")
  echo "   -> Contract ID: $ESCROW_ID"
  echo ""
fi

echo "Done. Save these contract IDs for your app (mainnet):"
[ -n "$POOL_ID" ] && echo "  POOLMANAGER_CONTRACT_ID=$POOL_ID"
[ -n "$ESCROW_ID" ] && echo "  ESCROW_ENGINE_CONTRACT_ID=$ESCROW_ID"
[ -n "$POOL_ID" ] && echo ""
[ -n "$POOL_ID" ] && echo "Explorer: https://steexp.com/contract/$POOL_ID (PoolManager)"
