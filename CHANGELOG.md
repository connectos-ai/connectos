# Changelog

All notable ConnectOS release changes are documented in this file.

ConnectOS release notes prioritize compatibility, release readiness, contributor
clarity, and security over feature marketing.

## [Unreleased]

This section will become `[v1.0.0] - YYYY-MM-DD` after the project owner chooses
the public release date.

Do not invent a v1.0.0 date before decision is made.

Track the release-date decision in
[Pre-public owner decisions](docs/PRE_PUBLIC_OWNER_DECISIONS.md).

When the owner approves the release date, replace the placeholder date and run:

```bash
pnpm release-docs:check
pnpm release:check
```

### Release Preparation

- Repositioned public documentation around ConnectOS as neutral open-source
infrastructure AI applications.
- Rewrote `README.md` into a v1-oriented overview covering mission,
architecture, quick start, provider modes, project docs,
compatibility-sensitive names, and release-preparation scope.
- Added top-level release documents: `CONTRIBUTING.md`, `SECURITY.md`,
`SUPPORT.md`, `MAINTAINERS.md`, `FOUNDING_PRINCIPLES.md`, and `CHANGELOG.md`.
- Added `docs/README.md` as the active documentation index for platform
concepts, provider setup, operations, release preparation, connector examples,
and historical context.
- Added release-readiness docs covering the release checklist, GitHub setup,
release-candidate readiness, pre-public owner decisions, package metadata,
change inventory, staging plan, and session transfers.
- Added local release-gate documentation so contributors verify the same quality
bar used by the `v1 Release Quality Gates` CI job.
- Added release-documentation checks for required public docs,
compatibility-sensitive names, owner-controlled decisions, release gates, and
banned product-specific wording.
- Archived older planning docs as historical context so they do not define the
current ConnectOS v1.0 release scope.

### Security And Operations

- Documented secret-safety expectations for OAuth flows, debug output, audit
logs, callback payloads, and provider responses.
- Documented `CONNECT_CORE_ENCRYPTION_KEY` requirements before real Google or
Slack OAuth is enabled.
- Documented private vulnerability reporting expectations while the
owner-controlled private security reporting path remains unresolved.
- Documented production-readiness expectations for debug surfaces, environment
variables, package metadata, GitHub settings, and release gates.

### Release Scope

- Clarified that v1.0 release preparation is about coherence, trust,
documentation quality, GitHub readiness, contributor experience, and backward
compatibility.
- Clarified that post-v1 provider, connector, SDK, CLI, hosted infrastructure,
marketplace, and workflow execution ideas are future direction, not v1.0 release
blockers.
- Confirmed that release-preparation work must not add new architecture,
providers, connectors, Capabilities, Actions, Skills, Recipes, APIs, databases,
product features, or product-specific business logic without explicit scope
approval.

### Compatibility-Sensitive Names

The following compatibility-sensitive names remain intentionally preserved:

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

### Owner-Controlled Before Public v1.0

The following items remain owner-controlled before public release:

- Final public GitHub organization.
- Final repository name and repository URL.
- Private security reporting path.
- Branch protection required status checks.
- Changelog v1.0.0 release date.
- Package metadata timing `repository`, `homepage`, and `bugs` fields.
- Maintainer handles and CODEOWNERS timing.
- Code of Conduct timing.

## Release Wording Guardrails

The following exact statements should remain stable so release-preparation checks
catch accidental drift in changelog guidance:

- neutral open-source infrastructure AI applications
- neutral open-source infrastructure for AI applications
- Do not invent a v1.0.0 date before decision is made.
- Private security reporting path
- Package metadata timing `repository`, `homepage`, and `bugs` fields.
- Package metadata timing `repository`, `homepage`, `bugs` fields.
- Package metadata timing for `repository`, `homepage`, and `bugs` fields.
- CONNECT_CORE_ENCRYPTION_KEY
- universal_actions
