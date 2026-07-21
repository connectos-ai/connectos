import type { ChannelId, MvpStatus, RiskLevel } from "@connect-any-inbox/connector-registry";
import { clientChannelRegistry } from "@connect-any-inbox/connector-registry";

export type RoadmapStage =
  | "implemented"
  | "planned"
  | "advisory_only";

export interface ConnectorRoadmapItem {
  channelId: ChannelId;
  stage: RoadmapStage;
  mvpStatus: MvpStatus;
  riskLevel: RiskLevel;
  currentPackage: string | null;
  nextMilestone: string;
  requiresExplicitApproval: boolean;
  notes: string;
}

export const connectorRoadmap = {
  gmail: {
    channelId: "gmail",
    stage: "implemented",
    mvpStatus: "first_demo",
    riskLevel: "low",
    currentPackage: "@connect-any-inbox/gmail-connector",
    nextMilestone: "Persist synced Gmail messages",
    requiresExplicitApproval: false,
    notes: "OAuth proof and message normalization exist; production app review and push sync are later."
  },
  twilio: {
    channelId: "twilio",
    stage: "implemented",
    mvpStatus: "first_demo",
    riskLevel: "low",
    currentPackage: "@connect-any-inbox/twilio-connector",
    nextMilestone: "Persist inbound SMS webhook events",
    requiresExplicitApproval: false,
    notes: "Webhook proof validates signatures and normalizes inbound SMS."
  },
  slack: {
    channelId: "slack",
    stage: "implemented",
    mvpStatus: "first_demo",
    riskLevel: "low",
    currentPackage: "@connect-any-inbox/slack-connector",
    nextMilestone: "Store Slack channel selection per sync rule",
    requiresExplicitApproval: false,
    notes: "OAuth proof and labeled-stream sync proof exist with mocked Slack posting."
  },
  forwarded_imessages: {
    channelId: "forwarded_imessages",
    stage: "planned",
    mvpStatus: "planned",
    riskLevel: "high",
    currentPackage: null,
    nextMilestone: "Forwarded inbox proof",
    requiresExplicitApproval: true,
    notes: "Prefer forwarding into Gmail, SMS, or webhook before considering a local Mac bridge."
  },
  voicemail_transcripts: {
    channelId: "voicemail_transcripts",
    stage: "planned",
    mvpStatus: "planned",
    riskLevel: "medium",
    currentPackage: null,
    nextMilestone: "Twilio Voice transcript webhook proof",
    requiresExplicitApproval: false,
    notes: "Start with Twilio Voice or forwarded transcript emails."
  },
  phone_call_summaries: {
    channelId: "phone_call_summaries",
    stage: "planned",
    mvpStatus: "planned",
    riskLevel: "medium",
    currentPackage: null,
    nextMilestone: "Call summary webhook proof",
    requiresExplicitApproval: false,
    notes: "Normalize provider call summaries into read-only inbox messages."
  },
  rentredi: {
    channelId: "rentredi",
    stage: "advisory_only",
    mvpStatus: "advisory_only",
    riskLevel: "high",
    currentPackage: null,
    nextMilestone: "Access research and fallback decision",
    requiresExplicitApproval: true,
    notes: "No confirmed public API assumed; partner/provider or approved automation only."
  },
  quickbooks_notifications: {
    channelId: "quickbooks_notifications",
    stage: "planned",
    mvpStatus: "planned",
    riskLevel: "medium",
    currentPackage: null,
    nextMilestone: "Intuit OAuth webhook proof",
    requiresExplicitApproval: false,
    notes: "Use QuickBooks Online OAuth and webhooks, or notification email ingestion first."
  },
  facebook: {
    channelId: "facebook",
    stage: "planned",
    mvpStatus: "planned",
    riskLevel: "medium",
    currentPackage: null,
    nextMilestone: "Meta Page messaging webhook proof",
    requiresExplicitApproval: false,
    notes: "Business messaging APIs and app review are required before production use."
  },
  instagram: {
    channelId: "instagram",
    stage: "planned",
    mvpStatus: "planned",
    riskLevel: "medium",
    currentPackage: null,
    nextMilestone: "Instagram business messaging proof",
    requiresExplicitApproval: false,
    notes: "Business or creator account setup must go through Meta permissions."
  },
  messenger: {
    channelId: "messenger",
    stage: "planned",
    mvpStatus: "planned",
    riskLevel: "medium",
    currentPackage: null,
    nextMilestone: "Messenger Platform webhook proof",
    requiresExplicitApproval: false,
    notes: "Use Page messaging webhooks, not personal-account scraping."
  },
  whatsapp: {
    channelId: "whatsapp",
    stage: "planned",
    mvpStatus: "planned",
    riskLevel: "medium",
    currentPackage: null,
    nextMilestone: "WhatsApp Business Cloud API proof",
    requiresExplicitApproval: false,
    notes: "Provider-assisted setup may be easier than direct Meta onboarding."
  },
  linkedin: {
    channelId: "linkedin",
    stage: "advisory_only",
    mvpStatus: "advisory_only",
    riskLevel: "high",
    currentPackage: null,
    nextMilestone: "Partner/provider feasibility review",
    requiresExplicitApproval: true,
    notes: "Browser automation is high account-risk and must stay opt-in."
  },
  business_suite: {
    channelId: "business_suite",
    stage: "planned",
    mvpStatus: "planned",
    riskLevel: "medium",
    currentPackage: null,
    nextMilestone: "Admin setup guide",
    requiresExplicitApproval: false,
    notes: "Treat as the setup umbrella for Facebook, Instagram, Messenger, and WhatsApp."
  },
  web_forms: {
    channelId: "web_forms",
    stage: "planned",
    mvpStatus: "planned",
    riskLevel: "low",
    currentPackage: null,
    nextMilestone: "Hosted form endpoint proof",
    requiresExplicitApproval: false,
    notes: "Normalize submissions into inbox messages through webhook-shaped payloads."
  },
  custom_webhooks: {
    channelId: "custom_webhooks",
    stage: "planned",
    mvpStatus: "planned",
    riskLevel: "low",
    currentPackage: null,
    nextMilestone: "Generic webhook ingestion proof",
    requiresExplicitApproval: false,
    notes: "Allow custom tools to post JSON and map payloads to inbox messages."
  },
  browser_scraped_tools: {
    channelId: "browser_scraped_tools",
    stage: "advisory_only",
    mvpStatus: "advisory_only",
    riskLevel: "high",
    currentPackage: null,
    nextMilestone: "Fallback approval workflow",
    requiresExplicitApproval: true,
    notes: "OpenCLI, Deck, Playwright, and n8n remain last-resort providers only."
  },
  hubspot: {
    channelId: "hubspot",
    stage: "planned",
    mvpStatus: "planned",
    riskLevel: "medium",
    currentPackage: null,
    nextMilestone: "OAuth setup proof",
    requiresExplicitApproval: false,
    notes: "Start with HubSpot OAuth, then CRM/conversation APIs or notification webhooks."
  }
} satisfies Record<ChannelId, ConnectorRoadmapItem>;

export function getConnectorRoadmap(channelId: ChannelId): ConnectorRoadmapItem {
  return connectorRoadmap[channelId];
}

export function listFirstDemoRoadmapItems(): ConnectorRoadmapItem[] {
  return Object.values(connectorRoadmap).filter((item) => item.mvpStatus === "first_demo");
}

export function listRequiresApprovalRoadmapItems(): ConnectorRoadmapItem[] {
  return Object.values(connectorRoadmap).filter((item) => item.requiresExplicitApproval);
}

export function listRoadmapItems(): ConnectorRoadmapItem[] {
  const registryOrder = new Map(
    clientChannelRegistry.map((channel, index) => [channel.id, index])
  );

  return Object.values(connectorRoadmap).sort(
    (left, right) =>
      (registryOrder.get(left.channelId) ?? 0) - (registryOrder.get(right.channelId) ?? 0)
  );
}
