# ConnectOS v1.0 Release Checklist

Use this checklist before tagging or publishing ConnectOS v1.0.

ConnectOS is the open-source operating system for AI integrations. This checklist is the final release runbook for confirming that the repository is coherent, trustworthy, contributor-ready, and positioned as neutral infrastructure for AI applications.

Release preparation should improve quality without adding new platform features. This checklist does not approve expanded release scope.

## 1. Confirm Release Scope

v1.0 release preparation may include:

- Documentation polish.
- Naming terminology consistency.
- Verification of existing behavior.
- Contributor experience improvements.
- GitHub templates, license, changelog, and CI readiness.
- Security, production, and compatibility documentation.
- Demo polish that does not add platform capability.

v1.0 release preparation must preserve these guardrails:

- No new architecture.
- No new providers.
- No new connectors.
- No new Capabilities, Actions, Skills, or Recipes.
- No new APIs or databases.
- No new product features.
- No product-specific business logic.

## 2. Confirm Required Documentation

Confirm these documents exist, are current, and use neutral ConnectOS language:

- [README](../README.md)
- [Documentation index](README.md)
- [ConnectOS architecture](CONNECTOS.md)
- [Environment variables](ENVIRONMENT.md)
- [Production checklist](PRODUCTION_CHECKLIST.md)
- [Roadmap](ROADMAP.md)
- [Contributing](../CONTRIBUTING.md)
- [Security](../SECURITY.md)
- [Support](../SUPPORT.md)
- [Maintainers](../MAINTAINERS.md)
- [Founding Principles](../FOUNDING_PRINCIPLES.md)
- [Changelog](../CHANGELOG.md)
- [GitHub release setup](GITHUB_RELEASE_SETUP.md)
- [Pre-public owner decisions](PRE_PUBLIC_OWNER_DECISIONS.md)
- [Pre-release change inventory](PRE_RELEASE_CHANGE_INVENTORY.md)

Do not treat historical planning notes as current v1.0 scope. Archived docs may preserve context, but current release docs define the launch boundary.

## 3. Confirm Public Positioning

Before publishing, confirm public-facing surfaces consistently explain:

- ConnectOS is neutral infrastructure for AI applications.
- AI applications should reason about intent, not provider APIs.
- Providers, Capabilities, Actions, Skills, and Recipes form the public conceptual ladder.
- Product-specific business logic belongs outside ConnectOS.
- Compatibility-sensitive names remain preserved until an approved migration exists.

Do not mention product-specific origin stories, product roadmaps, or business vertical assumptions in public ConnectOS docs.

## 4. Confirm Security Readiness

Before public v1.0, confirm:

- Issue and pull request templates warn contributors not to post secrets.
- `CONNECT_CORE_ENCRYPTION_KEY` is documented as required before real Google or Slack OAuth is enabled.
- OAuth tokens, refresh tokens, authorization codes, API keys, client secrets, encryption keys, token references, raw callback payloads, and raw provider responses are absent from docs, tests, fixtures, logs, and screenshots.
- `/connect-core/debug` is blocked in production.
- Production deployment guidance points operators to the [Production checklist](PRODUCTION_CHECKLIST.md).
- A private vulnerability reporting path is selected, or an owner-approved pre-public exception is documented.

Sensitive values include:

- OAuth access tokens.
- OAuth refresh tokens.
- OAuth authorization codes.
- API keys.
- Client secrets.
- Encryption keys.
- Token references.
- Raw callback payloads.
- Raw provider responses.

Do not publish public v1.0 without a selected private security reporting channel unless the project owner explicitly accepts a pre-public exception.

## 5. Confirm Compatibility-Sensitive Names

The following names remain intentionally preserved during v1.0 release preparation:

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

## 6. Confirm GitHub Readiness

Before publishing the repository, confirm each owner-controlled item is resolved or explicitly deferred by the project owner:

- Final public GitHub organization, repository name, and repository URL.
- Public issues and pull requests are enabled only when maintainers are ready to respond.
- GitHub issue templates and the pull request template are present.
- Branch protection required status checks are selected.
- Private security reporting path is selected.
- Package metadata timing for `repository`, `homepage`, and `bugs` fields is decided.
- Changelog release date is owner-approved, or an exception is documented.
- Maintainer handles, ownership boundaries, and `.github/CODEOWNERS` timing are decided.
- Code of Conduct timing is decided.

## 7. Run Local Release Gates

Install dependencies:

```bash
pnpm install
```

Start the local demo for manual release-candidate UI smoke testing:

```bash
pnpm --filter @connect-any-inbox/web dev -- -p 3033
```

Then open:

```text
http://localhost:3033/connect-core
```

Run the same gate contributors and CI are expected to run:

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

The release is not ready if any required gate fails.

`pnpm release-docs:check` is the curated v1 documentation guardrail. It checks required phrases, public positioning, compatibility-sensitive names, release-scope boundaries, owner-controlled blockers, and release gates.

`pnpm release-metadata:check` confirms package manifests remain private, MIT-licensed, attributed to ConnectOS contributors, and free of placeholder public repository URLs.

`pnpm release-hygiene:check` confirms generated artifacts, logs, local databases, local environment files, machine-local files, local secrets, and OAuth tokens are not release artifacts.

## 8. Confirm CI Release Gate

GitHub Actions should run release gates on:

- Pull requests to `main`.
- Pushes to `main`.
- Manual `workflow_dispatch` runs.

CI workflow includes the `v1 Release Quality Gates` job.

Before tagging `v1.0.0`, manually run the `ConnectOS CI` workflow on the release-candidate commit and confirm `v1 Release Quality Gates` passes.

CI runs the same command contributors run locally:

```bash
pnpm release:check
```

Use the branch-protection status check name GitHub displays:

```text
ConnectOS CI / v1 Release Quality Gates
```

## 9. Prepare Release-Candidate Commit

Before tagging:

1. Confirm the working tree contains only release-intended files.
2. Confirm generated artifacts, local environment files, logs, local databases, machine-local files, local secrets, and OAuth tokens are not included in release commits.
3. Re-run the full local verification gate: `pnpm release:check`.
4. Run `ConnectOS CI` manually on the release-candidate commit.
5. Confirm branch protection is configured by the repository owner, or document an owner-approved exception.
6. Confirm private security reporting is configured by the repository owner, or document an owner-approved exception.

## 10. Tag v1.0.0

Create the release tag only after local and CI release-candidate checks pass:

```text
v1.0.0
```

Publish repository release notes only after the final public GitHub home is chosen. Do not invent a changelog date. Use an owner-approved release date or document an owner-approved exception.

## Owner Decisions Before Public v1.0

Track unresolved owner-controlled items in [Pre-public owner decisions](PRE_PUBLIC_OWNER_DECISIONS.md):

- Final public GitHub organization, repository name, and repository URL.
- Private security reporting path.
- Branch protection required status checks.
- Package metadata timing for `repository`, `homepage`, and `bugs` fields.
- Changelog release date.
- Maintainer handles and `.github/CODEOWNERS` timing.
- Code of Conduct timing.

Do not guess owner-controlled release details in code, docs, package manifests, or GitHub settings.

## Explicit Non-Blockers

Do not block v1.0 on follow-ups unless the project owner explicitly changes release scope:

- Renaming package scopes away from `@connect-any-inbox/*`.
- Adding README screenshots or demo videos.
- Offering hosted infrastructure.
- Creating marketplace features.
- Adding new providers, connectors, Capabilities, Actions, Skills, or Recipes.

## Release Wording Guardrails

Exact statements preserved so release-preparation checks catch accidental drift in release checklist guidance:

- Use checklist before tagging publishing ConnectOS v1.0.
- Use this checklist before tagging publishing ConnectOS v1.0.
- Release preparation should improve quality without adding new platform features.
- No new APIs databases.
- ConnectOS is open-source operating system AI integrations.
- ConnectOS open-source operating system AI integrations.
- Do not publish public v1.0 without selected security reporting channel unless project owner explicitly accepts pre-public exception.
- Do not publish public v1.0 without a selected private security reporting channel unless the project owner explicitly accepts a pre-public exception.
- Do not publish public v1.0 without a selected private security reporting channel unless the project owner explicitly accepts a pre-public exception.
- Future renames require an approved compatibility-preserving migration plan.
- CI workflow includes the `v1 Release Quality Gates` job.
- CI workflow includes the `v1 Release Quality Gates` job.
- CI workflow includes the `v1 Release Quality Gates` job.
- pnpm release:check
- Do not guess owner-controlled release details in code, docs, package manifests, or GitHub settings.
- Renaming package scopes away from `@connect-any-inbox/*`.
