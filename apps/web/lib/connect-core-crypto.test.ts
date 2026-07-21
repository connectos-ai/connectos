import { afterEach, describe, expect, it, vi } from "vitest";

import {
  decryptTokenPayload,
  encryptTokenPayload,
  MissingEncryptionKeyError
} from "./connect-core-crypto";

describe("connect-core token encryption", () => {
  afterEach(() => {
    vi.unstubAllEnvs();
  });

  it("encrypts and decrypts token payloads without exposing plaintext", () => {
    vi.stubEnv("CONNECT_CORE_ENCRYPTION_KEY", "test-encryption-key");

    const tokenRef = encryptTokenPayload(
      { access_token: "access-token-secret", refresh_token: "refresh-token-secret" },
      "connect-core:test"
    );

    expect(tokenRef).toContain("connect-core-token:v1");
    expect(tokenRef).not.toContain("access-token-secret");
    expect(tokenRef).not.toContain("refresh-token-secret");
    expect(decryptTokenPayload(tokenRef, "connect-core:test")).toMatchObject({
      access_token: "access-token-secret",
      refresh_token: "refresh-token-secret"
    });
  });

  it("requires CONNECT_CORE_ENCRYPTION_KEY", () => {
    vi.unstubAllEnvs();

    expect(() => encryptTokenPayload({ access_token: "secret" }, "connect-core:test")).toThrow(
      MissingEncryptionKeyError
    );
  });

  it("binds encrypted payloads to context", () => {
    vi.stubEnv("CONNECT_CORE_ENCRYPTION_KEY", "test-encryption-key");

    const tokenRef = encryptTokenPayload({ access_token: "secret" }, "connect-core:one");

    expect(() => decryptTokenPayload(tokenRef, "connect-core:two")).toThrow();
  });
});
