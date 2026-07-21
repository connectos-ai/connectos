import { describe, expect, it } from "vitest";
import {
  browserAutomationStrategy,
  clientChannelRegistry,
  getChannel,
  listFirstDemoChannels,
  listHighCautionChannels
} from "./index";

describe("clientChannelRegistry", () => {
  it("includes every client-requested channel plus HubSpot and Slack", () => {
    const ids = clientChannelRegistry.map((channel) => channel.id);

    expect(ids).toEqual([
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

  it("marks only Gmail, Twilio, and Slack as first-demo channels", () => {
    expect(listFirstDemoChannels().map((channel) => channel.id)).toEqual([
      "gmail",
      "twilio",
      "slack"
    ]);
  });

  it("uses API/OAuth/webhook-first strategies for clean channels", () => {
    expect(getChannel("gmail")?.strategyRank[0]).toBe("oauth");
    expect(getChannel("twilio")?.strategyRank[0]).toBe("webhook");
    expect(getChannel("quickbooks_notifications")?.strategyRank.slice(0, 2)).toEqual([
      "oauth",
      "webhook"
    ]);
    expect(getChannel("custom_webhooks")?.strategyRank[0]).toBe("webhook");
  });

  it("treats Slack as a sync destination", () => {
    const slack = getChannel("slack");

    expect(slack?.direction).toBe("destination");
    expect(slack?.mvpStatus).toBe("first_demo");
  });

  it("keeps browser automation as a last-resort strategy", () => {
    for (const channel of clientChannelRegistry) {
      const automationIndex = channel.strategyRank.indexOf(browserAutomationStrategy);

      if (automationIndex >= 0) {
        expect(automationIndex).toBe(channel.strategyRank.length - 1);
      }
    }
  });

  it("surfaces high-caution guidance for iMessage, RentRedi, LinkedIn, and scraped tools", () => {
    expect(listHighCautionChannels().map((channel) => channel.id)).toEqual([
      "forwarded_imessages",
      "rentredi",
      "linkedin",
      "browser_scraped_tools"
    ]);

    for (const id of [
      "forwarded_imessages",
      "rentredi",
      "linkedin",
      "browser_scraped_tools"
    ] as const) {
      const channel = getChannel(id);
      expect(channel?.riskLevel).toBe("high");
      expect(channel?.fallbackGuidance).toContain("explicit approval");
    }
  });
});
