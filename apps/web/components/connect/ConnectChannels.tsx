import React from "react";
import {
  ArrowRight,
  BellRing,
  CircleAlert,
  Clock3,
  KeyRound,
  Link2,
  MessageSquareText
} from "lucide-react";
import { channels, type ChannelSummary } from "@connect-any-inbox/shared";

type ActionKind = "connect" | "configure" | "review" | "planned";

interface ChannelAction {
kind: ActionKind;
label: string;
disabled: boolean;
href?: string;
}

export interface ConnectChannelsProps {
gmailSetupReady?: boolean;
}

export function getChannelAction(
channel: ChannelSummary,
options: ConnectChannelsProps = { gmailSetupReady: true }
): ChannelAction {
if (channel.id === "gmail") {
if (options.gmailSetupReady === false) {
return { kind: "configure", label: "Needs admin setup", disabled: true };
}

return {
kind: "connect",
label: "Connect Gmail",
disabled: false,
href: "/api/connect/gmail/start"
};
}

  if (channel.id === "twilio") {
    return { kind: "configure", label: "Configure Twilio", disabled: false };
  }

  if (channel.id === "slack") {
    return { kind: "connect", label: "Connect Slack", disabled: false };
  }

  if (channel.status === "advisory") {
    return { kind: "review", label: "Needs approval", disabled: true };
  }

  return { kind: "planned", label: "Roadmap", disabled: true };
}

export function ConnectChannels({ gmailSetupReady = true }: ConnectChannelsProps) {
  const demoChannels = channels.filter((channel) =>
    ["demo", "destination"].includes(channel.status)
  );
  const plannedChannels = channels.filter((channel) => channel.status === "roadmap");
  const advisoryChannels = channels.filter((channel) => channel.status === "advisory");

  return (
    <main className="connect-page">
      <section className="connect-header" aria-labelledby="connect-title">
        <div>
          <p className="eyebrow">Client setup</p>
          <h1 id="connect-title">Connect channels</h1>
        </div>
        <div className="setup-meter" aria-label="First demo progress">
          <span>First demo</span>
          <strong>{demoChannels.length}/3 ready</strong>
        </div>
      </section>

<ChannelSection
        channels={demoChannels}
        description="These are the channels we can make actionable first."
        gmailSetupReady={gmailSetupReady}
        title="Ready for first demo"
      />
<ChannelSection
        channels={plannedChannels}
        description="These have a clean or assisted path, but are not part of the first demo."
        dense
        gmailSetupReady={gmailSetupReady}
        title="Planned channels"
      />
<ChannelSection
        channels={advisoryChannels}
        description="These require extra caution before using provider or automation fallback paths."
        dense
        gmailSetupReady={gmailSetupReady}
        title="Needs approval"
      />
    </main>
  );
}

function ChannelSection({
channels: sectionChannels,
dense = false,
description,
gmailSetupReady,
title
}: {
channels: ChannelSummary[];
dense?: boolean;
description: string;
gmailSetupReady: boolean;
title: string;
}) {
  const headingId = title.toLowerCase().replaceAll(" ", "-");

  return (
    <section className="connect-section" aria-labelledby={headingId}>
      <div className="section-heading">
        <h2 id={headingId}>{title}</h2>
        <p>{description}</p>
      </div>
      <div className={dense ? "channel-list dense" : "channel-list"}>
{sectionChannels.map((channel) => (
<ChannelCard channel={channel} gmailSetupReady={gmailSetupReady} key={channel.id} />
))}
      </div>
    </section>
  );
}

function ChannelCard({
channel,
gmailSetupReady
}: {
channel: ChannelSummary;
gmailSetupReady: boolean;
}) {
const action = getChannelAction(channel, { gmailSetupReady });
  const Icon = getChannelIcon(channel);

  return (
    <article className="connect-card" data-status={channel.status}>
      <div className="card-title-row">
        <span className="channel-icon" aria-hidden="true">
          <Icon size={18} strokeWidth={2} />
        </span>
        <div>
          <h3>{channel.name}</h3>
          <p>{channel.description}</p>
        </div>
      </div>
      <div className="card-action-row">
        <span className="status-pill" data-status={channel.status}>
          {channel.statusLabel}
        </span>
{action.href ? (
<a className="action-button" href={action.href}>
{action.label}
<ArrowRight size={16} strokeWidth={2} aria-hidden="true" />
</a>
) : (
<button className="action-button" disabled={action.disabled} type="button">
{action.label}
<ArrowRight size={16} strokeWidth={2} aria-hidden="true" />
</button>
)}
      </div>
    </article>
  );
}

function getChannelIcon(channel: ChannelSummary) {
  if (channel.status === "advisory") {
    return CircleAlert;
  }

  if (channel.id === "slack") {
    return BellRing;
  }

  if (channel.id === "gmail" || channel.id === "twilio") {
    return Link2;
  }

  if (channel.id === "custom_webhooks" || channel.id === "web_forms") {
    return KeyRound;
  }

  if (channel.status === "roadmap") {
    return Clock3;
  }

  return MessageSquareText;
}
