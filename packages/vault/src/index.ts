export interface SecretDescriptor {
  tenantId: string;
  provider: string;
  name: string;
}

export interface SecretMetadata extends SecretDescriptor {
  exists: boolean;
  redactedValue: string | null;
}

export interface Vault {
  writeSecret(descriptor: SecretDescriptor, value: string): Promise<void>;
  readSecret(descriptor: SecretDescriptor): Promise<string | null>;
  describeSecret(descriptor: SecretDescriptor): Promise<SecretMetadata>;
  deleteSecret(descriptor: SecretDescriptor): Promise<void>;
}

export class LocalDevelopmentVault implements Vault {
  private readonly secrets = new Map<string, string>();

  async writeSecret(descriptor: SecretDescriptor, value: string): Promise<void> {
    this.secrets.set(createSecretKey(descriptor), value);
  }

  async readSecret(descriptor: SecretDescriptor): Promise<string | null> {
    return this.secrets.get(createSecretKey(descriptor)) ?? null;
  }

  async describeSecret(descriptor: SecretDescriptor): Promise<SecretMetadata> {
    const value = await this.readSecret(descriptor);

    return {
      ...descriptor,
      exists: value !== null,
      redactedValue: value === null ? null : redactSecretValue(value)
    };
  }

  async deleteSecret(descriptor: SecretDescriptor): Promise<void> {
    this.secrets.delete(createSecretKey(descriptor));
  }
}

export function createSecretKey(descriptor: SecretDescriptor): string {
  return [
    normalizeSecretKeyPart(descriptor.tenantId),
    normalizeSecretKeyPart(descriptor.provider),
    normalizeSecretKeyPart(descriptor.name)
  ].join(":");
}

export function redactSecretValue(value: string): string {
  if (value.length <= 6) {
    return "*".repeat(value.length);
  }

  const visiblePrefix = value.slice(0, 2);
  const visibleSuffix = value.slice(-2);
  const hidden = "*".repeat(value.length - 4);

  return `${visiblePrefix}${hidden}${visibleSuffix}`;
}

function normalizeSecretKeyPart(value: string): string {
  return value.trim().toLowerCase();
}
