import { PrismaClient } from "@prisma/client";
import {
 ConnectCoreService,
 InMemoryConnectCoreRepository,
 listAiSkills,
 listIntegrations,
 listUniversalActions,
 MockConnectionProvider,
 PlaceholderConnectionProvider,
 resolveSkillProviders,
 resolveUniversalActionProviders,
 StaticProviderRegistry,
  type CallbackPayload,
  type ConnectCoreRepository,
  type IntegrationCategory,
  type IntegrationDefinition,
  type ProviderRegistry
} from "@connect-any-inbox/connect-core";

import {
  applyComposioProviderAvailability,
  ComposioConnectionProvider,
  getComposioConfig,
  getComposioIntegrationMappings
} from "./composio-provider";
import {
  applyGoogleProviderAvailability,
  getGoogleOAuthConfig,
  GoogleDirectOAuthProvider
} from "./google-direct-oauth-provider";
import { DirectOAuthProviderRouter } from "./direct-oauth-provider-router";
import { PrismaConnectCoreRepository } from "./prisma-connect-core-repository";
import {
  applySlackProviderAvailability,
  getSlackOAuthConfig,
  SlackDirectOAuthProvider
} from "./slack-direct-oauth-provider";

const localDemoUserId = "local-demo-user";
const directOAuthIntegrationIds = ["gmail", "google-calendar", "slack"];

const globalStore = globalThis as typeof globalThis & {
__connectOsConnectCoreRepository?: ConnectCoreRepository;
__connectOsConnectCoreProviders?: ProviderRegistry;
__connectOsConnectCoreService?: ConnectCoreService;
__connectOsConnectCoreServicePromise?: Promise<ConnectCoreService>;
__connectOsPrismaClient?: PrismaClient;
__connectOsConnectCoreFallbackWarned?: boolean;
};

export function getLocalDemoUserId() {
  return localDemoUserId;
}

export async function getConnectCoreDashboard(category?: IntegrationCategory) {
  const dashboard = await (await getConnectCoreService()).getDashboard(localDemoUserId, category);
  const googleConfigured = Boolean(getGoogleOAuthConfig());
  const slackConfigured = Boolean(getSlackOAuthConfig());
  const composioConfigured = Boolean(getComposioConfig());

  return dashboard.map((item) => ({
    ...item,
    providerMode: providerModeFor(item.defaultProvider),
    providerStatus: providerStatusFor(item, {
      googleConfigured,
      slackConfigured,
      composioConfigured
    })
  }));
}

export async function listConnectCoreConnections() {
 return (await getConnectCoreService()).listUserConnections(localDemoUserId);
}

export async function getConnectCoreUniversalActions() {
 const repository = await getConnectCoreRepository();
 const connections = await repository.listUserConnections(localDemoUserId);
 return listUniversalActions().map((action) => ({
  ...action,
  availableProviders: resolveUniversalActionProviders(localDemoUserId, action.id, connections)
 }));
}

export async function getConnectCoreSkills() {
 const repository = await getConnectCoreRepository();
 const connections = await repository.listUserConnections(localDemoUserId);
 return listAiSkills().map((skill) => ({
  ...skill,
  availableProviders: resolveSkillProviders(localDemoUserId, skill.id, connections)
 }));
}

export async function startConnectCoreConnection(integrationId: string, callbackUrl: string) {
 return (await getConnectCoreService()).startConnection(localDemoUserId, integrationId, callbackUrl);
}

export async function completeConnectCoreConnection(callbackPayload: CallbackPayload) {
  return (await getConnectCoreService()).completeConnection(callbackPayload);
}

export async function reconnectConnectCoreConnection(connectionId: string, callbackUrl: string) {
  return (await getConnectCoreService()).reconnectConnection(connectionId, callbackUrl);
}

export async function disconnectConnectCoreConnection(connectionId: string) {
  return (await getConnectCoreService()).disconnectConnection(connectionId);
}

export async function testConnectCoreConnection(connectionId: string) {
  return (await getConnectCoreService()).testConnection(connectionId);
}

export async function getConnectCoreDebugInfo() {
  const repository = await getConnectCoreRepository();
  const googleConfig = getGoogleOAuthConfig();
  const slackConfig = getSlackOAuthConfig();
  const composioConfig = getComposioConfig();
  const dashboard = await getConnectCoreDashboard();
  const debugItems = dashboard.filter(
    (item) => directOAuthIntegrationIds.includes(item.id) || item.defaultProvider === "composio"
  );

  return {
    isProduction: process.env.NODE_ENV === "production",
    googleConfigured: Boolean(googleConfig),
    googleRedirectUri: googleConfig?.redirectUri ?? process.env.GOOGLE_REDIRECT_URI ?? null,
    slackConfigured: Boolean(slackConfig),
    slackRedirectUri: slackConfig?.redirectUri ?? process.env.SLACK_REDIRECT_URI ?? null,
    composioConfigured: Boolean(composioConfig),
    composioBaseUrl: composioConfig?.baseUrl ?? process.env.COMPOSIO_BASE_URL ?? null,
    composioMappings: getComposioIntegrationMappings(dashboard, composioConfig),
    oauthIntegrations: await Promise.all(
      debugItems.map(async (item) => {
        const connectionId = item.connection?.id;
        const events = connectionId ? await repository.listEvents(connectionId) : [];
        const latestEvent = events.at(-1);
        const latestHealth = connectionId
          ? await repository.getLatestHealth(connectionId)
          : undefined;

        return {
          id: item.id,
          name: item.name,
          providerMode: item.providerMode,
          providerStatus: item.providerStatus,
          connectionStatus: item.connection?.status ?? "available",
          connectionHealth: item.connection?.health ?? null,
          lastConnectionEvent: latestEvent
            ? {
                type: latestEvent.type,
                occurredAt: latestEvent.occurredAt,
                providerKey: latestEvent.providerKey
              }
            : null,
          lastHealthCheck: latestHealth
            ? {
                health: latestHealth.health,
                checkedAt: latestHealth.checkedAt,
                message: latestHealth.message
              }
            : null
        };
      })
    )
  };
}

async function getConnectCoreService(): Promise<ConnectCoreService> {
globalStore.__connectOsConnectCoreServicePromise ??= createConnectCoreService();
return globalStore.__connectOsConnectCoreServicePromise;
}

async function getConnectCoreRepository(): Promise<ConnectCoreRepository> {
  await getConnectCoreService();
return globalStore.__connectOsConnectCoreRepository as ConnectCoreRepository;
}

async function createConnectCoreService(): Promise<ConnectCoreService> {
if (globalStore.__connectOsConnectCoreService) {
return globalStore.__connectOsConnectCoreService;
}

globalStore.__connectOsConnectCoreRepository ??= await selectRepository();
globalStore.__connectOsConnectCoreProviders ??= createProviderRegistry(
globalStore.__connectOsConnectCoreRepository
);
globalStore.__connectOsConnectCoreService = new ConnectCoreService(
globalStore.__connectOsConnectCoreRepository,
globalStore.__connectOsConnectCoreProviders
);

return globalStore.__connectOsConnectCoreService;
}

async function selectRepository(): Promise<ConnectCoreRepository> {
  const seededIntegrations = getSeededIntegrations();

  if (!process.env.DATABASE_URL) {
    warnInMemoryFallback("DATABASE_URL is not set.");
    return new InMemoryConnectCoreRepository(seededIntegrations);
  }

  try {
globalStore.__connectOsPrismaClient ??= new PrismaClient();
await globalStore.__connectOsPrismaClient.$connect();
const repository = new PrismaConnectCoreRepository(globalStore.__connectOsPrismaClient);
    await repository.upsertIntegrations(seededIntegrations);
    return repository;
  } catch (error) {
    const reason = error instanceof Error ? error.message : "Unknown database error.";
    warnInMemoryFallback(`Prisma repository fallback. ${reason}`);
    return new InMemoryConnectCoreRepository(seededIntegrations);
  }
}

function getSeededIntegrations(): IntegrationDefinition[] {
  return applySlackProviderAvailability(
    applyGoogleProviderAvailability(
      applyComposioProviderAvailability(listIntegrations(), Boolean(getComposioConfig())),
      Boolean(getGoogleOAuthConfig())
    ),
    Boolean(getSlackOAuthConfig())
  );
}

function createProviderRegistry(repository: ConnectCoreRepository): ProviderRegistry {
  const googleConfig = getGoogleOAuthConfig();
  const slackConfig = getSlackOAuthConfig();
  const composioConfig = getComposioConfig();
  const directProviders = {
    ...(googleConfig
      ? {
          gmail: new GoogleDirectOAuthProvider(googleConfig, repository),
          "google-calendar": new GoogleDirectOAuthProvider(googleConfig, repository)
        }
      : {}),
    ...(slackConfig ? { slack: new SlackDirectOAuthProvider(slackConfig, repository) } : {})
  };

  return new StaticProviderRegistry({
    mock: new MockConnectionProvider(),
    composio: composioConfig
      ? new ComposioConnectionProvider(composioConfig)
      : new PlaceholderConnectionProvider(
          "composio",
          "Composio API key is missing. Set COMPOSIO_API_KEY to enable Composio-powered connections."
        ),
    "direct-oauth":
      Object.keys(directProviders).length > 0
        ? new DirectOAuthProviderRouter(directProviders)
        : new PlaceholderConnectionProvider(
            "direct-oauth",
            "Direct OAuth env vars are missing. Set Google or Slack OAuth client env vars."
          )
  });
}

function providerModeFor(
  provider: IntegrationDefinition["defaultProvider"]
): "mock" | "real-oauth" | "composio" {
  if (provider === "direct-oauth") {
    return "real-oauth";
  }

  if (provider === "composio") {
    return "composio";
  }

  return "mock";
}

function providerStatusFor(
  item: IntegrationDefinition,
  config: {
    googleConfigured: boolean;
    slackConfigured: boolean;
    composioConfigured: boolean;
  }
) {
  if (["gmail", "google-calendar"].includes(item.id)) {
    return config.googleConfigured ? "Google OAuth" : "Mock: config missing";
  }

  if (item.id === "slack") {
    return config.slackConfigured ? "Slack OAuth" : "Mock: config missing";
  }

  if (item.defaultProvider === "composio") {
    return "Composio";
  }

  if (["github", "hubspot", "quickbooks", "google-drive", "stripe"].includes(item.id)) {
    return config.composioConfigured ? "Composio" : "Mock: config missing";
  }

  return "Mock";
}

function warnInMemoryFallback(reason: string) {
if (globalStore.__connectOsConnectCoreFallbackWarned) {
return;
}

console.warn(`[connect-core] Using in-memory repository fallback. ${reason}`);
globalStore.__connectOsConnectCoreFallbackWarned = true;
}
