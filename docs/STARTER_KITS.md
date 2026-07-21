# Starter Kits

Starter Kits are reusable setup guides for common business categories. They help AI application builders present a practical connection path without putting product-specific business logic into ConnectOS core.

Starter Kits do not execute workflows. They describe:

- Recommended integrations.
- Why each integration matters.
- Whether each integration is required or optional.
- Suggested setup order.

## Current Starter Kits

ConnectOS currently includes five Starter Kits:

| Starter Kit ID | Display name | Purpose |
| --- | --- | --- |
| `church` | Church | Coordinate volunteers, services, events, donations, and member follow-up. |
| `restaurant` | Restaurant | Connect customer messages, staffing updates, files, and payments. |
| `agency` | Agency | Bring together client work, delivery conversations, calendars, and repositories. |
| `real-estate` | Real Estate | Support lead response, showings, documents, CRM updates, and closings. |
| `local-service-business` | Local Service Business | Connect customer requests, jobs, schedules, team updates, and billing. |

Each kit is intentionally generic. A Starter Kit should help many AI applications support a business category without assuming one specific product, workflow, customer, company, vertical application, or private operating model.

## Starter Kit Shape

A Starter Kit contains:

- `id`: Stable identifier.
- `name`: Human-readable kit name.
- `description`: Short setup summary.
- `recommendedIntegrations`: Ordered integration recommendations.

Each item in `recommendedIntegrations` contains:

- `integrationId`: Existing integration catalog ID.
- `requirement`: `required` or `optional`.
- `why`: Plain-language reason the integration matters.
- `setupOrder`: Recommended onboarding order.

Example shape:

```text
Agency
-> Gmail: required, setup order 1
-> Google Calendar: required, setup order 2
-> Slack: required, setup order 3
-> GitHub: optional, setup order 4
-> HubSpot: optional, setup order 5
```

## How Starter Kits Are Used

Starter Kits help user-facing applications present an onboarding path:

```text
Choose setup guide
-> See recommended integrations
-> Connect required tools first
-> Add useful optional tools
```

They are guidance, not automation. A kit can recommend Gmail before Google Calendar, but it does not run recipes, send messages, create events, or write records.

The disabled `Connect all recommended` control in the demo UI is a placeholder for future guided onboarding. It does not connect integrations automatically in the v1.0 release-preparation build.

## Required And Optional Recommendations

Use `required` integrations to define the minimum useful setup for a business category.

Use `optional` integrations to add richer context or automation potential while keeping the first usable connection path simple.

Examples:

- A calendar integration is often required when a category depends on appointments, events, or scheduled work.
- A payment or CRM integration is often optional because it improves context after communication and scheduling connections are in place.

## Adding Or Updating Starter Kits

During normal feature development after the release freeze, adding or updating a Starter Kit should:

1. Reference existing integration IDs.
2. Keep reasons short, practical, and understandable to non-technical users.
3. Mark integrations `required` only when the kit does not make sense without them.
4. Keep setup order focused on the lowest-friction onboarding path.
5. Add or update tests proving required integration ordering.
6. Avoid product-specific business logic.

During v1.0 release preparation, do not add new Starter Kits without explicit scope approval.

## Boundary From Product Logic

Starter Kits may name broad business categories, but they must not encode one application's private workflows or product assumptions.

Good Starter Kit guidance:

```text
Connect Gmail first so an AI application can understand customer messages.
Connect Google Calendar next so scheduling context is available.
```

Out of scope for ConnectOS core:

```text
When one company's sales lead arrives, run that company's internal workflow.
```

That kind of application-specific behavior belongs outside ConnectOS.

## Relationship To Skills And Recipes

Starter Kits recommend integrations to connect. They do not define AI Skills or Workflow Recipes.

```text
Starter Kit
-> Recommended integrations
-> Connections
-> Capabilities
-> Actions
-> Skills
```

During v1.0 release preparation, Skills and Actions remain dry-run only. Recipes are not part of the release scope.

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

During v1.0 release preparation, this document describes existing behavior. Release-preparation work must not add new Starter Kits, providers, connectors, Capabilities, Actions, Skills, Recipes, APIs, databases, or product-specific workflows without explicit scope approval.

Good Starter Kit documentation work during the release freeze includes:

- Clarifying existing kit purpose and boundaries.
- Improving examples for existing kits.
- Explaining required versus optional recommendations.
- Making the distinction between setup guidance and workflow automation clearer.

Out-of-scope work during the release freeze includes:

- Adding new Starter Kits.
- Adding new recommended integrations.
- Adding Recipes or workflow execution.
- Adding product-specific workflows to ConnectOS core.
