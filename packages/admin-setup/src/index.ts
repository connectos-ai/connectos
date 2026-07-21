import type { ChannelId } from "@connect-any-inbox/connector-registry";
import type { SecretDescriptor, Vault } from "@connect-any-inbox/vault";

export type AdminSetupStatus = "ready" | "planned" | "not_required";

export interface AdminSetupPlan {
  channelId: ChannelId;
  audience: "admin";
  purpose: "prepare_platform_credentials";
  status: AdminSetupStatus;
  steps: string[];
  requiredSecrets: Omit<SecretDescriptor, "tenantId">[];
}

export function getAdminSetupPlan(channelId: ChannelId): AdminSetupPlan {
  if (channelId === "gmail") {
    return {
      channelId,
      audience: "admin",
      purpose: "prepare_platform_credentials",
      status: "ready",
      steps: [
        "Create or select a Google Cloud project.",
        "Configure OAuth consent and Gmail API access.",
        "Create an OAuth client for the app callback URL.",
        "Store the Google client ID and client secret in the vault."
      ],
      requiredSecrets: [
        { provider: "gmail", name: "google_client_id" },
        { provider: "gmail", name: "google_client_secret" }
      ]
    };
  }

  if (channelId === "twilio") {
    return {
      channelId,
      audience: "admin",
      purpose: "prepare_platform_credentials",
      status: "ready",
      steps: [
        "Create or select a Twilio project.",
        "Choose the phone number that should receive messages.",
        "Add the app webhook URL to the Twilio phone number.",
        "Store the account SID and auth token in the vault."
      ],
      requiredSecrets: [
        { provider: "twilio", name: "twilio_account_sid" },
        { provider: "twilio", name: "twilio_auth_token" }
      ]
    };
  }

  if (["business_suite", "whatsapp", "quickbooks_notifications"].includes(channelId)) {
    return {
      channelId,
      audience: "admin",
      purpose: "prepare_platform_credentials",
      status: "planned",
      steps: [
        "Confirm the platform account and business permissions.",
        "Create or verify the developer app settings.",
        "Add the app callback or webhook URL.",
        "Store approved credentials in the vault."
      ],
      requiredSecrets: []
    };
  }

  return {
    channelId,
    audience: "admin",
    purpose: "prepare_platform_credentials",
    status: "not_required",
    steps: ["No admin setup guide is required for this channel yet."],
    requiredSecrets: []
  };
}

export function listAdminSecretDescriptors(
  tenantId: string,
  channelId: ChannelId
): SecretDescriptor[] {
  return getAdminSetupPlan(channelId).requiredSecrets.map((secret) => ({
    tenantId,
    ...secret
  }));
}

export async function storeAdminSetupSecret(
  vault: Vault,
  descriptor: SecretDescriptor,
  value: string
): Promise<void> {
  await vault.writeSecret(descriptor, value);
}
