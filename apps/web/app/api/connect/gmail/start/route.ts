import { randomUUID } from "node:crypto";
import { NextResponse } from "next/server";
import {
  createGmailConnectUrl,
  getGmailStateCookieName,
  readGmailLocalConfig
} from "../../../../../lib/gmail-local";

export function GET(request: Request): NextResponse {
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

  const state = randomUUID();
  const response = NextResponse.redirect(
    createGmailConnectUrl({
      clientId: config.clientId,
      redirectUri: config.redirectUri,
      state
    })
  );

  response.cookies.set(getGmailStateCookieName(), state, {
    httpOnly: true,
    maxAge: 10 * 60,
    path: "/",
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production"
  });

  return response;
}
