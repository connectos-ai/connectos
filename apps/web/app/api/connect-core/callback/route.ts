import { NextResponse, type NextRequest } from "next/server";

import { rateLimit } from "../../../../lib/connect-core-rate-limit";
import { completeConnectCoreConnection } from "../../../../lib/connect-core-service";
import {
  getGoogleOAuthConfig,
  resolveGoogleOAuthState
} from "../../../../lib/google-direct-oauth-provider";
import {
  getSlackOAuthConfig,
  resolveSlackOAuthState
} from "../../../../lib/slack-direct-oauth-provider";

export async function GET(request: NextRequest) {
  const limited = rateLimit(request, "callback");
  if (limited) return limited;

  let connectionId = request.nextUrl.searchParams.get("connectionId") ?? undefined;
  const code = request.nextUrl.searchParams.get("code") ?? undefined;
  const state = request.nextUrl.searchParams.get("state") ?? undefined;
  const error = request.nextUrl.searchParams.get("error") ?? undefined;
  const errorDescription = request.nextUrl.searchParams.get("error_description") ?? undefined;
  const status = request.nextUrl.searchParams.get("status");
  const externalAccountId = request.nextUrl.searchParams.get("connected_account_id");

  if (state) {
    const googleConfig = getGoogleOAuthConfig();
    const slackConfig = getSlackOAuthConfig();

    if (!googleConfig && !slackConfig) {
      return NextResponse.redirect(new URL("/connect-core?status=missing_oauth_config", request.url));
    }

    try {
      if (googleConfig) {
        connectionId = resolveGoogleOAuthState(state, googleConfig).connectionId;
      }
    } catch {
      connectionId = undefined;
    }

    try {
      if (!connectionId && slackConfig) {
        connectionId = resolveSlackOAuthState(state, slackConfig).connectionId;
      }
    } catch {
      connectionId = undefined;
    }

    if (!connectionId) {
      return NextResponse.redirect(new URL("/connect-core?status=invalid_state", request.url));
    }
  }

  if (!connectionId) {
    return NextResponse.redirect(new URL("/connect-core?status=failed", request.url));
  }

  await completeConnectCoreConnection({
    connectionId,
    code,
    state,
    error,
    errorDescription,
    status: error || status === "failed" ? "failed" : "success",
    externalAccountId: externalAccountId ?? undefined
  });

  return NextResponse.redirect(
    new URL(error ? "/connect-core?status=cancelled" : "/connect-core?status=connected", request.url)
  );
}
