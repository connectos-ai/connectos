import { NextRequest } from "next/server";
import { describe, expect, it } from "vitest";

import { GET } from "./route";

describe("GET /api/connect-core/skills", () => {
 it("returns AI skills with action mappings and available provider slots", async () => {
  const response = await GET(new NextRequest("http://localhost/api/connect-core/skills"));
  const payload = (await response.json()) as {
   data: Array<{
    id: string;
    actions: Array<{ universalActionId: string }>;
    availableProviders: unknown[];
   }>;
  };

  expect(payload.data).toEqual(
   expect.arrayContaining([
    expect.objectContaining({
     id: "notify_team",
     actions: [expect.objectContaining({ universalActionId: "send_message" })],
     availableProviders: expect.any(Array)
    }),
    expect.objectContaining({
     id: "schedule_meeting",
     actions: [expect.objectContaining({ universalActionId: "create_calendar_event" })]
    })
   ])
  );
 });

 it("filters to one skill for discovery-style queries", async () => {
  const response = await GET(new NextRequest("http://localhost/api/connect-core/skills?skill=notify_team"));
  const payload = (await response.json()) as { data: Array<{ id: string }> };

  expect(payload.data.map((skill) => skill.id)).toEqual(["notify_team"]);
 });
});
