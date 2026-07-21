# ConnectOS Release-Candidate Readiness

This document is a maintainer handoff aid. It is not release approval and not a feature plan.

Use the [Release checklist](RELEASE_CHECKLIST.md) as the authoritative release flow. Track owner-controlled release blockers in [Pre-public owner decisions](PRE_PUBLIC_OWNER_DECISIONS.md).

Do not tag or publish `v1.0.0` until owner-controlled decisions are resolved or explicit pre-public exceptions are documented.

## Current Assessment

ConnectOS is close to release-candidate review. The platform foundation, release documentation, GitHub templates, CI definition, package metadata baseline, compatibility notes, and demo surfaces are in place.

Remaining work is release discipline, not new product capability.

## Ready For Release-Candidate Review

Release-candidate review may begin when maintainers have collected concrete evidence for each item:

| Requirement | Evidence to collect |
| --- | --- |
| Documentation guardrails pass | `pnpm release-docs:check` |
| Full local release gate passes | `pnpm release:check` |
| CI release gate passes | `ConnectOS CI` with `v1 Release Quality Gates` passing |
| Public release blockers are tracked | [Pre-public owner decisions](PRE_PUBLIC_OWNER_DECISIONS.md) is current |
| Release scope is stable | No new architecture, providers, connectors, Capabilities, Actions, Skills, Recipes, APIs, databases, product features, or product-specific business logic |
| Release candidate is clean | Working tree contains only intentional release-preparation changes |
| Staging has been reviewed | Changed paths map to review groups in [Release-candidate staging checklist](RELEASE_CANDIDATE_STAGING_CHECKLIST.md) |

## Not Yet Ready For Public v1.0

Owner-controlled decisions must be resolved or explicitly excepted before public v1.0:

- Final public GitHub organization, repository name, and repository URL.
- Private security reporting path.
- Branch protection required status checks.
- Package metadata timing for `repository`, `homepage`, and `bugs` fields.
- Changelog release date or owner-approved exception.
- Maintainer handles and `.github/CODEOWNERS` timing.
- Code of Conduct timing.

## Compatibility-Sensitive Names

Names remain intentionally preserved during v1.0 release preparation:

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

## Required Local Verification

Install dependencies:

```bash
pnpm install
```

Start the local demo for release-candidate UI smoke testing:

```bash
pnpm --filter @connect-any-inbox/web dev -- -p 3033
```

Then open:

```text
http://localhost:3033/connect-core
```

Run the documentation gate:

```bash
pnpm release-docs:check
```

Run the full local release gate before creating the release-candidate commit:

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

Any required gate failure blocks the release candidate.

## Required CI Verification

Before public publication:

1. Create a release-candidate commit containing only intentional release-preparation changes.
2. Run the `ConnectOS CI` workflow on that commit.
3. Confirm the `v1 Release Quality Gates` job passes.
4. Confirm repository branch protection selects the release gate, or document an owner-approved exception.

GitHub may display the required branch-protection status check as:

```text
ConnectOS CI / v1 Release Quality Gates
```

## Release Recommendation

Proceed to release-candidate review only when:

- Local release gates pass.
- CI release gates pass.
- Owner-controlled blockers are resolved or explicitly excepted.
- The release candidate contains only release-preparation work.

Do not use release-candidate readiness work to add providers, connectors, Capabilities, Actions, Skills, Recipes, APIs, databases, architecture, product features, or product-specific business logic.

## Release Wording Guardrails

Exact statements preserved so release-preparation checks catch accidental drift in release-candidate readiness guidance:

- maintainer handoff aid. It is not release approval and not a feature plan
- Final public GitHub organization, repository name, and repository URL.
- Do not tag or publish `v1.0.0` until owner-controlled decisions are resolved or explicit pre-public exceptions are documented.
- Private security reporting path.
- Branch protection required status checks.
- Future renames require an approved compatibility-preserving migration plan.
- connect-core-token:v1
- universal_actions
- pnpm release-docs:check
- pnpm release:check
- ConnectOS CI
- v1 Release Quality Gates
