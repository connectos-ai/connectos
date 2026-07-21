import { afterEach, describe, expect, it } from "vitest";
import { NextRequest } from "next/server";
import { GET } from "./route";

const originalEnv = {
  GOOGLE_CLIENT_ID: process.env.GOOGLE_CLIENT_ID,
  GOOGLE_CLIENT_SECRET: process.env.GOOGLE_CLIENT_SECRET
};

describe("GET /api/connect/gmail/callback", () => {
  afterEach(() => {
    process.env.GOOGLE_CLIENT_ID = originalEnv.GOOGLE_CLIENT_ID;
    process.env.GOOGLE_CLIENT_SECRET = originalEnv.GOOGLE_CLIENT_SECRET;
  });

  it("returns setup error when Google OAuth credentials are missing", async () => {
    delete process.env.GOOGLE_CLIENT_ID;
    delete process.env.GOOGLE_CLIENT_SECRET;

    const response = await GET(
      new NextRequest("http://localhost:3000/api/connect/gmail/callback?code=abc&state=state")
    );

    await expect(response.json()).resolves.toMatchObject({
      error: { code: "GMAIL_OAUTH_NOT_CONFIGURED" }
    });
    expect(response.status).toBe(500);
  });

  it("rejects callback missing code or state", async () => {
    process.env.GOOGLE_CLIENT_ID = "google-client-id";
    process.env.GOOGLE_CLIENT_SECRET = "google-client-secret";

    const response = await GET(
      new NextRequest("http://localhost:3000/api/connect/gmail/callback")
    );

    await expect(response.json()).resolves.toMatchObject({
      error: { code: "GMAIL_OAUTH_CALLBACK_INVALID" }
    });
    expect(response.status).toBe(400);
  });
});
