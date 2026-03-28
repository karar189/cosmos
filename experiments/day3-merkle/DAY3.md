# Day 3 — Merkle Inclusion Proof Circuit

## Objective
Prove that a leaf exists in a Merkle tree without revealing which leaf or its position. This prevents someone from withdrawing a commitment that was never deposited.

---

## The Problem Day 3 Solves

After Day 2, anyone who knows a valid `(secret, nullifier, amount)` triple can prove knowledge of the leaf. But what stops someone from making up a leaf that was never deposited?

**Answer:** The Merkle root.

The contract maintains a running root over all deposited leaves. To withdraw, you must prove your leaf is inside the tree at that root — not just that you know its preimage.

---

## What is a Merkle Tree

A binary tree where every parent = `Poseidon(left_child, right_child)`.

```
depth=3, 8 leaves:

Root          =  Poseidon(Q0, Q1)
                   /              \
Level 2:     Q0                    Q1
           /    \               /    \
Level 1:  P0     P1           P2     P3
         / \    / \          / \    / \
Level 0: L0 L1 L2 L3       L4 L5  L6 L7
               ^
               Our leaf (index 2)
```

The root is a single hash that commits to all 8 leaves. Change any leaf → root changes completely.

---

## The Inclusion Proof

To prove `L2` is in the tree, provide the **sibling hashes** along the path:

```
pathElements = [L3, P0, Q1]
pathIndices  = [0,  1,  0 ]
               ↑   ↑   ↑
               L2 is LEFT   (sibling L3 is right)
               P1 is RIGHT  (sibling P0 is left)
               Q0 is LEFT   (sibling Q1 is right)
```

The circuit re-derives the root:
```
step 1: Poseidon(L2, L3) → P1
step 2: Poseidon(P0, P1) → Q0
step 3: Poseidon(Q0, Q1) → Root
```

Then checks: `computed_root == on_chain_root`

---

## What's Public vs Private

```
PRIVATE                     PUBLIC
───────                     ──────
leaf                        root
pathElements[0..2]
pathIndices[0..2]
```

The verifier only sees the root. They don't know:
- Which leaf you're proving
- What position it's at
- What the sibling hashes are

This is the **privacy** part. Your withdrawal cannot be linked to your deposit.

---

## New Circuit Concepts

**`Mux1` (multiplexer)**
Selects between two values based on a binary signal:
```
s=0 → output = c[0]
s=1 → output = c[1]
```
Used to pick left/right inputs to the hash based on `pathIndices[i]`.

**Binary constraint**
```circom
pathIndices[i] * (1 - pathIndices[i]) === 0;
```
Forces `pathIndices[i]` to be exactly 0 or 1. Without this, an attacker could use fractional values to manipulate which path is taken.

**Parameterised template**
```circom
template MerkleInclusion(depth) { ... }
component main = MerkleInclusion(3);
```
Change `3` to `20` for a production-scale tree (2^20 = 1M leaves). More depth = more constraints = slightly slower proofs.

---

## Actual Run Results

**Tree built (from build_tree.js):**
```
Root: 12637775194496995754117307235330377055135569056804320597148279303980524724247

Our leaf (L2 = 333) path:
  Level 0: we are LEFT  → sibling = L3 (444)
  Level 1: we are RIGHT → sibling = P0 (20595346...)
  Level 2: we are LEFT  → sibling = Q1 (16655691...)
  Computed root matches tree root: ✅ YES
```

**public.json (all the verifier ever sees):**
```json
["12637775194496995754117307235330377055135569056804320597148279303980524724247"]
```
Just the root. No leaf value, no position, no siblings.

**Cheat attempts:**
- Wrong root (`999`) → `[ERROR] snarkJS: Invalid proof` ✅
- Fake sibling → proof won't even generate (constraint fails) ✅

---

## Constraint Count Comparison

| Circuit | Constraints | Why |
|---------|-------------|-----|
| Day 1 Multiplier | 1 | single multiplication |
| Day 2 Poseidon(3) | 605 | hash function internals |
| Day 3 Merkle(depth=3) | **1,560** (actual) | 3 levels × Poseidon(2) + Mux1 selectors |
| Full withdrawal (depth=20) | ~12,000 | 20 levels, still fast |

---

## How This Fits the Full Withdrawal

```
Constraint set 1 (Day 2):
  Poseidon(secret, nullifier, amount) = leaf
  → proves you KNOW the commitment

Constraint set 2 (Day 3):
  leaf is in Merkle tree at root R
  → proves the commitment WAS DEPOSITED

Both together = complete withdrawal proof
```

Day 4 combines them into one circuit.

---

## The Soroban Contract Today vs After Phase 3

| Now (rolling accumulator) | After Phase 3 (sparse Merkle tree) |
|---|---|
| `root = Poseidon(old_root, new_leaf)` | Proper binary Merkle tree |
| Cannot generate Merkle paths | `get_merkle_path()` returns sibling hashes |
| ZK proof not possible | Full Groth16 withdrawal works |

The contract upgrade is Phase 3, Week 3.

---

## Files

```
merkle_inclusion.circom   ← the circuit
build_tree.js             ← builds tree, computes path, writes input.json
run.sh                    ← full pipeline
input.json                ← generated: leaf, pathElements, pathIndices, root
public.json               ← output: just the root (all the verifier sees)
proof.json                ← the ZK proof
```

---

## Part 2: Reading Nethermind's Circuit

Now that you've built the concepts yourself, clone their repo and read it:

```bash
git clone https://github.com/NethermindEth/stellar-private-payments
cd stellar-private-payments/circuits
```

Open `transaction.circom` and map it to what you built:

```
Their code                          What you built
──────────────────────────────────  ──────────────────────────────
Poseidon(inputs)                  = Day 2: leaf = Poseidon(secret, nullifier, amount)
MerkleProof or path verification  = Day 3: root === recomputed root
signal input secret               = your private secret
signal input nullifier            = your private nullifier
signal input root                 = public Merkle root
```

**Things to look for:**
1. How many public inputs does their circuit have? (should be: root, nullifier, recipient)
2. What depth do they use for the Merkle tree?
3. Do they have a range check on amount? (amount > 0 constraint)
4. How do they handle the nullifier — is it an input or derived from secret?

**The key difference between their circuit and ours:**
Their nullifier is likely derived: `nullifier = Poseidon(secret)` — so you can't choose it independently. Ours treats it as a separate random input. Both approaches work; theirs is slightly cleaner because it means one less value to store.

---

## Next: Day 4
**Combine Day 2 + Day 3** into one complete withdrawal circuit:
```
HypertronWithdraw:
  private: secret, nullifier, amount, pathElements, pathIndices
  public:  root, nullifier (revealed to prevent double-spend), recipient
```
This is the actual circuit that goes into production.
