import {
  createSlackSyncAttemptAuditEvent,
  type AuditSink
} from "@connect-any-inbox/audit-log";
import type {
  InboxMessage,
  MessageLabel,
  SyncRule
} from "@connect-any-inbox/inbox-core";

export type SlackSyncAttemptStatus = "synced" | "failed";

export interface CreateSlackSyncRuleInput {
  id: string;
  userId: string;
  labelId: string;
  destinationChannelId: string;
  createdAt: Date;
}

export interface SlackPostInput {
  channelId: string;
  text: string;
}

export interface SlackPostResult {
  slackMessageId: string;
}

export type SlackPostMessage = (message: SlackPostInput) => Promise<SlackPostResult>;

export interface SlackSyncAttempt {
  syncRuleId: string;
  messageId: string;
  status: SlackSyncAttemptStatus;
  destinationMessageId: string | null;
  attemptedAt: Date;
  errorMessage?: string;
}

export interface SlackSyncAuditContext {
  actorId: string;
  log: AuditSink;
  requestId: string;
  tenantId: string;
}

export interface SyncLabeledMessagesInput {
  audit?: SlackSyncAuditContext;
  rule: SyncRule;
  messages: InboxMessage[];
  messageLabels: MessageLabel[];
  previousAttempts: SlackSyncAttempt[];
  postMessage: SlackPostMessage;
  syncedAt: Date;
}

export interface SyncLabeledMessagesResult {
  attempts: SlackSyncAttempt[];
  retryableFailures: SlackSyncAttempt[];
}

export function createSlackSyncRule(input: CreateSlackSyncRuleInput): SyncRule {
  return {
    id: input.id,
    userId: input.userId,
    labelId: input.labelId,
    destination: "slack",
    destinationChannelId: input.destinationChannelId,
    status: "active",
    createdAt: input.createdAt,
    updatedAt: input.createdAt
  };
}

export async function syncLabeledMessagesToSlack(
  input: SyncLabeledMessagesInput
): Promise<SyncLabeledMessagesResult> {
  if (input.rule.status !== "active") {
    return { attempts: [], retryableFailures: [] };
  }

  const alreadySyncedMessageIds = new Set(
    input.previousAttempts
      .filter((attempt) => attempt.syncRuleId === input.rule.id && attempt.status === "synced")
      .map((attempt) => attempt.messageId)
  );
  const labeledMessageIds = new Set(
    input.messageLabels
      .filter((messageLabel) => messageLabel.labelId === input.rule.labelId)
      .map((messageLabel) => messageLabel.messageId)
  );
  const messagesToSync = input.messages.filter(
    (message) =>
      message.userId === input.rule.userId &&
      labeledMessageIds.has(message.id) &&
      !alreadySyncedMessageIds.has(message.id)
  );
  const attempts: SlackSyncAttempt[] = [];

  for (const message of messagesToSync) {
    try {
      const postResult = await input.postMessage({
        channelId: input.rule.destinationChannelId,
        text: formatSlackMessage(message)
      });

      const attempt: SlackSyncAttempt = {
        syncRuleId: input.rule.id,
        messageId: message.id,
        status: "synced",
        destinationMessageId: postResult.slackMessageId,
        attemptedAt: input.syncedAt
      };
      attempts.push(attempt);
      recordSlackSyncAudit(input, attempt);
    } catch (error) {
      const attempt: SlackSyncAttempt = {
        syncRuleId: input.rule.id,
        messageId: message.id,
        status: "failed",
        destinationMessageId: null,
        attemptedAt: input.syncedAt,
        errorMessage: error instanceof Error ? error.message : "Unknown Slack sync error"
      };
      attempts.push(attempt);
      recordSlackSyncAudit(input, attempt);
    }
  }

  return {
    attempts,
    retryableFailures: attempts.filter((attempt) => attempt.status === "failed")
  };
}

function recordSlackSyncAudit(
  input: SyncLabeledMessagesInput,
  attempt: SlackSyncAttempt
): void {
  input.audit?.log.record(
    createSlackSyncAttemptAuditEvent({
      actorId: input.audit.actorId,
      channelId: "slack",
      destinationChannelId: input.rule.destinationChannelId,
      messageId: attempt.messageId,
      requestId: input.audit.requestId,
      status: attempt.status,
      syncRuleId: attempt.syncRuleId,
      tenantId: input.audit.tenantId
    })
  );
}

function formatSlackMessage(message: InboxMessage): string {
  const source = message.source === "gmail" ? "Gmail" : "Twilio";
  const subject = message.subject ? `${message.subject} - ` : "";

  return `[${source}] ${message.sender}: ${subject}${message.preview}`;
}
