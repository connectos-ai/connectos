import { describe, expect, it } from "vitest";
import { InMemoryAuditLog } from "@connect-any-inbox/audit-log";
import {
  fallbackProviders,
  listFallbackProviderOptions,
  prepareFallbackRun
} from "./index";

describe("fallbackProviders", () => {
  it("defines OpenCLI, Deck, Playwright, and n8n", () => {
    expect(fallbackProviders.map((provider) => provider.id)).toEqual([
      "opencli",
      "deck",
      "playwright",
      "n8n"
    ]);
  });

  it("lists provider options for RentRedi and LinkedIn without executing them", () => {
    expect(listFallbackProviderOptions("rentredi").map((provider) => provider.id)).toEqual([
      "opencli",
      "deck",
      "playwright",
      "n8n"
    ]);
    expect(listFallbackProviderOptions("linkedin").map((provider) => provider.id)).toContain(
      "opencli"
    );
  });

  it("blocks fallback runs without approval", () => {
    expect(prepareFallbackRun("rentredi", "opencli")).toMatchObject({
      status: "blocked",
      requiresApproval: true
    });
  });

  it("prepares but does not execute approved fallback runs", () => {
    expect(prepareFallbackRun("rentredi", "opencli", { approvedRisk: true })).toMatchObject({
      providerId: "opencli",
      channelId: "rentredi",
      status: "ready",
      requiresApproval: true
    });
  });

  it("does not offer fallback providers low-risk API-first channels", () => {
    expect(listFallbackProviderOptions("gmail")).toEqual([]);
  });

  it("records fallback preparation to audit log", () => {
    const auditLog = new InMemoryAuditLog();
    const request = prepareFallbackRun("rentredi", "playwright", {
      audit: {
        actorId: "user_1",
        log: auditLog,
        requestId: "req_1",
        tenantId: "tenant_1"
      }
    });

    expect(request.status).toBe("blocked");
    expect(auditLog.list({ eventName: "fallback.prepared" })).toEqual([
      expect.objectContaining({
        metadata: expect.objectContaining({
          channelId: "rentredi",
          providerId: "playwright",
          status: "blocked"
        })
      })
    ]);
  });
});
