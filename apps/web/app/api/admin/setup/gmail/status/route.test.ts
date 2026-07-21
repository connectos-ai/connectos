import { afterEach, describe, expect, it } from "vitest";
import { GET } from "./route";

const originalEnv = {
  GOOGLE_CLIENT_ID: process.env.GOOGLE_CLIENT_ID,
  GOOGLE_CLIENT_SECRET: process.env.GOOGLE_CLIENT_SECRET
};

describe("GET /api/admin/setup/gmail/status", () => {
  afterEach(() => {
    process.env.GOOGLE_CLIENT_ID = originalEnv.GOOGLE_CLIENT_ID;
    process.env.GOOGLE_CLIENT_SECRET = originalEnv.GOOGLE_CLIENT_SECRET;
  });

  it("returns missing setup status", async () => {
    delete process.env.GOOGLE_CLIENT_ID;
    delete process.env.GOOGLE_CLIENT_SECRET;

    const response = GET();

    await expect(response.json()).resolves.toEqual({
      ready: false,
      missing: ["GOOGLE_CLIENT_ID", "GOOGLE_CLIENT_SECRET"],
      message: "Gmail needs admin setup before users can connect."
    });
  });

  it("returns ready setup status", async () => {
    process.env.GOOGLE_CLIENT_ID = "google-client-id";
    process.env.GOOGLE_CLIENT_SECRET = "google-client-secret";

    const response = GET();

    await expect(response.json()).resolves.toEqual({
      ready: true,
      missing: [],
      message: "Gmail is ready for users to connect."
    });
  });
});
