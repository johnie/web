import { createClient } from "@libsql/client";
import { drizzle } from "drizzle-orm/libsql";
import { spotify, views } from "@/lib/db/schema";
import { getEnv } from "@/lib/env";

export function getDb() {
  const env = getEnv();
  const client = createClient({
    url: env.TURSO_DATABASE_URL,
    authToken: env.TURSO_AUTH_TOKEN,
  });

  return drizzle({ client, schema: { views, spotify } });
}
