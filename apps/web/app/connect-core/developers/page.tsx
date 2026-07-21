import { connectorManifestExample } from "@connect-any-inbox/connect-core";

export const dynamic = "force-dynamic";

const manifestJson = JSON.stringify(connectorManifestExample, null, 2);

export default function ConnectCoreDevelopersPage() {
  return (
    <main className="connect-core-page developer-page">
      <section className="connect-core-header" aria-labelledby="developer-title">
        <div>
          <p className="eyebrow">ConnectOS Developers</p>
          <h1 id="developer-title">Build for ConnectOS</h1>
          <p className="connect-core-subtitle">
            Contributor guidance for connector manifests, Starter Kits, Capabilities, and
            provider-backed connection flows.
          </p>
        </div>
      </section>

      <section className="developer-grid" aria-label="Developer guides">
        <article className="developer-panel">
          <h2>Document a connector</h2>
          <ol>
            <li>Start with a connector manifest: ID, category, auth method, provider options, scopes, and Actions.</li>
            <li>Add catalog copy that explains the connector clearly for AI application builders and end users.</li>
            <li>Use mock support first; add Composio or direct OAuth only with explicit scope approval.</li>
            <li>Add tests for manifest validation and existing provider-adapter behavior.</li>
          </ol>
        </article>

        <article className="developer-panel">
          <h2>Document a Starter Kit</h2>
          <ol>
            <li>Choose a repeatable connection pattern for a common business category.</li>
            <li>List required and optional integrations.</li>
            <li>Write one plain-language reason why each integration matters.</li>
            <li>Set a setup order that applications can use for guided onboarding later.</li>
          </ol>
        </article>

        <article className="developer-panel">
          <h2>Document Capabilities</h2>
          <ol>
            <li>Describe what a connector can do before naming provider-specific behavior.</li>
            <li>Add Actions under each Capability and document the permissions each Action needs.</li>
            <li>Keep Capability names provider-neutral so AI applications can query what can be done.</li>
            <li>Test both registry output and API response shape.</li>
          </ol>
        </article>

        <article className="developer-panel">
          <h2>Provider options</h2>
          <dl>
            <div>
              <dt>direct-oauth</dt>
              <dd>Use when ConnectOS owns the OAuth app and encrypted token storage.</dd>
            </div>
            <div>
              <dt>composio</dt>
              <dd>Use when Composio manages connected accounts and provider credentials.</dd>
            </div>
            <div>
              <dt>mock</dt>
              <dd>Use for demos, local development, tests, and unconfigured environments.</dd>
            </div>
          </dl>
        </article>

        <article className="developer-panel manifest-panel">
          <h2>Manifest example</h2>
          <pre aria-label="Connector manifest JSON example">
            <code>{manifestJson}</code>
          </pre>
        </article>
      </section>
    </main>
  );
}
