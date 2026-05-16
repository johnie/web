import { defineConfig } from "drizzle-kit";
import { getEnv } from "@/lib/env";

const env = getEnv();

export default defineConfig({
  schema: "./src/lib/db/schema.ts",
  out: "./src/lib/db/migrations",
  dialect: "turso",
  dbCredentials: {
    url: env.TURSO_DATABASE_URL,
    authToken: env.TURSO_AUTH_TOKEN,
  },
});
