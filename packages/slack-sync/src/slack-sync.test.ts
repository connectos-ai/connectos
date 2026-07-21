import { describe, expect, it } from "vitest";
import { InMemoryAuditLog } from "@connect-any-inbox/audit-log";
import type { InboxMessage, MessageLabel } from "@connect-any-inbox/inbox-core";
import {
  createSlackSyncRule,
  syncLabeledMessagesToSlack,
  type SlackPostMessage
} from "./index";

const receivedAt = new Date("2026-06-16T14:00:00.000Z");

const gmailMessage: InboxMessage = {
  id: "msg_gmail_1",
  userId: "user_1",
  connectionId: "conn_gmail",
  source: "gmail",
  direction: "inbound",
  sender: "customer@example.com",
  recipients: ["owner@example.com"],
  subject: "Question about hours",
  preview: "Are you open this weekend?",
  receivedAt,
  sourceMetadata: { providerMessageId: "gmail-1", threadId: "thread-1" }
};

const smsMessage: InboxMessage = {
  id: "msg_twilio_1",
  userId: "user_1",
  connectionId: "conn_twilio",
  source: "twilio",
  direction: "inbound",
  sender: "+15551234567",
  recipients: ["+15557654321"],
  subject: null,
  preview: "Can I book for Friday?",
  receivedAt: new Date("2026-06-16T14:05:00.000Z"),
  sourceMetadata: { messageSid: "SM123", accountSid: "AC123" }
};

const labels: MessageLabel[] = [
  {
    messageId: "msg_gmail_1",
    labelId: "label_sales",
    appliedAt: new Date("2026-06-16T14:10:00.000Z")
  },
  {
    messageId: "msg_twilio_1",
    labelId: "label_support",
    appliedAt: new Date("2026-06-16T14:11:00.000Z")
  }
];

describe("Slack sync", () => {
  it("creates an active rule from a label to a Slack channel", () => {
    const rule = createSlackSyncRule({
      id: "sync_1",
      userId: "user_1",
      labelId: "label_sales",
      destinationChannelId: "C123",
      createdAt: receivedAt
    });

    expect(rule).toMatchObject({
      id: "sync_1",
      userId: "user_1",
      labelId: "label_sales",
      destination: "slack",
      destinationChannelId: "C123",
      status: "active"
    });
  });

  it("posts newly labeled matching messages to Slack", async () => {
    const posted: Array<{ channelId: string; text: string }> = [];
    const postMessage: SlackPostMessage = async (message) => {
      posted.push(message);
      return { slackMessageId: "slack_1" };
    };

    const result = await syncLabeledMessagesToSlack({
      rule: createSlackSyncRule({
        id: "sync_1",
        userId: "user_1",
        labelId: "label_sales",
        destinationChannelId: "C123",
        createdAt: receivedAt
      }),
      messages: [gmailMessage, smsMessage],
      messageLabels: labels,
      previousAttempts: [],
      postMessage,
      syncedAt: new Date("2026-06-16T14:15:00.000Z")
    });

    expect(posted).toHaveLength(1);
    expect(posted[0]).toMatchObject({
      channelId: "C123",
      text: "[Gmail] customer@example.com: Question about hours - Are you open this weekend?"
    });
    expect(result.attempts).toEqual([
      expect.objectContaining({
        messageId: "msg_gmail_1",
        syncRuleId: "sync_1",
        status: "synced",
        destinationMessageId: "slack_1"
      })
    ]);
  });

  it("does not post the same message twice for the same sync rule", async () => {
    let postCount = 0;

    const result = await syncLabeledMessagesToSlack({
      rule: createSlackSyncRule({
        id: "sync_1",
        userId: "user_1",
        labelId: "label_sales",
        destinationChannelId: "C123",
        createdAt: receivedAt
      }),
      messages: [gmailMessage],
      messageLabels: labels,
      previousAttempts: [
        {
          syncRuleId: "sync_1",
          messageId: "msg_gmail_1",
          status: "synced",
          destinationMessageId: "slack_1",
          attemptedAt: new Date("2026-06-16T14:12:00.000Z")
        }
      ],
      postMessage: async () => {
        postCount += 1;
        return { slackMessageId: "slack_2" };
      },
      syncedAt: new Date("2026-06-16T14:15:00.000Z")
    });

    expect(postCount).toBe(0);
    expect(result.attempts).toHaveLength(0);
  });

  it("records failed posts so they are visible and retryable", async () => {
    const result = await syncLabeledMessagesToSlack({
      rule: createSlackSyncRule({
        id: "sync_1",
        userId: "user_1",
        labelId: "label_sales",
        destinationChannelId: "C123",
        createdAt: receivedAt
      }),
      messages: [gmailMessage],
      messageLabels: labels,
      previousAttempts: [],
      postMessage: async () => {
        throw new Error("Slack token expired");
      },
      syncedAt: new Date("2026-06-16T14:15:00.000Z")
    });

    expect(result.attempts).toEqual([
      expect.objectContaining({
        messageId: "msg_gmail_1",
        status: "failed",
        errorMessage: "Slack token expired"
      })
    ]);
  expect(result.retryableFailures).toHaveLength(1);
  });

  it("records Slack sync attempts to audit log", async () => {
    const auditLog = new InMemoryAuditLog();

    await syncLabeledMessagesToSlack({
      audit: {
        actorId: "system",
        log: auditLog,
        requestId: "req_1",
        tenantId: "tenant_1"
      },
      rule: createSlackSyncRule({
        id: "sync_1",
        userId: "user_1",
        labelId: "label_sales",
        destinationChannelId: "C123",
        createdAt: receivedAt
      }),
      messages: [gmailMessage],
      messageLabels: labels,
      previousAttempts: [],
      postMessage: async () => ({ slackMessageId: "slack_1" }),
      syncedAt: new Date("2026-06-16T14:15:00.000Z")
    });

    expect(auditLog.list({ eventName: "slack_sync.attempted" })).toEqual([
      expect.objectContaining({
        metadata: expect.objectContaining({
          destinationChannelId: "C123",
          messageId: "msg_gmail_1",
          status: "synced",
          syncRuleId: "sync_1"
        })
      })
    ]);
  });
});
