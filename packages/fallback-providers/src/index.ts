import {
  createFallbackRunAuditEvent,
  type AuditSink
} from "@connect-any-inbox/audit-log";
import { getChannel, type ChannelId } from "@connect-any-inbox/connector-registry";

export type FallbackProviderId = "opencli" | "deck" | "playwright" | "n8n";
export type FallbackRunStatus = "blocked" | "ready" | "unsupported";

export interface FallbackProviderDefinition {
  id: FallbackProviderId;
  displayName: string;
  capabilities: string[];
  requiresApproval: true;
}

export interface FallbackRunRequest {
  channelId: ChannelId;
  providerId: FallbackProviderId;
  status: FallbackRunStatus;
  requiresApproval: boolean;
  message: string;
}

export interface FallbackAuditContext {
  actorId: string;
  log: AuditSink;
  requestId: string;
  tenantId: string;
}

export interface FallbackRunOptions {
  approvedRisk?: boolean;
  audit?: FallbackAuditContext;
}

export const fallbackProviders: FallbackProviderDefinition[] = [
  {
    id: "opencli",
    displayName: "OpenCLI",
    capabilities: ["logged_in_browser", "dom_extract", "network_inspection", "adapter_authoring"],
    requiresApproval: true
  },
  {
    id: "deck",
    displayName: "Deck",
    capabilities: ["managed_workflow", "credentialed_browser", "webhook_delivery"],
    requiresApproval: true
  },
  {
    id: "playwright",
    displayName: "Playwright",
    capabilities: ["browser_automation", "form_fill", "page_extract"],
    requiresApproval: true
  },
  {
    id: "n8n",
    displayName: "n8n",
    capabilities: ["workflow_automation", "scheduled_runs", "webhook_bridge"],
    requiresApproval: true
  }
];

export function listFallbackProviderOptions(channelId: ChannelId): FallbackProviderDefinition[] {
  const channel = getChannel(channelId);

  if (!channel || channel.riskLevel !== "high") {
    return [];
  }

  return fallbackProviders;
}

export function prepareFallbackRun(
  channelId: ChannelId,
  providerId: FallbackProviderId,
  options: FallbackRunOptions = {}
): FallbackRunRequest {
  const provider = fallbackProviders.find((item) => item.id === providerId);
  const channel = getChannel(channelId);

  if (!provider || !channel || !listFallbackProviderOptions(channelId).includes(provider)) {
    return recordFallbackAudit(
      {
        channelId,
        providerId,
        status: "unsupported",
        requiresApproval: true,
        message: "This fallback provider is not available for selected channel."
      },
      options.audit
    );
  }

  if (!options.approvedRisk) {
    return recordFallbackAudit(
      {
        channelId,
        providerId,
        status: "blocked",
        requiresApproval: true,
        message: "Fallback automation requires explicit approval before it can run."
      },
      options.audit
    );
  }

  return recordFallbackAudit(
    {
      channelId,
      providerId,
      status: "ready",
      requiresApproval: true,
      message: "Fallback run is prepared but not executed by this interface."
    },
    options.audit
  );
}

function recordFallbackAudit(
  request: FallbackRunRequest,
  audit: FallbackAuditContext | undefined
): FallbackRunRequest {
  audit?.log.record(
    createFallbackRunAuditEvent({
      actorId: audit.actorId,
      channelId: request.channelId,
      providerId: request.providerId,
      requestId: audit.requestId,
      status: request.status,
      tenantId: audit.tenantId
    })
  );

  return request;
}
