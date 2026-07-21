import { describe, expect, it } from "vitest";
import { channels } from "./index";

describe("channels", () => {
  it("keeps Gmail and Twilio as MVP connectors", () => {
    const demoChannels = channels
      .filter((channel) => channel.status === "demo")
      .map((channel) => channel.id);

    expect(demoChannels).toEqual(["gmail", "twilio"]);
  });

  it("keeps Slack as a sync destination", () => {
    const slack = channels.find((channel) => channel.id === "slack");

    expect(slack?.status).toBe("destination");
  });

  it("exposes the full client channel list to the app layer", () => {
    expect(channels.map((channel) => channel.id)).toEqual([
      "gmail",
      "twilio",
      "slack",
      "forwarded_imessages",
      "voicemail_transcripts",
      "phone_call_summaries",
      "rentredi",
      "quickbooks_notifications",
      "facebook",
      "instagram",
      "messenger",
      "whatsapp",
      "linkedin",
      "business_suite",
      "web_forms",
      "custom_webhooks",
      "browser_scraped_tools",
      "hubspot"
    ]);
  });
});
