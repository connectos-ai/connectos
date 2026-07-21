# Archived MVP Ship Readiness Notes

This document intentionally preserves historical context.

It is not the current ConnectOS v1.0 release checklist.

Earlier versions of the repository used this file to track an inbox-focused
demo. That demo is no longer the authoritative release target for ConnectOS
v1.0.

For current release-preparation guidance, use:

- [Release checklist](RELEASE_CHECKLIST.md)
- [Release-candidate readiness](RELEASE_CANDIDATE_READINESS.md)
- [v1 release readiness audit](V1_RELEASE_READINESS_AUDIT.md)
- [Production checklist](PRODUCTION_CHECKLIST.md)
- [Roadmap](ROADMAP.md)
- [Changelog](../CHANGELOG.md)

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

## Archived Demo Context

The earlier demo proved an inbox-oriented client story:

1. Gmail and Twilio represented first-demo source channels.
2. A Gmail OAuth proof stored tokens through a vault abstraction.
3. A Twilio webhook proof validated signatures and normalized SMS messages.
4. A unified inbox showed Gmail and Twilio messages together.
5. Messages could be searched and labeled.
6. A labeled stream could sync to a Slack channel.

This history may explain older package names and compatibility-sensitive routes,
but it does not authorize new ConnectOS v1.0 product scope.

## Archived Local Checks

The earlier demo used local checks like:

```bash
pnpm install
pnpm dev
pnpm test
pnpm typecheck
pnpm lint
pnpm prisma:validate
pnpm build
```

The archived inbox demo was available at:

```text
http://localhost:3001/inbox
```

The current ConnectOS v1.0 release-preparation demo surface is `/connect-core`.

## Compatibility Notes

Compatibility-sensitive names remain preserved:

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

## Archived Non-Goals

The earlier demo intentionally did not include:

- Replying to or sending messages.
- Silent browser automation.
- Personal account scraping.
- Fully managed hosted-cloud credential provisioning.
- Real production app review by third-party providers.

## Superseded Hosted Beta Notes

Current ConnectOS v1.0 release docs supersede earlier hosted beta notes.

Historical items included:

- Replacing local vault and in-memory audit sinks with durable hosted adapters.
- Adding real app-user authentication and tenant isolation.
- Persisting connections, messages, labels, sync rules, and audit events.
- Adding route handlers around proof packages.
- Adding rate limits and security headers.
- Running provider app-review setup for real integrations.
- Adding end-to-end browser tests for connect, inbox, label, and sync setup
  flows.

These items are historical context only. They are not current v1.0
release-preparation tasks unless explicitly re-approved.

## Archived Rollback Note

For the earlier self-hosted local demo, rollback meant reverting the latest
feature commit and rerunning:

```bash
pnpm install
pnpm test
pnpm build
```

Current release rollback and production guidance belongs in
[Production checklist](PRODUCTION_CHECKLIST.md).

## Release Wording Guardrails

These exact statements are preserved so release-preparation checks catch
accidental drift in archived MVP readiness guidance:

- This document intentionally preserves historical context.
- It is not the current ConnectOS v1.0 release checklist.
- For current release-preparation guidance, use:
- Do not use archived notes to approve or infer:
- New APIs or databases.
- Product-specific business logic.
- current ConnectOS v1.0 release-preparation demo surface is `/connect-core`.
- Compatibility Notes
- connect-core-token:v1
- universal_actions
- Future changes names require an approved compatibility-preserving migration plan.
