import { afterEach, describe, expect, it } from "vitest";
import { GET } from "./route";

const originalEnv = {
  GOOGLE_CLIENT_ID: process.env.GOOGLE_CLIENT_ID,
  GOOGLE_CLIENT_SECRET: process.env.GOOGLE_CLIENT_SECRET,
  GOOGLE_REDIRECT_URI: process.env.GOOGLE_REDIRECT_URI,
  NEXT_PUBLIC_APP_URL: process.env.NEXT_PUBLIC_APP_URL
};

describe("GET /api/connect/gmail/start", () => {
  afterEach(() => {
    process.env.GOOGLE_CLIENT_ID = originalEnv.GOOGLE_CLIENT_ID;
    process.env.GOOGLE_CLIENT_SECRET = originalEnv.GOOGLE_CLIENT_SECRET;
    process.env.GOOGLE_REDIRECT_URI = originalEnv.GOOGLE_REDIRECT_URI;
    process.env.NEXT_PUBLIC_APP_URL = originalEnv.NEXT_PUBLIC_APP_URL;
  });

  it("returns setup error when Google OAuth credentials are missing", async () => {
    delete process.env.GOOGLE_CLIENT_ID;
    delete process.env.GOOGLE_CLIENT_SECRET;

    const response = GET(new Request("http://localhost:3000/api/connect/gmail/start"));

    await expect(response.json()).resolves.toMatchObject({
      error: { code: "GMAIL_OAUTH_NOT_CONFIGURED" }
    });
    expect(response.status).toBe(500);
  });

  it("redirects to Google OAuth and sets state cookie", () => {
    process.env.GOOGLE_CLIENT_ID = "google-client-id";
    process.env.GOOGLE_CLIENT_SECRET = "google-client-secret";
    process.env.NEXT_PUBLIC_APP_URL = "http://localhost:3000";

    const response = GET(new Request("http://localhost:3000/api/connect/gmail/start"));

    expect(response.status).toBe(307);
    expect(response.headers.get("location")).toContain("accounts.google.com/o/oauth2/v2/auth");
    expect(response.headers.get("location")).toContain("client_id=google-client-id");
    expect(response.headers.get("location")).toContain(
      "scope=https%3A%2F%2Fwww.googleapis.com%2Fauth%2Fgmail.readonly"
    );
    expect(response.headers.get("set-cookie")).toContain(
      "connect_any_inbox_gmail_oauth_state="
    );
  });
});
