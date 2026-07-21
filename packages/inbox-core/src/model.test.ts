import { describe, expect, it } from "vitest";
import {
  createGmailInboxMessage,
  createTwilioInboxMessage,
  applyLabelToMessage,
  searchInboxMessages,
  type Connection,
  type Label,
  type MessageLabel,
  type SyncRule
} from "./index";

describe("inbox data model", () => {
  it("normalizes Gmail messages into the shared inbox shape", () => {
    const message = createGmailInboxMessage({
      id: "msg_gmail_1",
      userId: "user_1",
      connectionId: "conn_gmail",
      providerMessageId: "gmail-message-id",
      threadId: "gmail-thread-id",
      from: "customer@example.com",
      to: ["owner@example.com"],
      subject: "Question about hours",
      preview: "Are you open this weekend?",
      receivedAt: new Date("2026-06-16T14:00:00.000Z")
    });

    expect(message).toMatchObject({
      id: "msg_gmail_1",
      userId: "user_1",
      connectionId: "conn_gmail",
      source: "gmail",
      direction: "inbound",
      sender: "customer@example.com",
      recipients: ["owner@example.com"],
      subject: "Question about hours",
      preview: "Are you open this weekend?",
      sourceMetadata: {
        providerMessageId: "gmail-message-id",
        threadId: "gmail-thread-id"
      }
    });
  });

  it("normalizes Twilio SMS events into the same inbox shape", () => {
    const message = createTwilioInboxMessage({
      id: "msg_twilio_1",
      userId: "user_1",
      connectionId: "conn_twilio",
      messageSid: "SM123",
      accountSid: "AC123",
      from: "+15551234567",
      to: "+15557654321",
      body: "Can I book for Friday?",
      receivedAt: new Date("2026-06-16T14:05:00.000Z")
    });

    expect(message).toMatchObject({
      id: "msg_twilio_1",
      userId: "user_1",
      connectionId: "conn_twilio",
      source: "twilio",
      direction: "inbound",
      sender: "+15551234567",
      recipients: ["+15557654321"],
      subject: null,
      preview: "Can I book for Friday?",
      sourceMetadata: {
        messageSid: "SM123",
        accountSid: "AC123"
      }
    });
  });

  it("models connection, label, message label, and Slack sync rule relationships", () => {
    const connection: Connection = {
      id: "conn_gmail",
      userId: "user_1",
      provider: "gmail",
      strategy: "oauth",
      status: "connected",
      setupState: "ready",
      createdAt: new Date("2026-06-16T14:00:00.000Z"),
      updatedAt: new Date("2026-06-16T14:00:00.000Z")
    };
    const label: Label = {
      id: "label_sales",
      userId: "user_1",
      name: "Sales",
      color: "#2f6f73",
      createdAt: new Date("2026-06-16T14:00:00.000Z")
    };
    const messageLabel: MessageLabel = {
      messageId: "msg_gmail_1",
      labelId: "label_sales",
      appliedAt: new Date("2026-06-16T14:02:00.000Z")
    };
    const syncRule: SyncRule = {
      id: "sync_sales_slack",
      userId: "user_1",
      labelId: "label_sales",
      destination: "slack",
      destinationChannelId: "C123",
      status: "active",
      createdAt: new Date("2026-06-16T14:03:00.000Z"),
      updatedAt: new Date("2026-06-16T14:03:00.000Z")
    };

    expect(connection.provider).toBe("gmail");
    expect(label.name).toBe("Sales");
    expect(messageLabel).toMatchObject({
      messageId: "msg_gmail_1",
      labelId: "label_sales"
    });
    expect(syncRule).toMatchObject({
      labelId: "label_sales",
      destination: "slack",
      destinationChannelId: "C123"
    });
  });
});

describe("inbox search and labels", () => {
  it("searches by sender, subject, preview, and source", () => {
    const gmail = createGmailInboxMessage({
      id: "gmail_1",
      userId: "user_1",
      connectionId: "conn_gmail",
      providerMessageId: "gmail-message-id",
      threadId: "gmail-thread-id",
      from: "customer@example.com",
      to: ["owner@example.com"],
      subject: "Question about hours",
      preview: "Are you open this weekend?",
      receivedAt: new Date("2026-06-16T14:00:00.000Z")
    });
    const twilio = createTwilioInboxMessage({
      id: "twilio_1",
      userId: "user_1",
      connectionId: "conn_twilio",
      messageSid: "SM123",
      accountSid: "AC123",
      from: "+15551234567",
      to: "+15557654321",
      body: "Can I book for Friday?",
      receivedAt: new Date("2026-06-16T14:05:00.000Z")
    });

    expect(searchInboxMessages([gmail, twilio], "hours").map((message) => message.id)).toEqual([
      "gmail_1"
    ]);
    expect(searchInboxMessages([gmail, twilio], "twilio").map((message) => message.id)).toEqual([
      "twilio_1"
    ]);
  });

  it("creates a message label relationship", () => {
    expect(
      applyLabelToMessage({
        messageId: "gmail_1",
        labelId: "label_sales",
        appliedAt: new Date("2026-06-16T14:05:00.000Z")
      })
    ).toMatchObject({
      messageId: "gmail_1",
      labelId: "label_sales"
    });
  });
});
