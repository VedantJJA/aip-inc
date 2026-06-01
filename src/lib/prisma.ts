import { PrismaClient } from "@prisma/client";
import { PrismaBetterSqlite3 } from "@prisma/adapter-better-sqlite3";

// Pass the DATABASE_URL directly to the adapter — it handles the "file:" prefix internally
const adapter = new PrismaBetterSqlite3({ url: process.env.DATABASE_URL || "file:./prisma/dev.db" });

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

export const prisma =
  globalForPrisma.prisma ?? new PrismaClient({ adapter } as never);

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma;
}
