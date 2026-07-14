# Tech Stack Planning

## Overview

This document explains the technical changes needed in the current Hypertron repository to support a proper Payments API v1. The goal is not to lightly rebrand payment links, but to build a real developer-facing payments platform on top of the checkout and Stellar settlement rails that already exist in the codebase.

The most important architectural decision is to treat this as an application-platform build rather than a blockchain-contract build. The existing repo already has useful primitives for business identity, checkout, payment attribution, and settlement verification. What it does not yet have is the full control plane and developer platform layer that sits on top of those rails. That missing layer is where most of the engineering work belongs.

## Current Repository Shape

Hypertron already has a fairly clear separation of concerns, even if it was not originally designed around this new PRD. The main product application lives in `frontend/`, and most of the real backend behavior already lives inside Next.js API routes under `frontend/src/app/api/`. Shared logic is organized under `frontend/src/lib/`, and the Soroban contract code lives under `contracts/`. There is also an older lightweight backend under `backend/`, but it reads like a stub and should not become the main runtime for Payments API v1 unless the architecture is intentionally being split into separate services later.

That means the fastest and safest path is to continue building the platform in the existing product structure:

- frontend dashboard and checkout work in `frontend/src/app` and `frontend/src/components`
- backend application logic in `frontend/src/app/api`
- shared domain logic in `frontend/src/lib`
- database changes in `frontend/prisma/schema.prisma`
- smart contract work, only where truly needed, in `contracts/poolmanager`

## Product Layer We Need To Add

The current repo has enough infrastructure to collect and verify payments, but it still lacks the core abstractions that make a merchant payments platform feel complete. We need to introduce first-class concepts such as API keys, payments, payment events, webhook endpoints, webhook deliveries, and lightweight customer records. These are not just new tables or new routes; they become the language the whole product speaks.

The most important product abstraction in this migration is the `Payment` object. Today the repo is largely built around `PaymentLink`. For Payments API v1, `PaymentLink` should become an internal rail or implementation detail, while `Payment` becomes the public object returned to merchants. That single change will influence the backend API shape, dashboard UI, webhook payloads, and reconciliation logic.

## Frontend Planning

On the frontend side, the product needs to move from a dashboard with payment features to a merchant control plane. The existing dashboard structure gives us a strong starting point, especially in the payments area, but the mental model needs to be upgraded. Instead of treating payments as a collection workflow driven by links, the UI should reflect a platform that has merchants, environments, API credentials, payment objects, and delivery logs.

The merchant-facing dashboard should grow into a cleaner set of surfaces: Overview, Payments, API Keys, Webhooks, Developers, and Settings. Some of the current components can be reused, especially around list layouts, checkout previews, and payment-related UI primitives, but the data powering those screens will need to come from the new `Payment` model rather than only from `PaymentLink` rows.

The Payments page should be rebuilt around real payment records and should show information such as payment ID, customer, amount, currency, status, timestamps, and any relevant blockchain reference. The API Keys page should allow merchants to create test and live keys, reveal secrets once, rotate them, revoke them, and see when a key was last used. The Webhooks page should let merchants register endpoints, inspect signing secrets, and understand delivery outcomes. The Developers page should provide a narrow, practical setup path instead of generic documentation. The Settings page should be expanded to include merchant branding, success and failure redirects, default currency, and webhook-related defaults.

The hosted checkout in `frontend/src/app/pay/[id]` should also be adapted rather than replaced. The checkout flow itself is already one of the stronger parts of the repo, so the right move is to make it `Payment` or `CheckoutSession` driven. That means the page should continue handling the wallet interaction and transaction submission flow it already knows how to do, but it should resolve its state from the new payment system, show merchant branding more intentionally, and redirect cleanly according to merchant settings when the payment finishes or fails.

## Backend Planning

The backend work is the main engineering body of this project. The current Next.js API layer already contains many of the right ingredients, but it needs a new domain layer that speaks in terms of merchant payments rather than internal link flows. This begins with the data model.

The Prisma schema should be expanded to include at least `ApiKey`, `Payment`, `PaymentEvent`, `Customer`, `WebhookEndpoint`, and `WebhookDelivery`. We may also introduce a `CheckoutSession` model, although that could be folded into the `Payment` model initially if we want to keep the MVP leaner. The existing `Business` model should remain the merchant entity for now. Renaming it to `Merchant` would create unnecessary churn across the repo. Instead, we should add the fields we need for branding and developer configuration, such as logo URL, success URL, failure URL, and default currency.

The API layer needs to be split into two clearly different access patterns. One set of routes will be session-authenticated merchant control-plane APIs used by the dashboard. These include API key management and webhook endpoint management. Another set of routes will be bearer-authenticated public developer APIs, especially the new `POST /payments`, `GET /payments`, and related payment endpoints. This separation matters because merchant staff using the dashboard and merchant applications calling Hypertron programmatically are not the same kind of actor, even if they belong to the same business.

The API key system itself needs to be treated seriously. Secret keys should be generated securely, stored only as hashes, separated into test and live environments, and tracked for usage and revocation. This is the trust boundary of the whole developer platform. If this layer feels weak or ad hoc, the rest of the platform will feel weak too.

The payment creation flow should then be built on top of that authentication layer. `POST /payments` should authenticate the key, validate the request, create a canonical `Payment`, create or map an internal checkout mechanism, and return `payment_id`, `checkout_url`, and status. Behind the scenes, the simplest initial implementation is to reuse the current payment-link and checkout machinery while keeping it hidden from the public API surface. This lets us move quickly without forcing a full rewrite of the underlying settlement rail.

The next major backend responsibility is lifecycle management. Right now the repo depends too much on request-time settlement checks and frontend-driven polling. That is acceptable for the current product stage, but it is not the right source of truth for a merchant platform. We need a reusable reconciliation and state transition layer that can evaluate a payment, move it through canonical states such as `created`, `pending`, `confirmed`, and `completed`, and write immutable `PaymentEvent` records as it goes. The dashboard, checkout, and webhook system should all read from that same lifecycle truth.

Webhooks then become the final application-facing layer. We need a real webhook engine with endpoint storage, signing secrets, delivery attempts, retries, and delivery logs. The first version only needs a small event set, such as `payment.created`, `payment.pending`, `payment.completed`, and `payment.failed`, but those events should be modeled properly from the start. If webhook delivery fails, the merchant should be able to inspect that failure from the dashboard rather than being left in the dark.

Finally, the backend should derive lightweight customer records from payment requests and completed payments. This does not need to become a CRM product in the MVP. It simply needs to provide a merchant with a reasonable view of who has paid, how often, and for how much.

## Smart Contract Planning

The smart contract side of the repo is important, but it should not dominate the MVP plan. Hypertron already has a Soroban contract under `contracts/poolmanager`, and that contract is clearly part of the privacy and commitment system. However, the merchant payments platform described in the PRD is primarily an application-layer product. Merchants do not care whether the internal system began from a payment link, a memo, a reconciliation job, or a contract interaction. They care that Hypertron creates a payment, hosts the checkout, verifies the settlement, and sends a reliable webhook.

Because of that, the correct recommendation for the MVP is to make smart contract changes minimal or optional. Existing off-chain settlement verification can remain the core mechanism for payment completion. The current PoolManager and nullifier flow can continue to exist as an internal or optional privacy rail. We should avoid making the launch of Payments API v1 dependent on a contract redesign, full cryptographic privacy completion, or a deeper contract-centric payment lifecycle.

That said, small smart contract improvements could still be useful if they improve observability or reduce integration friction. For example, clearer event emission, better ABI alignment with current wrapper code, or helper methods that simplify backend monitoring could all be worthwhile. But those are supporting improvements, not the main event. The bigger privacy-native expansion can happen later, once the merchant platform itself is working well.

## Recommended Build Sequence

The build should begin at the data model and backend service layer, because that is where the new platform vocabulary is defined. The first phase should update the Prisma schema, introduce the new models, and extend the `Business` model with merchant-facing configuration. After that, we should build the backend domain utilities for API keys, payment creation, reconciliation, payment events, and webhooks. Only once those foundations exist should we expose them through merchant dashboard APIs and public developer APIs.

With those pieces in place, we can then map the new `Payment` object onto the current internal checkout and payment-link flow. That allows us to start returning `payment_id` and `checkout_url` quickly without immediately rebuilding the entire collection rail. Once that works, the next priority is to move settlement truth into a proper reconciliation flow and generate immutable payment events from it. The webhook engine can then sit on top of those events.

After the backend is stable, the frontend should be upgraded to match the new platform model. This includes building real Payments, API Keys, Webhooks, and Developers pages, along with expanding Settings and improving the hosted checkout experience. Smart contract cleanup, if we want any in the MVP window, should be kept toward the end so it does not derail the main application-platform delivery.

## Final Direction

The architecture we are aiming for is straightforward at a high level. A merchant application calls Hypertron's Payments API using an API key. Hypertron creates a canonical payment object, opens a checkout session, accepts customer payment through its hosted checkout, reconciles settlement into a business-ready lifecycle state, and then delivers a signed webhook back to the merchant application. The dashboard becomes the merchant's control plane for everything around that loop.

In practical terms, that means most of the real work belongs in the frontend app's backend layer and the database model, while the Soroban contracts remain a supporting system rather than the driver of the MVP. The repo is already strong enough to support this direction, but the main lift is still ahead: we need to build the platform layer that connects the existing rails into a coherent merchant product.
