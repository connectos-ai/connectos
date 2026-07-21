import { createHmac, randomBytes, timingSafeEqual } from "node:crypto";
import type { ConnectionMetadata } from "@connect-any-inbox/connect-core";

const oauthStateTtlMs = 10 * 60 * 1000;

export interface SignedOAuthState {
  connectionId: string;
  integrationId: string;
  userId: string;
  nonce: string;
  issuedAt: number;
  expiresAt: number;
}

export function createSignedOAuthState(
  input: Pick<SignedOAuthState, "connectionId" | "integrationId" | "userId">,
  secret: string,
  now = Date.now()
): { state: string; metadata: ConnectionMetadata } {
  const payload: SignedOAuthState = {
    ...input,
    nonce: randomBytes(16).toString("base64url"),
    issuedAt: now,
    expiresAt: now + oauthStateTtlMs
  };
  const state = signPayload(payload, secret);

  return {
    state,
    metadata: {
      oauthStateNonce: payload.nonce,
      oauthStateExpiresAt: new Date(payload.expiresAt).toISOString()
    }
  };
}

export function resolveSignedOAuthState(
  state: string,
  secret: string,
  now = Date.now()
): SignedOAuthState {
  const [encodedPayload, signature] = state.split(".");
  if (!encodedPayload || !signature) {
    throw new Error("Invalid OAuth state.");
  }

  const expected = createHmac("sha256", secret).update(encodedPayload).digest("base64url");
  if (!safeEqual(signature, expected)) {
    throw new Error("Invalid OAuth state.");
  }

  const payload = JSON.parse(
    Buffer.from(encodedPayload, "base64url").toString("utf8")
  ) as SignedOAuthState;
  if (payload.expiresAt <= now) {
    throw new Error("OAuth state expired.");
  }

  return payload;
}

export function assertFreshOAuthState(
  state: SignedOAuthState,
  metadata: ConnectionMetadata | undefined,
  expected: Pick<SignedOAuthState, "connectionId" | "integrationId" | "userId">,
  now = Date.now()
) {
  if (
    state.connectionId !== expected.connectionId ||
    state.integrationId !== expected.integrationId ||
    state.userId !== expected.userId
  ) {
    throw new Error("Invalid OAuth state.");
  }

  if (state.expiresAt <= now) {
    throw new Error("OAuth state expired.");
  }

  if (metadata?.oauthStateNonce !== state.nonce) {
    throw new Error("OAuth state was already used or was not started by this connection.");
  }

  const storedExpiry = metadata.oauthStateExpiresAt;
  if (typeof storedExpiry !== "string" || new Date(storedExpiry).getTime() <= now) {
    throw new Error("OAuth state expired.");
  }
}

export function clearOAuthStateMetadata(metadata: ConnectionMetadata | undefined): ConnectionMetadata {
  return {
    ...(metadata ?? {}),
    oauthStateNonce: null,
    oauthStateExpiresAt: null
  };
}

function signPayload(payload: SignedOAuthState, secret: string): string {
  const encodedPayload = Buffer.from(JSON.stringify(payload)).toString("base64url");
  const signature = createHmac("sha256", secret).update(encodedPayload).digest("base64url");
  return `${encodedPayload}.${signature}`;
}

function safeEqual(value: string, expected: string): boolean {
  const valueBuffer = Buffer.from(value);
  const expectedBuffer = Buffer.from(expected);
  return valueBuffer.length === expectedBuffer.length && timingSafeEqual(valueBuffer, expectedBuffer);
}
