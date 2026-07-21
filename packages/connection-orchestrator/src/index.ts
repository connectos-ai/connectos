import {
  createConnectionDecisionAuditEvent,
  type AuditSink
} from "@connect-any-inbox/audit-log";
import {
getChannel,
type ChannelId,
type ConnectionStrategy
} from "@connect-any-inbox/connector-registry";

export type ConnectStatus =
  | "ready"
  | "needs_setup"
  | "needs_approval"
  | "connected"
  | "failed";

export type ConnectAction =
  | "start_oauth"
  | "show_webhook_setup"
  | "show_forwarding_setup"
  | "show_provider_option"
  | "show_manual_setup"
  | "request_approval"
  | "unsupported";

export interface ConnectOptions {
approvedRisk?: boolean;
}

export interface ConnectAuditContext {
actorId: string;
log: AuditSink;
requestId: string;
tenantId: string;
}

export interface ConnectWithAuditOptions extends ConnectOptions {
audit?: ConnectAuditContext;
}

export interface ConnectDecision {
  channelId: ChannelId;
  strategy: ConnectionStrategy | null;
  status: ConnectStatus;
  action: ConnectAction;
  message: string;
}

export function connectChannel(
channelId: ChannelId,
options: ConnectOptions = {}
): ConnectDecision {
  const channel = getChannel(channelId);

  if (!channel) {
    return {
      channelId,
      strategy: null,
      status: "failed",
      action: "unsupported",
      message: "This channel is not in the connection registry yet."
    };
  }

  const strategy = channel.strategyRank[0] ?? null;

  if (!strategy) {
    return {
      channelId,
      strategy: null,
      status: "failed",
      action: "unsupported",
      message: "No connection strategy is available for this channel."
    };
  }

  if (requiresApproval(channel.riskLevel, strategy) && !options.approvedRisk) {
    return {
      channelId,
      strategy: null,
      status: "needs_approval",
      action: "request_approval",
      message: channel.fallbackGuidance
    };
  }

return decisionForStrategy(channelId, strategy, channel.setupGuidance);
}

export function connectChannelWithAudit(
channelId: ChannelId,
options: ConnectWithAuditOptions = {}
): ConnectDecision {
const decision = connectChannel(channelId, options);

options.audit?.log.record(
createConnectionDecisionAuditEvent({
actorId: options.audit.actorId,
channelId: decision.channelId,
requestId: options.audit.requestId,
status: decision.status,
strategy: decision.strategy,
action: decision.action,
tenantId: options.audit.tenantId
})
);

return decision;
}

function requiresApproval(riskLevel: string, strategy: ConnectionStrategy): boolean {
  if (riskLevel !== "high") {
    return false;
  }

  return ["partner_provider", "browser_automation", "local_bridge"].includes(strategy);
}

function decisionForStrategy(
  channelId: ChannelId,
  strategy: ConnectionStrategy,
  message: string
): ConnectDecision {
  if (strategy === "oauth") {
    return { channelId, strategy, status: "ready", action: "start_oauth", message };
  }

  if (strategy === "webhook") {
    return {
      channelId,
      strategy,
      status: "needs_setup",
      action: "show_webhook_setup",
      message
    };
  }

  if (strategy === "forwarded_inbox") {
    return {
      channelId,
      strategy,
      status: "needs_setup",
      action: "show_forwarding_setup",
      message
    };
  }

  if (strategy === "partner_provider") {
    return {
      channelId,
      strategy,
      status: "needs_setup",
      action: "show_provider_option",
      message
    };
  }

  return {
    channelId,
    strategy,
    status: "needs_setup",
    action: "show_manual_setup",
    message
  };
}
