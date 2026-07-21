# ADR-003: Ship Read-First Inbox Before Replies

## Status

Accepted as historical context. Current ConnectOS v1.0 release preparation is
governed by current release docs.

## Date

2026-06-16

## Context

An earlier client needed to see Gmail and SMS streams in one place, label
messages, and sync labeled streams to Slack. Adding replies would have required
broader platform permissions, higher compliance risk, mistaken-send safeguards,
and more complex identity rules.

This ADR explains an older inbox-focused MVP boundary. It does not authorize new
sending, replying, messaging, connector behavior, provider behavior, APIs,
databases, or product features during ConnectOS v1.0 release preparation.

## Decision

The older MVP stayed read-first:

- Gmail and Twilio messages were normalized into a shared inbox model.
- The inbox supported viewing, search, labels, and source filters.
- Slack sync sent labeled streams to the first destination workflow.
- Replying and sending messages were deferred.

## Consequences

- The demo could prove core value without requiring broad send permissions.
- Slack sync could be tested with mocked posting before live workspace
  credentials.
- Reply support could be designed later with stronger authorization, audit, and
  provider-specific send rules.

## v1.0 Release Boundary

For current ConnectOS v1.0 release preparation, use:

- [Release checklist](../RELEASE_CHECKLIST.md)
- [v1 release readiness audit](../V1_RELEASE_READINESS_AUDIT.md)
- [Release-candidate readiness](../RELEASE_CANDIDATE_READINESS.md)
- [Pre-public owner decisions](../PRE_PUBLIC_OWNER_DECISIONS.md)
- [Roadmap](../ROADMAP.md)

Do not use this ADR to infer new v1.0 sending, replying, messaging, connector,
provider, API, database, product feature, or product-specific business logic
scope.

Any exception requires explicit scope approval before implementation.
