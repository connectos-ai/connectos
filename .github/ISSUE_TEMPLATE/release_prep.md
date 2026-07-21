---
name: Release preparation task
about: Improve ConnectOS documentation, consistency, tests, security, or contributor experience
title: "release: "
labels: release-prep
assignees: ""
---

Use this template for v1.0 release-quality work only.

ConnectOS is neutral infrastructure for AI applications. Release-prep issues should improve coherence, trust, documentation quality, naming consistency, developer experience, GitHub readiness, security posture, tests, or correctness of existing behavior.

Do not use this template to request new platform capability. If an issue needs new architecture, providers, connectors, Capabilities, Actions, Skills, Recipes, APIs, databases, product features, or product-specific business logic, it needs explicit scope approval before implementation.

## Owner Decision Needed

Does this issue require the project owner to choose a final public value or accept a pre-public exception?

- [ ] Final GitHub organization, repository name, or public URL.
- [ ] Private security reporting path.
- [ ] Branch protection required checks.
- [ ] Package metadata timing.
- [ ] Changelog release date.
- [ ] Maintainer handles or `.github/CODEOWNERS` timing.
- [ ] Code of Conduct timing.
- [ ] Not applicable.

Do not guess owner-controlled values in public issues, docs, package manifests, or GitHub settings.

## v1 Scope Check

- [ ] No new architecture.
- [ ] No new providers.
- [ ] No new connectors.
- [ ] No new Capabilities, Actions, Skills, or Recipes.
- [ ] No new APIs or databases.
- [ ] No new product features.
- [ ] No product-specific business logic inside ConnectOS.
- [ ] ConnectOS remains neutral infrastructure for AI applications.
- [ ] Backward compatibility is preserved.

If this issue requires explicit scope approval, link it here:

## Compatibility Context

Check any compatibility-sensitive names touched by this issue:

- [ ] `/connect-core`
- [ ] `/api/connect-core/*`
- [ ] `/api/connect-core/callback`
- [ ] `/api/connect-core/actions`
- [ ] `/api/connect-core/capabilities`
- [ ] `/api/connect-core/skills`
- [ ] `/api/connect-core/universal-actions`
- [ ] `@connect-any-inbox/*`
- [ ] `CONNECT_CORE_ENCRYPTION_KEY`
- [ ] `connect-core-token:v1`
- [ ] `universal_actions`
- [ ] Not applicable.

If this issue touches compatibility-sensitive name changes, link the approved compatibility-preserving migration plan here:

## Security And Secret Safety

- [ ] This issue does not include OAuth tokens, refresh tokens, authorization codes, API keys, client secrets, encryption keys, token references, raw callback payloads, raw provider responses, credentials, or exploitable vulnerability details.
- [ ] This issue does not ask contributors to publish sensitive findings publicly.
- [ ] If security reporting is relevant, this issue names the owner decision needed instead of inventing a security contact.

## Verification

`pnpm release:check` is the authoritative full local gate for v1.0 release preparation work. Individual checks are listed for visibility while developing and debugging:

- [ ] `pnpm release-docs:check`
- [ ] `pnpm release-metadata:check`
- [ ] `pnpm release-hygiene:check`
- [ ] `pnpm test`
- [ ] `pnpm lint`
- [ ] `pnpm typecheck`
- [ ] `pnpm prisma:validate`
- [ ] `pnpm build`
- [ ] `pnpm release:check`

Documentation-only changes still run the full release gate unless a maintainer explicitly accepts an exception.

## Reviewer Notes

What should reviewers inspect most closely before approving this release-prep issue? Call out files, phrases, docs, tests, compatibility-sensitive names, or owner-controlled decisions.

## Release-Check Guardrails

Exact statements preserved so release-preparation checks catch accidental drift in the release-prep issue template:

- Use this template v1.0 release-quality work only.
- neutral infrastructure for AI applications
- No new APIs or databases.
- No product-specific business logic inside ConnectOS.
- connect-core-token:v1
- universal_actions
