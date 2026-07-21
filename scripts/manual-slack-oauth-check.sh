#!/usr/bin/env bash
set -euo pipefail

base_url="${CONNECT_CORE_BASE_URL:-http://localhost:3033}"
callback_url="${base_url}/api/connect-core/callback"

cat <<EOF
Slack OAuth manual verification checklist

This script prints a checklist only. It does not read, validate, or print secrets.

Before starting:
1. Set SLACK_CLIENT_ID, SLACK_CLIENT_SECRET, and SLACK_REDIRECT_URI.
2. Set CONNECT_CORE_ENCRYPTION_KEY.
3. Set DATABASE_URL if you want persistence across server restarts.
4. Restart the dev server.
5. Open: ${base_url}/connect-core/debug
6. Confirm Slack env configured says "Yes".
7. Confirm the redirect URI is:
   ${callback_url}
8. Confirm Slack provider mode shows "real-oauth".
9. Confirm no tokens, token references, client secrets, refresh tokens, raw callback payloads, or raw provider responses are displayed.

Slack:
1. Open: ${base_url}/connect-core
2. Confirm the Slack badge says "Slack OAuth".
3. Click Slack Connect.
4. Complete Slack consent.
5. Confirm you return to /connect-core and Slack is Connected.
6. Refresh the page and confirm Slack remains Connected.
7. Click the health check control.
8. Confirm health is connected or healthy.
9. Open: ${base_url}/connect-core/debug
10. Confirm Slack shows a last connection event and last health check.
11. Click Slack Disconnect.
12. Refresh and confirm Slack is disconnected.

Security checks:
- Do not paste tokens anywhere.
- The debug page must not show access tokens, refresh tokens, token references, client secrets, raw callback payloads, or raw provider responses.
- Server logs must not include OAuth token values.
EOF
