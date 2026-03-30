import { PrismaClient } from "../../generated/prisma/client.js";

import { env } from "./env.js";

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({ accelerateUrl: env.DATABASE_URL });

if (env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma;
}
