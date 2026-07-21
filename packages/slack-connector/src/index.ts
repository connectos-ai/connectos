import type { Vault } from "@connect-any-inbox/vault";

export interface SlackOAuthStartInput {
  clientId: string;
  redirectUri: string;
  state: string;
}

export interface SlackOAuthStart {
  url: string;
  state: string;
}

export interface SlackTokens {
  botToken: string;
  teamId: string;
  teamName: string;
}

export type SlackTokenExchange = (code: string) => Promise<SlackTokens>;

export interface SlackOAuthCallbackInput {
  tenantId: string;
  code: string;
  state: string;
  expectedState: string;
  vault: Vault;
  exchangeCode: SlackTokenExchange;
}

export interface SlackOAuthCallbackResult {
  status: "connected";
  teamId: string;
  teamName: string;
}

export interface SlackChannelSelectionInput {
  channelId: string;
  channelName: string;
}

export interface SlackChannelSelection {
  destination: "slack";
  destinationChannelId: string;
  destinationChannelName: string;
}

export function createSlackOAuthStart(input: SlackOAuthStartInput): SlackOAuthStart {
  const url = new URL("https://slack.com/oauth/v2/authorize");
  url.searchParams.set("client_id", input.clientId);
  url.searchParams.set("redirect_uri", input.redirectUri);
  url.searchParams.set("scope", "chat:write,channels:read");
  url.searchParams.set("state", input.state);

  return {
    url: url.toString(),
    state: input.state
  };
}

export async function handleSlackOAuthCallback(
  input: SlackOAuthCallbackInput
): Promise<SlackOAuthCallbackResult> {
  if (input.state !== input.expectedState) {
    throw new Error("Invalid Slack OAuth state");
  }

  const tokens = await input.exchangeCode(input.code);

  await input.vault.writeSecret(
    { tenantId: input.tenantId, provider: "slack", name: "bot_token" },
    tokens.botToken
  );

  return {
    status: "connected",
    teamId: tokens.teamId,
    teamName: tokens.teamName
  };
}

export function selectSlackChannel(
  input: SlackChannelSelectionInput
): SlackChannelSelection {
  return {
    destination: "slack",
    destinationChannelId: input.channelId,
    destinationChannelName: input.channelName
  };
}
