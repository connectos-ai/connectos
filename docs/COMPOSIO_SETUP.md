# Composio Setup

This guide explains how to verify Composio-backed integrations in ConnectOS while keeping direct Google, Google Calendar, and Slack OAuth unchanged.

Use this guide only when you want to test Composio-backed integrations locally. Local mock mode works without a Composio API key.

ConnectOS stores Composio connected-account IDs in connection metadata. It does not store raw provider tokens for Composio-backed integrations.

## Provider Boundary

Composio is an additional provider option behind the existing ConnectOS provider boundary.

- Direct Google, Google Calendar, and Slack OAuth remain on their own provider paths.
- Composio-backed integrations use Composio auth configs and connected accounts.
- Mock fallback remains available when Composio is not configured.
- ConnectOS stores Composio connected-account identifiers, auth-config IDs, toolkit slugs, and non-secret status metadata.
- ConnectOS must not store raw provider tokens for Composio-backed integrations.

Official Composio docs describe connected accounts as user-authorized connections to toolkits. Composio stores and refreshes credentials for those accounts; ConnectOS should keep only the identifiers needed to reference them.

## Prerequisites

- A Composio project for local testing.
- A Composio project API key.
- Auth configs for the Composio toolkits you want ConnectOS to power.
- A local ConnectOS checkout with dependencies installed.
- A local database if you want connection state to persist across refreshes and process restarts.

## 1. Choose Composio-Backed Integrations

Current Composio-backed integration IDs may include:

```text
github
hubspot
quickbooks
google-drive
stripe
```

Gmail, Google Calendar, and Slack remain direct OAuth integrations in the app. Composio is an additional provider option, not a replacement for direct OAuth.

## 2. Create Composio Auth Configs

In Composio, create auth configs for the toolkits you want to test. An auth config defines the toolkit authentication method, scopes, and provider credentials that Composio uses when users connect the toolkit.

Record each auth config ID privately.

Do not paste auth config secrets, API keys, provider tokens, raw provider responses, or raw callback payloads into public docs or issues.

## 3. Set Environment Variables

Use [`apps/web/.env.example`](../apps/web/.env.example) as your local template:

```bash
cp apps/web/.env.example apps/web/.env.local
```

Set the Composio API key in `apps/web/.env.local` or in the same terminal session you use to start the web app:

```bash
COMPOSIO_API_KEY="your-composio-project-api-key"
```

The default Composio base URL is already configured for local development:

```bash
COMPOSIO_BASE_URL="https://backend.composio.dev"
```

Use `COMPOSIO_AUTH_CONFIG_IDS` to map ConnectOS integration IDs to Composio auth config IDs:

```bash
COMPOSIO_AUTH_CONFIG_IDS='{"github":"your-github-auth-config-id","hubspot":"your-hubspot-auth-config-id"}'
```

Individual auth config variables are also supported. For example:

```bash
COMPOSIO_AUTH_CONFIG_GITHUB="your-github-auth-config-id"
```

For other Composio-backed integrations, prefer `COMPOSIO_AUTH_CONFIG_IDS` so mappings stay visible in one JSON object.

For persistent connection storage, also set:

```bash
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/connect_any_inbox"
```

Do not paste Composio API keys, auth config secrets, provider tokens, token references, raw provider responses, or raw callback payloads into public issues, pull requests, documentation, screenshots, logs, or chat.

## 4. Prepare Local Database

Run database commands from the repository root:

```bash
pnpm prisma:validate
pnpm --filter @connect-any-inbox/web exec prisma migrate dev --schema prisma/schema.prisma --name connect-core
pnpm --filter @connect-any-inbox/web exec prisma generate --schema prisma/schema.prisma
pnpm connect-core:seed
```

If you are only checking mock fallback behavior, you can skip the database and let ConnectOS use the in-memory development repository. In-memory state does not survive process restarts.

## 5. Restart Dev Server

Stop the current dev server and restart it after setting environment variables:

```bash
pnpm --filter @connect-any-inbox/web dev -- -p 3033
```

Open:

```text
http://localhost:3033/connect-core/debug
```

Confirm:

- Composio env configured: `Yes`.
- Composio base URL is shown.
- Composio mappings show expected toolkit slugs and auth config IDs.
- Debug output excludes API keys, provider tokens, token references, raw provider responses, and raw callback payloads.

If `COMPOSIO_BASE_URL` is empty, ConnectOS uses the hosted Composio backend default.

`/connect-core/debug` is development-only and returns `404` in production.

## 6. Verify Composio Integration

1. Open `http://localhost:3033/connect-core`.
2. Confirm a Composio-backed integration, such as GitHub, HubSpot, QuickBooks, Google Drive, or Stripe, shows `Composio`.
3. Click **Connect** on one Composio-backed integration.
4. Complete the Composio connection flow.
5. Confirm you return to `/connect-core`.
6. Confirm the integration shows **Connected**.
7. Refresh the page.
8. Confirm the connection remains visible.
9. Open `/connect-core/debug`.
10. Confirm the integration shows the last connection event and last health check.
11. Disconnect the integration.
12. Refresh and confirm it is disconnected.

## Fallback Behavior

- If `COMPOSIO_API_KEY` is missing, supported Composio integrations fall back to mock mode where supported.
- If a specific auth config ID is missing, ConnectOS may use the integration toolkit slug for local adapter testing.
- Direct Google, Google Calendar, and Slack OAuth remain on their own provider paths. Composio does not replace them.

## Troubleshooting

- If a Composio-backed integration shows mock mode, confirm `COMPOSIO_API_KEY` is set in the dev server environment.
- If the wrong toolkit opens, confirm the integration ID maps to the expected auth config ID in `COMPOSIO_AUTH_CONFIG_IDS` or the matching individual auth config variable.
- If connection state disappears after restart, confirm `DATABASE_URL` is set and migrations have run.
- If Composio returns an authorization error, confirm the API key belongs to the same project as the auth config.
- If debug output shows unexpected data, stop testing and confirm it excludes API keys, provider tokens, token references, raw provider responses, and raw callback payloads.
- ConnectOS should persist Composio connected-account IDs in connection metadata, not raw provider tokens.

## Production Hardening Note

Real Composio-backed integrations require a production Composio API key stored in deployment secrets:

```bash
COMPOSIO_API_KEY="your-composio-project-api-key"
```

If direct OAuth providers are also enabled in the same deployment, real direct OAuth requires encrypted token storage:

```bash
CONNECT_CORE_ENCRYPTION_KEY="a-long-random-secret"
```

Confirm production callback URLs in Composio auth configs point to the intended deployed environment before enabling real Composio-backed connections.

Do not invent or document final public URLs before the project owner chooses them.

## Compatibility-Sensitive Names

These names are intentionally preserved during v1.0 release preparation:

- `/connect-core`
- `/api/connect-core/*`
- `/api/connect-core/callback`
- `@connect-any-inbox/*`
- `CONNECT_CORE_ENCRYPTION_KEY`
- `connect-core-token:v1`
- `universal_actions`

Future renames require an approved compatibility-preserving migration plan.

## v1 Release Scope

During v1.0 release preparation, this document describes existing Composio provider behavior. Release-preparation work must not add new providers, connectors, Capabilities, Actions, Skills, Recipes, APIs, databases, architecture, or product-specific workflows without explicit scope approval.

## Required Release Gate

Run the full release gate before submitting Composio documentation changes:

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

## References

- [Composio API reference overview](https://docs.composio.dev/reference)
- [Composio connected accounts](https://docs.composio.dev/reference/v3/api-reference/connected-accounts)
- [Create a Composio auth link session](https://docs.composio.dev/reference/v3/api-reference/connected-accounts/postConnectedAccountsLink)
- [Composio connected account guide](https://docs.composio.dev/docs/auth-configuration/connected-accounts)
- [Composio projects](https://docs.composio.dev/reference/api-reference/projects)
