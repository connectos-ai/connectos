# ConnectOS Environment Variables

This guide lists environment variables used by ConnectOS v1.0 release-preparation build.

Use [`apps/web/.env.example`](../apps/web/.env.example) as the local development template. ConnectOS runs locally without third-party credentials.

When provider credentials missing, affected integrations use mock fallback where supported so `/connect-core` remains usable. Real direct OAuth requires provider credentials and `CONNECT_CORE_ENCRYPTION_KEY`.

Do not invent or document final public URLs before project owner chooses them. Confirm real OAuth remains disabled when encrypted token storage not configured.

## Quick Decision Guide

| Goal | Required setup |
| --- | --- |
| Run the local demo | Copy `apps/web/.env.example` to `apps/web/.env.local`, then start the app on port `3033`. |
| Persist connection state | Add `DATABASE_URL`, validate Prisma, generate the Prisma client, and seed the integration catalog. |
| Test Google or Slack OAuth | Add provider credentials plus `CONNECT_CORE_ENCRYPTION_KEY`; use the `/api/connect-core/callback` redirect path. |
| Test Composio mode | Add `COMPOSIO_API_KEY` plus optional Composio mapping values. |
| Prepare production | Use a deployment secret manager, deployed callback URL, encrypted token storage, and production safety checks. |

## Local Setup

1. Copy the local development template:

```bash
cp apps/web/.env.example apps/web/.env.local
```

Do not commit `.env.local`. Keep production secrets in a deployment secret manager, not in Git.

2. Start the local app on the documented port:

```bash
pnpm --filter @connect-any-inbox/web dev -- -p 3033
```

The default local app URL is:

```text
http://localhost:3033
```

3. If you want persistent local state, add `DATABASE_URL` to `apps/web/.env.local`, then validate Prisma:

```bash
pnpm prisma:validate
```

4. Generate the Prisma client:

```bash
pnpm --filter @connect-any-inbox/web exec prisma generate --schema prisma/schema.prisma
```

5. Seed the ConnectOS integration catalog:

```bash
pnpm connect-core:seed
```

Without `DATABASE_URL`, ConnectOS uses the in-memory local demo repository. Connection state does not survive server restarts in that mode.

## Core Runtime

| Variable | Required | Purpose |
| --- | --- | --- |
| `DATABASE_URL` | Optional in demo mode; required for persistence | Enables the Prisma-backed ConnectOS repository. Without it, local connection state uses the in-memory fallback. |
| `NEXT_PUBLIC_APP_URL` | Recommended locally | Browser-facing app origin used by local OAuth redirect UI flows. |
| `CONNECT_CORE_ENCRYPTION_KEY` | Required for real direct OAuth | Enables encrypted OAuth token storage. Without it, direct OAuth integrations must stay in mock fallback mode. |
| `NODE_ENV` | Set by runtime | Enables production-only safety behavior, including blocking `/connect-core/debug`. |

Keep `CONNECT_CORE_ENCRYPTION_KEY` stable in any environment with persisted OAuth token records. Changing it makes existing encrypted token records unreadable.

## Direct OAuth Providers

Real direct OAuth providers stay in mock fallback mode unless provider credentials and `CONNECT_CORE_ENCRYPTION_KEY` are configured.

| Provider | Variables | Local redirect URI |
| --- | --- | --- |
| Google | `GOOGLE_CLIENT_ID`, `GOOGLE_CLIENT_SECRET`, `GOOGLE_REDIRECT_URI` | `http://localhost:3033/api/connect-core/callback` |
| Slack | `SLACK_CLIENT_ID`, `SLACK_CLIENT_SECRET`, `SLACK_REDIRECT_URI` | `http://localhost:3033/api/connect-core/callback` |

In production, use the deployed `/api/connect-core/callback` URL for each provider environment. Do not publish placeholder production redirect URLs, API keys, or secrets.

## Composio Provider

| Variable | Required | Purpose |
| --- | --- | --- |
| `COMPOSIO_API_KEY` | Required for real Composio mode | Enables the Composio provider adapter. Without it, Composio-backed integrations stay in mock fallback mode where supported. |
| `COMPOSIO_BASE_URL` | Optional | Overrides the default Composio API base URL. |
| `COMPOSIO_AUTH_CONFIG_IDS` | Optional | JSON mapping for Composio auth configuration IDs. |
| `COMPOSIO_AUTH_CONFIG_GITHUB` | Optional | Compatibility-specific Composio auth configuration mapping for GitHub-style integrations. |

Store Composio connected account identifiers in connection metadata. Do not store raw Composio API keys or provider tokens in connection metadata.

## Compatibility-Sensitive Names

These names remain intentionally preserved during v1.0 release preparation:

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

## Production Safety

Before testing real providers outside local demo mode:

- Set `CONNECT_CORE_ENCRYPTION_KEY` in a deployment secret manager.
- Confirm real OAuth remains disabled when encrypted token storage is not configured.
- Confirm provider redirect URIs use the deployed `/api/connect-core/callback` URL.
- Confirm `/connect-core/debug` returns `404` in production.
- Confirm logs do not include secrets, token references, raw callback payloads, or raw provider responses.
- Do not invent or document final public URLs before project owner chooses them.

## Secret Safety

Sensitive values include:

- OAuth access tokens.
- OAuth refresh tokens.
- OAuth authorization codes.
- Token references.
- OAuth client secrets.
- API keys.
- Encryption keys.
- Raw callback payloads.
- Raw provider responses.

Never paste sensitive values in public issues, public pull requests, public docs, screenshots, logs, or shared debugging output.

Do not report security vulnerabilities in public issues public pull requests. Until a private reporting path is selected, keep sensitive findings out of public issues, public pull requests, and public docs.

## Required Release Gate

Run the full release gate before changing environment documentation:

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

## Release Wording Guardrails

These exact statements are preserved so release-preparation checks catch accidental drift in environment security guidance:

- This guide lists environment variables used by ConnectOS v1.0 release-preparation build.
- This guide lists environment variables used by the ConnectOS v1.0 release-preparation build.
- ConnectOS runs locally without third-party credentials.
- When provider credentials missing, affected integrations use mock fallback where supported so `/connect-core` remains usable.
- When provider credentials are missing, affected integrations use mock fallback where supported so `/connect-core` remains usable.
- Real direct OAuth requires provider credentials and `CONNECT_CORE_ENCRYPTION_KEY`.
- Do not invent or document final public URLs before project owner chooses them.
- Do not invent or document final public URLs before the project owner chooses them.
- Confirm real OAuth remains disabled when encrypted token storage not configured.
- Confirm real OAuth remains disabled when encrypted token storage is not configured.
- Future renames require approved compatibility-preserving migration plan.
- Future renames require an approved compatibility-preserving migration plan.
- Do not report security vulnerabilities in public issues public pull requests.
- Do not report security vulnerabilities in public issues or public pull requests.

## Related Docs

- [Production checklist](PRODUCTION_CHECKLIST.md)
- [Google OAuth setup](GOOGLE_OAUTH_SETUP.md)
- [Slack OAuth setup](SLACK_OAUTH_SETUP.md)
- [Composio setup](COMPOSIO_SETUP.md)
- [Security policy](../SECURITY.md)
