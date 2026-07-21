# Google OAuth Setup

This guide explains how to verify the real Google OAuth path for ConnectOS Gmail and Google Calendar integrations on localhost.

Use this guide only when you want to test real Google OAuth locally. Local mock mode works without Google credentials.

Real Google OAuth requires provider credentials and `CONNECT_CORE_ENCRYPTION_KEY`. If the encryption key is missing, ConnectOS keeps Gmail and Google Calendar in mock fallback mode so real OAuth tokens are not stored without encrypted token handling.

## Prerequisites

- A Google account that can create or edit a Google Cloud project.
- A local ConnectOS checkout with dependencies installed.
- A generated `CONNECT_CORE_ENCRYPTION_KEY` before enabling real OAuth.
- A local database if you want connection state to persist across refreshes and process restarts.

## 1. Create Or Select A Google Cloud Project

1. Open [Google Cloud Console](https://console.cloud.google.com/).
2. Create a new project or select an existing project.
3. Confirm the project organization settings are appropriate for local testing.

## 2. Configure OAuth Consent

1. In Google Cloud Console, open **Google Auth platform**.
2. Open **Branding**.
3. If prompted, click **Get started**.
4. Add an app name and user support email.
5. Choose the intended app audience.
6. Add your email as a test user while the app is in testing mode.
7. Review and save the consent configuration.

## 3. Enable Google APIs

Enable both APIs in the same Google Cloud project:

- Gmail API.
- Google Calendar API.

Gmail and Google Calendar are separate ConnectOS integrations, but they share the same Google OAuth client callback route in this local setup.

## 4. Create An OAuth Client

1. In Google Cloud Console, open **Google Auth platform**.
2. Open **Clients**.
3. Click **Create client**.
4. Set application type to **Web application**.
5. Add this authorized redirect URI:

```text
http://localhost:3033/api/connect-core/callback
```

6. Save the client ID and client secret somewhere private.

The redirect URI in Google Cloud must exactly match `GOOGLE_REDIRECT_URI`.

## 5. Set Environment Variables

Use [`apps/web/.env.example`](../apps/web/.env.example) as your local template:

```bash
cp apps/web/.env.example apps/web/.env.local
```

Set Google OAuth variables only when `CONNECT_CORE_ENCRYPTION_KEY` is also set. This keeps real OAuth tokens out of storage until encrypted token handling is configured.

Set values in `apps/web/.env.local` or in the same terminal session you use to start the web app:

```bash
GOOGLE_CLIENT_ID="your-client-id"
GOOGLE_CLIENT_SECRET="your-client-secret"
GOOGLE_REDIRECT_URI="http://localhost:3033/api/connect-core/callback"
CONNECT_CORE_ENCRYPTION_KEY="a-long-random-secret"
```

For persistent connection storage, also set:

```bash
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/connect_any_inbox"
```

Do not paste OAuth client secrets, encryption keys, access tokens, refresh tokens, token references, raw callback payloads, or raw Google provider responses into public issues, pull requests, documentation, screenshots, logs, or chat.

## 6. Prepare Local Database

Run database commands from the repository root:

```bash
pnpm prisma:validate
pnpm --filter @connect-any-inbox/web exec prisma migrate dev --schema prisma/schema.prisma --name connect-core
pnpm --filter @connect-any-inbox/web exec prisma generate --schema prisma/schema.prisma
pnpm connect-core:seed
```

If you are only checking mock fallback behavior, you can skip the database and let ConnectOS use the in-memory development repository. In-memory state does not survive process restarts.

## 7. Restart Dev Server

Stop the current dev server and restart it after setting environment variables:

```bash
pnpm --filter @connect-any-inbox/web dev -- -p 3033
```

Open:

```text
http://localhost:3033/connect-core/debug
```

Confirm:

- Google env configured: `Yes`.
- Redirect URI: `http://localhost:3033/api/connect-core/callback`.
- Gmail provider mode: `real-oauth`.
- Google Calendar provider mode: `real-oauth`.
- Debug output excludes tokens, token references, client secrets, raw callback payloads, and raw provider responses.

`/connect-core/debug` is development-only and returns `404` in production.

## 8. Verify Gmail

1. Open `http://localhost:3033/connect-core`.
2. Confirm Gmail shows `Google OAuth`.
3. Click **Connect**.
4. Complete Google consent.
5. Confirm you return to `/connect-core`.
6. Confirm Gmail shows **Connected**.
7. Refresh the page.
8. Confirm Gmail remains connected.
9. Click the health check control.
10. Confirm health is connected or healthy.
11. Disconnect Gmail.
12. Refresh and confirm Gmail is disconnected.

## 9. Verify Google Calendar

1. Open `http://localhost:3033/connect-core`.
2. Confirm Google Calendar shows `Google OAuth`.
3. Click **Connect**.
4. Complete Google consent.
5. Confirm you return to `/connect-core`.
6. Confirm Google Calendar shows **Connected**.
7. Refresh the page.
8. Confirm Google Calendar remains connected.
9. Click the health check control.
10. Confirm health is connected or healthy.
11. Disconnect Google Calendar.
12. Refresh and confirm Google Calendar is disconnected.

## Manual Checklist Script

Run:

```bash
bash scripts/manual-google-oauth-check.sh
```

The script prints a manual checklist. It does not read or print secrets.

## Troubleshooting

- If Gmail or Google Calendar shows mock mode, confirm `GOOGLE_CLIENT_ID`, `GOOGLE_CLIENT_SECRET`, `GOOGLE_REDIRECT_URI`, and `CONNECT_CORE_ENCRYPTION_KEY` are set in the dev server environment.
- If Google returns a redirect URI mismatch, confirm the Google OAuth client uses exactly `http://localhost:3033/api/connect-core/callback`.
- If Google blocks consent for the test account, confirm the account is listed as a test user while the OAuth app is in testing mode.
- If connection state disappears after restart, confirm `DATABASE_URL` is set and migrations have run.
- If the callback is denied or canceled, ConnectOS should return cleanly without storing tokens.

## Safety Rules

- Never paste access tokens, refresh tokens, token references, OAuth client secrets, encryption keys, raw callback payloads, or raw provider responses into chat, logs, docs, issue trackers, public issues, screenshots, or pull requests.
- Confirm debug output excludes token values, token references, client secrets, raw callback payloads, and raw provider responses.
- OAuth tokens must be stored only through `saveOAuthToken`.
- Real OAuth must not run unless encrypted token storage is configured.

## Production Hardening Note

Real Google OAuth requires encrypted token storage. Set `CONNECT_CORE_ENCRYPTION_KEY` before enabling Gmail or Google Calendar outside mock mode:

```bash
CONNECT_CORE_ENCRYPTION_KEY="a-long-random-secret"
```

Confirm production OAuth redirect URIs point to the deployed `/api/connect-core/callback` URL before enabling real Google OAuth outside localhost.

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

During v1.0 release preparation, this document describes existing Google OAuth behavior. Release-preparation work must not add new providers, connectors, Capabilities, Actions, Skills, Recipes, APIs, databases, architecture, or product-specific workflows without explicit scope approval.

## Required Release Gate

Run the full release gate before submitting Google OAuth documentation changes:

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

- [Google OAuth 2.0 Web Server Applications](https://developers.google.com/identity/protocols/oauth2/web-server)
- [Google OAuth 2.0 overview](https://developers.google.com/identity/protocols/oauth2)
- [OpenID Connect redirect URI guidance](https://developers.google.com/identity/openid-connect/openid-connect#setredirecturi)
- [Google OAuth 2.0 Policies](https://developers.google.com/identity/protocols/oauth2/policies)
