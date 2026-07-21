# ConnectOS Architecture

ConnectOS is neutral open-source infrastructure for AI applications. It helps AI applications reason about business intent instead of provider APIs, then routes that intent through the software each user has connected.

ConnectOS gives AI applications a common language through Providers, Connections, Capabilities, Actions, Skills, and Recipes.

```text
AI Application -> Skills -> Actions -> Capabilities -> Connections -> Providers -> Google, Slack, Composio, Mock, and future providers
```

Public documentation uses **Actions** as the developer-facing concept. The existing `universal_actions` internal execution substrate remains preserved for v1.0 compatibility.

## Problem Statement

AI application developers should not rebuild the same integration foundation in every product.

ConnectOS provides a shared layer for:

- OAuth connection flows.
- Token storage boundaries.
- Connection status and health checks.
- Provider-specific permissions.
- Standardized operations above provider SDKs.

Applications can operate at the level of business intent while ConnectOS resolves that intent through the providers each user has connected.

## Public Architecture

```text
Providers -> Connections -> Capabilities -> Actions -> Skills -> Recipes
```

Public terminology:

- **Provider**: concrete integration backend, such as Google, Slack, Composio, or Mock.
- **Connection**: user-owned authorization, status, and health lifecycle.
- **Capability**: something a connected app supports, such as sending messages or reading calendar events.
- **Action**: standardized operation an AI application can ask for, such as `send_message`.
- **Skill**: business intent exposed above Actions, such as `notify_team`.
- **Recipe**: reusable workflow composed from Skills.

Existing route names, package names, environment variables, internal service names, token formats, and API paths remain unchanged during v1.0 release preparation.

## Current Implementation

```text
/connect-core UI
  -> /api/connect-core/* routes
  -> ConnectCoreService
  -> ProviderRegistry
  -> mock | direct-oauth | composio
  -> ConnectCoreRepository
  -> PrismaConnectCoreRepository when configured
  -> InMemoryConnectCoreRepository fallback in local/demo mode
```

`ConnectCoreService` owns connection lifecycle, event logging, health persistence, provider selection, and repository coordination. Providers perform provider-specific connection work behind a shared contract.

## What Is Real

- `/connect-core` drives integration definitions from `@connect-any-inbox/connect-core`.
- Connect, callback completion, reconnect, disconnect, and health checks go through `ConnectCoreService`.
- Prisma persistence exists for integrations, connections, events, health checks, and OAuth token references.
- Gmail and Google Calendar use the real `direct-oauth` Google adapter when required Google environment variables are present.
- Slack can use the real `direct-oauth` Slack adapter when required Slack environment variables are present.
- Composio-backed integrations use the Composio provider adapter when Composio configuration is present.
- OAuth callback state is signed, validated, and replay-protected before connection completion.
- OAuth tokens are never logged.
- Tokens are stored only through `ConnectCoreRepository.saveOAuthToken`.
- Token storage uses an encrypted token reference in `ConnectCoreOAuthToken.tokenRef`.
- Capabilities, Actions, and AI Skills support dry-run resolution.

## Mock Fallback Behavior

- Mock mode remains the default local, demo, and test mode.
- If provider environment variables are missing, affected integrations remain usable through mock fallback where supported.
- Mock fallback keeps `/connect-core` useful without third-party credentials.
- Demo-mode connection state may be in memory unless `DATABASE_URL` and Prisma are configured.

Current release-preparation boundaries:

- Real write execution through Skills is not enabled.
- Skills perform no real write actions in the current release-preparation build.
- Production token-vault integrations are not included in the self-hosted starter configuration.

## Local Database Setup

Set `DATABASE_URL`:

```bash
export DATABASE_URL='postgresql://postgres:postgres@localhost:5432/connect_any_inbox'
```

Validate Prisma:

```bash
pnpm prisma:validate
```

Generate the Prisma client:

```bash
pnpm --filter @connect-any-inbox/web exec prisma generate --schema prisma/schema.prisma
```

Seed the integration catalog:

```bash
pnpm connect-core:seed
```

See [environment variables](ENVIRONMENT.md) for the full runtime configuration reference.

## Provider Setup

Provider-specific setup docs:

- [Google OAuth setup](GOOGLE_OAUTH_SETUP.md)
- [Slack OAuth setup](SLACK_OAUTH_SETUP.md)
- [Composio setup](COMPOSIO_SETUP.md)
- [Environment variables](ENVIRONMENT.md)

## Fallback Warning

If `DATABASE_URL` is missing or Prisma cannot connect, the app falls back to `InMemoryConnectCoreRepository` and logs:

```text
[connect-core] Using in-memory repository fallback. ...
```

When real provider configuration is missing, affected integrations remain mock-backed and the UI shows mock fallback state where supported.

## Provider Adapter Contract

Every provider implements:

- `startConnection(input)`
- `completeConnection(input)`
- `reconnect(input)`
- `disconnect(input)`
- `testConnection(input)`

Providers do provider-specific work only. `ConnectCoreService` owns catalog data, local connection lifecycle, event logging, and health persistence.

## Compatibility Notes

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

## Release Scope

Release-preparation work must preserve boundaries:

- No new architecture.
- No new providers.
- No new connectors.
- No new Capabilities, Actions, Skills, or Recipes.
- No new APIs or databases.
- No new product features.
- No product-specific business logic.

Product-specific business logic belongs outside ConnectOS. Post-v1 provider, connector, SDK, CLI, hosted infrastructure, and marketplace ideas remain future direction, not current release scope.

See [ROADMAP.md](ROADMAP.md) for the current release-quality roadmap.

ConnectOS v1.0 is focused on coherence and trust.

## Required Release Gate

Run the full release gate before submitting architecture documentation changes:

```bash
pnpm release:check
```

## Release Wording Guardrails

These statements should remain stable so release-preparation checks catch accidental drift in architecture guidance:

- neutral open-source infrastructure
- business intent instead of provider APIs
- Providers, Connections, Capabilities, Actions, Skills, and Recipes
- `universal_actions` internal execution substrate
- Prisma persistence exists integrations, connections, events, health checks, OAuth token references.
- Prisma persistence exists for integrations, connections, events, health checks, and OAuth token references.
- OAuth tokens never logged.
- OAuth tokens are never logged.
- Token storage uses an encrypted token reference in `ConnectCoreOAuthToken.tokenRef`.
- Mock mode
- [connect-core] Using in-memory repository fallback. ...
- Every provider implements:
- Future renames require approved compatibility-preserving migration plan.
- Future renames require an approved compatibility-preserving migration plan.
- Release-preparation work
- No new APIs databases.
- No new APIs or databases.
- Post-v1
