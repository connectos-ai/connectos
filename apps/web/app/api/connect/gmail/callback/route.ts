import { NextRequest, NextResponse } from "next/server";
import {
  completeLocalGmailOAuth,
  getGmailStateCookieName,
  readGmailLocalConfig
} from "../../../../../lib/gmail-local";

export async function GET(request: NextRequest): Promise<NextResponse> {
  const requestUrl = new URL(request.url);
  const error = requestUrl.searchParams.get("error");

  if (error) {
    return redirectToConnect(request, `gmail=error&reason=${encodeURIComponent(error)}`);
  }

  const code = requestUrl.searchParams.get("code");
  const state = requestUrl.searchParams.get("state");
  const expectedState = request.cookies.get(getGmailStateCookieName())?.value;
  const config = readGmailLocalConfig(request);

  if (!config) {
    return NextResponse.json(
      {
        error: {
          code: "GMAIL_OAUTH_NOT_CONFIGURED",
          message: "Set GOOGLE_CLIENT_ID and GOOGLE_CLIENT_SECRET before connecting Gmail."
        }
      },
      { status: 500 }
    );
  }

  if (!code || !state || !expectedState) {
    return NextResponse.json(
      {
        error: {
          code: "GMAIL_OAUTH_CALLBACK_INVALID",
          message: "Gmail OAuth callback was missing code or state."
        }
      },
      { status: 400 }
    );
  }

  await completeLocalGmailOAuth({ code, config, expectedState, state });

  const response = redirectToConnect(request, "gmail=connected");
  response.cookies.delete(getGmailStateCookieName());

  return response;
}

function redirectToConnect(request: Request, query: string): NextResponse {
  return NextResponse.redirect(new URL(`/connect?${query}`, request.url));
}
