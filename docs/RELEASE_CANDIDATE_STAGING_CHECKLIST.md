# Release-Candidate Staging Checklist

This checklist maps the current broad release-preparation worktree into reviewer-focused groups before a v1.0 release-candidate commit. It is not release approval, and it is not a feature plan.

Current snapshot: `git status --porcelain=v1 --untracked-files=all` reported 124 changed paths during the July 21, 2026 release-preparation pass. Do not treat this number as permanent. Refresh the evidence before final staging because the worktree can change during release preparation.

## Required Fresh Evidence

Run before staging:

```bash
git status --short --untracked-files=all
git diff --stat
pnpm release-hygiene:check
```

Do not stage until the fresh snapshot confirms:

- Every changed path supports release preparation.
- No generated output, local-only files, logs, local databases, secrets, raw callback payloads, raw provider responses, OAuth tokens, or API keys are included.
- Every staged path maps to one review group below.
- Compatibility-sensitive names remain preserved.
- Owner-controlled public release values are not guessed.

## Staging Groups

Stage in reviewer-focused groups, not one undifferentiated commit.

| Stage | Review group | Current snapshot count | Primary path patterns |
| --- | --- | ---: | --- |
| 1 | Public Release Docs | 25 | `README.md`, `CHANGELOG.md`, `CONTRIBUTING.md`, `FOUNDING_PRINCIPLES.md`, `SECURITY.md`, `SUPPORT.md`, `MAINTAINERS.md`, `LICENSE`, `docs/README.md`, `docs/CONNECTOS.md`, release-preparation docs |
| 2 | Platform Setup Docs | 14 | `apps/web/.env.example`, `docs/ENVIRONMENT.md`, `docs/PRODUCTION_CHECKLIST.md`, provider setup docs, connector/action/skill docs, connector manifest examples |
| 3 | GitHub Templates And CI | 5 | `.github/ISSUE_TEMPLATE/`, `.github/PULL_REQUEST_TEMPLATE.md`, `.github/workflows/ci.yml` |
| 4 | Demo And Public UI Copy | 9 | `apps/web/app/connect-core/`, `apps/web/components/connect-core/`, app shell copy, global styles, icon |
| 5 | Platform Code And Tests | 36 | `apps/web/app/api/connect-core/`, `apps/web/lib/`, `apps/web/prisma/schema.prisma`, `apps/web/scripts/seed-connect-core.ts`, `packages/connect-core/`, provider/repository/security tests |
| 6 | Tooling And Package Metadata | 25 | Root and workspace package manifests, root and app lint config, workspace config, lockfile, release-check scripts |
| 7 | Historical Reference Docs | 10 | `SPEC.md`, `tasks/`, `docs/decisions/`, archived Gmail/MVP/observability/connector-roadmap notes |

If a path does not fit one of these groups, stop and classify it before staging. Do not hide miscellaneous files inside a larger review group.

## Per-Group Review Checks

For each group, confirm:

- The change is release preparation only.
- Public language positions ConnectOS as neutral infrastructure for AI applications.
- No product-specific business logic is introduced.
- No new architecture, providers, connectors, Capabilities, Actions, Skills, Recipes, APIs, databases, or product features are introduced.
- No compatibility-sensitive route, package name, token prefix, environment variable, or schema field is renamed.
- Secrets and token material are absent.

## Final Gate

After staging review groups, but before creating the release-candidate commit, run:

```bash
pnpm release:check
```

After the release-candidate commit exists, run `ConnectOS CI` and confirm the `v1 Release Quality Gates` job passes before tagging `v1.0.0`.
