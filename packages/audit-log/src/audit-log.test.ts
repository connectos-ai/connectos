import { describe, expect, it } from "vitest";
import {
  InMemoryAuditLog,
  createAuditEvent,
  createConnectionDecisionAuditEvent,
  createFallbackRunAuditEvent,
  createSlackSyncAttemptAuditEvent
} from "./index";

describe("audit log", () => {
  it("creates structured audit events with stable fields", () => {
    const event = createAuditEvent({
      actorId: "user_1",
      eventName: "connection.decided",
      metadata: { action: "start_oauth", channelId: "gmail" },
      occurredAt: new Date("2026-06-16T18:00:00.000Z"),
      requestId: "req_1",
      severity: "info",
      tenantId: "tenant_1"
    });

    expect(event).toMatchObject({
      actorId: "user_1",
      eventName: "connection.decided",
      requestId: "req_1",
      severity: "info",
      tenantId: "tenant_1"
    });
    expect(event.id).toMatch(/^audit_/);
  });

  it("redacts secret-shaped metadata keys", () => {
    const event = createAuditEvent({
      actorId: "user_1",
      eventName: "fallback.prepared",
      metadata: {
        access_token: "token-value",
        client_secret: "secret-value",
        safe: "visible",
        twilio_auth_token: "token-value"
      },
      occurredAt: new Date("2026-06-16T18:00:00.000Z"),
      requestId: "req_1",
      severity: "warn",
      tenantId: "tenant_1"
    });

    expect(event.metadata).toEqual({
      access_token: "[redacted]",
      client_secret: "[redacted]",
      safe: "visible",
      twilio_auth_token: "[redacted]"
    });
  });

  it("stores and queries events by tenant and event name", () => {
    const auditLog = new InMemoryAuditLog();

    auditLog.record(
      createConnectionDecisionAuditEvent({
        action: "start_oauth",
        actorId: "user_1",
        channelId: "gmail",
        requestId: "req_1",
        status: "ready",
        strategy: "oauth",
        tenantId: "tenant_1"
      })
    );
    auditLog.record(
      createFallbackRunAuditEvent({
        actorId: "user_2",
        channelId: "rentredi",
        providerId: "playwright",
        requestId: "req_2",
        status: "blocked",
        tenantId: "tenant_2"
      })
    );

    expect(auditLog.list({ tenantId: "tenant_1" })).toHaveLength(1);
    expect(auditLog.list({ eventName: "fallback.prepared" })).toHaveLength(1);
  });

  it("marks failed Slack sync attempts as warnings", () => {
    const event = createSlackSyncAttemptAuditEvent({
      actorId: "system",
      channelId: "slack",
      destinationChannelId: "C123",
      messageId: "msg_1",
      requestId: "req_1",
      status: "failed",
      syncRuleId: "sync_1",
      tenantId: "tenant_1"
    });

    expect(event).toMatchObject({
      eventName: "slack_sync.attempted",
      severity: "warn",
      metadata: {
        channelId: "slack",
        destinationChannelId: "C123",
        messageId: "msg_1",
        status: "failed",
        syncRuleId: "sync_1"
      }
    });
  });
});
