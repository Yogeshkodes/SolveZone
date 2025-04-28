import { PrismaClient } from "../src/generated/prisma/index.js";

const globalForPrisma = globalThis;

export const db = globalForPrisma.prisma || new PrismaClient();

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = db;

console.log("Current NODE_ENV:", process.env.NODE_ENV);
