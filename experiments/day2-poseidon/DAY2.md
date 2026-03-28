# Day 2 — Poseidon Preimage Circuit

## Objective
Write a circuit that proves: *"I know the secret and nullifier that hash to this leaf"* — without revealing them. This is the exact commitment scheme in the Soroban contract.

---

## The Core Idea

In `lib.rs`, when you deposit:
```rust
let leaf = poseidon_hash::<4, BnScalar>(&env, &[secret, nullifier, amount]);
```

The contract stores `leaf` on-chain. To withdraw, you need to prove you know what's behind it.

This circuit is that proof.

---

## What's New vs Day 1

| Day 1 (Multiplier) | Day 2 (Poseidon) |
|---|---|
| `a * b = c` | `Poseidon(secret, nullifier, amount) = leaf` |
| Simple arithmetic | Cryptographic hash function |
| Toy example | Actual Hypertron commitment scheme |
| 1 constraint | ~200+ constraints (Poseidon internals) |

**Why Poseidon instead of SHA256?**
SHA256 requires ~20,000 constraints in a ZK circuit. Poseidon requires ~220. Proofs are faster and cheaper to generate when you have fewer constraints.

---

## Circuit Structure

```
PRIVATE                     PUBLIC
───────                     ──────
secret     ─┐
nullifier  ─┼─→ Poseidon(3) ─→ leaf
amount     ─┘
```

- `Poseidon(3)` = Poseidon hash with 3 inputs (from circomlib)
- The proof says: "I know the 3 values that hash to this leaf"
- The verifier sees only: `leaf` (the hash output)

---

## New Concepts

**circomlib**
Standard library of ZK circuits. Includes Poseidon, Merkle proofs, comparators, EdDSA signatures. You include it like: `include "circomlib/circuits/poseidon.circom"`.

**Constraint count**
Every operation in a ZK circuit costs constraints. More constraints = bigger proof = longer to generate.
- `a * b = c` → 1 constraint
- `Poseidon(3 inputs)` → ~220 constraints
- Full Merkle proof (depth 10) → ~2,200 constraints

**compute_leaf.js**
A helper script that computes the expected Poseidon hash using the same library the circuit uses. Lets you verify the circuit is computing the right thing before running the full proof.

---

## Cheat Resistance

Two cheat attempts both failed:

1. **Fake leaf** — submit proof but claim a different hash output
   → Rejected. Proof is cryptographically bound to the real leaf.

2. **Wrong secret** — someone else tries to withdraw your commitment
   → They'd need to produce a proof for your leaf. Impossible without knowing your secret + nullifier. The Poseidon hash is one-way — you can't reverse it to find the inputs.

---

## How This Fits the Full Withdrawal

The full withdrawal proof (Phase 2, Day 4) combines two things:

```
Constraint 1: Poseidon(secret, nullifier, amount) = leaf
                     ↑ (this circuit — Day 2)

Constraint 2: leaf exists in the Merkle tree at root R
                     ↑ (Merkle proof circuit — Day 3)
```

Both must be satisfied simultaneously for the proof to be valid.

---

## Files

```
commitment.circom    ← the circuit
input.json           ← test inputs (secret, nullifier, amount)
compute_leaf.js      ← computes expected leaf before proving
run.sh               ← full pipeline
public.json          ← output: the leaf (Poseidon hash)
proof.json           ← the ZK proof (3 curve points)
```

---

## Next: Day 3
**Merkle proof circuit** — prove a leaf exists in a tree without revealing which leaf or its position. This is what prevents someone from withdrawing a commitment that was never deposited.
