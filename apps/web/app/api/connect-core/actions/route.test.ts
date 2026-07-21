import { describe, expect, it } from "vitest";

import { GET } from "./route";

describe("GET /api/connect-core/actions", () => {
  it("returns flattened connector actions", async () => {
    const response = await GET();
    const payload = (await response.json()) as {
      data: Array<{ connectorId: string; capabilityId: string; id: string; permissions: string[] }>;
    };

    expect(payload.data).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          connectorId: "slack",
          capabilityId: "send-messages",
          id: "slack.send-message",
          permissions: ["chat.write"]
        })
      ])
    );
  });
});
