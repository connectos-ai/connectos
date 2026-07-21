# Maintainers

ConnectOS maintainers protect neutral open-source infrastructure for AI
applications.

During v1.0 release preparation, maintainer review should favor trust, clarity,
compatibility, security, contributor experience, and release readiness over new
capability.

This document defines review expectations. It does not define maintainer names,
GitHub handles, review teams, or any future `.github/CODEOWNERS` file.

## Review Priorities

Maintainers should review every release-preparation change for:

- Neutral ConnectOS positioning.
- Backward compatibility.
- Secret safety.
- Clear documentation.
- Small, focused diffs.
- Verification appropriate to the change.

During v1.0 release preparation, maintainers should not approve changes that
violate release boundaries:

- New architecture.
- New providers.
- New connectors.
- New Capabilities, Actions, Skills, or Recipes.
- New APIs or databases.
- New product features.
- Product-specific business logic.

Exceptions require explicit scope approval before implementation.

## Required Verification

Run the full release gate before approving release-preparation changes:

```bash
pnpm release:check
```

`pnpm release:check` runs:

- `pnpm release-docs:check`
- `pnpm release-metadata:check`
- `pnpm release-hygiene:check`
- `pnpm test`
- `pnpm lint`
- `pnpm typecheck`
- `pnpm prisma:validate`
- `pnpm build`

Documentation-only changes still require the full release gate during v1.0
preparation. CI should run the same gate through the `v1 Release Quality Gates`
job.

## Compatibility-Sensitive Names

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

## Release Ownership

Before public v1.0, maintainers confirm that each owner-controlled release
decision is resolved or explicitly deferred by the project owner:

- GitHub private vulnerability reporting is enabled, another owner-approved
private security contact is published, or an owner-approved exception is
documented.
- Final public GitHub organization, Final repository name, and final repository
URL are chosen, or an owner-approved exception is documented.
- Branch protection required status checks are configured, or an owner-approved
exception is documented.
- `CHANGELOG.md` has a dated `v1.0.0` entry, or an owner-approved date exception
is documented.
- Package metadata timing for `repository`, `homepage`, and `bugs` fields is
resolved without placeholder public URLs.
- Public docs do not include placeholder repository URLs, security contacts,
release dates, maintainer handles.

Track decisions in
[Pre-public owner decisions](docs/PRE_PUBLIC_OWNER_DECISIONS.md).

## Owner-Controlled Decisions

Maintainers should not include placeholder values for:

- Final public GitHub organization.
- Final repository name.
- Final public repository URL.
- Private security reporting path.
- Branch protection required checks.
- Changelog release date.
- Maintainer GitHub handles.
- CODEOWNERS ownership boundaries.

Use [Pre-public owner decisions](docs/PRE_PUBLIC_OWNER_DECISIONS.md) to track
what is unresolved, explicitly deferred, or owner-approved.

## Security Routing

Maintainers should route security-sensitive reports privately until the project
owner chooses the public security reporting path.

Do not discuss sensitive findings in public issues or public pull requests.

Sensitive findings include:

- OAuth token, refresh token, authorization code, API key, client secret, or
encryption-key exposure.
- Token reference exposure.
- Raw callback payload exposure.
- Raw provider response exposure.
- Debug-page or production-safety bypasses.
- Issues that could help bypass OAuth state validation, token encryption, rate
limiting, production debug blocking, or audit-log redaction.

## Release-Candidate Review

Before approving a release-candidate commit, confirm:

- The change supports release preparation, not new product capability.
- The change preserves compatibility-sensitive names unless an approved migration
plan is linked.
- The change strengthens ConnectOS as neutral infrastructure for AI applications.
- The change does not invent owner-controlled values.
- `pnpm release:check` passed locally.
- `v1 Release Quality Gates` passes on the release-candidate commit.
- Any unresolved owner-controlled blockers are recorded before release approval.

Do not tag or publish `v1.0.0` by inventing names, teams, dates, URLs,
placeholder ownership, or placeholder support paths.

## CODEOWNERS Timing

Do not add `.github/CODEOWNERS` placeholder handles.

Only add CODEOWNERS after the project owner confirms:

- Real maintainer GitHub handles.
- Ownership boundaries.
- Whether CODEOWNERS should ship in public v1.0.

Until then, the [contributing guide](CONTRIBUTING.md) and this maintainer guide
define review expectations.

## Release Wording Guardrails

These statements should remain stable so release-preparation checks catch
accidental drift in maintainer guidance:

- ConnectOS is neutral open-source infrastructure for AI applications.
- CODEOWNERS
- GitHub private vulnerability reporting
- Another owner-approved private security contact.
- Do not add `.github/CODEOWNERS` placeholder handles.
- Public docs do not include placeholder repository URLs, security contacts, release dates, maintainer handles.
- sensitive findings
- Final repository name
- Package metadata timing for `repository`, `homepage`, and `bugs` fields.
