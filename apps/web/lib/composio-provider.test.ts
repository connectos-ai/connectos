import { afterEach, describe, expect, it, vi } from "vitest";
import { listIntegrations, type ConnectionRecord } from "@connect-any-inbox/connect-core";

import {
  applyComposioProviderAvailability,
  ComposioConnectionProvider,
  getComposioConfig
} from "./composio-provider";

const config = {
  apiKey: "composio-api-key",
  baseUrl: "https://backend.composio.test",
  authConfigIds: {
    github: "auth_config_github"
  }
};

describe("ComposioConnectionProvider", () => {
  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it("selects Composio for supported integrations only when configured", () => {
    const withComposio = applyComposioProviderAvailability(listIntegrations(), true);
    const withoutComposio = applyComposioProviderAvailability(listIntegrations(), false);

    expect(withComposio.find((integration) => integration.id === "github")?.defaultProvider).toBe(
      "composio"
    );
    expect(withComposio.find((integration) => integration.id === "gmail")?.defaultProvider).toBe(
      "mock"
    );
    expect(withoutComposio.find((integration) => integration.id === "github")?.defaultProvider).toBe(
      "mock"
    );
  });

  it("reads API key config without exposing it in mappings", () => {
    const resolved = getComposioConfig({
      COMPOSIO_API_KEY: "secret-key",
      COMPOSIO_BASE_URL: "https://backend.composio.test",
      COMPOSIO_AUTH_CONFIG_IDS: '{"github":"auth_config_github"}'
    } as unknown as NodeJS.ProcessEnv);

    expect(resolved).toMatchObject({
      baseUrl: "https://backend.composio.test",
      authConfigIds: { github: "auth_config_github" }
    });
  });

  it("creates an auth link and stores only Composio account metadata", async () => {
    const provider = new ComposioConnectionProvider(config);
    const github = listIntegrations().find((integration) => integration.id === "github");

    if (!github) {
      throw new Error("Expected GitHub integration.");
    }

    const fetchMock = vi.fn().mockResolvedValueOnce({
      ok: true,
      status: 201,
      json: async () => ({
        link_token: "link-token-value",
        redirect_url: "https://connect.composio.dev/link/test",
        connected_account_id: "ca_github_123",
        expires_at: "2026-07-08T12:00:00.000Z"
      })
    });
    vi.stubGlobal("fetch", fetchMock);

    const started = await provider.startConnection({
      userId: "local-demo-user",
      integration: github,
      callbackUrl: "http://localhost:3033/api/connect-core/callback"
    });

    const requestUrl = String(fetchMock.mock.calls[0]?.[0]);
    const requestInit = fetchMock.mock.calls[0]?.[1] as RequestInit;
    const requestBody = JSON.parse(String(requestInit.body)) as {
      auth_config_id: string;
      callback_url: string;
      user_id: string;
    };

    expect(requestUrl).toBe("https://backend.composio.test/api/v3.1/connected_accounts/link");
    expect(requestInit.headers).toMatchObject({ "x-api-key": config.apiKey });
    expect(requestBody).toMatchObject({
      auth_config_id: "auth_config_github",
      user_id: "local-demo-user"
    });
    expect(new URL(requestBody.callback_url).searchParams.get("connectionId")).toBe(
      started.connectionId
    );
    expect(started).toMatchObject({
      redirectUrl: "https://connect.composio.dev/link/test",
      providerKey: "composio",
      status: "pending",
      externalAccountId: "ca_github_123",
      metadata: {
        composioConnectedAccountId: "ca_github_123",
        composioAuthConfigId: "auth_config_github",
        composioToolkitSlug: "github"
      }
    });
    expect(JSON.stringify(started)).not.toContain(config.apiKey);
  });

  it("completes, health-checks, and disconnects using Composio connected account ids", async () => {
    const provider = new ComposioConnectionProvider(config);
    const connection: ConnectionRecord = {
      id: "conn_123",
      userId: "local-demo-user",
      integrationId: "github",
      providerKey: "composio",
      status: "pending",
      permissions: ["repo", "issues.read"],
      metadata: {
        composioConnectedAccountId: "ca_github_123",
        composioToolkitSlug: "github"
      },
      externalAccountId: "ca_github_123",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    const fetchMock = vi
      .fn()
      .mockResolvedValueOnce({
        ok: true,
        status: 200,
        json: async () => ({
          id: "ca_github_123",
          status: "ACTIVE",
          toolkit: { slug: "github" }
        })
      })
      .mockResolvedValueOnce({
        ok: true,
        status: 200,
        json: async () => ({
          id: "ca_github_123",
          status: "ACTIVE",
          toolkit: { slug: "github" }
        })
      })
      .mockResolvedValueOnce({
        ok: true,
        status: 204,
        json: async () => ({})
      });
    vi.stubGlobal("fetch", fetchMock);

    const patch = await provider.completeConnection({
      connection,
      callbackPayload: {
        connectionId: connection.id,
        status: "success",
        externalAccountId: "ca_github_123"
      }
    });

    const health = await provider.testConnection({
      connection: {
        ...connection,
        status: "connected",
        metadata: patch.metadata
      }
    });
    const disconnect = await provider.disconnect({
      connection: {
        ...connection,
        status: "connected",
        metadata: patch.metadata
      }
    });

    expect(patch).toMatchObject({
      status: "connected",
      externalAccountId: "ca_github_123",
      metadata: {
        composioConnectedAccountId: "ca_github_123",
        composioStatus: "ACTIVE"
      }
    });
    expect(health).toMatchObject({
      health: "healthy",
      status: "connected"
    });
    expect(disconnect).toMatchObject({
      status: "disconnected",
      externalAccountId: undefined,
      metadata: {
        composioConnectedAccountId: null,
        composioStatus: "disconnected"
      }
    });
    expect(String(fetchMock.mock.calls[2]?.[0])).toBe(
      "https://backend.composio.test/api/v3.1/connected_accounts/ca_github_123"
    );
    expect(fetchMock.mock.calls[2]?.[1]).toMatchObject({ method: "DELETE" });
  });
});
