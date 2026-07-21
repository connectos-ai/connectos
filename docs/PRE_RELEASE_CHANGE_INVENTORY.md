# ConnectOS Pre-Release Change Inventory

This inventory is not release approval and does not replace the release checklist. Use it to help reviewers map the v1.0 release-preparation worktree into the first release-candidate commit.

Release-candidate change grouping should help maintainers confirm that every changed file supports release preparation and that the release remains focused on coherence, trust, documentation quality, compatibility, contributor experience, and GitHub readiness.

Authoritative references:

- [Release checklist](RELEASE_CHECKLIST.md)
- [Release-candidate staging checklist](RELEASE_CANDIDATE_STAGING_CHECKLIST.md)
- [Release-candidate change grouping](RELEASE_CANDIDATE_CHANGE_GROUPING.md)
- [Release staging plan](RELEASE_STAGING_PLAN.md)
- [Release-candidate readiness](RELEASE_CANDIDATE_READINESS.md)
- [V1 release readiness audit](V1_RELEASE_READINESS_AUDIT.md)
- [Pre-public owner decisions](PRE_PUBLIC_OWNER_DECISIONS.md)
- [Package metadata audit](PACKAGE_METADATA_AUDIT.md)
- [Session transfer handoff](SESSION_TRANSFER.md)

## Snapshot Guidance

Expect a broad release-preparation worktree before the first release-candidate commit. Public docs, GitHub templates, package metadata, tests, demo surfaces, tooling, and existing ConnectOS platform files may appear together during cleanup.

The July 21, 2026 release-preparation snapshot reported 124 changed paths. Do not treat that count as permanent.

Collect a fresh snapshot with:

```bash
git status --short --untracked-files=all
git diff --stat
pnpm release-hygiene:check
```

Use the snapshot to answer:

- Which files changed?
- Does each changed file support a release-preparation concern?
- Does any changed file look unrelated to release preparation?
- Does any changed file contain generated output, local secrets, logs, databases, machine-local state, raw callback payloads, raw provider responses, OAuth tokens, API keys, or other secret-bearing output?

Do not treat earlier changed-path counts as release facts. Do not treat earlier changed-path counts release facts. Refresh the snapshot before cutting the release-candidate commit.

Do not commit generated or local-only artifacts:

- `.next/`
- `node_modules/`
- `*.tsbuildinfo`
- Local databases.
- Local environment files.
- Logs.
- Machine-local files.
- OAuth tokens.
- Raw provider payloads.
- Screenshots or debug output containing secrets.

## Review Order

Review release-preparation changes in this order so maintainers can separate public release-quality work from compatibility-sensitive implementation details.

### 1. Public Release Docs

Primary paths:

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
- `docs/RELEASE_CHECKLIST.md`
- `docs/RELEASE_CANDIDATE_READINESS.md`
- `docs/RELEASE_CANDIDATE_STAGING_CHECKLIST.md`
- `docs/RELEASE_CANDIDATE_CHANGE_GROUPING.md`
- `docs/RELEASE_STAGING_PLAN.md`
- `docs/GITHUB_RELEASE_SETUP.md`
- `docs/CONNECTOS_V1_RELEASE_STATUS.md`
- `docs/V1_RELEASE_READINESS_AUDIT.md`
- `docs/PRE_PUBLIC_OWNER_DECISIONS.md`
- `docs/PRE_RELEASE_CHANGE_INVENTORY.md`
- `docs/PACKAGE_METADATA_AUDIT.md`
- `docs/SESSION_TRANSFER.md`
- `docs/END_OF_SESSION_TRANSFER.md`
- `docs/prompts/QUICK_CONNECTOS_RELEASE_STATUS.md`

Review focus:

- Public docs position ConnectOS as neutral open-source infrastructure for AI applications.
- Public docs explain AI applications should reason about intent, not provider APIs.
- Owner-controlled release details remain undecided unless the project owner has explicitly decided them.
- Product-specific origin stories, product-specific business logic, and vertical-specific assumptions are absent.

### 2. Platform Setup Docs

Primary paths:

- `apps/web/.env.example`
- `docs/ENVIRONMENT.md`
- `docs/PRODUCTION_CHECKLIST.md`
- `docs/GOOGLE_OAUTH_SETUP.md`
- `docs/SLACK_OAUTH_SETUP.md`
- `docs/COMPOSIO_SETUP.md`
- `docs/CONNECTOR_DEVELOPMENT.md`
- `docs/CONNECTION_INTELLIGENCE.md`
- `docs/UNIVERSAL_ACTIONS.md`
- `docs/AI_SKILLS.md`
- `docs/STARTER_KITS.md`
- `docs/ROADMAP.md`
- `docs/connectors/manifest.example.json`
- `docs/connectors/manifest.example.yaml`

Review focus:

- Setup steps are clear enough for a first-time developer.
- Examples use placeholders, not real credentials.
- Real OAuth setup docs do not expose tokens or client secrets.
- Docs preserve the current compatibility names until an approved migration exists.

### 3. GitHub Templates And CI

Primary paths:

- `.github/ISSUE_TEMPLATE/bug_report.md`
- `.github/ISSUE_TEMPLATE/config.yml`
- `.github/ISSUE_TEMPLATE/release_prep.md`
- `.github/PULL_REQUEST_TEMPLATE.md`
- `.github/workflows/ci.yml`

Review focus:

- Contributor templates describe v1 release-prep scope clearly.
- Security reports route away from public issues and public pull requests.
- CI runs `pnpm release:check`.
- Branch protection can target `ConnectOS CI / v1 Release Quality Gates`.
- No placeholder GitHub URLs, security contacts, or maintainer handles are introduced.

### 4. Demo And Public UI Copy

Primary paths:

- `apps/web/app/connect-core/`
- `apps/web/components/connect-core/`
- `apps/web/app/globals.css`
- `apps/web/app/layout.tsx`
- `apps/web/app/icon.svg`

Review focus:

- Demo copy uses neutral ConnectOS language.
- Compatibility-sensitive `/connect-core` routes remain preserved.
- `/connect-core/debug` remains blocked in production.
- Demo copy does not introduce product-specific positioning or new product capability.

### 5. Platform Code And Tests

Primary paths:

- `apps/web/app/api/connect-core/`
- `apps/web/lib/`
- `apps/web/prisma/schema.prisma`
- `apps/web/scripts/seed-connect-core.ts`
- `packages/connect-core/`
- Provider, repository, security, capability, action, and skill tests.

Review focus:

- Existing behavior remains covered by tests.
- Security guardrails remain intact.
- OAuth tokens, refresh tokens, API keys, client secrets, encryption keys, token references, raw callback payloads, and raw provider responses are not exposed.
- Existing compatibility-sensitive names are preserved.
- No new provider, connector, Capability, Action, Skill, Recipe, API, database, architecture, product feature, or product-specific workflow is added without explicit approval.

### 6. Tooling And Package Metadata

Primary paths:

- `.gitignore`
- `package.json`
- `apps/web/package.json`
- `apps/web/eslint.config.mjs`
- `eslint.config.mjs`
- `pnpm-workspace.yaml`
- `pnpm-lock.yaml`
- `packages/*/package.json`
- `scripts/check-package-metadata.mjs`
- `scripts/check-release-docs.mjs`
- `scripts/check-release-hygiene.mjs`
- `scripts/manual-google-oauth-check.sh`
- `scripts/manual-slack-oauth-check.sh`

Review focus:

- `pnpm release:check` remains the documented full local release gate.
- Package metadata remains neutral, private, MIT-licensed, attributed to ConnectOS contributors, and free of placeholder public repository URLs until owner decisions are resolved.
- Release checker scripts enforce public-doc, metadata, and hygiene guardrails.
- Tooling changes do not introduce new product scope.

### 7. Historical Reference Docs

Primary paths:

- `SPEC.md`
- `tasks/plan.md`
- `tasks/todo.md`
- `docs/decisions/`
- `docs/gmail-local-oauth.md`
- `docs/mvp-ship-readiness.md`
- `docs/observability.md`
- `docs/connectors/roadmap.md`

Review focus:

- Historical docs remain useful context, not current release instructions.
- Historical docs do not expand v1.0 release scope.
- Current release docs are linked where they supersede older notes.

### 8. Setup Examples And Manifests

Primary paths:

- `docs/connectors/manifest.example.json`
- `docs/connectors/manifest.example.yaml`
- Manual Google and Slack verification scripts.
- Starter kit and connector development examples.

Review focus:

- Examples are safe to publish.
- Example values are placeholders.
- Examples do not imply unapproved v1.0 features.
- Manifest examples match the documented connector manifest format.

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

## Required Verification

Run the release documentation guardrail:

```bash
pnpm release-docs:check
```

Run the release metadata guardrail:

```bash
pnpm release-metadata:check
```

Run the release hygiene guardrail:

```bash
pnpm release-hygiene:check
```

Run the full release gate:

```bash
pnpm release:check
```

After tagging preparation, run the `ConnectOS CI` workflow on the release-candidate commit and confirm the `v1 Release Quality Gates` job passes.

## Final Reviewer Questions

Use these questions when turning the worktree into a release-candidate commit:

- Does every changed file support release preparation?
- Does each changed file fit one review-order category above?
- Are generated output, local-only files, logs, databases, secrets, raw callback payloads, raw provider responses, OAuth tokens, and API keys excluded?
- Are owner-controlled values still unresolved unless the project owner explicitly decided them?

Final Reviewer Questions are release-candidate blockers until each answer is backed by fresh evidence.
