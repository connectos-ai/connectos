/* global console, process */
import { existsSync, readFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");

// Maintenance guide:
// - `releaseDocs` is the public release-readiness surface checked before v1.0.
// - `requiredPhrases` is an exact-string contract for positioning, scope,
//   compatibility-sensitive names, security guidance, and release gates.
// - `gateDocs` and `compatibilityDocs` apply shared command/name requirements.
// - When public wording intentionally changes, update the guarded document and
//   its exact phrase in this script in the same release-prep change.
// - Do not add owner-controlled public URLs, contacts, handles, or release
//   dates here until the project owner has made those decisions.

// Public release-preparation files that must exist before a v1.0 release
// candidate can be cut.
const releaseDocs = [
  "LICENSE",
  "README.md",
  "SPEC.md",
  "CONTRIBUTING.md",
  "SECURITY.md",
  "SUPPORT.md",
  "MAINTAINERS.md",
  "FOUNDING_PRINCIPLES.md",
  "CHANGELOG.md",
  "apps/web/.env.example",
  "docs/README.md",
  "docs/CONNECTOS.md",
"docs/ENVIRONMENT.md",
"docs/gmail-local-oauth.md",
"docs/mvp-ship-readiness.md",
"docs/observability.md",
"docs/ROADMAP.md",
  "docs/connectors/roadmap.md",
  "docs/PRODUCTION_CHECKLIST.md",
"docs/RELEASE_CHECKLIST.md",
"docs/RELEASE_CANDIDATE_READINESS.md",
"docs/RELEASE_CANDIDATE_CHANGE_GROUPING.md",
"docs/RELEASE_STAGING_PLAN.md",
"docs/GITHUB_RELEASE_SETUP.md",
"docs/GITHUB_TEMPLATE_READINESS.md",
"docs/CONNECTOS_V1_RELEASE_STATUS.md",
"docs/V1_RELEASE_READINESS_AUDIT.md",
"docs/PRE_PUBLIC_OWNER_DECISIONS.md",
"docs/PRE_RELEASE_CHANGE_INVENTORY.md",
"docs/PACKAGE_METADATA_AUDIT.md",
"docs/SESSION_TRANSFER.md",
"docs/END_OF_SESSION_TRANSFER.md",
"docs/prompts/QUICK_CONNECTOS_RELEASE_STATUS.md",
"tasks/plan.md",
"tasks/todo.md",
  ".github/ISSUE_TEMPLATE/bug_report.md",
  ".github/ISSUE_TEMPLATE/config.yml",
  ".github/ISSUE_TEMPLATE/release_prep.md",
  ".github/PULL_REQUEST_TEMPLATE.md",
  ".github/workflows/ci.yml"
];

// Contributor-facing docs and templates must spell out the full local release
// gate.
const gateDocs = [
  "CONTRIBUTING.md",
  "MAINTAINERS.md",
  "docs/RELEASE_CHECKLIST.md",
  "docs/GITHUB_RELEASE_SETUP.md",
  "docs/V1_RELEASE_READINESS_AUDIT.md",
  ".github/PULL_REQUEST_TEMPLATE.md"
];

// Docs and templates that must preserve v1.0 compatibility-sensitive names.
const compatibilityDocs = [
  "CONTRIBUTING.md",
  "MAINTAINERS.md",
  "SECURITY.md",
  "SUPPORT.md",
  "CHANGELOG.md",
  "docs/CONNECTOS.md",
  "docs/RELEASE_CHECKLIST.md",
  "docs/GITHUB_RELEASE_SETUP.md",
  "docs/V1_RELEASE_READINESS_AUDIT.md",
  "docs/PRE_RELEASE_CHANGE_INVENTORY.md",
  ".github/ISSUE_TEMPLATE/bug_report.md",
  ".github/ISSUE_TEMPLATE/release_prep.md",
  ".github/PULL_REQUEST_TEMPLATE.md"
];

const requiredGates = [
  "pnpm release-docs:check",
  "pnpm release-metadata:check",
  "pnpm release-hygiene:check",
  "pnpm test",
  "pnpm lint",
  "pnpm typecheck",
  "pnpm prisma:validate",
  "pnpm build"
];

const compatibilityNames = [
  "/connect-core",
  "/api/connect-core/*",
  "/api/connect-core/callback",
  "@connect-any-inbox/*",
  "CONNECT_CORE_ENCRYPTION_KEY",
  "connect-core-token:v1",
  "universal_actions"
];

const previousProductName = ["Do", "Both"].join("");

const bannedProductTerms = [
  previousProductName,
  `${previousProductName} Connect Core`,
  "Chief of Staff",
  "ChurchStaff",
  "TimeBack"
];

const roughPhrases = [
  "Connect tool preview safe dry-run",
  "Development-only status view OAuth",
  "Contributor guidance manifests",
  "Start connector manifest",
  "Use mock support first; add Composio direct OAuth only approval",
  "Add tests manifest validation",
  "Choose use case repeatable"
];

const secretPatterns = [
  ["OpenAI API key", /\bsk-(?:proj-)?[A-Za-z0-9_-]{20,}\b/],
  ["Slack token", /\bxox[baprs]-[A-Za-z0-9-]{20,}\b/],
  ["Google API key", /\bAIza[0-9A-Za-z_-]{20,}\b/],
  ["Google OAuth access token", /\bya29\.[0-9A-Za-z_-]+\b/],
  ["GitHub token", /\bgh[pousr]_[A-Za-z0-9_]{20,}\b/],
  ["Stripe live secret key", /\bsk_live_[A-Za-z0-9]{20,}\b/],
  ["private key block", /-----BEGIN [A-Z ]*PRIVATE KEY-----/]
];

// These literal checks make release-readiness drift visible while v1.0 docs are
// being polished. Treat each phrase as an exact public-documentation contract,
// including compatibility anchors that preserve legacy names or wording.
// When wording intentionally changes, update the guarded document and this
// checker in the same release-prep task. If terminal output appears compressed,
// inspect the exact string here before editing guarded docs.
const requiredPhrases = new Map([
  [
    "LICENSE",
    [
      "MIT License",
      "Copyright (c) 2026 ConnectOS contributors",
      "Permission is hereby granted, free of charge, to any person obtaining a copy",
      "THE SOFTWARE IS PROVIDED \"AS IS\", WITHOUT WARRANTY OF ANY KIND"
    ]
  ],
[
 "README.md",
 [
 "# ConnectOS",
 "Build AI apps that work with real business software.",
 "ConnectOS is the open-source operating system for AI integrations.",
 "It gives AI applications a common language for connecting business tools through Providers, Connections, Capabilities, Actions, Skills, and Recipes.",
 "Current status: ConnectOS is in v1.0 release preparation.",
 "AI applications should reason about intent, not provider APIs.",
 "It is neutral infrastructure for AI applications, not tied to any specific product, workflow, company, or business vertical.",
 "## Architecture",
 "## Quick Start",
 "Use Node 24 or newer and pnpm 10.14.0 or newer.",
 "http://localhost:3033/connect-core",
 "`/connect-core` is intentionally preserved for compatibility during v1.0 release preparation.",
 "## Provider Modes",
 "## Compatibility-Sensitive Names",
 "Future renames require an approved compatibility-preserving migration plan.",
 "## Commands",
 "pnpm release:check",
 "## Project Docs",
 "## v1 Release Scope",
 "Release-preparation work must preserve boundaries:",
 "No new Capabilities, Actions, Skills, or Recipes.",
 "No new APIs or databases.",
 "No product-specific business logic."
 ]
],

 [
    "CONTRIBUTING.md",
    [
      "neutral open-source infrastructure for AI applications",
 "business intent",
      "## Local Setup",
      "Use Node 24 or newer and pnpm 10.14.0 or newer.",
      "http://localhost:3033/connect-core",
      "## Required Checks",
      "## Good v1.0 Contributions",
      "## Out Of Scope During v1.0 Release Preparation",
      "## Compatibility-Sensitive Names",
      "## Security And Secret Safety",
      "## Pull Request Expectations",
      "## Owner-Controlled Release Details",
      "pnpm release:check",
      "Product-specific business logic inside ConnectOS",
      "Do not report security vulnerabilities in public issues or public pull",
 "Documentation-only changes",
 "Pull requests should",
 "Final repository name",
      "Package metadata timing for `repository`, `homepage`, and `bugs` fields.",
      "CONNECT_CORE_ENCRYPTION_KEY",
      "universal_actions",
      "Pre-public owner decisions"
    ]
  ],
  [
 "SECURITY.md",
 [
 "secrets and tokens must never be exposed",
 "## Security Model",
 "## Required Secret",
 "## OAuth State Callback Safety",
 "## Debug Page Safety",
 "## Audit Logs",
 "## Reporting Security Issues",
 "## Production Security Checklist",
 "## Compatibility-Sensitive Names",
 "## v1 Release Scope",
 "Do not report security vulnerabilities in public issues or public pull",
 "CONNECT_CORE_ENCRYPTION_KEY",
 "`direct-oauth`",
 "`composio`",
 "GitHub private vulnerability reporting",
 "Another owner-approved private security contact.",
 "Until a private reporting channel is selected, do not publish sensitive findings",
 "Sensitive findings include:",
 "Raw callback payload exposure.",
 "Raw provider response exposure.",
 "Debug-page or production-safety bypasses.",
 "If a report might expose secrets or vulnerability details, treat it as private",
 "/connect-core/debug",
 "oauth_tokens.tokenRef",
 "Composio connected account identifiers in connection metadata",
 "Release-preparation work must not add new providers, connectors, Capabilities,",
 "product-specific workflows without explicit scope approval."
 ]
 ],
 [
 "SUPPORT.md",
 [
 "neutral open-source infrastructure for AI applications",
 "## Questions",
 "## Bugs",
 "## Security Issues",
 "Do not report security vulnerabilities in public issues or public pull",
 "GitHub private vulnerability reporting",
 "Another owner-approved private security contact.",
 "Until a private reporting channel is selected, do not publish sensitive findings",
 "Sensitive findings include:",
 "Raw callback payloads.",
 "Raw provider responses.",
 "If a report might expose secrets or vulnerability details, treat it as private",
 "## Release-Preparation Help",
 "Good v1.0 support requests are about release quality, not new capability.",
 "New Capabilities, Actions, Skills, or Recipes.",
 "Product-specific workflows or business logic.",
 "Documentation-only changes still require the full release gate during v1.0",
 "pnpm release:check",
 "## Compatibility-Sensitive Names",
 "connect-core-token:v1",
 "universal_actions",
 "Do not invent or include final public GitHub URLs"
 ]
 ],
 [
    "MAINTAINERS.md",
    [
      "neutral open-source infrastructure for AI applications",
      "## Review Priorities",
      "## Required Verification",
      "## Compatibility-Sensitive Names",
      "## Release Ownership",
      "## Owner-Controlled Decisions",
      "## Security Routing",
      "## Release-Candidate Review",
      "## CODEOWNERS Timing",
      "CODEOWNERS",
      "GitHub private vulnerability reporting",
      "Another owner-approved private security contact.",
      "Do not add `.github/CODEOWNERS` placeholder handles.",
      "Public docs do not include placeholder repository URLs, security contacts,",
 "sensitive findings",
      "pnpm release:check",
      "v1 Release Quality Gates",
      "connect-core-token:v1",
      "universal_actions",
 "Final repository name",
      "Package metadata timing for `repository`, `homepage`, and `bugs` fields."
    ]
  ],
  [
    "FOUNDING_PRINCIPLES.md",
    [
      "# ConnectOS Founding Principles",
      "neutral open-source infrastructure for AI applications",
      "business intent instead of provider APIs",
      "## 1. AI First",
      "## 2. Intent Before APIs",
      "## 3. Providers Are Replaceable",
      "## 4. Stable Abstractions Matter More Than Connector Count",
      "## 5. Contributors Own The Ecosystem",
      "## 6. Product-Specific Business Logic Belongs Outside ConnectOS",
      "## 7. Backward Compatibility Is A Feature",
      "## 8. Simplicity Beats Cleverness",
      "## v1 Release-Preparation Boundary",
      "Release-preparation work must not add:",
      "New APIs or databases.",
      "Product-specific business logic.",
      "## Compatibility-Sensitive Names",
      "connect-core-token:v1",
      "universal_actions",
      "Future renames require an approved compatibility-preserving migration plan."
    ]
  ],
  [
    "CHANGELOG.md",
    [
      "## [Unreleased]",
      "[v1.0.0] - YYYY-MM-DD",
 "Do not invent a v1.0.0 date before decision is made.",
      "### Release Preparation",
      "### Security And Operations",
      "### Release Scope",
      "### Compatibility-Sensitive Names",
      "### Owner-Controlled Before Public v1.0",
 "neutral open-source infrastructure for AI applications",
      "Private security reporting path",
      "Package metadata timing for `repository`, `homepage`, and `bugs` fields.",
      "CONNECT_CORE_ENCRYPTION_KEY",
      "universal_actions"
    ]
  ],
  [
    "docs/README.md",
    [
      "ConnectOS is neutral infrastructure for AI applications.",
      "If you are new to the project, start with the top-level [README](../README.md)",
      "## Choose Your Path",
      "## Start Here",
      "## Platform Concepts",
      "## Provider Setup",
      "## Operations And Security",
      "## Release Preparation",
      "provider modes, compatibility-sensitive names, and release gates",
      "public-facing intent layer above Actions.",
      "Release-candidate readiness",
      "Pre-public owner decisions",
      "Package metadata audit",
"ConnectOS v1 release status",
      "## Connector Examples",
      "Archived connector roadmap notes",
      "## Historical Context",
      "## Required Release Gate",
      "standardized operation layer used beneath Skills while preserving `universal_actions` compatibility.",
  "release-preparation framing",
  "Documentation-only changes",
    ]
  ],
  [
    "docs/CONNECTOS.md",
    [
      "neutral open-source infrastructure",
      "business intent instead of provider APIs",
      "Providers, Connections, Capabilities, Actions, Skills, and Recipes",
      "## Problem Statement",
      "## Public Architecture",
      "## Current Implementation",
      "## What Is Real",
      "## Mock Fallback Behavior",
      "## Local Database Setup",
      "## Provider Setup",
      "## Fallback Warning",
      "## Provider Adapter Contract",
      "## Compatibility Notes",
      "## Release Scope",
      "## Required Release Gate",
      "universal_actions",
  "`universal_actions` internal execution substrate",
      "Prisma persistence exists integrations, connections, events, health checks, OAuth token references.",
      "OAuth tokens never logged.",
      "Token storage uses an encrypted token reference in `ConnectCoreOAuthToken.tokenRef`.",
  "Mock mode",
      "[connect-core] Using in-memory repository fallback. ...",
      "Every provider implements:",
      "Future renames require an approved compatibility-preserving migration plan.",
  "Release-preparation work",
      "No new APIs or databases.",
  "Post-v1"
    ]
],
  [
    "docs/ROADMAP.md",
    [
      "ConnectOS v1.0 is focused on coherence and trust",
      "## Current Foundation",
      "## v1 Release Preparation",
      "## Owner Decisions Before Public v1.0",
      "## Post-v1 Direction",
      "## Release-Preparation Boundaries",
      "## Prioritization Principles",
      "the roadmap is release quality, not new capability",
      "intentionally out of scope unless the project owner explicitly approves a scope change",
      "must not be guessed in code, docs, package manifests, or GitHub settings",
      "These ideas are post-v1 direction, not v1 release blockers",
      "neutral infrastructure for AI applications",
      "Release-preparation work may improve:",
      "Release-preparation work must not add:",
      "New APIs or databases.",
      "Product-specific business logic belongs outside ConnectOS"
    ]
  ],
  [
    "docs/connectors/roadmap.md",
    [
      "# Archived Connector Roadmap Notes",
      "This document intentionally preserves historical context.",
      "It is not the current ConnectOS v1.0 connector roadmap.",
      "Earlier versions of the repository used this file to describe an inbox-focused connector strategy.",
      "Do not use this archived note to approve or infer:",
      "These historical entries do not create new v1.0 connector commitments.",
      "The following items were planning candidates, not current v1.0 release commitments:",
      "Earlier planning treated browser automation as a last-resort path requiring explicit approval and a recorded fallback reason.",
      "ConnectOS v1.0 release preparation is focused on coherence, trust, documentation quality, GitHub readiness, verification, and contributor experience.",
      "It is not focused on adding connector count.",
      "Current compatibility-sensitive names remain preserved:",
      "Future changes to these names require an approved compatibility-preserving migration plan."
    ]
  ],
[
  "docs/ENVIRONMENT.md",
  [
    "This guide lists environment variables used by the ConnectOS v1.0 release-preparation build.",
    "ConnectOS runs locally without third-party credentials.",
    "When provider credentials are missing, affected integrations use mock fallback where supported so `/connect-core` remains usable.",
    "Real direct OAuth requires provider credentials and `CONNECT_CORE_ENCRYPTION_KEY`.",
    "## Local Setup",
    "## Core Runtime",
    "## Direct OAuth Providers",
    "## Composio Provider",
    "## Compatibility-Sensitive Names",
    "## Production Safety",
    "## Secret Safety",
    "## Required Release Gate",
    "DATABASE_URL",
    "NEXT_PUBLIC_APP_URL",
    "CONNECT_CORE_ENCRYPTION_KEY",
    "NODE_ENV",
    "GOOGLE_CLIENT_ID",
    "GOOGLE_CLIENT_SECRET",
    "GOOGLE_REDIRECT_URI",
    "SLACK_CLIENT_ID",
    "SLACK_CLIENT_SECRET",
    "SLACK_REDIRECT_URI",
    "COMPOSIO_API_KEY",
    "COMPOSIO_BASE_URL",
    "COMPOSIO_AUTH_CONFIG_IDS",
    "COMPOSIO_AUTH_CONFIG_GITHUB",
    "http://localhost:3033/api/connect-core/callback",
    "Do not commit `.env.local`.",
    "Do not invent or document final public URLs before the project owner chooses them.",
    "Confirm real OAuth remains disabled when encrypted token storage is not configured.",
    "Sensitive values include:",
    "Raw callback payloads.",
    "Raw provider responses.",
    "Future renames require an approved compatibility-preserving migration plan.",
    "Do not report security vulnerabilities in public issues or public pull"
  ]
],
[
  "docs/gmail-local-oauth.md",
  [
    "# Archived Gmail Local OAuth Notes",
    "This document intentionally preserves historical context.",
    "It is not the current ConnectOS v1.0 Google OAuth setup guide.",
    "For the current v1.0 setup path, use [Google OAuth setup](GOOGLE_OAUTH_SETUP.md).",
    "Do not use archived notes to approve or infer:",
    "New APIs or databases.",
    "Product-specific business logic.",
    "http://localhost:3033/api/connect-core/callback",
    "Current docs:",
    "Compatibility Notes",
    "connect-core-token:v1",
    "universal_actions",
    "Future changes names require an approved compatibility-preserving migration plan."
  ]
],
[
  "docs/mvp-ship-readiness.md",
  [
    "# Archived MVP Ship Readiness Notes",
    "This document intentionally preserves historical context.",
    "It is not the current ConnectOS v1.0 release checklist.",
    "For current release-preparation guidance, use:",
    "Do not use archived notes to approve or infer:",
    "New APIs or databases.",
    "Product-specific business logic.",
    "current ConnectOS v1.0 release-preparation demo surface is `/connect-core`.",
    "Compatibility Notes",
    "connect-core-token:v1",
    "universal_actions",
    "Future changes names require an approved compatibility-preserving migration plan."
  ]
],
[
  "docs/observability.md",
  [
    "# Archived Observability Notes",
    "This document intentionally preserves historical context.",
    "It is not the current ConnectOS v1.0 observability guide.",
    "For current security, audit, and production-readiness guidance, use:",
    "Do not use archived notes to approve or infer:",
    "New APIs or databases.",
    "Product-specific business logic.",
    "Historical Events",
    "Current Compatibility-Preserving Notes",
    "connect-core-token:v1",
    "universal_actions",
    "Future changes names require an approved compatibility-preserving migration plan."
  ]
],
[
  "docs/PRODUCTION_CHECKLIST.md",
    [
    "Use this checklist before deploying ConnectOS beyond local demo mode.",
    "This production-readiness aid is not release approval and does not replace an environment-specific security review.",
    "Production preparation must preserve the current architecture and compatibility-sensitive names.",
    "Do not use this checklist to add new architecture, providers, connectors, Capabilities, Actions, Skills, Recipes, APIs, databases, product features, or product-specific business logic.",
      "## Deployment Safety Checks",
      "### Secrets",
      "### Direct OAuth",
      "### Composio",
      "### Debug Page",
      "### Logging",
      "### Rate Limiting",
      "## Compatibility Boundaries",
      "## Required Release Gate",
      "## Pre-Production Review",
      "## Public Release Decisions",
      "## Optional Production Hardening",
      "CONNECT_CORE_ENCRYPTION_KEY",
      "/connect-core/debug",
      "COMPOSIO_API_KEY",
      "COMPOSIO_AUTH_CONFIG_IDS",
    "Confirm Composio connected account identifiers are stored in connection metadata, not raw provider tokens.",
      "Confirm `/connect-core/debug` returns `404` in production.",
    "The release is not ready if any required gate fails.",
    "Do not publish v1.0 without a selected security reporting path unless the project owner explicitly accepts a pre-public exception.",
      "Future renames require an approved compatibility-preserving migration plan.",
      "pnpm release:check"
    ]
  ],
  [
    "docs/RELEASE_CHECKLIST.md",
    [
    "Use this checklist before tagging or publishing ConnectOS v1.0.",
      "Release preparation should improve quality without adding new platform features.",
      "## 1. Confirm Release Scope",
      "## 2. Confirm Required Documentation",
      "## 3. Confirm Public Positioning",
      "## 4. Confirm Security Readiness",
      "## 5. Confirm Compatibility-Sensitive Names",
      "## 6. Confirm GitHub Readiness",
      "## 7. Run Local Release Gates",
      "## 8. Confirm CI Release Gate",
      "## 9. Prepare Release-Candidate Commit",
      "## 10. Tag v1.0.0",
      "## Owner Decisions Before Public v1.0",
      "## Explicit Non-Blockers",
    "No new APIs or databases.",
    "ConnectOS is the open-source operating system for AI integrations.",
    "Do not publish public v1.0 without a selected private security reporting channel unless the project owner explicitly accepts a pre-public exception.",
      "Future renames require an approved compatibility-preserving migration plan.",
    "CI workflow includes the `v1 Release Quality Gates` job.",
      "pnpm release:check",
      "Do not guess owner-controlled release details in code, docs, package manifests, or GitHub settings.",
      "Renaming package scopes away from `@connect-any-inbox/*`."
    ]
],
[
  "docs/GITHUB_RELEASE_SETUP.md",
  [
    "# GitHub Release Setup",
    "Use this guide when preparing the public ConnectOS v1.0 repository.",
    "Complete owner decisions in [Pre-public owner decisions](PRE_PUBLIC_OWNER_DECISIONS.md) before finalizing public GitHub metadata.",
    "Do not publish placeholder repository URLs, security contacts, branch-protection state, maintainer handles, release dates, or package metadata URLs.",
    "Do not mark owner-controlled GitHub settings complete until the repository owner has verified them in GitHub.",
    "## Scope",
    "## 1. Repository Identity",
    "## 2. Topics",
    "## 3. Repository Features",
    "## 4. Security Settings",
    "## 5. Branch Protection",
    "## 6. Templates",
    "## 7. Package Metadata",
    "## 8. Release Candidate",
    "## 9. Release Tagging",
    "## 10. After Publication",
    "No new APIs or databases.",
    "No product-specific business logic.",
    "GitHub private vulnerability reporting",
    "Do not route security reports through public issues or public pull requests.",
    "ConnectOS CI",
    "v1 Release Quality Gates",
    "pnpm release-docs:check",
    "pnpm release:check",
    "connect-core-token:v1",
    "universal_actions",
    "Add public package metadata only after the final public GitHub organization, repository name, and repository URL are confirmed."
  ]
],
[
  "docs/GITHUB_TEMPLATE_READINESS.md",
  [
    "# GitHub Template Readiness",
    "ConnectOS is neutral infrastructure for AI applications.",
    "## Template Inventory",
    "## Protected Scope",
    "## Compatibility Names",
    "## Security Intake",
    "## Owner-Controlled Decisions",
    "## Verification",
    "No new APIs or databases.",
    "No product-specific business logic inside ConnectOS.",
    "connect-core-token:v1",
    "universal_actions",
    "Security reporting remains owner-controlled before public v1.0.",
    "GitHub templates and CI should not guess values:",
    "pnpm release:check"
  ]
],
[
  "docs/CONNECTOS_V1_RELEASE_STATUS.md",
  [
    "# ConnectOS v1.0 Release Status",
 "Recommendation: **READY FOR RELEASE-CANDIDATE REVIEW AFTER OWNER DECISIONS**",
    "Owner-controlled public release decisions",
    "neutral open-source infrastructure",
    "Compatibility-Sensitive Names",
    "`@connect-any-inbox/*`",
    "connect-core-token:v1",
    "universal_actions",
    "Future renames require an approved compatibility-preserving migration plan.",
    "pnpm release:check",
    "Single Recommended Next Task",
    "Resolve Pre-Public Owner Decisions",
    "Deferred Until After v1.0"
  ]
],
[
  "docs/RELEASE_CANDIDATE_READINESS.md",
 [
 "# ConnectOS Release-Candidate Readiness",
 "maintainer handoff aid. It is not release approval and not a feature plan",
 "## Current Assessment",
 "## Ready For Release-Candidate Review",
 "## Not Yet Ready For Public v1.0",
 "## Compatibility-Sensitive Names",
 "## Required Local Verification",
 "## Required CI Verification",
 "## Release Recommendation",
 "Do not tag or publish `v1.0.0` until owner-controlled decisions are resolved or explicit pre-public exceptions are documented.",
 "Final public GitHub organization, repository name, and repository URL.",
 "Private security reporting path.",
 "Branch protection required status checks.",
 "Future renames require an approved compatibility-preserving migration plan.",
 "connect-core-token:v1",
 "universal_actions",
 "pnpm release-docs:check",
 "pnpm release:check",
 "ConnectOS CI",
 "v1 Release Quality Gates"
 ]
],
[
"docs/PRE_PUBLIC_OWNER_DECISIONS.md",
[
  "# Pre-Public Owner Decisions",
  "owner decisions, not engineering feature work",
  "Do not guess final values in code, docs, package manifests, or GitHub settings.",
  "## Required Decisions",
  "### 1. Public GitHub Home",
  "Final public GitHub organization.",
  "Final repository name.",
  "Final public repository URL.",
  "### 2. Security Reporting Channel",
  "Enable GitHub private vulnerability reporting.",
  "Publish an owner-approved private security contact.",
  "### 3. Branch Protection",
  "Configure branch protection",
  "status checks",
  "v1 Release Quality Gates",
  "ConnectOS CI",
  "### 4. Package Metadata Timing",
      "Defer public package metadata until owner confirms final public repository URL.",
  "pnpm release:check",
  "### 5. Changelog Date",
  "CHANGELOG.md",
    "[v1.0.0] - YYYY-MM-DD",
    "### 6. Maintainer Handles And CODEOWNERS",
    ".github/CODEOWNERS",
    "### 7. Code Of Conduct",
    "CODE_OF_CONDUCT.md",
    "## Not Required Before v1.0",
  "## Compatibility Reminder",
  "connect-core-token:v1",
  "universal_actions",
  "Future renames require an approved compatibility-preserving migration plan."
]
],
[
  "docs/V1_RELEASE_READINESS_AUDIT.md",
  [
    "# ConnectOS v1.0 Release Readiness Audit",
    "This document is a release-readiness snapshot for ConnectOS v1.0 release",
    "Do not tag",
    "## Evidence Snapshot",
    "### Release Scope",
    "### Required Documentation",
    "### Package Metadata",
    "### Compatibility",
    "### Verification Gates",
    "## Current Release Blockers",
    "### 1. Public GitHub Home",
    "### 2. Security Reporting Channel",
    "### 3. Branch Protection",
    "### 4. Package Metadata Timing",
    "### 5. Changelog Date",
    "### 6. Maintainer CODEOWNERS Timing",
    "### 7. Code Of Conduct Timing",
    "## Explicit Non-Blockers",
    "## Recommendation",
    "No new APIs or databases.",
    "No product-specific business logic.",
    "connect-core-token:v1",
    "universal_actions",
    "pnpm release-docs:check",
    "pnpm release:check",
    "ConnectOS CI",
    "v1 Release Quality Gates",
    "Final public GitHub organization.",
    "Publish another owner-approved private security contact.",
    "Configure branch protection for `main`.",
    "release date"
  ]
],
[
  "docs/PRE_RELEASE_CHANGE_INVENTORY.md",
  [
      "# ConnectOS Pre-Release Change Inventory",
            "Release-candidate change grouping",
      "release remains focused",
    "## Snapshot Guidance",
    "git status --short",
    "git diff --stat",
 "Do not treat earlier changed-path counts as release facts.",
    "Do not commit generated or local-only artifacts:",
    "## Review Order",
    "### 1. Public Release Docs",
    "### 2. Platform Setup Docs",
    "### 3. GitHub Templates And CI",
    "### 4. Demo And Public UI Copy",
    "### 5. Platform Code And Tests",
    "### 6. Tooling And Package Metadata",
    "### 7. Historical Reference Docs",
    "## Compatibility-Sensitive Names",
    "connect-core-token:v1",
    "universal_actions",
    "Future renames require an approved compatibility-preserving migration plan.",
    "## Required Verification",
    "pnpm release-docs:check",
    "pnpm release:check",
    "ConnectOS CI",
    "v1 Release Quality Gates",
    "## Final Reviewer Questions",
    "Does every changed file support release preparation?",
    "Final Reviewer Questions"
  ]
  ],
  [
    "docs/RELEASE_CANDIDATE_CHANGE_GROUPING.md",
    [
      "# Release-Candidate Change Grouping",
      "Collect fresh evidence before final staging",
      "Do not treat earlier changed-path counts as release facts.",
    "Public Release Docs",
      "Platform Setup Docs",
      "GitHub Templates And CI",
      "Demo And Public UI Copy",
      "Platform Code And Tests",
      "Tooling And Package Metadata",
      "Historical Reference Docs",
      "Setup Examples And Manifests",
      "pnpm release-hygiene:check",
      "pnpm release:check",
      "Required Verification"
  ]
],
[
 "docs/RELEASE_STAGING_PLAN.md",
 [
 "# ConnectOS Release Staging Plan",
 "coherent review commits",
 "It is not release approval and not a feature plan.",
 "Do not treat earlier changed-path counts as release facts.",
 "## Scope",
 "No new architecture, providers, connectors, Capabilities, Actions, Skills,",
 "Recipes, APIs, databases, product features, or product-specific workflows.",
 "No guessed owner-controlled release values.",
 "No generated output, local secrets, logs, machine-local files, raw callback",
 "payloads, raw provider responses, or OAuth tokens.",
 "## Staging Principles",
 "Stage review commits by reviewer concern, not file extension alone:",
 "## Proposed Review Stages",
 "### 1. Public Release Docs",
 "### 2. Platform Setup Docs",
 "### 3. GitHub Templates And CI",
 "### 4. Demo And Public UI Copy",
 "### 5. Platform Code And Tests",
 "### 6. Tooling And Package Metadata",
 "### 7. Historical Reference Docs",
 "### 8. Setup Examples And Manifests",
 "## Required Final Gate",
 "pnpm release-hygiene:check",
 "pnpm release:check",
 "Any required gate failure blocks the release candidate."
 ]
],
[
"docs/PACKAGE_METADATA_AUDIT.md",
 [
 "# ConnectOS Package Metadata Audit",
 "neutral, private by default, pointed at the approved public repository URL",
 "This document is not release approval and does not replace",
 "## v1.0 Metadata Baseline",
 "`license`: `MIT`",
 "`author`: `ConnectOS contributors`",
 "`private`: `true`",
    "`repository`, `homepage`, and `bugs` fields point to `https://github.com/connectos-ai/connectos`",
 "The `@connect-any-inbox/*` package scope remains intentionally preserved for",
 "## Current Audit Result",
 "Status: PASS",
 "packages/connect-core/package.json",
 "Generated output, including `.next/`, `node_modules/`, and `*.tsbuildinfo`, is",
 "## Owner-Approved Public Repository",
 "Public repository URL: `https://github.com/connectos-ai/connectos`",
 "## Review Command",
 "Expected review result:",
 "Every checked manifest uses `https://github.com/connectos-ai/connectos`",
 "Generated `.next/` and `node_modules/` package manifests are excluded from",
 "## Compatibility-Sensitive Names",
 "connect-core-token:v1",
 "universal_actions",
 "Future renames require an approved compatibility-preserving migration plan.",
 "## Required Verification",
 "pnpm release-docs:check",
"pnpm release:check"
]
],
[
"docs/SESSION_TRANSFER.md",
[
"# Session Transfer",
"ConnectOS v1.0 release preparation",
"Do not add new architecture, providers, connectors, Capabilities, Actions,",
"## Latest Completed Task",
"## What Changed",
"## Files Changed",
"## Verification Passed",
"pnpm release-docs:check",
"pnpm release-metadata:check",
"pnpm release:check",
"## Compatibility Names To Preserve",
"connect-core-token:v1",
"universal_actions",
"## Remaining Owner-Controlled Release Decisions",
"Final public GitHub organization, repository name, and repository URL.",
"Private security reporting path.",
"Branch protection and required status checks.",
"Package metadata timing for `repository`, `homepage`, and `bugs` fields.",
"Maintainer handles and CODEOWNERS timing."
]
],
[
"docs/END_OF_SESSION_TRANSFER.md",
["# End-of-Session Transfer", "ConnectOS v1.0 release preparation", "Release-prep only.", "Do not add new architecture, providers, connectors, Capabilities, Actions,", "## Current Release Status", "## Latest Completed Task", "## Verification Passed", "pnpm release:check", "## Compatibility Names To Preserve", "connect-core-token:v1", "universal_actions", "## Recommended Next Task"]
],

[
"docs/prompts/QUICK_CONNECTOS_RELEASE_STATUS.md",
["# Quick ConnectOS Release Status Prompts", "docs/CONNECTOS_V1_RELEASE_STATUS.md", "Do not build features", "- add providers", "- add connectors", "- add Capabilities", "- add Actions", "- add Skills", "- add Recipes", "- add APIs", "- add databases", "pnpm release:check", "single highest-value next release-prep task", "Never mark an area release ready based only on documentation claims"]
],

[
"SPEC.md",
["Archived Spec", "historical marker", "ConnectOS v1.0 product specification"]
],
  [
    "tasks/plan.md",
    ["Archived Implementation Plan", "historical marker", "ConnectOS v1.0 release plan"]
  ],
  [
    "tasks/todo.md",
    ["Archived Todo", "historical marker", "ConnectOS v1.0 release checklist"]
  ],
  [
    ".github/ISSUE_TEMPLATE/bug_report.md",
    [
      "Use this template for reproducible problems in existing ConnectOS behavior.",
      "neutral infrastructure for AI applications",
      "## Security Notice",
      "Do not report security vulnerabilities in public issues or public pull",
      "## Scope Check",
      "## Compatibility Context",
      "connect-core-token:v1",
      "universal_actions",
      "## Verification",
      "pnpm release:check"
    ]
  ],
  [
    ".github/ISSUE_TEMPLATE/config.yml",
    [
      "blank_issues_enabled: false",
      "Keep v1.0 public issue intake focused and contributor-friendly.",
      "Use \"Bug report\" for reproducible problems in existing ConnectOS behavior.",
      "Do not use public issues for security vulnerabilities or sensitive material.",
      "Do not add placeholder repository URLs, security contacts, maintainer handles, or release dates during public issue intake for v1.0 release preparation.",
      "Keep security reports private until the project owner chooses a reporting path."
    ]
  ],
  [
    ".github/ISSUE_TEMPLATE/release_prep.md",
    [
      "Use this template for v1.0 release-quality work only.",
      "neutral infrastructure for AI applications",
      "## Owner Decision Needed",
      "## v1 Scope Check",
      "No new APIs or databases.",
      "No product-specific business logic inside ConnectOS.",
      "## Compatibility Context",
      "connect-core-token:v1",
      "universal_actions",
      "## Security And Secret Safety",
      "## Verification",
      "pnpm release:check",
      "pnpm release-docs:check"
    ]
  ],
  [
    ".github/PULL_REQUEST_TEMPLATE.md",
    [
      "## Summary",
      "## Type Of Change",
      "## v1 Release Scope Check",
      "## Compatibility Check",
      "## Security Check",
      "## Documentation Check",
      "## Verification",
      "## Risk Level",
      "No new APIs or databases.",
      "No product-specific business logic inside ConnectOS.",
      "connect-core-token:v1",
      "universal_actions",
      "pnpm release:check",
      "pnpm release-docs:check",
      "LOW",
      "MEDIUM",
      "HIGH"
    ]
  ],
  [
    ".github/workflows/ci.yml",
    [
      "name: ConnectOS CI",
      "Mirrors the v1.0 release checklist. Keep this workflow aligned with:",
      "Branch protection is an owner-managed GitHub setting.",
      "Keep the CI command identical to the local release gate.",
      "workflow_dispatch:",
      "pull_request:",
      "push:",
      "permissions:",
      "contents: read",
      "name: v1 Release Quality Gates",
      "runs-on: ubuntu-latest",
      "timeout-minutes: 15",
      "pnpm/action-setup@v4",
      "version: 10.14.0",
      "actions/setup-node@v4",
      "node-version: \"24\"",
      "pnpm install --frozen-lockfile",
      "pnpm release:check"
    ]
  ]
]);

const failures = [];
const releaseDocText = new Map();

function pathFor(relativePath) {
  return resolve(root, relativePath);
}

function read(relativePath) {
  return readFileSync(pathFor(relativePath), "utf8");
}

function readReleaseDoc(relativePath) {
  if (!releaseDocText.has(relativePath)) {
    releaseDocText.set(relativePath, read(relativePath));
  }
  return releaseDocText.get(relativePath);
}

function fail(message) {
  failures.push(message);
}

function quote(value) {
  return JSON.stringify(value);
}

function ensureExists(relativePath) {
  if (!existsSync(pathFor(relativePath))) {
    fail(`${relativePath}: missing release document`);
    return false;
  }
  return true;
}

function ensureTextIncludes(relativePath, text, phrases, label) {
  for (const phrase of phrases) {
    if (!text.includes(phrase)) {
      fail(`${relativePath}: missing ${label}: ${quote(phrase)}`);
    }
  }
}

function ensureTextDoesNotInclude(relativePath, text, phrases, label) {
  for (const phrase of phrases) {
    if (text.includes(phrase)) {
      fail(`${relativePath}: contains ${label}: ${quote(phrase)}`);
    }
  }
}

function isExternalLink(target) {
  return /^(https?:|mailto:)/.test(target);
}

function checkLocalMarkdownLinks(relativePath, text) {
  const linkPattern = /\[[^\]]+\]\(([^)]+)\)/g;
  for (const match of text.matchAll(linkPattern)) {
    const target = match[1].split("#")[0].trim();
    if (!target || isExternalLink(target)) continue;

    const resolved = resolve(root, dirname(relativePath), target);
    if (!existsSync(resolved)) {
      fail(`${relativePath}: broken local link ${match[1]}`);
    }
  }
}

function checkNoSecretLikeValues(relativePath, text) {
  for (const [label, pattern] of secretPatterns) {
    if (pattern.test(text)) {
      fail(`${relativePath}: contains secret-like value: ${label}`);
    }
  }
}

for (const relativePath of releaseDocs) {
  if (!ensureExists(relativePath)) continue;
  const text = readReleaseDoc(relativePath);
  ensureTextDoesNotInclude(relativePath, text, bannedProductTerms, "product-specific term");
  ensureTextDoesNotInclude(relativePath, text, roughPhrases, "rough phrase");
  checkNoSecretLikeValues(relativePath, text);
  if (relativePath.endsWith(".md")) {
    checkLocalMarkdownLinks(relativePath, text);
  }
}

for (const [relativePath, phrases] of requiredPhrases) {
  if (!ensureExists(relativePath)) continue;
  ensureTextIncludes(relativePath, readReleaseDoc(relativePath), phrases, "required phrase");
}

for (const relativePath of gateDocs) {
  if (!ensureExists(relativePath)) continue;
  ensureTextIncludes(relativePath, readReleaseDoc(relativePath), requiredGates, "release gate");
}

for (const relativePath of compatibilityDocs) {
  if (!ensureExists(relativePath)) continue;
  ensureTextIncludes(relativePath, readReleaseDoc(relativePath), compatibilityNames, "compatibility name");
}

if (failures.length > 0) {
  console.error(`Release documentation check failed: ${failures.length} issue(s)`);
  console.error("");
  console.error("Fix the release-readiness contract items below:");
  for (const failure of failures) {
    console.error(`- ${failure}`);
  }
  console.error("");
  console.error("Guidance:");
  console.error("- Public docs must position ConnectOS as neutral infrastructure for AI applications.");
  console.error("- Compatibility-sensitive names must stay documented until an approved migration exists.");
  console.error("- Do not add product-specific branding, rough notes, or secret-like values to release docs.");
  console.error("");
  console.error("Review docs/RELEASE_CHECKLIST.md, then rerun pnpm release-docs:check.");
  process.exit(1);
}

console.log(`Release documentation check passed: ${releaseDocs.length} files`);
