import { describe, expect, it } from "vitest";
import { NextRequest } from "next/server";

import { GET } from "./route";

describe("GET /api/connect-core/universal-actions", () => {
 it("returns universal actions with available provider slots", async () => {
  const response = await GET(new NextRequest("http://localhost/api/connect-core/universal-actions"));
  const payload = (await response.json()) as {
   data: Array<{
    id: string;
    connectors: Array<{ connectorId: string; connectorActionId: string }>;
    availableProviders: Array<{ connectorId: string; connectionId: string }>;
   }>;
  };

  expect(payload.data).toEqual(
   expect.arrayContaining([
    expect.objectContaining({
     id: "send_message",
     connectors: expect.arrayContaining([
      expect.objectContaining({ connectorId: "slack", connectorActionId: "slack.send-message" }),
      expect.objectContaining({ connectorId: "gmail", connectorActionId: "gmail.send-message" })
     ]),
     availableProviders: expect.any(Array)
    })
   ])
 );
 });

 it("filters to one universal action for resolver-style queries", async () => {
  const response = await GET(
   new NextRequest("http://localhost/api/connect-core/universal-actions?action=send_message")
  );
  const payload = (await response.json()) as { data: Array<{ id: string }> };

  expect(payload.data.map((action) => action.id)).toEqual(["send_message"]);
 });
});
