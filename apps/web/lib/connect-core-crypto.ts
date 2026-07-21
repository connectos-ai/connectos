import { createCipheriv, createDecipheriv, createHash, randomBytes } from "node:crypto";

const tokenPrefix = "connect-core-token:v1";

export class MissingEncryptionKeyError extends Error {
  constructor() {
    super("CONNECT_CORE_ENCRYPTION_KEY is required for secure token storage.");
  }
}

export function hasConnectCoreEncryptionKey(env: NodeJS.ProcessEnv = process.env): boolean {
  return Boolean(env.CONNECT_CORE_ENCRYPTION_KEY);
}

export function encryptTokenPayload(payload: unknown, context: string): string {
  const iv = randomBytes(12);
  const cipher = createCipheriv("aes-256-gcm", encryptionKey(), iv);
  cipher.setAAD(Buffer.from(context, "utf8"));
  const ciphertext = Buffer.concat([
    cipher.update(JSON.stringify(payload), "utf8"),
    cipher.final()
  ]);
  const tag = cipher.getAuthTag();

  return `${tokenPrefix}:${Buffer.concat([iv, tag, ciphertext]).toString("base64url")}`;
}

export function decryptTokenPayload<T>(tokenRef: string, context: string): T {
  if (!tokenRef.startsWith(`${tokenPrefix}:`)) {
    throw new Error("Invalid encrypted token reference.");
  }

  const packed = Buffer.from(tokenRef.slice(tokenPrefix.length + 1), "base64url");
  const iv = packed.subarray(0, 12);
  const tag = packed.subarray(12, 28);
  const ciphertext = packed.subarray(28);
  const decipher = createDecipheriv("aes-256-gcm", encryptionKey(), iv);
  decipher.setAAD(Buffer.from(context, "utf8"));
  decipher.setAuthTag(tag);
  const plaintext = Buffer.concat([decipher.update(ciphertext), decipher.final()]).toString(
    "utf8"
  );

  return JSON.parse(plaintext) as T;
}

function encryptionKey(): Buffer {
  const raw = process.env.CONNECT_CORE_ENCRYPTION_KEY;
  if (!raw) {
    throw new MissingEncryptionKeyError();
  }

  if (/^[a-f0-9]{64}$/i.test(raw)) {
    return Buffer.from(raw, "hex");
  }

  const base64 = Buffer.from(raw, "base64");
  if (base64.length === 32) {
    return base64;
  }

  return createHash("sha256").update(raw).digest();
}
