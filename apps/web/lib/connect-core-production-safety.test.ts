import { afterEach, describe, expect, it, vi } from "vitest";

import { getGoogleOAuthConfig } from "./google-direct-oauth-provider";
import { getSlackOAuthConfig } from "./slack-direct-oauth-provider";

describe("Connect Core production safety", () => {
  afterEach(() => {
    vi.unstubAllEnvs();
    vi.restoreAllMocks();
  });

  it("prevents real direct OAuth config when token encryption key is missing", () => {
    vi.spyOn(console, "warn").mockImplementation(() => {});

    expect(
      getGoogleOAuthConfig({
        GOOGLE_CLIENT_ID: "google-client-id",
        GOOGLE_CLIENT_SECRET: "google-client-secret",
        GOOGLE_REDIRECT_URI: "http://localhost:3033/api/connect-core/callback"
      } as unknown as NodeJS.ProcessEnv)
    ).toBeNull();
    expect(
      getSlackOAuthConfig({
        SLACK_CLIENT_ID: "slack-client-id",
        SLACK_CLIENT_SECRET: "slack-client-secret",
        SLACK_REDIRECT_URI: "http://localhost:3033/api/connect-core/callback"
      } as unknown as NodeJS.ProcessEnv)
    ).toBeNull();
  });
});
