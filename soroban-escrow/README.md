# Soroban Escrow — v25 ZK-ready foundation

Production-ready scaffold: **Soroban v25** (Poseidon + BN254), **PoolManager** & **EscrowEngine** contracts, **Next.js + Privy** frontend, and **backend orchestrator** for payment links.

---

## What’s included

| Component | Description |
|-----------|-------------|
| **PoolManager** | Poseidon hashing, commitment storage, BN254 pairing check stub for ZK proof verification |
| **EscrowEngine** | Milestone-based escrow, ready for commit–prove–withdraw flow |
| **Next.js app** | Privy login, wallet abstraction, payment link generator UI |
| **Backend** | Payment link creation and orchestration (Express) |

---

## Repo structure

- **Frontend (landing app only):** Use the existing **`landing/`** folder at repo root (Next.js + Privy, payment links, dashboard, pay page).
- **Contracts:** `soroban-escrow/contracts/` (PoolManager, EscrowEngine).
- **Backend:** `soroban-escrow/backend/` (Express orchestrator, optional).

```
stellar/
├── landing/             # Next.js + Privy — payment links, dashboard, /pay/[id]
│   ├── src/app/api/payment-link/
│   ├── src/app/(main)/dashboard/
│   └── src/app/pay/[id]/
soroban-escrow/
├── contracts/           # Soroban (Rust) workspace
│   ├── poolmanager/     # Poseidon + BN254, commitments
│   └── escrowengine/    # Milestone escrow stub
├── backend/             # Express orchestrator (optional)
└── README.md
```

---

## Contracts (Soroban v25)

- **Rust 1.84+**, **soroban-sdk 25**, **soroban-poseidon 25** (BN254 field).
- **PoolManager**: `initialize`, `commit(secret, nullifier)`, `get_state`; BN254 pairing stub for Groth16 verification.
- **EscrowEngine**: `create`, `approve_milestone`, `get_escrow` (single-escrow stub).

```bash
cd contracts
# Soroban requires wasm32v1-none (not wasm32-unknown-unknown)
cargo build --target wasm32v1-none --release
```

**Deploy from CLI (testnet)**

1. Install [Stellar CLI](https://developers.stellar.org/docs/tools/cli/stellar-cli) and create a funded testnet key:

   ```bash
   stellar keys generate deployer --network testnet
   stellar keys fund deployer --network testnet
   ```

2. Deploy both contracts (script uses key name `deployer` or pass your secret key / set `SOURCE_KEY`):

   ```bash
   cd soroban-escrow/contracts
   chmod +x deploy-testnet.sh
   ./deploy-testnet.sh deployer
   ```

   Or deploy one by one:

   ```bash
   stellar contract deploy --wasm target/wasm32-unknown-unknown/release/poolmanager.wasm --network testnet --source deployer
   stellar contract deploy --wasm target/wasm32-unknown-unknown/release/escrowengine.wasm --network testnet --source deployer
   ```

3. Save the printed contract IDs (`C...`) for your app (e.g. `POOLMANAGER_CONTRACT_ID`, `ESCROW_ENGINE_CONTRACT_ID`).

---

## Frontend (landing app only)

All UI lives in the **`landing/`** folder (repo root).

1. In `landing/`, add `.env.local` with:
   - `NEXT_PUBLIC_PRIVY_APP_ID` — from [Privy Dashboard](https://dashboard.privy.io)
   - `NEXT_PUBLIC_APP_URL` — e.g. `http://localhost:3000`
2. Install and run:

```bash
cd landing
npm install
npm run dev
```

- **Home:** marketing + hero.
- **Dashboard:** `/dashboard` — Privy login → create payment links.
- **Pay page:** `/pay/[id]?amount=...&memo=...` — payment link destination.

---

## Backend

```bash
cd backend
npm install
APP_URL=http://localhost:3001 npm run dev
```

Listens on **http://localhost:4000**. `POST /api/payment-link` with `{ "amount", "memo?" }` returns `{ "url", "id" }`.

---

## Next steps (optional)

- **Merkle tree** for PoolManager (commit–prove–withdraw).
- **Commit–prove–withdraw flow** and API routes for deposits.
- **Payment QR UI** for `/pay/[id]`.
- **Architecture diagram** (PNG) for contracts + app + backend.

---

## References

- [Soroban v25 / X-Ray (BN254 + Poseidon)](https://stellar.org/blog/developers/announcing-stellar-x-ray-protocol-25)
- [soroban-poseidon (BN254)](https://crates.io/crates/soroban-poseidon/25.0.0)
- [Privy](https://privy.io) — wallet abstraction & login
