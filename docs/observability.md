# Archived Observability Notes

This document intentionally preserves historical context.

It is not the current ConnectOS v1.0 observability guide.

Earlier versions of the repository used this file to describe audit events for
an inbox-focused MVP. That material is no longer authoritative for ConnectOS
v1.0 release preparation.

For current security, audit, and production-readiness guidance, use:

- [Security policy](../SECURITY.md)
- [ConnectOS architecture](CONNECTOS.md)
- [Production checklist](PRODUCTION_CHECKLIST.md)
- [Release checklist](RELEASE_CHECKLIST.md)
- [Environment variables](ENVIRONMENT.md)

## Archive Status

Do not use archived notes to approve or infer:

- New architecture.
- New providers.
- New connectors.
- New Capabilities, Actions, Skills, or Recipes.
- New APIs or databases.
- New product features.
- Product-specific business logic.

Any exception requires explicit scope approval before implementation.

## Historical Audit Questions

The earlier MVP used structured audit events before adding external telemetry
vendors. Those events answered first-pass operational questions:

1. Which connection strategy did the orchestrator choose?
2. Was a fallback provider blocked, approved, unsupported, or prepared?
3. Did the Slack labeled-stream sync attempt succeed or fail?

## Historical Events

| Event | Emitted by | Historical purpose |
| --- | --- | --- |
| `connection.decided` | `@connect-any-inbox/connection-orchestrator` | Recorded selected strategy, status, and action. |
| `fallback.prepared` | `@connect-any-inbox/fallback-providers` | Recorded blocked, ready, or unsupported fallback-provider decisions. |
| `slack_sync.attempted` | `@connect-any-inbox/slack-sync` | Recorded attempted Slack sync posts by rule and message ID. |

These historical events help explain older package boundaries. They do not
define new v1.0 observability scope.

## Current Compatibility-Preserving Notes

ConnectOS v1.0 release preparation must preserve compatibility-sensitive names:

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

Future changes names require an approved compatibility-preserving migration plan.

## Current Release Guidance

Current release-preparation observability work should focus on documentation and
verification quality:

- Confirm logs do not expose OAuth tokens, refresh tokens, authorization codes,
  raw callback payloads, raw provider responses, API keys, client secrets, or
  encryption keys.
- Confirm structured audit events remain safe to print in local test output.
- Confirm production-readiness docs explain security-sensitive logging
  boundaries.
- Do not add new telemetry vendors, dashboards, providers, APIs, or databases
  without explicit scope approval.

## Release Wording Guardrails

These exact statements are preserved so release-preparation checks catch
accidental drift in archived observability guidance:

- This document intentionally preserves historical context.
- It is not the current ConnectOS v1.0 observability guide.
- For current security, audit, and production-readiness guidance, use:
- Do not use archived notes to approve or infer:
- New APIs or databases.
- Product-specific business logic.
- Historical Events
- Current Compatibility-Preserving Notes
- connect-core-token:v1
- universal_actions
- Future changes names require an approved compatibility-preserving migration plan.
