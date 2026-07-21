import { describe, expect, it } from "vitest";
import { LocalDevelopmentVault } from "@connect-any-inbox/vault";
import {
createGmailOAuthStart,
exchangeGmailAuthorizationCode,
fetchRecentGmailProviderMessages,
handleGmailOAuthCallback,
syncGmailMessages,
type GmailTokenExchange
} from "./index";

describe("gmail connector", () => {
  const tokenExchange: GmailTokenExchange = async () => ({
    accessToken: "access-token",
    refreshToken: "refresh-token",
    expiresAt: new Date("2026-06-16T18:00:00.000Z")
  });

  it("creates an OAuth start URL with state", () => {
    const start = createGmailOAuthStart({
      clientId: "google-client-id",
      redirectUri: "http://localhost:3000/api/connect/gmail/callback",
      state: "state_123"
    });

    expect(start.state).toBe("state_123");
    expect(start.url).toContain("accounts.google.com");
    expect(start.url).toContain("client_id=google-client-id");
  });

  it("validates callback state and stores tokens through the vault", async () => {
    const vault = new LocalDevelopmentVault();
    const result = await handleGmailOAuthCallback({
      tenantId: "tenant_1",
      code: "auth-code",
      state: "state_123",
      expectedState: "state_123",
      vault,
      exchangeCode: tokenExchange
    });

    expect(result.status).toBe("connected");
    await expect(
      vault.readSecret({
        tenantId: "tenant_1",
        provider: "gmail",
        name: "oauth_access_token"
      })
    ).resolves.toBe("access-token");
  });

  it("rejects invalid callback state", async () => {
    const vault = new LocalDevelopmentVault();

    await expect(
      handleGmailOAuthCallback({
        tenantId: "tenant_1",
        code: "auth-code",
        state: "wrong",
        expectedState: "state_123",
        vault,
        exchangeCode: tokenExchange
      })
    ).rejects.toThrow("Invalid Gmail OAuth state");
  });

  it("normalizes synced Gmail messages", async () => {
    const messages = await syncGmailMessages({
      userId: "user_1",
      connectionId: "conn_gmail",
      fetchMessages: async () => [
        {
          providerMessageId: "gmail_1",
          threadId: "thread_1",
          from: "guest@example.com",
          to: ["owner@example.com"],
          subject: "Viewing request",
          preview: "Can I see the unit tomorrow?",
          receivedAt: new Date("2026-06-16T16:00:00.000Z")
        }
      ]
    });

    expect(messages[0]).toMatchObject({
      source: "gmail",
      sender: "guest@example.com",
      subject: "Viewing request",
      sourceMetadata: {
        providerMessageId: "gmail_1",
        threadId: "thread_1"
      }
    });
  });

  it("exchanges authorization code using Google token endpoint", async () => {
    const requests: Array<{ url: string; body: string }> = [];
    const tokens = await exchangeGmailAuthorizationCode({
      clientId: "google-client-id",
      clientSecret: "google-client-secret",
      code: "auth-code",
      fetch: async (url, init) => {
        requests.push({ url: String(url), body: String(init?.body) });
        return new Response(
          JSON.stringify({
            access_token: "access-token",
            refresh_token: "refresh-token",
            expires_in: 3600,
            token_type: "Bearer"
          }),
          { status: 200, headers: { "content-type": "application/json" } }
        );
      },
      now: () => new Date("2026-06-16T18:00:00.000Z"),
      redirectUri: "http://localhost:3000/api/connect/gmail/callback"
    });

    expect(requests[0].url).toBe("https://oauth2.googleapis.com/token");
    expect(requests[0].body).toContain("grant_type=authorization_code");
    expect(requests[0].body).toContain("code=auth-code");
    expect(tokens).toMatchObject({
      accessToken: "access-token",
      refreshToken: "refresh-token",
      expiresAt: new Date("2026-06-16T19:00:00.000Z")
    });
  });

  it("fetches recent Gmail metadata messages", async () => {
    const calls: string[] = [];
    const messages = await fetchRecentGmailProviderMessages({
      accessToken: "access-token",
      fetch: async (url) => {
        calls.push(String(url));

        if (String(url).includes("/messages?")) {
          return new Response(
            JSON.stringify({
              messages: [{ id: "gmail_1", threadId: "thread_1" }]
            }),
            { status: 200, headers: { "content-type": "application/json" } }
          );
        }

        return new Response(
          JSON.stringify({
            id: "gmail_1",
            internalDate: "1781642400000",
            payload: {
              headers: [
                { name: "From", value: "Guest <guest@example.com>" },
                { name: "To", value: "owner@example.com" },
                { name: "Subject", value: "Viewing request" }
              ]
            },
            snippet: "Can I see the unit tomorrow?",
            threadId: "thread_1"
          }),
          { status: 200, headers: { "content-type": "application/json" } }
        );
      },
      maxResults: 1
    });

    expect(calls[0]).toContain("https://gmail.googleapis.com/gmail/v1/users/me/messages");
    expect(calls[1]).toContain("format=metadata");
    expect(messages).toEqual([
      {
        providerMessageId: "gmail_1",
        threadId: "thread_1",
        from: "Guest <guest@example.com>",
        to: ["owner@example.com"],
        subject: "Viewing request",
        preview: "Can I see the unit tomorrow?",
receivedAt: new Date("2026-06-16T20:40:00.000Z")
      }
    ]);
  });
});
