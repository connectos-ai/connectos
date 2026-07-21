#!/usr/bin/env bash
set -euo pipefail

base_url="${CONNECT_CORE_BASE_URL:-http://localhost:3033}"
callback_url="${base_url}/api/connect-core/callback"

cat <<EOF
Google OAuth manual verification checklist

This script prints a checklist only. It does not read, validate, or print secrets.

Before starting:
1. Set GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET, and GOOGLE_REDIRECT_URI.
2. Set CONNECT_CORE_ENCRYPTION_KEY.
3. Set DATABASE_URL if you want persistence across server restarts.
4. Restart the dev server.
5. Open: ${base_url}/connect-core/debug
6. Confirm Google env configured says "Yes".
7. Confirm the redirect URI is:
   ${callback_url}
8. Confirm Gmail and Google Calendar provider modes show "real-oauth".
9. Confirm no tokens, token references, client secrets, raw callback payloads, or raw provider responses are displayed.

Gmail:
1. Open: ${base_url}/connect-core
2. Confirm the Gmail badge says "Google OAuth".
3. Click Gmail Connect.
4. Complete Google consent.
5. Confirm you return to /connect-core and Gmail is Connected.
6. Refresh the page and confirm Gmail remains Connected.
7. Click the health check control.
8. Confirm health is connected or healthy.
9. Open: ${base_url}/connect-core/debug
10. Confirm Gmail shows a last connection event and last health check.
11. Click Gmail Disconnect.
12. Refresh and confirm Gmail is disconnected.

Google Calendar:
1. Open: ${base_url}/connect-core
2. Confirm the Google Calendar badge says "Google OAuth".
3. Click Google Calendar Connect.
4. Complete Google consent.
5. Confirm you return to /connect-core and Google Calendar is Connected.
6. Refresh the page and confirm Google Calendar remains Connected.
7. Click the health check control.
8. Confirm health is connected or healthy.
9. Open: ${base_url}/connect-core/debug
10. Confirm Google Calendar shows a last connection event and last health check.
11. Click Google Calendar Disconnect.
12. Refresh and confirm Google Calendar is disconnected.

Security checks:
- Do not paste tokens anywhere.
- The debug page must not show access tokens, refresh tokens, token references, client secrets, raw callback payloads, or raw provider responses.
- Server logs must not include OAuth token values.
EOF
