#!/usr/bin/env bash
# Deploy PoolManager and EscrowEngine to Stellar testnet from the CLI.
#
# Prerequisites:
#   1. Stellar CLI installed: https://developers.stellar.org/docs/tools/cli/stellar-cli
#   2. A funded testnet account. One-time setup:
#      stellar keys generate deployer --network testnet
#      stellar keys fund deployer --network testnet
#   3. Built WASM (run from repo root or contracts/):
#      cd soroban-escrow/contracts && cargo build --target wasm32-unknown-unknown --release
#
# Usage:
#   cd soroban-escrow/contracts
#   ./deploy-testnet.sh [SOURCE_KEY_NAME_OR_SECRET]
#
# If you don't pass a source, the script uses SOURCE_KEY or SOROBAN_SECRET_KEY from the environment.

set -e

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
cd "$SCRIPT_DIR"

# Soroban requires wasm32v1-none (not wasm32-unknown-unknown)
TARGET_DIR="target/wasm32v1-none/release"
POOL_WASM="$TARGET_DIR/poolmanager.wasm"
ESCROW_WASM="$TARGET_DIR/escrowengine.wasm"

SOURCE="${1:-${SOURCE_KEY:-$SOROBAN_SECRET_KEY}}"

if [ -z "$SOURCE" ]; then
  echo "Usage: $0 [SOURCE_KEY_NAME_OR_SECRET]"
  echo "  Or set SOURCE_KEY or SOROBAN_SECRET_KEY in the environment."
  echo ""
  echo "One-time setup (create and fund a testnet deployer key):"
  echo "  stellar keys generate deployer --network testnet"
  echo "  stellar keys fund deployer --network testnet"
  echo ""
  echo "Then run: $0 deployer   (or pass your secret key, or set SOURCE_KEY)"
  exit 1
fi

if ! command -v stellar &> /dev/null; then
  echo "Stellar CLI not found. Install it first: https://developers.stellar.org/docs/tools/cli/stellar-cli"
  exit 1
fi

if [ ! -f "$POOL_WASM" ] || [ ! -f "$ESCROW_WASM" ]; then
  echo "WASM files not found. Build first (Soroban needs wasm32v1-none):"
  echo "  cargo build --target wasm32v1-none --release"
  exit 1
fi

echo "Deploying to Stellar testnet (source: ${SOURCE:0:8}...)"
echo ""

echo "1/2 Deploying PoolManager..."
POOL_OUTPUT=$(stellar contract deploy --wasm "$POOL_WASM" --network testnet --source "$SOURCE")
echo "$POOL_OUTPUT"
POOL_ID=$(echo "$POOL_OUTPUT" | grep -oE 'C[A-Z0-9]{55}' | tail -1 || echo "")
echo "   -> Contract ID: $POOL_ID"
echo ""

echo "2/2 Deploying EscrowEngine..."
ESCROW_OUTPUT=$(stellar contract deploy --wasm "$ESCROW_WASM" --network testnet --source "$SOURCE")
echo "$ESCROW_OUTPUT"
ESCROW_ID=$(echo "$ESCROW_OUTPUT" | grep -oE 'C[A-Z0-9]{55}' | tail -1 || echo "")
echo "   -> Contract ID: $ESCROW_ID"
echo ""

echo "Done. Save these contract IDs for your app:"
echo "  POOLMANAGER_CONTRACT_ID=$POOL_ID"
echo "  ESCROW_ENGINE_CONTRACT_ID=$ESCROW_ID"
