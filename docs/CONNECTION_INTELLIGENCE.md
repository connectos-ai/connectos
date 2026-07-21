# Connection Intelligence

Connection Intelligence is the Capability layer above ConnectOS providers. It lets AI applications understand what connected software can do without writing custom logic for every provider.

AI applications should be able to ask capability-level questions:

```text
Who can send messages?
Who can read files?
Who can create calendar events?
```

They should not need provider-specific checks:

```text
Does the Slack connector exist?
Does Gmail support this exact provider action name?
```

## Schema

Connection Intelligence uses this public model:

```text
Connector
-> Capabilities
-> Actions
-> Permissions
```

Example:

```text
Gmail -> Read Email -> gmail.read-messages -> gmail.readonly
Gmail -> Send Email -> gmail.send-message -> gmail.send
Gmail -> Search Email -> gmail.search-inbox -> gmail.readonly
```

- **Connector**: An integration a user connects, such as Gmail, Slack, or Google Calendar.
- **Capability**: What a connector can do, such as Send Email or Read Files.
- **Action**: A connector-level operation that ConnectOS can map into standardized Actions.
- **Permission**: A provider-level grant or scope needed to support the Capability.

## API

List connector capability maps:

```text
GET /api/connect-core/capabilities
```

List flattened connector Actions for AI agent and application queries:

```text
GET /api/connect-core/actions
```

These routes are compatibility-sensitive v1 surfaces. Do not rename them without an approved compatibility-preserving migration plan.

## Current Capability Vocabulary

These Capability IDs already exist in the v1.0 release-preparation build. Do not add new Capabilities during the release freeze unless scope is explicitly approved.

| Capability ID | Display name |
| --- | --- |
| `read-email` | Read Email |
| `send-email` | Send Email |
| `search-email` | Search Email |
| `read-calendar` | Read Calendar |
| `create-calendar-event` | Create Calendar Event |
| `update-calendar-event` | Update Events |
| `read-contacts` | Read Contacts |
| `read-files` | Read Files |
| `write-files` | Write Files |
| `search` | Search |
| `create-records` | Create Records |
| `update-records` | Update Records |
| `delete-records` | Delete Records |
| `receive-webhooks` | Receive Webhooks |
| `send-messages` | Send Messages |
| `upload-files` | Upload Files |
| `download-files` | Download Files |
| `read-repos` | Read Repos |
| `create-pr` | Create PR |
| `manage-issues` | Issues |
| `read-channels` | Read Channels |

## Connector Examples

Examples from the current registry:

- Gmail exposes Read Email, Send Email, and Search Email.
- Google Calendar exposes Read Calendar, Create Calendar Event, and Update Events.
- Slack exposes Read Channels, Send Messages, and Upload Files.
- GitHub exposes Read Repos, Create PR, and Issues.
- HubSpot exposes Read Contacts, Create Records, and Update Records.
- Google Drive exposes Read Files, Write Files, and Download Files.

## Provider Neutrality

Capabilities describe what a connected integration can do. They do not describe how the connection is powered.

The same capability shape works for:

- Mock demo connections.
- Direct OAuth connections.
- Composio connected accounts.

This lets AI applications reason at the Capability level instead of the provider implementation level.

## Relationship To Actions And Skills

Connection Intelligence sits below Actions and Skills:

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

Public documentation should use **Actions** for the standardized operation layer. The internal compatibility name remains `universal_actions`, and existing route names remain compatibility-sensitive.

## No Real Writes

Connection Intelligence describes what connected software can do. It does not perform provider writes by itself.

During v1.0 release preparation, Actions and Skills resolve as dry-run only. They do not send messages, create calendar events, create records, write files, or perform other destructive operations.

## Compatibility-Sensitive Names

These names are intentionally preserved during v1.0 release preparation:

- `/connect-core`
- `/api/connect-core/*`
- `/api/connect-core/capabilities`
- `/api/connect-core/actions`
- `@connect-any-inbox/*`
- `CONNECT_CORE_ENCRYPTION_KEY`
- `connect-core-token:v1`
- `universal_actions`

Future renames require an approved compatibility-preserving migration plan.

## v1 Release Scope

During v1.0 release preparation, this document describes existing behavior. Release-preparation work must not add new Capabilities, Actions, Skills, Recipes, providers, connectors, APIs, databases, architecture, or product-specific workflows without explicit scope approval.

Good Connection Intelligence documentation work during the release freeze includes:

- Clarifying the existing Capability vocabulary.
- Improving examples for existing connectors.
- Explaining how Capabilities relate to Actions and Skills.
- Making provider neutrality easier for contributors to understand.

Out-of-scope work during the release freeze includes:

- Adding new Capabilities.
- Adding new connector capability mappings.
- Adding new Actions or Skills.
- Renaming compatibility-sensitive APIs without an approved migration plan.
