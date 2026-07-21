# Contributing

ConnectOS is neutral open-source infrastructure for AI applications. It exists
so AI applications can reason about business intent instead of provider APIs.

During v1.0 release preparation, the best contributions make ConnectOS easier
to understand, run, test, extend, and trust without adding new platform
capabilities.

## Local Setup

Use Node 24 or newer and pnpm 10.14.0 or newer.

For a fresh clone, ConnectOS can run locally without provider credentials or
Postgres.

1. Install dependencies:

```bash
pnpm install
```

2. Copy the local environment template:

```bash
cp apps/web/.env.example apps/web/.env.local
```

The template starts in demo mode. `DATABASE_URL`, provider credentials, and
`CONNECT_CORE_ENCRYPTION_KEY` are empty, so ConnectOS uses mock fallback where
supported. It also sets `NEXT_PUBLIC_APP_URL` to `http://localhost:3033` and
points OAuth providers at the shared `/api/connect-core/callback` route for
local development.

Demo-mode connection state is stored in memory and does not survive a server
restart.

3. Start the local app on the documented local port:

```bash
pnpm --filter @connect-any-inbox/web dev -- -p 3033
```

4. Open the local demo:

```text
http://localhost:3033/connect-core
```

`/connect-core` is intentionally preserved for compatibility during v1.0
release preparation.

For Prisma/Postgres-backed persistence:

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

## Required Checks

Run the authoritative full local release gate before opening a pull request:

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

Documentation-only changes still require the full release gate during v1.0
preparation. Individual checks are useful while developing or debugging, but
`pnpm release:check` is the final local verification command and matches the CI
release gate.

## Good v1.0 Contributions

Release-preparation contributions should improve:

- Documentation clarity.
- Naming and terminology consistency.
- Contributor setup verification.
- Test coverage for existing behavior.
- Security, production, and compatibility documentation.
- Demo polish that does not add new platform capability.
- GitHub templates, release notes, CI, or release-readiness evidence.

Pull requests should be small, focused, and easy to review.

## Out Of Scope During v1.0 Release Preparation

Do not make these changes unless the project owner explicitly approves a scope
change before implementation:

- New architecture.
- New providers.
- New connectors.
- New Capabilities, Actions, Skills, or Recipes.
- New APIs or databases.
- New product features.
- Product-specific business logic inside ConnectOS.

If a proposed change needs an exception, link the owner-approved scope decision
before implementation.

## Compatibility-Sensitive Names

The following names are intentionally preserved during v1.0 release
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

Future renames require an approved compatibility-preserving migration plan.

## Security And Secret Safety

Do not report security vulnerabilities in public issues or public pull requests.
Until maintainers publish an owner-approved private security reporting path, do
not include sensitive findings in public GitHub issues, pull requests,
screenshots, logs, or discussions.

Never include:

- OAuth tokens.
- Refresh tokens.
- OAuth authorization codes.
- API keys.
- Client secrets.
- Encryption keys.
- Token references.
- Raw callback payloads.
- Raw provider responses.
- Credentials.
- Exploitable vulnerability details.

If a report might expose secrets or vulnerability details, keep it private and
wait for the owner-approved reporting path.

## Pull Request Expectations

Pull requests should:

- Explain what changed and why it belongs in v1.0 release preparation.
- Preserve backward compatibility unless an approved migration plan is linked.
- Keep ConnectOS positioned as neutral infrastructure for AI applications.
- Avoid product-specific workflows, branding, or assumptions.
- Include relevant docs and tests for the changed surface.
- Include `pnpm release:check` verification, or explain a maintainer-approved
  exception.

Suggested pull request body:

```text
Summary:
- ...

Verification:
- pnpm release:check
```

If you used individual checks while developing or debugging, mention them too:

- `pnpm release-docs:check`
- `pnpm release-metadata:check`
- `pnpm release-hygiene:check`
- `pnpm test`
- `pnpm lint`
- `pnpm typecheck`
- `pnpm prisma:validate`
- `pnpm build`

## Owner-Controlled Release Details

Do not guess owner-controlled release details in code, docs, package manifests,
or GitHub settings.

Owner-controlled details include:

- Final public GitHub organization.
- Final repository name and repository URL.
- Private security reporting path.
- Branch protection and required status checks.
- Package metadata timing for `repository`, `homepage`, and `bugs` fields.
- Changelog release date.
- Maintainer handles.
- Ownership boundaries for any future `.github/CODEOWNERS` file.

Track them in [Pre-public owner decisions](docs/PRE_PUBLIC_OWNER_DECISIONS.md).

## More Guidance

- Documentation map: [docs/README.md](docs/README.md).
- Support routing: [SUPPORT.md](SUPPORT.md).
- Security model, vulnerability reporting, and security boundaries:
  [SECURITY.md](SECURITY.md).
- Ownership expectations: [MAINTAINERS.md](MAINTAINERS.md).
- Release scope: [ConnectOS v1.0 Release Checklist](docs/RELEASE_CHECKLIST.md).

## Release Wording Guardrails

These exact statements are preserved so release-preparation checks catch
accidental drift in contributor guidance:

- neutral open-source infrastructure for AI applications
- neutral open-source infrastructure AI applications
- business intent
- Documentation-only changes
- Pull requests should
- Final repository name
- Package metadata timing for `repository`, `homepage`, and `bugs` fields.
- Product-specific business logic inside ConnectOS
- Pre-public owner decisions
