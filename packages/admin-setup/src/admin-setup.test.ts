import { describe, expect, it } from "vitest";
import { LocalDevelopmentVault } from "@connect-any-inbox/vault";
import {
  getAdminSetupPlan,
  listAdminSecretDescriptors,
  storeAdminSetupSecret
} from "./index";

describe("admin setup assistant", () => {
  it("distinguishes admin setup from end-user connection", () => {
    expect(getAdminSetupPlan("gmail")).toMatchObject({
      channelId: "gmail",
      audience: "admin",
      purpose: "prepare_platform_credentials"
    });
  });

  it("describes Gmail OAuth and Gmail API setup", () => {
    const plan = getAdminSetupPlan("gmail");

    expect(plan.steps).toContain("Create or select a Google Cloud project.");
    expect(plan.steps).toContain("Configure OAuth consent and Gmail API access.");
    expect(plan.requiredSecrets.map((secret) => secret.name)).toEqual([
      "google_client_id",
      "google_client_secret"
    ]);
  });

  it("describes Twilio account and webhook setup", () => {
    const plan = getAdminSetupPlan("twilio");

    expect(plan.steps).toContain("Add the app webhook URL to the Twilio phone number.");
    expect(plan.requiredSecrets.map((secret) => secret.name)).toEqual([
      "twilio_account_sid",
      "twilio_auth_token"
    ]);
  });

  it("represents planned setup guides for Meta, WhatsApp, and QuickBooks", () => {
    expect(getAdminSetupPlan("business_suite").status).toBe("planned");
    expect(getAdminSetupPlan("whatsapp").status).toBe("planned");
    expect(getAdminSetupPlan("quickbooks_notifications").status).toBe("planned");
  });

  it("routes setup secrets through the vault boundary", async () => {
    const vault = new LocalDevelopmentVault();
    const [descriptor] = listAdminSecretDescriptors("tenant_1", "gmail");

    await storeAdminSetupSecret(vault, descriptor, "client-id");

    await expect(vault.readSecret(descriptor)).resolves.toBe("client-id");
  });
});
