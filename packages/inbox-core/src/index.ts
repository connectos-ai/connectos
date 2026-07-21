export type Provider = "gmail" | "twilio" | "slack" | "hubspot" | "meta_business";
export type ConnectorStrategy = "oauth" | "webhook" | "api_key" | "provider" | "automation" | "manual";
export type ConnectionStatus = "not_connected" | "pending" | "connected" | "needs_attention" | "disabled";
export type SetupState = "not_started" | "waiting_for_user" | "waiting_for_provider" | "ready" | "failed";
export type MessageSource = "gmail" | "twilio" | "hubspot" | "meta_business";
export type MessageDirection = "inbound" | "outbound";
export type SyncDestination = "slack";
export type SyncRuleStatus = "active" | "paused" | "needs_attention";

export interface User {
  id: string;
  email: string;
  name: string | null;
  createdAt: Date;
  updatedAt: Date;
}

export interface Connection {
  id: string;
  userId: string;
  provider: Provider;
  strategy: ConnectorStrategy;
  status: ConnectionStatus;
  setupState: SetupState;
  createdAt: Date;
  updatedAt: Date;
}

export interface InboxMessage {
  id: string;
  userId: string;
  connectionId: string;
  source: MessageSource;
  direction: MessageDirection;
  sender: string;
  recipients: string[];
  subject: string | null;
  preview: string;
  receivedAt: Date;
  sourceMetadata: Record<string, string>;
}

export interface ProviderEvent {
  id: string;
  userId: string;
  connectionId: string;
  provider: Provider;
  eventType: string;
  receivedAt: Date;
  processedAt: Date | null;
}

export interface Label {
  id: string;
  userId: string;
  name: string;
  color: string;
  createdAt: Date;
}

export interface MessageLabel {
  messageId: string;
  labelId: string;
  appliedAt: Date;
}

export interface SyncRule {
  id: string;
  userId: string;
  labelId: string;
  destination: SyncDestination;
  destinationChannelId: string;
  status: SyncRuleStatus;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateGmailInboxMessageInput {
  id: string;
  userId: string;
  connectionId: string;
  providerMessageId: string;
  threadId: string;
  from: string;
  to: string[];
  subject: string;
  preview: string;
  receivedAt: Date;
}

export interface CreateTwilioInboxMessageInput {
  id: string;
  userId: string;
  connectionId: string;
  messageSid: string;
  accountSid: string;
  from: string;
  to: string;
  body: string;
  receivedAt: Date;
}

export function createGmailInboxMessage(input: CreateGmailInboxMessageInput): InboxMessage {
  return {
    id: input.id,
    userId: input.userId,
    connectionId: input.connectionId,
    source: "gmail",
    direction: "inbound",
    sender: input.from,
    recipients: input.to,
    subject: input.subject,
    preview: input.preview,
    receivedAt: input.receivedAt,
    sourceMetadata: {
      providerMessageId: input.providerMessageId,
      threadId: input.threadId
    }
  };
}

export function createTwilioInboxMessage(input: CreateTwilioInboxMessageInput): InboxMessage {
  return {
    id: input.id,
    userId: input.userId,
    connectionId: input.connectionId,
    source: "twilio",
    direction: "inbound",
    sender: input.from,
    recipients: [input.to],
    subject: null,
    preview: input.body,
    receivedAt: input.receivedAt,
    sourceMetadata: {
      messageSid: input.messageSid,
      accountSid: input.accountSid
    }
  };
}

export function searchInboxMessages(messages: InboxMessage[], query: string): InboxMessage[] {
  const normalizedQuery = query.trim().toLowerCase();

  if (!normalizedQuery) {
    return [...messages];
  }

  return messages.filter((message) =>
    [
      message.source,
      message.sender,
      message.subject ?? "",
      message.preview,
      ...message.recipients
    ]
      .join(" ")
      .toLowerCase()
      .includes(normalizedQuery)
  );
}

export function applyLabelToMessage(input: MessageLabel): MessageLabel {
  return {
    messageId: input.messageId,
    labelId: input.labelId,
    appliedAt: input.appliedAt
  };
}
