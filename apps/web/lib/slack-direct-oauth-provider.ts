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

const slackAuthorizeUrl = "https://slack.com/oauth/v2/authorize";
const slackTokenUrl = "https://slack.com/api/oauth.v2.access";
const slackAuthTestUrl = "https://slack.com/api/auth.test";

export interface SlackOAuthConfig {
  clientId: string;
  clientSecret: string;
  redirectUri: string;
}

interface SlackTokenResponse {
  ok?: boolean;
  access_token?: string;
  scope?: string;
  token_type?: string;
  bot_user_id?: string;
  team?: { id?: string; name?: string };
  authed_user?: { id?: string; access_token?: string; scope?: string };
  error?: string;
}

interface SlackAuthTestResponse {
  ok?: boolean;
  team_id?: string;
  team?: string;
  user_id?: string;
  bot_id?: string;
  error?: string;
}

export class SlackDirectOAuthProvider implements ConnectionProvider {
  readonly key = "direct-oauth" as const;

  constructor(
    private readonly config: SlackOAuthConfig,
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
    const url = new URL(slackAuthorizeUrl);
    url.searchParams.set("client_id", this.config.clientId);
    url.searchParams.set("redirect_uri", this.config.redirectUri);
    url.searchParams.set("scope", scopesForIntegration(input.integration).join(","));
    url.searchParams.set("state", signedState.state);

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
      return {
        status: "disconnected",
        redirectUrl: undefined,
        metadata: clearOAuthStateMetadata(input.connection.metadata)
      };
    }
    if (!callback.code || !callback.state) {
      return { status: "unhealthy" };
    }

    const state = resolveSlackOAuthState(callback.state, this.config);
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
    if (!tokens.ok || !tokens.access_token) {
      throw new Error(tokens.error ?? "Slack token exchange failed.");
    }

    const now = new Date().toISOString();
    await this.repository.saveOAuthToken({
      id: `token_${input.connection.id}_${Date.now()}`,
      connectionId: input.connection.id,
      providerKey: this.key,
      tokenRef: encryptTokenPayload(tokens, tokenContext(input.connection.id, "slack")),
      scopes: splitScopes(tokens.scope) ?? input.connection.permissions,
      createdAt: now,
      updatedAt: now
    });

    return {
      status: "connected",
      externalAccountId: tokens.team?.id ?? tokens.bot_user_id ?? `slack_${input.connection.id}`,
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
        category: "messaging",
        toolkitSlug: "slack",
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
        message: "No Slack OAuth token reference stored for connection."
      };
    }

    const tokens = decryptTokenPayload<SlackTokenResponse>(
      token.tokenRef,
      tokenContext(input.connection.id, "slack")
    );
    if (!tokens.access_token) {
      return {
        health: "broken",
        status: "unhealthy",
        message: "Slack access token unavailable for validation."
      };
    }

    const result = await this.authTest(tokens.access_token);
    if (!result.ok) {
      throw new Error(result.error ?? "Slack auth.test failed.");
    }

    return {
      health: "healthy",
      status: "connected",
      message: `Slack auth.test passed for ${result.team ?? result.team_id ?? "workspace"}.`
    };
  }

  private async exchangeCode(code: string): Promise<SlackTokenResponse> {
    const body = new URLSearchParams({
      client_id: this.config.clientId,
      client_secret: this.config.clientSecret,
      code,
      redirect_uri: this.config.redirectUri
    });
    const response = await fetch(slackTokenUrl, {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body
    });

    return (await response.json()) as SlackTokenResponse;
  }

  private async authTest(accessToken: string): Promise<SlackAuthTestResponse> {
    const response = await fetch(slackAuthTestUrl, {
      headers: { Authorization: `Bearer ${accessToken}` }
    });

    return (await response.json()) as SlackAuthTestResponse;
  }
}

export function hasSlackOAuthConfig(env: NodeJS.ProcessEnv = process.env): boolean {
  return Boolean(
    env.SLACK_CLIENT_ID &&
      env.SLACK_CLIENT_SECRET &&
      env.SLACK_REDIRECT_URI &&
      hasConnectCoreEncryptionKey(env)
  );
}

export function getSlackOAuthConfig(env: NodeJS.ProcessEnv = process.env): SlackOAuthConfig | null {
  if (env.SLACK_CLIENT_ID && env.SLACK_CLIENT_SECRET && env.SLACK_REDIRECT_URI) {
    if (!hasConnectCoreEncryptionKey(env)) {
      console.warn(
        "[connect-core] Slack OAuth disabled because CONNECT_CORE_ENCRYPTION_KEY is missing."
      );
      return null;
    }
  }

  if (!hasSlackOAuthConfig(env)) {
    return null;
  }

  return {
    clientId: env.SLACK_CLIENT_ID as string,
    clientSecret: env.SLACK_CLIENT_SECRET as string,
    redirectUri: env.SLACK_REDIRECT_URI as string
  };
}

export function resolveSlackOAuthState(state: string, config: SlackOAuthConfig): SignedOAuthState {
  return resolveSignedOAuthState(state, config.clientSecret);
}

export function applySlackProviderAvailability(
  integrations: IntegrationDefinition[],
  isConfigured: boolean
): IntegrationDefinition[] {
  return integrations.map((integration) => {
    if (integration.id !== "slack") {
      return integration;
    }

    return { ...integration, defaultProvider: isConfigured ? "direct-oauth" : "mock" };
  });
}

function scopesForIntegration(_integration: IntegrationDefinition): string[] {
  return ["channels:read", "chat:write"];
}

function splitScopes(scopes?: string): string[] | undefined {
  return scopes?.split(",").filter(Boolean);
}

function tokenContext(connectionId: string, provider: string): string {
  return `connect-core:${provider}:${connectionId}`;
}
