import React from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";

import { getConnectCoreDashboard } from "../../lib/connect-core-service";
import { ConnectCoreCatalog } from "./ConnectCoreCatalog";

describe("ConnectCoreCatalog", () => {
  it("renders integration browser with expected actions", async () => {
    const items = await getConnectCoreDashboard();
    const html = renderToStaticMarkup(<ConnectCoreCatalog initialItems={items} />);

    expect(html).toContain("ConnectOS");
    expect(html).toContain("Explore ConnectOS integrations");
    expect(html).toContain(
      "Neutral infrastructure for AI applications to connect through Providers, Capabilities, Actions, and Skills."
    );
    expect(html).toContain("Gmail");
    expect(html).toContain("Google Calendar");
    expect(html).toContain("Starter kits");
    expect(html).toContain("Choose a setup guide");
    expect(html).toContain("What your connected AI can resolve now");
    expect(html).toContain("What your connected AI can help with");
    expect(html).toContain("Connect a tool to preview safe dry-run Skills for an AI application.");
    expect(html).toContain("Connect a tool to preview safe dry-run Actions for an AI application.");
    expect(html).toContain("Church");
    expect(html).toContain("Connect all recommended");
    expect(html).toContain("Capabilities");
    expect(html).toContain("Read Email");
    expect(html).toContain("Send Email");
    expect(html).toContain("Connect");
    expect(html).toContain('aria-pressed="true"');
    expect(html).toContain('aria-label="Integration results"');
    expect(html).not.toContain('role="tablist"');
    expect(html).not.toContain('role="tab"');
  });
});
