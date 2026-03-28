#!/bin/bash
# =============================================================
# Day 2 — Poseidon preimage circuit
# The Hypertron commitment scheme in ZK circuit form
# =============================================================

set -e
cd "$(dirname "$0")"

echo ""
echo "======================================"
echo " SETUP: Install circomlib"
echo "======================================"
# circomlib = standard library of ZK circuits
# Includes: Poseidon, MiMC, EdDSA, Merkle proofs, comparators...
# This is what Nethermind's circuits also use.
npm install --silent
echo "✅ circomlib installed"

echo ""
echo "======================================"
echo " STEP 0: Compute expected leaf"
echo "======================================"
# Before we generate a proof, let's see what the Poseidon hash
# of our inputs should be. This is what the contract computes.
node compute_leaf.js

echo ""
echo "======================================"
echo " STEP 1: Compile the circuit"
echo "======================================"
# -l node_modules tells circom where to find circomlib includes
circom commitment.circom --r1cs --wasm --sym \
    -l node_modules \
    --output build/
echo "✅ Circuit compiled"
echo ""
echo "Constraint count:"
snarkjs r1cs info build/commitment.r1cs

echo ""
echo "======================================"
echo " STEP 2: Trusted Setup"
echo "======================================"
snarkjs powersoftau new bn128 14 pot14_0000.ptau -v 2>&1 | tail -3
snarkjs powersoftau contribute pot14_0000.ptau pot14_0001.ptau \
    --name="Day2 Phase1" -e="poseidon entropy" 2>&1 | tail -3
snarkjs powersoftau prepare phase2 pot14_0001.ptau pot14_final.ptau -v 2>&1 | tail -3
snarkjs groth16 setup build/commitment.r1cs pot14_final.ptau circuit_0000.zkey 2>&1 | tail -3
snarkjs zkey contribute circuit_0000.zkey circuit_final.zkey \
    --name="Day2 Phase2" -e="more poseidon entropy" 2>&1 | tail -3
snarkjs zkey export verificationkey circuit_final.zkey verification_key.json 2>&1 | tail -2
echo "✅ Keys generated"

echo ""
echo "======================================"
echo " STEP 3: Generate witness"
echo "======================================"
node build/commitment_js/generate_witness.js \
    build/commitment_js/commitment.wasm \
    input.json \
    witness.wtns
echo "✅ Witness generated"

echo ""
echo "======================================"
echo " STEP 4: Generate proof"
echo "======================================"
snarkjs groth16 prove circuit_final.zkey witness.wtns proof.json public.json
echo "✅ Proof generated"
echo ""
echo "📄 public.json contains the leaf (Poseidon hash):"
cat public.json
echo ""
echo "📄 proof.json contains 3 curve points (your ZK proof):"
echo "   pi_a, pi_b, pi_c — no secret, no nullifier, no amount"

echo ""
echo "======================================"
echo " STEP 5: Verify the proof"
echo "======================================"
snarkjs groth16 verify verification_key.json public.json proof.json
echo "✅ PROOF VALID — you proved knowledge of Poseidon preimage"

echo ""
echo "======================================"
echo " STEP 6: Cheat test — wrong leaf"
echo "======================================"
echo "Trying to claim the leaf is 999 (it's not)..."
echo '["999"]' > fake_leaf.json
snarkjs groth16 verify verification_key.json fake_leaf.json proof.json \
    && echo "❌ Cheat succeeded (bad!)" \
    || echo "✅ Cheat REJECTED — proof is bound to the real leaf"

echo ""
echo "======================================"
echo " STEP 7: Cheat test — wrong secret"
echo "======================================"
echo "What if someone tries to use a DIFFERENT secret?"
echo "They'd need to generate a new proof. But the leaf is fixed."
echo "They can't produce a valid proof for the on-chain leaf"
echo "without knowing the original secret and nullifier."
echo ""
echo "This is the core security property:"
echo "  On-chain: leaf = 0x$(cat public.json | tr -d '["]\n')"
echo "  To withdraw: prove you know secret + nullifier → that leaf"
echo "  Without that knowledge: mathematically impossible."

echo ""
echo "=================================================="
echo " ALL DONE — Day 2 complete"
echo "=================================================="
echo ""
echo "What this circuit IS in Hypertron:"
echo "  contract stores: leaf (public)"
echo "  you keep:        secret + nullifier (private)"
echo "  to withdraw:     prove Poseidon(secret, nullifier, amount) = leaf"
echo ""
echo "Next: Day 3 — Add Merkle proof to the circuit"
echo "      Proves the leaf actually EXISTS in the pool"
