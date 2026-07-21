# Archived Implementation Plan

This file intentionally preserves a historical marker from earlier project
planning. It is not the current ConnectOS v1.0 release plan, roadmap,
contributor priority list, or release checklist.

Earlier versions of the repository used `tasks/plan.md` to track an
inbox-focused MVP. That plan is no longer authoritative.

## Current Release Plan

Use these documents for current release context:

- [README](../README.md)
- [Founding principles](../FOUNDING_PRINCIPLES.md)
- [Release checklist](../docs/RELEASE_CHECKLIST.md)
- [Release-candidate readiness](../docs/RELEASE_CANDIDATE_READINESS.md)
- [v1 release readiness audit](../docs/V1_RELEASE_READINESS_AUDIT.md)
- [Roadmap](../docs/ROADMAP.md)
- [Pre-public owner decisions](../docs/PRE_PUBLIC_OWNER_DECISIONS.md)
- [Pre-release change inventory](../docs/PRE_RELEASE_CHANGE_INVENTORY.md)
- [Package metadata audit](../docs/PACKAGE_METADATA_AUDIT.md)

## Release-Preparation Scope

Current work should prepare ConnectOS for a professional v1.0 open-source GitHub
release. Good release-preparation tasks include:

- Documentation polish.
- Naming and terminology consistency.
- Contributor experience cleanup.
- GitHub template and release-process polish.
- Security, environment, and production-readiness documentation.
- Verification of existing behavior.
- Demo polish that does not create new platform capability.

## Scope Guardrails

Do not use this archived plan to approve or infer:

- New architecture.
- New providers.
- New connectors.
- New Capabilities, Actions, Skills, or Recipes.
- New APIs or databases.
- New product features.
- Product-specific business logic.

Any exception requires explicit scope approval before implementation.

## Compatibility-Sensitive Names

These names remain intentionally preserved during v1.0 release preparation:

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

Required markers: Archived Implementation Plan, historical marker, ConnectOS
v1.0 release plan.
