import { describe, expect, it } from "vitest";
import { clientChannelRegistry } from "@connect-any-inbox/connector-registry";
import {
  connectorRoadmap,
  getConnectorRoadmap,
  listFirstDemoRoadmapItems,
  listRequiresApprovalRoadmapItems
} from "./index";

describe("connector roadmap", () => {
  it("has a roadmap stub for every client registry channel", () => {
    expect(Object.keys(connectorRoadmap).sort()).toEqual(
      clientChannelRegistry.map((channel) => channel.id).sort()
    );
  });

  it("marks only Gmail, Twilio, and Slack as first-demo implemented", () => {
    expect(listFirstDemoRoadmapItems().map((item) => item.channelId).sort()).toEqual([
      "gmail",
      "slack",
      "twilio"
    ]);
  });

  it("keeps high-risk browser fallback candidates approval gated", () => {
    expect(listRequiresApprovalRoadmapItems().map((item) => item.channelId).sort()).toEqual([
      "browser_scraped_tools",
      "forwarded_imessages",
      "linkedin",
      "rentredi"
    ]);
  });

  it("describes the next build step for planned business connectors", () => {
    expect(getConnectorRoadmap("hubspot")).toMatchObject({
      channelId: "hubspot",
      nextMilestone: "OAuth setup proof"
    });
    expect(getConnectorRoadmap("business_suite")).toMatchObject({
      channelId: "business_suite",
      nextMilestone: "Admin setup guide"
    });
  });
});
