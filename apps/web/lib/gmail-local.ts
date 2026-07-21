import {
  createGmailOAuthStart,
  exchangeGmailAuthorizationCode,
  fetchRecentGmailProviderMessages,
  handleGmailOAuthCallback,
  syncGmailMessages
} from "@connect-any-inbox/gmail-connector";
import { LocalDevelopmentVault } from "@connect-any-inbox/vault";

const GMAIL_STATE_COOKIE = "connect_any_inbox_gmail_oauth_state";
const LOCAL_CONNECTION_ID = "conn_gmail_local";
const LOCAL_TENANT_ID = "tenant_local";
const LOCAL_USER_ID = "user_local";

declare global {
  var connectAnyInboxLocalVault: LocalDevelopmentVault | undefined;
}

export interface GmailLocalConfig {
  clientId: string;
  clientSecret: string;
  redirectUri: string;
}

export interface GmailSetupReadiness {
  ready: boolean;
  missing: string[];
  message: string;
}

export function getLocalVault(): LocalDevelopmentVault {
  globalThis.connectAnyInboxLocalVault ??= new LocalDevelopmentVault();
  return globalThis.connectAnyInboxLocalVault;
}

export function getGmailStateCookieName(): string {
  return GMAIL_STATE_COOKIE;
}

export function getLocalGmailConnectionId(): string {
  return LOCAL_CONNECTION_ID;
}

export function getLocalGmailTenantId(): string {
  return LOCAL_TENANT_ID;
}

export function getLocalGmailUserId(): string {
  return LOCAL_USER_ID;
}

export function getGmailRedirectUri(request: Request): string {
  const configuredRedirectUri = process.env.GOOGLE_REDIRECT_URI;

  if (configuredRedirectUri) {
    return configuredRedirectUri;
  }

  const baseUrl = process.env.NEXT_PUBLIC_APP_URL ?? new URL(request.url).origin;
  return `${baseUrl}/api/connect/gmail/callback`;
}

export function readGmailLocalConfig(request: Request): GmailLocalConfig | null {
  const clientId = process.env.GOOGLE_CLIENT_ID;
  const clientSecret = process.env.GOOGLE_CLIENT_SECRET;

  if (!clientId || !clientSecret) {
    return null;
  }

  return {
    clientId,
    clientSecret,
    redirectUri: getGmailRedirectUri(request)
  };
}

export function getGmailSetupReadiness(): GmailSetupReadiness {
  const requirements: Array<[string, string | undefined]> = [
    ["GOOGLE_CLIENT_ID", process.env.GOOGLE_CLIENT_ID],
    ["GOOGLE_CLIENT_SECRET", process.env.GOOGLE_CLIENT_SECRET]
  ];
  const missing = requirements.filter(([, value]) => !value).map(([name]) => name);

  if (missing.length > 0) {
    return {
      ready: false,
      missing,
      message: "Gmail needs admin setup before users can connect."
    };
  }

  return {
    ready: true,
    missing: [],
    message: "Gmail is ready for users to connect."
  };
}

export function createGmailConnectUrl(input: {
  clientId: string;
  redirectUri: string;
  state: string;
}): string {
  return createGmailOAuthStart(input).url;
}

export async function completeLocalGmailOAuth(input: {
  code: string;
  config: GmailLocalConfig;
  expectedState: string;
  state: string;
}): Promise<void> {
  const vault = getLocalVault();

  await handleGmailOAuthCallback({
    tenantId: LOCAL_TENANT_ID,
    code: input.code,
    state: input.state,
    expectedState: input.expectedState,
    vault,
    exchangeCode: (code) =>
      exchangeGmailAuthorizationCode({
        clientId: input.config.clientId,
        clientSecret: input.config.clientSecret,
        code,
        redirectUri: input.config.redirectUri
      })
  });
}

export async function getLocalGmailConnectionStatus(): Promise<{
  connected: boolean;
}> {
  const accessToken = await getLocalVault().readSecret({
    tenantId: LOCAL_TENANT_ID,
    provider: "gmail",
    name: "oauth_access_token"
  });

  return { connected: accessToken !== null };
}

export async function syncLocalGmailMessages(): Promise<{
  importedCount: number;
  messages: Awaited<ReturnType<typeof syncGmailMessages>>;
}> {
  const accessToken = await getLocalVault().readSecret({
    tenantId: LOCAL_TENANT_ID,
    provider: "gmail",
    name: "oauth_access_token"
  });

  if (!accessToken) {
    throw new Error("Gmail is not connected.");
  }

  const messages = await syncGmailMessages({
    userId: LOCAL_USER_ID,
    connectionId: LOCAL_CONNECTION_ID,
    fetchMessages: () =>
      fetchRecentGmailProviderMessages({
        accessToken,
        maxResults: 10
      })
  });

  return {
    importedCount: messages.length,
    messages
  };
}
