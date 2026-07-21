# GitHub Release Setup

Use this guide when preparing the public ConnectOS v1.0 repository.

Complete owner decisions in [Pre-public owner decisions](PRE_PUBLIC_OWNER_DECISIONS.md) before finalizing public GitHub metadata. Do not publish placeholder repository URLs, security contacts, branch-protection state, maintainer handles, release dates, or package metadata URLs. Do not mark owner-controlled GitHub settings complete until the repository owner has verified them in GitHub.

## Scope

This guide covers manual GitHub setup required for public v1.0. It does not change product scope, application architecture, or compatibility surfaces.

This guide does not change v1.0 release scope:

- No new architecture.
- No new providers.
- No new connectors.
- No new Capabilities, Actions, Skills, or Recipes.
- No new APIs or databases.
- No product-specific business logic.
- No new product features.

## 1. Repository Identity

Owner decisions required before public metadata is published:

- Final public GitHub organization.
- Final repository name.
- Final public repository URL.
- Final public website or documentation URL, if any.

Suggested neutral repository name, pending owner approval:

```text
connectos
```

Suggested repository description, pending owner approval:

```text
Open-source operating system for AI integrations.
```

Suggested website value until final public home is confirmed:

```text
Leave blank until final public home is confirmed.
```

Use final public URLs only after the public organization and repository are confirmed. Do not add package `repository`, `homepage`, or `bugs` fields until the final public URL is known.

## 2. Topics

Suggested GitHub topics:

- `connectos`
- `ai`
- `ai-agents`
- `integrations`
- `oauth`
- `automation`
- `skills`
- `typescript`
- `nextjs`

Avoid product-specific or vertical-specific topics in the core repository.

## 3. Repository Features

Suggested settings:

- Issues: enable only when maintainers are ready to triage public reports.
- Pull requests: enable public contribution.
- Discussions: optional; enable only when maintainers can respond consistently.
- Wiki: disable unless documentation intentionally moves there.
- Projects: optional for release planning.
- Sponsorships: optional after governance is clear.

## 4. Security Settings

Before the repository becomes public, choose and document a private security reporting channel.

Owner decisions required:

- Choose one private reporting path: GitHub private vulnerability reporting or another owner-approved private security contact.
- Confirm `SECURITY.md` points to the chosen reporting channel or documents an owner-approved pre-public exception.
- Confirm `SUPPORT.md` routes security reports away from public issues.
- Confirm issue templates warn users not to post secrets.
- Confirm `/connect-core/debug` remains blocked in production.
- Confirm screenshots, logs, examples, docs, tests, and fixtures do not contain OAuth tokens, refresh tokens, API keys, client secrets, encryption keys, token references, raw callback payloads, raw provider responses, or other secret-bearing output.

GitHub private vulnerability reporting is the preferred GitHub-native option when the repository owner enables it.

Do not route security reports through public issues or public pull requests.

## 5. Branch Protection

Branch protection is an owner-controlled repository setting. Complete it before inviting public contributors, or document an owner-approved exception.

Suggested default branch:

```text
main
```

Suggested protection settings:

- Require pull requests before merging.
- Require at least one approval.
- Require conversation resolution before merging.
- Require status checks to pass before merging.
- Require branches to be up to date before merging when practical.
- Restrict force pushes.
- Restrict deletions.

Required workflow:

```text
ConnectOS CI
```

Required job:

```text
v1 Release Quality Gates
```

GitHub may display the branch-protection status check as:

```text
ConnectOS CI / v1 Release Quality Gates
```

CI should run the same release command contributors run locally:

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

Keep manual `workflow_dispatch` runs enabled so maintainers can rerun the full quality gate before tagging a release candidate.

## 6. Templates

Confirm templates exist before public release:

- `.github/ISSUE_TEMPLATE/bug_report.md`
- `.github/ISSUE_TEMPLATE/release_prep.md`
- `.github/ISSUE_TEMPLATE/config.yml`
- `.github/PULL_REQUEST_TEMPLATE.md`

Template requirements:

- Keep ConnectOS positioned as neutral infrastructure for AI applications.
- Route security vulnerabilities away from public issues and public pull requests.
- Warn contributors not to post OAuth tokens, refresh tokens, API keys, client secrets, encryption keys, token references, raw callback payloads, raw provider responses, screenshots containing secrets, or logs containing secrets.
- Keep v1.0 release-preparation issues focused on quality, documentation, consistency, verification, and GitHub readiness.
- Preserve compatibility-sensitive names unless an approved compatibility-preserving migration plan exists.

Compatibility-sensitive names include:

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

Standard verification gate:

```bash
pnpm release:check
```

New providers, connectors, Capabilities, Actions, Skills, Recipes, APIs, databases, architecture, product features, or product-specific business logic should be deferred unless explicitly approved.

## 7. Package Metadata

Package metadata intentionally remains conservative before public v1.0.

Before publication:

- Keep package manifests private unless the owner explicitly approves publication.
- Keep MIT license attribution to ConnectOS contributors.
- Do not publish placeholder `repository`, `homepage`, or `bugs` URLs.
- Add public package metadata only after the final public GitHub organization, repository name, and repository URL are confirmed.

See [Package metadata audit](PACKAGE_METADATA_AUDIT.md) for current package-manifest status.

## 8. Release Candidate

Before tagging:

1. Run `pnpm release:check` locally.
2. Start the local demo with `pnpm --filter @connect-any-inbox/web dev -- -p 3033`.
3. Manually open `http://localhost:3033/connect-core`.
4. Run the `ConnectOS CI` workflow manually on the release-candidate commit.
5. Confirm the `v1 Release Quality Gates` job passes.
6. Confirm issue and pull request templates route security-sensitive details away from public channels.
7. Confirm no placeholder repository URLs, security contacts, maintainer handles, branch-protection claims, release dates, or package metadata URLs remain.

## 9. Release Tagging

Only tag after local and CI release gates pass:

```text
v1.0.0
```

Do not invent release dates. Use an owner-approved release date or document an owner-approved exception. Do not publish release notes with placeholder public URLs or placeholder security contact details.

## 10. After Publication

After the repository is public:

- Confirm public README, documentation index, security policy, support policy, issue templates, and pull request template render correctly in GitHub.
- Confirm branch protection displays the intended `ConnectOS CI / v1 Release Quality Gates` status check.
- Confirm the selected private security reporting path is visible to reporters.
- Run `pnpm release:check` again from a clean clone of the release-candidate checkout before announcing v1.0.
- Keep post-public follow-up work inside release preparation unless the project owner explicitly approves new scope.

## Release Wording Guardrails

Exact statements preserved so release-preparation checks catch accidental drift in GitHub setup guidance:

- Use this guide when preparing the public ConnectOS v1.0 repository.
- Complete owner decisions in [Pre-public owner decisions](PRE_PUBLIC_OWNER_DECISIONS.md) before finalizing public GitHub metadata.
- Do not publish placeholder repository URLs, security contacts, branch-protection state, maintainer handles, release dates, or package metadata URLs.
- Do not mark owner-controlled GitHub settings complete until the repository owner has verified them in GitHub.
- No new APIs or databases.
- No product-specific business logic.
- GitHub private vulnerability reporting
- Do not route security reports through public issues or public pull requests.
- ConnectOS CI
- v1 Release Quality Gates
- pnpm release-docs:check
- pnpm release:check
- connect-core-token:v1
- universal_actions
- Add public package metadata only after the final public GitHub organization, repository name, and repository URL are confirmed.
