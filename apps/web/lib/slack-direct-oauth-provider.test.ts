import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { InMemoryConnectCoreRepository, listIntegrations } from "@connect-any-inbox/connect-core";

import {
  applySlackProviderAvailability,
  resolveSlackOAuthState,
  SlackDirectOAuthProvider
} from "./slack-direct-oauth-provider";

const config = {
  clientId: "slack-client-id",
  clientSecret: "slack-client-secret",
  redirectUri: "http://localhost:3033/api/connect-core/callback"
};

describe("SlackDirectOAuthProvider", () => {
  beforeEach(() => {
    vi.stubEnv("CONNECT_CORE_ENCRYPTION_KEY", "test-encryption-key");
  });

  afterEach(() => {
    vi.unstubAllGlobals();
    vi.unstubAllEnvs();
  });

  it("creates a Slack OAuth URL with signed state", async () => {
    const repository = new InMemoryConnectCoreRepository();
    const provider = new SlackDirectOAuthProvider(config, repository);
    const slack = applySlackProviderAvailability(listIntegrations(), true).find(
      (integration) => integration.id === "slack"
    );

    if (!slack) {
      throw new Error("Expected Slack integration.");
    }

    const started = await provider.startConnection({
      userId: "local-demo-user",
      integration: slack,
      callbackUrl: config.redirectUri
    });
    const url = new URL(started.redirectUrl);
    const state = url.searchParams.get("state");

    expect(url.origin).toBe("https://slack.com");
    expect(url.pathname).toBe("/oauth/v2/authorize");
    expect(url.searchParams.get("client_id")).toBe(config.clientId);
    expect(url.searchParams.get("scope")).toContain("channels:read");
    expect(url.searchParams.get("scope")).toContain("chat:write");
    expect(state).toBeTruthy();
    expect(resolveSlackOAuthState(state as string, config)).toMatchObject({
      connectionId: started.connectionId,
      integrationId: "slack",
      userId: "local-demo-user"
    });
  });

  it("rejects tampered OAuth state", async () => {
    const repository = new InMemoryConnectCoreRepository();
    const provider = new SlackDirectOAuthProvider(config, repository);
    const slack = applySlackProviderAvailability(listIntegrations(), true).find(
      (integration) => integration.id === "slack"
    );

    if (!slack) {
      throw new Error("Expected Slack integration.");
    }

    const started = await provider.startConnection({
      userId: "local-demo-user",
      integration: slack,
      callbackUrl: config.redirectUri
    });
    const state = new URL(started.redirectUrl).searchParams.get("state");

    expect(() => resolveSlackOAuthState(`${state}tampered`, config)).toThrow("Invalid OAuth state.");
  });

  it("exchanges a callback code, stores encrypted token placeholder, and validates auth.test", async () => {
    const repository = new InMemoryConnectCoreRepository();
    const provider = new SlackDirectOAuthProvider(config, repository);
    const slack = applySlackProviderAvailability(listIntegrations(), true).find(
      (integration) => integration.id === "slack"
    );

    if (!slack) {
      throw new Error("Expected Slack integration.");
    }

    vi.stubGlobal(
      "fetch",
      vi
        .fn()
        .mockResolvedValueOnce({
          json: async () => ({
            ok: true,
            access_token: "xoxb-secret-token",
            scope: "channels:read,chat:write",
            team: { id: "T123", name: "Test Team" },
            bot_user_id: "B123"
          })
        })
        .mockResolvedValueOnce({
          json: async () => ({
            ok: true,
            team_id: "T123",
            team: "Test Team",
            bot_id: "B123"
          })
        })
    );

    const started = await provider.startConnection({
      userId: "local-demo-user",
      integration: slack,
      callbackUrl: config.redirectUri
    });
    const state = new URL(started.redirectUrl).searchParams.get("state");

    await repository.saveConnection({
      id: started.connectionId,
      userId: "local-demo-user",
      integrationId: "slack",
      providerKey: "direct-oauth",
      status: "pending",
      permissions: slack.scopes,
      metadata: started.metadata,
      redirectUrl: started.redirectUrl,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    });

    const connection = await repository.getConnection(started.connectionId);
    if (!connection || !state) {
      throw new Error("Expected pending Slack connection and state.");
    }

    const patch = await provider.completeConnection({
      connection,
      callbackPayload: {
        connectionId: started.connectionId,
        code: "callback-code",
        state,
        status: "success"
      }
    });
    const tokens = await repository.listOAuthTokens(started.connectionId);

    expect(patch).toMatchObject({ status: "connected", externalAccountId: "T123" });
    expect(tokens).toHaveLength(1);
    expect(tokens[0]?.tokenRef).toContain("connect-core-token:v1");
    expect(tokens[0]?.tokenRef).not.toContain("xoxb-secret-token");

    const health = await provider.testConnection({ connection: { ...connection, status: "connected" } });
    expect(health).toMatchObject({
      health: "healthy",
      status: "connected",
      message: "Slack auth.test passed for Test Team."
    });
  });
});
