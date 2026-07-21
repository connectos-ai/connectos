# Actions

Actions are the standardized operation layer in ConnectOS. They let an AI application ask for a provider-neutral operation while ConnectOS resolves which connected provider can satisfy it.

```text
Application asks: send_message
ConnectOS resolves: Slack, Gmail, or another connected provider
```

Public documentation should use **Actions** for this standardized operation layer. The internal compatibility name remains `universal_actions`, TypeScript types still use `UniversalAction*`, and the existing API route remains `/api/connect-core/universal-actions`.

Do not rename `universal_actions`, `UniversalAction*`, or `/api/connect-core/universal-actions` during v1.0 release preparation.

## Current Registry

These Actions already exist in the v1.0 release-preparation build. Do not add new Actions during release freeze unless scope is explicitly approved.

| Action ID | Display name | Connected provider examples |
| --- | --- | --- |
| `send_message` | Send message | Slack, Gmail |
| `search_messages` | Search messages | Gmail, Slack |
| `create_calendar_event` | Create calendar event | Google Calendar |
| `search_files` | Search files | Google Drive |
| `create_customer` | Create customer | HubSpot, QuickBooks, Stripe |
| `search_customer` | Search customer | HubSpot, QuickBooks, Stripe |
| `save_file` | Save file | Google Drive |

Each Action maps through lower layers:

```text
Action
-> Connector action
-> Capability
-> Permissions
```

## API

List registered Actions and the current demo user's available connected providers:

```text
GET /api/connect-core/universal-actions
```

Filter the response to one Action:

```text
GET /api/connect-core/universal-actions?action=send_message
```

The response returns a `data` array. Each item includes:

- Action definition.
- Connector mappings that can satisfy the Action.
- `availableProviders`, listing connected providers the current user can use now.

## Resolver

Use `resolveUniversalActionProviders(userId, universalAction, connections)` to answer which connected providers can satisfy an Action for a user.

Example:

```ts
resolveUniversalActionProviders("local-demo-user", "send_message", connections);
```

Example result shape:

```ts
[
  {
    connectorId: "slack",
    connectorName: "Slack",
    connectorActionId: "slack.send-message",
    capabilityId: "send-messages",
    permissions: ["chat:write"],
    inputSchema: {
      destination: "channel or conversation",
      text: "message body"
    },
    providerKey: "direct-oauth",
    connectionId: "connection_123"
  }
]
```

## Dry-Run Execution

Use `executeUniversalAction({ userId, action, preferredProvider, input, connections })` to resolve an Action into a safe execution plan.

During v1.0 release preparation, execution is intentionally dry-run only.

A dry-run result includes:

- `dryRun: true`.
- `action`.
- `wouldExecute`.
- `selectedProvider`.
- `availableProviders`.
- Original `input`.
- A plain-language message.

No real writes are performed. Actions do not send messages, create calendar events, create customer records, write files, or perform other destructive operations in the current v1.0 release-preparation build.

## Relationship To Capabilities And Skills

Actions sit between Capabilities and Skills:

```text
Provider
-> Connection
-> Capability
-> Action
-> Skill
```

- Capabilities describe what a connector supports.
- Actions standardize operations across connectors.
- Skills express user intent on top of Actions.

This keeps provider-specific APIs below the layer where AI applications reason.

## Compatibility-Sensitive Names

These names are intentionally preserved during v1.0 release preparation:

- `/connect-core`
- `/api/connect-core/*`
- `/api/connect-core/universal-actions`
- `@connect-any-inbox/*`
- `CONNECT_CORE_ENCRYPTION_KEY`
- `connect-core-token:v1`
- `universal_actions`

Future renames require an approved compatibility-preserving migration plan.

## Actions Later

During normal feature development outside the release freeze, adding an Action requires:

1. Add the action ID to `UniversalActionId`.
2. Add one `universalAction(...)` registry entry.
3. Map connector actions through `universalConnector(...)`.
4. Keep input schemas descriptive and provider-neutral.
5. Add tests for registry mapping, resolver behavior, and dry-run execution.

During v1.0 release preparation, do not add new Actions without explicit scope approval.

## v1 Release Scope

During v1.0 release preparation, this document describes existing behavior.

Release-preparation work must not add new Actions, Capabilities, Skills, Recipes, providers, connectors, APIs, databases, architecture, or product-specific workflows without explicit scope approval.

Good Actions documentation work during release freeze includes:

- Clarifying the existing Action layer.
- Improving examples for existing Actions.
- Explaining dry-run behavior more clearly.
- Using **Actions** in public docs while preserving `universal_actions` internally.

Out-of-scope work during release freeze includes:

- Adding new Actions.
- Adding new connector mappings.
- Changing execution from dry-run to real writes.
- Renaming compatibility-sensitive APIs without an approved migration plan.
