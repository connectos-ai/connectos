# Connector Development

ConnectOS connectors should begin as data-driven catalog manifest entries. Provider-backed behavior should be added only when connector work is explicitly approved for the current release scope.

During v1.0 release preparation, this guide documents contributor expectations. It does not approve adding new providers, connectors, Capabilities, Actions, Skills, Recipes, APIs, databases, architecture, or product-specific workflows.

A connector is easiest to review when its catalog copy, manifest fields, Capabilities, Actions, provider behavior, tests, and security boundaries are understandable on their own.

## Principles

1. Keep ConnectOS neutral infrastructure for AI applications.
2. Describe connector Capabilities before wiring provider-specific behavior.
3. Prefer OAuth-based connectors for user-facing integrations.
4. Keep provider-specific details behind the provider boundary.
5. Never expose secrets, tokens, token references, raw provider responses, or raw callback payloads.
6. Preserve existing API compatibility during v1.0 release preparation.
7. Keep product-specific business logic outside ConnectOS core.

## Recommended Path

When connector work is explicitly approved, use this path:

1. Add or update the connector manifest.
2. Add clear catalog copy for non-technical users.
3. Add mock behavior for demos, tests, and unconfigured environments.
4. Add Composio or direct OAuth support only when explicitly approved.
5. Map connector behavior to standardized Capabilities and Actions.
6. Add focused tests and documentation.

Keep each pull request small enough for reviewers to verify compatibility, security, and release scope.

## Manifest Format

Connector manifests should be readable, stable, and easy to validate. The manifest is the source of truth for catalog metadata and the first review point for connector contributions.

JSON example:

```json
{
  "id": "example-calendar",
  "name": "Example Calendar",
  "category": "calendar",
  "toolkitSlug": "examplecalendar",
  "authMethod": "oauth",
  "providerOptions": ["mock", "composio"],
  "scopes": ["calendar.events.read"],
  "actions": [
    {
      "id": "list-events",
      "name": "List events",
      "description": "Reads upcoming calendar events for a connected account."
    }
  ]
}
```

Canonical examples:

- [Connector manifest JSON example](connectors/manifest.example.json)
- [Connector manifest YAML example](connectors/manifest.example.yaml)

## Manifest Fields

| Field | Purpose |
| --- | --- |
| `id` | Stable connector identifier. |
| `name` | Human-readable connector name. |
| `category` | Existing integration category: `email`, `calendar`, `crm`, `payments`, `messaging`, `files`, or `automation`. |
| `toolkitSlug` | Provider or toolkit slug used by provider adapters. |
| `authMethod` | One of `oauth`, `api_key`, `webhook`, or `manual`. |
| `providerOptions` | Existing provider options: `mock`, `composio`, or `direct-oauth`. |
| `scopes` | Provider permission strings needed by the connector. |
| `actions` | Connector-level actions with `id`, `name`, and `description`. |

## Validation

Use `validateConnectorManifest(manifest)` to validate manifest shape before reviewing provider behavior. The validator checks that:

- The manifest is an object.
- Required string fields are present.
- `category` is a known integration category.
- `authMethod` is `oauth`, `api_key`, `webhook`, or `manual`.
- `providerOptions` includes at least one known provider.
- `scopes` is an array of strings.
- `actions` includes at least one action.
- Each action includes `id`, `name`, and `description`.

Invalid manifests should fail fast in tests so contributors get clear feedback before provider behavior is reviewed.

## Provider Options

Provider options must remain replaceable:

- `mock`: Used for demos, tests, and unconfigured environments.
- `composio`: Used when Composio manages connected accounts and provider credentials.
- `direct-oauth`: Used when ConnectOS owns the OAuth app and stores encrypted token records.

AI applications should not need to know whether a connector is powered by mock data, Composio, or direct OAuth.

## Capabilities, Actions, And Skills

Every connector should expose standardized Capabilities and Actions so AI applications can ask what can be done instead of checking specific provider names.

```text
Provider
-> Connection
-> Capability
-> Action
-> Skill
```

Connector-level shape:

```text
Connector
-> Capabilities
-> Actions
-> Permissions
```

Example:

```text
Slack
-> Send Messages
-> slack.send-message
-> chat.write
```

Related docs:

- [Connection Intelligence](CONNECTION_INTELLIGENCE.md): Current Capability model.
- [Actions](UNIVERSAL_ACTIONS.md): Standardized operation layer.
- [AI Skills](AI_SKILLS.md): Intent layer above Actions.

During v1.0 release preparation, connector-facing Actions and Skills remain dry-run only. No real writes are performed.

## Security Expectations

Connector contributions must not expose these values in UI, debug pages, docs, screenshots, logs, issues, or pull requests:

- OAuth tokens.
- Refresh tokens.
- Token references.
- API keys.
- Client secrets.
- Composio API keys.
- Raw callback payloads.
- Raw provider responses.

Use provider metadata or provider-specific account identifiers when raw tokens are not needed. Composio-backed integrations should store Composio connected account IDs in connection metadata, not in `oauth_tokens`.

## Starter Kits

Starter Kits describe repeatable recommended integration bundles for common business contexts. They reference existing integrations and explain:

- Why each integration matters.
- Whether each integration is required or optional.
- Suggested setup order.

Starter Kits should not contain product-specific business logic inside ConnectOS core.

## Compatibility-Sensitive Names

These names are intentionally preserved during v1.0 release preparation:

- `/connect-core`
- `/api/connect-core/*`
- `/api/connect-core/callback`
- `@connect-any-inbox/*`
- `CONNECT_CORE_ENCRYPTION_KEY`
- `connect-core-token:v1`
- `universal_actions`

Future renames require an approved compatibility-preserving migration plan.

## v1 Release Scope

During v1.0 release preparation, this document describes existing contributor expectations. Release-preparation work must not add new providers, connectors, Capabilities, Actions, Skills, Recipes, APIs, databases, architecture, or product-specific workflows without explicit scope approval.

Good v1 connector-development work during the release freeze includes:

- Clarifying existing manifest guidance.
- Improving tests for existing manifest validation.
- Fixing documentation links or terminology.
- Tightening security guidance for existing connector patterns.

Out-of-scope work during the release freeze includes:

- Adding a new connector.
- Adding a new provider.
- Adding new Capabilities, Actions, Skills, or Recipes.
- Changing OAuth, token storage, database, or API architecture.
- Renaming compatibility-sensitive APIs without an approved migration plan.

## Verification

Before a connector-development change is considered release-ready, run:

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
