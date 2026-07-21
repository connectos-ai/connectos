import React from "react";
import { Inbox, Mail, MessageSquare, Send, TriangleAlert } from "lucide-react";
import {
  searchInboxMessages,
  type InboxMessage,
  type Label,
  type MessageLabel,
  type MessageSource
} from "@connect-any-inbox/inbox-core";

export type InboxViewState = "ready" | "loading" | "error";

export interface SlackSyncSummary {
  channelName: string;
  failedCount: number;
  labelName: string;
  syncedCount: number;
}

export interface UnifiedInboxProps {
  messages: InboxMessage[];
  labels?: Label[];
  messageLabels?: MessageLabel[];
  query?: string;
  slackSyncSummary?: SlackSyncSummary;
  sourceFilter?: MessageSource | "all";
  state?: InboxViewState;
}

export function filterInboxMessages(
  messages: InboxMessage[],
  sourceFilter: MessageSource | "all" = "all",
  query = ""
): InboxMessage[] {
  const sourceMessages =
    sourceFilter === "all"
      ? messages
      : messages.filter((message) => message.source === sourceFilter);

  return searchInboxMessages(sourceMessages, query).sort(sortNewestFirst);
}

export function UnifiedInbox({
  messages,
  labels = [],
  messageLabels = [],
  query = "",
  slackSyncSummary,
  sourceFilter = "all",
  state = "ready"
}: UnifiedInboxProps) {
  const visibleMessages = filterInboxMessages(messages, sourceFilter, query);

  if (state === "loading") {
    return <InboxState title="Loading messages" description="Checking connected channels." />;
  }

  if (state === "error") {
    return (
      <InboxState
        icon="error"
        title="Messages need attention"
        description="One or more channels could not be loaded."
      />
    );
  }

  return (
    <main className="inbox-page">
      <section className="inbox-header" aria-labelledby="inbox-title">
        <div>
          <p className="eyebrow">Unified inbox</p>
          <h1 id="inbox-title">Messages</h1>
        </div>
        <div className="inbox-count" aria-label="Visible messages">
          <span>{visibleMessages.length}</span>
          <strong>visible</strong>
        </div>
      </section>

      <nav className="source-tabs" aria-label="Inbox source filters">
        {["all", "gmail", "twilio"].map((source) => (
          <a
            aria-current={sourceFilter === source ? "page" : undefined}
            href={source === "all" ? "/inbox" : `/inbox?source=${source}`}
            key={source}
          >
            {source === "all" ? "All" : source}
          </a>
        ))}
      </nav>

      <form className="inbox-search" action="/inbox">
        <label htmlFor="inbox-search">Search messages</label>
        <input
          defaultValue={query}
          id="inbox-search"
          name="q"
          placeholder="Search sender, source, subject, or preview"
          type="search"
      />
    </form>

    {slackSyncSummary ? <SlackSyncPanel summary={slackSyncSummary} /> : null}

    {visibleMessages.length === 0 ? (
      <InboxState title="No messages yet" description="Connected channels will appear here." />
      ) : (
        <section className="message-list" aria-label="Messages">
          {visibleMessages.map((message) => (
            <MessageCard
              key={message.id}
              labels={labelsForMessage(message.id, labels, messageLabels)}
              message={message}
            />
          ))}
        </section>
      )}
    </main>
  );
}

function SlackSyncPanel({ summary }: { summary: SlackSyncSummary }) {
  return (
    <section className="slack-sync-panel" aria-label="Slack sync status">
      <div className="slack-sync-icon" aria-hidden="true">
        <Send size={17} strokeWidth={2} />
      </div>
      <div>
        <p className="eyebrow">Slack sync</p>
        <h2>{summary.labelName}</h2>
      </div>
      <dl>
        <div>
          <dt>Channel</dt>
          <dd>{summary.channelName}</dd>
        </div>
        <div>
          <dt>Status</dt>
          <dd>
            {summary.syncedCount} synced / {summary.failedCount} need attention
          </dd>
        </div>
      </dl>
    </section>
  );
}

function MessageCard({ labels, message }: { labels: Label[]; message: InboxMessage }) {
  const Icon = message.source === "gmail" ? Mail : MessageSquare;

  return (
    <article className="message-card">
      <div className="message-icon" aria-hidden="true">
        <Icon size={18} strokeWidth={2} />
      </div>
      <div className="message-body">
        <div className="message-heading">
          <h2>{message.subject ?? "SMS message"}</h2>
          <time dateTime={message.receivedAt.toISOString()}>
            {message.receivedAt.toLocaleString("en-US", {
              month: "short",
              day: "numeric",
              hour: "numeric",
              minute: "2-digit"
            })}
          </time>
        </div>
        <p className="message-from">{message.sender}</p>
        <p>{message.preview}</p>
        <dl className="message-meta">
          <div>
            <dt>Source</dt>
            <dd>{message.source}</dd>
          </div>
          <div>
            <dt>Provider ID</dt>
            <dd>{providerId(message)}</dd>
          </div>
        </dl>
        {labels.length > 0 ? (
          <div className="label-row" aria-label="Message labels">
            {labels.map((label) => (
              <span key={label.id} style={{ borderColor: label.color }}>
                {label.name}
              </span>
            ))}
          </div>
        ) : null}
      </div>
    </article>
  );
}

function InboxState({
  description,
  icon = "empty",
  title
}: {
  description: string;
  icon?: "empty" | "error";
  title: string;
}) {
  const Icon = icon === "error" ? TriangleAlert : Inbox;

  return (
    <main className="inbox-page">
      <section className="inbox-state" role="status">
        <Icon size={28} strokeWidth={2} aria-hidden="true" />
        <h1>{title}</h1>
        <p>{description}</p>
      </section>
    </main>
  );
}

function sortNewestFirst(left: InboxMessage, right: InboxMessage): number {
  return right.receivedAt.getTime() - left.receivedAt.getTime();
}

function providerId(message: InboxMessage): string {
  return (
    message.sourceMetadata.providerMessageId ??
    message.sourceMetadata.messageSid ??
    "not provided"
  );
}

function labelsForMessage(
  messageId: string,
  labels: Label[],
  messageLabels: MessageLabel[]
): Label[] {
  const labelIds = new Set(
    messageLabels.filter((item) => item.messageId === messageId).map((item) => item.labelId)
  );

  return labels.filter((label) => labelIds.has(label.id));
}
