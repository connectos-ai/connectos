import { afterEach, describe, expect, it } from "vitest";
import { getGmailSetupReadiness } from "./gmail-local";

const originalEnv = {
  GOOGLE_CLIENT_ID: process.env.GOOGLE_CLIENT_ID,
  GOOGLE_CLIENT_SECRET: process.env.GOOGLE_CLIENT_SECRET
};

describe("gmail local setup readiness", () => {
  afterEach(() => {
    process.env.GOOGLE_CLIENT_ID = originalEnv.GOOGLE_CLIENT_ID;
    process.env.GOOGLE_CLIENT_SECRET = originalEnv.GOOGLE_CLIENT_SECRET;
  });

  it("reports missing Google OAuth setup", () => {
    delete process.env.GOOGLE_CLIENT_ID;
    delete process.env.GOOGLE_CLIENT_SECRET;

    expect(getGmailSetupReadiness()).toEqual({
      ready: false,
      missing: ["GOOGLE_CLIENT_ID", "GOOGLE_CLIENT_SECRET"],
      message: "Gmail needs admin setup before users can connect."
    });
  });

  it("reports ready when required Google OAuth settings exist", () => {
    process.env.GOOGLE_CLIENT_ID = "google-client-id";
    process.env.GOOGLE_CLIENT_SECRET = "google-client-secret";

    expect(getGmailSetupReadiness()).toEqual({
      ready: true,
      missing: [],
      message: "Gmail is ready for users to connect."
    });
  });
});
