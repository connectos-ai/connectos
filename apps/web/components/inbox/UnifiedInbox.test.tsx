import React from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";
import {
  applyLabelToMessage,
  createGmailInboxMessage,
  createTwilioInboxMessage,
  type InboxMessage,
  type Label
} from "@connect-any-inbox/inbox-core";
import { filterInboxMessages, UnifiedInbox } from "./UnifiedInbox";

describe("UnifiedInbox", () => {
  it("renders Gmail and Twilio messages together", () => {
    const html = renderToStaticMarkup(<UnifiedInbox messages={messages} />);

    expect(html).toContain("Viewing request");
    expect(html).toContain("Can I book for Friday?");
    expect(html).toContain("gmail");
    expect(html).toContain("twilio");
  });

  it("filters messages by source", () => {
    expect(filterInboxMessages(messages, "gmail").map((message) => message.source)).toEqual([
      "gmail"
    ]);
  });

  it("searches and renders labels", () => {
    const html = renderToStaticMarkup(
      <UnifiedInbox
        labels={labels}
        messageLabels={[
          applyLabelToMessage({
            messageId: "gmail_1",
            labelId: "label_sales",
            appliedAt: new Date("2026-06-16T17:05:00.000Z")
          })
        ]}
        messages={messages}
        query="viewing"
      />
    );

    expect(html).toContain("Viewing request");
    expect(html).toContain("Sales");
    expect(html).not.toContain("Can I book for Friday?");
  });

  it("renders Slack sync status for labeled streams", () => {
    const html = renderToStaticMarkup(
      <UnifiedInbox
        labels={labels}
        messageLabels={[
          applyLabelToMessage({
            messageId: "gmail_1",
            labelId: "label_sales",
            appliedAt: new Date("2026-06-16T17:05:00.000Z")
          })
        ]}
        messages={messages}
        slackSyncSummary={{
          channelName: "#sales",
          failedCount: 0,
          labelName: "Sales",
          syncedCount: 1
        }}
      />
    );

    expect(html).toContain("Slack sync");
    expect(html).toContain("#sales");
    expect(html).toContain("1 synced");
    expect(html).toContain("0 need attention");
  });

  it("renders empty, loading, and error states", () => {
    expect(renderToStaticMarkup(<UnifiedInbox messages={[]} />)).toContain("No messages yet");
    expect(renderToStaticMarkup(<UnifiedInbox messages={messages} state="loading" />)).toContain(
      "Loading messages"
    );
    expect(renderToStaticMarkup(<UnifiedInbox messages={messages} state="error" />)).toContain(
      "Messages need attention"
    );
  });
});

const messages: InboxMessage[] = [
  createGmailInboxMessage({
    id: "gmail_1",
    userId: "user_1",
    connectionId: "conn_gmail",
    providerMessageId: "gmail_provider_1",
    threadId: "thread_1",
    from: "guest@example.com",
    to: ["owner@example.com"],
    subject: "Viewing request",
    preview: "Can I see the unit tomorrow?",
    receivedAt: new Date("2026-06-16T16:00:00.000Z")
  }),
  createTwilioInboxMessage({
    id: "twilio_1",
    userId: "user_1",
    connectionId: "conn_twilio",
    messageSid: "SM123",
    accountSid: "AC123",
    from: "+15551234567",
    to: "+15557654321",
    body: "Can I book for Friday?",
    receivedAt: new Date("2026-06-16T17:00:00.000Z")
  })
];

const labels: Label[] = [
  {
    id: "label_sales",
    userId: "user_1",
    name: "Sales",
    color: "#2f6f73",
    createdAt: new Date("2026-06-16T17:05:00.000Z")
  }
];
