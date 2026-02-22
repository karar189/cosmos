# Explaining the ZK layer to DevRel

Short, shareable explanation of how privacy and the “ZK thing” work in this payment flow.

---

## In one sentence

**We use a ZK-style commitment scheme on Soroban so businesses get proof they were paid and can withdraw from a shared pool, without ever seeing who paid.**

---

## What we’re solving

- **Payer privacy:** The business never sees the client’s wallet address. They only see “someone paid this link, this amount.”
- **Proof for the business:** The business sees “Paid ✔”, amount, and can withdraw that balance from a shared **privacy pool**.
- **How we do it:** Payments go to one **pool address** with a **unique memo per link**. The backend attributes each payment to the right link, records a **commitment on-chain** (that doesn’t reveal who paid), and the business withdraws by “spending” those commitments via **nullifiers**.

---

## The “ZK thing” in plain terms

We’re not doing full zero-knowledge proofs (like a Groth16 proof verified on-chain) yet. We **are** using the same cryptographic building blocks that ZK systems use:

1. **Commitments**  
   When a payment is detected, we compute:
   - **secret** = hash(payer, businessId, amount) — encodes *who paid whom and how much*, but only as a hidden value.
   - **nullifier** = hash(nonce, linkId) — unique per payment, used later to “spend” that commitment.

   The backend calls the Soroban **PoolManager** contract: `commit(secret, nullifier)`. The contract stores a **Poseidon hash** (leaf) of `(secret, nullifier)`. So on-chain you only see a commitment (and the nullifier), not the payer or the link details.

2. **Nullifiers**  
   To withdraw, the business (via our backend) presents the **nullifiers** for the payments they’re “spending.” The contract checks:
   - This nullifier was part of a prior commitment.
   - It hasn’t been used before (no double-spend).

   So we get **commitment → record on-chain** and **nullifier → single-use spend**, which is the same *shape* as many ZK payment/UTXO systems.

3. **Poseidon + BN254 on Soroban**  
   The contract uses **Soroban v25 ZK primitives**:
   - **Poseidon** hashing for the commitment leaf and root (ZK-friendly hash).
   - **BN254** scalar field for values; the contract has a stub for a BN254 pairing check (for future Groth16-style proof verification).

So when we say “ZK-style” or “ZK commitment,” we mean: **commitments and nullifiers on-chain, payer-hidden, with the same crypto (Poseidon, BN254) and flow that full ZK proofs would build on.** The missing piece for “full ZK” is: a circuit that proves “I know secrets for these commitments whose sum ≥ withdraw amount” and verification of that proof in the contract (TBD).

---

## Soundbites for DevRel

- **“Private payments on Stellar.”** Clients pay to a pool with a link-specific memo; the business sees “Paid ✔” and can withdraw, but never sees the payer’s wallet.
- **“Commitments on Soroban.”** Each payment becomes a commitment (Poseidon leaf) on the PoolManager contract; the business withdraws by presenting nullifiers, so the chain never sees payer identity.
- **“ZK-ready, not full ZK yet.”** We use ZK-style commitments and nullifiers (Poseidon + BN254 on Soroban). Full proof generation and on-chain verification can be added later.
- **“One pool, many payers, no leakage.”** All payments go to one pool; the memo routes to the right link; only commitments and nullifiers are recorded on-chain, so payer addresses stay off the public chain.

---

## Flow in three steps (for slides or docs)

1. **Pay**  
   Client sends XLM to the **pool address** with the **link’s memo**. Backend detects it via Horizon and attributes it to the link + business.

2. **Commit**  
   Backend computes `secret = hash(payer, businessId, amount)` and `nullifier = hash(nonce, linkId)`, then calls **PoolManager.commit(secret, nullifier)**. On-chain: only the commitment (Poseidon leaf) and nullifier are stored; payer is hidden.

3. **Withdraw**  
   Business requests a payout. Backend selects paid links whose nullifiers aren’t spent yet, calls **PoolManager.withdraw(recipient, nullifiers)** to mark them used, then sends XLM from the pool to the business. No payer data is ever shown to the business or the chain.

---

## If they ask: “Is it really ZK?”

- **Commitments + nullifiers:** Yes — same paradigm as Zcash-style or rollup-style privacy (hide identity, prove spend rights with nullifiers).
- **Full ZK proof:** Not yet. We don’t generate a ZK proof (e.g. Circom/Noir) or verify one in the contract. The contract trusts the backend to only submit nullifiers for payments that belong to that business. Adding a circuit + BN254 verification would make it “full ZK” and is on the roadmap (see `PRODUCTION-ROADMAP.md` Phase 4.2).

---

## References in repo

- **Flow summary:** `PAYMENT-FLOW-SUMMARY.md`
- **Contract:** `soroban-escrow/contracts/poolmanager/src/lib.rs` (Poseidon, commit, withdraw, BN254 stub)
- **Commit logic:** `landing/src/lib/soroban-commit-server.ts` (`hashToScalar`, `executeCommit`, `executeWithdraw`)
- **When commit runs:** `landing/src/app/api/payment-link/[id]/status/route.ts` (on “Check status”) and relayer in `landing/src/lib/relayer.ts`
