# End-of-Session Transfer

## Repository

Repository root for the current ConnectOS checkout.

## Current Mode

ConnectOS v1.0 release preparation. Release-prep only. Do not add new
architecture, providers, connectors, Capabilities, Actions, Skills, Recipes,
APIs, databases, product features, or product-specific workflows unless
explicitly approved.

## Current Release Status

- Platform foundation is complete enough for release-candidate review.
- Local release gates passed after the latest release-prep cleanup.
- Public docs position ConnectOS as neutral open-source infrastructure for AI
  applications.
- Public v1.0 still depends on owner-controlled decisions release-prep agents
  should not guess.
- The current handoff path is
  `docs/CONNECTOS_V1_RELEASE_STATUS.md` ->
  `docs/PRE_PUBLIC_OWNER_DECISIONS.md#owner-response-template`.
- Final public release still needs owner approval or explicit deferral for the
  public GitHub home, security reporting, branch protection, package metadata
  timing, changelog date, maintainer handles, CODEOWNERS timing, and Code of
  Conduct timing.
- Release-prep artifacts remain broadly dirty and untracked in the current
  worktree; latest release hygiene check reported 124 changed paths.
- Final release-candidate staging should include only intentional
  release-preparation files.

## Latest Completed Task

Support guide polish.

## What Changed

- Polished `SUPPORT.md` so public contributors get clearer paths for
  questions, bug reports, security routing, and release-preparation support.
- Clarified that security reports must avoid public issues and public pull
  requests until the owner selects GitHub private vulnerability reporting or
  another private contact.
- Clarified release-prep support boundaries, verification commands,
  compatibility-sensitive names, and owner-controlled support details.
- Preserved required local commands, compatibility-sensitive names, release
  guardrails, and neutral ConnectOS positioning.
- Preserved release-prep scope: no new platform capabilities, providers,
  connectors, APIs, databases, Actions, Skills, Recipes, product features, or
  product-specific workflows.
- Preserved compatibility-sensitive names that must not be renamed during v1.0
  release preparation.

## Files Changed

Latest task:

- `SUPPORT.md`

Current transfer refresh:

- `docs/SESSION_TRANSFER.md`
- `docs/END_OF_SESSION_TRANSFER.md`

Recently polished release-prep docs also include:

- `README.md`
- `docs/README.md`
- `docs/CONNECTOS_V1_RELEASE_STATUS.md`
- `docs/PRE_PUBLIC_OWNER_DECISIONS.md`
- `docs/GITHUB_TEMPLATE_READINESS.md`
- `docs/RELEASE_CANDIDATE_STAGING_CHECKLIST.md`
- `docs/prompts/QUICK_CONNECTOS_RELEASE_STATUS.md`
- `docs/PACKAGE_METADATA_AUDIT.md`
- `docs/GITHUB_RELEASE_SETUP.md`
- `docs/V1_RELEASE_READINESS_AUDIT.md`
- `docs/RELEASE_CANDIDATE_READINESS.md`
- `docs/RELEASE_STAGING_PLAN.md`
- `docs/RELEASE_CANDIDATE_CHANGE_GROUPING.md`
- `docs/PRE_RELEASE_CHANGE_INVENTORY.md`
- `docs/RELEASE_CHECKLIST.md`

## Verification Passed

Latest completed release-prep work passed:

```bash
pnpm release:check
```

`pnpm release-docs:check` currently reports 40 guarded release documents.

`pnpm release:check` includes:

- `pnpm release-docs:check`
- `pnpm release-metadata:check`
- `pnpm release-hygiene:check`
- `pnpm test`
- `pnpm lint`
- `pnpm typecheck`
- `pnpm prisma:validate`
- `pnpm build`

## Compatibility Names To Preserve

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

## Remaining Owner-Controlled Decisions

Do not guess values:

- Final public GitHub organization, repository name, and repository URL.
- Private security reporting path.
- Branch protection and required status checks.
- Package metadata timing for `repository`, `homepage`, and `bugs` fields.
- Changelog v1.0.0 release date.
- Maintainer handles and CODEOWNERS timing.
- Code of Conduct timing.

## Recommended Next Task

Resolve Pre-Public Owner Decisions: fill out the Owner Response Template in
`docs/PRE_PUBLIC_OWNER_DECISIONS.md#owner-response-template`, then update only
the affected release files based on those approved answers.

## Release-Check Guardrails

Exact statements preserved so release-preparation checks catch accidental drift
in end-of-session transfer guidance:

- # End-of-Session Transfer
- ConnectOS v1.0 release preparation
- Release-prep only.
- Do not add new architecture, providers, connectors, Capabilities, Actions,
- ## Current Release Status
- ## Latest Completed Task
- ## Verification Passed
- pnpm release:check
- ## Compatibility Names To Preserve
- connect-core-token:v1
- universal_actions
- ## Recommended Next Task
