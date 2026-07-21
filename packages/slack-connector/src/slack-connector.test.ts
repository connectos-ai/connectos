import { describe, expect, it } from "vitest";
import { LocalDevelopmentVault } from "@connect-any-inbox/vault";
import {
  createSlackOAuthStart,
  handleSlackOAuthCallback,
  selectSlackChannel,
  type SlackTokenExchange
} from "./index";

describe("slack connector", () => {
  const tokenExchange: SlackTokenExchange = async () => ({
    botToken: "xoxb-token",
    teamId: "T123",
    teamName: "Demo Team"
  });

  it("creates a Slack OAuth start URL", () => {
    const start = createSlackOAuthStart({
      clientId: "slack-client-id",
      redirectUri: "http://localhost:3000/api/connect/slack/callback",
      state: "slack_state"
    });

    expect(start.url).toContain("slack.com/oauth/v2/authorize");
    expect(start.url).toContain("client_id=slack-client-id");
  });

  it("stores Slack bot token through the vault", async () => {
    const vault = new LocalDevelopmentVault();
    const result = await handleSlackOAuthCallback({
      tenantId: "tenant_1",
      code: "slack-code",
      state: "slack_state",
      expectedState: "slack_state",
      vault,
      exchangeCode: tokenExchange
    });

    expect(result).toMatchObject({ status: "connected", teamId: "T123" });
    await expect(
      vault.readSecret({ tenantId: "tenant_1", provider: "slack", name: "bot_token" })
    ).resolves.toBe("xoxb-token");
  });

  it("rejects invalid Slack OAuth state", async () => {
    await expect(
      handleSlackOAuthCallback({
        tenantId: "tenant_1",
        code: "slack-code",
        state: "bad",
        expectedState: "slack_state",
        vault: new LocalDevelopmentVault(),
        exchangeCode: tokenExchange
      })
    ).rejects.toThrow("Invalid Slack OAuth state");
  });

  it("selects a Slack destination channel", () => {
    expect(selectSlackChannel({ channelId: "C123", channelName: "inbox-sales" })).toEqual({
      destination: "slack",
      destinationChannelId: "C123",
      destinationChannelName: "inbox-sales"
    });
  });
});
