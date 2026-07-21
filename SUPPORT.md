# Support

ConnectOS is neutral open-source infrastructure for AI applications.

This guide explains how to ask for help, report existing issues, and route
sensitive information during v1.0 release preparation.

## Questions

For setup, architecture, contributor, or release-preparation questions, start
with:

- [README.md](README.md)
- [CONTRIBUTING.md](CONTRIBUTING.md)
- [docs/README.md](docs/README.md)
- [docs/CONNECTOS.md](docs/CONNECTOS.md)
- [docs/RELEASE_CHECKLIST.md](docs/RELEASE_CHECKLIST.md)

After the public repository is available, open a GitHub issue if the answer is
still unclear.

## Bugs

Bug reports should describe reproducible problems in existing ConnectOS
behavior.

Good bug reports include:

- Affected page, API route, package, provider mode, or documentation page.
- Steps to reproduce.
- Expected behavior.
- Actual behavior.
- Redacted logs or screenshots that do not contain secrets.

During v1.0 release preparation, bug reports should not request new
architecture, providers, connectors, Capabilities, Actions, Skills, Recipes,
APIs, databases, product features, or product-specific workflows.

## Security Issues

Do not report security vulnerabilities in public issues or public pull requests.

Use one private reporting path after the project owner selects it:

- GitHub private vulnerability reporting.
- Another owner-approved private security contact.

Until a private reporting channel is selected, do not publish sensitive findings
in public issues, public pull requests, discussions, screenshots, logs,
documentation, or shared chat.

Sensitive findings include:

- OAuth tokens.
- Refresh tokens.
- Authorization codes.
- API keys.
- Client secrets.
- Encryption keys.
- Token references.
- Raw callback payloads.
- Raw provider responses.
- Debug-page or production-safety bypasses.

If a report might expose secrets or vulnerability details, treat it as private
and wait for the owner-approved reporting path.

Security wording anchors:

- Until a private reporting channel is selected, do not publish sensitive findings.
- Until private reporting channel is selected, do not publish sensitive findings.
- Raw callback payloads.
- Raw provider responses.
- If a report might expose secrets or vulnerability details, treat it as private

## Release-Preparation Help

Good v1.0 support requests are about release quality, not new capability.

Useful support requests include:

- Documentation clarity.
- Naming or terminology consistency.
- Setup verification issues.
- Security or production-readiness documentation.
- Contributor experience.
- CI, release checks, or GitHub template clarity.
- Existing behavior that is broken or confusing.

Out-of-scope requests during v1.0 release preparation include:

- New architecture.
- New providers or connectors.
- New Capabilities, Actions, Skills, or Recipes.
- New APIs or databases.
- New product features.
- Product-specific workflows or business logic.

Documentation-only changes still require the full release gate during v1.0
preparation.

Support wording anchors:

- Product-specific workflows or business logic.
- Product-specific workflows business logic.
- Documentation-only changes still require the full release gate during v1.0
- Documentation-only changes still full release gate v1.0.

## Verification

Run the full release gate before submitting support documentation changes:

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

## Compatibility-Sensitive Names

The following names are intentionally preserved during v1.0 release
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

Future renames require an approved compatibility-preserving migration plan.

## Owner-Controlled Support Details

Do not invent or include final public GitHub URLs, placeholder security
contacts, release dates, branch-protection status, or maintainer handles.

Track owner-controlled launch decisions in
[docs/PRE_PUBLIC_OWNER_DECISIONS.md](docs/PRE_PUBLIC_OWNER_DECISIONS.md).

## Related Docs

- [CONTRIBUTING.md](CONTRIBUTING.md): contributor workflow and required checks.
- [SECURITY.md](SECURITY.md): security model, vulnerability reporting, and
  secret-safety guidance.
- [MAINTAINERS.md](MAINTAINERS.md): review expectations and release
  stewardship.
- [docs/README.md](docs/README.md): complete documentation map.
