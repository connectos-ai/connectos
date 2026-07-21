import { describe, expect, it } from "vitest";
import {
  LocalDevelopmentVault,
  redactSecretValue,
  type SecretDescriptor
} from "./index";

describe("LocalDevelopmentVault", () => {
  const descriptor: SecretDescriptor = {
    tenantId: "tenant_1",
    provider: "gmail",
    name: "oauth_access_token"
  };

  it("writes and reads secrets through the vault interface", async () => {
    const vault = new LocalDevelopmentVault();

    await vault.writeSecret(descriptor, "gmail-token-value");

    await expect(vault.readSecret(descriptor)).resolves.toBe("gmail-token-value");
  });

  it("returns null for missing secrets", async () => {
    const vault = new LocalDevelopmentVault();

    await expect(vault.readSecret(descriptor)).resolves.toBeNull();
  });

  it("overwrites an existing secret for the same descriptor", async () => {
    const vault = new LocalDevelopmentVault();

    await vault.writeSecret(descriptor, "old-token");
    await vault.writeSecret(descriptor, "new-token");

    await expect(vault.readSecret(descriptor)).resolves.toBe("new-token");
  });

  it("does not expose raw secret values in metadata", async () => {
    const vault = new LocalDevelopmentVault();

    await vault.writeSecret(descriptor, "super-sensitive-token");

    const metadata = await vault.describeSecret(descriptor);

    expect(metadata).toMatchObject({
      exists: true,
      provider: "gmail",
      name: "oauth_access_token",
      redactedValue: "su*****************en"
    });
    expect(JSON.stringify(metadata)).not.toContain("super-sensitive-token");
  });
});

describe("redactSecretValue", () => {
  it("redacts long secret values", () => {
    expect(redactSecretValue("abcdef1234567890")).toBe("ab************90");
  });

  it("fully redacts short secret values", () => {
    expect(redactSecretValue("short")).toBe("*****");
  });
});
