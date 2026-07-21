# ConnectOS Release Staging Plan

This staging plan helps maintainers turn the v1.0 release-preparation worktree into coherent review commits. It is not release approval and not a feature plan.

Use this plan with:

- [Release-candidate staging checklist](RELEASE_CANDIDATE_STAGING_CHECKLIST.md)
- [Release-candidate change grouping](RELEASE_CANDIDATE_CHANGE_GROUPING.md)
- [Pre-release change inventory](PRE_RELEASE_CHANGE_INVENTORY.md)
- [Release-candidate readiness](RELEASE_CANDIDATE_READINESS.md)
- [Release checklist](RELEASE_CHECKLIST.md)

## Scope

Refresh the changed-path snapshot before final staging:

```bash
git status --short --untracked-files=all
git diff --stat
pnpm release-hygiene:check
```

Do not treat earlier changed-path counts as release facts. Do not treat earlier changed-path counts release facts. The working tree can change during release preparation, and `pnpm release-hygiene:check` scans both tracked files and current changed untracked paths.

Release staging must preserve these boundaries:

- No new architecture, providers, connectors, Capabilities, Actions, Skills,
  Recipes, APIs, databases, product features, or product-specific workflows.
- No guessed owner-controlled release values.
- No generated output, local secrets, logs, machine-local files, raw callback
  payloads, raw provider responses, or OAuth tokens.
- No compatibility-sensitive renames without an approved compatibility-preserving migration plan.

## Staging Principles

Stage review commits by reviewer concern, not file extension alone:

- Keep public release docs separate from platform runtime changes.
- Keep GitHub templates and CI separate from application code.
- Keep package metadata and release-check tooling together.
- Keep historical reference docs separate from current release instructions.
- Keep setup examples and manifests separate from security-sensitive runtime changes.
- Re-run relevant checks after each staging pass.

Before cutting the release-candidate commit, run:

```bash
pnpm release:check
```

## Proposed Review Stages

### 1. Public Release Docs

Purpose: make ConnectOS understandable, neutral, and contributor-ready.

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
- Current release-preparation docs.

Review checks:

- Public docs describe ConnectOS as neutral infrastructure for AI applications.
- Public docs do not introduce product-specific business logic.
- Owner-controlled values remain deferred instead of guessed.
- Release docs agree on required local and CI gates.

### 2. Platform Setup Docs

Purpose: make local setup, provider configuration, production safety, and release environment requirements understandable without expanding v1.0 scope.

Representative paths:

- `apps/web/.env.example`
- `docs/ENVIRONMENT.md`
- `docs/PRODUCTION_CHECKLIST.md`
- `docs/GITHUB_RELEASE_SETUP.md`
- `docs/GOOGLE_OAUTH_SETUP.md`
- `docs/SLACK_OAUTH_SETUP.md`
- `docs/COMPOSIO_SETUP.md`
- `docs/CONNECTOR_DEVELOPMENT.md`
- `docs/CONNECTION_INTELLIGENCE.md`
- `docs/UNIVERSAL_ACTIONS.md`
- `docs/AI_SKILLS.md`
- `docs/STARTER_KITS.md`
- Connector manifest examples.

Review checks:

- Setup docs are clear for new contributors.
- Secret handling is explicit and conservative.
- Provider boundaries remain documented without new provider scope.
- Examples use placeholders, not real credentials.

### 3. GitHub Templates And CI

Purpose: make public contribution intake and release verification predictable.

Representative paths:

- `.github/ISSUE_TEMPLATE/bug_report.md`
- `.github/ISSUE_TEMPLATE/config.yml`
- `.github/ISSUE_TEMPLATE/release_prep.md`
- `.github/PULL_REQUEST_TEMPLATE.md`
- `.github/workflows/ci.yml`

Review checks:

- Issue templates and pull request templates set contributor expectations.
- Security reports route away from public issues and public pull requests.
- CI runs the same `pnpm release:check` gate contributors run locally.
- Branch protection can require `ConnectOS CI / v1 Release Quality Gates`.

### 4. Demo And Public UI Copy

Purpose: make the existing demo feel neutral, polished, and compatible.

Representative paths:

- `apps/web/app/connect-core/`
- `apps/web/components/connect-core/`
- `apps/web/app/globals.css`
- `apps/web/app/layout.tsx`
- `apps/web/app/icon.svg`

Review checks:

- Demo copy positions ConnectOS as neutral infrastructure.
- `/connect-core` remains preserved as a compatibility-sensitive route.
- `/connect-core/debug` remains blocked in production.
- UI polish does not add platform capability.

### 5. Platform Code And Tests

Purpose: verify existing ConnectOS runtime behavior and release hardening.

Representative paths:

- `apps/web/app/api/connect-core/`
- `apps/web/lib/`
- `apps/web/prisma/schema.prisma`
- `apps/web/scripts/seed-connect-core.ts`
- `packages/connect-core/`
- Provider, repository, security, capability, action, and skill tests.

Review checks:

- Existing behavior remains covered by tests.
- Security guardrails remain intact.
- OAuth tokens, refresh tokens, API keys, client secrets, encryption keys, token references, raw callback payloads, and raw provider responses are not logged or exposed.
- Compatibility-sensitive names remain preserved.
- No new provider, connector, Capability, Action, Skill, Recipe, API, database, architecture, product feature, or product-specific workflow is added without explicit approval.

### 6. Tooling And Package Metadata

Purpose: keep package metadata neutral and release gates reproducible.

Representative paths:

- `.gitignore`
- `package.json`
- `apps/web/package.json`
- `apps/web/eslint.config.mjs`
- `eslint.config.mjs`
- `pnpm-workspace.yaml`
- `pnpm-lock.yaml`
- `packages/*/package.json`
- `scripts/check-release-docs.mjs`
- `scripts/check-package-metadata.mjs`
- `scripts/check-release-hygiene.mjs`

Review checks:

- Package metadata stays neutral, private, MIT-licensed, and free of placeholder public repository URLs.
- Release-check scripts strengthen the release gate.
- Tooling changes do not introduce new product scope.

### 7. Historical Reference Docs

Purpose: preserve historical context while preventing older plans from expanding v1.0 scope.

Representative paths:

- `SPEC.md`
- `tasks/plan.md`
- `tasks/todo.md`
- `docs/decisions/`
- `docs/gmail-local-oauth.md`
- `docs/mvp-ship-readiness.md`
- `docs/observability.md`
- `docs/connectors/roadmap.md`

Review checks:

- Historical docs clearly distinguish archived context from current release instructions.
- Historical docs do not create new v1.0 commitments.
- Current release docs are linked where they supersede older notes.

### 8. Setup Examples And Manifests

Purpose: keep examples useful without leaking secrets or implying unapproved v1.0 scope.

Representative paths:

- `docs/connectors/manifest.example.json`
- `docs/connectors/manifest.example.yaml`
- Manual Google and Slack verification scripts.
- Starter kit and connector development examples.

Review checks:

- Examples use placeholders, not real secrets.
- Example manifests validate where validation exists.
- Example copy avoids product-specific positioning.
- Examples do not imply unapproved v1.0 features.

## Required Final Gate

Run release hygiene before staging:

```bash
pnpm release-hygiene:check
```

Run the full release gate before cutting the release candidate:

```bash
pnpm release:check
```

Any required gate failure blocks the release candidate.

After the release-candidate commit exists, run `ConnectOS CI` and confirm `v1 Release Quality Gates` passes before tagging `v1.0.0`.

## Final Reviewer Questions

Ask these before approving the release candidate:

- Does every changed file support release preparation?
- Are any new providers, connectors, Capabilities, Actions, Skills, Recipes, APIs, databases, architecture, product features, or product-specific workflows included without explicit approval?
- Are all owner-controlled values either resolved or documented as explicit pre-public exceptions?
- Are compatibility-sensitive names preserved?
- Are generated artifacts, local secrets, logs, machine-local files, raw callback payloads, raw provider responses, and OAuth tokens excluded?
- Did `pnpm release-docs:check`, `pnpm release:check`, and `ConnectOS CI / v1 Release Quality Gates` pass?

## Release Wording Guardrails

Exact statements preserved so release-preparation checks catch accidental drift in staging guidance:

- coherent review commits
- It is not release approval and not a feature plan.
- Do not treat earlier changed-path counts as release facts.
- No new architecture, providers, connectors, Capabilities, Actions, Skills,
- Recipes, APIs, databases, product features, or product-specific workflows.
- No guessed owner-controlled release values.
- No generated output, local secrets, logs, machine-local files, raw callback
- payloads, raw provider responses, or OAuth tokens.
- Stage review commits by reviewer concern, not file extension alone:
- ### 1. Public Release Docs
- ### 2. Platform Setup Docs
- ### 3. GitHub Templates And CI
- ### 4. Demo And Public UI Copy
- ### 5. Platform Code And Tests
- ### 6. Tooling And Package Metadata
- ### 7. Historical Reference Docs
- ### 8. Setup Examples And Manifests
- ## Required Final Gate
- pnpm release-hygiene:check
- pnpm release:check
- Any required gate failure blocks the release candidate.
