# ADR-002: Keep Secrets In Vault And Audit Only Structured Decisions

## Status

Accepted as historical context. Current ConnectOS v1.0 security and production
guidance lives in current release docs.

## Date

2026-06-16

## Context

An earlier inbox-focused demo handled OAuth tokens, webhook secrets, provider
credentials, and message metadata. Logs and audit trails were useful for
support, but they could also become data leaks if they captured tokens or
message bodies.

This ADR explains older local vault and audit boundaries. It does not define new
ConnectOS v1.0 release scope.

## Decision

Connector packages stored secrets through a vault abstraction. Audit events used
stable event names and allowlisted metadata:

- `connection.decided`
- `fallback.prepared`
- `slack_sync.attempted`

Audit events could include correlation fields such as `tenantId`, `actorId`,
and `requestId`. They could not include OAuth tokens, API keys, passwords,
client secrets, raw webhook payloads, or full message bodies.

## Consequences

- Local development used `LocalDevelopmentVault` and `InMemoryAuditLog`.
- Hosted deployments could replace adapters without changing connector logic.
- Support could see that a decision happened without reading sensitive channel
  data.
- Any future durable audit sink had to preserve the same redaction boundary.

## v1.0 Release Boundary

For current ConnectOS v1.0 security, audit, and production guidance, use:

- [Security policy](../../SECURITY.md)
- [Production checklist](../PRODUCTION_CHECKLIST.md)
- [Environment variables](../ENVIRONMENT.md)
- [Release checklist](../RELEASE_CHECKLIST.md)
- [Release-candidate readiness](../RELEASE_CANDIDATE_READINESS.md)
- [Pre-public owner decisions](../PRE_PUBLIC_OWNER_DECISIONS.md)

Do not use this ADR to infer new v1.0 security architecture, telemetry,
database tables, provider behavior, product features, or product-specific
business logic.

Any exception requires explicit scope approval before implementation.
