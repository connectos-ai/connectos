import { renderToStaticMarkup } from "react-dom/server";
import { afterEach, describe, expect, it, vi } from "vitest";

describe("ConnectCoreDebugPage", () => {
  afterEach(() => {
    vi.resetModules();
    vi.unstubAllEnvs();
  });

  it("blocks the debug page in production", async () => {
    vi.stubEnv("NODE_ENV", "production");

    const { default: ConnectCoreDebugPage } = await import("./page");

    await expect(ConnectCoreDebugPage()).rejects.toThrow("NEXT_HTTP_ERROR_FALLBACK;404");
  });

  it("renders local provider status without exposing secrets", async () => {
    vi.stubEnv("NODE_ENV", "development");
    vi.doMock("../../../lib/connect-core-service", () => ({
      getConnectCoreDebugInfo: async () => ({
        composioBaseUrl: "https://api.composio.dev",
        composioConfigured: true,
        composioMappings: [
          {
            authConfigId: "auth_config_public_id",
            integrationId: "gmail",
            name: "Gmail",
            toolkitSlug: "gmail"
          }
        ],
        googleConfigured: true,
        googleRedirectUri: "http://localhost:3033/api/connect-core/callback",
        isProduction: false,
        oauthIntegrations: [
          {
            connectionHealth: "healthy",
            connectionStatus: "connected",
            id: "gmail",
            lastConnectionEvent: {
              occurredAt: "2026-07-11T00:00:00.000Z",
              type: "connect.completed"
            },
            lastHealthCheck: {
              health: "healthy",
              message: "Connected",
              updatedAt: "2026-07-11T00:00:00.000Z"
            },
            name: "Gmail",
            providerMode: "real-oauth",
            providerStatus: "Google OAuth"
          }
        ],
        slackConfigured: false,
        slackRedirectUri: null
      })
    }));

    const { default: ConnectCoreDebugPage } = await import("./page");
    const html = renderToStaticMarkup(await ConnectCoreDebugPage());

    expect(html).toContain("Local-only status for OAuth and Composio setup");
    expect(html).toContain("Secret and token visibility");
    expect(html).toContain("Never displayed on this page");
    expect(html).toContain("Provider mode");
    expect(html).toContain("Google OAuth");
    expect(html).not.toContain("access_token");
    expect(html).not.toContain("refresh_token");
    expect(html).not.toContain("client_secret");
  });
});
