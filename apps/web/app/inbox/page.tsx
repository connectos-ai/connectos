import {
  applyLabelToMessage,
  createGmailInboxMessage,
  createTwilioInboxMessage,
  type Label
} from "@connect-any-inbox/inbox-core";
import {
  createSlackSyncRule,
  syncLabeledMessagesToSlack
} from "@connect-any-inbox/slack-sync";
import { UnifiedInbox } from "../../components/inbox/UnifiedInbox";

export default async function InboxPage({
  searchParams
}: {
  searchParams?: Promise<{ q?: string; source?: "gmail" | "twilio" }>;
}) {
  const params = await searchParams;
  const slackSync = await syncLabeledMessagesToSlack({
    rule: demoSlackSyncRule,
    messages: demoMessages,
    messageLabels: demoMessageLabels,
    previousAttempts: [],
    postMessage: async () => ({ slackMessageId: "slack_demo_1" }),
    syncedAt: new Date("2026-06-16T17:10:00.000Z")
  });

  return (
    <UnifiedInbox
      labels={demoLabels}
      messageLabels={demoMessageLabels}
      messages={demoMessages}
      query={params?.q ?? ""}
      slackSyncSummary={{
        channelName: "#sales",
        failedCount: slackSync.retryableFailures.length,
        labelName: "Sales",
        syncedCount: slackSync.attempts.filter((attempt) => attempt.status === "synced").length
      }}
      sourceFilter={params?.source ?? "all"}
    />
  );
}

const demoMessages = [
  createGmailInboxMessage({
    id: "gmail_1",
    userId: "user_demo",
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
    userId: "user_demo",
    connectionId: "conn_twilio",
    messageSid: "SM123",
    accountSid: "AC123",
    from: "+15551234567",
    to: "+15557654321",
    body: "Can I book for Friday?",
    receivedAt: new Date("2026-06-16T17:00:00.000Z")
  })
];

const demoLabels: Label[] = [
  {
    id: "label_sales",
    userId: "user_demo",
    name: "Sales",
    color: "#2f6f73",
    createdAt: new Date("2026-06-16T17:05:00.000Z")
  }
];

const demoMessageLabels = [
  applyLabelToMessage({
    messageId: "gmail_1",
    labelId: "label_sales",
    appliedAt: new Date("2026-06-16T17:05:00.000Z")
  })
];

const demoSlackSyncRule = createSlackSyncRule({
  id: "sync_sales_to_slack",
  userId: "user_demo",
  labelId: "label_sales",
  destinationChannelId: "C123",
  createdAt: new Date("2026-06-16T17:08:00.000Z")
});
