# Release-Candidate Change Grouping

This document is a release-candidate review aid. It is not release approval, and it is not a feature plan.

Use it with:

- [Release-candidate staging checklist](RELEASE_CANDIDATE_STAGING_CHECKLIST.md)
- [Pre-release change inventory](PRE_RELEASE_CHANGE_INVENTORY.md)
- [Release staging plan](RELEASE_STAGING_PLAN.md)
- [Release-candidate readiness](RELEASE_CANDIDATE_READINESS.md)
- [Release checklist](RELEASE_CHECKLIST.md)

## Snapshot

Collect fresh evidence before final staging. Collect fresh evidence final staging.

Run before staging:

```bash
git status --short --untracked-files=all
git diff --stat
pnpm release-hygiene:check
```

Use the refreshed snapshot to confirm:

- Every changed path supports release preparation.
- No generated output, local-only files, local databases, logs, secrets, raw callback payloads, raw provider responses, OAuth tokens, or API keys are included.
- Every review group has a clear reviewer focus and verification path.

Do not treat earlier changed-path counts as release facts. Do not treat earlier changed-path counts release facts. The working tree can change during release preparation, and `pnpm release-hygiene:check` may expand untracked directories differently than `git status --short`.

## Review Groups

| Review group | Reviewer focus |
| --- | --- |
| Public Release Docs | Neutral ConnectOS positioning, release scope, owner-decision boundaries, contributor trust |
| Platform Setup Docs | Setup clarity, provider boundaries, secret safety, no new scope |
| GitHub Templates And CI | Contributor intake, security routing, release gate consistency |
| Demo And Public UI Copy | ConnectOS copy, `/connect-core` compatibility, production-blocked debug surface |
| Platform Code And Tests | Existing ConnectOS behavior, security guardrails, tests, compatibility names |
| Tooling And Package Metadata | Release gates, package metadata, hygiene checks, no placeholder public URLs |
| Historical Reference Docs | Archived context only, no new v1.0 scope |
| Setup Examples And Manifests | Examples, manifests, manual verification aids without real secrets |

## Public Release Docs

Includes top-level public docs and current release-preparation docs.

Representative paths:

- `README.md`
- `CHANGELOG.md`
- `CONTRIBUTING.md`
- `FOUNDING_PRINCIPLES.md`
- `SECURITY.md`
- `SUPPORT.md`
- `MAINTAINERS.md`
- `LICENSE`
- `docs/README.md`
- `docs/CONNECTOS.md`
- `docs/RELEASE_CHECKLIST.md`
- `docs/RELEASE_CANDIDATE_READINESS.md`
- `docs/RELEASE_CANDIDATE_STAGING_CHECKLIST.md`
- `docs/RELEASE_CANDIDATE_CHANGE_GROUPING.md`
- `docs/RELEASE_STAGING_PLAN.md`
- `docs/GITHUB_RELEASE_SETUP.md`
- `docs/CONNECTOS_V1_RELEASE_STATUS.md`
- `docs/V1_RELEASE_READINESS_AUDIT.md`
- `docs/PRE_PUBLIC_OWNER_DECISIONS.md`
- `docs/PRE_RELEASE_CHANGE_INVENTORY.md`
- `docs/PACKAGE_METADATA_AUDIT.md`
- `docs/SESSION_TRANSFER.md`
- `docs/END_OF_SESSION_TRANSFER.md`
- `docs/prompts/QUICK_CONNECTOS_RELEASE_STATUS.md`

Review focus:

- Docs position ConnectOS as neutral open-source infrastructure for AI applications.
- Docs explain that AI applications should reason about intent, not provider APIs.
- Docs avoid product-specific business logic and product-specific positioning.
- Owner-controlled release values remain deferred instead of guessed.

## Platform Setup Docs

Includes environment setup, provider setup, production guidance, connector-development docs, and safe example manifests.

Representative paths:

- `apps/web/.env.example`
- `docs/ENVIRONMENT.md`
- `docs/PRODUCTION_CHECKLIST.md`
- `docs/GOOGLE_OAUTH_SETUP.md`
- `docs/SLACK_OAUTH_SETUP.md`
- `docs/COMPOSIO_SETUP.md`
- `docs/CONNECTOR_DEVELOPMENT.md`
- `docs/CONNECTION_INTELLIGENCE.md`
- `docs/UNIVERSAL_ACTIONS.md`
- `docs/AI_SKILLS.md`
- `docs/STARTER_KITS.md`
- `docs/ROADMAP.md`
- `docs/connectors/manifest.example.json`
- `docs/connectors/manifest.example.yaml`

Review focus:

- Setup instructions are clear for first-time developers.
- Examples use placeholders, not real credentials.
- Real OAuth setup docs warn against exposing secrets or tokens.
- Compatibility-sensitive names remain documented until an approved migration exists.

## GitHub Templates And CI

Includes public issue templates, the pull request template, and release CI.

Representative paths:

- `.github/ISSUE_TEMPLATE/bug_report.md`
- `.github/ISSUE_TEMPLATE/config.yml`
- `.github/ISSUE_TEMPLATE/release_prep.md`
- `.github/PULL_REQUEST_TEMPLATE.md`
- `.github/workflows/ci.yml`

Review focus:

- Contributor templates describe v1 release-prep scope clearly.
- Security reports route away from public issues and public pull requests.
- CI runs `pnpm release:check`.
- Branch protection can target `ConnectOS CI / v1 Release Quality Gates`.
- No placeholder GitHub URLs, security contacts, or maintainer handles are introduced.

## Demo And Public UI Copy

Includes existing public demo pages, app shell copy, styling, layout, and metadata surfaces.

Representative paths:

- `apps/web/app/connect-core/`
- `apps/web/components/connect-core/`
- `apps/web/app/globals.css`
- `apps/web/app/layout.tsx`
- `apps/web/app/icon.svg`

Review focus:

- Demo copy uses neutral ConnectOS language.
- Compatibility-sensitive `/connect-core` routes remain preserved.
- `/connect-core/debug` remains blocked in production.
- Demo copy does not introduce product-specific positioning or new product capability.

## Platform Code And Tests

Includes existing runtime code and tests touched during release preparation.

Representative paths:

- `apps/web/app/api/connect-core/`
- `apps/web/lib/`
- `apps/web/prisma/schema.prisma`
- `apps/web/scripts/seed-connect-core.ts`
- `packages/connect-core/`
- Provider, repository, security, capability, action, and skill tests.

Review focus:

- Existing behavior remains covered by tests.
- Security guardrails remain intact.
- OAuth tokens, refresh tokens, API keys, client secrets, encryption keys, token references, raw callback payloads, and raw provider responses are not exposed.
- Existing compatibility-sensitive names are preserved.
- No new provider, connector, Capability, Action, Skill, Recipe, API, database, architecture, product feature, or product-specific workflow is added without explicit approval.

## Tooling And Package Metadata

Includes release checker scripts, workspace configuration, package metadata, lockfile changes, and lint setup.

Representative paths:

- `.gitignore`
- `package.json`
- `apps/web/package.json`
- `apps/web/eslint.config.mjs`
- `eslint.config.mjs`
- `pnpm-workspace.yaml`
- `pnpm-lock.yaml`
- `packages/*/package.json`
- `scripts/check-package-metadata.mjs`
- `scripts/check-release-docs.mjs`
- `scripts/check-release-hygiene.mjs`
- `scripts/manual-google-oauth-check.sh`
- `scripts/manual-slack-oauth-check.sh`

Review focus:

- `pnpm release:check` remains the documented full release gate.
- Package metadata remains neutral, private, MIT-licensed, attributed to ConnectOS contributors, and free of placeholder public repository URLs until owner decisions are resolved.
- Release checker scripts enforce public-doc, metadata, and hygiene guardrails.
- Tooling changes do not introduce new product scope.

## Historical Reference Docs

Includes archived context that should not become current v1.0 release scope.

Representative paths:

- `SPEC.md`
- `tasks/plan.md`
- `tasks/todo.md`
- `docs/decisions/`
- `docs/gmail-local-oauth.md`
- `docs/mvp-ship-readiness.md`
- `docs/observability.md`
- `docs/connectors/roadmap.md`

Review focus:

- Historical docs remain useful context, not current release instructions.
- Historical docs do not expand v1.0 release scope.
- Current release docs are linked where they supersede older instructions.

## Setup Examples And Manifests

Includes connector manifest examples, starter kit examples, and manual verification aids.

Representative paths:

- `docs/connectors/manifest.example.json`
- `docs/connectors/manifest.example.yaml`
- Manual Google and Slack verification scripts.
- Starter kit and connector development examples.

Review focus:

- Examples use placeholders, not real secrets.
- Example manifests validate where validation exists.
- Example copy avoids product-specific positioning.
- Examples do not imply unapproved v1.0 features.

## Required Verification

Run the release hygiene check before staging changes:

```bash
pnpm release-hygiene:check
```

Run the full release gate before cutting the release candidate:

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

Exact statements preserved so release-preparation checks catch accidental drift in release-candidate grouping guidance:

- Collect fresh evidence final staging
- Collect fresh evidence before final staging
- Do not treat earlier changed-path counts release facts.
- Public Release Docs
- Platform Setup Docs
- GitHub Templates And CI
- Demo And Public UI Copy
- Platform Code And Tests
- Tooling And Package Metadata
- Historical Reference Docs
- Setup Examples And Manifests
- pnpm release-hygiene:check
- pnpm release:check
- Required Verification
