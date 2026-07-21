import { describe, expect, it } from "vitest";
import { POST } from "./route";

describe("POST /api/sync/gmail", () => {
  it("returns conflict when Gmail is not connected", async () => {
    const response = await POST();

    await expect(response.json()).resolves.toMatchObject({
      error: { code: "GMAIL_NOT_CONNECTED" }
    });
    expect(response.status).toBe(409);
  });
});
