# Archived Todo

This file intentionally preserves a historical marker from earlier project
planning. It is not the current ConnectOS v1.0 release checklist, active
backlog, release gate, or contributor priority list.

Earlier versions of the repository used `tasks/todo.md` to track an
inbox-focused MVP checklist. That checklist is no longer authoritative.

## Current Release Checklist

Use these documents for current release context:

- [README](../README.md)
- [Founding principles](../FOUNDING_PRINCIPLES.md)
- [Release checklist](../docs/RELEASE_CHECKLIST.md)
- [Release-candidate readiness](../docs/RELEASE_CANDIDATE_READINESS.md)
- [v1 release readiness audit](../docs/V1_RELEASE_READINESS_AUDIT.md)
- [Roadmap](../docs/ROADMAP.md)
- [Pre-release change inventory](../docs/PRE_RELEASE_CHANGE_INVENTORY.md)
- [Pre-public owner decisions](../docs/PRE_PUBLIC_OWNER_DECISIONS.md)
- [Package metadata audit](../docs/PACKAGE_METADATA_AUDIT.md)

## Release-Preparation Work

Current release-preparation work should improve:

- Documentation clarity.
- Naming and terminology consistency.
- Contributor experience.
- GitHub readiness.
- Security and production-readiness documentation.
- Verification of existing behavior.
- Demo polish that does not create new platform capability.

## Scope Guardrails

Do not use this archived checklist to approve or infer:

- New architecture.
- New providers.
- New connectors.
- New Capabilities, Actions, Skills, or Recipes.
- New APIs or databases.
- New product features.
- Product-specific business logic.

Any exception requires explicit scope approval before implementation.

## Compatibility-Sensitive Names

ConnectOS still preserves these compatibility-sensitive names during v1.0
release preparation:

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

## Verification

For release-prep changes, run:

```bash
pnpm release:check
```

Required archive markers: Archived Todo, historical marker, ConnectOS v1.0
release checklist.
