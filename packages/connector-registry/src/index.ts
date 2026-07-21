export type ChannelId =
  | "gmail"
  | "twilio"
  | "slack"
  | "forwarded_imessages"
  | "voicemail_transcripts"
  | "phone_call_summaries"
  | "rentredi"
  | "quickbooks_notifications"
  | "facebook"
  | "instagram"
  | "messenger"
  | "whatsapp"
  | "linkedin"
  | "business_suite"
  | "web_forms"
  | "custom_webhooks"
  | "browser_scraped_tools"
  | "hubspot";

export type ChannelDirection = "source" | "destination" | "both" | "setup_helper";
export type MvpStatus = "first_demo" | "planned" | "advisory_only";
export type RiskLevel = "low" | "medium" | "high" | "blocked";
export type ConnectionStrategy =
  | "official_api"
  | "oauth"
  | "webhook"
  | "api_key"
  | "partner_provider"
  | "forwarded_inbox"
  | "local_bridge"
  | "browser_automation"
  | "manual";

export const browserAutomationStrategy = "browser_automation" satisfies ConnectionStrategy;

export interface ChannelRegistryEntry {
  id: ChannelId;
  displayName: string;
  direction: ChannelDirection;
  mvpStatus: MvpStatus;
  riskLevel: RiskLevel;
  strategyRank: ConnectionStrategy[];
  setupGuidance: string;
  fallbackGuidance: string;
}

export const clientChannelRegistry: ChannelRegistryEntry[] = [
  {
    id: "gmail",
    displayName: "Gmail / email",
    direction: "source",
    mvpStatus: "first_demo",
    riskLevel: "low",
    strategyRank: ["oauth", "official_api", "webhook", "manual"],
    setupGuidance: "Connect Google with OAuth, then import messages through the Gmail API.",
    fallbackGuidance: "Use manual sync or polling if push notifications are not configured yet."
  },
  {
    id: "twilio",
    displayName: "SMS / Twilio",
    direction: "source",
    mvpStatus: "first_demo",
    riskLevel: "low",
    strategyRank: ["webhook", "api_key", "manual"],
    setupGuidance: "Point Twilio incoming SMS webhooks at the app endpoint.",
    fallbackGuidance: "Show plain webhook setup guidance if automatic setup is not available."
  },
  {
    id: "slack",
    displayName: "Slack",
    direction: "destination",
    mvpStatus: "first_demo",
    riskLevel: "low",
    strategyRank: ["oauth", "api_key", "manual"],
    setupGuidance: "Connect Slack as the first labeled-stream sync destination.",
    fallbackGuidance: "Use a development bot token only for local development."
  },
  {
    id: "forwarded_imessages",
    displayName: "Forwarded iMessages",
    direction: "source",
    mvpStatus: "planned",
    riskLevel: "high",
    strategyRank: ["forwarded_inbox", "local_bridge", "browser_automation"],
    setupGuidance: "Prefer forwarding iMessages into Gmail, SMS, or a custom webhook.",
    fallbackGuidance: "Use a local Mac bridge only with explicit approval; browser automation also requires explicit approval."
  },
  {
    id: "voicemail_transcripts",
    displayName: "Voicemail transcripts",
    direction: "source",
    mvpStatus: "planned",
    riskLevel: "medium",
    strategyRank: ["webhook", "forwarded_inbox", "manual"],
    setupGuidance: "Use Twilio Voice transcription webhooks when calls are routed through Twilio.",
    fallbackGuidance: "Ingest provider email notifications or webhook payloads when native voice webhooks are unavailable."
  },
  {
    id: "phone_call_summaries",
    displayName: "Phone call summaries",
    direction: "source",
    mvpStatus: "planned",
    riskLevel: "medium",
    strategyRank: ["webhook", "official_api", "manual"],
    setupGuidance: "Use call event webhooks and transcript summaries where available.",
    fallbackGuidance: "Allow manual transcript upload or forwarded transcript emails in a later slice."
  },
  {
    id: "rentredi",
    displayName: "RentRedi",
    direction: "source",
    mvpStatus: "advisory_only",
    riskLevel: "high",
    strategyRank: ["partner_provider", "manual", "browser_automation"],
    setupGuidance: "No confirmed official public API is assumed for the MVP.",
    fallbackGuidance: "Use a partner provider or Playwright/n8n only with explicit approval."
  },
  {
    id: "quickbooks_notifications",
    displayName: "QuickBooks notifications",
    direction: "source",
    mvpStatus: "planned",
    riskLevel: "medium",
    strategyRank: ["oauth", "webhook", "forwarded_inbox", "manual"],
    setupGuidance: "Use Intuit OAuth and QuickBooks Online webhooks.",
    fallbackGuidance: "Ingest notification emails or custom webhook events if full app review is not ready."
  },
  {
    id: "facebook",
    displayName: "Facebook",
    direction: "source",
    mvpStatus: "planned",
    riskLevel: "medium",
    strategyRank: ["oauth", "webhook", "official_api", "manual"],
    setupGuidance: "Use Meta business messaging APIs and webhooks for Page messaging.",
    fallbackGuidance: "Guide the user through Business Suite setup when app permissions are not ready."
  },
  {
    id: "instagram",
    displayName: "Instagram",
    direction: "source",
    mvpStatus: "planned",
    riskLevel: "medium",
    strategyRank: ["oauth", "webhook", "official_api", "manual"],
    setupGuidance: "Use Instagram Messaging APIs and webhooks for business or creator accounts.",
    fallbackGuidance: "Guide the user through Business Suite setup when permissions are not approved."
  },
  {
    id: "messenger",
    displayName: "Messenger",
    direction: "source",
    mvpStatus: "planned",
    riskLevel: "medium",
    strategyRank: ["oauth", "webhook", "official_api", "manual"],
    setupGuidance: "Use Messenger Platform webhooks for Page messaging.",
    fallbackGuidance: "Route users through Meta setup guidance rather than personal-account scraping."
  },
  {
    id: "whatsapp",
    displayName: "WhatsApp Business",
    direction: "source",
    mvpStatus: "planned",
    riskLevel: "medium",
    strategyRank: ["oauth", "webhook", "official_api", "partner_provider", "manual"],
    setupGuidance: "Use WhatsApp Business Cloud API and webhooks.",
    fallbackGuidance: "Use provider-assisted setup if direct Meta setup is too heavy."
  },
  {
    id: "linkedin",
    displayName: "LinkedIn",
    direction: "source",
    mvpStatus: "advisory_only",
    riskLevel: "high",
    strategyRank: ["partner_provider", "manual", "browser_automation"],
    setupGuidance: "Use restricted partner/provider access where available.",
    fallbackGuidance: "Browser automation is high risk and requires explicit approval."
  },
  {
    id: "business_suite",
    displayName: "Meta Business Suite",
    direction: "setup_helper",
    mvpStatus: "planned",
    riskLevel: "medium",
    strategyRank: ["oauth", "official_api", "manual"],
    setupGuidance: "Treat Business Suite as the setup umbrella for Meta messaging channels.",
    fallbackGuidance: "Route setup to Facebook, Instagram, Messenger, and WhatsApp entries."
  },
  {
    id: "web_forms",
    displayName: "Web forms",
    direction: "source",
    mvpStatus: "planned",
    riskLevel: "low",
    strategyRank: ["webhook", "official_api", "manual"],
    setupGuidance: "Provide a hosted form endpoint and normalized submission payload.",
    fallbackGuidance: "Use custom webhook payload mapping for existing forms."
  },
  {
    id: "custom_webhooks",
    displayName: "Custom webhooks",
    direction: "source",
    mvpStatus: "planned",
    riskLevel: "low",
    strategyRank: ["webhook", "manual"],
    setupGuidance: "Expose a native webhook endpoint for tools that can post JSON.",
    fallbackGuidance: "Use manual payload mapping when the sender cannot match the default schema."
  },
  {
    id: "browser_scraped_tools",
    displayName: "Browser-scraped tools",
    direction: "source",
    mvpStatus: "advisory_only",
    riskLevel: "high",
    strategyRank: ["partner_provider", "manual", "browser_automation"],
    setupGuidance: "Use this only when no API, OAuth, webhook, forwarding, or partner-provider path exists.",
    fallbackGuidance: "Playwright, n8n, Deck, or similar automation requires explicit approval."
  },
  {
    id: "hubspot",
    displayName: "HubSpot",
    direction: "both",
    mvpStatus: "planned",
    riskLevel: "medium",
    strategyRank: ["oauth", "official_api", "webhook", "manual"],
    setupGuidance: "Use HubSpot OAuth and CRM/conversation APIs in a later connector slice.",
    fallbackGuidance: "Use notification emails or custom webhooks until the connector is implemented."
  }
];

export function getChannel(id: ChannelId): ChannelRegistryEntry | undefined {
  return clientChannelRegistry.find((channel) => channel.id === id);
}

export function listFirstDemoChannels(): ChannelRegistryEntry[] {
  return clientChannelRegistry.filter((channel) => channel.mvpStatus === "first_demo");
}

export function listHighCautionChannels(): ChannelRegistryEntry[] {
  return clientChannelRegistry.filter((channel) => channel.riskLevel === "high");
}
