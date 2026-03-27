# Day 1 — Hello Multiplier Circuit

## Objective
Understand the full ZK proof pipeline end-to-end by building the simplest possible circuit: prove you know two numbers that multiply to a result, without revealing the numbers.

---

## What We Built

**Circuit:** `multiplier.circom`
Proves: *"I know a and b such that a × b = c"* — without revealing a or b.

```
Public:  c = 33        (everyone sees this)
Private: a = 3, b = 11 (only the prover knows)
```

---

## Pipeline (8 steps)

| Step | What happened | Output |
|------|--------------|--------|
| 1 | Compiled `.circom` → constraint system + WASM prover | `multiplier.r1cs`, `multiplier.wasm` |
| 2 | Generated Powers of Tau (shared randomness) | `pot12_final.ptau` |
| 3 | Circuit-specific trusted setup | `circuit_final.zkey`, `verification_key.json` |
| 4 | Generated witness (computed actual values) | `witness.wtns` |
| 5 | Generated ZK proof | `proof.json`, `public.json` |
| 6 | Verified proof — **VALID** | `snarkJS: OK!` |
| 7 | Attempted cheat (fake public input) — **REJECTED** | `snarkJS: Invalid proof` |
| 8 | Exported on-chain verifier | `verifier.sol` |

---

## Key Concepts

**Circuit**
A file of math constraints written in Circom. If you can satisfy all constraints, you can produce a valid proof. If you can't, you can't.

**Witness**
The actual values that satisfy the circuit (a=3, b=11, c=33). Computed locally, never sent anywhere.

**Proof**
Three elliptic curve points (pi_a, pi_b, pi_c). Mathematically proves you satisfied the constraints. Contains zero information about your private inputs.

**Verification key**
Tiny file that lives on-chain. Used to check any proof against the circuit — without knowing the private inputs.

**Why you can't cheat**
A Groth16 proof is cryptographically bound to specific public inputs. You cannot take a valid proof for `c=33` and claim it proves `c=999`. Step 7 confirmed this.

---

## How This Maps to Hypertron

```
Multiplier circuit          Hypertron circuit
──────────────────          ─────────────────
a, b      (private)    →    secret, nullifier   (private)
c         (public)     →    leaf, root, amount  (public)
a * b = c              →    Poseidon(secret, nullifier, amount) = leaf
                            + leaf exists in the Merkle tree
```

The withdrawal proof in Hypertron says:
*"I know the secret and nullifier that hash to this leaf, and that leaf is in the tree"* — without revealing the secret or linking back to the depositor.

---

## Files in This Folder

```
multiplier.circom         ← the circuit (read this first)
input.json                ← private inputs: a=3, b=11
run.sh                    ← full pipeline script
build/
  multiplier.r1cs         ← constraint system
  multiplier.wasm         ← WASM prover (runs in browser)
proof.json                ← the ZK proof (3 curve points)
public.json               ← public output: ["33"]
verification_key.json     ← verifier's key (goes on-chain)
verifier.sol              ← Solidity verifier (reference)
```

---

## Notes

- `circom` v1 (0.5.46) was installed via Homebrew — does NOT support `pragma circom 2.0.0`
- Fixed by downloading circom v2.2.3 binary and overwriting `/opt/homebrew/bin/circom`
- Powers of Tau: for learning we generate a tiny one (power=12). In production, download Hermez's ceremony file which is trusted by the community.
- The trusted setup is the one thing that must be done carefully in production — if the randomness is compromised, fake proofs can be generated. This is why multi-party ceremonies exist.

---

## Next: Day 2
**Poseidon preimage circuit** — prove you know the inputs to a Poseidon hash without revealing them. This is the exact commitment scheme used in the Soroban contract: `leaf = Poseidon(secret, nullifier, amount)`.
