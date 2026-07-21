---
name: Bug report
about: Report broken behavior in existing ConnectOS functionality
title: "bug: "
labels: bug
assignees: ""
---

Use this template for reproducible problems in existing ConnectOS behavior.

ConnectOS is neutral infrastructure for AI applications. Bug reports should describe broken existing platform behavior, documentation behavior, or release-preparation guardrail failures.

Use the release-preparation template for documentation cleanup, naming consistency, contributor experience, GitHub readiness, or release-gate work that is not broken existing behavior.

## Security Notice

Do not report security vulnerabilities in public issues or public pull requests.

Do not include OAuth tokens, refresh tokens, OAuth authorization codes, API keys, client secrets, encryption keys, token references, raw callback payloads, raw provider responses, screenshots containing secrets, logs containing secrets, credentials, or exploitable vulnerability details.

Before public v1.0, the project owner must choose a private security reporting channel. Until that channel exists, do not publish sensitive findings publicly.

## Steps To Reproduce

1.
2.
3.

If reproduction depends on environment variables, provider mode, seeded data, or a specific command, list only non-secret setup details here.

## Expected Behavior

What should happen?

## Actual Behavior

What happened instead?

Include visible error messages or non-secret log excerpts if useful.

## Environment

- OS:
- Node version:
- pnpm version:
- Browser, if UI-related:
- Database mode: in-memory / Prisma
- Provider mode: `mock` / `direct-oauth` / `composio`
- Route or page involved:
- Integration involved, if any:

## Logs

Paste only non-secret log summaries.

Do not include OAuth tokens, refresh tokens, OAuth authorization codes, API keys, client secrets, encryption keys, token references, raw callback payloads, raw provider responses, private account details, credentials, or exploitable vulnerability details.

## Scope Check

- [ ] This reports broken existing behavior.
- [ ] This does not request new architecture, providers, connectors, Capabilities, Actions, Skills, Recipes, APIs, databases, product features, or product-specific business logic.
- [ ] This does not ask to rename compatibility-sensitive names.
- [ ] This does not include secrets, tokens, credentials, raw callback payloads, or raw provider responses.

## Compatibility Context

Mark any compatibility-sensitive names involved. These names apply during v1 release preparation and should not be renamed or removed unless a separate migration is approved.

- [ ] `/connect-core`
- [ ] `/api/connect-core/*`
- [ ] `/api/connect-core/callback`
- [ ] `/api/connect-core/actions`
- [ ] `/api/connect-core/capabilities`
- [ ] `/api/connect-core/skills`
- [ ] `/api/connect-core/universal-actions`
- [ ] `@connect-any-inbox/*`
- [ ] `CONNECT_CORE_ENCRYPTION_KEY`
- [ ] `connect-core-token:v1`
- [ ] `universal_actions`
- [ ] Not applicable.

## Verification

Which checks reproduce the issue or guardrail failure?

- [ ] `pnpm test`
- [ ] `pnpm lint`
- [ ] `pnpm typecheck`
- [ ] `pnpm prisma:validate`
- [ ] `pnpm build`
- [ ] `pnpm release-docs:check`
- [ ] `pnpm release-metadata:check`
- [ ] `pnpm release-hygiene:check`
- [ ] `pnpm release:check`

If a check fails, include the shortest non-secret failure summary and the command that produced it.
