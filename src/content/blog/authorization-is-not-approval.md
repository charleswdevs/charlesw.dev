---
title: "Authorization Is Not Approval"
description: "A technical guide to understanding where payment performance becomes revenue performance."
pubDate: 2026-07-11
images:
  - /blog-assets/authorization-is-not-approval/social-card.png
  - /blog-assets/authorization-is-not-approval/authorization-flow.png
  - /blog-assets/authorization-is-not-approval/payment-success-funnel.png
tags: ["payments", "authorization", "card-not-present", "saas", "payment-optimization", "engineering"]
---

## A technical guide to understanding where payment performance becomes revenue performance

Authorization is a process. Approval is an outcome.

Confusing the two leads teams to misread payment performance and overstate revenue success.

The terms are routinely used interchangeably in payments. Providers talk about authorization rates. Dashboards report authorized transactions. Teams describe payments as authorized when they really mean approved.

That shorthand is understandable. It is also incomplete.

Authorization describes the request-response exchange through which a payment is evaluated. Approval is the positive response returned from that process. The distinction matters because an approved authorization is still several steps removed from retained revenue.

For technical teams, this is more than vocabulary. It changes how we instrument systems, interpret metrics, diagnose failures, evaluate optimizations, and explain payment performance to the rest of the business.

## What authorization actually means

At its simplest, a card-not-present authorization follows a familiar path:

**Merchant → gateway → processor or acquirer → card network → issuer → response**

The merchant constructs an authorization request containing the payment credentials, amount, currency, merchant information, transaction indicators, and any additional context available for the transaction.

That request travels through the payment chain until it reaches the issuing financial institution. The issuer evaluates it and returns a response, commonly an approval or decline.

Visa defines authorization as the process an issuer uses to approve or decline a payment-card transaction. Mastercard separates authorization from the later clearing and settlement activities in its own transaction-processing model.

That is the simple model.

The actual card-not-present path is more distributed.

![A distributed card-not-present authorization flow showing merchant application, merchant fraud and eligibility, gateway, processor or acquirer, card network, issuer decision, and the returning response.](/blog-assets/authorization-is-not-approval/authorization-flow.svg)

*A card-not-present authorization request is evaluated by multiple systems before and after the issuer decision.*

An authorization request may be validated, enriched, transformed, tokenized, rerouted, rejected, or interrupted before it ever reaches the issuer.

Different systems may evaluate:

- Whether the invoice or order is eligible for payment
- Whether the payment method is valid
- Whether the transaction violates merchant fraud rules
- Whether required fields are present
- Whether stored-credential indicators are correctly populated
- Whether a token must be translated into another credential
- Which gateway, processor, acquirer, or merchant identifier should be used
- Whether the request conforms to provider or network requirements
- Whether the issuer is available to make a decision

The issuer may return the final authorization response, but the request it evaluates has already passed through a series of technical and risk decisions.

## One request, many decisions

It is useful to distinguish between two forms of approval.

A **flow approval** means that an upstream system allows the request to continue.

A merchant fraud system may allow a transaction to proceed. A gateway may accept the payload. A processor may successfully route the message. A card network may pass it to the issuer.

Each is a positive outcome, but none is an issuer authorization approval.

An **authorization approval** is the positive response returned by the issuer after evaluating the transaction.

This distinction becomes important when payment systems collapse every unsuccessful outcome into a single category called “declined.”

A merchant rule may prevent an invoice from entering the payment flow. A gateway may reject an invalid request. A processor may be unavailable. A routing rule may select an unsupported path. A network timeout may prevent a response from returning.

Commercially, every one of those outcomes can prevent revenue from being realized.

Operationally, they are not the same failure.

In our work at Revaly, we regularly see payment environments where provider responses, technical failures, merchant decisions, and issuer declines are combined in reporting. The result is a decline rate that describes several different failure domains while providing little guidance about which system should be improved.

That is a larger subject on its own. The important point here is that authorization is a distributed process, not a single function call to an issuer.

## Approval is permission to continue

An approval is the positive authorization response indicating that the transaction may proceed under the conditions evaluated at that moment.

Depending on the payment flow, an approval may reserve funds or available credit and return an authorization code. It gives the merchant permission to continue toward capture.

It does not mean that the merchant has completed the payment.

Stripe’s manual-capture flow makes this separation explicit: once a payment method has been authorized, the payment moves into a state requiring a separate capture request. Adyen similarly describes capture as the step required to complete an authorized payment.

An approval does not guarantee that:

- The merchant will successfully capture the payment
- The authorization will remain valid until capture
- The captured transaction will settle
- The transaction is legitimate
- The merchant is protected from a dispute
- The payment will not be refunded
- The revenue will ultimately be retained

Approval is a technical decision.

It is not yet the business outcome.

## Why the distinction matters

Calling an approval an authorization is usually harmless when everyone understands the intended meaning.

The problem appears when the shorthand enters measurement and diagnosis.

Consider a team reporting an 80 percent authorization rate. That might mean:

- 80 percent of invoices resulted in an initial issuer approval
- 80 percent of authorization attempts were approved
- 80 percent of requests that reached the issuer were approved
- 80 percent of attempts eventually succeeded after retries
- 80 percent of transactions passed the merchant and provider stack

Those are different metrics.

They use different denominators, describe different parts of the system, and suggest different optimization opportunities.

The term **authorization rate** is well established across the industry. Adyen, for example, defines it as the percentage of transactions that are authorized. Stripe also uses authorization to describe issuer approval.

There is little value in policing that language.

There is considerable value in defining exactly what the metric measures.

For this discussion, I will distinguish between:

- **Authorization attempt rate:** the share of payment obligations that enter the authorization flow
- **Initial approval rate:** the share of initial authorization attempts that receive a positive issuer response
- **Attempt approval rate:** the share of all authorization attempts, including retries, that receive a positive issuer response
- **Net payment success rate:** the share of payment obligations that ultimately become retained revenue after known downstream losses

Each answers a different question.

## The payment success funnel

A more complete model begins before authorization and continues well beyond approval:

**Payment obligation → authorization attempt → approval → capture → settlement → retained revenue**

A payment obligation is the commercial event. It might be an invoice, an order, a subscription renewal, or another amount due.

An authorization attempt is one technical request made against that obligation.

One obligation can generate multiple authorization attempts. This commonly happens when a merchant retries an initially declined payment.

Capture is the instruction to complete an approved transaction. Depending on the integration, it may happen automatically or through a later request.

Clearing and settlement occur after authorization. Visa describes clearing as the post-authorization process through which transactions are collected and exchanged before final settlement. Mastercard similarly treats authorization, clearing, and settlement as separate processing activities.

Retained revenue is what remains after known downstream losses such as refunds, cancellations, fraud, disputes, and chargebacks.

These stages form a funnel because value can be lost at every transition.

## A hypothetical SaaS renewal cycle

Consider a SaaS business with **1,000 invoices due for renewal**.

The numbers below are plausible but synthetic. They are designed to demonstrate the mechanics of the funnel, not to establish a benchmark.

### Stage 1: Invoice eligibility

Of the 1,000 invoices, 970 are considered eligible for payment.

The remaining 30 are excluded because of merchant-side conditions such as cancelled subscriptions, suspended accounts, missing payment methods, or other business rules.

**970 eligible invoices**

- 97.0% of invoices due
- 97.0% conversion from invoices due

Eligibility rules are often treated as administrative logic. They are also hidden conversion filters. When they exclude a legitimate payment obligation incorrectly, revenue disappears before authorization begins.

### Stage 2: Initial authorization

Of the 970 eligible invoices, 950 produce an initial authorization attempt.

**950 initial authorization attempts**

- 95.0% of invoices due
- 97.9% of eligible invoices

The **gross authorization attempt rate** is 95.0 percent.

The **eligible authorization attempt rate** is 97.9 percent.

Those two rates expose different problems. The first captures all pre-authorization leakage. The second describes the system’s ability to submit obligations already considered eligible.

### Stage 3: Initial approvals

Of the 950 initial attempts, 760 receive issuer approvals.

**760 initial approvals**

- 76.0% of invoices due
- 80.0% of initial authorization attempts

The **initial approval rate** is 80.0 percent.

At this point, 760 invoices have received permission to continue. The merchant does not yet have 760 retained payments.

### Stage 4: Retry recovery

The 190 initially unsuccessful invoices enter a recovery strategy.

Assume the merchant submits 140 additional authorization attempts across that population and recovers 60 invoices.

**60 additional invoices approved through retries**

- 6.0% of invoices due
- 31.6% of initially unsuccessful invoices

The merchant now has 820 approved payment obligations:

**820 eventual approvals**

- 82.0% of invoices due
- 86.3% of initially attempted invoices

Across the initial and retry activity, the merchant submitted 1,090 authorization attempts and received 820 approvals.

The **attempt approval rate** is therefore 75.2 percent.

That is lower than the 80.0 percent initial approval rate, even though retries improved the number of invoices eventually approved.

Nothing is contradictory here. The metrics answer different questions.

Initial approval rate measures the first attempt.

Attempt approval rate measures the efficiency of every request.

Eventual approval measures the outcome for unique payment obligations.

### Stage 5: Capture

Of the 820 approved payment obligations, 810 are successfully captured.

**810 captured payments**

- 81.0% of invoices due
- 98.8% of eventually approved invoices

Ten approved payments disappear between approval and capture.

Possible causes include authorization expiration, amount mismatches, delayed capture, invalid capture requests, merchant logic, or provider failures.

### Stage 6: Settlement

Of the 810 captured payments, 802 settle.

**802 settled payments**

- 80.2% of invoices due
- 99.0% of captured payments

Mastercard and Visa both treat settlement as separate from authorization, while provider lifecycle documentation also exposes capture and settlement as distinct payment states.

A captured transaction may still encounter funding, reversal, provider, or reconciliation issues before the merchant recognizes the expected funds.

### Stage 7: Downstream retention

Of the 802 settled payments, 12 are later refunded or cancelled.

A further 15 are lost through fraud, disputes, or chargebacks.

**775 retained payments**

- 77.5% of invoices due
- 96.6% of settled payments
- 94.5% of eventually approved payments

The **net payment success rate** is 77.5 percent.

The merchant had an 80.0 percent initial approval rate.

It eventually obtained approvals for 82.0 percent of all invoices.

It retained revenue from 77.5 percent.

All three numbers are correct.

None is interchangeable.

![A payment success funnel showing 1,000 invoices due, 970 eligible invoices, 950 initial authorization attempts, 760 initial approvals, 820 eventual approvals, 810 captured payments, 802 settled payments, 790 payments after refunds, and 775 retained payments.](/blog-assets/authorization-is-not-approval/payment-success-funnel.svg)

*The funnel shows why approval rate, eventual approval, and retained revenue are related but not interchangeable.*

> The figures in this example are illustrative and are not intended as industry benchmarks. They reflect patterns consistent with payment performance data the team at Revaly has observed across card-not-present merchant environments.

## Payment performance is revenue performance

The difference between 820 approvals and 775 retained payments may appear small when viewed as a percentage.

At enterprise scale, it is not small.

It is 45 customer payments that passed issuer decisioning but did not survive the remainder of the payment lifecycle. It is another 180 invoices that entered authorization but never obtained an approval. It is 30 invoices excluded before authorization and another 20 that were eligible but never submitted.

Each population represents a different system problem.

Improving issuer approval will not resolve a capture defect.

Improving retry timing will not repair a malformed initial request.

Improving capture reliability will not prevent excessive refunds.

Optimizing fraud controls may increase approval while creating unacceptable downstream losses if the broader outcome is ignored.

This is why technical payment work cannot be judged only through correctness, availability, latency, or even approval lift.

Those remain critical engineering measures. They simply sit inside a larger commercial system.

For SaaS businesses, that system deserves particular attention. As LLMs reduce the effort required to produce and compete with software, businesses face increasing pressure to defend retention, improve growth efficiency, and convert product usage into durable revenue.

Every invoice represents a customer the company has already spent money to acquire, onboard, support, and retain.

A payment failure occurs at the end of that investment.

The payments stack is therefore not merely infrastructure, product plumbing, or a risk-control system. It is the final conversion layer of the revenue funnel.

Authorization tells us that a payment entered the decisioning process.

Approval tells us that the issuer allowed it to continue.

Net payment success tells us whether the business retained the payment.

The more valuable outcome sits one level higher still.

The true outcome is not a successful transaction. It is preserving the customer relationship and the future value behind it.

The payments stack is where acquired demand becomes realized and retained value.

---

> **Note**
>
> This series reflects my own observations, conclusions, and experience working with card-not-present payment systems. It also includes patterns the team at Revaly has seen in practice. Where terminology or behaviour varies across providers, I will call that out.

## Sources and further reading

- Visa Developer, [*Glossary*](https://developer.visa.com/pages/visa-developer-glossary), for authorization, clearing, and settlement terminology.
- Mastercard, [*Transaction Processing Rules*](https://www.mastercard.us/content/dam/public/mastercardcom/na/global-site/documents/transaction-processing-rules.pdf), for the separation of authorization, clearing, and settlement activities.
- Stripe, [*Place a hold on a payment method*](https://docs.stripe.com/payments/place-a-hold-on-a-payment-method), for separate authorization and capture mechanics.
- Adyen, [*Payments lifecycle*](https://docs.adyen.com/online-payments/payment-lifecycle/) and [*Glossary*](https://docs.adyen.com/development-resources/glossary/), for authorization, capture, and settlement states.
