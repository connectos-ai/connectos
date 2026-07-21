# ConnectOS v1.0 Release Readiness Audit

This document is a release-readiness snapshot for ConnectOS v1.0 release preparation. It is not release approval and not a feature plan.

Do not tag or publish `v1.0.0` until owner-controlled release decisions are resolved or explicit pre-public exceptions are documented.

Authoritative references:

- [Official release status](CONNECTOS_V1_RELEASE_STATUS.md)
- [Release checklist](RELEASE_CHECKLIST.md)
- [Release-candidate readiness](RELEASE_CANDIDATE_READINESS.md)
- [Release-candidate staging checklist](RELEASE_CANDIDATE_STAGING_CHECKLIST.md)
- [Release-candidate change grouping](RELEASE_CANDIDATE_CHANGE_GROUPING.md)
- [Release staging plan](RELEASE_STAGING_PLAN.md)
- [Pre-release change inventory](PRE_RELEASE_CHANGE_INVENTORY.md)
- [Pre-public owner decisions](PRE_PUBLIC_OWNER_DECISIONS.md)
- [GitHub release setup](GITHUB_RELEASE_SETUP.md)
- [Package metadata audit](PACKAGE_METADATA_AUDIT.md)

## Evidence Snapshot

### Release Scope

Current release-preparation work is limited to release quality:

- Documentation polish.
- Neutral ConnectOS positioning.
- Naming terminology consistency.
- Contributor experience.
- GitHub readiness.
- Verification of existing behavior.
- Release-candidate staging clarity.

Release-preparation work must not add:

- New architecture.
- New providers.
- New connectors.
- New Capabilities, Actions, Skills, or Recipes.
- No new APIs or databases.
- No product-specific business logic.
- New product features.

Evidence to confirm before release candidate:

- Changed files map to release-preparation concerns.
- Public docs agree on the same release scope.
- No owner-controlled value is guessed.

### Required Documentation

Required public release docs are guarded before public v1.0:

- `README.md` presents ConnectOS as neutral infrastructure for AI applications.
- `CONTRIBUTING.md`, `SECURITY.md`, `SUPPORT.md`, `MAINTAINERS.md`, and `FOUNDING_PRINCIPLES.md` are present.
- Release docs point to owner-controlled blockers instead of inventing public repository URLs, maintainer handles, release dates, or security contacts.
- `README.md` repository URLs remain deferred until the public GitHub home is chosen.

### Package Metadata

Package metadata remains release-safe until owner decisions are resolved:

- Packages remain private.
- Packages use the MIT license and ConnectOS contributor attribution.
- Public `repository`, `homepage`, and `bugs` fields remain deferred until the final public GitHub home is confirmed.
- Placeholder public repository URLs are not published.

### Compatibility

Compatibility-sensitive names remain intentionally preserved:

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

Evidence to confirm before release candidate:

- Compatibility-sensitive names remain present where required in code and docs.
- Public docs explain that future renames require an approved migration plan.
- No route, API, package scope, environment variable, token prefix, or schema field is renamed without approval.

### Verification Gates

The documentation gate is:

```bash
pnpm release-docs:check
```

The full local release gate is:

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

CI verification uses the `ConnectOS CI` workflow and its `v1 Release Quality Gates` job. GitHub may display the required branch-protection status check as:

```text
ConnectOS CI / v1 Release Quality Gates
```

## Current Release Blockers

The blockers below require owner decisions or explicit owner-approved pre-public exceptions. They are not engineering feature tasks.

### 1. Public GitHub Home

Owner decision needed:

- Final public GitHub organization.
- Final repository name.
- Final public repository URL.

Why this blocks public v1.0:

- Public docs, package metadata, contributor links, release notes, and issue templates need one canonical destination.

### 2. Security Reporting Channel

Owner decision needed:

- Enable GitHub private vulnerability reporting.
- Publish another owner-approved private security contact.
- Or document a pre-public exception.

Why this blocks public v1.0:

- Security reports should not go through public issues or public pull requests.

### 3. Branch Protection

Owner decision needed:

- Configure branch protection for `main`.
- Choose required status checks.

Why this blocks public v1.0:

- Public contributors need predictable merge rules tied to `ConnectOS CI / v1 Release Quality Gates`.

### 4. Package Metadata Timing

Owner decision needed:

- Add public `repository`, `homepage`, and `bugs` metadata after the final public GitHub home is confirmed.
- Or explicitly defer public package metadata with owner approval.

Why this blocks public v1.0:

- Placeholder metadata creates broken links for package consumers.

### 5. Changelog Date

Owner decision needed:

- Choose the v1.0.0 release date.
- Or document an owner-approved release date exception.

Why this blocks public v1.0:

- Public changelogs should not imply an unapproved release date.

### 6. Maintainer CODEOWNERS Timing

Owner decision needed:

- Confirm real maintainer handles.
- Decide whether `.github/CODEOWNERS` ships in public v1.0.

Why this blocks public v1.0:

- Placeholder CODEOWNERS entries create broken review routing.

### 7. Code Of Conduct Timing

Owner decision needed:

- Add `CODE_OF_CONDUCT.md` before public v1.0.
- Or explicitly defer standalone policy publication.

Why this blocks public v1.0:

- Public contributors need clear conduct expectations, but policy text should not be guessed by release-prep agents.

## Explicit Non-Blockers

These items may be valuable after v1.0, but should not block the first public release unless the project owner changes the release scope:

- Package scope migration away from `@connect-any-inbox/*`.
- Hosted infrastructure.
- Marketplace features.
- Additional connectors, providers, Capabilities, Actions, Skills, Skill Packs, or Recipes.
- Richer example applications.

## Recommendation

Proceed to release-candidate review when owner-controlled blockers are resolved or explicit pre-public exceptions are accepted.

Before tagging `v1.0.0`:

1. Confirm every working-tree change is intentional release-candidate work.
2. Run `pnpm release:check` locally.
3. Run `ConnectOS CI` manually on the release-candidate commit.
4. Confirm the `v1 Release Quality Gates` job passes in CI.
5. Confirm branch protection and private security reporting are configured, or owner-approved exceptions are documented.

## Release Wording Guardrails

Exact statements preserved so release-preparation checks catch accidental drift in readiness-audit guidance:

- This document is a release-readiness snapshot for ConnectOS v1.0 release
- Do not tag
- No new APIs or databases.
- No product-specific business logic.
- connect-core-token:v1
- universal_actions
- pnpm release-docs:check
- pnpm release:check
- ConnectOS CI
- v1 Release Quality Gates
- Final public GitHub organization.
- Publish another owner-approved private security contact.
- Configure branch protection for `main`.
- release date
