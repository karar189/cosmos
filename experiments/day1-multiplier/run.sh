#!/bin/bash
# =============================================================
# Day 1 — Full ZK proof pipeline for the multiplier circuit
# Run this after: npm install -g circom snarkjs
# =============================================================

set -e  # stop on any error
cd "$(dirname "$0")"

echo ""
echo "======================================"
echo " STEP 1: Compile the circuit"
echo "======================================"
# Circom compiles your .circom file into:
#   - .r1cs  = the math constraints (Rank-1 Constraint System)
#   - .wasm  = WebAssembly prover (runs in browser or Node.js)
#   - .sym   = symbol table (for debugging)
circom multiplier.circom --r1cs --wasm --sym --output build/
echo "✅ Circuit compiled"

echo ""
echo "======================================"
echo " STEP 2: Trusted Setup — Powers of Tau"
echo "======================================"
# This is the "ceremony" phase. In production you'd download
# a real one. For learning, we generate a tiny one (power=12).
#
# "Powers of Tau" is shared randomness that makes proofs secure.
# It's generated once and reused across many circuits.
snarkjs powersoftau new bn128 12 pot12_0000.ptau -v
snarkjs powersoftau contribute pot12_0000.ptau pot12_0001.ptau \
    --name="Sweta Phase1" -v -e="random entropy here"
snarkjs powersoftau prepare phase2 pot12_0001.ptau pot12_final.ptau -v
echo "✅ Powers of Tau ready"

echo ""
echo "======================================"
echo " STEP 3: Circuit-specific setup (Phase 2)"
echo "======================================"
# This ties the Powers of Tau to YOUR specific circuit.
# Output: a proving key (.zkey) and verification key (.json)
snarkjs groth16 setup build/multiplier.r1cs pot12_final.ptau circuit_0000.zkey
snarkjs zkey contribute circuit_0000.zkey circuit_final.zkey \
    --name="Sweta Phase2" -v -e="more random entropy"
snarkjs zkey export verificationkey circuit_final.zkey verification_key.json
echo "✅ Keys generated"

echo ""
echo "======================================"
echo " STEP 4: Generate the witness"
echo "======================================"
# Witness = the actual values that satisfy the circuit
# (a=3, b=11 → c=33). This is computed from input.json.
node build/multiplier_js/generate_witness.js \
    build/multiplier_js/multiplier.wasm \
    input.json \
    witness.wtns
echo "✅ Witness generated (a=3, b=11, c=33)"

echo ""
echo "======================================"
echo " STEP 5: Generate the ZK proof"
echo "======================================"
# This is the magic step. Using the witness + proving key,
# create a proof that you know a and b, without revealing them.
snarkjs groth16 prove circuit_final.zkey witness.wtns proof.json public.json
echo "✅ Proof generated"
echo ""
echo "📄 proof.json  = your ZK proof (send this to verifier)"
echo "📄 public.json = public inputs (c=33, everyone sees this)"

echo ""
echo "======================================"
echo " STEP 6: Verify the proof"
echo "======================================"
# Verifier checks: does this proof + public inputs = valid?
# Only needs: verification_key.json, public.json, proof.json
# Does NOT need: a, b (the secrets)
snarkjs groth16 verify verification_key.json public.json proof.json
echo ""
echo "✅ PROOF IS VALID — you proved knowledge of factors of 33"
echo "   The verifier never learned a=3 or b=11"

echo ""
echo "======================================"
echo " STEP 7: Try to cheat"
echo "======================================"
echo '["999"]' > fake_public.json
snarkjs groth16 verify verification_key.json fake_public.json proof.json \
    && echo "❌ Cheat succeeded (bad!)" \
    || echo "✅ Cheat REJECTED — proof only valid for c=33"

echo ""
echo "======================================"
echo " STEP 8: Export Solidity/on-chain verifier"
echo "======================================"
# This generates the actual verifier contract logic
# For Stellar/Soroban, we use BN254 precompiles instead,
# but this shows you what the verifier looks like.
snarkjs zkey export solidityverifier circuit_final.zkey verifier.sol
echo "✅ Solidity verifier exported to verifier.sol"
echo "   (We'll adapt this to Rust/Soroban in Phase 3)"

echo ""
echo "======================================================"
echo " ALL DONE. You just ran a complete ZK proof pipeline."
echo "======================================================"
echo ""
echo "What just happened:"
echo "  1. Compiled circuit → R1CS constraints + WASM prover"
echo "  2. Trusted setup   → proving key + verification key"
echo "  3. Witness         → computed a=3, b=11, c=33"
echo "  4. Proof           → cryptographic proof of knowledge"
echo "  5. Verify          → verifier confirmed proof is valid"
echo "  6. Cheat attempt   → verifier rejected the fake proof"
echo ""
echo "Next: Day 2 — Poseidon preimage circuit (this IS your"
echo "      commitment scheme from the Soroban contract)"
