import { randomUUID } from "node:crypto";

export type AuditSeverity = "info" | "warn" | "error";
export type AuditEventName =
  | "connection.decided"
  | "fallback.prepared"
  | "slack_sync.attempted";

export type AuditMetadataValue = string | number | boolean | null;
export type AuditMetadata = Record<string, AuditMetadataValue>;

export interface AuditEvent {
  id: string;
  tenantId: string;
  actorId: string;
  requestId: string;
  eventName: AuditEventName;
  severity: AuditSeverity;
  metadata: AuditMetadata;
  occurredAt: Date;
}

export interface CreateAuditEventInput {
  tenantId: string;
  actorId: string;
  requestId: string;
  eventName: AuditEventName;
  severity: AuditSeverity;
  metadata: AuditMetadata;
  occurredAt?: Date;
}

export interface AuditLogListFilter {
  tenantId?: string;
  eventName?: AuditEventName;
}

export interface AuditSink {
  record(event: AuditEvent): AuditEvent;
}

export class InMemoryAuditLog implements AuditSink {
  private readonly events: AuditEvent[] = [];

  record(event: AuditEvent): AuditEvent {
    this.events.push(event);
    return event;
  }

  list(filter: AuditLogListFilter = {}): AuditEvent[] {
    return this.events.filter(
      (event) =>
        (!filter.tenantId || event.tenantId === filter.tenantId) &&
        (!filter.eventName || event.eventName === filter.eventName)
    );
  }
}

export function createAuditEvent(input: CreateAuditEventInput): AuditEvent {
  return {
    id: `audit_${randomUUID()}`,
    tenantId: input.tenantId,
    actorId: input.actorId,
    requestId: input.requestId,
    eventName: input.eventName,
    severity: input.severity,
    metadata: redactMetadata(input.metadata),
    occurredAt: input.occurredAt ?? new Date()
  };
}

export function createConnectionDecisionAuditEvent(input: {
  tenantId: string;
  actorId: string;
  requestId: string;
  channelId: string;
  strategy: string | null;
  status: string;
  action: string;
}): AuditEvent {
  return createAuditEvent({
    tenantId: input.tenantId,
    actorId: input.actorId,
    requestId: input.requestId,
    eventName: "connection.decided",
    severity: input.status === "failed" ? "error" : "info",
    metadata: {
      channelId: input.channelId,
      strategy: input.strategy,
      status: input.status,
      action: input.action
    }
  });
}

export function createFallbackRunAuditEvent(input: {
  tenantId: string;
  actorId: string;
  requestId: string;
  channelId: string;
  providerId: string;
  status: string;
}): AuditEvent {
  return createAuditEvent({
    tenantId: input.tenantId,
    actorId: input.actorId,
    requestId: input.requestId,
    eventName: "fallback.prepared",
    severity: input.status === "ready" ? "warn" : "info",
    metadata: {
      channelId: input.channelId,
      providerId: input.providerId,
      status: input.status
    }
  });
}

export function createSlackSyncAttemptAuditEvent(input: {
  tenantId: string;
  actorId: string;
  requestId: string;
  channelId: string;
  syncRuleId: string;
  messageId: string;
  destinationChannelId: string;
  status: string;
}): AuditEvent {
  return createAuditEvent({
    tenantId: input.tenantId,
    actorId: input.actorId,
    requestId: input.requestId,
    eventName: "slack_sync.attempted",
    severity: input.status === "failed" ? "warn" : "info",
    metadata: {
      channelId: input.channelId,
      destinationChannelId: input.destinationChannelId,
      messageId: input.messageId,
      status: input.status,
      syncRuleId: input.syncRuleId
    }
  });
}

function redactMetadata(metadata: AuditMetadata): AuditMetadata {
  return Object.fromEntries(
    Object.entries(metadata).map(([key, value]) => [
      key,
      isSensitiveKey(key) ? "[redacted]" : value
    ])
  );
}

function isSensitiveKey(key: string): boolean {
  const normalized = key.toLowerCase();
  return (
    normalized.includes("secret") ||
    normalized.includes("password") ||
    normalized.includes("token") ||
    normalized.includes("api_key")
  );
}
