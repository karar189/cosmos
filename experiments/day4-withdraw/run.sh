#!/bin/bash
# =============================================================
# Day 4 — Complete Hypertron Withdrawal Circuit
# Combines Day 2 (Poseidon commitment) + Day 3 (Merkle proof)
# =============================================================

set -e
cd "$(dirname "$0")"

echo ""
echo "======================================================"
echo " SETUP"
echo "======================================================"
npm install --silent
echo "✅ Dependencies installed"

echo ""
echo "======================================================"
echo " STEP 0: Generate inputs"
echo "======================================================"
echo "Simulating a deposit and computing withdrawal inputs..."
echo "(secret, nullifier, amount) → leaf → Merkle path → input.json"
echo ""
node input_gen.js

echo ""
echo "======================================================"
echo " STEP 1: Compile the circuit"
echo "======================================================"
mkdir -p build
circom hypertron_withdraw.circom --r1cs --wasm --sym \
    -l node_modules \
    --output build/
echo "✅ Circuit compiled"
echo ""
snarkjs r1cs info build/hypertron_withdraw.r1cs

echo ""
echo "======================================================"
echo " STEP 2: Trusted Setup"
echo "======================================================"
echo "Generating proving and verification keys..."
snarkjs powersoftau new bn128 14 pot14_0000.ptau 2>&1 | tail -2
snarkjs powersoftau contribute pot14_0000.ptau pot14_0001.ptau \
    --name="Day4" -e="hypertron entropy" 2>&1 | tail -2
snarkjs powersoftau prepare phase2 pot14_0001.ptau pot14_final.ptau 2>&1 | tail -2
snarkjs groth16 setup build/hypertron_withdraw.r1cs pot14_final.ptau circuit_0000.zkey 2>&1 | tail -2
snarkjs zkey contribute circuit_0000.zkey circuit_final.zkey \
    --name="Day4 Phase2" -e="more hypertron entropy" 2>&1 | tail -2
snarkjs zkey export verificationkey circuit_final.zkey verification_key.json 2>&1 | tail -2
echo "✅ Keys generated"

echo ""
echo "======================================================"
echo " STEP 3: Generate witness"
echo "======================================================"
node build/hypertron_withdraw_js/generate_witness.js \
    build/hypertron_withdraw_js/hypertron_withdraw.wasm \
    input.json \
    witness.wtns
echo "✅ Witness generated"

echo ""
echo "======================================================"
echo " STEP 4: Generate proof"
echo "======================================================"
snarkjs groth16 prove circuit_final.zkey witness.wtns proof.json public.json
echo "✅ Proof generated"
echo ""
echo "📄 public.json (what the smart contract sees — root, nullifier, recipient):"
cat public.json

echo ""
echo "======================================================"
echo " STEP 5: Verify the proof"
echo "======================================================"
snarkjs groth16 verify verification_key.json public.json proof.json
echo "✅ PROOF VALID"
echo "   Contract should:"
echo "   1. Check root matches current on-chain root"
echo "   2. Check publicNullifier not already spent"
echo "   3. Transfer funds to recipient"
echo "   4. Mark publicNullifier as spent"

echo ""
echo "======================================================"
echo " STEP 6: Cheat test — wrong secret"
echo "======================================================"
echo "What if an attacker guesses a wrong secret?"
echo "They can't compute the correct leaf → wrong Merkle path → proof fails."
echo ""
echo "Trying to generate a witness with the wrong secret..."
# Swap secret for a wrong value in a temp input file
node -e "
const inp = JSON.parse(require('fs').readFileSync('input.json'));
inp.secret = '9999999999999999999';
require('fs').writeFileSync('input_bad_secret.json', JSON.stringify(inp, null, 2));
"
node build/hypertron_withdraw_js/generate_witness.js \
    build/hypertron_withdraw_js/hypertron_withdraw.wasm \
    input_bad_secret.json \
    witness_bad.wtns \
    && echo "❌ Witness generated (bad!)" \
    || echo "✅ REJECTED — wrong secret cannot produce a valid witness"

echo ""
echo "======================================================"
echo " STEP 7: Cheat test — nullifier mismatch"
echo "======================================================"
echo "What if someone tries to reveal a DIFFERENT nullifier than the one in their leaf?"
echo "(This would let them drain the pool without spending their real nullifier)"
echo ""
echo "Trying to generate witness with mismatched publicNullifier..."
node -e "
const inp = JSON.parse(require('fs').readFileSync('input.json'));
inp.publicNullifier = '1111111111111111111';
require('fs').writeFileSync('input_bad_nullifier.json', JSON.stringify(inp, null, 2));
"
node build/hypertron_withdraw_js/generate_witness.js \
    build/hypertron_withdraw_js/hypertron_withdraw.wasm \
    input_bad_nullifier.json \
    witness_bad_n.wtns \
    && echo "❌ Witness generated (bad!)" \
    || echo "✅ REJECTED — publicNullifier must equal the nullifier used in commitment"

echo ""
echo "======================================================"
echo " STEP 8: Cheat test — wrong root"
echo "======================================================"
echo "What if someone submits a valid proof against a FAKE root?"
echo "(root that doesn't exist on-chain)"
echo ""
# The proof is valid against the real public.json but NOT fake_root.json
node -e "
const pub = JSON.parse(require('fs').readFileSync('public.json'));
pub[0] = '999';  // root is the first public signal
require('fs').writeFileSync('public_fake_root.json', JSON.stringify(pub, null, 2));
"
snarkjs groth16 verify verification_key.json public_fake_root.json proof.json \
    && echo "❌ Accepted (bad!)" \
    || echo "✅ REJECTED — proof only valid for the real root"

echo ""
echo "=================================================="
echo " ALL DONE — Day 4 complete"
echo "=================================================="
echo ""
echo "What you've built:"
echo ""
echo "  Day 2: Poseidon(secret, nullifier, amount) = leaf   ← you know the preimage"
echo "  Day 3: leaf exists in Merkle tree at root R         ← leaf was deposited"
echo "  Day 4: BOTH in one proof + nullifier binding        ← complete withdrawal"
echo ""
echo "The ZK proof convinces the contract:"
echo "  ✓ You deposited something (leaf is in the tree)"
echo "  ✓ You know the secret behind your deposit (preimage knowledge)"
echo "  ✓ You're not withdrawing twice (nullifier is revealed and marked spent)"
echo "  ✓ Funds go to your chosen address (recipient binding)"
echo ""
echo "Public: root, nullifier, recipient"
echo "Secret: everything else (amount, position, identity)"
