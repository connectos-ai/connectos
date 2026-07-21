import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { InMemoryConnectCoreRepository, listIntegrations } from "@connect-any-inbox/connect-core";

import {
  applyGoogleProviderAvailability,
  GoogleDirectOAuthProvider,
  resolveGoogleOAuthState
} from "./google-direct-oauth-provider";

const config = {
  clientId: "google-client-id",
  clientSecret: "google-client-secret",
  redirectUri: "http://localhost:3033/api/connect-core/callback"
};

describe("GoogleDirectOAuthProvider", () => {
  beforeEach(() => {
    vi.stubEnv("CONNECT_CORE_ENCRYPTION_KEY", "test-encryption-key");
  });

  afterEach(() => {
    vi.unstubAllGlobals();
    vi.unstubAllEnvs();
  });

  it("creates a Google OAuth URL with signed state for Gmail", async () => {
    const repository = new InMemoryConnectCoreRepository();
    const provider = new GoogleDirectOAuthProvider(config, repository);
    const gmail = applyGoogleProviderAvailability(listIntegrations(), true).find(
      (integration) => integration.id === "gmail"
    );

    if (!gmail) {
      throw new Error("Expected Gmail integration.");
    }

    const started = await provider.startConnection({
      userId: "local-demo-user",
      integration: gmail,
      callbackUrl: config.redirectUri
    });
    const url = new URL(started.redirectUrl);
    const state = url.searchParams.get("state");

    expect(url.origin).toBe("https://accounts.google.com");
    expect(url.searchParams.get("client_id")).toBe(config.clientId);
    expect(url.searchParams.get("scope")).toContain("gmail.readonly");
    expect(state).toBeTruthy();
    expect(resolveGoogleOAuthState(state as string, config)).toMatchObject({
      connectionId: started.connectionId,
      integrationId: "gmail",
      userId: "local-demo-user"
    });
  });

  it("rejects tampered OAuth state", async () => {
    const repository = new InMemoryConnectCoreRepository();
    const provider = new GoogleDirectOAuthProvider(config, repository);
    const gmail = applyGoogleProviderAvailability(listIntegrations(), true).find(
      (integration) => integration.id === "gmail"
    );

    if (!gmail) {
      throw new Error("Expected Gmail integration.");
    }

    const started = await provider.startConnection({
      userId: "local-demo-user",
      integration: gmail,
      callbackUrl: config.redirectUri
    });
    const state = new URL(started.redirectUrl).searchParams.get("state");

    expect(() => resolveGoogleOAuthState(`${state}tampered`, config)).toThrow("Invalid OAuth state.");
  });

  it("exchanges a callback code, stores encrypted token placeholder, and validates Gmail health", async () => {
    const repository = new InMemoryConnectCoreRepository();
    const provider = new GoogleDirectOAuthProvider(config, repository);
    const gmail = applyGoogleProviderAvailability(listIntegrations(), true).find(
      (integration) => integration.id === "gmail"
    );

    if (!gmail) {
      throw new Error("Expected Gmail integration.");
    }

    vi.stubGlobal(
      "fetch",
      vi
        .fn()
        .mockResolvedValueOnce({
          json: async () => ({
            access_token: "access-token-secret",
            refresh_token: "refresh-token-secret",
            expires_in: 3600,
            scope: "openid email https://www.googleapis.com/auth/gmail.readonly"
          })
        })
        .mockResolvedValueOnce({ ok: true })
    );

    const started = await provider.startConnection({
      userId: "local-demo-user",
      integration: gmail,
      callbackUrl: config.redirectUri
    });
    const state = new URL(started.redirectUrl).searchParams.get("state");

    await repository.saveConnection({
      id: started.connectionId,
      userId: "local-demo-user",
      integrationId: "gmail",
      providerKey: "direct-oauth",
      status: "pending",
      permissions: gmail.scopes,
      metadata: started.metadata,
      redirectUrl: started.redirectUrl,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    });

    const connection = await repository.getConnection(started.connectionId);
    if (!connection || !state) {
      throw new Error("Expected pending connection and state.");
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

    expect(patch).toMatchObject({ status: "connected" });
    expect(tokens).toHaveLength(1);
    expect(tokens[0]?.tokenRef).toContain("connect-core-token:v1");
    expect(tokens[0]?.tokenRef).not.toContain("access-token-secret");

    const health = await provider.testConnection({ connection: { ...connection, status: "connected" } });
    expect(health).toMatchObject({
      health: "healthy",
      status: "connected",
      message: "Gmail profile validation passed."
    });
  });

  it("uses Calendar readonly scope and validates calendar-list health", async () => {
    const repository = new InMemoryConnectCoreRepository();
    const provider = new GoogleDirectOAuthProvider(config, repository);
    const calendar = applyGoogleProviderAvailability(listIntegrations(), true).find(
      (integration) => integration.id === "google-calendar"
    );

    if (!calendar) {
      throw new Error("Expected Google Calendar integration.");
    }

    const started = await provider.startConnection({
      userId: "local-demo-user",
      integration: calendar,
      callbackUrl: config.redirectUri
    });
    const state = new URL(started.redirectUrl).searchParams.get("state");
    expect(new URL(started.redirectUrl).searchParams.get("scope")).toContain("calendar.readonly");

    vi.stubGlobal(
      "fetch",
      vi
        .fn()
        .mockResolvedValueOnce({
          json: async () => ({
            access_token: "calendar-access-token-secret",
            refresh_token: "calendar-refresh-token-secret",
            expires_in: 3600,
            scope: "openid email https://www.googleapis.com/auth/calendar.readonly"
          })
        })
        .mockResolvedValueOnce({ ok: true })
    );

    await repository.saveConnection({
      id: started.connectionId,
      userId: "local-demo-user",
      integrationId: "google-calendar",
      providerKey: "direct-oauth",
      status: "pending",
      permissions: calendar.scopes,
      metadata: started.metadata,
      redirectUrl: started.redirectUrl,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    });

    const connection = await repository.getConnection(started.connectionId);
    if (!connection || !state) {
      throw new Error("Expected pending Calendar connection and state.");
    }

    await provider.completeConnection({
      connection,
      callbackPayload: {
        connectionId: started.connectionId,
        code: "callback-code",
        state,
        status: "success"
      }
    });

    const health = await provider.testConnection({ connection: { ...connection, status: "connected" } });
    expect(health).toMatchObject({
      health: "healthy",
      status: "connected",
      message: "Google Calendar calendar-list validation passed."
    });
  });
});
