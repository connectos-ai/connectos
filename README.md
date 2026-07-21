# ConnectOS

Build AI apps that work with real business software.

ConnectOS is the open-source operating system for AI integrations. It gives AI applications a common language for connecting business tools through Providers, Connections, Capabilities, Actions, Skills, and Recipes.

Current status: ConnectOS is in v1.0 release preparation.

Instead of writing provider-specific logic:

```text
Slack.send()
Gmail.send()
GoogleCalendar.createEvent()
```

Your AI can reason in terms of business intent:

```text
Notify Team
Schedule Meeting
Send Customer Update
```

ConnectOS resolves that intent through the providers each user has connected. The current v1.0 focus is release quality, documentation clarity, compatibility, security, and contributor experience. This release-preparation phase is not adding more connectors or platform capabilities.

## Why ConnectOS

AI applications should reason about intent, not provider APIs.

Most integration layers force developers to rebuild the same foundation in every product: OAuth, token storage, connection status, health checks, provider-specific permissions, and per-tool action logic.

ConnectOS turns those repeated integration concerns into reusable platform infrastructure so application teams can focus on the AI experience above the integration layer.

It is neutral infrastructure for AI applications, not tied to any specific product, workflow, company, or business vertical.

## Architecture

```text
AI Application -> Skills -> Actions -> Capabilities -> Connections -> Providers -> Google, Slack, Composio, Mock, and future providers
```

- **Provider**: concrete integration system such as Google, Slack, Composio, or Mock.
- **Connection**: user-owned authorization lifecycle and health state.
- **Capability**: something a connected tool can support, such as Send Email.
- **Action**: standardized operation that can be fulfilled by multiple providers.
- **Skill**: business intent an AI application asks for, such as `notify_team`.
- **Recipe**: reusable workflow made from Skills.

ConnectOS documents **Actions** as the public concept. The existing `universal_actions` name remains the internal execution substrate for backward compatibility.

Existing route names, package names, environment variables, token formats, and API paths remain unchanged during v1.0 release preparation.

## What Is Included

- Provider boundary for mock, direct OAuth, and Composio-backed integrations.
- Persistent connection repository with Prisma/Postgres support and in-memory fallback.
- Connection lifecycle APIs for connect, callback completion, reconnect, disconnect, and health checks.
- Token encryption, OAuth state validation, replay protection, and release-oriented safety checks.
- Data-driven integration catalog.
- Capability registry and Action mapping.
- AI Skills registry with dry-run resolution.
- Starter Kits for common business categories.
- Documentation for connector development, OAuth setup, production readiness, security, and release preparation.

The current release-preparation build does not perform real write actions through the Skills or Actions layers.

## Quick Start

Use Node 24 or newer and pnpm 10.14.0 or newer.

1. Install dependencies:

```bash
pnpm install
```

2. Copy the local environment template:

```bash
cp apps/web/.env.example apps/web/.env.local
```

The template starts in demo mode. `DATABASE_URL`, provider credentials, and `CONNECT_CORE_ENCRYPTION_KEY` are empty, so ConnectOS uses mock fallback where supported. The template also sets `NEXT_PUBLIC_APP_URL` to `http://localhost:3033` and points OAuth providers at the shared `/api/connect-core/callback` route for local development.

3. Start the app in local demo mode on the documented local port:

```bash
pnpm --filter @connect-any-inbox/web dev -- -p 3033
```

4. Open the local demo:

```text
http://localhost:3033/connect-core
```

`/connect-core` is intentionally preserved for compatibility during v1.0 release preparation. In demo mode, connection state is stored in memory and does not survive server restart.

## Optional Persistent Storage

For Prisma/Postgres-backed connection storage:

1. Start a local Postgres database.
2. Set `DATABASE_URL` in `apps/web/.env.local`.
3. Validate the Prisma schema:

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

Without `DATABASE_URL`, ConnectOS falls back to `InMemoryConnectCoreRepository` for local demo use.

## Provider Modes

ConnectOS runs in three provider modes:

- `mock`: default demo and test provider, also used when real provider configuration is missing.
- `direct-oauth`: app-owned OAuth for supported providers, currently Google and Slack.
- `composio`: Composio-backed connected account flow when Composio configuration is present.

Provider setup docs:

- [Google OAuth setup](docs/GOOGLE_OAUTH_SETUP.md)
- [Slack OAuth setup](docs/SLACK_OAUTH_SETUP.md)
- [Composio setup](docs/COMPOSIO_SETUP.md)
- [Environment variables](docs/ENVIRONMENT.md)

## Compatibility-Sensitive Names

These names are intentionally preserved during v1.0 release preparation:

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

These names are implementation details, not the public project identity. Public-facing documentation should use ConnectOS unless it is explicitly explaining compatibility behavior.

## Commands

Run the canonical local CI release gate:

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

Check release-critical public documentation, required files, neutral ConnectOS language, compatibility guidance, and release-preparation boundaries:

```bash
pnpm release-docs:check
```

Check that package manifests remain private, MIT-licensed, attributed to ConnectOS contributors, and free of placeholder public repository URLs:

```bash
pnpm release-metadata:check
```

## Verify Before Contributing

Before opening a pull request, run:

```bash
pnpm release:check
```

Documentation-only changes still require the full release gate during v1.0 preparation. GitHub CI runs the same release gate through `ConnectOS CI / v1 Release Quality Gates`.

See [GitHub release setup](docs/GITHUB_RELEASE_SETUP.md) and [release checklist](docs/RELEASE_CHECKLIST.md) before preparing a release candidate.

## Project Docs

- [ConnectOS docs index](docs/README.md)
- [Architecture overview](docs/CONNECTOS.md)
- [Connector development](docs/CONNECTOR_DEVELOPMENT.md)
- [Actions](docs/UNIVERSAL_ACTIONS.md)
- [AI Skills](docs/AI_SKILLS.md)
- [Security](SECURITY.md)
- [Contributing](CONTRIBUTING.md)
- [Roadmap](docs/ROADMAP.md)
- [Release checklist](docs/RELEASE_CHECKLIST.md)
- [Release-candidate readiness](docs/RELEASE_CANDIDATE_READINESS.md)
- [ConnectOS v1 release status](docs/CONNECTOS_V1_RELEASE_STATUS.md)
- [Pre-public owner decisions](docs/PRE_PUBLIC_OWNER_DECISIONS.md)
- [Release staging plan](docs/RELEASE_STAGING_PLAN.md)
- [Release-candidate staging checklist](docs/RELEASE_CANDIDATE_STAGING_CHECKLIST.md)
- [Package metadata audit](docs/PACKAGE_METADATA_AUDIT.md)
- [GitHub template readiness](docs/GITHUB_TEMPLATE_READINESS.md)

## v1 Release Scope

Release-preparation work must preserve boundaries:

- No new architecture.
- No new providers or connectors.
- No new Capabilities, Actions, Skills, or Recipes.
- No new APIs or databases.
- No new product features.
- No product-specific business logic.

<!--
Release-check compatibility phrases:
Build AI apps that work with real business software.
ConnectOS is the open-source operating system for AI integrations.
It gives AI applications a common language for connecting business tools through Providers, Connections, Capabilities, Actions, Skills, and Recipes.
It is neutral infrastructure for AI applications, not tied to any specific product, workflow, company, or business vertical.
Use Node 24 or newer and pnpm 10.14.0 or newer.
`/connect-core` is intentionally preserved for compatibility during v1.0 release preparation.
No new APIs databases.
-->
