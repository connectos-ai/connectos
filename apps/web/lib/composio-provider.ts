import {
  type CallbackPayload,
  type ConnectionMetadata,
  type ConnectionProvider,
  type ConnectionRecord,
  type ConnectionStatus,
  type IntegrationDefinition,
  type IntegrationHealth,
  type StartConnectionInput,
  type StartConnectionResult
} from "@connect-any-inbox/connect-core";

const defaultComposioBaseUrl = "https://backend.composio.dev";

const composioIntegrationIds = [
  "github",
  "hubspot",
  "quickbooks",
  "google-drive",
  "stripe"
] as const;

type ComposioIntegrationId = (typeof composioIntegrationIds)[number];

interface ComposioLinkResponse {
  link_token?: string;
  redirect_url?: string;
  redirectUrl?: string;
  expires_at?: string;
  connected_account_id?: string;
  connectedAccountId?: string;
}

interface ComposioConnectedAccountResponse {
  id?: string;
  nanoid?: string;
  connected_account_id?: string;
  status?: string;
  isDisabled?: boolean;
  is_disabled?: boolean;
  enabled?: boolean;
  toolkit?: {
    slug?: string;
  };
}

export interface ComposioConfig {
  apiKey: string;
  baseUrl: string;
  authConfigIds: Record<string, string>;
}

export class ComposioConnectionProvider implements ConnectionProvider {
  readonly key = "composio" as const;

  constructor(private readonly config: ComposioConfig) {}

  async startConnection(input: StartConnectionInput): Promise<StartConnectionResult> {
    const authConfigId = getComposioAuthConfigId(input.integration, this.config);
    const connectionId =
      input.existingConnection?.id ?? `conn_${Date.now()}_${Math.random().toString(36).slice(2, 10)}`;
    const callbackUrl = withConnectionId(input.callbackUrl, connectionId);
    const response = await this.request<ComposioLinkResponse>("/api/v3.1/connected_accounts/link", {
      method: "POST",
      body: JSON.stringify({
        auth_config_id: authConfigId,
        user_id: input.userId,
        alias: `${input.userId}-${input.integration.id}`,
        callback_url: callbackUrl
      })
    });

    const redirectUrl = response.redirect_url ?? response.redirectUrl;
    const connectedAccountId = response.connected_account_id ?? response.connectedAccountId;

    if (!redirectUrl || !connectedAccountId) {
      throw new Error("Composio did not return a redirect URL and connected account ID.");
    }

    return {
      connectionId,
      redirectUrl,
      status: "pending",
      providerKey: this.key,
      externalAccountId: connectedAccountId,
      metadata: removeNullish({
        composioConnectedAccountId: connectedAccountId,
        composioLinkToken: response.link_token ?? null,
        composioAuthConfigId: authConfigId,
        composioToolkitSlug: input.integration.toolkitSlug,
        composioLinkExpiresAt: response.expires_at ?? null
      })
    };
  }

  async completeConnection(input: {
    connection: ConnectionRecord;
    callbackPayload: CallbackPayload;
  }): Promise<Partial<ConnectionRecord>> {
    if (input.callbackPayload.error || input.callbackPayload.status === "failed") {
      return { status: "disconnected", redirectUrl: undefined };
    }

    const connectedAccountId =
      input.callbackPayload.externalAccountId ??
      stringMetadata(input.connection.metadata, "composioConnectedAccountId") ??
      input.connection.externalAccountId;

    if (!connectedAccountId) {
      return { status: "unhealthy" };
    }

    const account = await this.getConnectedAccount(connectedAccountId);
    const status = statusFromComposioAccount(account);

    return {
      status,
      externalAccountId: connectedAccountId,
      redirectUrl: undefined,
      metadata: {
        ...(input.connection.metadata ?? {}),
        composioConnectedAccountId: connectedAccountId,
        composioStatus: account.status ?? null,
        composioToolkitSlug:
          account.toolkit?.slug ?? stringMetadata(input.connection.metadata, "composioToolkitSlug") ?? null
      }
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
        category: "automation",
        toolkitSlug:
          stringMetadata(input.connection.metadata, "composioToolkitSlug") ?? input.connection.integrationId,
        authMethod: "oauth",
        defaultProvider: this.key,
        description: "",
        recommendedFor: [],
        scopes: input.connection.permissions,
        isMvp: false
      },
      callbackUrl: input.callbackUrl,
      existingConnection: input.connection
    });
  }

  async disconnect(input: { connection: ConnectionRecord }): Promise<Partial<ConnectionRecord>> {
    const connectedAccountId =
      stringMetadata(input.connection.metadata, "composioConnectedAccountId") ??
      input.connection.externalAccountId;

    if (connectedAccountId) {
      await this.request(`/api/v3.1/connected_accounts/${encodeURIComponent(connectedAccountId)}`, {
        method: "DELETE"
      });
    }

    return {
      status: "disconnected",
      redirectUrl: undefined,
      externalAccountId: undefined,
      metadata: {
        ...(input.connection.metadata ?? {}),
        composioConnectedAccountId: null,
        composioLinkToken: null,
        composioStatus: "disconnected"
      }
    };
  }

  async testConnection(input: { connection: ConnectionRecord }): Promise<{
    health: IntegrationHealth;
    status: ConnectionStatus;
    message: string;
  }> {
    const connectedAccountId =
      stringMetadata(input.connection.metadata, "composioConnectedAccountId") ??
      input.connection.externalAccountId;

    if (!connectedAccountId) {
      return {
        health: "broken",
        status: "unhealthy",
        message: "Composio connected account ID is missing."
      };
    }

    const account = await this.getConnectedAccount(connectedAccountId);
    const status = statusFromComposioAccount(account);

    if (status === "connected") {
      return {
        health: "healthy",
        status,
        message: `Composio account ${connectedAccountId} is active.`
      };
    }

    return {
      health: "needs_attention",
      status,
      message: `Composio account ${connectedAccountId} needs attention.`
    };
  }

  private async getConnectedAccount(connectedAccountId: string): Promise<ComposioConnectedAccountResponse> {
    return this.request<ComposioConnectedAccountResponse>(
      `/api/v3.1/connected_accounts/${encodeURIComponent(connectedAccountId)}`
    );
  }

  private async request<T>(path: string, init: RequestInit = {}): Promise<T> {
    const response = await fetch(new URL(path, this.config.baseUrl), {
      ...init,
      headers: {
        "Content-Type": "application/json",
        "x-api-key": this.config.apiKey,
        ...init.headers
      }
    });

    if (!response.ok) {
      throw new Error(`Composio request failed with ${response.status}.`);
    }

    if (response.status === 204) {
      return {} as T;
    }

    return (await response.json()) as T;
  }
}

export function hasComposioConfig(env: NodeJS.ProcessEnv = process.env): boolean {
  return Boolean(env.COMPOSIO_API_KEY);
}

export function getComposioConfig(env: NodeJS.ProcessEnv = process.env): ComposioConfig | null {
  if (!hasComposioConfig(env)) {
    return null;
  }

  return {
    apiKey: env.COMPOSIO_API_KEY as string,
    baseUrl: env.COMPOSIO_BASE_URL || defaultComposioBaseUrl,
    authConfigIds: parseAuthConfigIds(env)
  };
}

export function applyComposioProviderAvailability(
  integrations: IntegrationDefinition[],
  isConfigured: boolean
): IntegrationDefinition[] {
  return integrations.map((integration) => {
    if (!isComposioIntegration(integration.id)) {
      return integration;
    }

    return {
      ...integration,
      defaultProvider: isConfigured ? "composio" : "mock"
    };
  });
}

export function getComposioIntegrationMappings(
  integrations: IntegrationDefinition[],
  config: ComposioConfig | null
) {
  return integrations
    .filter((integration) => isComposioIntegration(integration.id))
    .map((integration) => ({
      integrationId: integration.id,
      name: integration.name,
      toolkitSlug: integration.toolkitSlug,
      authConfigId: config ? getComposioAuthConfigId(integration, config) : null
    }));
}

function getComposioAuthConfigId(integration: IntegrationDefinition, config: ComposioConfig): string {
  return config.authConfigIds[integration.id] ?? integration.toolkitSlug;
}

function parseAuthConfigIds(env: NodeJS.ProcessEnv): Record<string, string> {
  const fromJson = env.COMPOSIO_AUTH_CONFIG_IDS ? safeJsonRecord(env.COMPOSIO_AUTH_CONFIG_IDS) : {};
  return {
    ...fromJson,
    ...Object.fromEntries(
      composioIntegrationIds.flatMap((integrationId) => {
        const key = `COMPOSIO_AUTH_CONFIG_${integrationId.toUpperCase().replaceAll("-", "_")}`;
        return env[key] ? [[integrationId, env[key] as string]] : [];
      })
    )
  };
}

function safeJsonRecord(value: string): Record<string, string> {
  try {
    const parsed = JSON.parse(value) as unknown;
    if (!parsed || typeof parsed !== "object" || Array.isArray(parsed)) {
      return {};
    }

    return Object.fromEntries(
      Object.entries(parsed).filter(
        (entry): entry is [string, string] => typeof entry[1] === "string" && entry[1].length > 0
      )
    );
  } catch {
    return {};
  }
}

function withConnectionId(callbackUrl: string, connectionId: string): string {
  const url = new URL(callbackUrl);
  url.searchParams.set("connectionId", connectionId);
  return url.toString();
}

function isComposioIntegration(integrationId: string): integrationId is ComposioIntegrationId {
  return (composioIntegrationIds as readonly string[]).includes(integrationId);
}

function statusFromComposioAccount(account: ComposioConnectedAccountResponse): ConnectionStatus {
  if (account.isDisabled || account.is_disabled || account.enabled === false) {
    return "disconnected";
  }

  const normalizedStatus = account.status?.toLowerCase();
  if (!normalizedStatus || ["active", "connected", "enabled"].includes(normalizedStatus)) {
    return "connected";
  }

  if (["expired", "needs_attention"].includes(normalizedStatus)) {
    return "expired";
  }

  return "unhealthy";
}

function stringMetadata(metadata: ConnectionMetadata | undefined, key: string): string | undefined {
  const value = metadata?.[key];
  return typeof value === "string" && value.length > 0 ? value : undefined;
}

function removeNullish(metadata: ConnectionMetadata): ConnectionMetadata {
  return Object.fromEntries(Object.entries(metadata).filter((entry) => entry[1] !== null));
}
