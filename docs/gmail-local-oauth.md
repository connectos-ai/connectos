# Archived Gmail Local OAuth Notes

This document intentionally preserves historical context.

It is not the current ConnectOS v1.0 Google OAuth setup guide.

Earlier versions of the repository used this file to describe a local Gmail
OAuth proof before the current ConnectOS connection layer existed.

For the current v1.0 setup path, use [Google OAuth setup](GOOGLE_OAUTH_SETUP.md).

The current setup guide covers:

- `/connect-core` connection flow.
- Shared `/api/connect-core/callback` OAuth callback route.
- Required Google environment variables.
- Token encryption requirements.
- Persistent connection state.
- Debug verification.
- Manual Gmail and Google Calendar checks.

## Archive Status

Do not use archived notes to approve or infer:

- New architecture.
- New providers.
- New connectors.
- New Capabilities, Actions, Skills, or Recipes.
- New APIs or databases.
- New product features.
- Product-specific business logic.

Before acting on any historical item in this file, check current release scope in
[Release checklist](RELEASE_CHECKLIST.md).

## Archived Flow

The older proof used this callback URL:

```text
http://localhost:3001/api/connect/gmail/callback
```

It also used the older `/connect` page and `POST /api/sync/gmail` route to fetch
recent Gmail message metadata into an inbox demo.

Those details explain older tests and compatibility history, but they are not
the current ConnectOS v1.0 setup path.

## Archived Environment

The older proof used local placeholder values like:

```bash
NEXT_PUBLIC_APP_URL="http://localhost:3001"
GOOGLE_CLIENT_ID="your-google-oauth-client-id"
GOOGLE_CLIENT_SECRET="your-google-client-secret"
GOOGLE_REDIRECT_URI="http://localhost:3001/api/connect/gmail/callback"
```

Do not copy these values for current ConnectOS v1.0 setup.

## Current Replacement

Use the current ConnectOS Google OAuth callback instead:

```text
http://localhost:3033/api/connect-core/callback
```

Current docs:

- [Google OAuth setup](GOOGLE_OAUTH_SETUP.md)
- [Environment variables](ENVIRONMENT.md)
- [Security policy](../SECURITY.md)
- [Production checklist](PRODUCTION_CHECKLIST.md)
- [Release checklist](RELEASE_CHECKLIST.md)

## Compatibility Notes

ConnectOS still preserves compatibility-sensitive names during v1.0 release
preparation:

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

## Release Wording Guardrails

These exact statements are preserved so release-preparation checks catch
accidental drift in archived Gmail OAuth guidance:

- This document intentionally preserves historical context.
- It is not the current ConnectOS v1.0 Google OAuth setup guide.
- For the current v1.0 setup path, use [Google OAuth setup](GOOGLE_OAUTH_SETUP.md).
- Do not use archived notes to approve or infer:
- New APIs or databases.
- Product-specific business logic.
- http://localhost:3033/api/connect-core/callback
- Current docs:
- Compatibility Notes
- connect-core-token:v1
- universal_actions
- Future changes names require an approved compatibility-preserving migration plan.
