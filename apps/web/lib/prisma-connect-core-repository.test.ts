import { describe, expect, it } from "vitest";

import {
  ConnectCoreService,
  createDefaultProviderRegistry,
  listIntegrations,
  type ConnectionRecord
} from "@connect-any-inbox/connect-core";

import { PrismaConnectCoreRepository } from "./prisma-connect-core-repository";

describe("PrismaConnectCoreRepository", () => {
  it("persists repository contract records through Prisma-style delegates", async () => {
    const repository = new PrismaConnectCoreRepository(createFakePrismaClient() as never);
    await repository.upsertIntegrations(listIntegrations());

    expect(await repository.getIntegration("gmail")).toMatchObject({
      id: "gmail",
      defaultProvider: "mock"
    });

    const connection: ConnectionRecord = {
      id: "conn_test",
      userId: "local-demo-user",
      integrationId: "gmail",
      providerKey: "mock",
      status: "connected",
      permissions: ["gmail.readonly"],
      externalAccountId: "mock_gmail",
      createdAt: new Date("2026-01-01T00:00:00.000Z").toISOString(),
      updatedAt: new Date("2026-01-01T00:00:00.000Z").toISOString()
    };

    await repository.saveConnection(connection);
    expect(await repository.findUserConnection("local-demo-user", "gmail")).toMatchObject({
      id: "conn_test",
      status: "connected"
    });

    await repository.saveHealth({
      id: "health_test",
      connectionId: "conn_test",
      health: "healthy",
      checkedAt: new Date("2026-01-01T00:01:00.000Z").toISOString(),
      message: "ok"
    });
    expect(await repository.getLatestHealth("conn_test")).toMatchObject({ health: "healthy" });

    await repository.recordEvent({
      id: "event_test",
      connectionId: "conn_test",
      userId: "local-demo-user",
      integrationId: "gmail",
      providerKey: "mock",
      type: "connect.completed",
      metadata: { status: "connected" },
      occurredAt: new Date("2026-01-01T00:02:00.000Z").toISOString()
    });
    expect((await repository.listEvents("conn_test")).map((event) => event.type)).toEqual([
      "connect.completed"
    ]);

    await repository.saveOAuthToken({
      id: "token_test",
      connectionId: "conn_test",
      providerKey: "mock",
      tokenRef: "vault://connect-core/conn_test",
      scopes: ["gmail.readonly"],
      createdAt: new Date("2026-01-01T00:03:00.000Z").toISOString(),
      updatedAt: new Date("2026-01-01T00:03:00.000Z").toISOString()
    });
    expect(await repository.listOAuthTokens("conn_test")).toHaveLength(1);
  });

  it("persists connect, reconnect, disconnect, and health events through service flow", async () => {
    const repository = new PrismaConnectCoreRepository(createFakePrismaClient() as never);
    await repository.upsertIntegrations(listIntegrations());
    const service = new ConnectCoreService(repository, createDefaultProviderRegistry());

    const started = await service.startConnection(
      "local-demo-user",
      "gmail",
      "http://localhost:3000/api/connect-core/callback"
    );
    if (!started) {
      throw new Error("Expected start result.");
    }

    await service.completeConnection({ connectionId: started.connectionId, status: "success" });
    await service.reconnectConnection(
      started.connectionId,
      "http://localhost:3000/api/connect-core/callback"
    );
    await service.testConnection(started.connectionId);
    await service.disconnectConnection(started.connectionId);

    expect(await repository.getConnection(started.connectionId)).toMatchObject({
      status: "disconnected"
    });
    expect((await repository.listEvents(started.connectionId)).map((event) => event.type)).toEqual([
      "connect.started",
      "connect.completed",
      "reconnect.started",
      "health.checked",
      "disconnect.completed"
    ]);
    expect(await repository.getLatestHealth(started.connectionId)).toMatchObject({
      health: "broken",
      message: "Connection disconnected."
    });
  });
});

function createFakePrismaClient() {
  const users = new Map<string, { id: string; email: string }>();
  const integrations = new Map<string, Record<string, unknown>>();
  const connections = new Map<string, Record<string, unknown>>();
  const healthRows: Array<Record<string, unknown>> = [];
  const eventRows: Array<Record<string, unknown>> = [];
  const tokenRows = new Map<string, Record<string, unknown>>();
  type UpsertArgs = {
    where: { id: string };
    create: Record<string, unknown>;
    update: Record<string, unknown>;
  };

  return {
    user: {
      upsert: async ({ where, create, update }: UpsertArgs) => {
        const existing = users.get(where.id);
        const next = { ...(existing ?? create), ...update } as { id: string; email: string };
        users.set(where.id, next);
        return next;
      }
    },
    connectCoreIntegration: {
      findMany: async () => [...integrations.values()],
      findUnique: async ({ where }: { where: { id: string } }) => integrations.get(where.id) ?? null,
      upsert: async ({ where, create, update }: UpsertArgs) => {
        const existing = integrations.get(where.id);
        const now = new Date("2026-01-01T00:00:00.000Z");
        const next = {
          ...(existing ?? { ...create, createdAt: now }),
          ...update,
          updatedAt: now
        };
        integrations.set(where.id, next);
        return next;
      }
    },
    connectCoreConnection: {
      findMany: async ({ where }: { where?: { userId?: string } } = {}) =>
        [...connections.values()].filter((connection) => !where?.userId || connection.userId === where.userId),
      findUnique: async ({
        where
      }: {
        where: { id?: string; userId_integrationId?: { userId: string; integrationId: string } };
      }) => {
        if (where.id) {
          return connections.get(where.id) ?? null;
        }
        if (!where.userId_integrationId) {
          return null;
        }
        const userIntegration = where.userId_integrationId;
        return (
          [...connections.values()].find(
            (connection) =>
              connection.userId === userIntegration.userId &&
              connection.integrationId === userIntegration.integrationId
          ) ?? null
        );
      },
      upsert: async ({ where, create, update }: UpsertArgs) => {
        const existing = connections.get(where.id);
        const next = { ...(existing ?? create), ...update };
        connections.set(where.id, next);
        return next;
      }
    },
    connectCoreConnectionHealth: {
      create: async ({ data }: { data: Record<string, unknown> }) => {
        healthRows.push(data);
        return data;
      },
      findFirst: async ({ where }: { where: { connectionId: string } }) =>
        healthRows.filter((health) => health.connectionId === where.connectionId).at(-1) ?? null
    },
    connectCoreConnectionEvent: {
      create: async ({ data }: { data: Record<string, unknown> }) => {
        eventRows.push(data);
        return data;
      },
      findMany: async ({ where }: { where: { connectionId: string } }) =>
        eventRows
          .filter((event) => event.connectionId === where.connectionId)
          .sort((left, right) => Number(left.occurredAt) - Number(right.occurredAt))
    },
    connectCoreOAuthToken: {
      upsert: async ({ where, create, update }: UpsertArgs) => {
        const existing = tokenRows.get(where.id);
        const next = { ...(existing ?? create), ...update };
        tokenRows.set(where.id, next);
        return next;
      },
      findMany: async ({ where }: { where: { connectionId: string } }) =>
        [...tokenRows.values()].filter((token) => token.connectionId === where.connectionId)
    }
  };
}
