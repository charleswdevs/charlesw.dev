export const glossaryEntries = [
  {
    term: "Payment lifecycle",
    slug: "payment-lifecycle",
    category: "Payment lifecycle",
    definition:
      "The full sequence of payment activity from obligation and authorization through capture, settlement, downstream losses, and retained revenue.",
    aliases: [],
  },
  {
    term: "Payment obligation",
    slug: "payment-obligation",
    category: "Payment lifecycle",
    definition:
      "The commercial event that creates an amount due, such as an invoice, order, subscription renewal, or other balance that should be collected.",
    aliases: ["payment obligations"],
  },
  {
    term: "Invoice eligibility",
    slug: "invoice-eligibility",
    category: "Payment lifecycle",
    definition:
      "The merchant-side decision about whether an invoice or order should enter the payment flow based on business rules, account state, payment method availability, or other pre-authorization conditions.",
    aliases: ["eligible invoices", "eligibility rules"],
  },
  {
    term: "Authorization",
    slug: "authorization",
    category: "Payment lifecycle",
    definition:
      "The request-response process through which a payment is evaluated across the merchant, provider, network, and issuer chain.",
    aliases: ["authorized", "authorization request"],
  },
  {
    term: "Authorization attempt",
    slug: "authorization-attempt",
    category: "Payment lifecycle",
    definition:
      "One technical request made against a payment obligation. A single obligation can produce multiple attempts, especially when retries are used.",
    aliases: ["authorization attempts", "initial authorization attempt"],
  },
  {
    term: "Approval",
    slug: "approval",
    category: "Payment lifecycle",
    definition:
      "A positive issuer response indicating that the transaction may continue under the conditions evaluated at that moment.",
    aliases: ["approvals", "approved"],
  },
  {
    term: "Flow approval",
    slug: "flow-approval",
    category: "Payment lifecycle",
    definition:
      "A positive decision by an upstream system, such as a merchant fraud rule, gateway, processor, or network, that allows a request to continue. It is not the same as issuer approval.",
    aliases: ["flow approvals"],
  },
  {
    term: "Authorization approval",
    slug: "authorization-approval",
    category: "Payment lifecycle",
    definition:
      "The positive response returned by the issuer after it evaluates an authorization request.",
    aliases: ["authorization approvals", "issuer approval", "issuer approvals"],
  },
  {
    term: "Capture",
    slug: "capture",
    category: "Payment lifecycle",
    definition:
      "The instruction to complete an approved transaction. Depending on the integration, capture may happen automatically or through a separate request.",
    aliases: ["captured", "captured payments"],
  },
  {
    term: "Clearing",
    slug: "clearing",
    category: "Payment lifecycle",
    definition:
      "The post-authorization process where transaction records are collected and exchanged before settlement.",
    aliases: [],
  },
  {
    term: "Settlement",
    slug: "settlement",
    category: "Payment lifecycle",
    definition:
      "The post-capture stage where funds are finalized or recognized after clearing and related provider or network activity.",
    aliases: ["settle", "settled payments"],
  },
  {
    term: "Retained revenue",
    slug: "retained-revenue",
    category: "Payment lifecycle",
    definition:
      "The revenue that remains after downstream losses such as refunds, cancellations, fraud, disputes, and chargebacks.",
    aliases: ["retained payments"],
  },
  {
    term: "Payment success funnel",
    slug: "payment-success-funnel",
    category: "Payment lifecycle",
    definition:
      "A model that follows value from payment obligation through authorization attempt, approval, capture, settlement, and retained revenue.",
    aliases: [],
  },
  {
    term: "Authorization rate",
    slug: "authorization-rate",
    category: "Payment metrics",
    definition:
      "Industry shorthand for payment authorization performance. The denominator must be made explicit because the phrase can refer to several different measurements.",
    aliases: [],
  },
  {
    term: "Authorization attempt rate",
    slug: "authorization-attempt-rate",
    category: "Payment metrics",
    definition:
      "The share of payment obligations that enter the authorization flow.",
    aliases: [],
  },
  {
    term: "Gross authorization attempt rate",
    slug: "gross-authorization-attempt-rate",
    category: "Payment metrics",
    definition:
      "Authorization attempts measured against all payment obligations due, including obligations that never became eligible.",
    aliases: [],
  },
  {
    term: "Eligible authorization attempt rate",
    slug: "eligible-authorization-attempt-rate",
    category: "Payment metrics",
    definition:
      "Authorization attempts measured against the subset of obligations already considered eligible for payment.",
    aliases: [],
  },
  {
    term: "Initial approval rate",
    slug: "initial-approval-rate",
    category: "Payment metrics",
    definition:
      "The share of initial authorization attempts that receive a positive issuer response.",
    aliases: [],
  },
  {
    term: "Attempt approval rate",
    slug: "attempt-approval-rate",
    category: "Payment metrics",
    definition:
      "The share of all authorization attempts, including retries, that receive a positive issuer response.",
    aliases: [],
  },
  {
    term: "Eventual approval",
    slug: "eventual-approval",
    category: "Payment metrics",
    definition:
      "The outcome for unique payment obligations that eventually receive approval, including those approved after retry activity.",
    aliases: ["eventual approvals"],
  },
  {
    term: "Net payment success rate",
    slug: "net-payment-success-rate",
    category: "Payment metrics",
    definition:
      "The share of payment obligations that ultimately become retained revenue after known downstream losses.",
    aliases: [],
  },
  {
    term: "Merchant",
    slug: "merchant",
    category: "Payment actors",
    definition:
      "The business or platform accepting payment and constructing the payment request.",
    aliases: ["merchants"],
  },
  {
    term: "Gateway",
    slug: "gateway",
    category: "Payment actors",
    definition:
      "A provider system that accepts, validates, and forwards payment requests between the merchant and downstream payment infrastructure.",
    aliases: ["payment gateway", "payment gateways"],
  },
  {
    term: "Processor",
    slug: "processor",
    category: "Payment actors",
    definition:
      "A payment provider that processes and routes transaction messages between merchants, acquirers, networks, and other payment participants.",
    aliases: ["processors"],
  },
  {
    term: "Acquirer",
    slug: "acquirer",
    category: "Payment actors",
    definition:
      "The acquiring bank or acquiring-side institution that supports the merchant's ability to accept card payments.",
    aliases: ["acquirers"],
  },
  {
    term: "Card network",
    slug: "card-network",
    category: "Payment actors",
    definition:
      "The network that carries card transaction messages between acquiring-side and issuing-side participants.",
    aliases: ["card networks"],
  },
  {
    term: "Issuer",
    slug: "issuer",
    category: "Payment actors",
    definition:
      "The issuing financial institution that evaluates a transaction and returns an authorization response.",
    aliases: ["issuers", "issuing financial institution"],
  },
  {
    term: "Fraud detection platform",
    slug: "fraud-detection-platform",
    category: "Payment actors",
    definition:
      "A system that evaluates transaction risk and can allow, block, or influence payment flow before or during authorization.",
    aliases: ["fraud detection platforms", "merchant fraud system"],
  },
  {
    term: "Orchestrator",
    slug: "orchestrator",
    category: "Payment actors",
    definition:
      "A payment routing or coordination layer that can choose providers, paths, credentials, or transaction handling strategies.",
    aliases: ["orchestrators"],
  },
  {
    term: "Financial institution",
    slug: "financial-institution",
    category: "Payment actors",
    definition:
      "A bank or other regulated institution involved in evaluating, issuing, acquiring, funding, or otherwise supporting payment activity.",
    aliases: ["financial institutions"],
  },
  {
    term: "Decline",
    slug: "decline",
    category: "Failure and optimization",
    definition:
      "An unsuccessful authorization or payment-flow outcome. The term should not collapse issuer decisions, merchant rules, provider failures, and technical interruptions into one undifferentiated category.",
    aliases: ["declined", "declines"],
  },
  {
    term: "False decline",
    slug: "false-decline",
    category: "Failure and optimization",
    definition:
      "A legitimate transaction that is incorrectly rejected or prevented from succeeding.",
    aliases: ["false declines", "false fraud decline", "false fraud declines"],
  },
  {
    term: "Payment recovery",
    slug: "payment-recovery",
    category: "Failure and optimization",
    definition:
      "Work performed after an unsuccessful payment outcome to recover revenue, often through retries or other follow-up strategies.",
    aliases: [],
  },
  {
    term: "Retry recovery",
    slug: "retry-recovery",
    category: "Failure and optimization",
    definition:
      "A recovery strategy where additional authorization attempts are submitted after an initial unsuccessful outcome.",
    aliases: [],
  },
  {
    term: "Approval optimization",
    slug: "approval-optimization",
    category: "Failure and optimization",
    definition:
      "Product, data, routing, trust, or technical work intended to improve legitimate issuer approval outcomes.",
    aliases: [],
  },
  {
    term: "Upfront approval optimization",
    slug: "upfront-approval-optimization",
    category: "Failure and optimization",
    definition:
      "Approval optimization that happens earlier in the payment lifecycle, before recovery is needed.",
    aliases: [],
  },
  {
    term: "Payment performance",
    slug: "payment-performance",
    category: "Failure and optimization",
    definition:
      "The combined technical and business performance of the payment flow, from payment entry through retained revenue.",
    aliases: [],
  },
  {
    term: "Authorization expiration",
    slug: "authorization-expiration",
    category: "Failure and optimization",
    definition:
      "A condition where an approval is no longer valid by the time capture is attempted.",
    aliases: [],
  },
  {
    term: "Amount mismatch",
    slug: "amount-mismatch",
    category: "Failure and optimization",
    definition:
      "A mismatch between the amount approved and the amount later submitted or expected during capture or downstream processing.",
    aliases: ["amount mismatches"],
  },
  {
    term: "Provider failure",
    slug: "provider-failure",
    category: "Failure and optimization",
    definition:
      "An outage, rejection, interruption, or other provider-side problem that prevents payment flow from completing as expected.",
    aliases: ["provider failures"],
  },
  {
    term: "Refund",
    slug: "refund",
    category: "Failure and optimization",
    definition:
      "A returned payment amount that reduces retained revenue after payment activity has otherwise succeeded.",
    aliases: ["refunded", "refunds"],
  },
  {
    term: "Cancellation",
    slug: "cancellation",
    category: "Failure and optimization",
    definition:
      "A downstream customer or merchant outcome that can remove expected retained revenue after payment activity.",
    aliases: ["cancellations", "cancelled"],
  },
  {
    term: "Fraud",
    slug: "fraud",
    category: "Failure and optimization",
    definition:
      "Illegitimate or risky activity that can affect authorization decisions, downstream losses, and retained revenue.",
    aliases: [],
  },
  {
    term: "Dispute",
    slug: "dispute",
    category: "Failure and optimization",
    definition:
      "A customer or issuer challenge to a transaction that can reduce retained revenue after settlement.",
    aliases: ["disputes"],
  },
  {
    term: "Chargeback",
    slug: "chargeback",
    category: "Failure and optimization",
    definition:
      "A payment reversal through the dispute process that can remove revenue after a transaction has otherwise succeeded.",
    aliases: ["chargebacks"],
  },
];

export const glossaryCategories = [
  "Payment lifecycle",
  "Payment metrics",
  "Payment actors",
  "Failure and optimization",
];
