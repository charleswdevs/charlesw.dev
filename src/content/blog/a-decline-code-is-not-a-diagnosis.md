---
title: "A Decline Code Is Not a Diagnosis"
description: "How payment responses lose meaning across gateways, processors, networks, and merchant systems."
pubDate: 2026-07-11
images:
  - /blog-assets/a-decline-code-is-not-a-diagnosis/social-card.png
  - /blog-assets/a-decline-code-is-not-a-diagnosis/response-translation-pipeline.png
  - /blog-assets/a-decline-code-is-not-a-diagnosis/response-layer-model.png
  - /blog-assets/a-decline-code-is-not-a-diagnosis/decline-code-translation-flow.png
  - /blog-assets/a-decline-code-is-not-a-diagnosis/issuer-to-merchant-response-path.png
  - /blog-assets/a-decline-code-is-not-a-diagnosis/many-to-one-normalization.png
tags: ["payments", "authorization", "declines", "card-not-present", "payment-optimization", "engineering"]
---

## How payment responses lose meaning across gateways, processors, networks, and merchant systems

A card-not-present authorization fails.

The merchant receives:

```text
do_not_honor
```

That appears to be an explanation.

It is not.

It may be the gateway’s translation of a processor response. The processor response may itself be a normalized representation of a network message. The network message may contain a generic response selected by the issuing financial institution, by the network acting on the issuer’s behalf, or by an intermediary unable to preserve the original detail.

By the time the merchant sees `do_not_honor`, the response may have passed through several systems, each applying its own vocabulary and interpretation.

The merchant is left with a value that looks precise but may mean little more than:

> The authorization was not approved, and no more specific reason is available here.

This is not limited to `do_not_honor`.

Payment gateways expose proprietary response codes, statuses, decline reasons, processor messages, error types, and human-readable descriptions. Some preserve the underlying network or acquirer response. Others translate it. Some expose both. Others collapse multiple upstream conditions into one merchant-facing category.

Merchants then add another translation layer by converting these responses into internal concepts such as:

```text
soft_decline
hard_decline
processor_error
```

Each translation makes the response easier to consume.

Each translation can also remove information.

A decline code is therefore not a diagnosis. It is one piece of evidence produced by a chain of systems.

This is the companion problem to the one described in [Authorization Is Not Approval](/blog/authorization-is-not-approval/): a payment outcome is only meaningful when the system, stage, and denominator behind it are explicit.

![A decline response moving from issuer decision through network, processor, gateway, and merchant systems, losing diagnostic detail at each translation boundary.](/blog-assets/a-decline-code-is-not-a-diagnosis/response-translation-pipeline.svg)

*The merchant-facing decline reason may be several translations away from the original decision.*

---

## The merchant does not receive one response code

It is common to refer to “the response code” as though every failed authorization produces a single authoritative value.

In practice, one payment attempt may produce several distinct response fields:

- A top-level transaction status
- An API error type
- A gateway-specific response code
- A normalized decline reason
- A processor response code
- A network response code
- A processor response message
- Raw acquirer data
- A merchant-defined internal classification

These fields are not interchangeable.

A top-level status answers a question such as:

> Did the gateway consider this payment successful?

A decline reason attempts to answer:

> How did the gateway categorize the failure?

A raw processor or network code may answer:

> What response did the downstream system return?

An internal merchant classification answers:

> How does our organization want to group this outcome?

Those are different questions.

Consider a simplified response model:

```json
{
  "status": "failed",
  "error_type": "card_error",
  "decline_code": "do_not_honor",
  "processor_code": "05",
  "merchant_classification": "soft_decline"
}
```

The five values describe five different layers of interpretation.

`failed` is an outcome.

`card_error` is an API-level error category.

`do_not_honor` is a normalized gateway reason.

`05` is a downstream response that may have originated with an issuer, network, or processor.

`soft_decline` is an operational classification assigned by the merchant or one of its providers.

None of these values, standing alone, explains exactly why the issuing financial institution rejected the transaction.

![A layered response model separating outcome, API error, gateway decline reason, processor code, network code, and merchant classification.](/blog-assets/a-decline-code-is-not-a-diagnosis/response-layer-model.svg)

*A useful response model preserves each layer instead of forcing them into one field.*

---

## Begin with `05: Do Not Honor`

`05` is among the best-known authorization response codes.

Its traditional description is:

```text
Do Not Honor
```

That wording sounds definitive. It is actually one of the least diagnostic responses a merchant can receive.

A `05` response does not necessarily identify a specific defect in the payment request, a specific account condition, or a specific risk decision. It communicates that the transaction was declined without exposing a more precise reason through that response.

The actual issuer-side cause may involve fraud controls, account restrictions, transaction characteristics, internal policy, unavailable context, or a condition the issuer does not intend to disclose.

The merchant cannot reliably reverse-engineer that decision from `05`.

The ambiguity exists before the response reaches the gateway.

The payment path can then compound it.

A simplified flow can be shown as a translation path:

![A payment response moving from issuer decision to network response, processor representation, gateway decline reason, and merchant classification.](/blog-assets/a-decline-code-is-not-a-diagnosis/decline-code-translation-flow.svg)

*The merchant classification may be actionable without adding diagnostic detail.*

The final classification may look actionable, but no new diagnostic information was created along the way.

The systems only renamed the same ambiguity.

---

## The path from issuer response to merchant response

A merchant commonly thinks of the authorization response as travelling directly from the issuer back to its application.

The actual return path is closer to:

![The response path from issuing financial institution through card network, processor or acquirer, gateway or PSP, merchant payment service, and merchant reporting systems.](/blog-assets/a-decline-code-is-not-a-diagnosis/issuer-to-merchant-response-path.svg)

*The response can be translated before it reaches the system that stores or reports it.*

At each boundary, several things may happen:

1. The response may be passed through unchanged.
2. It may be converted into a different code set.
3. It may be mapped into a normalized category.
4. Additional fields may be attached.
5. Fields may be omitted.
6. Several upstream responses may be collapsed into one value.
7. The response may be reclassified as soft, hard, or erroneous.
8. A technical failure may replace the expected authorization response entirely.

The response that finally reaches the merchant is therefore not necessarily the response generated at the beginning of the return path.

It is the result of a translation pipeline.

---

## ISO-style codes are only one layer

Many payment professionals describe issuer and network outcomes using familiar two-digit values:

| Code | Common description |
|---|---|
| `05` | Do not honor |
| `14` | Invalid account number |
| `51` | Insufficient funds |
| `54` | Expired card |
| `57` | Transaction not permitted |
| `61` | Exceeds amount limit |
| `62` | Restricted card |
| `65` | Exceeds frequency limit |
| `91` | Issuer unavailable |
| `96` | System malfunction |

These codes are often described loosely as ISO 8583 codes because authorization systems commonly use ISO 8583-style response fields and conventions.

That does not mean every merchant receives the same two-digit code, or that every network, processor, or issuer uses every value identically.

Even within ISO 8583, versions and implementations differ. Networks also maintain their own message specifications and response values. Processors may introduce proprietary codes, combine network responses, or expose normalized host values rather than the value received from the network.

ISO-style codes are useful for understanding the source vocabulary of authorization systems.

They are not a universal merchant API.

Only selected integrations expose something close to that source vocabulary directly.

J.P. Morgan’s current Orbital Gateway documentation, for example, distinguishes between a normalized host authorization response and the exact non-normalized response returned by its Stratus or Tandem host systems. That separation is unusually explicit: one field communicates the normalized result, while another can preserve the original host value.

Most modern gateway integrations instead present their own response model.

---

## What the merchant actually sees

### Stripe

Stripe separates several concepts.

A failed card payment may produce an API error with the general code:

```text
card_declined
```

The error can also include a more specific `decline_code`, such as:

```text
do_not_honor
insufficient_funds
expired_card
generic_decline
transaction_not_allowed
```

Stripe explicitly describes these as Stripe-defined decline codes that cover many of the same conditions as traditional issuer codes, while using Stripe’s own vocabulary. Stripe also documents network decline codes separately and may expose advice information associated with the network response.

The merchant may therefore have access to several layers:

```text
API error type: card_error
API error code: card_declined
Stripe decline code: do_not_honor
Network decline code: possibly available
Advice code: possibly available
```

A reporting system that stores only `card_declined` destroys most of the available distinction.

A reporting system that stores only `do_not_honor` retains more detail, but still should not assume it has preserved the original issuer response.

### Adyen

Adyen exposes a `resultCode` indicating the overall payment outcome and a `refusalReason` explaining how Adyen classified an unsuccessful payment.

For example:

```text
resultCode: Refused
refusalReason: Not enough balance
```

or:

```text
resultCode: Error
refusalReason: Acquirer Error
```

Adyen explains that raw acquirer responses are mapped into its standardized refusal reasons. That normalization allows merchants to work with one vocabulary across payment methods and acquiring connections.

Adyen can also expose raw acquirer fields such as:

```text
refusalReasonRaw
refusalCodeRaw
```

Availability depends on the payment method, card network, configuration, and data returned by the downstream participant.

The merchant-facing model can therefore contain both:

```text
Adyen interpretation: Not enough balance
Raw response: 51
```

Those fields should be preserved separately.

### Checkout.com

Checkout.com uses its own API status and response-code model.

Its documentation separates:

- HTTP status codes
- API error codes
- Payment response codes
- Network-specific response-code references

A merchant may receive a payment outcome and a Checkout.com response code rather than a raw two-digit issuer code.

Where more detailed network or processing information is available, it should not be overwritten by the top-level payment result.

### Braintree

Braintree exposes a particularly clear example of layered classification.

A transaction can contain:

```text
status
processor_response_code
processor_response_text
processor_response_type
```

The response type can be:

```text
approved
soft_declined
hard_declined
```

Braintree maintains its own processor response code set, including values such as:

```text
2000: Do Not Honor
2001: Insufficient Funds
2004: Expired Card
2038: Processor Declined
```

The Braintree code is not the same value as the familiar two-digit upstream response. Braintree has translated the processor outcome into a proprietary four-digit model and then separately classified it as soft or hard.

For one failed authorization, a merchant might store:

```text
status: processor_declined
processor_response_code: 2000
processor_response_text: Do Not Honor
processor_response_type: soft_declined
```

These fields provide more structure than a single decline value.

They still do not reveal the issuer’s complete reasoning.

### Worldpay

Worldpay products have evolved through multiple platforms, APIs, acquiring configurations, and integration models. Their response structures are therefore not reducible to one universal Worldpay decline code set.

Depending on the Worldpay product and integration, merchants may encounter combinations of:

- Payment outcomes
- Gateway response codes
- Refusal descriptions
- Acquirer responses
- Network responses
- Product-specific error fields

This is itself part of the problem.

A merchant should not interpret a field merely because it is called `responseCode`. It must identify whether that field represents an API result, a gateway-normalized payment result, an acquirer response, or a network value.

The name of the field does not establish its provenance.

### Chase and Stratus-backed processing

Chase provides an instructive contrast because some of its systems expose host-oriented authorization responses more directly.

The current Orbital Gateway response model documents both:

- A normalized authorization response issued by the host system
- The exact, non-normalized authorization response sent by the Stratus or Tandem host

This makes the translation boundary visible rather than implicit.

Even a gateway that exposes lower-level host information can therefore return:

```text
Normalized host response
Original host response
Gateway status
Response message
```

It is still a response model, not one response code.

---

## The same condition can produce different merchant-facing values

Consider an issuer-side insufficient-funds condition.

At an upstream network or processor layer, it may be represented as:

```text
51
```

A merchant might then see something resembling:

| System | Possible merchant-facing representation |
|---|---|
| Chase or host-oriented integration | Host response related to insufficient funds, potentially with a separate normalized value |
| Stripe | `insufficient_funds` |
| Adyen | `Not enough balance`, potentially alongside raw `51` |
| Checkout.com | A Checkout.com payment response code associated with insufficient funds |
| Braintree | `2001: Insufficient Funds`, classified within Braintree’s response model |
| Worldpay | A product-specific refusal or response value representing the condition |

The wording differs.

The code format differs.

The classification may differ.

The available raw detail differs.

Now consider `05: Do Not Honor`.

| System | Possible merchant-facing representation |
|---|---|
| Chase or host-oriented integration | A host-specific response and message associated with do not honor |
| Stripe | `do_not_honor` or, depending on available detail, a more generic decline |
| Adyen | A normalized refusal reason such as `Refused`, with raw response data where available |
| Checkout.com | A Checkout.com response code representing a generic or issuer decline |
| Braintree | `2000: Do Not Honor`, commonly accompanied by a soft-decline classification |
| Worldpay | A product-specific generic refusal or issuer-decline response |

This table should not be read as a guaranteed one-to-one mapping.

That is precisely the point.

The gateway receives whatever detail the processor or acquirer makes available, applies its own mapping rules, and exposes the result through its own API contract.

A merchant cannot safely assume:

```text
Stripe do_not_honor
    ==
Braintree 2000
    ==
Adyen Refused
    ==
Checkout.com generic decline
    ==
Worldpay issuer declined
```

They may share a common upstream origin.

They may also represent different upstream conditions that have been normalized into similar merchant-facing language.

![Several upstream response values converging into one normalized gateway category, making reverse diagnosis unreliable.](/blog-assets/a-decline-code-is-not-a-diagnosis/many-to-one-normalization.svg)

*Forward mapping can be useful. Reverse diagnosis becomes unreliable after many-to-one normalization.*

---

## Forward translation is possible; reverse diagnosis is unreliable

A gateway can take an upstream code and translate it into a normalized category.

For example:

```text
05 → do_not_honor
51 → insufficient_funds
54 → expired_card
```

This forward mapping is deterministic when the gateway knows the upstream value and its own mapping rules.

The reverse operation is much less reliable.

Given:

```text
do_not_honor
```

the merchant cannot necessarily conclude:

```text
The issuer returned ISO-style response 05.
```

The gateway may use `do_not_honor` for several processor responses.

The processor may have created that response after receiving a different network value.

The network may have generated the response through stand-in processing.

The issuer may have supplied only a generic decline.

The merchant-facing category can indicate a family of outcomes without uniquely identifying the original message.

In information terms, the mapping is frequently many-to-one:

```text
upstream response A ┐
upstream response B ├──> normalized gateway response
upstream response C ┘
```

Once those values have been collapsed, the merchant cannot reconstruct the original response unless another field preserved it.

---

## Soft and hard declines are interpretations

Soft and hard declines are useful operational categories.

They are not universal issuer-defined facts.

A typical model describes:

```text
soft decline = potentially recoverable
hard decline = treated as terminal without changed information
```

But the point at which that label is applied varies.

It may be assigned by:

- The gateway
- The processor
- A subscription billing platform
- A payment orchestration provider
- A merchant’s own payment service
- An analytics or optimization provider

The classification may therefore be:

- Gateway-specific
- Product-specific
- Merchant-specific
- Dependent on transaction context
- Dependent on whether new information can be supplied
- Dependent on network retry rules
- Dependent on the merchant’s risk tolerance

A response can be operationally soft without being diagnostically clear.

`Do Not Honor` is a good example.

One provider may classify it as soft because a later attempt could produce a different result. Another system may suppress further attempts based on additional network advice, attempt history, or merchant rules.

The response itself has not changed.

The interpretation has.

This is why merchants should retain the original gateway classification rather than replacing it with their own.

Instead of:

```json
{
  "classification": "soft_decline"
}
```

preserve:

```json
{
  "gateway_response_code": "2000",
  "gateway_response_text": "Do Not Honor",
  "gateway_response_type": "soft_declined",
  "merchant_classification": "ambiguous_decline"
}
```

The merchant can revise its own interpretation later without rewriting the historical source data.

---

## Errors are not declines

A decline communicates that a participant made or returned a negative authorization decision.

An error communicates that something failed while the request was being processed.

Those are not equivalent outcomes.

Common error conditions include:

- Invalid API requests
- Gateway validation failures
- Authentication failures
- Processor connectivity errors
- Issuer unavailability
- Network timeouts
- Internal service failures
- Malformed responses
- Serialization failures
- Request timeouts
- Response timeouts

The distinction matters because an error may not tell the merchant whether an authorization decision occurred.

A timeout means the merchant did not receive a definitive response within the expected period.

It does not necessarily mean the issuer declined the payment.

The request may have failed before reaching the processor.

It may have reached the issuer and timed out on the return path.

It may have been approved downstream while the gateway response was lost.

It may have reached a system that could not determine the final state.

The correct technical category is often:

```text
unknown outcome
```

not:

```text
declined
```

Collapsing both into `payment_failed` makes aggregate reporting convenient, but it destroys a crucial distinction between a negative decision and a missing observation.

---

## Common merchant-facing response classes

The exact values vary, but merchant-facing responses commonly fall into three broad classes.

### Soft-decline responses

Typical examples include:

- Insufficient funds
- Exceeds withdrawal or amount limit
- Exceeds frequency limit
- Temporary issuer restriction
- Generic issuer decline
- Do not honor
- Processor decline
- Authentication required
- Issuer unavailable, when represented as a recoverable payment outcome

These responses are often described as potentially recoverable.

That does not mean the response tells the merchant how or when it will become recoverable.

### Hard-decline responses

Typical examples include:

- Invalid account number
- Closed account
- Lost or stolen card
- Restricted card
- Transaction not permitted
- Invalid merchant
- Unsupported card or transaction type
- Revoked credential

These are commonly treated as terminal for the current payment credentials or request.

Again, the hard classification is applied by the merchant-facing system. It is not guaranteed to be the exact classification made by the issuer.

### Error responses

Typical examples include:

- Gateway unavailable
- Processor unavailable
- Issuer unavailable
- Network timeout
- Invalid request
- Configuration failure
- Authentication failure
- Internal processing error
- System malfunction
- Unknown response

An error may be definitive or uncertain.

An invalid API field is definitive: the gateway did not accept the request.

A timeout is uncertain: the final authorization state may not be known.

The merchant should not collapse those into the same error category.

---

## Why gateway normalization exists

Gateway normalization is not inherently a defect.

It solves a real integration problem.

A gateway may connect to multiple:

- Processors
- Acquirers
- Card networks
- Alternative payment methods
- Geographic markets
- Host platforms

Each downstream system may use a different response vocabulary.

Without normalization, a merchant would have to understand every processor’s code set and every network’s variation before it could build even basic payment reporting.

Normalization provides a stable contract.

Instead of interpreting hundreds of downstream codes, the merchant can work with a smaller set such as:

```text
insufficient_funds
expired_card
suspected_fraud
do_not_honor
processor_error
```

The cost of that abstraction is reduced diagnostic fidelity.

The gateway’s category tells the merchant how the gateway interpreted the downstream response.

It may not tell the merchant exactly what the downstream participant returned.

Good payment architecture needs both layers.

> ## Preserve both layers
>
> Do not overwrite a raw processor, acquirer, network, or host response with a normalized gateway value.
>
> Store them as separate fields:
>
> ```text
> gateway_status
> gateway_response_code
> gateway_response_reason
> gateway_response_message
> gateway_decline_classification
> processor_response_code
> processor_response_message
> network_response_code
> network_advice_code
> raw_response_payload
> merchant_classification
> ```
>
> Not every integration will provide every field.
>
> Preserve every layer that is available.
>
> A normalized response supports consistent application logic. A raw response supports later diagnosis, remapping, provider migration, and cross-gateway analysis.
>
> Once the raw value is discarded, it usually cannot be reconstructed from the normalized category.

---

## Can gateways be forced to expose the original response?

There is no universal switch that forces every gateway to return the original issuer or network response.

The availability of raw data depends on:

- What the issuer supplies
- What the network passes through
- What the processor retains
- What the gateway receives
- What the gateway API supports
- What the merchant’s acquiring configuration permits
- What card brand or payment method was used
- What additional fields are enabled
- What data the gateway chooses to expose

Some gateways expose raw or network-level detail directly.

Others expose it through supplemental fields, webhooks, reports, or expanded API objects.

Some make it available only for selected networks.

Some require configuration changes or support intervention.

Some expose a processor code but not the original network value.

Some expose a network value but still normalize the human-readable reason.

Some do not expose the lower-level response at all.

Merchants should ask specific questions rather than asking only:

> Do you provide decline codes?

A better set of questions is:

- Is this code generated by the gateway, processor, network, or issuer?
- Do you expose the raw acquirer response?
- Do you expose the raw network response?
- Is the value normalized?
- Can several upstream codes map to this value?
- Are network advice codes available?
- Are raw fields returned synchronously, through webhooks, or only in reporting?
- Are fields available across every processor connection?
- Are mappings documented and versioned?
- Can support retrieve more detail than the API exposes?
- Are raw responses retained historically?

A field called `processor_response_code` may still be a normalized processor value.

A field called `network_code` may reflect a gateway interpretation.

Provenance matters as much as the code itself.

---

## The merchant adds another translation layer

Even when gateways expose useful detail, merchants frequently collapse it during ingestion.

A payment service may receive:

```json
{
  "status": "processor_declined",
  "processor_response_code": "2000",
  "processor_response_text": "Do Not Honor",
  "processor_response_type": "soft_declined"
}
```

and store only:

```json
{
  "failure_reason": "soft_decline"
}
```

At that point, the merchant has lost:

- The gateway’s original code
- The gateway’s description
- The distinction between the gateway classification and the merchant classification
- The ability to remap the transaction later
- The ability to compare the result against another gateway
- The ability to audit changes in classification logic

The same problem appears in multi-gateway environments.

Suppose one gateway returns:

```text
do_not_honor
```

another returns:

```text
2000
```

and another returns:

```text
Refused
```

A merchant may normalize all three into:

```text
soft_decline
```

That produces a consistent dashboard.

It does not prove the three payments failed for the same reason.

The merchant has created an analytics category, not recovered the original truth.

Specialist payment data providers such as Pagos and Revaly can help merchants normalize gateway-specific responses while retaining more of the underlying context.

The same architecture can also be built internally.

The critical requirement is to preserve provenance.

---

## A better internal response model

A useful merchant response model should distinguish the payment outcome from each interpretation layer.

For example:

```json
{
  "payment_outcome": "not_approved",
  "outcome_certainty": "definitive",

  "gateway": {
    "name": "example_gateway",
    "status": "failed",
    "code": "card_declined",
    "decline_reason": "do_not_honor",
    "classification": "soft"
  },

  "processor": {
    "code": "05",
    "message": "Do Not Honor"
  },

  "network": {
    "code": null,
    "advice_code": null
  },

  "merchant": {
    "classification": "ambiguous_issuer_decline",
    "classification_version": "2026-07-01"
  }
}
```

For a timeout, the structure might instead be:

```json
{
  "payment_outcome": "unknown",
  "outcome_certainty": "uncertain",

  "gateway": {
    "status": "error",
    "code": "request_timeout",
    "decline_reason": null,
    "classification": "technical_error"
  },

  "processor": {
    "code": null,
    "message": null
  },

  "network": {
    "code": null,
    "advice_code": null
  },

  "merchant": {
    "classification": "authorization_outcome_unknown",
    "classification_version": "2026-07-01"
  }
}
```

The second response should not be counted as an issuer decline merely because the payment did not complete successfully.

That distinction is essential for accurate payment reporting.

---

## What the response actually tells you

A response code tells you what one system chose to return.

That may be useful.

It may also be incomplete, normalized, translated, or several steps removed from the issuer’s original decision.

The further the response travels, the more important provenance becomes.

For any field used in reporting or decisioning, the merchant should know:

1. Which system created it
2. Whether it is raw or normalized
3. Whether multiple upstream responses map to it
4. Whether it represents a decline, an error, or an unknown outcome
5. Which system assigned any soft-or-hard classification

Without that context, the code is not wrong.

It is simply less informative than it appears.

## The practical problem

Most merchants do not have one decline taxonomy.

They have several:

- The issuer or network response
- The processor response
- The gateway response
- The gateway’s soft-or-hard classification
- The merchant’s own internal category
- The reporting category used downstream

Those taxonomies often overlap without matching.

That is where the confusion starts.

A `do_not_honor` response may be mapped to `soft_decline`.

A proprietary gateway code may be mapped to the same internal category.

A timeout may be grouped beside both because the payment failed to complete.

The resulting report looks clean.

The underlying events are not equivalent.

This does not mean normalization is a mistake.

It means normalization is another interpretation layer.

That layer needs to remain distinguishable from the source response.

## A decline code is not a diagnosis

`Do Not Honor` is not useless.

Neither is `Insufficient Funds`, `Expired Card`, `Processor Declined`, or `Issuer Unavailable`.

Each tells you something.

The problem begins when that value is treated as a complete explanation of the authorization outcome.

In many cases, the merchant is not looking at the issuer’s decision.

It is looking at a gateway’s representation of a processor’s interpretation of a network response.

Sometimes the original response is still available elsewhere in the payload.

Sometimes it is available only through reporting or support.

Sometimes it is gone.

The safest conclusion is the simplest one:

A decline code is evidence about what happened in the authorization path.

It is not, by itself, a diagnosis of why the payment failed.

## Sources and further reading

- Stripe, [*Decline codes*](https://docs.stripe.com/declines/codes), for Stripe-defined decline codes, advice codes, and the relationship to issuer decline codes.
- Adyen, [*Refusal reasons*](https://docs.adyen.com/development-resources/refusal-reasons/), for `resultCode`, `refusalReason`, and standardized refusal reason behavior.
- Braintree, [*Authorization response codes*](https://developer.paypal.com/braintree/docs/reference/general/processor-responses/authorization-responses/), for processor response classes, decline types, and examples such as `2000: Do Not Honor`.
- Checkout.com, [*API Reference*](https://api-reference.checkout.com/), for the separation of API response behavior and payment API resources.
- Charles Weiss, [*Authorization Is Not Approval*](/blog/authorization-is-not-approval/), for the surrounding payment lifecycle and metric-denominator model.
