# AI Skills

AI Skills are the public-facing intent layer above Actions. They let an AI application ask for what the user wants done while ConnectOS resolves the connected provider path underneath.

```text
Provider
-> Connection
-> Capability
-> Action
-> Skill
```

For example, an AI application can ask for:

```text
Notify Team
```

Instead of writing provider-specific code such as:

```text
Slack.sendMessage(...)
Gmail.send(...)
Teams.send(...)
```

The Skill resolver maps intent to one or more Actions, then resolves which connected providers can satisfy those Actions for the user.

## Compatibility Note

Public documentation should use **Actions** for the standardized operation layer. The internal compatibility name remains `universal_actions`, TypeScript Action types still use `UniversalAction*`, and the existing API route remains `/api/connect-core/universal-actions`.

Do not rename `universal_actions`, `UniversalAction*`, or `/api/connect-core/universal-actions` during v1.0 release preparation.

## Built-In Skills

These Skills already exist in the v1.0 release-preparation build. Do not add new Skills during the release freeze unless scope is explicitly approved.

| Skill ID | Display name | Category | Action substrate |
| --- | --- | --- | --- |
| `notify_team` | Notify Team | Communication | `send_message` |
| `send_customer_update` | Send Customer Update | Communication | `send_message` |
| `send_welcome_email` | Send Welcome Email | Communication | `send_message` |
| `send_appointment_reminder` | Send Appointment Reminder | Communication | `send_message`, optional `create_calendar_event` |
| `schedule_meeting` | Schedule Meeting | Calendar | `create_calendar_event` |
| `add_customer` | Add Customer | CRM | `create_customer` |
| `search_customer` | Search Customer | CRM | `search_customer` |
| `find_file` | Find File | Documents | `search_files` |
| `save_file` | Save File | Documents | `save_file` |

## API

List registered Skills and the current demo user's available connected providers:

```text
GET /api/connect-core/skills
```

Filter the response to one Skill:

```text
GET /api/connect-core/skills?skill=notify_team
```

The response returns a `data` array. Each item includes:

- Skill definition.
- Action mappings used by the Skill.
- `availableProviders`, listing connected providers the current user can use now.

## Resolver

Use `resolveSkillProviders(userId, skill, connections)` to answer which connected providers can satisfy a Skill for a user.

Example:

```ts
resolveSkillProviders("local-demo-user", "notify_team", connections);
```

Example result shape:

```ts
[
  {
    skillId: "notify_team",
    skillName: "Notify Team",
    universalActionId: "send_message",
    provider: {
      connectorId: "slack",
      connectorName: "Slack",
      connectorActionId: "slack.send-message",
      providerKey: "direct-oauth",
      connectionId: "connection_123"
    }
  }
]
```

## Dry-Run Execution

Use `executeSkill({ userId, skill, preferredProvider, input, connections })` to resolve a Skill into a safe execution plan.

During v1.0 release preparation, execution is intentionally dry-run only. A dry-run result includes:

- `dryRun: true`.
- `skill`.
- `wouldExecute`.
- `selectedProvider`.
- `availableProviders`.
- Original `input`.
- A plain-language message.

No real writes are performed. Skills do not send messages, create calendar events, create customer records, write files, or perform other destructive operations in the current v1.0 release-preparation build.

## Relationship To Actions And Capabilities

Skills sit above Actions and Capabilities:

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

This keeps providers replaceable. A Skill can stay stable even when the provider used to fulfill it changes.

## Provider Neutrality

AI applications should not need to know whether a user connected Slack, Gmail, Google Calendar, HubSpot, Stripe, Google Drive, or another provider. They should ask for intent:

```text
notify_team
```

ConnectOS resolves the available provider path through the existing Connection, Capability, and Action layers.

## Compatibility-Sensitive Names

These names are intentionally preserved during v1.0 release preparation:

- `/connect-core`
- `/api/connect-core/*`
- `/api/connect-core/skills`
- `/api/connect-core/universal-actions`
- `@connect-any-inbox/*`
- `CONNECT_CORE_ENCRYPTION_KEY`
- `connect-core-token:v1`
- `universal_actions`

Future renames require an approved compatibility-preserving migration plan.

## v1 Release Scope

During v1.0 release preparation, this document describes existing behavior. Release-preparation work must not add new Skills, Actions, Capabilities, Recipes, providers, connectors, APIs, databases, architecture, or product-specific workflows without explicit scope approval.

Good AI Skills documentation work during the release freeze includes:

- Clarifying the existing Skill ladder.
- Improving examples for existing Skills.
- Explaining dry-run behavior more clearly.
- Using **Actions** in public docs while preserving `universal_actions` internally.

Out-of-scope work during the release freeze includes:

- Adding new Skills.
- Adding new Action mappings.
- Changing execution from dry-run to real writes.
- Renaming compatibility-sensitive APIs without an approved migration plan.
