# Merchant Flow

## Overview

This document describes what the merchant experience should feel like after Hypertron evolves from its current dashboard-plus-payment-links product into a developer-first payments platform. The core idea is simple: a business should be able to sign up, generate API credentials, create a payment from its own backend, send a customer to Hypertron Checkout, and receive a webhook when the payment is completed. The merchant should not need to understand Stellar mechanics, transaction lookup, or reconciliation logic in order to use the product successfully.

The reason this flow matters is that it changes Hypertron from a useful payments tool into a real payments platform. Today, the experience is more internal and workflow-oriented. After this build, the merchant journey becomes cleaner, more programmable, and much closer to the mental model developers already have from products like Stripe or Razorpay.

## Merchant Onboarding

The merchant journey starts when a user signs up to Hypertron using the current application authentication flow. Hypertron should either create a new business workspace for that user or resolve the one they already belong to, and then bring them into a dashboard that clearly points toward setup and integration rather than just feature exploration.

At this stage, the merchant should complete a basic business profile. This setup should include the business name, email, brand logo, default payment currency, success URL, failure or cancel URL, and webhook endpoint. These settings are important because they define both the customer-facing checkout experience and the post-payment behavior that the merchant will expect in their own application.

Once this profile is in place, the merchant is no longer just a dashboard user. They are now ready to act as a payment integrator.

## Developer Setup

After onboarding, the merchant moves into a developer setup flow. This is where Hypertron should begin to feel like an API product. The merchant opens the Developers section, generates test and live API keys, and sees a short, practical quickstart rather than a long documentation maze.

The quickstart should explain only the minimum needed to become successful:

1. How to authenticate using a secret key.
2. How to create a payment with a single API request.
3. How to receive and verify webhooks.

At this point, the merchant should be able to copy a test key into their backend and immediately start creating test payments. This is the moment where the product stops being a manual payment-link tool and starts becoming infrastructure.

## Payment Creation Flow

The actual integration flow begins from the merchant's backend. Their server sends a `POST /payments` request to Hypertron with the amount, currency, customer information, and any metadata needed to connect the payment to an internal order or invoice. Hypertron authenticates the request using the merchant's secret key and creates a first-class `Payment` record inside its own system.

That `Payment` record becomes the canonical object for the developer platform. Hypertron then creates a checkout session for that payment and returns a response containing the `payment_id`, `checkout_url`, and current status. The merchant can then either return that URL to their frontend or redirect the customer directly.

From the merchant's perspective, this is the most important product interaction in the whole system. If this part is fast, simple, and predictable, the entire platform feels credible.

## Customer Checkout Flow

Once the customer opens the hosted checkout page, Hypertron takes over the payment experience. The checkout page should clearly display the merchant's branding, the payment amount, the accepted asset or currency, and the payment action the customer needs to complete. The goal here is not just functional correctness, but trust and clarity. The customer should feel like they are paying a real business through a professional payments layer, not using an internal crypto tool.

The customer then signs and submits the payment through the Stellar flow already present in Hypertron. While this happens, the checkout page should communicate the live payment lifecycle in understandable terms such as awaiting payment, pending, confirmed, and completed. After the payment succeeds, Hypertron redirects the customer to the merchant's success URL. If the payment is cancelled or fails, it redirects to the merchant's failure or cancel URL.

This hosted checkout becomes one of the strongest product surfaces in the entire system, because it is where merchant trust and customer trust meet.

## Settlement and Reconciliation Flow

After the customer submits the payment, Hypertron's backend becomes responsible for turning a blockchain event into a merchant-ready business event. Hypertron detects the incoming payment, verifies the destination, asset, amount, and attribution data, and then updates the internal payment lifecycle.

The important thing here is that the merchant should never need to poll the blockchain or manually cross-check a transaction explorer. Hypertron should take the raw settlement signal and convert it into a clean, deterministic payment state. Internally, this state should move through a lifecycle such as `created`, `pending`, `confirmed`, and `completed`, with immutable event records being written along the way.

This is what turns raw on-chain settlement into a usable product primitive.

## Webhook Flow

Once a payment is completed, Hypertron should generate a `payment.completed` event and deliver it to the merchant's configured webhook endpoint. That payload should be signed so the merchant can verify that it genuinely came from Hypertron. The merchant's backend then validates the signature and marks the associated order, invoice, or internal payment record as paid.

This is the handoff moment between Hypertron and the merchant's application. It is also where the platform proves its value: the merchant should not have to understand transaction hashes or manual settlement logic, because Hypertron has already translated those into a business event they can trust.

If webhook delivery fails, Hypertron should retry and retain delivery logs so the merchant can inspect failures and recover without ambiguity.

## Merchant Dashboard After Integration

Once a merchant is live, the dashboard becomes the control plane for their payments operation. It should no longer feel like a standalone feature surface. Instead, it should reflect the exact same payment system that powers the public API.

The Overview page should summarize payment volume, counts, and recent status trends. The Payments page should show first-class payment records with status, amount, customer, timestamps, and transaction references. The API Keys page should allow merchants to generate, rotate, and revoke credentials. The Webhooks page should show configured endpoints and recent deliveries. A lightweight Customers section can provide basic visibility into repeat payers and lifetime value. The Developers page should remain the merchant's home for quickstart guidance, snippets, and environment setup.

When all of these surfaces are tied to the same backend payment model, the platform begins to feel coherent rather than stitched together.

## Net Product Flow

At a system level, the final product loop becomes:

`Merchant App -> Hypertron Payments API -> Hypertron Checkout -> Stellar Settlement -> Hypertron Reconciliation -> Hypertron Webhooks -> Merchant App`

That loop is the real heart of the product. The merchant's application initiates payment creation, Hypertron manages the customer-facing checkout and settlement abstraction, and then Hypertron returns a signed business event back into the merchant's system. Everything else in the dashboard exists to support, monitor, and configure that loop.

## What Changes For Hypertron

Before this build, Hypertron is primarily a dashboard-centered product with payment links, treasury functionality, and privacy-related rails. After this build, Hypertron becomes a developer-first merchant payments platform. The center of gravity shifts from internal flows to programmable flows.

That means the platform starts to be defined by API keys, payment objects, checkout sessions, payment lifecycle states, webhooks, and merchant configuration. The existing payment-link and settlement machinery still matters, but it becomes internal infrastructure rather than the main product abstraction.

## MVP Success Criteria

The MVP should be considered successful when a new merchant can create an account, generate a test key, make a payment request from their backend in a few lines of code, redirect a customer to Hypertron Checkout, receive a signed `payment.completed` webhook, and update their own system without ever manually checking Stellar.

If that end-to-end experience feels smooth, then Hypertron will have a real platform foundation to build on.
