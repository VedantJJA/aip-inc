import { PrismaClient } from "@prisma/client";
import { PrismaBetterSqlite3 } from "@prisma/adapter-better-sqlite3";
import path from "path";

// Resolve the DB path — strip the "file:" prefix if present and make it absolute
const rawUrl = process.env.DATABASE_URL || "file:./prisma/dev.db";
const dbPath = rawUrl.startsWith("file:")
  ? rawUrl.slice(5) // remove "file:" prefix
  : rawUrl;

// Resolve relative paths against the project root (process.cwd())
const resolvedPath = path.isAbsolute(dbPath)
  ? dbPath
  : path.resolve(process.cwd(), dbPath);

const adapter = new PrismaBetterSqlite3({ url: resolvedPath });

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

export const prisma =
  globalForPrisma.prisma ?? new PrismaClient({ adapter } as never);

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma;
}
