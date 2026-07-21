import {
  type CallbackPayload,
  type ConnectionProvider,
  type ConnectionRecord,
  type ConnectionStatus,
  type ConnectCoreRepository,
  type IntegrationDefinition,
  type IntegrationHealth,
  type StartConnectionInput,
  type StartConnectionResult
} from "@connect-any-inbox/connect-core";

import {
  decryptTokenPayload,
  encryptTokenPayload,
  hasConnectCoreEncryptionKey
} from "./connect-core-crypto";
import {
  assertFreshOAuthState,
  clearOAuthStateMetadata,
  createSignedOAuthState,
  resolveSignedOAuthState,
  type SignedOAuthState
} from "./connect-core-oauth-state";

const googleAuthorizeUrl = "https://accounts.google.com/o/oauth2/v2/auth";
const googleTokenUrl = "https://oauth2.googleapis.com/token";
const gmailProfileUrl = "https://gmail.googleapis.com/gmail/v1/users/me/profile";
const calendarListUrl = "https://www.googleapis.com/calendar/v3/users/me/calendarList?maxResults=1";

export interface GoogleOAuthConfig {
  clientId: string;
  clientSecret: string;
  redirectUri: string;
}

interface GoogleTokenResponse {
  access_token?: string;
  refresh_token?: string;
  expires_in?: number;
  scope?: string;
  token_type?: string;
  error?: string;
  error_description?: string;
}

export class GoogleDirectOAuthProvider implements ConnectionProvider {
  readonly key = "direct-oauth" as const;

  constructor(
    private readonly config: GoogleOAuthConfig,
    private readonly repository: ConnectCoreRepository
  ) {}

  async startConnection(input: StartConnectionInput): Promise<StartConnectionResult> {
    const connectionId =
      input.existingConnection?.id ?? `conn_${Date.now()}_${Math.random().toString(36).slice(2, 10)}`;
    const signedState = createSignedOAuthState(
      {
        connectionId,
        integrationId: input.integration.id,
        userId: input.userId
      },
      this.config.clientSecret
    );
    const url = new URL(googleAuthorizeUrl);
    url.searchParams.set("client_id", this.config.clientId);
    url.searchParams.set("redirect_uri", this.config.redirectUri);
    url.searchParams.set("response_type", "code");
    url.searchParams.set("scope", scopesForIntegration(input.integration).join(" "));
    url.searchParams.set("state", signedState.state);
    url.searchParams.set("access_type", "offline");
    url.searchParams.set("include_granted_scopes", "true");
    url.searchParams.set("prompt", "consent");

    return {
      connectionId,
      redirectUrl: url.toString(),
      status: "pending",
      providerKey: this.key,
      metadata: signedState.metadata
    };
  }

  async completeConnection(input: {
    connection: ConnectionRecord;
    callbackPayload: CallbackPayload;
  }): Promise<Partial<ConnectionRecord>> {
    const callback = input.callbackPayload;
    if (callback.error) {
      return { status: "disconnected", metadata: clearOAuthStateMetadata(input.connection.metadata) };
    }
    if (!callback.code || !callback.state) {
      return { status: "unhealthy" };
    }

    const state = resolveGoogleOAuthState(callback.state, this.config);
    assertFreshOAuthState(
      state,
      input.connection.metadata,
      {
        connectionId: input.connection.id,
        integrationId: input.connection.integrationId,
        userId: input.connection.userId
      }
    );

    const tokens = await this.exchangeCode(callback.code);
    if (!tokens.access_token) {
      throw new Error(tokens.error_description ?? tokens.error ?? "Google token exchange failed.");
    }

    const now = new Date().toISOString();
    await this.repository.saveOAuthToken({
      id: `token_${input.connection.id}_${Date.now()}`,
      connectionId: input.connection.id,
      providerKey: this.key,
      tokenRef: encryptTokenPayload(tokens, tokenContext(input.connection.id, "google")),
      scopes: splitScopes(tokens.scope) ?? input.connection.permissions,
      expiresAt: tokens.expires_in
        ? new Date(Date.now() + tokens.expires_in * 1000).toISOString()
        : undefined,
      createdAt: now,
      updatedAt: now
    });

    return {
      status: "connected",
      externalAccountId: `google_${input.connection.integrationId}`,
      redirectUrl: undefined,
      metadata: clearOAuthStateMetadata(input.connection.metadata)
    };
  }

  async reconnect(input: {
    connection: ConnectionRecord;
    callbackUrl: string;
  }): Promise<StartConnectionResult> {
    return this.startConnection({
      userId: input.connection.userId,
      integration: {
        id: input.connection.integrationId,
        name: input.connection.integrationId,
        category: input.connection.integrationId === "google-calendar" ? "calendar" : "email",
        toolkitSlug: input.connection.integrationId,
        authMethod: "oauth",
        defaultProvider: "direct-oauth",
        description: "",
        recommendedFor: [],
        scopes: input.connection.permissions,
        isMvp: true
      },
      callbackUrl: input.callbackUrl,
      existingConnection: input.connection
    });
  }

  async disconnect(): Promise<Partial<ConnectionRecord>> {
    return { status: "disconnected", redirectUrl: undefined };
  }

  async testConnection(input: { connection: ConnectionRecord }): Promise<{
    health: IntegrationHealth;
    status: ConnectionStatus;
    message: string;
  }> {
    const token = (await this.repository.listOAuthTokens(input.connection.id)).at(-1);
    if (!token) {
      return {
        health: "broken",
        status: "unhealthy",
        message: "No Google OAuth token reference stored for connection."
      };
    }

    const tokens = decryptTokenPayload<GoogleTokenResponse>(
      token.tokenRef,
      tokenContext(input.connection.id, "google")
    );
    if (!tokens.access_token) {
      return {
        health: "broken",
        status: "unhealthy",
        message: "Google access token unavailable for validation."
      };
    }

    await validateGoogleEndpoint(tokens.access_token, input.connection.integrationId);
    return {
      health: "healthy",
      status: "connected",
      message:
        input.connection.integrationId === "google-calendar"
          ? "Google Calendar calendar-list validation passed."
          : "Gmail profile validation passed."
    };
  }

  private async exchangeCode(code: string): Promise<GoogleTokenResponse> {
    const body = new URLSearchParams({
      code,
      client_id: this.config.clientId,
      client_secret: this.config.clientSecret,
      redirect_uri: this.config.redirectUri,
      grant_type: "authorization_code"
    });
    const response = await fetch(googleTokenUrl, {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body
    });

    return (await response.json()) as GoogleTokenResponse;
  }
}

export function hasGoogleOAuthConfig(env: NodeJS.ProcessEnv = process.env): boolean {
  return Boolean(
    env.GOOGLE_CLIENT_ID &&
      env.GOOGLE_CLIENT_SECRET &&
      env.GOOGLE_REDIRECT_URI &&
      hasConnectCoreEncryptionKey(env)
  );
}

export function getGoogleOAuthConfig(env: NodeJS.ProcessEnv = process.env): GoogleOAuthConfig | null {
  if (env.GOOGLE_CLIENT_ID && env.GOOGLE_CLIENT_SECRET && env.GOOGLE_REDIRECT_URI) {
    if (!hasConnectCoreEncryptionKey(env)) {
      console.warn(
        "[connect-core] Google OAuth disabled because CONNECT_CORE_ENCRYPTION_KEY is missing."
      );
      return null;
    }
  }

  if (!hasGoogleOAuthConfig(env)) {
    return null;
  }

  return {
    clientId: env.GOOGLE_CLIENT_ID as string,
    clientSecret: env.GOOGLE_CLIENT_SECRET as string,
    redirectUri: env.GOOGLE_REDIRECT_URI as string
  };
}

export function resolveGoogleOAuthState(
  state: string,
  config: GoogleOAuthConfig
): SignedOAuthState {
  return resolveSignedOAuthState(state, config.clientSecret);
}

export function applyGoogleProviderAvailability(
  integrations: IntegrationDefinition[],
  isConfigured: boolean
): IntegrationDefinition[] {
  return integrations.map((integration) => {
    if (!["gmail", "google-calendar"].includes(integration.id)) {
      return integration;
    }

    return { ...integration, defaultProvider: isConfigured ? "direct-oauth" : "mock" };
  });
}

async function validateGoogleEndpoint(accessToken: string, integrationId: string): Promise<void> {
  const url = integrationId === "google-calendar" ? calendarListUrl : gmailProfileUrl;
  const response = await fetch(url, {
    headers: { Authorization: `Bearer ${accessToken}` }
  });

  if (!response.ok) {
    throw new Error(`Google validation failed with ${response.status}.`);
  }
}

function scopesForIntegration(integration: IntegrationDefinition): string[] {
  if (integration.id === "google-calendar") {
    return ["openid", "email", "profile", "https://www.googleapis.com/auth/calendar.readonly"];
  }

  return ["openid", "email", "profile", "https://www.googleapis.com/auth/gmail.readonly"];
}

function splitScopes(scopes?: string): string[] | undefined {
  return scopes?.split(" ").filter(Boolean);
}

function tokenContext(connectionId: string, provider: string): string {
  return `connect-core:${provider}:${connectionId}`;
}
