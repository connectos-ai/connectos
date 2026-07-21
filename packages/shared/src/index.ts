import { clientChannelRegistry, type ChannelId } from "@connect-any-inbox/connector-registry";

export type ChannelStatus = "demo" | "destination" | "roadmap" | "advisory";

export interface ChannelSummary {
  id: ChannelId;
  name: string;
  description: string;
  status: ChannelStatus;
  statusLabel: string;
}

export const channels: ChannelSummary[] = clientChannelRegistry.map((channel) => ({
  id: channel.id,
  name: channel.displayName,
  description: channel.setupGuidance,
  status: toChannelStatus(channel),
  statusLabel: toStatusLabel(channel)
}));

function toChannelStatus(channel: (typeof clientChannelRegistry)[number]): ChannelStatus {
  if (channel.id === "slack") {
    return "destination";
  }

  if (channel.mvpStatus === "first_demo") {
    return "demo";
  }

  if (channel.mvpStatus === "advisory_only") {
    return "advisory";
  }

  return "roadmap";
}

function toStatusLabel(channel: (typeof clientChannelRegistry)[number]): string {
  if (channel.id === "slack") {
    return "Sync destination";
  }

  if (channel.mvpStatus === "first_demo") {
    return "MVP connector";
  }

  if (channel.mvpStatus === "advisory_only") {
    return "Advisory";
  }

  return "Roadmap";
}
