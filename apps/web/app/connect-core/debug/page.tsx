import React from "react";
import { getConnectCoreDebugInfo } from "../../../lib/connect-core-service";
import { notFound } from "next/navigation";

export const dynamic = "force-dynamic";

export default async function ConnectCoreDebugPage() {
  if (process.env.NODE_ENV === "production") {
    notFound();
  }

  const debug = await getConnectCoreDebugInfo();

  return (
    <main className="connect-core-page debug-page">
      <section className="connect-core-header" aria-labelledby="debug-title">
        <div>
          <p className="eyebrow">ConnectOS Debug</p>
          <h1 id="debug-title">Local provider verification</h1>
          <p className="connect-core-subtitle">
            Local-only status for OAuth and Composio setup. Tokens, token references, and secrets are never displayed here.
          </p>
        </div>
        <div className="health-summary" aria-label="Provider configuration status">
          <span>Providers</span>
          <strong>
            {debug.googleConfigured || debug.slackConfigured || debug.composioConfigured
              ? "Partial"
              : "No"}
          </strong>
        </div>
      </section>

      {debug.isProduction ? (
        <section className="debug-warning" role="alert">
          Local verification only. This page is blocked in production and must not be
          exposed from a public deployment.
        </section>
      ) : null}

      <section className="debug-panel" aria-labelledby="debug-config">
        <h2 id="debug-config">Configuration</h2>
        <dl className="debug-definition-list">
          <div>
            <dt>Google env configured</dt>
            <dd>{debug.googleConfigured ? "Yes" : "No"}</dd>
          </div>
          <div>
            <dt>Google redirect URI</dt>
            <dd>{debug.googleRedirectUri ?? "Not set"}</dd>
          </div>
          <div>
            <dt>Slack env configured</dt>
            <dd>{debug.slackConfigured ? "Yes" : "No"}</dd>
          </div>
          <div>
            <dt>Slack redirect URI</dt>
            <dd>{debug.slackRedirectUri ?? "Not set"}</dd>
          </div>
          <div>
            <dt>Composio env configured</dt>
            <dd>{debug.composioConfigured ? "Yes" : "No"}</dd>
          </div>
          <div>
            <dt>Composio base URL</dt>
            <dd>{debug.composioBaseUrl ?? "Default"}</dd>
          </div>
          <div>
            <dt>Secret and token visibility</dt>
            <dd>Never displayed on this page</dd>
          </div>
        </dl>
      </section>

      <section className="debug-panel" aria-labelledby="debug-composio">
        <h2 id="debug-composio">Composio mappings</h2>
        <dl className="debug-definition-list">
          {debug.composioMappings.map((mapping) => (
            <div key={mapping.integrationId}>
              <dt>{mapping.name}</dt>
              <dd>
                {mapping.toolkitSlug}
                {mapping.authConfigId ? ` / ${mapping.authConfigId}` : ""}
              </dd>
            </div>
          ))}
        </dl>
      </section>

      <section className="debug-grid" aria-label="Integration provider status">
        {debug.oauthIntegrations.map((integration) => (
          <article className="debug-card" key={integration.id}>
            <div>
              <h2>{integration.name}</h2>
              <p>{integration.providerStatus}</p>
            </div>
            <dl className="debug-definition-list compact">
              <div>
                <dt>Provider mode</dt>
                <dd>{integration.providerMode}</dd>
              </div>
              <div>
                <dt>Connection</dt>
                <dd>{integration.connectionStatus}</dd>
              </div>
              <div>
                <dt>Health</dt>
                <dd>{integration.connectionHealth ?? "None"}</dd>
              </div>
              <div>
                <dt>Last event</dt>
                <dd>
                  {integration.lastConnectionEvent
                    ? `${integration.lastConnectionEvent.type} at ${integration.lastConnectionEvent.occurredAt}`
                    : "None"}
                </dd>
              </div>
              <div>
                <dt>Last health check</dt>
                <dd>
                  {integration.lastHealthCheck
                    ? `${integration.lastHealthCheck.health}: ${integration.lastHealthCheck.message}`
                    : "None"}
                </dd>
              </div>
            </dl>
          </article>
        ))}
      </section>
    </main>
  );
}
