# ConnectOS Package Metadata Audit

This audit records the ConnectOS v1.0 release-preparation package metadata baseline. It helps reviewers confirm workspace package manifests remain neutral, private by default, pointed at the approved public repository URL, and aligned with owner-decision boundaries.

This document is not release approval and does not replace:

- [Pre-public owner decisions](PRE_PUBLIC_OWNER_DECISIONS.md)
- [ConnectOS v1.0 release checklist](RELEASE_CHECKLIST.md)
- the full local release gate.

## v1.0 Metadata Baseline

Every checked package manifest should keep fields stable during v1.0 release preparation:

- `license`: `MIT`
- `author`: `ConnectOS contributors`
- `private`: `true`
- Neutral package descriptions include `ConnectOS`.
- `repository`, `homepage`, and `bugs` fields point to `https://github.com/connectos-ai/connectos`.

The `@connect-any-inbox/*` package scope remains intentionally preserved for v1.0 compatibility.

Package metadata cleanup must not rename package scopes, package names, imports, folders, routes, environment variables, token identifiers, or other compatibility-sensitive names.

## Current Audit Result

Status: PASS.

The package metadata checker currently reports:

```text
Package metadata check passed: 16 manifests checked
```

Checked manifests include the root manifest, web app manifest, `packages/connect-core/package.json`, and other workspace package manifests.

Current evidence:

- All checked manifests are private.
- All checked manifests use `MIT`.
- All checked manifests use `ConnectOS contributors`.
- All checked manifests include neutral ConnectOS descriptions.
- All checked manifests use `https://github.com/connectos-ai/connectos` for public GitHub metadata.
- Generated `.next/` and `node_modules/` package manifests are excluded from release review.

Generated output, including `.next/`, `node_modules/`, and `*.tsbuildinfo`, is not release metadata and should not be committed.

## Owner-Approved Public Repository

Public package metadata is owner-approved for:

- GitHub organization: `connectos-ai`.
- Repository name: `connectos`.
- Public repository URL: `https://github.com/connectos-ai/connectos`.

Do not replace this with placeholder repository URLs during v1.0 release preparation. Broken metadata links are worse than intentionally deferred public metadata.

Package manifests remain private during v1.0 release preparation. Keep compatibility-sensitive package names and imports unchanged unless an approved compatibility-preserving migration plan exists.

If the public repository home changes before v1.0, update package manifests, this audit, and `scripts/check-package-metadata.mjs` in the same release-prep change. Then re-run `pnpm release:check`.

## Review Command

Run the package metadata check:

```bash
pnpm release-metadata:check
```

Expected review result:

- Every checked manifest uses `https://github.com/connectos-ai/connectos` for `repository`, `homepage`, and `bugs`.
- Generated `.next/` and `node_modules/` package manifests are excluded from release review.
- The checker reports `Package metadata check passed: 16 manifests checked`.

## Compatibility-Sensitive Names

Package metadata work must preserve:

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

Run the documentation-specific release check:

```bash
pnpm release-docs:check
```

Run the package metadata check:

```bash
pnpm release-metadata:check
```

Run the full release gate:

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

## Related Release Docs

- [Pre-public owner decisions](PRE_PUBLIC_OWNER_DECISIONS.md)
- [ConnectOS v1.0 release checklist](RELEASE_CHECKLIST.md)
- [GitHub release setup](GITHUB_RELEASE_SETUP.md)
- [ConnectOS pre-release change inventory](PRE_RELEASE_CHANGE_INVENTORY.md)
- [ConnectOS v1.0 release readiness audit](V1_RELEASE_READINESS_AUDIT.md)

## Release-Check Compatibility Note

Exact statements preserved so release-documentation checks catch accidental drift in package metadata guidance:

- neutral, private by default, pointed at the approved public repository URL
- This document is not release approval and does not replace
- `@connect-any-inbox/*` package scope remains intentionally preserved for v1.0 compatibility
- Generated output, including `.next/`, `node_modules/`, and `*.tsbuildinfo`,
- Public repository URL: `https://github.com/connectos-ai/connectos`
- Every checked manifest uses `https://github.com/connectos-ai/connectos`
- Generated `.next/` and `node_modules/` package manifests are excluded
- connect-core-token:v1
- universal_actions
- Future renames require an approved compatibility-preserving migration plan.
- pnpm release-docs:check
- pnpm release:check
