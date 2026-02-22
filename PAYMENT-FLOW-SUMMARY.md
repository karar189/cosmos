# Private payment flow — summary

Single reference for **what you’re building**, **what users see**, and **what happens under the hood**.

---

## What you want to achieve

- **Payer privacy:** When someone pays via your link, the **business never sees the payer’s wallet address**. The business only sees that “someone paid this link this amount.”
- **Proof for the business:** The business sees **proof they were paid** (amount, “Paid ✔”, workflow) as soon as the payment is detected, and can **withdraw** that balance from a shared **privacy pool** later.
- **How it works:** All client payments go to one **pool address** (plus a **unique memo per link**). The backend attributes each payment to the right link and business, records a **ZK-style commitment** on-chain (without exposing who paid), and lets the business withdraw their share from the pool.

---

## User POV

### 1. Business (you)

1. **Connect wallet** (e.g. Freighter) → backend creates/links a **business** and optional **receive address**.
2. **Create payment link** (amount, purpose, client name, workflow) → you get a URL and a **unique memo** (e.g. `hpl_xxx_yyy`). You share the link (or QR) with the client.
3. **When someone pays:** You open the dashboard and click **“Check status”** on the link (or the list refreshes). You see **“Paid ✔”**, the amount, and workflow. You **never** see who paid (no wallet address).
4. **Recent payments / events:** You see a list of “Paid ✔” events (amount, workflow, date) — again, no payer identity.
5. **Withdraw:** In the **Withdraw** tab you see your **virtual balance** (sum of what you’ve been paid minus what you’ve already withdrawn). You enter amount and recipient (e.g. your receive address), submit → funds are sent from the pool to that address. Withdrawal history is listed.

### 2. Client (payer)

1. **Opens the link** (e.g. `yourapp.com/pay/abc123`) → sees amount, purpose, optional QR, and **“Pay with Stellar wallet”**.
2. **Connects wallet** (e.g. Freighter) and clicks **Pay** → a Stellar payment is built: **to the pool address**, **amount** from the link, **memo** from the link (so the backend can attribute it). They sign and submit.
3. **After payment:** They see “Payment sent” and a transaction link. They do **not** interact with your dashboard; their wallet is never shown to you.

---

## Under the hood

### High-level flow

```
Client pays (XLM + memo) → Pool account
       ↓
Backend detects payment (Horizon: incoming payment to pool with that memo)
       ↓
Backend attributes to link + business, records commitment on-chain (Soroban PoolManager)
       ↓
Business sees “Paid ✔” (no payer), virtual balance increases
       ↓
Business requests withdraw → backend marks nullifiers on contract, sends XLM from pool to business
```

### Step-by-step (technical)

**1. Payment link creation**

- Business creates link → `POST /api/payment-link` (businessId, amount, purpose, etc.).
- Backend stores `PaymentLink` with a **unique `linkMemo`** (e.g. `hpl_mlxaig8d_w2fffzku`) and **destinationAddress** = business receive address or shared pool from env.
- Client-facing URL: `BASE_URL/pay/{linkId}`. When the client opens it, the pay form gets **amount**, **memo**, and **destination** from `GET /api/payment-link/{id}`.

**2. Client pays**

- Pay page builds a **Stellar native payment**: source = client wallet, destination = link’s **destinationAddress** (the pool/receive account), amount = link amount, **memo = link’s `linkMemo`** (critical for attribution).
- Client signs in Freighter; tx is submitted to the network. **Funds land on the pool/receive account**; the memo stays on the transaction.

**3. Detecting the payment**

- When the business (or a refresh) calls **“Check status”** → `GET /api/payment-link/{id}/status`.
- Backend uses **Horizon**: `GET /accounts/{pool}/payments` to get **incoming** payments to the pool, then finds one whose **transaction memo** equals this link’s `linkMemo`.
- When found: we have `txHash`, payer (source account) for internal use only — **never returned to the business**.

**4. Recording the commitment (privacy layer)**

- Backend computes:
  - `secret = hashToScalar(payerAddress, businessId, amount)` (BN254-clamped)
  - `nullifier = hashToScalar(nonce, linkId)` (random nonce, stored with the link)
- Backend calls **Soroban PoolManager** `commit(secret, nullifier)` (signed with `SOROBAN_COMMIT_SOURCE_SECRET`). Contract stores a commitment (Poseidon leaf) and registers the nullifier for later withdraw.
- Backend updates **PaymentLink**: `paidAt`, `paymentTxHash`, `commitmentTxHash`, `nullifier`, `nonce`; **payerAddress** is stored only for computing the secret and **never** exposed in any business-facing API or UI.

**5. What the business sees**

- **List links:** `GET /api/payment-link?businessId=...` → links with status (Pending/Paid), amount, purpose, workflow — **no payer**.
- **Events:** `GET /api/events?businessId=...` → paid events: linkId, amount, workflowStage, paidAt, commitmentId — **no client wallet**.
- **Dashboard:** Overview (total received, counts), Recent payments (“Paid ✔”, amount, workflow), Payment links (“Check status”, Paid/Pending). **No payer address anywhere.**

**6. Virtual balance and withdraw**

- **Virtual balance:** Sum of all paid link amounts for that business, minus amounts already withdrawn. “Withdrawn” = nullifiers that appear in completed **Withdrawal** records. Served by `GET /api/balance?businessId=...`.
- **Withdraw:** Business submits amount + recipient (e.g. receive address) → `POST /api/withdraw`. Backend:
  - Picks paid links whose nullifiers are not yet spent (greedy by amount) until sum ≥ requested amount.
  - Creates **Withdrawal** (pending), calls PoolManager **`withdraw(recipient, nullifiers)`** so the contract marks those nullifiers as used.
  - Sends XLM from the pool key (`POOL_PAYOUT_SECRET` or `SOROBAN_COMMIT_SOURCE_SECRET`) to the recipient via Horizon.
  - Marks withdrawal **completed**, stores `payoutTxHash` (and optional `contractTxHash`).

**7. Pool and custody**

- One (or few) **Stellar accounts** hold the funds (pool). Keys live in env (e.g. `POOL_PAYOUT_SECRET` / `SOROBAN_COMMIT_SOURCE_SECRET`). For production, move to KMS/MPC and follow Phase 5 in `PRODUCTION-ROADMAP.md`.

---

## End-to-end in one sentence

**Client pays XLM to the pool with a link-specific memo → backend attributes the payment to your link, records a commitment on-chain (without exposing the payer), and shows you “Paid ✔” and a virtual balance → you withdraw from the pool to your own wallet; the business never sees the client’s wallet address.**

For the phased checklist and production hardening (custody, audit, compliance), see **`PRODUCTION-ROADMAP.md`**.
