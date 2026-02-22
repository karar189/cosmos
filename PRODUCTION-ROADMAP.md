# Private payment flow — production roadmap

This doc turns the v1 MVP flow into a concrete, phased plan. Do phases in order; each builds on the previous.

---

## Phase 1 — Identity, links, and ephemeral receive (weeks 1–2)

**Goal:** Business has an identity, creates payment links with a real “receive” target, client pays and you can attribute the payment.

| # | Task | What to do |
|---|------|------------|
| 1.1 | **Business identity** | Choose one: (A) Bring back Privy for email/phone/Google + embedded wallet, or (B) Keep Freighter-only but add backend: on first connect, create/link a `businessId` (UUID) and store `walletAddress <-> businessId` in DB. You need a stable `businessID` for commitments. |
| 1.2 | **Backend for payment links** | Re-enable or add API + DB for links: `POST /api/payment-link` saves amount, purpose, client name, workflow stage, `businessId`, and generates a unique link id and (if you want) a **per-link ephemeral Stellar account** (keypair stored server-side, or derived). Return link URL and QR payload. |
| 1.3 | **Payment attribution** | When client pays (to `dest` or to ephemeral address), backend must know “this payment is for link X, business Y.” Options: (a) one ephemeral address per link, or (b) one pool address + unique memo per link. Horizon (or webhook) + backend job to match incoming payments to links. |
| 1.4 | **Env and secrets** | Use real `DATABASE_URL`, env for Privy (if used), and secure storage for ephemeral keys (or HSM/MPC later). Never log or expose secret keys. |

**Outcome:** Business creates links; client pays; you know which business and which link got paid.

---

## Phase 2 — Pool, custody, and ZK commitment shape (weeks 2–4)

**Implemented:** Backend derives `secret = hashToScalar(payer, businessId, amount)` and `nullifier = hashToScalar(nonce, linkId)` (BN254-clamped), calls PoolManager `commit(secret, nullifier)` via `SOROBAN_COMMIT_SOURCE_SECRET`; status endpoint stores `payerAddress`, `nonce`, `nullifier`, `commitmentTxHash` on PaymentLink. Horizon supplies payer (tx source).

**Goal:** Funds go to a pooled account; each payment produces a ZK commitment that encodes (client, businessID, amount, nonce) so balances can stay private.

| # | Task | What to do |
|---|------|------------|
| 2.1 | **Pooled receive account** | Define “Hypertron Pooled Account”: one (or few) Stellar accounts that receive all client payments. Use a dedicated keypair; keys in env or (better) KMS/MPC. Backend (or Soroban) credits the pool when a payment is detected. |
| 2.2 | **Commitment shape** | Today: `commit(secret, nullifier)` with random values. For your flow: **commitment = Poseidon(client, businessID, amount, nonce)**. Options: (A) Encode that in current contract: e.g. `secret = hash(client, businessID, amount)`, `nullifier = hash(nonce, ...)` and pass those into existing `commit`; or (B) New contract function `commit_payment(client, businessID, amount, nonce)` that hashes and stores. Ensure all scalars are in BN254 field (like you did for randomU256). |
| 2.3 | **Wire payment → commitment** | After backend detects payment for link (businessId, amount, client address from tx): (1) Compute commitment inputs (client, businessID, amount, nonce); (2) Call PoolManager (or new contract) to add that commitment on-chain; (3) Store (linkId, commitment, nullifier, etc.) in DB for later withdraw proofs. |
| 2.4 | **Move funds to pool (if not already)** | If client pays to ephemeral address, backend must sweep to the pooled account (or use Soroban to lock funds into a pool contract). Document the exact flow (classic vs Soroban) so auditors can follow. |

**Outcome:** Every payment is recorded as a commitment on-chain; you can later prove “business B has at least X” without revealing individual payments.

---

## Phase 3 — Private dashboard and events (weeks 3–4) ✅ Implemented

**Goal:** Business sees only their own “Paid” events; no client addresses, no global pool balance.

| # | Task | Status |
|---|------|--------|
| 3.1 | **Event stream per business** | ✅ `GET /api/events?businessId=...` returns linkId, businessId, amount, workflowStage, paidAt, commitmentId (no payer/client address). |
| 3.2 | **Dashboard UI** | ✅ Payment Links tab lists links with Pending/Paid; Overview uses events for “Recent payments” (amount, workflow, “Paid ✔” only). List and events APIs omit payerAddress. |
| 3.3 | **QR and share** | ✅ Pay page shows QR (scan to open link), “Pay with Stellar wallet” CTA; client pays to link destination + memo. |

**Outcome:** Business has a private view of their own payments only.

---

## Phase 4 — Withdraw and proof (weeks 4–6) ✅ Implemented (ZK proof TBD)

**Goal:** Business can request payout; system proves their virtual balance ≥ requested amount with a ZK proof, then transfers from pool.

| # | Task | Status |
|---|------|--------|
| 4.1 | **Virtual balance** | ✅ `GET /api/balance?businessId=...` returns virtualBalanceXlm (sum of paid commitment amounts minus completed withdrawals by nullifiers). `Withdrawal` model tracks amount, nullifiers, status, payoutTxHash. |
| 4.2 | **ZK circuit** | TBD. Circuit (e.g. Circom or Noir) to prove “I have commitments for this business whose sum ≥ withdrawAmount” and output nullifiers to mark spent. |
| 4.3 | **Contract withdraw** | ✅ PoolManager `withdraw(recipient, nullifiers)` marks nullifiers used on-chain. Server calls `executeWithdraw()` before payout. ZK proof verification can be added later. |
| 4.4 | **Backend payout** | Scaffolded. `POST /api/withdraw` creates a pending withdrawal (validates balance, receive address). Dashboard “Withdraw” tab shows virtual balance, request form, and withdrawal history. Actual payout from pool to business wallet (with limits/logging) to be wired when proof + contract are ready. |

**Outcome:** Business can withdraw up to virtual balance; nullifiers marked on-chain; funds sent from pool to business wallet. Add ZK proof in contract for full privacy (4.2).

---

## Phase 5 — Security, custody, and launch (ongoing)

| # | Task | What to do |
|---|------|------------|
| 5.1 | **Custody** | Pool keys: move from env to KMS or MPC. Document recovery and access control. Prefer cold/multi-sig for large balances. |
| 5.2 | **Audit** | Get contracts (PoolManager, any new payment/withdraw logic) and critical backend paths audited. Fix findings before mainnet. |
| 5.3 | **Monitoring and limits** | Per-business and global limits; alerts on large withdrawals or failed proofs. Log (non-sensitive) metrics. |
| 5.4 | **Legal and compliance** | Depending on jurisdiction: consider KYC for businesses, AML, and terms of service. |

---

## Quick reference: what you have vs what to add

| Component | Now | Prod |
|-----------|-----|------|
| Auth | Freighter only | + businessId (Privy or backend) |
| Payment link | URL only, client-side | Backend + DB, optional ephemeral address, QR |
| Client pay | Classic XLM to dest | To pool/ephemeral → commitment recorded |
| Commitment | Random (secret, nullifier) | Poseidon(client, businessID, amount, nonce) |
| Dashboard | Link generator + ZK pool demo | ✅ Per-business events, “Paid ✔”, no addresses; Withdraw tab (balance + request) |
| Pool | Demo PoolManager | Real pooled account + custody |
| Withdraw | ✅ Virtual balance + request API + UI + contract withdraw + payout | ZK proof in contract (optional) |

---

## Suggested order of implementation

1. **Phase 1** first (identity + links + attribution).  
2. Then **Phase 2** (pool + commitment shape + wire payment → commit).  
3. Then **Phase 3** (private dashboard/events).  
4. Then **Phase 4** (withdraw + proof).  
5. **Phase 5** in parallel once you approach launch.

Start with one network (e.g. testnet), then mainnet when audits and custody are ready.
