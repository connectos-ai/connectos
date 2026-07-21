import {
  type CallbackPayload,
  type ConnectionProvider,
  type ConnectionRecord,
  type ConnectionStatus,
  type IntegrationHealth,
  type StartConnectionInput,
  type StartConnectionResult
} from "@connect-any-inbox/connect-core";

export class DirectOAuthProviderRouter implements ConnectionProvider {
  readonly key = "direct-oauth" as const;

  constructor(private readonly providersByIntegrationId: Record<string, ConnectionProvider>) {}

  async startConnection(input: StartConnectionInput): Promise<StartConnectionResult> {
    return this.providerForIntegration(input.integration.id).startConnection(input);
  }

  async completeConnection(input: {
    connection: ConnectionRecord;
    callbackPayload: CallbackPayload;
  }): Promise<Partial<ConnectionRecord>> {
    return this.providerForIntegration(input.connection.integrationId).completeConnection(input);
  }

  async reconnect(input: {
    connection: ConnectionRecord;
    callbackUrl: string;
  }): Promise<StartConnectionResult> {
    return this.providerForIntegration(input.connection.integrationId).reconnect(input);
  }

  async disconnect(input: { connection: ConnectionRecord }): Promise<Partial<ConnectionRecord>> {
    return this.providerForIntegration(input.connection.integrationId).disconnect(input);
  }

  async testConnection(input: { connection: ConnectionRecord }): Promise<{
    health: IntegrationHealth;
    status: ConnectionStatus;
    message: string;
  }> {
    return this.providerForIntegration(input.connection.integrationId).testConnection(input);
  }

  private providerForIntegration(integrationId: string): ConnectionProvider {
    const provider = this.providersByIntegrationId[integrationId];
    if (!provider) {
      throw new Error(`No direct OAuth provider is configured for ${integrationId}.`);
    }

    return provider;
  }
}
