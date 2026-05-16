import { z } from "zod";

const envSchema = z.object({
  TURSO_DATABASE_URL: z.url(),
  TURSO_AUTH_TOKEN: z.string().min(1),
  SPOTIFY_API_CLIENT_ID: z.string().min(1),
  SPOTIFY_API_CLIENT_SECRET: z.string().min(1),
  SPOTIFY_API_REFRESH_TOKEN: z.string().min(1),
});

export function getEnv() {
  return envSchema.parse(process.env);
}
