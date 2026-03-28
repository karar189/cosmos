# Day 4 — Complete Hypertron Withdrawal Circuit

## Objective
Combine Day 2 (Poseidon preimage proof) and Day 3 (Merkle inclusion proof) into **one complete withdrawal proof**. This is the actual circuit that goes into production.

---

## What Day 4 Proves

A single ZK proof that simultaneously convinces the verifier of four things:

```
1. leaf = Poseidon(secret, nullifier, amount)
   → I know the preimage of my commitment (I deposited this)

2. leaf ∈ MerkleTree(root)
   → That commitment actually exists in the pool (not made up)

3. publicNullifier == nullifier
   → The revealed nullifier matches my commitment (prevents nullifier spoofing)

4. recipient is bound to this proof
   → Someone can't steal my proof and redirect funds (front-run prevention)
```

Without all four, you cannot withdraw.

---

## The Attack Model — Why Each Constraint Exists

### Attack 1: Fake commitment
**"I'll make up a leaf that was never deposited"**

Blocked by: Constraint 2 (Merkle inclusion). The leaf must be in the tree. If you never deposited, the Merkle proof won't compute to the real root.

### Attack 2: Stealing someone else's leaf
**"I know Alice's leaf value — I'll claim I know its preimage"**

Blocked by: Constraint 1 (Poseidon preimage). You need `secret` and `nullifier` to produce a valid witness. Knowing the leaf hash doesn't help — Poseidon is one-way.

### Attack 3: Nullifier spoofing
**"I'll withdraw but reveal a FAKE nullifier — so my real one never gets marked spent → I can withdraw again"**

Blocked by: Constraint 3. `publicNullifier === nullifier`. The nullifier you reveal to the contract MUST be the same one baked into your leaf. You can't swap it out.

### Attack 4: Front-running
**"I'll intercept Alice's proof from the mempool and resubmit it with my address"**

Blocked by: Constraint 4. `recipient` is a public input. Changing the recipient changes the public inputs → the proof is no longer valid for the new public inputs.

---

## Public vs Private

```
PRIVATE (zero-knowledge — verifier learns nothing)
──────────────────────────────────────────────────
secret            your spending key
nullifier         your blinding factor
amount            payment amount (hidden!)
pathElements[]    sibling hashes (hides tree structure)
pathIndices[]     your position in the tree (completely hidden)

PUBLIC (seen by the smart contract)
────────────────────────────────────
root              must match on-chain Merkle root
publicNullifier   marked as spent after withdrawal
recipient         where funds go
```

---

## Circuit Architecture

```
                    secret ──┐
                  nullifier ─┼──► Poseidon(3) ──► leaf ──┐
                    amount ──┘                             │
                                                           ▼
pathElements[] ─────────────────────────────────────► MerkleProof ──► root === on-chain root
pathIndices[]  ──────────────────────────────────────►  (depth=3)

nullifier ──────────────────────────────────────────────► === publicNullifier
recipient ──────────────────────────────────────────────► * recipient (bound)
```

---

## Constraint Count

| Circuit | Constraints | What's inside |
|---------|-------------|---------------|
| Day 1 Multiplier | 1 | `a * b = c` |
| Day 2 Poseidon(3) | 605 | hash function internals |
| Day 3 Merkle(depth=3) | 1,560 | 3 × Poseidon(2) + Mux1 |
| **Day 4 Withdraw(depth=3)** | **~2,200** | Poseidon(3) + 3×Poseidon(2) + Mux1 + equality checks |
| Production Withdraw(depth=20) | ~12,600 | same but 20 Merkle levels |

---

## The Complete Withdrawal Flow

### At deposit time
```
1. User generates:  secret = random256()
                    nullifier = random256()
                    amount = 1000_0000000  (1000 XLM)

2. User computes:   leaf = Poseidon(secret, nullifier, amount)

3. User calls:      contract.commit(leaf, token_address, amount)
                    → contract transfers tokens in
                    → contract inserts leaf into Merkle tree
                    → contract returns: new root

4. User stores:     (secret, nullifier, amount) encrypted locally
```

### At withdrawal time
```
1. User fetches:    current_root from contract
                    merkle_path for their leaf (from contract or offchain indexer)

2. User generates ZK proof with:
   PRIVATE: secret, nullifier, amount, pathElements, pathIndices
   PUBLIC:  root=current_root, publicNullifier=nullifier, recipient=myAddress

3. User calls:      contract.withdraw(proof, root, nullifier, recipient, amount)
                    → contract verifies ZK proof
                    → contract checks nullifier not spent
                    → contract checks root is valid
                    → contract transfers tokens to recipient
                    → contract marks nullifier as spent
```

---

## How This Maps to Nethermind's Circuit

Nethermind's `transaction.circom` is a generalization of Day 4:

| Day 4 (simple) | Nethermind (JoinSplit) |
|---|---|
| 1 input UTXO | nIns input UTXOs |
| 1 output (recipient) | nOuts output commitments |
| Amount is private | Balance conservation: `sumIns + publicAmount = sumOuts` |
| Nullifier = raw value | Nullifier = `Poseidon(commitment, pathIndex, signature)` |
| Keypair not used | Keypair: `pubKey = Poseidon(privKey)` |

Day 4 is simpler and sufficient for the Hypertron beta. JoinSplit is an upgrade path.

---

## Files

```
hypertron_withdraw.circom   ← the circuit (Day 2 + Day 3 merged)
input_gen.js                ← simulates deposit, builds tree, writes input.json
run.sh                      ← full pipeline + 3 cheat tests
package.json                ← circomlib + circomlibjs dependencies
input.json                  ← generated: all 8 signals
public.json                 ← output: root, nullifier, recipient (all verifier sees)
proof.json                  ← the ZK proof
```

---

## Next: Phase 2

Day 4's circuit is the core of Phase 2. The next steps are:

1. **Upgrade to depth=20** — replace `HypertronWithdraw(3)` with `HypertronWithdraw(20)`
2. **Replace stub verifier** — implement real Groth16 on-chain verification using Nethermind's `circom-groth16-verifier`
3. **Upgrade Merkle accumulator** — replace rolling `Poseidon(old_root, leaf)` with a proper incremental Merkle tree so `get_merkle_path()` is possible
4. **TypeScript SDK** — `HypertronClient` class that handles proof generation + contract calls
