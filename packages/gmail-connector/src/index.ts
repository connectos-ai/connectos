import { createGmailInboxMessage, type InboxMessage } from "@connect-any-inbox/inbox-core";
import type { Vault } from "@connect-any-inbox/vault";

export interface GmailOAuthStartInput {
  clientId: string;
  redirectUri: string;
  state: string;
}

export interface GmailOAuthStart {
  url: string;
  state: string;
}

export interface GmailTokens {
accessToken: string;
refreshToken: string;
expiresAt: Date;
}

export type GmailFetch = typeof fetch;

export interface ExchangeGmailAuthorizationCodeInput {
clientId: string;
clientSecret: string;
code: string;
fetch?: GmailFetch;
now?: () => Date;
redirectUri: string;
}

export type GmailTokenExchange = (code: string) => Promise<GmailTokens>;

export interface GmailOAuthCallbackInput {
  tenantId: string;
  code: string;
  state: string;
  expectedState: string;
  vault: Vault;
  exchangeCode: GmailTokenExchange;
}

export interface GmailOAuthCallbackResult {
  status: "connected";
  expiresAt: Date;
}

export interface GmailProviderMessage {
  providerMessageId: string;
  threadId: string;
  from: string;
  to: string[];
  subject: string;
  preview: string;
  receivedAt: Date;
}

export interface FetchRecentGmailProviderMessagesInput {
accessToken: string;
fetch?: GmailFetch;
maxResults?: number;
}

export interface SyncGmailMessagesInput {
  userId: string;
  connectionId: string;
  fetchMessages: () => Promise<GmailProviderMessage[]>;
}

export function createGmailOAuthStart(input: GmailOAuthStartInput): GmailOAuthStart {
  const url = new URL("https://accounts.google.com/o/oauth2/v2/auth");
  url.searchParams.set("client_id", input.clientId);
  url.searchParams.set("redirect_uri", input.redirectUri);
  url.searchParams.set("response_type", "code");
  url.searchParams.set("scope", "https://www.googleapis.com/auth/gmail.readonly");
  url.searchParams.set("access_type", "offline");
  url.searchParams.set("prompt", "consent");
  url.searchParams.set("state", input.state);

  return {
    url: url.toString(),
    state: input.state
  };
}

export async function handleGmailOAuthCallback(
  input: GmailOAuthCallbackInput
): Promise<GmailOAuthCallbackResult> {
  if (input.state !== input.expectedState) {
    throw new Error("Invalid Gmail OAuth state");
  }

  const tokens = await input.exchangeCode(input.code);

  await input.vault.writeSecret(
    { tenantId: input.tenantId, provider: "gmail", name: "oauth_access_token" },
    tokens.accessToken
  );
  await input.vault.writeSecret(
    { tenantId: input.tenantId, provider: "gmail", name: "oauth_refresh_token" },
    tokens.refreshToken
  );

  return {
    status: "connected",
    expiresAt: tokens.expiresAt
  };
}

export async function syncGmailMessages(
input: SyncGmailMessagesInput
): Promise<InboxMessage[]> {
  const messages = await input.fetchMessages();

  return messages.map((message, index) =>
    createGmailInboxMessage({
      id: `gmail_${message.providerMessageId}_${index}`,
      userId: input.userId,
      connectionId: input.connectionId,
      providerMessageId: message.providerMessageId,
      threadId: message.threadId,
      from: message.from,
      to: message.to,
      subject: message.subject,
      preview: message.preview,
      receivedAt: message.receivedAt
    })
);
}

export async function exchangeGmailAuthorizationCode(
input: ExchangeGmailAuthorizationCodeInput
): Promise<GmailTokens> {
const fetchImpl = input.fetch ?? fetch;
const body = new URLSearchParams({
client_id: input.clientId,
client_secret: input.clientSecret,
code: input.code,
grant_type: "authorization_code",
redirect_uri: input.redirectUri
});

const response = await fetchImpl("https://oauth2.googleapis.com/token", {
body,
headers: { "content-type": "application/x-www-form-urlencoded" },
method: "POST"
});

if (!response.ok) {
throw new Error(`Gmail token exchange failed with status ${response.status}`);
}

const payload = (await response.json()) as {
access_token?: string;
expires_in?: number;
refresh_token?: string;
};

if (!payload.access_token || !payload.expires_in) {
throw new Error("Gmail token exchange response was missing required fields");
}

return {
accessToken: payload.access_token,
refreshToken: payload.refresh_token ?? "",
expiresAt: new Date((input.now?.() ?? new Date()).getTime() + payload.expires_in * 1000)
};
}

export async function fetchRecentGmailProviderMessages(
input: FetchRecentGmailProviderMessagesInput
): Promise<GmailProviderMessage[]> {
const fetchImpl = input.fetch ?? fetch;
const listUrl = new URL("https://gmail.googleapis.com/gmail/v1/users/me/messages");
listUrl.searchParams.set("maxResults", String(input.maxResults ?? 10));

const listResponse = await fetchImpl(listUrl, {
headers: { authorization: `Bearer ${input.accessToken}` }
});

if (!listResponse.ok) {
throw new Error(`Gmail message list failed with status ${listResponse.status}`);
}

const listPayload = (await listResponse.json()) as {
messages?: Array<{ id?: string; threadId?: string }>;
};
const messages = listPayload.messages ?? [];

return Promise.all(
messages
.filter((message): message is { id: string; threadId?: string } => Boolean(message.id))
.map(async (message) => {
const getUrl = new URL(
`https://gmail.googleapis.com/gmail/v1/users/me/messages/${encodeURIComponent(message.id)}`
);
getUrl.searchParams.set("format", "metadata");
getUrl.searchParams.set("metadataHeaders", "From");
getUrl.searchParams.append("metadataHeaders", "To");
getUrl.searchParams.append("metadataHeaders", "Subject");

const messageResponse = await fetchImpl(getUrl, {
headers: { authorization: `Bearer ${input.accessToken}` }
});

if (!messageResponse.ok) {
throw new Error(`Gmail message fetch failed with status ${messageResponse.status}`);
}

const messagePayload = (await messageResponse.json()) as {
id?: string;
internalDate?: string;
payload?: { headers?: Array<{ name?: string; value?: string }> };
snippet?: string;
threadId?: string;
};
const headers = messagePayload.payload?.headers ?? [];

return {
providerMessageId: messagePayload.id ?? message.id,
threadId: messagePayload.threadId ?? message.threadId ?? "",
from: getHeader(headers, "From"),
to: splitRecipients(getHeader(headers, "To")),
subject: getHeader(headers, "Subject"),
preview: messagePayload.snippet ?? "",
receivedAt: new Date(Number(messagePayload.internalDate ?? Date.now()))
};
})
);
}

function getHeader(headers: Array<{ name?: string; value?: string }>, name: string): string {
return headers.find((header) => header.name?.toLowerCase() === name.toLowerCase())?.value ?? "";
}

function splitRecipients(value: string): string[] {
return value
.split(",")
.map((recipient) => recipient.trim())
.filter(Boolean);
}
