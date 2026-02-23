# Payment architecture — summary

High-level overview of how private payments work: goals, actors, flow, and components.

---

## Goals

- **Payer privacy:** The business never sees the client’s wallet address. They only see that a payment was received for a given link and amount.
- **Proof for the business:** The business sees verified payment status and can withdraw their balance from a shared pool.
- **Single pool:** All client payments go to one pool address with a **unique memo per link**. The backend attributes each payment to the right link and business, records a commitment on-chain (without exposing the payer), and lets the business withdraw their share.

---

## Actors

| Actor | Role |
|-------|------|
| **Business** | Connects wallet, creates payment links, sees “Payment received” and balance, withdraws to own wallet. |
| **Client (payer)** | Opens pay link, signs Stellar payment to pool + memo. Never appears in business UI. |
| **Backend** | Attributes payments (Horizon), computes commitment inputs, calls Soroban PoolManager, serves balance/withdraw APIs, sends XLM from pool on withdraw. |
| **Pool (Stellar account)** | Holds all incoming XLM; key(s) in env (e.g. `POOL_PAYOUT_SECRET`). |
| **Soroban PoolManager** | Stores commitments (Poseidon leaves), registers nullifiers, marks nullifiers spent on withdraw. |

---

## End-to-end flow

```
1. Business creates link     → POST /api/payment-link → DB: PaymentLink (linkMemo, destinationAddress = pool)
2. Client opens /pay/{id}    → GET /api/payment-link/{id} → amount, memo, destination (pool)
3. Client pays               → Stellar tx: to pool, amount, memo = linkMemo
4. Business (or cron)         → GET /api/payment-link/{id}/status
5. Backend                   → Horizon: incoming payments to pool → match memo → get payer (internal only)
6. Backend                   → secret = hash(payer, businessId, amount), nullifier = hash(nonce, linkId)
7. Backend                   → PoolManager.commit(secret, nullifier) → commitment on-chain
8. Backend                   → Update PaymentLink: paidAt, nullifier, commitmentTxHash (payer never exposed)
9. Business sees             → “Payment received”, verified balance increases
10. Business withdraws        → POST /api/withdraw (amount, recipient)
11. Backend                  → Select unspent nullifiers, PoolManager.withdraw(recipient, nullifiers)
12. Backend                  → Send XLM from pool key to recipient (Horizon)
13. Business sees            → “Withdrawal complete”, history updated
```

---

## Components

| Component | Purpose |
|-----------|--------|
| **Stellar network** | Native XLM transfers (client → pool; pool → business). |
| **Horizon** | Backend queries incoming payments to pool; reads transaction memo for attribution. |
| **Soroban PoolManager** | ZK-style commitment storage: `commit(secret, nullifier)` stores Poseidon leaf and registers nullifier; `withdraw(recipient, nullifiers)` marks nullifiers used. |
| **Backend (Next.js API)** | Payment-link CRUD, status checks, balance, withdraw; calls Horizon + Soroban; never returns payer to business. |
| **Database (Prisma)** | Business, PaymentLink (linkMemo, paidAt, nullifier, commitmentTxHash), Withdrawal (nullifiers, status, payoutTxHash). |
| **Pool keypair(s)** | Env: `POOL_PAYOUT_SECRET` / `SOROBAN_COMMIT_SOURCE_SECRET`. Signs commit txs and payout txs. |

---

## Privacy layer (internal)

- **Commitment:** Backend computes `secret = hashToScalar(payer, businessId, amount)` and `nullifier = hashToScalar(nonce, linkId)`. PoolManager stores `leaf = Poseidon(secret, nullifier)`. On-chain: only the leaf and nullifier are visible; payer is not.
- **Balance:** “Verified balance” = sum of paid link amounts minus amounts whose nullifiers have been spent in a completed withdrawal.
- **Withdraw:** Backend selects paid links whose nullifiers are not yet spent, calls `withdraw(recipient, nullifiers)`, then sends XLM from the pool account to the recipient. Nullifiers are marked spent on-chain to prevent double-spend.

---

## Where B256 (BN254) and Poseidon are used

**Short answer:** Poseidon is used **on-chain in the Soroban PoolManager contract** to compute commitment leaves and the pool root. BN254 (the scalar field) is used so all hashes and values stay in the correct field for ZK compatibility.

**Poseidon**

- **Where:** `soroban-escrow/contracts/poolmanager/src/lib.rs` (Soroban contract).
- **How:** The contract uses `soroban_poseidon::poseidon_hash` with `BnScalar`:
  - **Initialize:** `root = poseidon_hash([0])` (empty root).
  - **Commit:** `leaf = poseidon_hash(secret, nullifier)`; then `new_root = poseidon_hash(old_root, leaf)`.
- **Why:** Poseidon is a ZK-friendly hash; the commitment stored on-chain is the leaf (and root), not the raw secret/nullifier.

**BN254 / B256**

- **On-chain (contract):** Secret and nullifier are passed as `U256`. The Soroban Poseidon host uses the **BN254 scalar field** (BnScalar); values must be in that field or the host can trap.
- **Off-chain (backend):** `landing/src/lib/soroban-commit-server.ts` and `landing/src/lib/soroban-poolmanager.ts` use the BN254 scalar field order  
  `21888242871839275222246405745257275088548364400416034343698204186575808495617`  
  to clamp values:
  - **hashToScalar(...):** `SHA256(...) % BN254_SCALAR_FIELD_ORDER` so `secret` and `nullifier` are valid scalars before calling the contract.
  - **randomU256():** Random value mod the same field order for manual/test commits (e.g. Secure vault “Add verified entry”).
- **Future (stub in contract):** `bn254_pairing_check_stub` is a placeholder for verifying a ZK proof (e.g. Groth16) on withdraw; full BN254 pairing would be used there.

**One-line for “where was b256 and Poseidon used?”**

**Poseidon:** In the PoolManager Soroban contract to compute commitment leaves and the pool root. **BN254/b256:** In the same contract (via BnScalar) and in the landing app (soroban-commit-server, soroban-poolmanager) to keep secret/nullifier in the BN254 scalar field before calling `commit`.

---

## Key APIs

| API | Purpose |
|-----|---------|
| `POST /api/payment-link` | Create link (businessId, amount, purpose, …); returns link URL; destination = pool (or relayer when configured). |
| `GET /api/payment-link/{id}` | Pay page: amount, memo, destination. |
| `GET /api/payment-link/{id}/status` | Check if paid; if so, run commitment (if not already) and return status. |
| `GET /api/balance?businessId=` | Verified balance (XLM) and count of payments available to withdraw. |
| `POST /api/withdraw` | Request payout: backend marks nullifiers on contract, sends XLM from pool to recipient. |
| `GET /api/events?businessId=` | Paid events per business (no payer address). |

---

## Optional: relayer

If a relayer is configured, the client can pay the **relayer** instead of the pool. Backend forwards same amount + memo to the pool and runs the same commitment flow (using relayer as “payer” so the real payer stays hidden). See `landing/src/lib/relayer.ts` and `POST /api/relayer/process` (cron).

---

## One-sentence summary

**Clients pay XLM to a single pool with a link-specific memo → the backend attributes the payment to the link, records a commitment on Soroban (without exposing the payer) → the business sees “Payment received” and verified balance and withdraws from the pool to their own wallet; the business never sees the client’s wallet address.**

---

For step-by-step flow and production roadmap, see **`PAYMENT-FLOW-SUMMARY.md`** and **`PRODUCTION-ROADMAP.md`**.
