# GitHub Template Readiness

This note summarizes the GitHub templates prepared for the ConnectOS v1.0
release. ConnectOS is neutral infrastructure for AI applications.

Public GitHub templates should help contributors report existing behavior,
propose release-prep cleanup, and submit pull requests without expanding
product scope or exposing sensitive integration data.

## Template Inventory

- `.github/ISSUE_TEMPLATE/bug_report.md`: use for reproducible problems in
  existing ConnectOS behavior.
- `.github/ISSUE_TEMPLATE/release_prep.md`: use for v1.0 release-quality work
  such as documentation cleanup, naming consistency, security docs, tests,
  GitHub metadata, release docs, contributor experience, and demo polish.
- `.github/ISSUE_TEMPLATE/config.yml`: disables blank issues so public issue
  intake stays focused and contributor-friendly during v1.0 release preparation.
- `.github/PULL_REQUEST_TEMPLATE.md`: gives contributors one checklist for
  release scope, compatibility, security, documentation, verification, and risk.
- `.github/workflows/ci.yml`: runs the same `pnpm release:check` gate used by
  maintainers locally.

## Protected Scope

Templates should keep v1.0 release preparation focused on quality and trust.
They should not invite unapproved feature work.

Release-prep work must preserve boundaries unless the project owner explicitly
approves a separate scope change:

- No new architecture.
- No new providers.
- No new connectors.
- No new Capabilities, Actions, Skills, or Recipes.
- No new APIs or databases.
- No new product features.
- No product-specific business logic inside ConnectOS.

## Compatibility Names

Templates intentionally call out compatibility-sensitive names that should not
be renamed or removed during v1.0 release preparation without an approved
compatibility-preserving migration plan:

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

## Security Intake

Templates should keep sensitive reports out of public issues and public pull
requests. Do not include OAuth tokens, refresh tokens, authorization codes, API
keys, client secrets, encryption keys, token references, raw callback payloads,
raw provider responses, credentials, screenshots containing secrets, or
exploitable vulnerability details.

Security reporting remains owner-controlled before public v1.0. Templates should
name the owner decision instead of inventing a security contact.

## Owner-Controlled Decisions

GitHub templates and CI should not guess values:

- Final public GitHub organization, repository name, and public URL.
- Private security reporting path.
- Branch protection and required checks.
- Package metadata publication timing.
- Changelog release date.
- Maintainer handles or `.github/CODEOWNERS` timing.
- Code of Conduct timing.

## Verification

Run the standard release gate for template changes:

```bash
pnpm release:check
```

`pnpm release:check` includes documentation checks, metadata checks, hygiene
checks, tests, lint, typecheck, Prisma validation, and Next build.
