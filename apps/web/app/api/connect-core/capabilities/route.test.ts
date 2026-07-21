import { describe, expect, it } from "vitest";

import { GET } from "./route";

describe("GET /api/connect-core/capabilities", () => {
  it("returns connector capabilities", async () => {
    const response = await GET();
    const payload = (await response.json()) as {
      data: Array<{ connectorId: string; capabilities: Array<{ id: string }> }>;
    };

    expect(payload.data).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          connectorId: "gmail",
          capabilities: expect.arrayContaining([expect.objectContaining({ id: "read-email" })])
        })
      ])
    );
  });
});
