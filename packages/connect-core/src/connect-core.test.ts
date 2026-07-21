import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";

import {
 ConnectCoreService,
 type ConnectionRecord,
 connectorManifestExample,
 createDefaultProviderRegistry,
 getIntegration,
 getAiSkill,
 getConnectorCapabilities,
 getStarterKit,
 InMemoryConnectCoreRepository,
 listConnectorActions,
 listConnectorCapabilities,
 listIntegrations,
 listAiSkills,
 listStarterKits,
 listUniversalActions,
 resolveSkillProviders,
 resolveUniversalActionProviders,
 validateConnectorManifest
} from "./index";

describe("connect core", () => {
  it("keeps catalog data-driven and category filterable", () => {
    expect(listIntegrations()).toHaveLength(8);
    expect(listIntegrations("calendar").map((integration) => integration.id)).toEqual([
      "google-calendar"
    ]);
    expect(getIntegration("gmail")).toMatchObject({
      defaultProvider: "mock",
      toolkitSlug: "gmail"
    });
  });

  it("exposes business starter kits with ordered recommended integrations", () => {
    expect(listStarterKits()).toHaveLength(5);
    expect(getStarterKit("church")).toMatchObject({
      name: "Church",
      recommendedIntegrations: expect.arrayContaining([
        expect.objectContaining({
          integrationId: "gmail",
          requirement: "required",
          setupOrder: 1
        })
      ])
    });
    expect(getStarterKit("agency")?.recommendedIntegrations.map((item) => item.setupOrder)).toEqual([
      1,
      2,
      3,
      4,
      5
    ]);
  });

  it("validates connector manifests and reports invalid manifests", () => {
    expect(validateConnectorManifest(connectorManifestExample)).toEqual({
      valid: true,
      errors: []
    });

    const invalid = validateConnectorManifest({
      id: "",
      name: "Broken Connector",
      category: "unknown",
      toolkitSlug: "broken",
      authMethod: "oauth",
      providerOptions: ["mystery"],
      scopes: ["read"],
      actions: []
    });

    expect(invalid.valid).toBe(false);
    expect(invalid.errors).toEqual(
      expect.arrayContaining([
        "id is required.",
        "category must be a known integration category.",
        "providerOptions includes unknown provider: mystery.",
        "actions must include at least one action."
      ])
    );
  });

  it("keeps public connector manifest examples valid", () => {
    const jsonExample = JSON.parse(
      readFileSync(resolve("docs/connectors/manifest.example.json"), "utf8")
    ) as unknown;
    const yamlExample = readFileSync(resolve("docs/connectors/manifest.example.yaml"), "utf8");

    expect(validateConnectorManifest(jsonExample)).toEqual({ valid: true, errors: [] });
    expect(jsonExample).toMatchObject(connectorManifestExample);
    expect(yamlExample).toContain("id: example-calendar");
    expect(yamlExample).toContain("category: calendar");
    expect(yamlExample).toContain("authMethod: oauth");
    expect(yamlExample).toContain("  - mock");
    expect(yamlExample).toContain("  - composio");
    expect(yamlExample).toContain("  - calendar.events.read");
    expect(yamlExample).toContain("    name: List events");
  });

  it("maps connectors to capabilities, actions, and permissions", () => {
    expect(listConnectorCapabilities()).toHaveLength(8);
    expect(getConnectorCapabilities("gmail")).toMatchObject({
      connectorName: "Gmail",
      capabilities: expect.arrayContaining([
        expect.objectContaining({
          id: "read-email",
          name: "Read Email",
          permissions: ["gmail.readonly"]
        }),
        expect.objectContaining({
          id: "send-email",
          name: "Send Email",
          permissions: ["gmail.send"]
        })
      ])
    });
    expect(getConnectorCapabilities("slack")).toMatchObject({
      capabilities: expect.arrayContaining([
        expect.objectContaining({
          id: "send-messages",
          name: "Send Messages",
          permissions: ["chat.write"]
        })
      ])
    });
  });

  it("lets agents query actions by capability instead of connector name", () => {
    const sendMessageActions = listConnectorActions().filter(
      (action) => action.capabilityId === "send-messages"
    );

 expect(sendMessageActions).toEqual([
  expect.objectContaining({
   connectorId: "slack",
   connectorName: "Slack",
   id: "slack.send-message",
   permissions: ["chat.write"]
  })
 ]);
});

 it("maps connector actions to universal agent actions", () => {
  expect(listUniversalActions()).toEqual(
   expect.arrayContaining([
    expect.objectContaining({
     id: "send_message",
     name: "Send message",
     connectors: expect.arrayContaining([
      expect.objectContaining({ connectorId: "slack", connectorActionId: "slack.send-message" }),
      expect.objectContaining({ connectorId: "gmail", connectorActionId: "gmail.send-message" })
     ])
    }),
    expect.objectContaining({
     id: "create_calendar_event",
     connectors: [
      expect.objectContaining({
       connectorId: "google-calendar",
       connectorActionId: "google-calendar.create-event"
      })
     ]
    })
   ])
  );
 });

 it("resolves universal actions to connected providers only", () => {
  const connections: ConnectionRecord[] = [
   {
    id: "conn_slack",
    userId: "local-demo-user",
    integrationId: "slack",
    providerKey: "mock",
    status: "connected",
    permissions: ["chat.write"],
    createdAt: "2026-07-08T00:00:00.000Z",
    updatedAt: "2026-07-08T00:00:00.000Z"
   },
   {
    id: "conn_gmail",
    userId: "local-demo-user",
    integrationId: "gmail",
    providerKey: "mock",
    status: "disconnected",
    permissions: ["gmail.send"],
    createdAt: "2026-07-08T00:00:00.000Z",
    updatedAt: "2026-07-08T00:00:00.000Z"
   }
  ];

  expect(resolveUniversalActionProviders("local-demo-user", "send_message", connections)).toEqual([
   expect.objectContaining({
    connectionId: "conn_slack",
    connectorId: "slack",
    connectorActionId: "slack.send-message",
    providerKey: "mock"
   })
  ]);
 });

 it("dry-runs universal actions without performing writes", async () => {
  const repository = new InMemoryConnectCoreRepository();
  const service = new ConnectCoreService(repository, createDefaultProviderRegistry());
  const started = await service.startConnection(
   "local-demo-user",
   "slack",
   "http://localhost:3000/api/connect-core/callback"
  );
  if (!started) throw new Error("Expected start connection result.");
  await service.completeConnection({ connectionId: started.connectionId, status: "success" });

  await expect(service.resolveUniversalActionProviders("local-demo-user", "send_message")).resolves.toEqual([
   expect.objectContaining({
    connectorId: "slack",
    connectionId: started.connectionId
   })
  ]);

  await expect(
   service.executeUniversalAction({
    userId: "local-demo-user",
    action: "send_message",
    preferredProvider: "slack",
    input: { channel: "#general", text: "Hello" }
   })
 ).resolves.toMatchObject({
  dryRun: true,
  wouldExecute: true,
  selectedProvider: expect.objectContaining({
   connectorId: "slack",
   connectionId: started.connectionId
  })
 });
});

 it("exposes public AI skills mapped to universal actions", () => {
  expect(listAiSkills().map((skill) => skill.id)).toEqual([
   "notify_team",
   "send_customer_update",
   "send_welcome_email",
   "send_appointment_reminder",
   "schedule_meeting",
   "add_customer",
   "search_customer",
   "find_file",
   "save_file"
  ]);
  expect(getAiSkill("notify_team")).toMatchObject({
   name: "Notify Team",
   category: "communication",
   actions: [expect.objectContaining({ universalActionId: "send_message", priority: 1 })]
  });
  expect(getAiSkill("schedule_meeting")).toMatchObject({
   actions: [expect.objectContaining({ universalActionId: "create_calendar_event" })]
  });
 });

 it("resolves AI skills through connected universal action providers", () => {
  const connections: ConnectionRecord[] = [
   {
    id: "conn_slack",
    userId: "local-demo-user",
    integrationId: "slack",
    providerKey: "mock",
    status: "connected",
    permissions: ["chat.write"],
    createdAt: "2026-07-08T00:00:00.000Z",
    updatedAt: "2026-07-08T00:00:00.000Z"
   }
  ];

  expect(resolveSkillProviders("local-demo-user", "notify_team", connections)).toEqual([
   expect.objectContaining({
    skillId: "notify_team",
    universalActionId: "send_message",
    provider: expect.objectContaining({
     connectorId: "slack",
     connectorActionId: "slack.send-message"
    })
   })
  ]);
 });

 it("dry-runs AI skills without performing writes", async () => {
  const repository = new InMemoryConnectCoreRepository();
  const service = new ConnectCoreService(repository, createDefaultProviderRegistry());
  const started = await service.startConnection(
   "local-demo-user",
   "slack",
   "http://localhost:3000/api/connect-core/callback"
  );
  if (!started) throw new Error("Expected start connection result.");
  await service.completeConnection({ connectionId: started.connectionId, status: "success" });

  await expect(service.resolveSkillProviders("local-demo-user", "notify_team")).resolves.toEqual([
   expect.objectContaining({
    skillId: "notify_team",
    provider: expect.objectContaining({ connectionId: started.connectionId })
   })
  ]);

  await expect(
   service.executeSkill({
    userId: "local-demo-user",
    skill: "notify_team",
    preferredProvider: "slack",
    input: { message: "Standup starts in five minutes." }
   })
  ).resolves.toMatchObject({
   dryRun: true,
   wouldExecute: true,
   selectedProvider: expect.objectContaining({
    skillId: "notify_team",
    universalActionId: "send_message",
    provider: expect.objectContaining({
     connectorId: "slack",
     connectionId: started.connectionId
    })
   })
  });
 });

 it("starts, completes, tests, reconnects, and disconnects through service boundaries", async () => {
    const repository = new InMemoryConnectCoreRepository();
    const service = new ConnectCoreService(repository, createDefaultProviderRegistry());

    const started = await service.startConnection(
      "local-demo-user",
      "gmail",
      "http://localhost:3000/api/connect-core/callback"
    );
    expect(started).toMatchObject({
      providerKey: "mock",
      status: "pending"
    });
    expect(started?.redirectUrl).toContain("status=success");

    if (!started) {
      throw new Error("Expected start connection result.");
    }

    const connected = await service.completeConnection({
      connectionId: started.connectionId,
      status: "success"
    });
    expect(connected).toMatchObject({
      integrationId: "gmail",
      provider: "mock",
      status: "connected",
      health: "healthy"
    });

    const checked = await service.testConnection(started.connectionId);
    expect(checked).toMatchObject({ status: "connected", health: "healthy" });

    const reconnecting = await service.reconnectConnection(
      started.connectionId,
      "http://localhost:3000/api/connect-core/callback"
    );
    expect(reconnecting).toMatchObject({ status: "pending" });

    const disconnected = await service.disconnectConnection(started.connectionId);
    expect(disconnected).toMatchObject({
      status: "disconnected",
      health: "broken"
    });

    const events = await repository.listEvents(started.connectionId);
    expect(events.map((event) => event.type)).toEqual([
      "connect.started",
      "connect.completed",
      "health.checked",
      "reconnect.started",
      "disconnect.completed"
    ]);
  });
});
