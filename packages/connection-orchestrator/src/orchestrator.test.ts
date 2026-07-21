import { describe, expect, it } from "vitest";
import { InMemoryAuditLog } from "@connect-any-inbox/audit-log";
import { connectChannel, connectChannelWithAudit } from "./index";

describe("connectChannel", () => {
  it("returns an OAuth start action for Gmail", () => {
    expect(connectChannel("gmail")).toMatchObject({
      channelId: "gmail",
      strategy: "oauth",
      status: "ready",
      action: "start_oauth"
    });
  });

  it("returns webhook setup for Twilio", () => {
    expect(connectChannel("twilio")).toMatchObject({
      channelId: "twilio",
      strategy: "webhook",
      status: "needs_setup",
      action: "show_webhook_setup"
    });
  });

  it("returns an OAuth start action for Slack", () => {
    expect(connectChannel("slack")).toMatchObject({
      channelId: "slack",
      strategy: "oauth",
      status: "ready",
      action: "start_oauth"
    });
  });

  it("returns native webhook setup for custom webhooks", () => {
    expect(connectChannel("custom_webhooks")).toMatchObject({
      channelId: "custom_webhooks",
      strategy: "webhook",
      status: "needs_setup",
      action: "show_webhook_setup"
    });
  });

  it("returns forwarding setup for forwarded iMessages before any bridge fallback", () => {
    expect(connectChannel("forwarded_imessages")).toMatchObject({
      channelId: "forwarded_imessages",
      strategy: "forwarded_inbox",
      status: "needs_setup",
      action: "show_forwarding_setup"
    });
  });

  it("gates high-risk advisory channels before fallback providers can run", () => {
    expect(connectChannel("rentredi")).toMatchObject({
      channelId: "rentredi",
      status: "needs_approval",
      action: "request_approval"
    });
    expect(connectChannel("linkedin")).toMatchObject({
      channelId: "linkedin",
      status: "needs_approval",
      action: "request_approval"
    });
  });

  it("allows high-risk channels to show provider options after approval", () => {
    expect(connectChannel("rentredi", { approvedRisk: true })).toMatchObject({
      channelId: "rentredi",
      strategy: "partner_provider",
      status: "needs_setup",
      action: "show_provider_option"
    });
  });
it("records connection decisions to audit log", () => {
const auditLog = new InMemoryAuditLog();
const decision = connectChannelWithAudit("gmail", {
audit: {
actorId: "user_1",
log: auditLog,
requestId: "req_1",
tenantId: "tenant_1"
}
});

expect(decision).toMatchObject({ channelId: "gmail", status: "ready" });
expect(auditLog.list({ eventName: "connection.decided" })).toEqual([
expect.objectContaining({
actorId: "user_1",
metadata: expect.objectContaining({
action: "start_oauth",
channelId: "gmail",
status: "ready",
strategy: "oauth"
}),
tenantId: "tenant_1"
})
]);
});
});
