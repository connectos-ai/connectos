import { PrismaClient } from "@prisma/client";

import { listIntegrations } from "@connect-any-inbox/connect-core";

import { PrismaConnectCoreRepository } from "../lib/prisma-connect-core-repository";

async function main() {
  if (!process.env.DATABASE_URL) {
    throw new Error("DATABASE_URL is required to seed ConnectOS integrations.");
  }

  const prisma = new PrismaClient();
  const repository = new PrismaConnectCoreRepository(prisma);
  const integrations = listIntegrations();

  await prisma.$connect();
  await repository.upsertIntegrations(integrations);
  await prisma.$disconnect();

  console.log(`Seeded ${integrations.length} ConnectOS integrations.`);
}

main().catch(async (error: unknown) => {
  console.error(error);
  process.exitCode = 1;
});
