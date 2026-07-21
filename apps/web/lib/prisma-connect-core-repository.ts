import {
  ConnectCoreConnectionStatus as PrismaConnectionStatus,
  ConnectCoreEventType as PrismaEventType,
  ConnectCoreHealthStatus as PrismaHealthStatus,
  ConnectCoreProvider as PrismaProvider,
  PrismaClient
} from "@prisma/client";

import {
  type ConnectionEventRecord,
  type ConnectionEventType,
  type ConnectionHealthRecord,
  type ConnectionRecord,
  type ConnectionStatus,
  type ConnectCoreRepository,
  type IntegrationDefinition,
  type IntegrationHealth,
  listIntegrations,
  type OAuthTokenPlaceholder,
  type ProviderKey
} from "@connect-any-inbox/connect-core";

type PrismaConnectCoreClient = Pick<
  PrismaClient,
  | "user"
  | "connectCoreIntegration"
  | "connectCoreConnection"
  | "connectCoreConnectionEvent"
  | "connectCoreConnectionHealth"
  | "connectCoreOAuthToken"
>;

type PrismaIntegration = Awaited<
  ReturnType<PrismaConnectCoreClient["connectCoreIntegration"]["findMany"]>
>[number];
type PrismaConnection = Awaited<
  ReturnType<PrismaConnectCoreClient["connectCoreConnection"]["findMany"]>
>[number];
type PrismaHealth = Awaited<
  ReturnType<PrismaConnectCoreClient["connectCoreConnectionHealth"]["findFirst"]>
>;
type PrismaEvent = Awaited<
  ReturnType<PrismaConnectCoreClient["connectCoreConnectionEvent"]["findMany"]>
>[number];
type PrismaToken = Awaited<
  ReturnType<PrismaConnectCoreClient["connectCoreOAuthToken"]["findMany"]>
>[number];

export class PrismaConnectCoreRepository implements ConnectCoreRepository {
  constructor(private readonly prisma: PrismaConnectCoreClient) {}

  async listIntegrations(): Promise<IntegrationDefinition[]> {
    const integrations = await this.prisma.connectCoreIntegration.findMany({
      orderBy: { name: "asc" }
    });
    return integrations.map(fromPrismaIntegration).sort(byCatalogOrder);
  }

  async upsertIntegrations(integrations: IntegrationDefinition[]): Promise<void> {
    await Promise.all(
      integrations.map((integration) =>
        this.prisma.connectCoreIntegration.upsert({
          where: { id: integration.id },
          create: toPrismaIntegrationCreate(integration),
          update: toPrismaIntegrationUpdate(integration)
        })
      )
    );
  }

  async getIntegration(integrationId: string): Promise<IntegrationDefinition | undefined> {
    const integration = await this.prisma.connectCoreIntegration.findUnique({
      where: { id: integrationId }
    });
    return integration ? fromPrismaIntegration(integration) : undefined;
  }

  async listUserConnections(userId: string): Promise<ConnectionRecord[]> {
    const connections = await this.prisma.connectCoreConnection.findMany({
      where: { userId },
      orderBy: { updatedAt: "desc" }
    });
    return connections.map(fromPrismaConnection);
  }

  async getConnection(connectionId: string): Promise<ConnectionRecord | undefined> {
    const connection = await this.prisma.connectCoreConnection.findUnique({
      where: { id: connectionId }
    });
    return connection ? fromPrismaConnection(connection) : undefined;
  }

  async findUserConnection(
    userId: string,
    integrationId: string
  ): Promise<ConnectionRecord | undefined> {
    const connection = await this.prisma.connectCoreConnection.findUnique({
      where: { userId_integrationId: { userId, integrationId } }
    });
    return connection ? fromPrismaConnection(connection) : undefined;
  }

  async saveConnection(connection: ConnectionRecord): Promise<ConnectionRecord> {
    await this.ensureDemoUser(connection.userId);
    const saved = await this.prisma.connectCoreConnection.upsert({
      where: { id: connection.id },
      create: toPrismaConnectionCreate(connection),
      update: toPrismaConnectionUpdate(connection)
    });
    return fromPrismaConnection(saved);
  }

  async saveHealth(health: ConnectionHealthRecord): Promise<ConnectionHealthRecord> {
    const saved = await this.prisma.connectCoreConnectionHealth.create({
      data: {
        id: health.id,
        connectionId: health.connectionId,
        health: toPrismaHealth(health.health),
        message: health.message,
        checkedAt: new Date(health.checkedAt)
      }
    });
    return fromPrismaHealth(saved);
  }

  async getLatestHealth(connectionId: string): Promise<ConnectionHealthRecord | undefined> {
    const health = await this.prisma.connectCoreConnectionHealth.findFirst({
      where: { connectionId },
      orderBy: { checkedAt: "desc" }
    });
    return health ? fromPrismaHealth(health) : undefined;
  }

  async recordEvent(event: ConnectionEventRecord): Promise<ConnectionEventRecord> {
    const saved = await this.prisma.connectCoreConnectionEvent.create({
      data: {
        id: event.id,
        connectionId: event.connectionId,
        userId: event.userId,
        integrationId: event.integrationId,
        type: toPrismaEventType(event.type),
        provider: toPrismaProvider(event.providerKey),
        metadata: event.metadata,
        occurredAt: new Date(event.occurredAt)
      }
    });
    return fromPrismaEvent(saved);
  }

  async listEvents(connectionId: string): Promise<ConnectionEventRecord[]> {
    const events = await this.prisma.connectCoreConnectionEvent.findMany({
      where: { connectionId },
      orderBy: { occurredAt: "asc" }
    });
    return events.map(fromPrismaEvent);
  }

  async saveOAuthToken(token: OAuthTokenPlaceholder): Promise<OAuthTokenPlaceholder> {
    const saved = await this.prisma.connectCoreOAuthToken.upsert({
      where: { id: token.id },
      create: {
        id: token.id,
        connectionId: token.connectionId,
        provider: toPrismaProvider(token.providerKey),
        tokenRef: token.tokenRef,
        scopes: token.scopes,
        expiresAt: token.expiresAt ? new Date(token.expiresAt) : null,
        createdAt: new Date(token.createdAt),
        updatedAt: new Date(token.updatedAt)
      },
      update: {
        provider: toPrismaProvider(token.providerKey),
        tokenRef: token.tokenRef,
        scopes: token.scopes,
        expiresAt: token.expiresAt ? new Date(token.expiresAt) : null,
        updatedAt: new Date(token.updatedAt)
      }
    });
    return fromPrismaToken(saved);
  }

  async listOAuthTokens(connectionId: string): Promise<OAuthTokenPlaceholder[]> {
    const tokens = await this.prisma.connectCoreOAuthToken.findMany({
      where: { connectionId },
      orderBy: { createdAt: "asc" }
    });
    return tokens.map(fromPrismaToken);
  }

  private async ensureDemoUser(userId: string) {
    await this.prisma.user.upsert({
      where: { id: userId },
      create: {
        id: userId,
        email: `${userId}@connect-core.local`
      },
      update: {}
    });
  }
}

function toPrismaIntegrationCreate(integration: IntegrationDefinition) {
  return {
    id: integration.id,
    name: integration.name,
    category: integration.category,
    toolkitSlug: integration.toolkitSlug,
    authMethod: integration.authMethod,
    defaultProvider: toPrismaProvider(integration.defaultProvider),
    description: integration.description,
    recommendedFor: integration.recommendedFor,
    scopes: integration.scopes,
    isMvp: integration.isMvp
  };
}

function toPrismaIntegrationUpdate(integration: IntegrationDefinition) {
  const update = toPrismaIntegrationCreate(integration);
  delete (update as Partial<typeof update>).id;
  return update;
}

function toPrismaConnectionCreate(connection: ConnectionRecord) {
  return {
    id: connection.id,
    userId: connection.userId,
    integrationId: connection.integrationId,
    provider: toPrismaProvider(connection.providerKey),
    status: toPrismaConnectionStatus(connection.status),
      permissions: connection.permissions,
      metadata: connection.metadata ?? {},
      redirectUrl: connection.redirectUrl ?? null,
      externalAccountId: connection.externalAccountId ?? null,
      createdAt: new Date(connection.createdAt),
      updatedAt: new Date(connection.updatedAt)
  };
}

function toPrismaConnectionUpdate(connection: ConnectionRecord) {
  return {
    provider: toPrismaProvider(connection.providerKey),
    status: toPrismaConnectionStatus(connection.status),
    permissions: connection.permissions,
    metadata: connection.metadata ?? {},
    redirectUrl: connection.redirectUrl ?? null,
    externalAccountId: connection.externalAccountId ?? null,
    updatedAt: new Date(connection.updatedAt)
  };
}

function fromPrismaIntegration(integration: PrismaIntegration): IntegrationDefinition {
  return {
    id: integration.id,
    name: integration.name,
    category: integration.category as IntegrationDefinition["category"],
    toolkitSlug: integration.toolkitSlug,
    authMethod: integration.authMethod as IntegrationDefinition["authMethod"],
    defaultProvider: fromPrismaProvider(integration.defaultProvider),
    description: integration.description,
    recommendedFor: integration.recommendedFor,
    scopes: integration.scopes,
    isMvp: integration.isMvp
  };
}

function fromPrismaConnection(connection: PrismaConnection): ConnectionRecord {
  return {
    id: connection.id,
    userId: connection.userId,
    integrationId: connection.integrationId,
    providerKey: fromPrismaProvider(connection.provider),
    status: connection.status as ConnectionStatus,
    permissions: connection.permissions,
    metadata: connection.metadata as ConnectionRecord["metadata"],
    redirectUrl: connection.redirectUrl ?? undefined,
    externalAccountId: connection.externalAccountId ?? undefined,
    createdAt: connection.createdAt.toISOString(),
    updatedAt: connection.updatedAt.toISOString()
  };
}

function fromPrismaHealth(health: NonNullable<PrismaHealth>): ConnectionHealthRecord {
  return {
    id: health.id,
    connectionId: health.connectionId,
    health: health.health as IntegrationHealth,
    checkedAt: health.checkedAt.toISOString(),
    message: health.message
  };
}

function fromPrismaEvent(event: PrismaEvent): ConnectionEventRecord {
  return {
    id: event.id,
    connectionId: event.connectionId,
    userId: event.userId,
    integrationId: event.integrationId,
    type: fromPrismaEventType(event.type),
    providerKey: fromPrismaProvider(event.provider),
    metadata: event.metadata as ConnectionEventRecord["metadata"],
    occurredAt: event.occurredAt.toISOString()
  };
}

function fromPrismaToken(token: PrismaToken): OAuthTokenPlaceholder {
  return {
    id: token.id,
    connectionId: token.connectionId,
    providerKey: fromPrismaProvider(token.provider),
    tokenRef: token.tokenRef,
    scopes: token.scopes,
    expiresAt: token.expiresAt?.toISOString(),
    createdAt: token.createdAt.toISOString(),
    updatedAt: token.updatedAt.toISOString()
  };
}

function toPrismaProvider(providerKey: ProviderKey): PrismaProvider {
  if (providerKey === "direct-oauth") {
    return PrismaProvider.direct_oauth;
  }

  return providerKey === "composio" ? PrismaProvider.composio : PrismaProvider.mock;
}

function fromPrismaProvider(provider: string): ProviderKey {
  return provider === "direct_oauth" ? "direct-oauth" : (provider as ProviderKey);
}

function toPrismaConnectionStatus(status: ConnectionStatus): PrismaConnectionStatus {
  return status as PrismaConnectionStatus;
}

function toPrismaHealth(health: IntegrationHealth): PrismaHealthStatus {
  return health as PrismaHealthStatus;
}

function toPrismaEventType(type: ConnectionEventType): PrismaEventType {
  return type.replaceAll(".", "_") as PrismaEventType;
}

function fromPrismaEventType(type: string): ConnectionEventType {
  return type.replaceAll("_", ".") as ConnectionEventType;
}

function byCatalogOrder(left: IntegrationDefinition, right: IntegrationDefinition): number {
  const order = new Map(listIntegrations().map((integration, index) => [integration.id, index]));
  return (order.get(left.id) ?? Number.MAX_SAFE_INTEGER) - (order.get(right.id) ?? Number.MAX_SAFE_INTEGER);
}
