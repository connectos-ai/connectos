# Slack OAuth Setup

This guide explains how to verify the real Slack OAuth path for the ConnectOS Slack integration on localhost.

Use this guide only when you want to test real Slack OAuth locally. Local mock mode works without Slack credentials.

Real Slack OAuth requires provider credentials and `CONNECT_CORE_ENCRYPTION_KEY`. If the encryption key is missing, ConnectOS keeps Slack in mock fallback mode so real OAuth tokens are not stored without encrypted token handling.

## Prerequisites

- A Slack workspace where you can create and install a Slack app.
- A local ConnectOS checkout with dependencies installed.
- A generated `CONNECT_CORE_ENCRYPTION_KEY` before enabling real OAuth.
- A local database if you want connection state to persist across refreshes and process restarts.

## 1. Create Or Select Slack App

1. Open [Slack API Apps](https://api.slack.com/apps).
2. Click **Create New App**.
3. Choose **From scratch**.
4. Select the workspace you want to use for local testing.

## 2. Configure Redirect URL

In Slack app settings, open **OAuth & Permissions** and add this redirect URL:

```text
http://localhost:3033/api/connect-core/callback
```

Use the same value for `SLACK_REDIRECT_URI`.

Slack OAuth v2 sends users to Slack's authorization endpoint, then returns a temporary authorization code to the configured redirect URL. ConnectOS exchanges that code through the existing Slack OAuth adapter.

## 3. Add Bot Scopes

In **OAuth & Permissions**, add **Bot Token Scopes**:

```text
channels:read
chat:write
```

The v1.0 release-preparation build intentionally keeps scopes small:

- `channels:read` supports lightweight workspace channel validation.
- `chat:write` matches the existing Slack messaging capability mapping.

## 4. Set Environment Variables

Use [`apps/web/.env.example`](../apps/web/.env.example) as your local template:

```bash
cp apps/web/.env.example apps/web/.env.local
```

Set Slack OAuth variables only when `CONNECT_CORE_ENCRYPTION_KEY` is also set. This keeps real OAuth tokens out of storage until encrypted token handling is configured.

Set values in `apps/web/.env.local` or in the same terminal session you use to start the web app:

```bash
SLACK_CLIENT_ID="your-slack-client-id"
SLACK_CLIENT_SECRET="your-slack-client-secret"
SLACK_REDIRECT_URI="http://localhost:3033/api/connect-core/callback"
CONNECT_CORE_ENCRYPTION_KEY="a-long-random-secret"
```

For persistent connection storage, also set:

```bash
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/connect_any_inbox"
```

Do not paste Slack client secrets, encryption keys, access tokens, refresh tokens, token references, raw callback payloads, or raw Slack provider responses into public issues, pull requests, documentation, screenshots, logs, or chat.

## 5. Prepare Local Database

Run database commands from the repository root:

```bash
pnpm prisma:validate
pnpm --filter @connect-any-inbox/web exec prisma migrate dev --schema prisma/schema.prisma --name connect-core
pnpm --filter @connect-any-inbox/web exec prisma generate --schema prisma/schema.prisma
pnpm connect-core:seed
```

If you are only checking mock fallback behavior, you can skip the database and let ConnectOS use the in-memory development repository. In-memory state does not survive process restarts.

## 6. Restart Dev Server

Stop the current dev server and restart it after setting environment variables:

```bash
pnpm --filter @connect-any-inbox/web dev -- -p 3033
```

Open:

```text
http://localhost:3033/connect-core/debug
```

Confirm:

- Slack env configured: `Yes`.
- Redirect URI: `http://localhost:3033/api/connect-core/callback`.
- Slack provider mode: `real-oauth`.
- Debug output excludes tokens, token references, client secrets, refresh tokens, raw callback payloads, and raw provider responses.

`/connect-core/debug` is development-only and returns `404` in production.

## 7. Verify Slack

1. Open `http://localhost:3033/connect-core`.
2. Confirm Slack shows `Slack OAuth`.
3. Click **Connect**.
4. Complete Slack consent.
5. Confirm you return to `/connect-core`.
6. Confirm Slack shows **Connected**.
7. Refresh the page.
8. Confirm Slack remains connected.
9. Click the health check control.
10. Confirm health is connected or healthy.
11. Disconnect Slack.
12. Refresh and confirm Slack is disconnected.

## Manual Checklist Script

Run:

```bash
bash scripts/manual-slack-oauth-check.sh
```

The script prints a manual verification checklist. It does not read or print secrets.

## Troubleshooting

- If Slack shows mock mode, confirm `SLACK_CLIENT_ID`, `SLACK_CLIENT_SECRET`, `SLACK_REDIRECT_URI`, and `CONNECT_CORE_ENCRYPTION_KEY` are set in the dev server environment.
- If Slack returns a redirect URI mismatch, confirm the Slack app includes exactly `http://localhost:3033/api/connect-core/callback`.
- If Slack does not show expected scopes, confirm `channels:read` and `chat:write` are configured under **Bot Token Scopes**.
- If connection state disappears after restart, confirm `DATABASE_URL` is set and migrations have run.
- If the callback is denied or canceled, ConnectOS should return cleanly without storing tokens.
- If the health check fails, confirm the stored Slack token can call Slack's `auth.test` method.

## Safety Rules

- Never paste Slack access tokens, refresh tokens, token references, OAuth client secrets, encryption keys, raw callback payloads, or raw provider responses into chat, logs, docs, issue trackers, public issues, screenshots, or pull requests.
- Confirm debug output excludes token values, token references, client secrets, refresh tokens, raw callback payloads, and raw provider responses.
- OAuth tokens must be stored only through `saveOAuthToken`.
- Real OAuth must not run unless encrypted token storage is configured.

## Production Hardening Note

Real Slack OAuth requires encrypted token storage. Set `CONNECT_CORE_ENCRYPTION_KEY` before enabling Slack outside mock mode:

```bash
CONNECT_CORE_ENCRYPTION_KEY="a-long-random-secret"
```

Confirm production OAuth redirect URIs point to the deployed `/api/connect-core/callback` URL before enabling real Slack OAuth outside localhost.

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

During v1.0 release preparation, this document describes existing Slack OAuth behavior. Release-preparation work must not add new providers, connectors, Capabilities, Actions, Skills, Recipes, APIs, databases, architecture, or product-specific workflows without explicit scope approval.

## Required Release Gate

Run the full release gate before submitting Slack OAuth documentation changes:

```bash
pnpm release:check
```

`pnpm release:check` includes:

- `pnpm release-docs:check`
- `pnpm release-metadata:check`
- `pnpm test`
- `pnpm lint`
- `pnpm typecheck`
- `pnpm prisma:validate`
- `pnpm build`

## References

- [Slack OAuth v2 installation](https://docs.slack.dev/authentication/installing-with-oauth)
- [Slack oauth.v2.access](https://docs.slack.dev/reference/methods/oauth.v2.access)
- [Slack auth.test](https://docs.slack.dev/reference/methods/auth.test)
- [Slack authentication overview](https://docs.slack.dev/authentication/)
