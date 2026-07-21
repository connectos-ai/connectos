# Archived Spec

This file intentionally preserves a historical marker from earlier project
planning. It is not the current ConnectOS v1.0 product specification, release
scope, contributor priority list, or release approval.

Use this archive only to understand earlier project context. Do not use it to
approve or infer current v1.0 work.

## Current Authoritative Context

Current ConnectOS v1.0 release preparation is governed by:

- [README](README.md)
- [Founding principles](FOUNDING_PRINCIPLES.md)
- [Documentation index](docs/README.md)
- [ConnectOS architecture](docs/CONNECTOS.md)
- [Roadmap](docs/ROADMAP.md)
- [Release checklist](docs/RELEASE_CHECKLIST.md)
- [Release-candidate readiness](docs/RELEASE_CANDIDATE_READINESS.md)
- [v1 release readiness audit](docs/V1_RELEASE_READINESS_AUDIT.md)
- [Pre-public owner decisions](docs/PRE_PUBLIC_OWNER_DECISIONS.md)
- [Pre-release change inventory](docs/PRE_RELEASE_CHANGE_INVENTORY.md)
- [Package metadata audit](docs/PACKAGE_METADATA_AUDIT.md)

## Archive Status

Earlier versions of this repository included an inbox-focused MVP spec. That
material is no longer authoritative for ConnectOS v1.0 and must not define
release scope.

Do not use this archived spec to approve or infer:

- New architecture.
- New providers.
- New connectors.
- New Capabilities, Actions, Skills, or Recipes.
- New APIs or databases.
- New product features.
- Product-specific business logic.

Any exception requires explicit scope approval before implementation.

## Current Direction

ConnectOS is neutral open-source infrastructure for AI applications. Its purpose
is to let AI applications reason about business intent instead of provider APIs.

Current platform language is:

```text
Providers -> Connections -> Capabilities -> Actions -> Skills -> Recipes
```

Implementation still preserves compatibility-sensitive names during v1.0 release
preparation:

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

Future name changes require an approved compatibility-preserving migration plan.

## Release-Preparation Boundary

ConnectOS is in v1.0 release preparation. Work in this mode should improve
clarity, contributor experience, documentation, verification, security posture,
release readiness, and demo polish.

Release-preparation work should not expand product scope.

[Founding principles](FOUNDING_PRINCIPLES.md) guide release decisions and
contribution review.

Required archive markers: Archived Spec, historical marker, ConnectOS v1.0
product specification.
