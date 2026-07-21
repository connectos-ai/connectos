## Summary

Describe what changed and why it belongs in ConnectOS v1.0 release preparation.

Keep the summary focused on release quality: coherence, trust, documentation quality, naming consistency, developer experience, GitHub readiness, security, tests, or correctness of existing behavior.

## Type Of Change

- [ ] Bug fix for existing behavior.
- [ ] Documentation or release-prep cleanup.
- [ ] Test coverage for existing behavior.
- [ ] Security hardening for existing behavior.
- [ ] Contributor experience improvement.
- [ ] Tooling, CI, or release gate improvement.

## v1 Release Scope Check

During v1.0 release preparation, pull requests must not add new platform capability unless the work was explicitly approved before implementation.

- [ ] No new architecture.
- [ ] No new providers.
- [ ] No new connectors.
- [ ] No new Capabilities, Actions, Skills, or Recipes.
- [ ] No new APIs or databases.
- [ ] No product-specific business logic inside ConnectOS.
- [ ] No new product features.
- [ ] Backward compatibility is preserved.

If this pull request required explicit scope approval, link it here:

## Compatibility Check

Confirm this pull request preserves compatibility-sensitive names unless an approved compatibility-preserving migration plan is linked.

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

If any compatibility-sensitive name changes, link the approved migration plan here:

## Security Check

- [ ] This pull request does not expose OAuth tokens, refresh tokens, OAuth authorization codes, API keys, client secrets, encryption keys, token references, raw callback payloads, raw provider responses, credentials, or exploitable vulnerability details.
- [ ] This pull request does not ask contributors to publish sensitive findings publicly.
- [ ] If security reporting is relevant, this pull request names the owner decision needed instead of inventing a security contact.

## Documentation Check

- [ ] Public wording positions ConnectOS as neutral infrastructure for AI applications.
- [ ] Documentation does not introduce product-specific business logic.
- [ ] Compatibility-sensitive names remain documented where relevant.
- [ ] Owner-controlled values remain deferred unless explicitly owner-approved.
- [ ] Documentation-only changes still ran the full release gate, or the maintainer-approved exception is explained below.

## Verification

`pnpm release:check` is the authoritative full local gate for v1.0 release-preparation pull requests. Individual checks are listed for visibility while developing and debugging:

- [ ] `pnpm release-docs:check`
- [ ] `pnpm release-metadata:check`
- [ ] `pnpm release-hygiene:check`
- [ ] `pnpm test`
- [ ] `pnpm lint`
- [ ] `pnpm typecheck`
- [ ] `pnpm prisma:validate`
- [ ] `pnpm build`
- [ ] `pnpm release:check`

If any required check was not run, explain why:

Paste the relevant pass/fail summary or CI run link:

## Risk Level

- [ ] LOW
- [ ] MEDIUM
- [ ] HIGH

Explain what reviewers should inspect most closely:

## Reviewer Notes

Add anything reviewers need to understand before approving this release-prep change.

## Release-Check Guardrails

Exact statements preserved so release-preparation checks catch accidental drift in the pull request template:

- No new APIs or databases.
- No product-specific business logic inside ConnectOS.
- connect-core-token:v1
- universal_actions
