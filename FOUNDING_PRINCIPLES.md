# ConnectOS Founding Principles

ConnectOS is neutral open-source infrastructure for AI applications. It exists
to help AI applications reason about business intent instead of provider APIs.

These principles guide release decisions, contribution review, roadmap choices,
compatibility decisions, and long-term stewardship.

## 1. AI First

Every abstraction should help AI applications understand what they can do for a
user or business.

ConnectOS should make connected software easier for AI applications to reason
about, not merely easier for developers to authenticate.

## 2. Intent Before APIs

AI applications should express intent, such as `Notify Team`, instead of
hard-coding provider-specific calls such as `Slack.sendMessage`.

Provider APIs are implementation details. Business intent is the stable layer
applications should build on.

## 3. Providers Are Replaceable

Providers change. A user may use Google today, Microsoft tomorrow, Slack in one
workspace, and email in another.

ConnectOS should let applications move between providers without rewriting the
intent layer above them.

## 4. Stable Abstractions Matter More Than Connector Count

Connector count is useful, but stable abstractions make the platform
trustworthy.

Providers, Capabilities, Actions, Skills, and Recipes should stay clear and
predictable so developers can build on them with confidence.

## 5. Contributors Own The Ecosystem

Contributors own the ecosystem. ConnectOS should be easy for the community to
extend and improve.

Connectors, Skills, Skill Packs, Recipes, examples, tests, and documentation
should be contribution-friendly by design.

## 6. Product-Specific Business Logic Belongs Outside ConnectOS

ConnectOS should not contain assumptions about any specific product, company,
vertical, or private workflow.

Product-specific business logic belongs outside ConnectOS. Product behavior
belongs in applications or clearly separated extension packs. Core
infrastructure should stay neutral.

## 7. Backward Compatibility Is A Feature

Public APIs, manifests, routes, environment variables, token formats, and
documented behavior should be treated as compatibility commitments.

Future changes should preserve existing behavior unless an approved
compatibility-preserving migration plan exists.

## 8. Simplicity Beats Cleverness

The ConnectOS ladder should be easy to explain:

```text
Providers -> Capabilities -> Actions -> Skills -> Recipes
```

Providers connect real software. Capabilities describe what that software can
do. Actions standardize operations. Skills express business intent. Recipes
compose repeatable workflows.

If an abstraction cannot be explained simply, it is not ready to become a stable
public surface.

## v1 Release-Preparation Boundary

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

Exceptions require explicit project-owner approval before implementation.

## Compatibility-Sensitive Names

The following names are intentionally preserved during v1.0 release preparation:

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

These statements should remain stable so release-preparation checks catch
accidental drift in the founding principles:

- neutral open-source infrastructure for AI applications
- business intent instead of provider APIs
- Product-specific business logic.
