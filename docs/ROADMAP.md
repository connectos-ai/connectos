# ConnectOS Roadmap

ConnectOS v1.0 is focused on coherence and trust: stable abstractions, clear documentation, predictable local setup, contributor-friendly structure, and a neutral open-source identity.

During v1.0 release preparation, the roadmap is release quality, not new capability.

ConnectOS should remain neutral infrastructure for AI applications. New providers, connectors, Capabilities, Actions, Skills, Recipes, APIs, databases, architecture, product features, and product-specific business logic are intentionally out of scope unless the project owner explicitly approves a scope change.

Owner-controlled release details must not be guessed in code, docs, package manifests, or GitHub settings.

## Current Foundation

The v1 foundation already includes:

- Data-driven integration catalog.
- In-memory and Prisma-backed connection repositories.
- Mock provider fallback.
- Google and Slack direct OAuth adapters.
- Composio provider adapter.
- Token encryption and OAuth state hardening.
- Connection health, lifecycle, and audit events.
- Capabilities, Actions, and AI Skills.
- Starter Kits for common business categories.
- Connector manifest validation.
- Release documentation and Founding Principles.

## v1 Release Preparation

v1 release-preparation work is about public release quality, not expanding platform capability.

Release-preparation work should:

- Improve documentation clarity and consistency.
- Preserve compatibility-sensitive names.
- Keep owner-controlled values out of docs, package manifests, and GitHub configuration until the project owner chooses final values.
- Strengthen contributor experience.
- Keep verification easy to run and easy to trust.
- Polish release docs, GitHub templates, CI, security docs, and demo copy without changing product scope.

## Owner Decisions Before Public v1.0

Remaining public-release blockers are owner-controlled decisions, not feature work:

- Final public GitHub organization, repository name, and repository URL.
- Private security reporting path or explicit owner-approved exception.
- Branch protection required status checks.
- Package metadata timing for `repository`, `homepage`, and `bugs` fields.
- Changelog v1.0.0 release date.
- Maintainer handles and CODEOWNERS timing.
- Code of Conduct timing.

Release-prep agents should document these blockers clearly, but should not decide them.

## Post-v1 Direction

These ideas are post-v1 direction, not v1 release blockers:

- Additional providers and connectors.
- More complete real-provider OAuth coverage.
- Richer example applications.
- SDK and CLI expansion.
- Connector generator.
- Connector certification.
- Hosted infrastructure.
- Marketplace or registry flows.

Post-v1 planning should continue protecting the v1 abstraction ladder:

```text
Providers -> Connections -> Capabilities -> Actions -> Skills -> Recipes
```

## Release-Preparation Boundaries

Release-preparation work may improve:

- Documentation polish.
- Naming and terminology consistency.
- Verification of existing behavior.
- Contributor experience.
- GitHub templates, license, changelog, and CI readiness.
- Security, production, and compatibility documentation.
- Demo polish that does not add new platform capability.

Release-preparation work must not add:

- New architecture.
- New providers.
- New connectors.
- New Capabilities, Actions, Skills, or Recipes.
- New APIs or databases.
- New product features.
- Product-specific business logic.

Product-specific business logic belongs outside ConnectOS.

## Prioritization Principles

- Neutral infrastructure for AI applications comes first.
- Simplicity beats cleverness.
- Stable abstractions matter more than connector count.
- Backward compatibility is a release feature.
- Product-specific business logic belongs outside ConnectOS.

## Release Wording Guardrails

These statements should remain stable so release-preparation checks catch accidental drift in roadmap guidance:

- ConnectOS v1.0 is focused on coherence and trust
- ConnectOS v1.0 focused on coherence trust
- roadmap is release quality, not new capability
- intentionally out scope unless project owner explicitly approves scope change
- intentionally out of scope unless the project owner explicitly approves a scope change
- must not guessed in code, docs, package manifests, or GitHub settings
- must not be guessed in code, docs, package manifests, or GitHub settings
- These ideas post-v1 direction, not v1 release blockers
- These ideas are post-v1 direction, not v1 release blockers
- neutral infrastructure for AI applications
- Release-preparation work may improve:
- Release-preparation work must not add:
- New APIs or databases.
- Product-specific business logic belongs outside ConnectOS
