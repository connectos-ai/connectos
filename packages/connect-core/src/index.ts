export type IntegrationCategory =
  | "email"
  | "calendar"
  | "crm"
  | "payments"
  | "messaging"
  | "files"
  | "automation";

export type IntegrationAuthMethod = "oauth" | "api_key" | "webhook" | "manual";
export type IntegrationHealth = "healthy" | "needs_attention" | "broken";
export type ConnectionStatus =
  | "available"
  | "pending"
  | "connected"
  | "unhealthy"
  | "expired"
  | "disconnected";
export type ProviderKey = "mock" | "composio" | "direct-oauth";
export type ConnectionEventType =
| "connect.started"
| "connect.completed"
| "reconnect.started"
| "disconnect.completed"
| "health.checked";
export type ConnectionMetadata = Record<string, string | number | boolean | null>;
export type StarterKitId =
| "church"
| "restaurant"
| "agency"
| "real-estate"
| "local-service-business";
export type StarterKitRequirement = "required" | "optional";

export interface IntegrationDefinition {
  id: string;
  name: string;
  category: IntegrationCategory;
  toolkitSlug: string;
  authMethod: IntegrationAuthMethod;
  defaultProvider: ProviderKey;
  description: string;
  recommendedFor: string[];
  scopes: string[];
  isMvp: boolean;
}

export interface ConnectionRecord {
  id: string;
  userId: string;
  integrationId: string;
  providerKey: ProviderKey;
  status: ConnectionStatus;
  permissions: string[];
  metadata?: ConnectionMetadata;
  redirectUrl?: string;
  externalAccountId?: string;
  createdAt: string;
  updatedAt: string;
}

export interface ConnectionHealthRecord {
  id: string;
  connectionId: string;
  health: IntegrationHealth;
  checkedAt: string;
  message: string;
}

export interface ConnectionEventRecord {
  id: string;
  connectionId: string;
  userId: string;
  integrationId: string;
  type: ConnectionEventType;
  providerKey: ProviderKey;
  metadata: Record<string, string | number | boolean | null>;
  occurredAt: string;
}

export interface OAuthTokenPlaceholder {
  id: string;
  connectionId: string;
  providerKey: ProviderKey;
  tokenRef: string;
  scopes: string[];
  expiresAt?: string;
  createdAt: string;
  updatedAt: string;
}

export interface UserConnection {
  id: string;
  userId: string;
  integrationId: string;
  provider: ProviderKey;
  status: ConnectionStatus;
  health: IntegrationHealth;
  permissions: string[];
  metadata?: ConnectionMetadata;
  lastCheckedAt: string;
  redirectUrl?: string;
externalAccountId?: string;
}

export interface StarterKitIntegration {
integrationId: string;
requirement: StarterKitRequirement;
why: string;
setupOrder: number;
}

export interface StarterKitDefinition {
id: StarterKitId;
name: string;
description: string;
recommendedIntegrations: StarterKitIntegration[];
}

export interface ConnectorManifestAction {
id: string;
name: string;
description: string;
}

export interface ConnectorManifest {
id: string;
name: string;
category: IntegrationCategory;
toolkitSlug: string;
authMethod: IntegrationAuthMethod;
providerOptions: ProviderKey[];
scopes: string[];
actions: ConnectorManifestAction[];
}

export interface ManifestValidationResult {
valid: boolean;
errors: string[];
}

export type CapabilityId =
| "read-email"
| "send-email"
| "search-email"
| "read-calendar"
| "create-calendar-event"
| "update-calendar-event"
| "read-contacts"
| "read-files"
| "write-files"
| "search"
| "create-records"
| "update-records"
| "delete-records"
| "receive-webhooks"
| "send-messages"
| "upload-files"
| "download-files"
| "read-repos"
| "create-pr"
| "manage-issues"
| "read-channels";

export interface ConnectorActionDefinition {
id: string;
name: string;
description: string;
capabilityId: CapabilityId;
permissions: string[];
}

export interface ConnectorCapabilityDefinition {
id: CapabilityId;
name: string;
description: string;
actions: ConnectorActionDefinition[];
permissions: string[];
}

export interface ConnectorCapabilities {
 connectorId: string;
 connectorName: string;
 capabilities: ConnectorCapabilityDefinition[];
}

export type UniversalActionId =
 | "send_message"
 | "search_messages"
 | "create_calendar_event"
 | "search_files"
 | "create_customer"
 | "search_customer"
 | "save_file";

export interface UniversalActionConnectorMapping {
 connectorId: string;
 connectorName: string;
 connectorActionId: string;
 capabilityId: CapabilityId;
 permissions: string[];
 inputSchema: Record<string, string>;
}

export interface UniversalActionDefinition {
 id: UniversalActionId;
 name: string;
 description: string;
 connectors: UniversalActionConnectorMapping[];
}

export interface ResolvedUniversalActionProvider extends UniversalActionConnectorMapping {
 connectionId: string;
 providerKey: ProviderKey;
 health?: IntegrationHealth;
}

export interface ExecuteUniversalActionInput {
 userId: string;
 action: UniversalActionId;
 preferredProvider?: string;
 input: Record<string, unknown>;
 connections: readonly ConnectionRecord[];
}

export interface ExecuteUniversalActionDryRunResult {
 dryRun: true;
 action: UniversalActionId;
 wouldExecute: boolean;
 selectedProvider: ResolvedUniversalActionProvider | null;
 availableProviders: ResolvedUniversalActionProvider[];
 input: Record<string, unknown>;
 message: string;
}

export type AiSkillId =
 | "notify_team"
 | "send_customer_update"
 | "send_welcome_email"
 | "send_appointment_reminder"
 | "schedule_meeting"
 | "add_customer"
 | "search_customer"
 | "find_file"
 | "save_file";

export type AiSkillCategory =
 | "communication"
 | "calendar"
 | "crm"
 | "documents";

export interface AiSkillActionMapping {
 universalActionId: UniversalActionId;
 priority: number;
 required: boolean;
}

export interface AiSkillDefinition {
 id: AiSkillId;
 name: string;
 category: AiSkillCategory;
 description: string;
 actions: AiSkillActionMapping[];
}

export interface ResolvedAiSkillProvider {
 skillId: AiSkillId;
 skillName: string;
 universalActionId: UniversalActionId;
 provider: ResolvedUniversalActionProvider;
}

export interface ExecuteSkillInput {
 userId: string;
 skill: AiSkillId;
 preferredProvider?: string;
 input: Record<string, unknown>;
 connections: readonly ConnectionRecord[];
}

export interface ExecuteSkillDryRunResult {
 dryRun: true;
 skill: AiSkillId;
 wouldExecute: boolean;
 selectedProvider: ResolvedAiSkillProvider | null;
 availableProviders: ResolvedAiSkillProvider[];
 input: Record<string, unknown>;
 message: string;
}

export interface StartConnectionInput {
 userId: string;
  integration: IntegrationDefinition;
  callbackUrl: string;
  existingConnection?: ConnectionRecord;
}

export interface StartConnectionResult {
  connectionId: string;
  redirectUrl: string;
  status: ConnectionStatus;
  providerKey: ProviderKey;
  metadata?: ConnectionMetadata;
  externalAccountId?: string;
}

export interface CallbackPayload {
  connectionId?: string;
  status?: "success" | "failed";
  code?: string;
  state?: string;
  error?: string;
  errorDescription?: string;
  externalAccountId?: string;
}

export interface ConnectionProvider {
  key: ProviderKey;
  startConnection(input: StartConnectionInput): Promise<StartConnectionResult>;
  completeConnection(input: {
    connection: ConnectionRecord;
    callbackPayload: CallbackPayload;
  }): Promise<Partial<ConnectionRecord>>;
  reconnect(input: { connection: ConnectionRecord; callbackUrl: string }): Promise<StartConnectionResult>;
  disconnect(input: { connection: ConnectionRecord }): Promise<Partial<ConnectionRecord>>;
  testConnection(input: { connection: ConnectionRecord }): Promise<{
    health: IntegrationHealth;
    status: ConnectionStatus;
    message: string;
  }>;
}

export interface ConnectCoreRepository {
  listIntegrations(): Promise<IntegrationDefinition[]>;
  upsertIntegrations(integrations: IntegrationDefinition[]): Promise<void>;
  getIntegration(integrationId: string): Promise<IntegrationDefinition | undefined>;
  listUserConnections(userId: string): Promise<ConnectionRecord[]>;
  getConnection(connectionId: string): Promise<ConnectionRecord | undefined>;
  findUserConnection(userId: string, integrationId: string): Promise<ConnectionRecord | undefined>;
  saveConnection(connection: ConnectionRecord): Promise<ConnectionRecord>;
  saveHealth(health: ConnectionHealthRecord): Promise<ConnectionHealthRecord>;
  getLatestHealth(connectionId: string): Promise<ConnectionHealthRecord | undefined>;
  recordEvent(event: ConnectionEventRecord): Promise<ConnectionEventRecord>;
  listEvents(connectionId: string): Promise<ConnectionEventRecord[]>;
  saveOAuthToken(token: OAuthTokenPlaceholder): Promise<OAuthTokenPlaceholder>;
  listOAuthTokens(connectionId: string): Promise<OAuthTokenPlaceholder[]>;
}

export interface ProviderRegistry {
  get(providerKey: ProviderKey): ConnectionProvider;
  list(): ProviderKey[];
}

export const integrationCatalog = [
  {
    id: "gmail",
    name: "Gmail",
    category: "email",
    toolkitSlug: "gmail",
    authMethod: "oauth",
    defaultProvider: "mock",
    description: "Connect inbox access for email actions and read-first automation.",
    recommendedFor: ["agency", "church", "real_estate", "law_firm"],
    scopes: ["gmail.readonly", "gmail.send"],
    isMvp: true
  },
  {
    id: "google-calendar",
    name: "Google Calendar",
    category: "calendar",
    toolkitSlug: "googlecalendar",
    authMethod: "oauth",
    defaultProvider: "mock",
    description: "Create, read, and update meetings without exposing calendar setup.",
    recommendedFor: ["agency", "church", "real_estate", "law_firm", "construction"],
    scopes: ["calendar.events.read", "calendar.events.write"],
    isMvp: true
  },
  {
    id: "slack",
    name: "Slack",
    category: "messaging",
    toolkitSlug: "slack",
    authMethod: "oauth",
    defaultProvider: "mock",
    description: "Send updates, route alerts, and keep teams in the loop.",
    recommendedFor: ["agency", "construction", "gym"],
    scopes: ["channels.read", "chat.write"],
    isMvp: true
  },
  {
    id: "github",
    name: "GitHub",
    category: "automation",
    toolkitSlug: "github",
    authMethod: "oauth",
    defaultProvider: "mock",
    description: "Connect repositories, issues, and pull requests for build workflows.",
    recommendedFor: ["agency"],
    scopes: ["repo", "issues.read"],
    isMvp: true
  },
  {
    id: "hubspot",
    name: "HubSpot",
    category: "crm",
    toolkitSlug: "hubspot",
    authMethod: "oauth",
    defaultProvider: "mock",
    description: "Sync CRM records, companies, and activity context.",
    recommendedFor: ["agency", "real_estate", "law_firm"],
    scopes: ["crm.objects.contacts.read", "crm.objects.contacts.write"],
    isMvp: false
  },
  {
    id: "quickbooks",
    name: "QuickBooks",
    category: "payments",
    toolkitSlug: "quickbooks",
    authMethod: "oauth",
    defaultProvider: "mock",
    description: "Connect accounting records, customers, invoices, and payment context.",
    recommendedFor: ["construction", "real_estate", "gym"],
    scopes: ["accounting"],
    isMvp: false
  },
  {
    id: "google-drive",
    name: "Google Drive",
    category: "files",
    toolkitSlug: "googledrive",
    authMethod: "oauth",
    defaultProvider: "mock",
    description: "Read and organize files for AI assistants and automations.",
    recommendedFor: ["agency", "church", "law_firm"],
    scopes: ["drive.readonly", "drive.file"],
    isMvp: false
  },
  {
    id: "stripe",
    name: "Stripe",
    category: "payments",
    toolkitSlug: "stripe",
    authMethod: "oauth",
    defaultProvider: "mock",
    description: "Connect customers, subscriptions, invoices, and payment events.",
    recommendedFor: ["agency", "gym"],
    scopes: ["customers.read", "charges.read"],
    isMvp: false
  }
] as const satisfies IntegrationDefinition[];

export const starterKits = [
{
id: "church",
name: "Church",
description: "Coordinate volunteers, services, events, donations, and member follow-up.",
recommendedIntegrations: [
{ integrationId: "gmail", requirement: "required", why: "Centralizes prayer requests, visitor follow-up, and ministry communication.", setupOrder: 1 },
{ integrationId: "google-calendar", requirement: "required", why: "Keeps services, rehearsals, counseling, and community events visible.", setupOrder: 2 },
{ integrationId: "google-drive", requirement: "optional", why: "Organizes sermons, forms, volunteer docs, and shared ministry files.", setupOrder: 3 },
{ integrationId: "slack", requirement: "optional", why: "Routes urgent team updates without burying staff in email.", setupOrder: 4 }
]
},
{
id: "restaurant",
name: "Restaurant",
description: "Connect customer messages, staffing updates, files, and payments.",
recommendedIntegrations: [
{ integrationId: "gmail", requirement: "required", why: "Captures catering requests, vendor messages, bookings, and customer questions.", setupOrder: 1 },
{ integrationId: "google-calendar", requirement: "required", why: "Tracks private events, staffing blocks, supplier visits, and reservations.", setupOrder: 2 },
{ integrationId: "stripe", requirement: "optional", why: "Connects deposits, invoices, and payment context for follow-up.", setupOrder: 3 },
{ integrationId: "slack", requirement: "optional", why: "Keeps front-of-house, kitchen, and owner updates in one channel.", setupOrder: 4 }
]
},
{
id: "agency",
name: "Agency",
description: "Bring together client work, delivery conversations, calendars, and repos.",
recommendedIntegrations: [
{ integrationId: "gmail", requirement: "required", why: "Captures client approvals, requests, and operational follow-up.", setupOrder: 1 },
{ integrationId: "google-calendar", requirement: "required", why: "Coordinates sales calls, reviews, deadlines, and delivery meetings.", setupOrder: 2 },
{ integrationId: "slack", requirement: "required", why: "Routes client and internal status updates to the right team.", setupOrder: 3 },
{ integrationId: "github", requirement: "optional", why: "Links delivery work, issues, pull requests, and release activity.", setupOrder: 4 },
{ integrationId: "hubspot", requirement: "optional", why: "Adds sales and account context for automation builders.", setupOrder: 5 }
]
},
{
id: "real-estate",
name: "Real Estate",
description: "Support lead response, showings, documents, CRM updates, and closings.",
recommendedIntegrations: [
{ integrationId: "gmail", requirement: "required", why: "Handles buyer, seller, lender, and title-company messages.", setupOrder: 1 },
{ integrationId: "google-calendar", requirement: "required", why: "Coordinates showings, inspections, open houses, and closing dates.", setupOrder: 2 },
{ integrationId: "google-drive", requirement: "optional", why: "Keeps listing docs, contracts, disclosures, and photos organized.", setupOrder: 3 },
{ integrationId: "hubspot", requirement: "optional", why: "Tracks contacts, deal stages, and nurture follow-up.", setupOrder: 4 }
]
},
{
id: "local-service-business",
name: "Local Service Business",
description: "Connect customer requests, jobs, schedules, team updates, and billing.",
recommendedIntegrations: [
{ integrationId: "gmail", requirement: "required", why: "Captures estimates, customer questions, vendor messages, and job updates.", setupOrder: 1 },
{ integrationId: "google-calendar", requirement: "required", why: "Keeps crews, appointments, site visits, and callbacks coordinated.", setupOrder: 2 },
{ integrationId: "quickbooks", requirement: "optional", why: "Connects customers, invoices, and payment context.", setupOrder: 3 },
{ integrationId: "slack", requirement: "optional", why: "Routes office and field updates to the right people.", setupOrder: 4 }
]
}
] as const satisfies StarterKitDefinition[];

export const connectorManifestExample: ConnectorManifest = {
id: "example-calendar",
name: "Example Calendar",
category: "calendar",
toolkitSlug: "examplecalendar",
authMethod: "oauth",
providerOptions: ["mock", "composio"],
scopes: ["calendar.events.read"],
actions: [
{
id: "list-events",
name: "List events",
description: "Reads upcoming calendar events for a connected account."
}
]
};

export const connectorCapabilities = [
{
connectorId: "gmail",
connectorName: "Gmail",
capabilities: [
capability("read-email", "Read Email", "Read messages and message metadata.", [
action("gmail.read-messages", "Read messages", "Reads inbox messages.", "read-email", ["gmail.readonly"])
]),
capability("send-email", "Send Email", "Send email from the connected account.", [
action("gmail.send-message", "Send message", "Sends an email message.", "send-email", ["gmail.send"])
]),
capability("search-email", "Search Email", "Search inbox and message history.", [
action("gmail.search-inbox", "Search inbox", "Searches Gmail messages.", "search-email", ["gmail.readonly"])
])
]
},
{
connectorId: "google-calendar",
connectorName: "Google Calendar",
capabilities: [
capability("read-calendar", "Read Calendar", "Read calendars and event details.", [
action("google-calendar.read-events", "Read events", "Reads calendar events.", "read-calendar", ["calendar.events.read"])
]),
capability("create-calendar-event", "Create Calendar Event", "Create new calendar events.", [
action("google-calendar.create-event", "Create event", "Creates a calendar event.", "create-calendar-event", ["calendar.events.write"])
]),
capability("update-calendar-event", "Update Events", "Update existing calendar events.", [
action("google-calendar.update-event", "Update event", "Updates a calendar event.", "update-calendar-event", ["calendar.events.write"])
])
]
},
{
connectorId: "slack",
connectorName: "Slack",
capabilities: [
capability("read-channels", "Read Channels", "Read channel lists and channel context.", [
action("slack.read-channels", "Read channels", "Reads Slack channel metadata.", "read-channels", ["channels.read"])
]),
capability("send-messages", "Send Messages", "Send messages into Slack channels.", [
action("slack.send-message", "Send message", "Sends a Slack message.", "send-messages", ["chat.write"])
]),
capability("upload-files", "Upload Files", "Upload files to Slack conversations.", [
action("slack.upload-file", "Upload file", "Uploads a file to Slack.", "upload-files", ["files.write"])
])
]
},
{
connectorId: "github",
connectorName: "GitHub",
capabilities: [
capability("read-repos", "Read Repos", "Read repositories and repository metadata.", [
action("github.read-repos", "Read repositories", "Reads repository metadata.", "read-repos", ["repo"])
]),
capability("create-pr", "Create PR", "Create pull requests.", [
action("github.create-pr", "Create pull request", "Creates a pull request.", "create-pr", ["repo"])
]),
capability("manage-issues", "Issues", "Read and create issues.", [
action("github.create-issue", "Create issue", "Creates a GitHub issue.", "manage-issues", ["issues.read"])
])
]
},
{
connectorId: "hubspot",
connectorName: "HubSpot",
capabilities: [
capability("read-contacts", "Read Contacts", "Read CRM contacts and companies.", [
action("hubspot.read-contacts", "Read contacts", "Reads CRM contacts.", "read-contacts", ["crm.objects.contacts.read"])
]),
capability("create-records", "Create Records", "Create CRM records.", [
action("hubspot.create-contact", "Create contact", "Creates a CRM contact.", "create-records", ["crm.objects.contacts.write"])
]),
capability("update-records", "Update Records", "Update CRM records.", [
action("hubspot.update-contact", "Update contact", "Updates a CRM contact.", "update-records", ["crm.objects.contacts.write"])
])
]
},
{
connectorId: "quickbooks",
connectorName: "QuickBooks",
capabilities: [
capability("read-contacts", "Read Contacts", "Read customers and vendors.", [
action("quickbooks.read-customers", "Read customers", "Reads customer records.", "read-contacts", ["accounting"])
]),
capability("create-records", "Create Records", "Create invoices and customer records.", [
action("quickbooks.create-invoice", "Create invoice", "Creates an invoice.", "create-records", ["accounting"])
]),
capability("update-records", "Update Records", "Update accounting records.", [
action("quickbooks.update-customer", "Update customer", "Updates a customer record.", "update-records", ["accounting"])
])
]
},
{
connectorId: "google-drive",
connectorName: "Google Drive",
capabilities: [
capability("read-files", "Read Files", "Read files and file metadata.", [
action("google-drive.read-files", "Read files", "Reads Drive files.", "read-files", ["drive.readonly"])
]),
capability("write-files", "Write Files", "Create or update Drive files.", [
action("google-drive.write-file", "Write file", "Writes a Drive file.", "write-files", ["drive.file"])
]),
capability("download-files", "Download Files", "Download files for automation context.", [
action("google-drive.download-file", "Download file", "Downloads a Drive file.", "download-files", ["drive.readonly"])
])
]
},
{
connectorId: "stripe",
connectorName: "Stripe",
capabilities: [
capability("read-contacts", "Read Contacts", "Read customer records.", [
action("stripe.read-customers", "Read customers", "Reads Stripe customers.", "read-contacts", ["customers.read"])
]),
capability("create-records", "Create Records", "Create payment-related records.", [
action("stripe.create-customer", "Create customer", "Creates a Stripe customer.", "create-records", ["customers.read"])
]),
capability("search", "Search", "Search customers and charges.", [
action("stripe.search", "Search Stripe", "Searches Stripe records.", "search", ["charges.read"])
])
]
}
] as const satisfies ConnectorCapabilities[];

export const universalActions = [
 universalAction("send_message", "Send message", "Send a message through any connected messaging or email tool.", [
  universalConnector("slack", "slack.send-message", "send-messages", {
   destination: "channel or conversation",
   text: "message body"
  }),
  universalConnector("gmail", "gmail.send-message", "send-email", {
   to: "email address",
   subject: "email subject",
   body: "email body"
  })
 ]),
 universalAction("search_messages", "Search messages", "Search connected inboxes and message history.", [
  universalConnector("gmail", "gmail.search-inbox", "search-email", { query: "search text" }),
  universalConnector("slack", "slack.read-channels", "read-channels", { query: "search text" })
 ]),
 universalAction("create_calendar_event", "Create calendar event", "Create a meeting or appointment on a connected calendar.", [
  universalConnector("google-calendar", "google-calendar.create-event", "create-calendar-event", {
   title: "event title",
   startsAt: "ISO start time",
   endsAt: "ISO end time"
  })
 ]),
 universalAction("search_files", "Search files", "Find files in connected document stores.", [
  universalConnector("google-drive", "google-drive.read-files", "read-files", { query: "file search text" })
 ]),
 universalAction("create_customer", "Create customer", "Create a customer or contact record in a connected business system.", [
  universalConnector("hubspot", "hubspot.create-contact", "create-records", {
   name: "customer name",
   email: "email address"
  }),
  universalConnector("quickbooks", "quickbooks.create-invoice", "create-records", {
   customerName: "customer name"
  }),
 universalConnector("stripe", "stripe.create-customer", "create-records", {
 name: "customer name",
 email: "email address"
 })
 ])
,
universalAction("search_customer", "Search customer", "Find a customer or contact in a connected business system.", [
 universalConnector("hubspot", "hubspot.read-contacts", "read-contacts", { query: "name or email" }),
 universalConnector("quickbooks", "quickbooks.read-customers", "read-contacts", { query: "name or email" }),
 universalConnector("stripe", "stripe.search", "search", { query: "name, email, or customer id" })
]),
universalAction("save_file", "Save file", "Create or update a file in connected storage.", [
 universalConnector("google-drive", "google-drive.write-file", "write-files", {
 name: "file name",
 contentRef: "content reference"
 })
])
] as const satisfies UniversalActionDefinition[];

export const aiSkills = [
 aiSkill("notify_team", "Notify Team", "communication", "Send an internal team update through the best connected channel.", [
  skillAction("send_message", 1)
 ]),
 aiSkill("send_customer_update", "Send Customer Update", "communication", "Send a status update to a customer.", [
  skillAction("send_message", 1)
 ]),
 aiSkill("send_welcome_email", "Send Welcome Email", "communication", "Send a friendly first-touch message to a new person.", [
  skillAction("send_message", 1)
 ]),
 aiSkill("send_appointment_reminder", "Send Appointment Reminder", "communication", "Remind a person or team about an upcoming appointment.", [
  skillAction("send_message", 1),
  skillAction("create_calendar_event", 2, false)
 ]),
 aiSkill("schedule_meeting", "Schedule Meeting", "calendar", "Create a meeting or appointment on the connected calendar.", [
  skillAction("create_calendar_event", 1)
 ]),
 aiSkill("add_customer", "Add Customer", "crm", "Create a customer or contact record in the best connected system.", [
  skillAction("create_customer", 1)
 ]),
aiSkill("search_customer", "Search Customer", "crm", "Find an existing customer or account record.", [
  skillAction("search_customer", 1)
 ]),
 aiSkill("find_file", "Find File", "documents", "Find a document or file in connected storage.", [
  skillAction("search_files", 1)
 ]),
 aiSkill("save_file", "Save File", "documents", "Save or prepare a file through connected storage.", [
  skillAction("save_file", 1)
 ])
] as const satisfies AiSkillDefinition[];

export function listIntegrations(category?: IntegrationCategory): IntegrationDefinition[] {
  const integrations = [...integrationCatalog];
  if (!category) {
    return integrations;
  }

  return integrations.filter((integration) => integration.category === category);
}

export function getIntegration(integrationId: string): IntegrationDefinition | undefined {
return integrationCatalog.find((integration) => integration.id === integrationId);
}

export function listConnectorCapabilities(): ConnectorCapabilities[] {
return connectorCapabilities.map((connector) => ({
connectorId: connector.connectorId,
connectorName: connector.connectorName,
capabilities: connector.capabilities.map((capability) => ({
...capability,
actions: capability.actions.map((action) => ({ ...action })),
permissions: [...capability.permissions]
}))
}));
}

export function getConnectorCapabilities(
connectorId: string
): ConnectorCapabilities | undefined {
return listConnectorCapabilities().find((connector) => connector.connectorId === connectorId);
}

export function listConnectorActions(): Array<
 ConnectorActionDefinition & { connectorId: string; connectorName: string }
> {
 return listConnectorCapabilities().flatMap((connector) =>
  connector.capabilities.flatMap((capability) =>
   capability.actions.map((action) => ({
...action,
connectorId: connector.connectorId,
connectorName: connector.connectorName
}))
  )
 );
}

export function listUniversalActions(): UniversalActionDefinition[] {
 return universalActions.map((action) => ({
  ...action,
  connectors: action.connectors.map((connector) => ({
   ...connector,
   permissions: [...connector.permissions],
   inputSchema: { ...connector.inputSchema }
  }))
 }));
}

export function getUniversalAction(actionId: UniversalActionId): UniversalActionDefinition | undefined {
 return listUniversalActions().find((action) => action.id === actionId);
}

export function resolveUniversalActionProviders(
 userId: string,
 actionId: UniversalActionId,
 connections: readonly ConnectionRecord[]
): ResolvedUniversalActionProvider[] {
 const universalAction = getUniversalAction(actionId);
 if (!universalAction) return [];
 return universalAction.connectors.flatMap((mapping) =>
  connections
   .filter(
    (connection) =>
     connection.userId === userId &&
     connection.integrationId === mapping.connectorId &&
     connection.status === "connected"
   )
   .map((connection) => ({
    ...mapping,
    connectionId: connection.id,
    providerKey: connection.providerKey
   }))
 );
}

export async function executeUniversalAction(
 input: ExecuteUniversalActionInput
): Promise<ExecuteUniversalActionDryRunResult> {
 const availableProviders = resolveUniversalActionProviders(input.userId, input.action, input.connections);
 const selectedProvider =
  availableProviders.find(
   (provider) =>
    provider.connectorId === input.preferredProvider ||
    provider.connectorName.toLowerCase() === input.preferredProvider?.toLowerCase()
  ) ??
  availableProviders[0] ??
  null;

 return {
  dryRun: true,
  action: input.action,
  wouldExecute: Boolean(selectedProvider),
  selectedProvider,
  availableProviders,
  input: input.input,
  message: selectedProvider
   ? `Dry run only. ${selectedProvider.connectorName} can handle ${input.action}.`
  : `Dry run only. No connected provider can handle ${input.action}.`
 };
}

export function listAiSkills(): AiSkillDefinition[] {
 return aiSkills.map((skill) => ({
  ...skill,
  actions: skill.actions.map((action) => ({ ...action }))
 }));
}

export function getAiSkill(skillId: AiSkillId): AiSkillDefinition | undefined {
 return listAiSkills().find((skill) => skill.id === skillId);
}

export function resolveSkillProviders(
 userId: string,
 skillId: AiSkillId,
 connections: readonly ConnectionRecord[]
): ResolvedAiSkillProvider[] {
 const skill = getAiSkill(skillId);
 if (!skill) return [];
 return skill.actions
  .sort((first, second) => first.priority - second.priority)
  .flatMap((mapping) =>
   resolveUniversalActionProviders(userId, mapping.universalActionId, connections).map((provider) => ({
    skillId: skill.id,
    skillName: skill.name,
    universalActionId: mapping.universalActionId,
    provider
   }))
  );
}

export async function executeSkill(input: ExecuteSkillInput): Promise<ExecuteSkillDryRunResult> {
 const availableProviders = resolveSkillProviders(input.userId, input.skill, input.connections);
 const selectedProvider =
  availableProviders.find(
   (resolved) =>
    resolved.provider.connectorId === input.preferredProvider ||
    resolved.provider.connectorName.toLowerCase() === input.preferredProvider?.toLowerCase()
  ) ??
  availableProviders[0] ??
  null;

 return {
  dryRun: true,
  skill: input.skill,
  wouldExecute: Boolean(selectedProvider),
  selectedProvider,
  availableProviders,
  input: input.input,
  message: selectedProvider
   ? `Dry run only. ${selectedProvider.skillName} can use ${selectedProvider.provider.connectorName}.`
   : `Dry run only. No connected provider can handle ${input.skill}.`
 };
}

export function listStarterKits(): StarterKitDefinition[] {
 return [...starterKits];
}

export function getStarterKit(starterKitId: StarterKitId): StarterKitDefinition | undefined {
return starterKits.find((starterKit) => starterKit.id === starterKitId);
}

export function validateConnectorManifest(manifest: unknown): ManifestValidationResult {
const errors: string[] = [];
if (!manifest || typeof manifest !== "object" || Array.isArray(manifest)) {
return { valid: false, errors: ["Manifest must be an object."] };
}
const value = manifest as Partial<ConnectorManifest>;
requireString(value.id, "id", errors);
requireString(value.name, "name", errors);
if (!isIntegrationCategory(value.category)) {
errors.push("category must be a known integration category.");
}
requireString(value.toolkitSlug, "toolkitSlug", errors);
if (!isAuthMethod(value.authMethod)) {
errors.push("authMethod must be oauth, api_key, webhook, or manual.");
}
if (!Array.isArray(value.providerOptions) || value.providerOptions.length === 0) {
errors.push("providerOptions must include at least one provider.");
} else {
for (const provider of value.providerOptions) {
if (!isProviderKey(provider)) {
errors.push(`providerOptions includes unknown provider: ${String(provider)}.`);
}
}
}
if (!Array.isArray(value.scopes) || !value.scopes.every((scope) => typeof scope === "string")) {
errors.push("scopes must be an array of strings.");
}
if (!Array.isArray(value.actions) || value.actions.length === 0) {
errors.push("actions must include at least one action.");
} else {
value.actions.forEach((action, index) => {
if (!action || typeof action !== "object") {
errors.push(`actions[${index}] must be an object.`);
return;
}
requireString(action.id, `actions[${index}].id`, errors);
requireString(action.name, `actions[${index}].name`, errors);
requireString(action.description, `actions[${index}].description`, errors);
});
}
return { valid: errors.length === 0, errors };
}

export function summarizeConnectionState(
integration: IntegrationDefinition,
connections: UserConnection[]
): UserConnection | undefined {
return connections.find((connection) => connection.integrationId === integration.id);
}

function requireString(value: unknown, field: string, errors: string[]) {
if (typeof value !== "string" || value.trim().length === 0) {
errors.push(`${field} is required.`);
}
}

function capability(
id: CapabilityId,
name: string,
description: string,
actions: ConnectorActionDefinition[]
): ConnectorCapabilityDefinition {
return {
id,
name,
description,
actions,
permissions: [...new Set(actions.flatMap((action) => action.permissions))]
};
}

function action(
 id: string,
 name: string,
 description: string,
 capabilityId: CapabilityId,
 permissions: string[]
): ConnectorActionDefinition {
 return { id, name, description, capabilityId, permissions };
}

function universalAction(
 id: UniversalActionId,
 name: string,
 description: string,
 connectors: UniversalActionConnectorMapping[]
): UniversalActionDefinition {
 return { id, name, description, connectors };
}

function universalConnector(
 connectorId: string,
 connectorActionId: string,
 capabilityId: CapabilityId,
 inputSchema: Record<string, string>
): UniversalActionConnectorMapping {
 const connector = getConnectorCapabilities(connectorId);
 const connectorAction = connector?.capabilities
  .flatMap((capability) => capability.actions)
  .find((action) => action.id === connectorActionId);
 return {
  connectorId,
  connectorName: connector?.connectorName ?? connectorId,
  connectorActionId,
  capabilityId,
  permissions: connectorAction?.permissions ?? [],
  inputSchema
 };
}

function aiSkill(
 id: AiSkillId,
 name: string,
 category: AiSkillCategory,
 description: string,
 actions: AiSkillActionMapping[]
): AiSkillDefinition {
 return { id, name, category, description, actions };
}

function skillAction(
 universalActionId: UniversalActionId,
 priority: number,
 required = true
): AiSkillActionMapping {
 return { universalActionId, priority, required };
}

function isIntegrationCategory(value: unknown): value is IntegrationCategory {
 return ["email", "calendar", "crm", "payments", "messaging", "files", "automation"].includes(
  String(value)
);
}

function isAuthMethod(value: unknown): value is IntegrationAuthMethod {
return ["oauth", "api_key", "webhook", "manual"].includes(String(value));
}

function isProviderKey(value: unknown): value is ProviderKey {
return ["mock", "composio", "direct-oauth"].includes(String(value));
}

export class InMemoryConnectCoreRepository implements ConnectCoreRepository {
  private integrations = new Map<string, IntegrationDefinition>();
  private connections = new Map<string, ConnectionRecord>();
  private health = new Map<string, ConnectionHealthRecord>();
  private events = new Map<string, ConnectionEventRecord[]>();
  private oauthTokens = new Map<string, OAuthTokenPlaceholder[]>();

  constructor(seedIntegrations: IntegrationDefinition[] = listIntegrations()) {
    for (const integration of seedIntegrations) {
      this.integrations.set(integration.id, integration);
    }
  }

  async listIntegrations(): Promise<IntegrationDefinition[]> {
    return [...this.integrations.values()];
  }

  async upsertIntegrations(integrations: IntegrationDefinition[]): Promise<void> {
    for (const integration of integrations) {
      this.integrations.set(integration.id, integration);
    }
  }

  async getIntegration(integrationId: string): Promise<IntegrationDefinition | undefined> {
    return this.integrations.get(integrationId);
  }

  async listUserConnections(userId: string): Promise<ConnectionRecord[]> {
    return [...this.connections.values()].filter((connection) => connection.userId === userId);
  }

  async getConnection(connectionId: string): Promise<ConnectionRecord | undefined> {
    return this.connections.get(connectionId);
  }

  async findUserConnection(
    userId: string,
    integrationId: string
  ): Promise<ConnectionRecord | undefined> {
    return [...this.connections.values()].find(
      (connection) => connection.userId === userId && connection.integrationId === integrationId
    );
  }

  async saveConnection(connection: ConnectionRecord): Promise<ConnectionRecord> {
    this.connections.set(connection.id, connection);
    return connection;
  }

  async saveHealth(health: ConnectionHealthRecord): Promise<ConnectionHealthRecord> {
    this.health.set(health.connectionId, health);
    return health;
  }

  async getLatestHealth(connectionId: string): Promise<ConnectionHealthRecord | undefined> {
    return this.health.get(connectionId);
  }

  async recordEvent(event: ConnectionEventRecord): Promise<ConnectionEventRecord> {
    const events = this.events.get(event.connectionId) ?? [];
    events.push(event);
    this.events.set(event.connectionId, events);
    return event;
  }

  async listEvents(connectionId: string): Promise<ConnectionEventRecord[]> {
    return this.events.get(connectionId) ?? [];
  }

  async saveOAuthToken(token: OAuthTokenPlaceholder): Promise<OAuthTokenPlaceholder> {
    const tokens = this.oauthTokens.get(token.connectionId) ?? [];
    const nextTokens = [...tokens.filter((storedToken) => storedToken.id !== token.id), token];
    this.oauthTokens.set(token.connectionId, nextTokens);
    return token;
  }

  async listOAuthTokens(connectionId: string): Promise<OAuthTokenPlaceholder[]> {
    return this.oauthTokens.get(connectionId) ?? [];
  }
}

export class StaticProviderRegistry implements ProviderRegistry {
  constructor(private readonly providers: Record<ProviderKey, ConnectionProvider>) {}

  get(providerKey: ProviderKey): ConnectionProvider {
    return this.providers[providerKey];
  }

  list(): ProviderKey[] {
    return Object.keys(this.providers) as ProviderKey[];
  }
}

export class MockConnectionProvider implements ConnectionProvider {
  readonly key = "mock" as const;

  async startConnection(input: StartConnectionInput): Promise<StartConnectionResult> {
    const connectionId = input.existingConnection?.id ?? createId("conn");
    const redirectUrl = `${input.callbackUrl}?connectionId=${encodeURIComponent(
      connectionId
    )}&integrationId=${encodeURIComponent(input.integration.id)}&status=success`;

    return {
      connectionId,
      redirectUrl,
      status: "pending",
      providerKey: this.key
    };
  }

  async completeConnection(input: {
    connection: ConnectionRecord;
    callbackPayload: CallbackPayload;
  }): Promise<Partial<ConnectionRecord>> {
    return {
      status: input.callbackPayload.status === "failed" ? "unhealthy" : "connected",
      externalAccountId:
        input.callbackPayload.externalAccountId ??
        input.connection.externalAccountId ??
        `mock_${input.connection.integrationId}`
    };
  }

  async reconnect(input: {
    connection: ConnectionRecord;
    callbackUrl: string;
  }): Promise<StartConnectionResult> {
    const redirectUrl = `${input.callbackUrl}?connectionId=${encodeURIComponent(
      input.connection.id
    )}&status=success`;

    return {
      connectionId: input.connection.id,
      redirectUrl,
      status: "pending",
      providerKey: this.key
    };
  }

  async disconnect(): Promise<Partial<ConnectionRecord>> {
    return { status: "disconnected", redirectUrl: undefined };
  }

  async testConnection(): Promise<{
    health: IntegrationHealth;
    status: ConnectionStatus;
    message: string;
  }> {
    return {
      health: "healthy",
      status: "connected",
      message: "Mock provider health check passed."
    };
  }
}

export class PlaceholderConnectionProvider implements ConnectionProvider {
  constructor(
    readonly key: "composio" | "direct-oauth",
    private readonly setupMessage: string
  ) {}

  async startConnection(): Promise<StartConnectionResult> {
    throw new Error(this.setupMessage);
  }

  async completeConnection(): Promise<Partial<ConnectionRecord>> {
    throw new Error(this.setupMessage);
  }

  async reconnect(): Promise<StartConnectionResult> {
    throw new Error(this.setupMessage);
  }

  async disconnect(): Promise<Partial<ConnectionRecord>> {
    throw new Error(this.setupMessage);
  }

  async testConnection(): Promise<{
    health: IntegrationHealth;
    status: ConnectionStatus;
    message: string;
  }> {
    throw new Error(this.setupMessage);
  }
}

export function createDefaultProviderRegistry(): ProviderRegistry {
  return new StaticProviderRegistry({
    mock: new MockConnectionProvider(),
    composio: new PlaceholderConnectionProvider(
      "composio",
      "Composio provider placeholder: wire @composio/core connectedAccounts.link() here."
    ),
    "direct-oauth": new PlaceholderConnectionProvider(
      "direct-oauth",
      "Direct OAuth provider placeholder: wire app-owned OAuth clients here."
    )
  });
}

export class ConnectCoreService {
  constructor(
    private readonly repository: ConnectCoreRepository,
    private readonly providers: ProviderRegistry
  ) {}

  async listIntegrations(category?: IntegrationCategory): Promise<IntegrationDefinition[]> {
    const integrations = await this.repository.listIntegrations();
    if (!category) {
      return integrations;
    }

    return integrations.filter((integration) => integration.category === category);
  }

 async listUserConnections(userId: string): Promise<UserConnection[]> {
  const connections = await this.repository.listUserConnections(userId);
  return Promise.all(connections.map((connection) => this.toUserConnection(connection)));
 }

 async resolveUniversalActionProviders(
  userId: string,
  action: UniversalActionId
 ): Promise<ResolvedUniversalActionProvider[]> {
  const connections = await this.repository.listUserConnections(userId);
  return resolveUniversalActionProviders(userId, action, connections);
 }

 async executeUniversalAction(
  input: Omit<ExecuteUniversalActionInput, "connections">
 ): Promise<ExecuteUniversalActionDryRunResult> {
  const connections = await this.repository.listUserConnections(input.userId);
  return executeUniversalAction({ ...input, connections });
 }

 async resolveSkillProviders(userId: string, skill: AiSkillId): Promise<ResolvedAiSkillProvider[]> {
  const connections = await this.repository.listUserConnections(userId);
  return resolveSkillProviders(userId, skill, connections);
 }

 async executeSkill(input: Omit<ExecuteSkillInput, "connections">): Promise<ExecuteSkillDryRunResult> {
  const connections = await this.repository.listUserConnections(input.userId);
  return executeSkill({ ...input, connections });
 }

 async startConnection(
  userId: string,
    integrationId: string,
    callbackUrl: string
  ): Promise<StartConnectionResult | null> {
    const integration = await this.repository.getIntegration(integrationId);
    if (!integration) {
      return null;
    }

    const existingConnection = await this.repository.findUserConnection(userId, integrationId);
    const provider = this.providers.get(integration.defaultProvider);
    const started = await provider.startConnection({
      userId,
      integration,
      callbackUrl,
      existingConnection
    });
    const now = new Date().toISOString();
    const connection: ConnectionRecord = {
      id: started.connectionId,
      userId,
      integrationId,
      providerKey: started.providerKey,
      status: started.status,
      permissions: integration.scopes,
      metadata: { ...(existingConnection?.metadata ?? {}), ...(started.metadata ?? {}) },
      redirectUrl: started.redirectUrl,
      externalAccountId: started.externalAccountId ?? existingConnection?.externalAccountId,
      createdAt: existingConnection?.createdAt ?? now,
      updatedAt: now
    };

    await this.repository.saveConnection(connection);
    await this.repository.saveHealth({
      id: createId("health"),
      connectionId: connection.id,
      health: "needs_attention",
      checkedAt: now,
      message: "Connection authorization is pending."
    });
    await this.recordEvent(connection, "connect.started", { status: started.status });

    return started;
  }

  async completeConnection(callbackPayload: CallbackPayload): Promise<UserConnection> {
    if (!callbackPayload.connectionId) {
      throw new Error("Connection callback is missing connectionId.");
    }

    const connection = await this.requireConnection(callbackPayload.connectionId);
    const provider = this.providers.get(connection.providerKey);
    const patch = await provider.completeConnection({ connection, callbackPayload });
    const saved = await this.patchConnection(connection, patch);
    await this.repository.saveHealth({
      id: createId("health"),
      connectionId: saved.id,
      health: saved.status === "connected" ? "healthy" : "broken",
      checkedAt: saved.updatedAt,
      message: saved.status === "connected" ? "Connection completed." : "Connection failed."
    });
    await this.recordEvent(saved, "connect.completed", { status: saved.status });

    return this.toUserConnection(saved);
  }

  async reconnectConnection(connectionId: string, callbackUrl: string): Promise<StartConnectionResult> {
    const connection = await this.requireConnection(connectionId);
    const provider = this.providers.get(connection.providerKey);
    const started = await provider.reconnect({ connection, callbackUrl });
    const saved = await this.patchConnection(connection, {
      status: started.status,
      redirectUrl: started.redirectUrl
    });
    await this.repository.saveHealth({
      id: createId("health"),
      connectionId: saved.id,
      health: "needs_attention",
      checkedAt: saved.updatedAt,
      message: "Reconnect authorization is pending."
    });
    await this.recordEvent(saved, "reconnect.started", { status: saved.status });

    return started;
  }

  async disconnectConnection(connectionId: string): Promise<UserConnection> {
    const connection = await this.requireConnection(connectionId);
    const provider = this.providers.get(connection.providerKey);
    const patch = await provider.disconnect({ connection });
    const saved = await this.patchConnection(connection, patch);
    await this.repository.saveHealth({
      id: createId("health"),
      connectionId: saved.id,
      health: "broken",
      checkedAt: saved.updatedAt,
      message: "Connection disconnected."
    });
    await this.recordEvent(saved, "disconnect.completed", { status: saved.status });

    return this.toUserConnection(saved);
  }

  async testConnection(connectionId: string): Promise<UserConnection> {
    const connection = await this.requireConnection(connectionId);
    const provider = this.providers.get(connection.providerKey);
    const result = await provider.testConnection({ connection });
    const saved = await this.patchConnection(connection, { status: result.status });
    await this.repository.saveHealth({
      id: createId("health"),
      connectionId: saved.id,
      health: result.health,
      checkedAt: saved.updatedAt,
      message: result.message
    });
    await this.recordEvent(saved, "health.checked", { health: result.health });

    return this.toUserConnection(saved);
  }

  async getDashboard(userId: string, category?: IntegrationCategory) {
    const integrations = await this.listIntegrations(category);
    const connections = await this.listUserConnections(userId);

    return integrations.map((integration) => ({
      ...integration,
      connection: summarizeConnectionState(integration, connections) ?? null
    }));
  }

  private async toUserConnection(connection: ConnectionRecord): Promise<UserConnection> {
    const health = await this.repository.getLatestHealth(connection.id);
    return {
      id: connection.id,
      userId: connection.userId,
      integrationId: connection.integrationId,
      provider: connection.providerKey,
      status: connection.status,
      health: health?.health ?? "needs_attention",
      permissions: connection.permissions,
      metadata: connection.metadata ?? {},
      lastCheckedAt: health?.checkedAt ?? connection.updatedAt,
      redirectUrl: connection.redirectUrl,
      externalAccountId: connection.externalAccountId
    };
  }

  private async requireConnection(connectionId: string): Promise<ConnectionRecord> {
    const connection = await this.repository.getConnection(connectionId);
    if (!connection) {
      throw new Error(`Connection ${connectionId} was not found.`);
    }

    return connection;
  }

  private async patchConnection(
    connection: ConnectionRecord,
    patch: Partial<ConnectionRecord>
  ): Promise<ConnectionRecord> {
    return this.repository.saveConnection({
      ...connection,
      ...patch,
      updatedAt: new Date().toISOString()
    });
  }

  private async recordEvent(
    connection: ConnectionRecord,
    type: ConnectionEventType,
    metadata: Record<string, string | number | boolean | null>
  ) {
    const event = await this.repository.recordEvent({
      id: createId("event"),
      connectionId: connection.id,
      userId: connection.userId,
      integrationId: connection.integrationId,
      type,
      providerKey: connection.providerKey,
      metadata,
      occurredAt: new Date().toISOString()
    });
    console.info(
      JSON.stringify({
        scope: "connect-core",
        audit: true,
        type: event.type,
        providerKey: event.providerKey,
        connectionId: event.connectionId,
        userId: event.userId,
        integrationId: event.integrationId,
        occurredAt: event.occurredAt,
        metadata: event.metadata
      })
    );
  }
}

function createId(prefix: string): string {
  return `${prefix}_${Date.now()}_${Math.random().toString(36).slice(2, 10)}`;
}
