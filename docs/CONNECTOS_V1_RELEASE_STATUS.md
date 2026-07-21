# ConnectOS v1.0 Release Status

## Executive Summary

Recommendation: **READY FOR RELEASE-CANDIDATE REVIEW AFTER OWNER DECISIONS**.

ConnectOS is in v1.0 release preparation. The platform foundation is in good
shape, recent local release gates have passed, and public documentation
positions ConnectOS as neutral open-source infrastructure for AI applications.

Do not tag or publish public v1.0 until owner-controlled public release
decisions are resolved or explicitly deferred by the project owner.

Primary blocker: owner-controlled public release decisions.

Primary engineering risk before release-candidate staging: the broad
release-preparation worktree contains many changed and untracked files. Treat
final staging as a reviewer task, not a mechanical `git add .`.

## Current Assessment

The intended v1 platform foundation is in place:

- Provider boundary.
- Mock provider.
- Direct Google and Slack OAuth adapters.
- Composio adapter.
- Prisma and in-memory repositories.
- Token encryption and OAuth state protection.
- Connection health.
- Capabilities, Actions, and AI Skills.
- Starter Kits.
- Release documentation.
- GitHub templates.
- CI release verification scripts.

Remaining work is release preparation, not new capability.

Current release-preparation work should improve coherence, trust, documentation
quality, naming consistency, developer experience, GitHub readiness, and
backward compatibility without adding new platform features.

## Current Readiness Snapshot

| Area | Status | Notes |
| --- | --- | --- |
| Platform foundation | Ready for release-candidate review | Existing provider, connection, security, capability, action, and skill layers are in place. |
| Public docs | Ready for release-candidate review | Docs position ConnectOS as neutral open-source infrastructure for AI applications. |
| Compatibility-sensitive names | Preserved | Existing names remain documented until an approved migration exists. |
| Local release checks | Passing in recent release-prep work | Re-run before release-candidate commit or public tag. |
| Security reporting | Blocked by owner decision | Choose a private security reporting path or document an owner-approved exception. |
| Release-candidate staging | Needs focused reviewer pass | Group and verify the dirty/untracked worktree before the first public release-candidate commit. |
| Public v1.0 publication | Not ready | Owner-controlled decisions remain. |

## Owner-Controlled Public Release Decisions

These decisions belong to the project owner. Do not guess them in code, docs,
package manifests, or GitHub settings.

Use the Owner Response Template in
[Pre-public owner decisions](PRE_PUBLIC_OWNER_DECISIONS.md#owner-response-template)
to approve exact values or explicitly defer each item with an exception.

- Final public GitHub organization, repository name, and repository URL.
- Private security reporting path.
- Whether publication is allowed before private security reporting is configured.
- Branch protection and required status checks.
- Changelog `v1.0.0` release date.
- Package metadata timing for `repository`, `homepage`, and `bugs` fields.
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

## Verification Evidence

Before release-candidate review:

- `pnpm release-docs:check` passes on the final release-candidate worktree.
- `pnpm release-metadata:check` passes on the final release-candidate worktree.
- `pnpm release-hygiene:check` passes on the final release-candidate worktree.
- `pnpm release:check` passes on the final release-candidate worktree.
- The worktree contains only intentional release-preparation changes.
- Final staging is based on fresh `git status --short --untracked-files=all`,
  `git diff --stat`, and `pnpm release-hygiene:check` output.
- Every staged path maps to a documented review group in release staging docs.

Run the full local release gate:

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

CI verification should use the `ConnectOS CI` workflow and its
`v1 Release Quality Gates` job before tagging.

## Single Recommended Next Task

Task title: **Resolve Pre-Public Owner Decisions**.

Why next: implementation, documentation, local release gates, templates, and
release tooling are in good shape. Neutral public v1.0 still depends on
owner-controlled choices release-prep agents and maintainers should not guess.

Scope:

- Fill out the Owner Response Template in
  [Pre-public owner decisions](PRE_PUBLIC_OWNER_DECISIONS.md#owner-response-template).
- Choose or explicitly defer final public GitHub organization, repository name,
  and repository URL.
- Choose a private security reporting path, or approve a temporary exception.
- Decide branch protection and required status checks.
- Decide changelog release date policy.
- Decide package metadata timing.
- Decide `.github/CODEOWNERS` timing.
- Decide Code of Conduct timing.

Out of scope:

- Package scope rename.
- Route rename.
- New provider, connector, Capability, Action, Skill, Recipe, API, database,
  architecture, or product feature.

## Deferred Until After v1.0

- Package scope migration away from `@connect-any-inbox/*`.
- Hosted token vault refresh orchestration.
- Richer example apps.
- Additional connectors, providers, Skills, Skill Packs, and Recipes.

## Release Wording Guardrails

Exact statements preserved so release-preparation checks catch accidental drift
in release-status guidance:

- Recommendation: **READY FOR RELEASE-CANDIDATE REVIEW AFTER OWNER DECISIONS**
- Owner-controlled public release decisions
- neutral open-source infrastructure
- Compatibility-Sensitive Names
- `@connect-any-inbox/*`
- connect-core-token:v1
- universal_actions
- Future renames require an approved compatibility-preserving migration plan.
- pnpm release:check
- Single Recommended Next Task
- Resolve Pre-Public Owner Decisions
- Deferred Until After v1.0
