import React from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";
import { channels } from "@connect-any-inbox/shared";
import { ConnectChannels, getChannelAction } from "./ConnectChannels";

describe("ConnectChannels", () => {
  it("renders the client channel registry", () => {
    const html = renderToStaticMarkup(<ConnectChannels />);

    expect(html).toContain("Gmail / email");
    expect(html).toContain("RentRedi");
    expect(html).toContain("WhatsApp Business");
    expect(html).toContain("Browser-scraped tools");
  });

  it("exposes actions for the first-demo channels", () => {
expect(getChannelAction(requiredChannel("gmail"))).toMatchObject({
href: "/api/connect/gmail/start",
label: "Connect Gmail",
disabled: false
});
    expect(getChannelAction(requiredChannel("twilio"))).toMatchObject({
      label: "Configure Twilio",
      disabled: false
    });
    expect(getChannelAction(requiredChannel("slack"))).toMatchObject({
      label: "Connect Slack",
      disabled: false
    });
});

it("renders Gmail connect action as a link when setup is ready", () => {
const html = renderToStaticMarkup(<ConnectChannels gmailSetupReady />);

expect(html).toContain('href="/api/connect/gmail/start"');
});

it("gates Gmail connect action when admin setup is missing", () => {
const html = renderToStaticMarkup(<ConnectChannels gmailSetupReady={false} />);

expect(getChannelAction(requiredChannel("gmail"), { gmailSetupReady: false })).toMatchObject({
disabled: true,
label: "Needs admin setup"
});
expect(html).toContain("Needs admin setup");
expect(html).not.toContain('href="/api/connect/gmail/start"');
});

it("keeps advisory channels gated", () => {
    expect(getChannelAction(requiredChannel("linkedin"))).toMatchObject({
      label: "Needs approval",
      disabled: true
    });
  });
});

function requiredChannel(id: (typeof channels)[number]["id"]) {
  const channel = channels.find((item) => item.id === id);

  if (!channel) {
    throw new Error(`Missing channel ${id}`);
  }

  return channel;
}
