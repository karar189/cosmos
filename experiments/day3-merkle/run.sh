#!/bin/bash
# =============================================================
# Day 3 — Merkle Inclusion Proof Circuit
# =============================================================

set -e
cd "$(dirname "$0")"

echo ""
echo "======================================"
echo " SETUP"
echo "======================================"
npm install --silent
echo "✅ Dependencies installed"

echo ""
echo "======================================"
echo " STEP 0: Build the Merkle tree"
echo "======================================"
# Builds a depth-3 tree with 8 leaves using Poseidon
# Computes the path (siblings + indices) for leaf at index 2
# Writes input.json for the circuit
node build_tree.js

echo ""
echo "======================================"
echo " STEP 1: Compile the circuit"
echo "======================================"
circom merkle_inclusion.circom --r1cs --wasm --sym \
    -l node_modules \
    --output build/
echo "✅ Circuit compiled"
echo ""
snarkjs r1cs info build/merkle_inclusion.r1cs

echo ""
echo "======================================"
echo " STEP 2: Trusted Setup"
echo "======================================"
snarkjs powersoftau new bn128 14 pot14_0000.ptau 2>&1 | tail -2
snarkjs powersoftau contribute pot14_0000.ptau pot14_0001.ptau \
    --name="Day3" -e="merkle entropy" 2>&1 | tail -2
snarkjs powersoftau prepare phase2 pot14_0001.ptau pot14_final.ptau 2>&1 | tail -2
snarkjs groth16 setup build/merkle_inclusion.r1cs pot14_final.ptau circuit_0000.zkey 2>&1 | tail -2
snarkjs zkey contribute circuit_0000.zkey circuit_final.zkey \
    --name="Day3 Phase2" -e="more merkle entropy" 2>&1 | tail -2
snarkjs zkey export verificationkey circuit_final.zkey verification_key.json 2>&1 | tail -2
echo "✅ Keys generated"

echo ""
echo "======================================"
echo " STEP 3: Generate witness"
echo "======================================"
node build/merkle_inclusion_js/generate_witness.js \
    build/merkle_inclusion_js/merkle_inclusion.wasm \
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
echo "📄 public.json (root — the only thing the verifier sees):"
cat public.json

echo ""
echo "======================================"
echo " STEP 5: Verify the proof"
echo "======================================"
snarkjs groth16 verify verification_key.json public.json proof.json
echo "✅ PROOF VALID — leaf exists in the tree at the claimed root"
echo "   The verifier does NOT know which leaf or which position"

echo ""
echo "======================================"
echo " STEP 6: Cheat test — wrong root"
echo "======================================"
echo "Trying to prove inclusion against a FAKE root..."
echo '["999"]' > fake_root.json
snarkjs groth16 verify verification_key.json fake_root.json proof.json \
    && echo "❌ Accepted (bad!)" \
    || echo "✅ REJECTED — proof only valid for the real root"

echo ""
echo "======================================"
echo " STEP 7: Cheat test — fake sibling"
echo "======================================"
echo "What if we swap our leaf's sibling with a fake value?"
echo "We'd need to provide a different path. But then the"
echo "recomputed root won't match. The constraint:"
echo "  root === levelHashes[depth]"
echo "will fail — the proof won't generate at all."
echo ""
echo "Key insight: the path elements are PRIVATE."
echo "The verifier only sees the root and the proof."
echo "The leaf's position is completely hidden."

echo ""
echo "=================================================="
echo " ALL DONE — Day 3 complete"
echo "=================================================="
echo ""
echo "What you now have:"
echo ""
echo "  Day 2: Poseidon(secret, nullifier, amount) = leaf    ← you know the preimage"
echo "  Day 3: leaf exists in the tree at root R             ← the leaf was deposited"
echo ""
echo "Day 4 combines BOTH into one proof."
echo "That is the complete Hypertron withdrawal circuit."
