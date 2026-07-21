# ConnectOS Documentation

ConnectOS is neutral infrastructure for AI applications.

This documentation index helps developers find the right ConnectOS v1.0
release-preparation reference for setup, architecture, provider configuration,
operations, security, and release readiness.

If you are new to the project, start with the top-level
[README](../README.md). It explains provider modes, compatibility-sensitive
names, release gates, and the current release-preparation framing.

## Choose Your Path

- **Run ConnectOS locally**: start with the top-level [README](../README.md),
  then review [environment variables](ENVIRONMENT.md).
- **Understand architecture**: read [ConnectOS architecture](CONNECTOS.md),
  [Actions](UNIVERSAL_ACTIONS.md), and [AI Skills](AI_SKILLS.md).
- **Configure real providers**: use the Google, Slack, or Composio guides under
  [Provider Setup](#provider-setup).
- **Contribute safely**: read [Contributing](../CONTRIBUTING.md),
  [Founding principles](../FOUNDING_PRINCIPLES.md), and the release-preparation
  docs.
- **Prepare a release candidate**: follow the
  [release checklist](RELEASE_CHECKLIST.md),
  [GitHub release setup](GITHUB_RELEASE_SETUP.md), and
  [release-candidate readiness](RELEASE_CANDIDATE_READINESS.md).

## Start Here

- [README](../README.md): project overview, quick start, provider modes,
  compatibility-sensitive names, and release gates.
- [ConnectOS architecture](CONNECTOS.md): Providers, Connections,
  Capabilities, Actions, Skills, Recipes, implementation boundaries, and mock
  fallback.
- [Environment variables](ENVIRONMENT.md): local demo defaults, persistence,
  provider configuration, mock fallback behavior, and secret safety.
- [Founding principles](../FOUNDING_PRINCIPLES.md): neutral infrastructure
  principles and v1.0 release-preparation boundaries.
- [Contributing](../CONTRIBUTING.md): contributor workflow, scope boundaries,
  and required checks.
- [Support](../SUPPORT.md): where to ask questions and how to route security
  concerns.

## Platform Concepts

- [Connection intelligence](CONNECTION_INTELLIGENCE.md): connector capability
  mapping and standardized descriptions of what connected tools can do.
- [Actions](UNIVERSAL_ACTIONS.md): standardized operation layer used beneath
  Skills while preserving `universal_actions` compatibility.
- [AI Skills](AI_SKILLS.md): public-facing intent layer above Actions.
- [Starter Kits](STARTER_KITS.md): business-owner-friendly starting points and
  recommended integrations.
- [Connector development](CONNECTOR_DEVELOPMENT.md): connector manifest format,
  validation expectations, and contribution workflow.

## Provider Setup

- [Google OAuth setup](GOOGLE_OAUTH_SETUP.md): local Gmail and Google Calendar
  OAuth verification.
- [Slack OAuth setup](SLACK_OAUTH_SETUP.md): local Slack OAuth verification.
- [Composio setup](COMPOSIO_SETUP.md): Composio provider configuration and
  adapter behavior.
- [Gmail local OAuth notes](gmail-local-oauth.md): historical Gmail setup notes
  retained for context.

## Operations And Security

- [Production checklist](PRODUCTION_CHECKLIST.md): operator checklist for
  production readiness.
- [Observability notes](observability.md): logging and monitoring context.
- [Security policy](../SECURITY.md): supported reporting path, secret-safety
  expectations, and production security notes.
- [Environment variables](ENVIRONMENT.md): required and optional environment
  settings.

## Release Preparation

- [Release checklist](RELEASE_CHECKLIST.md): authoritative v1.0 release flow.
- [Release-candidate readiness](RELEASE_CANDIDATE_READINESS.md): readiness
  criteria before release-candidate review.
- [Release-candidate change grouping](RELEASE_CANDIDATE_CHANGE_GROUPING.md):
  review groups for staging release-prep changes.
- [Release-candidate staging checklist](RELEASE_CANDIDATE_STAGING_CHECKLIST.md):
  current worktree staging checklist for release-candidate review.
- [Release staging plan](RELEASE_STAGING_PLAN.md): how to turn the worktree into
  coherent review commits.
- [Pre-release change inventory](PRE_RELEASE_CHANGE_INVENTORY.md): changed-path
  review map for the release candidate.
- [Pre-public owner decisions](PRE_PUBLIC_OWNER_DECISIONS.md): owner-controlled
  blockers release-prep agents must not guess.
- [Package metadata audit](PACKAGE_METADATA_AUDIT.md): current package metadata
  posture and deferred public URL decisions.
- [ConnectOS v1 release status](CONNECTOS_V1_RELEASE_STATUS.md): current
  high-level release status.
- [V1 release readiness audit](V1_RELEASE_READINESS_AUDIT.md): evidence-based
  readiness audit.
- [GitHub release setup](GITHUB_RELEASE_SETUP.md): repository setup, branch
  protection, security reporting, and release tagging guidance.
- [GitHub template readiness](GITHUB_TEMPLATE_READINESS.md): issue template,
  pull request template, and CI readiness notes.
- [Session transfer](SESSION_TRANSFER.md): handoff notes for release-prep
  sessions.
- [End-of-session transfer](END_OF_SESSION_TRANSFER.md): end-of-session handoff
  notes for release-prep sessions.

## Connector Examples

- [Connector manifest JSON example](connectors/manifest.example.json)
- [Connector manifest YAML example](connectors/manifest.example.yaml)
- [Archived connector roadmap notes](connectors/roadmap.md)

## Historical Context

These files are retained for context, but they do not define the current
ConnectOS v1.0 release scope:

- [Archived implementation plan](../tasks/plan.md)
- [Archived todo list](../tasks/todo.md)
- [Archived product spec](../SPEC.md)
- [Architecture decision records](decisions/)

Current release-preparation docs supersede older planning notes when they
conflict.

## Required Release Gate

Before publishing or cutting a release-candidate commit, run:

```bash
pnpm release:check
```

`pnpm release:check` includes release-doc checks, package metadata checks,
release hygiene checks, tests, linting, typechecking, Prisma validation, and
Next.js build.

Documentation-only changes still require the full release gate during v1.0
release preparation.

<!--
Release-check compatibility phrases:
If you are new to the project, start with the top-level [README](../README.md)
provider modes, compatibility-sensitive names, and release gates
provider modes, compatibility-sensitive names, release gates
provider modes, compatibility-sensitive names, release gates
standardized operation layer used beneath Skills while preserving `universal_actions` compatibility.
release-preparation framing
Documentation-only changes
-->
