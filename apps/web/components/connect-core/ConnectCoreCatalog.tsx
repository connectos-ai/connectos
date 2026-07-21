"use client";

import React, { useMemo, useState, useTransition } from "react";
import {
  CalendarDays,
  CheckCircle2,
  CreditCard,
  FileText,
  Mail,
  MessageSquare,
  PlugZap,
  RefreshCw,
  Search,
  ShieldCheck,
  Unplug,
  Workflow
} from "lucide-react";

import { listAiSkills, listConnectorCapabilities, listStarterKits, listUniversalActions } from "@connect-any-inbox/connect-core";
import type {
 AiSkillDefinition,
 ConnectorCapabilityDefinition,
 ConnectionStatus,
 IntegrationCategory,
 IntegrationDefinition,
 IntegrationHealth,
 UniversalActionDefinition,
 UserConnection
} from "@connect-any-inbox/connect-core";

type CatalogItem = IntegrationDefinition & { connection: UserConnection | null };
type ConnectCoreCatalogItem = CatalogItem & {
  providerMode?: "mock" | "real-oauth" | "composio";
  providerStatus?: string;
};

const categories: Array<{ id: "all" | IntegrationCategory; label: string }> = [
  { id: "all", label: "All" },
  { id: "email", label: "Email" },
  { id: "calendar", label: "Calendar" },
  { id: "crm", label: "CRM" },
  { id: "payments", label: "Payments" },
  { id: "messaging", label: "Messaging" },
  { id: "files", label: "Files" },
  { id: "automation", label: "Automation" }
];

const starterKits = listStarterKits();
const aiSkills = listAiSkills();
const universalActions = listUniversalActions();
const capabilitiesByConnector = new Map(
 listConnectorCapabilities().map((entry) => [entry.connectorId, entry.capabilities])
);

export function ConnectCoreCatalog({ initialItems }: { initialItems: ConnectCoreCatalogItem[] }) {
  const [items, setItems] = useState(initialItems);
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState<"all" | IntegrationCategory>("all");
  const [isPending, startTransition] = useTransition();

  const filteredItems = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();
    return items.filter((item) => {
      const matchesCategory = category === "all" || item.category === category;
      const matchesQuery =
        normalizedQuery.length === 0 ||
        item.name.toLowerCase().includes(normalizedQuery) ||
        item.description.toLowerCase().includes(normalizedQuery);

      return matchesCategory && matchesQuery;
    });
  }, [category, items, query]);

 const connectedCount = items.filter((item) => item.connection?.status === "connected").length;
 const availableAiSkills = useMemo(
  () => getAvailableAiSkills(items),
  [items]
 );
 const availableUniversalActions = useMemo(
  () => getAvailableUniversalActions(items),
  [items]
 );

  function refreshDashboard() {
    startTransition(async () => {
      const response = await fetch("/api/connect-core/integrations");
      const payload = (await response.json()) as { data: ConnectCoreCatalogItem[] };
      setItems(payload.data);
    });
  }

  function connectIntegration(integrationId: string) {
    startTransition(async () => {
      const response = await fetch("/api/connect-core/connect", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ integrationId })
      });
      const payload = (await response.json()) as { data: { redirectUrl: string } };
      await followConnectionRedirect(payload.data.redirectUrl);
      refreshDashboard();
    });
  }

  function connectionAction(connectionId: string, action: "disconnect" | "reconnect") {
    startTransition(async () => {
      const response = await fetch(`/api/connect-core/connections/${connectionId}/${action}`, {
        method: "POST"
      });
      const payload = (await response.json()) as { data?: { redirectUrl?: string } };
      if (action === "reconnect" && payload.data?.redirectUrl) {
        await followConnectionRedirect(payload.data.redirectUrl);
      }
      refreshDashboard();
    });
  }

  return (
    <main className="connect-core-page">
      <section className="connect-core-header" aria-labelledby="connect-core-title">
        <div>
          <p className="eyebrow">ConnectOS</p>
          <h1 id="connect-core-title">Explore ConnectOS integrations</h1>
          <p className="connect-core-subtitle">
 Neutral infrastructure for AI applications to connect through Providers, Capabilities, Actions, and Skills.
          </p>
        </div>
        <div className="health-summary" aria-label="Connection summary">
          <span>Connected</span>
          <strong>
            {connectedCount}/{items.length}
          </strong>
        </div>
      </section>

      <section className="connect-core-toolbar" aria-label="Integration filters">
        <label className="search-field">
          <Search size={17} strokeWidth={2} aria-hidden="true" />
          <span className="sr-only">Search integrations</span>
          <input
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search tools"
            type="search"
          />
        </label>
        <div className="category-tabs" aria-label="Integration categories">
          {categories.map((tab) => (
            <button
              aria-pressed={category === tab.id}
              className="category-tab"
              key={tab.id}
              onClick={() => setCategory(tab.id)}
              type="button"
            >
              {tab.label}
            </button>
          ))}
        </div>
      </section>

 <AvailableAiSkillsSection skills={availableAiSkills} />

 <AvailableAiActionsSection actions={availableUniversalActions} />

 <StarterKitsSection items={items} />

      <section className="integration-grid" aria-label="Integration results" aria-live="polite" aria-busy={isPending}>
        {filteredItems.map((item) => (
          <IntegrationCard
            item={item}
            key={item.id}
            onConnect={connectIntegration}
            onConnectionAction={connectionAction}
          />
        ))}
      </section>
    </main>
  );
}

async function followConnectionRedirect(redirectUrl: string) {
  const url = new URL(redirectUrl, window.location.href);
  if (url.origin === window.location.origin) {
    await fetch(url.toString());
    return;
  }

 window.location.assign(url.toString());
}

type AvailableUniversalAction = UniversalActionDefinition & {
 availableProviders: Array<{
  connectorId: string;
  connectorName: string;
 }>;
};

type AvailableAiSkill = AiSkillDefinition & {
 availableProviders: Array<{
  connectorId: string;
  connectorName: string;
  universalActionId: string;
 }>;
};

function AvailableAiSkillsSection({ skills }: { skills: AvailableAiSkill[] }) {
 return (
  <section className="ai-skills-section" aria-labelledby="ai-skills-title">
   <div className="ai-actions-heading">
    <div>
     <p className="eyebrow">AI skills</p>
     <h2 id="ai-skills-title">What your connected AI can help with</h2>
    </div>
    <span>{skills.length} ready</span>
   </div>

   {skills.length > 0 ? (
    <ul className="ai-skill-list">
     {skills.map((skill) => (
      <li key={skill.id}>
       <CheckCircle2 size={15} strokeWidth={2.2} aria-hidden="true" />
       <div>
        <strong>{skill.name}</strong>
        <span>{skill.availableProviders.map((provider) => provider.connectorName).join(", ")}</span>
       </div>
      </li>
     ))}
    </ul>
   ) : (
 <p className="ai-actions-empty">Connect a tool to preview safe dry-run Skills for an AI application.</p>
   )}
  </section>
 );
}

function AvailableAiActionsSection({ actions }: { actions: AvailableUniversalAction[] }) {
 return (
  <section className="ai-actions-section" aria-labelledby="ai-actions-title">
   <div className="ai-actions-heading">
    <div>
     <p className="eyebrow">Actions</p>
     <h2 id="ai-actions-title">What your connected AI can resolve now</h2>
    </div>
    <span>{actions.length} ready</span>
   </div>

   {actions.length > 0 ? (
    <ul className="ai-action-list">
     {actions.map((action) => (
      <li key={action.id}>
       <CheckCircle2 size={15} strokeWidth={2.2} aria-hidden="true" />
       <div>
        <strong>{action.name}</strong>
        <span>{action.availableProviders.map((provider) => provider.connectorName).join(", ")}</span>
       </div>
      </li>
     ))}
    </ul>
   ) : (
<p className="ai-actions-empty">Connect a tool to preview safe dry-run Actions for an AI application.</p>
   )}
  </section>
 );
}

function getAvailableAiSkills(items: ConnectCoreCatalogItem[]): AvailableAiSkill[] {
 const connectedConnectorIds = new Set(
  items
   .filter((item) => item.connection?.status === "connected")
   .map((item) => item.id)
 );

 return aiSkills
  .map((skill) => ({
   ...skill,
   availableProviders: skill.actions.flatMap((skillAction) => {
    const universalAction = universalActions.find((action) => action.id === skillAction.universalActionId);
    return (
     universalAction?.connectors
      .filter((connector) => connectedConnectorIds.has(connector.connectorId))
      .map((connector) => ({
       connectorId: connector.connectorId,
       connectorName: connector.connectorName,
       universalActionId: skillAction.universalActionId
      })) ?? []
    );
   })
  }))
  .filter((skill) => skill.availableProviders.length > 0);
}

function getAvailableUniversalActions(items: ConnectCoreCatalogItem[]): AvailableUniversalAction[] {
 const connectedConnectorIds = new Set(
  items
   .filter((item) => item.connection?.status === "connected")
   .map((item) => item.id)
 );

 return universalActions
  .map((action) => ({
   ...action,
   availableProviders: action.connectors
    .filter((connector) => connectedConnectorIds.has(connector.connectorId))
    .map((connector) => ({
     connectorId: connector.connectorId,
     connectorName: connector.connectorName
    }))
  }))
  .filter((action) => action.availableProviders.length > 0);
}

function StarterKitsSection({ items }: { items: ConnectCoreCatalogItem[] }) {
const integrationsById = new Map(items.map((item) => [item.id, item]));

return (
<section className="starter-kit-section" aria-labelledby="starter-kit-title">
<div className="starter-kit-heading">
<div>
<p className="eyebrow">Starter kits</p>
<h2 id="starter-kit-title">Choose a setup guide</h2>
</div>
</div>
<div className="starter-kit-grid">
{starterKits.map((kit) => (
<article className="starter-kit-card" key={kit.id}>
<div>
<h3>{kit.name}</h3>
<p>{kit.description}</p>
</div>
<ol className="starter-kit-list">
{kit.recommendedIntegrations
.slice()
.sort((a, b) => a.setupOrder - b.setupOrder)
.map((recommendation) => {
const integration = integrationsById.get(recommendation.integrationId);
return (
<li key={recommendation.integrationId}>
<span className="kit-step">{recommendation.setupOrder}</span>
<div>
<div className="kit-integration-row">
<strong>{integration?.name ?? recommendation.integrationId}</strong>
<span className="kit-requirement" data-requirement={recommendation.requirement}>
{recommendation.requirement}
</span>
</div>
<p>{recommendation.why}</p>
</div>
</li>
);
})}
</ol>
<button className="connect-all-button" disabled type="button" title="Disabled v1 placeholder for future guided onboarding">
<PlugZap size={16} strokeWidth={2} aria-hidden="true" />
<span>Connect all recommended</span>
</button>
</article>
))}
</div>
</section>
);
}

function IntegrationCard({
  item,
  onConnect,
  onConnectionAction
}: {
  item: ConnectCoreCatalogItem;
  onConnect: (integrationId: string) => void;
  onConnectionAction: (connectionId: string, action: "disconnect" | "reconnect") => void;
}) {
const Icon = getCategoryIcon(item.category);
const connection = item.connection;
const isConnected = connection?.status === "connected";
const capabilities = capabilitiesByConnector.get(item.id) ?? [];

  return (
    <article className="integration-card">
      <div className="integration-card-main">
        <span className="integration-icon" data-category={item.category} aria-hidden="true">
          <Icon size={19} strokeWidth={2} />
        </span>
        <div>
          <div className="integration-title-row">
            <h2>{item.name}</h2>
            {item.isMvp ? <span className="mvp-badge">MVP</span> : null}
            <span className="provider-badge" data-mode={item.providerMode ?? "mock"}>
              {item.providerStatus ?? "Mock"}
            </span>
          </div>
          <p>{item.description}</p>
        </div>
      </div>

<div className="connection-details">
<ConnectionHealth health={connection?.health} status={connection?.status} />
<CapabilityList capabilities={capabilities} />
<div className="permission-list">
<ShieldCheck size={15} strokeWidth={2} aria-hidden="true" />
<span>{item.scopes.join(", ")}</span>
        </div>
      </div>

      <div className="integration-actions">
        {isConnected && connection ? (
          <>
            <button
              className="secondary-icon-button"
              onClick={() => onConnectionAction(connection.id, "reconnect")}
              title="Reconnect"
              type="button"
            >
              <RefreshCw size={16} strokeWidth={2} aria-hidden="true" />
              <span>Reconnect</span>
            </button>
            <button
              className="secondary-icon-button"
              onClick={() => onConnectionAction(connection.id, "disconnect")}
              title="Disconnect"
              type="button"
            >
              <Unplug size={16} strokeWidth={2} aria-hidden="true" />
              <span>Disconnect</span>
            </button>
          </>
        ) : (
          <button className="connect-primary-button" onClick={() => onConnect(item.id)} type="button">
            <PlugZap size={17} strokeWidth={2} aria-hidden="true" />
            <span>Connect</span>
          </button>
        )}
      </div>
    </article>
);
}

function CapabilityList({ capabilities }: { capabilities: ConnectorCapabilityDefinition[] }) {
if (capabilities.length === 0) {
return null;
}

return (
<div className="capability-list" aria-label="Capabilities">
<span className="capability-list-label">Capabilities</span>
<ul>
{capabilities.map((capability) => (
<li key={capability.id}>
<CheckCircle2 size={14} strokeWidth={2.2} aria-hidden="true" />
<span>{capability.name}</span>
</li>
))}
</ul>
</div>
);
}

function ConnectionHealth({
  health,
  status
}: {
  health?: IntegrationHealth;
  status?: ConnectionStatus;
}) {
  if (status === "connected" && health === "healthy") {
    return (
      <div className="connection-health" data-health="healthy">
        <CheckCircle2 size={15} strokeWidth={2} aria-hidden="true" />
        <span>Connected</span>
      </div>
    );
  }

  if (status === "pending") {
    return (
      <div className="connection-health" data-health="pending">
        <RefreshCw size={15} strokeWidth={2} aria-hidden="true" />
        <span>Pending</span>
      </div>
    );
  }

  return (
    <div className="connection-health" data-health="idle">
      <PlugZap size={15} strokeWidth={2} aria-hidden="true" />
      <span>Not connected</span>
    </div>
  );
}

function getCategoryIcon(category: IntegrationCategory) {
  switch (category) {
    case "email":
      return Mail;
    case "calendar":
      return CalendarDays;
    case "crm":
      return MessageSquare;
    case "payments":
      return CreditCard;
    case "messaging":
      return MessageSquare;
    case "files":
      return FileText;
    case "automation":
      return Workflow;
  }
}
