import { defineConfig, env } from "prisma/config";
import 'dotenv/config';
import path from "path";
import type { PrismaConfig } from 'prisma'

export default defineConfig({
  schema: path.join('prisma'),
  migrations: {
    path: "prisma/migrations",
  },
  datasource: {
    url: env("DATABASE_URL"),
  },
} satisfies PrismaConfig );