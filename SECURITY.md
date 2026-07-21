# Security Policy

ConnectOS handles OAuth flows, connection metadata, encrypted token references,
health checks, and audit events. It is neutral open-source infrastructure for AI
applications, so security guidance must be clear for self-hosters, contributors,
and future maintainers.

The core security rule is simple: secrets and tokens must never be exposed.

## Supported Versions

ConnectOS is preparing for its public v1.0 release. Until v1.0 is published,
security fixes should target the current release-preparation branch and preserve
backward compatibility for existing routes, environment variables, package
names, token reference formats, and documented API behavior.

## Security Model

ConnectOS supports three provider modes:

- `mock`: local demo provider with no third-party credentials.
- `direct-oauth`: app-owned OAuth clients for supported providers, currently
Google and Slack.
- `composio`: Composio-managed connected accounts.

Direct OAuth stores encrypted token payloads through `oauth_tokens.tokenRef`.
Composio-backed integrations do not store raw provider tokens in ConnectOS. They
store Composio connected account identifiers in connection metadata.

## Required Secret

Set this secret before enabling real Google or Slack OAuth:

```bash
CONNECT_CORE_ENCRYPTION_KEY="a-long-random-secret"
```

Use a 32-byte base64 key, 64-character hex key, or long random passphrase. In
production, prefer a generated 32-byte secret stored in your deployment secret
manager.

If `CONNECT_CORE_ENCRYPTION_KEY` is missing, ConnectOS disables real Google and
Slack OAuth and falls back to mock mode where supported. This keeps real OAuth
tokens out of storage until secure token encryption is configured.

## OAuth State Callback Safety

OAuth callbacks must:

- Validate state.
- Reject expired state.
- Reject reused state.
- Handle denied or canceled authorization cleanly.
- Store tokens only through repository token methods.
- Never log OAuth tokens, refresh tokens, token references, authorization codes,
raw callback payloads, or raw provider responses.

Sensitive findings include:

- Token exposure.
- Token reference exposure.
- Authorization-code exposure.
- Raw callback payload exposure.
- Raw provider response exposure.
- Debug-page or production-safety bypasses.

If report might expose secrets or vulnerability details, treat it as private
until a maintainer confirms otherwise.

## Debug Page Safety

`/connect-core/debug` is development-only and returns `404` in production.

Debug output may show:

- Whether provider environment variables are configured.
- Redirect URI values.
- Provider mode.
- Last connection event summary.
- Last health check summary.

Debug output must not show:

- OAuth tokens.
- Refresh tokens.
- Token references.
- API keys.
- Client secrets.
- Encryption keys.
- Raw callback payloads.
- Raw provider responses.

Debug-page or production-safety bypasses must be treated as sensitive findings.

## Audit Logs

Connection lifecycle events are persisted in `connection_events` and emitted as
structured JSON logs with `scope: "connect-core"` and `audit: true`.

Audit logs may include:

- IDs.
- Provider keys.
- Event types.
- Status or health metadata.
- Timestamps.

Audit logs must not include:

- OAuth tokens.
- API keys.
- Client secrets.
- Encryption keys.
- Token references.
- Raw callback payloads.
- Raw provider responses.

## Reporting Security Issues

Do not report security vulnerabilities in public issues or public pull requests.

Before public v1.0, the project owner must choose the private reporting path.
Expected options are:

- GitHub private vulnerability reporting.
- Another owner-approved private security contact.

Until a private reporting channel is selected, do not publish sensitive findings
in public issues, public pull requests, discussions, screenshots, logs,
documentation, or shared chat.

Sensitive findings include:

- OAuth token, refresh token, authorization code, API key, client secret, or
encryption-key exposure.
- Token reference exposure.
- Raw callback payload exposure.
- Raw provider response exposure.
- Debug-page or production-safety bypasses.
- Any issue that could help bypass OAuth state validation, token encryption,
rate limiting, production debug blocking, or audit-log redaction.

If a report might expose secrets or vulnerability details, treat it as private
until a maintainer confirms otherwise.

Security-reporting wording anchors:

- Until private reporting channel is selected, do not publish sensitive findings.
- If report might expose secrets or vulnerability details, treat it as private.
- Until private reporting channel selected, do not publish sensitive findings.
- If report might expose secrets vulnerability details, treat private.
- Until a private reporting channel is selected, do not publish sensitive findings.
- If a report might expose secrets or vulnerability details, treat it as private.

Release guardrail: product-specific workflows and business logic do not belong
in ConnectOS release-preparation work.

## Production Security Checklist

Before enabling real providers in production, confirm:

- `CONNECT_CORE_ENCRYPTION_KEY` is set in the deployment secret manager.
- Google redirect URIs point to the deployed `/api/connect-core/callback` URL.
- Slack redirect URIs point to the deployed `/api/connect-core/callback` URL.
- `NEXT_PUBLIC_APP_URL` matches the deployed public origin.
- `/connect-core/debug` returns `404` in production.
- Logs do not expose tokens, token references, raw provider responses, or raw
callback payloads.
- Rate limiting matches the deployment topology.
- Composio connected account identifiers are stored in connection metadata, not
raw provider tokens.

See [production checklist](docs/PRODUCTION_CHECKLIST.md) for full
production-readiness guidance.

## Compatibility-Sensitive Names

Security work must preserve:

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

## Required Release Gate

Before merging security-policy or security-adjacent release-prep changes, run:

```bash
pnpm release:check
```

`pnpm release:check` runs:

- `pnpm release-docs:check`
- `pnpm release-metadata:check`
- `pnpm release-hygiene:check`
- `pnpm test`
- `pnpm lint`
- `pnpm typecheck`
- `pnpm prisma:validate`
- `pnpm build`

Documentation-only changes still require the full release gate during v1.0
preparation.

## v1 Release Scope

Release-preparation work must not add new providers, connectors, Capabilities,
Actions, Skills, Recipes, APIs, databases, architecture, product features, or
product-specific workflows without explicit scope approval.
