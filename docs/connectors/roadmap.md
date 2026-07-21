# Archived Connector Roadmap Notes

This document intentionally preserves historical context.

It is not the current ConnectOS v1.0 connector roadmap.

Earlier versions of the repository used this file to describe an inbox-focused
connector strategy. That material is no longer authoritative for ConnectOS v1.0
release preparation.

For current release-preparation guidance, use:

- [Roadmap](../ROADMAP.md)
- [Release checklist](../RELEASE_CHECKLIST.md)
- [Connector development](../CONNECTOR_DEVELOPMENT.md)
- [ConnectOS architecture](../CONNECTOS.md)

## Archive Guardrails

Do not use this archived note to approve or infer:

- New architecture.
- New providers.
- New connectors.
- New Capabilities, Actions, Skills, or Recipes.
- New APIs or databases.
- New product features.
- Product-specific business logic.

These historical entries do not create new v1.0 connector commitments.

## Historical Connector Notes

Earlier connector planning included inbox-focused experiments that predate the
current ConnectOS v1.0 release-preparation framing.

| Historical area | Historical package | Historical intent |
| --- | --- | --- |
| Gmail / email | `@connect-any-inbox/gmail-connector` | OAuth-backed email ingestion proof. |
| SMS / Twilio | `@connect-any-inbox/twilio-connector` | Early communication-channel experiment. |
| Slack | `@connect-any-inbox/slack-connector` | Early team-message ingestion experiment. |

## Historical Planning Candidates

The following items were planning candidates, not current v1.0 release
commitments:

- Additional official API providers.
- Additional OAuth-backed connector manifests.
- Additional inbox file sync experiments.
- Browser automation fallback tools for providers without durable APIs.

## Historical Fallback Policy

Earlier connector planning preferred durable official integration paths:

```text
official API/webhook -> OAuth/API key -> approved partner provider -> forwarded inbox/local bridge -> browser automation -> manual assisted setup
```

Earlier planning treated browser automation as a last-resort path requiring
explicit approval and a recorded fallback reason.

## Current v1.0 Boundary

ConnectOS v1.0 release preparation is focused on coherence, trust,
documentation quality, GitHub readiness, verification, and contributor
experience.

It is not focused on adding connector count.

Current compatibility-sensitive names remain preserved:

- `/connect-core`
- `/api/connect-core/*`
- `/api/connect-core/callback`
- `/api/connect-core/actions`
- `/api/connect-core/capabilities`
- `/api/connect-core/skills`
- `/api/connect-core/universal-actions`
- `@connect-any-inbox/*`
- `CONNECT_CORE_ENCRYPTION_KEY`
- `connect-core-token:v1`
- `universal_actions`

Future changes to these names require an approved compatibility-preserving
migration plan.

## Release Wording Guardrails

These exact statements are preserved so release-preparation checks catch
accidental drift in archived connector roadmap guidance:

- This document intentionally preserves historical context.
- It is not the current ConnectOS v1.0 connector roadmap.
- Earlier versions of the repository used this file to describe an inbox-focused connector strategy.
- Do not use this archived note to approve or infer:
- These historical entries do not create new v1.0 connector commitments.
- The following items were planning candidates, not current v1.0 release commitments:
- Earlier planning treated browser automation as a last-resort path requiring explicit approval and a recorded fallback reason.
- ConnectOS v1.0 release preparation is focused on coherence, trust, documentation quality, GitHub readiness, verification, and contributor experience.
- It is not focused on adding connector count.
- Current compatibility-sensitive names remain preserved:
- Future changes to these names require an approved compatibility-preserving migration plan.
