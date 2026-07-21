# Quick ConnectOS Release Status Prompts

Use these prompts to run release-readiness checks without starting implementation work. They are for status audits only.

## Version 1 - Fast Copy-And-Paste Check

```md
Audit the current ConnectOS repository against the official v1.0 release-preparation status in `docs/CONNECTOS_V1_RELEASE_STATUS.md`.

This is a status check only. Do not build features. Do not fix issues. Do not expand scope. Do not change architecture. Do not edit files. Do not begin another release-prep task.

Inspect changes since the last audit.

Read current release-prep sources:

- `README.md`
- `CONTRIBUTING.md`
- `SECURITY.md`
- `SUPPORT.md`
- `FOUNDING_PRINCIPLES.md`
- `CHANGELOG.md`
- `docs/README.md`
- `docs/CONNECTOS_V1_RELEASE_STATUS.md`
- `docs/RELEASE_CHECKLIST.md`
- `docs/RELEASE_CANDIDATE_READINESS.md`
- `docs/V1_RELEASE_READINESS_AUDIT.md`
- `docs/PRE_PUBLIC_OWNER_DECISIONS.md`
- `docs/PRE_RELEASE_CHANGE_INVENTORY.md`
- `docs/RELEASE_CANDIDATE_CHANGE_GROUPING.md`
- `docs/RELEASE_CANDIDATE_STAGING_CHECKLIST.md`
- `docs/RELEASE_STAGING_PLAN.md`
- `docs/PACKAGE_METADATA_AUDIT.md`
- `docs/GITHUB_RELEASE_SETUP.md`
- `docs/GITHUB_TEMPLATE_READINESS.md`
- `docs/SESSION_TRANSFER.md`
- `docs/END_OF_SESSION_TRANSFER.md`

Run repository verification:

- `git status --short --untracked-files=all`
- `git diff --stat`
- `pnpm release-docs:check`
- `pnpm release-metadata:check`
- `pnpm release-hygiene:check`
- `pnpm test`
- `pnpm lint`
- `pnpm typecheck`
- `pnpm prisma:validate`
- `pnpm build`
- `pnpm release:check`

Return only:

1. Current release status.
2. Passing verification.
3. Owner-controlled blockers.
4. Highest-risk unresolved release-prep concern.
```

## Version 2 - Full Evidence Audit

```md
Run a full evidence audit for ConnectOS v1.0 release preparation.

This is a status-only audit. Do not build features. Do not fix issues. Do not expand scope. Do not change architecture. Do not edit files. Do not begin another release-prep task.

Forbidden actions:

- add providers
- add connectors
- add Capabilities
- add Actions
- add Skills
- add Recipes
- add APIs
- add databases

Steps:

1. Read official v1.0 status in `docs/CONNECTOS_V1_RELEASE_STATUS.md`.
2. Read release checklist in `docs/RELEASE_CHECKLIST.md`.
3. Read release-candidate readiness in `docs/RELEASE_CANDIDATE_READINESS.md`.
4. Read evidence audit in `docs/V1_RELEASE_READINESS_AUDIT.md`.
5. Read owner-controlled blockers in `docs/PRE_PUBLIC_OWNER_DECISIONS.md`.
6. Read release staging inventory docs:
   - `docs/PRE_RELEASE_CHANGE_INVENTORY.md`
   - `docs/RELEASE_CANDIDATE_CHANGE_GROUPING.md`
   - `docs/RELEASE_CANDIDATE_STAGING_CHECKLIST.md`
   - `docs/RELEASE_STAGING_PLAN.md`
   - `docs/PACKAGE_METADATA_AUDIT.md`
   - `docs/GITHUB_RELEASE_SETUP.md`
   - `docs/GITHUB_TEMPLATE_READINESS.md`
7. Read transfer docs:
   - `docs/SESSION_TRANSFER.md`
   - `docs/END_OF_SESSION_TRANSFER.md`
8. Review Git changes since the last audit:
   - `git status --short --untracked-files=all`
   - `git diff --stat`
9. Inspect changed code and documentation directly.
10. Recheck neutral ConnectOS positioning.
11. Recheck product-specific origin references and product-specific language.
12. Recheck README setup commands and 30-second first impression.
13. Recheck contributor experience and GitHub readiness.
14. Recheck release-candidate staging risk:
   - broad dirty/untracked worktree
   - changed paths mapped to documented review groups
   - no generated/local-only files
   - no logs, databases, secrets, OAuth tokens, raw callback payloads, or raw provider responses
15. Recheck owner-controlled blockers:
   - final public GitHub organization, repository name, and repository URL
   - private security reporting path
   - branch protection and required status checks
   - package metadata timing for `repository`, `homepage`, and `bugs` fields
   - changelog v1.0.0 release date
   - maintainer handles and CODEOWNERS timing
   - Code of Conduct timing
16. Run `pnpm release:check`.

Return:

- Current release status.
- Evidence used.
- Passing checks.
- Failing or missing checks.
- Owner-controlled blockers.
- Compatibility-sensitive names still preserved.
- Highest-risk unresolved release-prep concern.
- The single highest-value next release-prep task.

Never mark an area release ready based only on documentation claims. Require file evidence, command output, or repository/GitHub state.
```

## Version 3 - Owner Decision Check

```md
Audit only owner-controlled decisions blocking public ConnectOS v1.0.

Do not build features. Do not fix issues. Do not edit files. Do not guess owner-controlled values.

Read:

- `docs/PRE_PUBLIC_OWNER_DECISIONS.md`
- `docs/RELEASE_CHECKLIST.md`
- `docs/GITHUB_RELEASE_SETUP.md`
- `docs/PACKAGE_METADATA_AUDIT.md`
- `docs/V1_RELEASE_READINESS_AUDIT.md`
- `docs/CONNECTOS_V1_RELEASE_STATUS.md`
- `docs/RELEASE_CANDIDATE_STAGING_CHECKLIST.md`

Check owner-controlled decisions:

1. Final public GitHub organization, repository name, and repository URL.
2. Private security reporting path.
3. Branch protection and required status checks.
4. Package metadata timing for `repository`, `homepage`, and `bugs` fields.
5. Changelog v1.0.0 release date.
6. Maintainer handles and CODEOWNERS timing.
7. Code of Conduct timing.

For each item, cite the file or external setting that proves current status. If evidence is missing or indirect, mark the item unresolved.
```

## Release-Check Guardrails

Exact statements preserved so release-preparation checks catch accidental drift in quick status prompts:

- docs/CONNECTOS_V1_RELEASE_STATUS.md
- Do not build features
- add providers
- add connectors
- add Capabilities
- add Actions
- add Skills
- add Recipes
- add APIs
- add databases
- pnpm release:check
- single highest-value next release-prep task
- Never mark an area release ready based only on documentation claims
