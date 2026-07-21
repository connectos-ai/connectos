# Pre-Public Owner Decisions

ConnectOS is close to v1.0 publication. The remaining items in this document are owner decisions, not engineering feature work.

Use this register before the repository becomes public and before tagging `v1.0.0`. Do not guess final values in code, docs, package manifests, or GitHub settings.

## Required Decisions

Resolve each decision before public v1.0, or document an explicit owner-approved exception in the affected release document.

Seven owner-controlled release decisions remain:

| Decision | Required before public v1.0 | Safe default pending owner approval |
| --- | --- | --- |
| Public GitHub home | Final organization, repository name, and public URL | Use neutral ConnectOS organization and repository naming |
| Security reporting channel | Private reporting path or approved exception | Enable GitHub private vulnerability reporting. |
| Branch protection | Required status checks and merge protections | Require `ConnectOS CI / v1 Release Quality Gates` |
| Package metadata timing | Add or defer public package URLs | Defer public package metadata until owner confirms final public repository URL. |
| Changelog date | Approved date or exception | Use the date the public `v1.0.0` tag is created |
| Maintainer handles CODEOWNERS | Real handles, ownership boundaries, or deferral | Defer `.github/CODEOWNERS` until handles are final |
| Code Of Conduct | Approved policy text or deferral | Add a standard Code Of Conduct before public v1.0 if the owner approves policy text |

### 1. Public GitHub Home

Decision needed:

- Final public GitHub organization.
- Final repository name.
- Final public repository URL.

Recommended default, pending owner approval:

```text
Use a neutral ConnectOS organization and repository name.
```

Why this blocks release:

- Package `repository`, `homepage`, and `bugs` fields should not point to placeholder URLs.
- `docs/GITHUB_RELEASE_SETUP.md` should mention only the final chosen public home.
- Contributors need one canonical place to file issues and pull requests.

After decision:

- Update `docs/GITHUB_RELEASE_SETUP.md` if the final public home changes setup guidance.
- Add package `repository`, `homepage`, and `bugs` fields only after the final public URL is known.
- Keep package names and paths unchanged unless an approved compatibility-preserving migration plan exists.

Accepted exception path:

- If publication happens before final package metadata is added, document an owner-approved exception and keep package manifests free of placeholder URLs.

### 2. Security Reporting Channel

Decision needed:

- Enable GitHub private vulnerability reporting.
- Publish an owner-approved private security contact.
- Or explicitly document a pre-public exception.

Recommended default, pending owner approval:

```text
Enable GitHub private vulnerability reporting.
```

Why this blocks release:

- Public issues must not be used for security vulnerabilities.
- OAuth and token-handling projects need a responsible private disclosure path.
- `SECURITY.md` and `SUPPORT.md` need one clear private reporting path, or an explicit owner-approved exception.
- Issue and pull request templates already warn contributors not to post secrets publicly.

After decision:

- Update `SECURITY.md`.
- Update `SUPPORT.md`.
- Confirm GitHub issue templates still route security reports away from public issues.

Accepted exception path:

- If the repository is published before a final security channel is selected, the owner must explicitly accept that exception while public docs continue telling users not to disclose vulnerabilities publicly.

### 3. Branch Protection

Decision needed:

```text
Configure branch protection for `main` and choose required status checks.
```

Recommended default, pending owner approval:

```text
Protect `main` and require `ConnectOS CI / v1 Release Quality Gates`.
```

Why this blocks release:

- The public repository should protect the release branch before the v1.0 tag.
- Contributors need predictable merge rules during release preparation.
- Required status checks should match documented release gates.

After decision:

- Configure branch protection in GitHub.
- Confirm the required workflow is `ConnectOS CI`.
- Confirm the required job is `v1 Release Quality Gates`.
- Confirm whether GitHub displays the branch-protection status check as `ConnectOS CI / v1 Release Quality Gates`.
- Run `ConnectOS CI` manually on the release-candidate commit before tagging.

Accepted exception path:

- If branch protection is not configured before publication, document an owner-approved exception and keep `MAINTAINERS.md` review expectations in force until GitHub settings are complete.

### 4. Package Metadata Timing

Decision needed:

- Add public `repository`, `homepage`, and `bugs` metadata before v1.0 publication.
- Or choose an explicit release path that defers public package metadata until the owner confirms the final public repository URL.

Recommended default, pending owner approval:

```text
Defer public package metadata until owner confirms final public repository URL.
```

Why this blocks release:

- Placeholder metadata creates broken links for package consumers.
- Deferring metadata is safer than publishing guessed links during release preparation.

After decision:

- Update package metadata only after the final public URL is confirmed.
- Re-run full release gate: `pnpm release:check`.

Accepted exception path:

- If package metadata remains deferred for public v1.0, keep manifests free of placeholder public URLs.

### 5. Changelog Date

Decision needed:

- Choose the release date that replaces the `CHANGELOG.md` placeholder:

```text
[v1.0.0] - YYYY-MM-DD
```

- Or explicitly accept first public publication while the placeholder date remains present.

Recommended default, pending owner approval:

```text
Use the date the public v1.0.0 tag is created.
```

Why this blocks release:

- Public releases usually include a dated changelog section.
- `CHANGELOG.md` should not invent a release date before the owner chooses one.

After decision:

- Replace `[v1.0.0] - YYYY-MM-DD` with the owner-approved date, or document an accepted exception.
- Re-run full release gate: `pnpm release:check`.
- Create the release tag from a clean release-candidate commit.

### 6. Maintainer Handles And CODEOWNERS

Decision needed:

- Real maintainer GitHub handles.
- Decide whether `.github/CODEOWNERS` should be added before public v1.0.

Recommended default, pending owner approval:

```text
Defer `.github/CODEOWNERS` until real maintainer handles and ownership boundaries are final.
```

Why this blocks release:

- Placeholder CODEOWNERS entries create broken review routing.
- Real maintainer handles are needed before ownership rules are enforced across docs, security-sensitive code, provider adapters, package manifests, and CI.
- `MAINTAINERS.md` already documents review expectations without inventing handles.

After decision:

- Add `.github/CODEOWNERS` only when real handles and owner-approved ownership boundaries are available.
- Keep `MAINTAINERS.md` aligned with chosen ownership boundaries.

Accepted exception path:

- CODEOWNERS can remain deferred for public v1.0. In that case, `MAINTAINERS.md` remains the authoritative review guide until real handles are available.

### 7. Code Of Conduct

Decision needed:

- Add `CODE_OF_CONDUCT.md` before public v1.0.
- Or explicitly defer Code Of Conduct publication until the owner approves policy text.

Recommended default, pending owner approval:

```text
Add a standard Code Of Conduct before public v1.0 if the owner approves policy text.
```

Why this blocks release:

- Public contribution benefits from clear participation expectations.
- Generic policy text is acceptable only if the owner approves it.
- Deferral is acceptable only if the owner explicitly documents a release exception.

After decision:

- Add `CODE_OF_CONDUCT.md` only with owner-approved policy text.
- Link `CONTRIBUTING.md` after the policy is added.
- Re-run full release gate: `pnpm release:check`.

Accepted exception path:

- If Code Of Conduct publication is deferred for public v1.0, document the owner-approved exception and revisit it before actively inviting broad community contribution.

## Owner Response Template

Use this template to unblock the final public v1.0 release review. Fill in an
approved value or explicitly choose `Defer with exception` for each item. Do not
replace placeholders elsewhere in the repository until these answers are
approved.

| Decision | Owner answer | Follow-up file or setting |
| --- | --- | --- |
| Public GitHub organization |  | GitHub repository settings, package metadata |
| Repository name |  | GitHub repository settings, package metadata |
| Public repository URL |  | `package.json`, package manifests, release docs |
| Security reporting path |  | `SECURITY.md`, `SUPPORT.md`, GitHub security settings |
| Branch protection required checks |  | GitHub branch protection for `main` |
| Package metadata timing |  | Root and workspace package manifests |
| Changelog v1.0.0 date |  | `CHANGELOG.md` |
| Maintainer handles and CODEOWNERS timing |  | `MAINTAINERS.md`, optional `.github/CODEOWNERS` |
| Code Of Conduct timing |  | Optional `CODE_OF_CONDUCT.md`, `CONTRIBUTING.md` |

Accepted answer formats:

- `Approve: <exact value or action>`
- `Defer with exception: <reason and revisit trigger>`

After the owner response is complete, update only the affected release files,
run `pnpm release:check`, and stage changes according to
`docs/RELEASE_CANDIDATE_STAGING_CHECKLIST.md`.

## Not Required Before v1.0

These items are useful follow-ups, but they are not required for public v1.0 unless the owner changes release scope:

- Renaming package scopes away from `@connect-any-inbox/*`.
- Adding more providers or connectors.
- Adding more Capabilities, Actions, Skills, or Recipes.
- Adding hosted infrastructure.
- Creating a marketplace.
- Publishing package metadata before the final public repository URL is confirmed.

## Compatibility Reminder

These names stay preserved unless an approved compatibility-preserving migration plan exists:

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

## Release Wording Guardrails

Exact statements preserved so release-preparation checks catch accidental drift in owner-decision guidance:

- owner decisions, not engineering feature work
- Do not guess final values in code, docs, package manifests, or GitHub settings.
- Final public GitHub organization.
- Final repository name.
- Final public repository URL.
- Enable GitHub private vulnerability reporting.
- Publish an owner-approved private security contact.
- Configure branch protection
- status checks
- v1 Release Quality Gates
- ConnectOS CI
- Defer public package metadata until owner confirms final public repository URL.
- pnpm release:check
- CHANGELOG.md
- [v1.0.0] - YYYY-MM-DD
- .github/CODEOWNERS
- CODE_OF_CONDUCT.md
- connect-core-token:v1
- universal_actions
- Future renames require an approved compatibility-preserving migration plan.
