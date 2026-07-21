# ConnectOS Production Checklist

Use this checklist before deploying ConnectOS beyond local demo mode.

This production-readiness aid is not release approval and does not replace an environment-specific security review. Production preparation must preserve current architecture and compatibility-sensitive names.

Do not use this checklist to add new architecture, providers, connectors, Capabilities, Actions, Skills, Recipes, APIs, databases, product features, or product-specific business logic.

## Deployment Safety Checks

Complete these checks before any self-hosted ConnectOS deployment routes real users, real OAuth traffic, or production provider credentials through the app.

### Secrets

- Set `DATABASE_URL` through deployment secrets, not committed files.
- Set `CONNECT_CORE_ENCRYPTION_KEY` through deployment secrets before enabling real OAuth.
- Confirm `CONNECT_CORE_ENCRYPTION_KEY` is stable across deploys so existing encrypted token references remain readable.
- Confirm no secret appears in `.env.example`, logs, screenshots, docs, tests, browser console output, or committed fixtures.
- Rotate any secret that may have been copied into public or shared material.

### Direct OAuth

- Configure provider client IDs and client secrets through deployment secrets.
- Confirm Google and Slack redirect URIs point to the deployed `/api/connect-core/callback` route.
- Confirm `NEXT_PUBLIC_APP_URL` matches the deployed public origin.
- Confirm real OAuth remains unavailable and falls back safely when required provider configuration is missing.
- Confirm denied or canceled OAuth flows do not expose callback payloads, authorization codes, state secrets, or raw provider responses.
- Verify each enabled real OAuth provider end-to-end with production credentials before routing real users.

### Composio

- Set `COMPOSIO_API_KEY` through deployment secrets before enabling real Composio mode.
- Configure `COMPOSIO_BASE_URL` only when the deployment needs a compatible non-default Composio API base URL.
- Validate `COMPOSIO_AUTH_CONFIG_IDS` before enabling mapped Composio-backed integrations.
- Confirm Composio connected account identifiers stored in connection metadata, not raw provider tokens.

### Debug Page

- Confirm `/connect-core/debug` returns `404` in production.
- Confirm no production-only diagnostics expose environment values, token references, provider payloads, OAuth codes, API keys, client secrets, or encryption keys.

### Logging

- Confirm logs do not expose secrets, token references, raw callback payloads, raw provider responses, access tokens, refresh tokens, OAuth codes, or state secrets.
- Confirm audit logs record lifecycle events without storing sensitive provider data.
- Confirm error reporting tools redact request headers, query strings, and request bodies that may contain provider credentials.

### Rate Limiting

- Confirm connect, callback, reconnect, disconnect, and health-check route rate limits match the deployment topology.
- Confirm rate-limit failures do not leak secrets or provider payloads.
- In multi-instance deployments, confirm shared rate-limit state is configured or document the launch limitation.

## Compatibility Boundaries

The following names are intentionally preserved during v1.0 release preparation:

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

Future renames require an approved compatibility-preserving migration plan.

## Required Release Gate

Run the full release gate before production deployment or public v1.0 release:

```bash
pnpm release:check
```

`pnpm release:check` includes:

- `pnpm release-docs:check`
- `pnpm release-metadata:check`
- `pnpm release-hygiene:check`
- `pnpm test`
- `pnpm lint`
- `pnpm typecheck`
- `pnpm prisma:validate`
- `pnpm build`

The release not ready if any required gate fails.

## Pre-Production Review

Before routing real users or real OAuth traffic through a deployment:

1. Confirm `DATABASE_URL` points to the intended database.
2. Confirm database migration state is current.
3. Confirm `CONNECT_CORE_ENCRYPTION_KEY` is configured and stable.
4. Confirm redirect URIs match the deployed `/api/connect-core/callback` route.
5. Confirm production logs do not expose secrets, token references, raw callback payloads, or raw provider responses.
6. Confirm rate limiting matches the deployment topology.
7. Confirm integration catalog data exists before traffic reaches the app.
8. Confirm `/connect-core/debug` returns `404` in production.
9. If a real OAuth provider is enabled, verify the relevant setup guide end-to-end.

## Public Release Decisions

Owner-controlled public launch decisions are not self-hosting safety checks. Track them in [Pre-public owner decisions](PRE_PUBLIC_OWNER_DECISIONS.md):

- Final public GitHub organization, repository name, and repository URL.
- Private security reporting path.
- Branch protection required status checks.
- Package metadata timing for `repository`, `homepage`, and `bugs` fields.
- Changelog date or owner-approved date exception.
- Real maintainer handles, ownership boundaries, and whether to add `.github/CODEOWNERS`.
- Code of Conduct timing.

Do not publish v1.0 without selected security reporting path unless project owner explicitly accepts pre-public exception.

## Optional Production Hardening

These follow-ups may improve a specific deployment, but they do not change v1.0 release scope unless explicitly approved:

- Deployment-specific observability dashboards.
- External log redaction policy checks.
- Distributed rate-limit backing store.
- Production database backup and restore drills.
- Deployment-specific SLO review.

## Release Wording Guardrails

These statements should remain stable so release-preparation checks catch accidental drift in production guidance:

- Use this checklist before deploying ConnectOS beyond local demo mode.
- This production-readiness aid is not release approval and does not replace an environment-specific security review.
- This production-readiness aid is not release approval does not replace environment-specific security review.
- Production preparation must preserve current architecture and compatibility-sensitive names.
- Production preparation must preserve current architecture compatibility-sensitive names.
- Production preparation must preserve the current architecture and compatibility-sensitive names.
- Do not use this checklist to add new architecture, providers, connectors, Capabilities, Actions, Skills, Recipes, APIs, databases, product features, or product-specific business logic.
- Do not use checklist add new architecture, providers, connectors, Capabilities, Actions, Skills, Recipes, APIs, databases, product features, or product-specific business logic.
- CONNECT_CORE_ENCRYPTION_KEY
- /connect-core/debug
- COMPOSIO_API_KEY
- COMPOSIO_AUTH_CONFIG_IDS
- Confirm Composio connected account identifiers stored in connection metadata, not raw provider tokens.
- Confirm Composio connected account identifiers are stored in connection metadata, not raw provider tokens.
- Confirm `/connect-core/debug` returns `404` in production.
- The release not ready if any required gate fails.
- The release is not ready if any required gate fails.
- release not ready required gate fails.
- Do not publish v1.0 without selected security reporting path unless project owner explicitly accepts pre-public exception.
- Do not publish v1.0 without a selected security reporting path unless the project owner explicitly accepts a pre-public exception.
- Future renames require an approved compatibility-preserving migration plan.
- pnpm release:check
