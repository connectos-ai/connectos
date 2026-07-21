# ADR-001: Use API-First Connector Strategy

## Status

Accepted as historical context. Current ConnectOS v1.0 release scope is governed
by current release docs.

## Date

2026-06-16

## Context

An earlier product goal was to provide a simple
`Connect -> Login -> Configure -> Done` flow for non-technical operators. The
hard part was that each channel had different platform permissions, app-review
rules, webhook support, and account-lock risks.

This ADR explains older inbox-focused connector decisions. It does not authorize
new providers, connectors, Capabilities, Actions, Skills, Recipes, APIs,
databases, or product features during ConnectOS v1.0 release preparation.

## Decision

Every channel entered a shared connector registry and connection orchestrator.
The orchestrator ranked safer paths before automation:

```text
official API/webhook -> OAuth/API key -> approved partner provider -> forwarded inbox/local bridge -> browser automation -> manual assisted setup
```

Only Gmail, Twilio, and Slack were implemented in the older inbox-focused demo.
Higher-risk channels stayed approval-gated until platform access was proven.

## Consequences

- UI could stay simple while backend paths differed by channel.
- Browser automation was never a silent default.
- Future connectors were expected to declare risk, setup guidance, and fallback
  guidance before appearing supported.
- Some channels stayed advisory-only until platform access was proven.

## v1.0 Release Boundary

For current ConnectOS v1.0 release preparation, use current release docs instead
of this historical ADR:

- [Release checklist](../RELEASE_CHECKLIST.md)
- [Release-candidate readiness](../RELEASE_CANDIDATE_READINESS.md)
- [Pre-public owner decisions](../PRE_PUBLIC_OWNER_DECISIONS.md)
- [Roadmap](../ROADMAP.md)
- [Connector development](../CONNECTOR_DEVELOPMENT.md)
- [ConnectOS architecture](../CONNECTOS.md)

Do not use this ADR to infer new v1.0 architecture, providers, connectors,
Capabilities, Actions, Skills, Recipes, APIs, databases, product features, or
product-specific business logic.

Any exception requires explicit scope approval before implementation.
