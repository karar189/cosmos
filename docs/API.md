# Hypertron API Documentation

This document describes the backend API surface currently implemented in Hypertron.
It covers three runtime surfaces:

- **Frontend API routes**: Next.js route handlers in `frontend/src/app/api`. These are the primary product APIs used by the dashboard and payment pages.
- **Payment-link Express service**: lightweight Node/Express service in `backend/src/index.js`.
- **AI Analyzer service**: FastAPI service in `ai-analyzer/app`, including compliance, RegIntel, scraper, and business-impact endpoints.

## Service Map

| Service | Default base URL | Source | Purpose |
| --- | --- | --- | --- |
| Frontend API | `http://localhost:3000/api` | `frontend/src/app/api` | Dashboard auth, business profile, payment links, balances, withdrawals, vault, employees, templates, and proxy routes to AI services. |
| Express backend | `http://localhost:4000/api` | `backend/src/index.js` | Minimal in-memory payment-link service for Soroban escrow demos. |
| AI Analyzer | `http://localhost:8001` | `ai-analyzer/app` | Compliance checklist generation, RegIntel, scraper, agent recommendations, and business-impact reports. |

## Conventions

- All request and response bodies are JSON unless noted.
- Errors generally use `{ "error": "message" }`.
- Authenticated dashboard endpoints use HttpOnly cookies set by auth routes:
  - `ht_dashboard`: legacy Stellar wallet session cookie.
  - `ht_privy`: Privy app user session cookie.
- Several endpoints require a `businessId`. The server verifies ownership through the active session before returning or mutating data.
- Stellar network defaults to `testnet` unless `NEXT_PUBLIC_STELLAR_NETWORK=public`.

## Important Environment Variables

| Variable | Used by | Description |
| --- | --- | --- |
| `DATABASE_URL` | Frontend API, AI Analyzer | MongoDB connection string for Prisma or RegIntel storage. |
| `AUTH_SECRET` | Frontend API | HMAC secret for `ht_dashboard` and `ht_privy` session cookies. |
| `NEXT_PUBLIC_APP_URL` | Frontend API | Public app URL used when generating payment links. |
| `NEXT_PUBLIC_STELLAR_NETWORK` | Frontend API | `testnet` or `public`. |
| `NEXT_PUBLIC_PAYMENT_POOL_ADDRESS` | Frontend API | Stellar pool address used as the payment destination. |
| `NEXT_PUBLIC_MERCHANT_RECIPIENT` | Frontend API | Fallback payment recipient when pool address is not set. |
| `NEXT_PUBLIC_RELAYER_PUBLIC_KEY` | Frontend API | Optional relayer account. If set, payment links can return the relayer as destination. |
| `RELAYER_SECRET_KEY` | Frontend API | Secret key used to forward relayer inbox payments to the pool. |
| `POOL_PAYOUT_SECRET` | Frontend API | Secret key used for payouts and withdrawals. |
| `SOROBAN_COMMIT_SOURCE_SECRET` | Frontend API | Secret used to submit Soroban commitment and withdrawal transactions. |
| `POOLMANAGER_CONTRACT_ID` / `NEXT_PUBLIC_POOLMANAGER_CONTRACT_ID` | Frontend API | Soroban PoolManager contract ID. |
| `FEE_SPONSOR_SECRET` | Frontend API | Secret key for fee-bump sponsorship. |
| `NEXT_PUBLIC_FEE_SPONSOR_PUBLIC_KEY` | Frontend API | Public sponsor account. Enables sponsored payment UX. |
| `FEE_SPONSOR_MAX_FEE_STROOPS` | Frontend API | Optional fee bump cap. Defaults to `100000`. |
| `PRIVY_APP_SECRET` | Frontend API | Privy server secret for token verification. |
| `NEXT_PUBLIC_PRIVY_APP_ID` | Frontend | Enables Privy client auth UI. |
| `COSMOS_AI_URL` / `NEXT_PUBLIC_COSMOS_AI_URL` | Frontend API | Base URL for AI Analyzer proxy routes. Defaults to `http://localhost:8001` for many proxies. |
| `COMPLIANCE_PYTHON_API_URL` | Frontend API | Optional compliance checklist backend URL. |
| `OPENAI_API_KEY` | Frontend API, AI Analyzer | Used for checklist generation and AI recommendations. |
| `INGESTION_SECRET` | Frontend RegIntel proxy | Optional bearer token required for ingestion trigger. |
| `PORT` | Express backend | Express service port. Defaults to `4000`. |
| `APP_URL` | Express backend | URL used to generate demo pay links. Defaults to `http://localhost:3001`. |

## Authentication

### Create Wallet Challenge

`POST /api/auth/challenge`

Creates a SEP-53-style message for a Stellar wallet to sign.

Request:

```json
{
  "walletAddress": "G..."
}
```

Response:

```json
{
  "challengeId": "clx...",
  "message": "Hypertron dashboard sign-in\n\nWallet: G...\n...",
  "expiresAt": "2026-05-30T12:00:00.000Z"
}
```

Status codes:

| Code | Meaning |
| --- | --- |
| `200` | Challenge created. |
| `400` | Missing or invalid Stellar address. |
| `503` | Database unavailable. |

### Verify Wallet Challenge

`POST /api/auth/verify`

Verifies the signed challenge and sets `ht_dashboard`.

Request:

```json
{
  "challengeId": "clx...",
  "walletAddress": "G...",
  "signedMessage": "base64-signature-from-wallet"
}
```

Response:

```json
{
  "ok": true,
  "walletAddress": "G..."
}
```

Status codes:

| Code | Meaning |
| --- | --- |
| `200` | Session cookie set. |
| `400` | Invalid, used, expired, or mismatched challenge. |
| `401` | Signature verification failed. |
| `500` | `AUTH_SECRET` missing or server error. |

### Sync Privy Session

`POST /api/auth/privy/sync`

Verifies a Privy access token, upserts an `AppUser`, and sets `ht_privy`.

Headers:

```http
Authorization: Bearer <privy-access-token>
```

Response:

```json
{
  "ok": true,
  "user": {
    "id": "app_user_id",
    "privyId": "did:privy:...",
    "email": "team@example.com",
    "name": "Team Member"
  }
}
```

### Current Session

`GET /api/auth/me`

Returns the current wallet or Privy session.

Response examples:

```json
{
  "auth": "wallet",
  "walletAddress": "G..."
}
```

```json
{
  "auth": "privy",
  "user": {
    "id": "app_user_id",
    "privyId": "did:privy:...",
    "email": "team@example.com",
    "name": "Team Member"
  }
}
```

### Logout

`POST /api/auth/logout`

Clears both session cookies.

Response:

```json
{
  "ok": true
}
```

## Business APIs

### Link or Create Business

`POST /api/business/link`

Requires `ht_dashboard`. Gets or creates a business for the signed-in wallet. Optionally stores the business receive address.

Request:

```json
{
  "receiveAddress": "G..."
}
```

Response:

```json
{
  "businessId": "business_id",
  "receiveAddress": "G..."
}
```

### Update Business Receive Address

`PATCH /api/business/link`

Requires `ht_dashboard`.

Request:

```json
{
  "receiveAddress": "G..."
}
```

Response:

```json
{
  "businessId": "business_id",
  "receiveAddress": "G..."
}
```

### Get Business Profile

`GET /api/business/profile`

Requires an app session. Resolves the business from the signed-in wallet or Privy membership.

Response:

```json
{
  "businessId": "business_id",
  "name": "Acme Treasury",
  "email": "ops@example.com",
  "businessNature": "fintech",
  "selectedWidgets": ["payments", "compliance"],
  "selectedTier": "tier-2",
  "selectedTierName": "Tier 2",
  "selectedTierAt": "2026-05-30T12:00:00.000Z",
  "receiveAddress": "G...",
  "complianceForm": {},
  "activeTemplateId": "template_id",
  "activeTemplateAt": "2026-05-30T12:00:00.000Z",
  "activeTemplate": {
    "id": "template_id",
    "name": "Fintech Ops",
    "bundleId": "tier-2",
    "bundleName": "Tier 2",
    "businessName": "Acme Treasury"
  }
}
```

### Update Business Profile

`PATCH /api/business/profile`

Requires an app session.

Request fields:

| Field | Type | Notes |
| --- | --- | --- |
| `name` | string | Optional. Empty string clears the value. |
| `email` | string | Optional. |
| `businessNature` | string | Optional. |
| `selectedWidgets` | string[] | Optional. |
| `selectedTier` | string or null | Must be `tier-1`, `tier-2`, or `tier-3` when set. |
| `selectedTierName` | string or null | Optional display name. |
| `complianceForm` | object or null | Optional stored compliance form. |
| `activeTemplateId` | string or null | Must belong to the same business when set. |

Response shape matches `GET /api/business/profile`.

## Payment Link APIs

### Create Payment Link

`POST /api/payment-link`

Requires a session and ownership of `businessId`.

Destination priority:

1. `NEXT_PUBLIC_PAYMENT_POOL_ADDRESS`
2. `business.receiveAddress`
3. `NEXT_PUBLIC_MERCHANT_RECIPIENT`

Request:

```json
{
  "businessId": "business_id",
  "amount": "25.0000000",
  "purpose": "Invoice #1007",
  "clientName": "Acme Client",
  "workflowStage": "deposit",
  "flexibleAmount": false
}
```

For pay-any-amount links:

```json
{
  "businessId": "business_id",
  "flexibleAmount": true,
  "purpose": "Open invoice"
}
```

Response:

```json
{
  "linkId": "payment_link_id",
  "url": "http://localhost:3000/pay/payment_link_id",
  "qrPayload": "http://localhost:3000/pay/payment_link_id",
  "memo": "hpl_...",
  "amount": "25.0000000",
  "destinationAddress": "G..."
}
```

### List Payment Links

`GET /api/payment-link?businessId=business_id`

Requires ownership of `businessId`.

Response:

```json
{
  "links": [
    {
      "id": "payment_link_id",
      "amount": "25.0000000",
      "purpose": "Invoice #1007",
      "clientName": "Acme Client",
      "workflowStage": "deposit",
      "linkMemo": "hpl_...",
      "paidAt": null,
      "paymentTxHash": null,
      "commitmentTxHash": null,
      "createdAt": "2026-05-30T12:00:00.000Z",
      "url": "http://localhost:3000/pay/payment_link_id"
    }
  ]
}
```

### Get Payment Link

`GET /api/payment-link/{id}`

Public payment-page endpoint. Returns payment instructions.

Response:

```json
{
  "id": "payment_link_id",
  "amount": "25.0000000",
  "memo": "hpl_...",
  "destinationAddress": "G...",
  "purpose": "Invoice #1007",
  "clientName": "Acme Client",
  "workflowStage": "deposit",
  "paidAt": null,
  "paymentTxHash": null
}
```

### Prepare Opaque Memo Payment

`POST /api/payment-link/{id}/prepare-pay`

Creates a one-time hash memo for dark-pool attribution. The payer uses the returned value as a Stellar `MEMO_HASH`.

Request:

```json
{
  "amount": "25.0000000"
}
```

Response:

```json
{
  "memoHashBase64": "base64-32-byte-hash",
  "amount": "25.0000000"
}
```

### Submit Sponsored Payment

`POST /api/payment-link/{id}/submit-sponsored-pay`

Wraps a payer-signed inner transaction in a fee-bump transaction so the sponsor pays the Stellar fee.

Request:

```json
{
  "signedInnerTxXdr": "AAAA...",
  "payerPublicKey": "G..."
}
```

Response:

```json
{
  "txHash": "stellar_transaction_hash"
}
```

Notes:

- Requires `FEE_SPONSOR_SECRET`.
- If `NEXT_PUBLIC_FEE_SPONSOR_PUBLIC_KEY` is set, it must match the public key derived from `FEE_SPONSOR_SECRET`.
- The server validates destination, amount, and memo before sponsoring.

### Check Payment Status

`GET /api/payment-link/{id}/status`

Checks Horizon for a matching text memo or hash memo payment. If found, the route creates a Soroban commitment and updates the payment link.

Response when pending:

```json
{
  "status": "pending",
  "hint": "No payment found to GABC...WXYZ. Wait 10-20 sec for the ledger and Horizon to update, then click Check status again.",
  "destination": "G...",
  "network": "testnet"
}
```

Response when paid:

```json
{
  "status": "paid",
  "paymentTxHash": "stellar_transaction_hash",
  "paidAt": "2026-05-30T12:00:00.000Z",
  "commitmentTxHash": "soroban_transaction_hash"
}
```

If the payment is detected but the Soroban commit fails, the response still returns `status: "paid"` with `commitmentError`.

## Balance, Events, and Withdrawals

### Get Virtual Balance

`GET /api/balance?businessId=business_id`

Requires ownership of `businessId`.

Virtual balance is calculated from paid links with committed nullifiers minus completed withdrawals.

Response:

```json
{
  "businessId": "business_id",
  "virtualBalanceXlm": "50.0000",
  "unspentCount": 2
}
```

### Get Dashboard Stats

`GET /api/dashboard-stats?businessId=business_id`

Requires ownership of `businessId`.

Response:

```json
{
  "businessId": "business_id",
  "totalReceivedXlm": "75.0000",
  "linkCount": 5,
  "completed": 3,
  "pending": 2
}
```

### List Events

`GET /api/events?businessId=business_id`

Requires ownership of `businessId`. Returns safe payment-link event data without exposing payer addresses.

Response:

```json
{
  "events": [
    {
      "linkId": "payment_link_id",
      "businessId": "business_id",
      "amount": "25.0000000",
      "purpose": "Invoice #1007",
      "workflowStage": "deposit",
      "paidAt": "2026-05-30T12:00:00.000Z",
      "commitmentId": "soroban_transaction_hash",
      "createdAt": "2026-05-30T11:50:00.000Z",
      "url": "http://localhost:3000/pay/payment_link_id"
    }
  ]
}
```

### List Withdrawals

`GET /api/withdraw?businessId=business_id`

Requires ownership of `businessId`.

Response:

```json
{
  "withdrawals": [
    {
      "id": "withdrawal_id",
      "amount": "25.0000000",
      "recipientAddress": "G...",
      "status": "completed",
      "payoutTxHash": "stellar_transaction_hash",
      "contractTxHash": "soroban_transaction_hash",
      "createdAt": "2026-05-30T12:00:00.000Z"
    }
  ]
}
```

### Request Withdrawal

`POST /api/withdraw`

Requires ownership of `businessId`. Selects unspent nullifiers, marks them spent on-chain, and pays the recipient from the pool.

Request:

```json
{
  "businessId": "business_id",
  "amount": "25.0000000",
  "recipientAddress": "G..."
}
```

`amountXlm` is also accepted as an alias for `amount`.

Response:

```json
{
  "withdrawalId": "withdrawal_id",
  "status": "completed",
  "amount": "25.0000000",
  "recipientAddress": "G...",
  "contractTxHash": "soroban_transaction_hash",
  "payoutTxHash": "stellar_transaction_hash"
}
```

## Document Vault APIs

### List Vault Items

`GET /api/vault?businessId=business_id`

Requires `ht_dashboard`. If `businessId` is omitted, the server resolves the business from the session wallet.

Response:

```json
{
  "items": [
    {
      "id": "vault_item_id",
      "type": "compliance_checklist",
      "title": "Regulatory & compliance checklist",
      "items": [
        {
          "id": "item-1",
          "text": "Register with the relevant authority.",
          "done": false
        }
      ],
      "createdAt": "2026-05-30T12:00:00.000Z"
    }
  ]
}
```

### Save Vault Checklist

`POST /api/vault`

Requires `ht_dashboard`.

Request:

```json
{
  "businessId": "business_id",
  "title": "Compliance checklist",
  "items": [
    {
      "id": "item-1",
      "text": "Register with the relevant authority.",
      "done": false
    }
  ]
}
```

Response:

```json
{
  "id": "vault_item_id",
  "title": "Compliance checklist",
  "createdAt": "2026-05-30T12:00:00.000Z"
}
```

## Employee APIs

All employee APIs require `ht_dashboard` and operate on the business owned by the session wallet.

### List Employees

`GET /api/employees`

Response:

```json
{
  "employees": [
    {
      "id": "employee_id",
      "employeeCode": "EMP-1001",
      "name": "Jane Doe",
      "email": "jane@example.com",
      "walletAddress": "G...",
      "role": "Engineer",
      "department": "Product",
      "status": "active",
      "priority": "medium"
    }
  ]
}
```

### Create Employee

`POST /api/employees`

Request:

```json
{
  "name": "Jane Doe",
  "email": "jane@example.com",
  "employeeWalletAddress": "G...",
  "role": "Engineer",
  "department": "Product",
  "status": "active",
  "priority": "medium"
}
```

Response:

```json
{
  "employee": {
    "id": "employee_id",
    "employeeCode": "EMP-1001",
    "name": "Jane Doe",
    "email": "jane@example.com",
    "walletAddress": "G...",
    "role": "Engineer",
    "department": "Product",
    "status": "active",
    "priority": "medium"
  }
}
```

Allowed `status` values: `active`, `inactive`, `on_leave`, `pending`, `offboarded`.

Allowed `priority` values: `low`, `medium`, `high`.

### Bulk Delete Employees

`DELETE /api/employees`

Request:

```json
{
  "ids": ["employee_id"]
}
```

Response:

```json
{
  "deleted": 1
}
```

### Get Employee

`GET /api/employees/{id}`

### Update Employee

`PATCH /api/employees/{id}`

Accepted fields: `name`, `email`, `employeeWalletAddress`, `role`, `department`, `status`, `priority`.

### Delete Employee

`DELETE /api/employees/{id}`

Response:

```json
{
  "success": true
}
```

### List Employee Payments

`GET /api/employees/{id}/payments`

Response:

```json
{
  "payments": [
    {
      "id": "payment_id",
      "amountXlm": "10.0000000",
      "note": "May payout",
      "status": "completed",
      "payoutTxHash": "stellar_transaction_hash",
      "createdAt": "2026-05-30T12:00:00.000Z"
    }
  ],
  "totals": {
    "paidXlm": "10.0000000",
    "count": 1
  }
}
```

### Create Employee Payment

`POST /api/employees/{id}/payments`

Creates a payment record. If the employee has a valid Stellar wallet, the server attempts an XLM payout.

Request:

```json
{
  "amountXlm": "10",
  "note": "May payout"
}
```

Response:

```json
{
  "payment": {
    "id": "payment_id",
    "amountXlm": "10.0000000",
    "note": "May payout",
    "status": "completed",
    "payoutTxHash": "stellar_transaction_hash",
    "createdAt": "2026-05-30T12:00:00.000Z"
  }
}
```

## Template APIs

Template APIs require an app session or wallet session, depending on the route implementation.

### List Templates

`GET /api/templates`

Response:

```json
{
  "templates": [
    {
      "id": "template_id",
      "name": "Fintech Ops",
      "businessName": "Acme Treasury",
      "savedAt": "2026-05-30T12:00:00.000Z",
      "bundleId": "tier-2",
      "bundleName": "Tier 2",
      "description": "Operational template",
      "widgets": []
    }
  ]
}
```

### Create Template

`POST /api/templates`

Request:

```json
{
  "name": "Fintech Ops",
  "bundleId": "tier-2",
  "bundleName": "Tier 2",
  "businessName": "Acme Treasury",
  "description": "Operational template",
  "widgets": []
}
```

### Get Template

`GET /api/templates/{id}`

### Update Template

`PATCH /api/templates/{id}`

Accepted fields: `name`, `description`, `widgets`.

## Analytics and Relayer APIs

### Transaction Analytics

`GET /api/transaction-analytics?days=30`

Requires `ht_dashboard`. Returns daily incoming payment counts for the session wallet.

Query constraints:

| Query | Description |
| --- | --- |
| `days` | Clamped between `7` and `90`. Defaults to `30`. |

Response:

```json
{
  "daily": [
    {
      "date": "2026-05-30",
      "count": 3,
      "amountXlm": "42.0000000"
    }
  ],
  "walletAddress": "G..."
}
```

The exact `daily` object fields are produced by `frontend/src/lib/horizon.ts`.

### Process Relayer Inbox

`POST /api/relayer/process`

Processes incoming relayer payments and forwards them to the pool. Intended for cron usage.

Response when relayer is disabled:

```json
{
  "processed": 0,
  "message": "Relayer not configured"
}
```

Response when enabled:

```json
{
  "processed": 3
}
```

## Compliance and AI Proxy APIs

These routes live in the Next.js app and either call OpenAI directly or proxy to AI Analyzer.

### Generate Compliance Checklist

`POST /api/compliance/generate`

Requires `ht_dashboard`.

If `COSMOS_AI_URL` or `COMPLIANCE_PYTHON_API_URL` is configured, the route proxies to AI Analyzer's `/api/compliance/checklist`. Otherwise it calls OpenAI directly.

Request:

```json
{
  "businessName": "Acme Treasury",
  "basedOutOf": "US",
  "businessType": "fintech",
  "geographies": "US, EU",
  "products": "B2B payments",
  "monthlyTransactions": "1000",
  "avgTransactionValueUsd": "250",
  "constraints": "Needs AML coverage"
}
```

Response:

```json
{
  "items": [
    {
      "id": "item-...",
      "text": "Register for applicable money services business obligations."
    }
  ]
}
```

### Compliance Agent Analyze

`POST /api/compliance-agent/analyze`

Proxies multipart or JSON input to AI Analyzer `/api/compliance-agent/analyze`.

### Compliance Agent Detail Plan

`POST /api/compliance-agent/detail-plan`

Proxies JSON input to AI Analyzer `/api/compliance-agent/detail-plan`.

### Widget Recommendations

`POST /api/agentic/widgets/recommendations`

Proxies to AI Analyzer `/api/widgets/recommendations`.

### RNS Business Impact Report

`POST /api/agentic/rns/report`

Proxies to AI Analyzer `/agent/business-impact-report`.

### RNS Business Impact News

`POST /api/agentic/rns/news`

Proxies to AI Analyzer `/agent/business-impact-news`.

### RNS Business Impact Email

`POST /api/agentic/rns/email`

Proxies to AI Analyzer `/agent/business-impact-report/email`.

## RegIntel Proxy APIs

RegIntel Next.js routes proxy to AI Analyzer using `COSMOS_AI_URL` or `NEXT_PUBLIC_COSMOS_AI_URL`.

| Method | Frontend route | Upstream AI Analyzer route |
| --- | --- | --- |
| `GET` | `/api/regintel/sources` | `/api/regintel/sources` |
| `POST` | `/api/regintel/sources` | `/api/regintel/sources` |
| `GET` | `/api/regintel/sources/{id}` | `/api/regintel/sources/{id}` |
| `PATCH` | `/api/regintel/sources/{id}` | `/api/regintel/sources/{id}` |
| `DELETE` | `/api/regintel/sources/{id}` | `/api/regintel/sources/{id}` |
| `POST` | `/api/regintel/ingest/run` | `/api/regintel/ingest/run` |
| `POST` | `/api/regintel/profile` | `/api/regintel/profile` |
| `GET` | `/api/regintel/profile/{profileId}` | `/api/regintel/profile/{profileId}` |
| `GET` | `/api/regintel/profile/org/{orgId}` | `/api/regintel/profile/org/{orgId}` |
| `POST` | `/api/regintel/analyze` | `/api/regintel/analyze` |
| `POST` | `/api/regintel/compliance/full-analysis` | `/api/regintel/compliance/full-analysis` |

`POST /api/regintel/ingest/run` optionally checks `INGESTION_SECRET`. If configured, callers must send:

```http
Authorization: Bearer <INGESTION_SECRET>
```

## Express Backend API

The Express backend in `backend/src/index.js` is a small, in-memory service. It is useful for demos, but payment links are lost when the process restarts.

Base URL: `http://localhost:4000/api`

### Create Demo Payment Link

`POST /api/payment-link`

Request:

```json
{
  "amount": "25",
  "memo": "Invoice #1007"
}
```

Response:

```json
{
  "url": "http://localhost:3001/pay/pl_...",
  "id": "pl_..."
}
```

Validation:

| Code | Meaning |
| --- | --- |
| `400` | `amount` missing. |

### Get Demo Payment Link

`GET /api/payment-link/{id}`

Response:

```json
{
  "amount": "25",
  "memo": "Invoice #1007",
  "createdAt": "2026-05-30T12:00:00.000Z"
}
```

Status codes:

| Code | Meaning |
| --- | --- |
| `200` | Link found. |
| `404` | Link not found. |

## AI Analyzer API

The AI Analyzer FastAPI service exposes direct endpoints and also powers several frontend proxy routes.

Base URL: `http://localhost:8001`

The full scraper OpenAPI document lives at `ai-analyzer/openapi.yaml`.

### Health

`GET /health`

Response:

```json
{
  "status": "ok"
}
```

### Compliance Checklist

`POST /api/compliance/checklist`

Generates compliance checklist items from business profile inputs.

Response:

```json
{
  "items": [
    {
      "id": "item-1",
      "text": "Complete AML risk assessment."
    }
  ]
}
```

### Widget Recommendations

`POST /api/widgets/recommendations`

Returns 2-3 widget bundles with reasoning and numeric estimates. Uses OpenAI when configured, otherwise falls back to heuristics.

### Compliance Agent

| Method | Route | Purpose |
| --- | --- | --- |
| `POST` | `/api/compliance-agent/analyze` | Analyze uploaded or submitted compliance material. |
| `POST` | `/api/compliance-agent/detail-plan` | Generate a detailed action plan for a compliance item. |

### Business Impact Agent

| Method | Route | Purpose |
| --- | --- | --- |
| `POST` | `/agent/business-impact-report` | Generate a business-impact report. |
| `POST` | `/agent/business-impact-news` | Fetch or summarize relevant business-impact news. |
| `POST` | `/agent/business-impact-report/email` | Generate or send an email-ready business-impact report. |

### RegIntel

| Method | Route | Purpose |
| --- | --- | --- |
| `GET` | `/api/regintel/sources` | List configured regulatory sources. |
| `POST` | `/api/regintel/sources` | Create a regulatory source. |
| `GET` | `/api/regintel/sources/{source_id}` | Get a source. |
| `PATCH` | `/api/regintel/sources/{source_id}` | Update a source. |
| `DELETE` | `/api/regintel/sources/{source_id}` | Delete a source. |
| `POST` | `/api/regintel/ingest/run` | Run ingestion for configured sources. |
| `POST` | `/api/regintel/profile` | Create a RegIntel business profile. |
| `GET` | `/api/regintel/profile/{profile_id}` | Get a RegIntel profile. |
| `GET` | `/api/regintel/profile/org/{org_id}` | Get profiles for an organization. |
| `POST` | `/api/regintel/analyze` | Analyze a profile against regulatory sources. |
| `POST` | `/api/regintel/compliance/full-analysis` | Run full compliance analysis. |

### Compliance Scraper

Scraper endpoints are mounted under `/api/scraper`.

| Method | Route | Purpose |
| --- | --- | --- |
| `GET` | `/api/scraper/sources` | List available scraper source names. |
| `POST` | `/api/scraper/run/all` | Run all scrapers. |
| `POST` | `/api/scraper/run/{source}` | Run one scraper. |
| `GET` | `/api/scraper/run/{source}/raw` | Return raw scraped content. |
| `POST` | `/api/scraper/normalize/all` | Normalize changed sources. |
| `POST` | `/api/scraper/normalize/{source}` | Normalize one source. |
| `GET` | `/api/scraper/regulations` | List normalized regulations. |
| `DELETE` | `/api/scraper/regulations` | Delete all normalized regulations. |
| `DELETE` | `/api/scraper/hashes` | Reset scraper hash state. |

`GET /api/scraper/regulations` supports these query parameters:

| Query | Description |
| --- | --- |
| `jurisdiction` | Filter by jurisdiction, for example `US`, `EU`, `UAE`, or `SG`. |
| `category` | Filter by category, for example `KYC`, `AML`, `Licensing`, `Tax`, `Privacy`, or `sanctions`. |
| `applies_to` | Partial-match filter for the business type the regulation applies to. |

## Common Status Codes

| Code | Meaning |
| --- | --- |
| `200` | Request succeeded. |
| `400` | Missing or invalid input. |
| `401` | Missing or invalid session/token. |
| `403` | Session is valid but does not own the requested resource. |
| `404` | Resource not found. |
| `500` | Server error or missing server configuration. |
| `502` | Upstream service, chain submission, or payout failed. |
| `503` | Database or external service unavailable. |

## Local Development

Start the services separately:

```bash
# Next.js frontend API
cd frontend
npm run dev
```

```bash
# Express backend
cd backend
npm run dev
```

```bash
# AI Analyzer
cd ai-analyzer
uvicorn app.main:app --reload --port 8001
```

Useful local URLs:

| URL | Description |
| --- | --- |
| `http://localhost:3000/api/auth/me` | Frontend API session check. |
| `http://localhost:4000/api/payment-link/{id}` | Express demo payment link lookup. |
| `http://localhost:8001/health` | AI Analyzer health check. |
| `http://localhost:8001/docs` | FastAPI interactive docs for AI Analyzer. |

