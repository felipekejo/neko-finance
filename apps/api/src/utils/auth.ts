import { env } from "@/env";
import { betterAuth } from "better-auth";
import { Pool } from "pg";

const pool = new Pool({
  connectionString: env.DATABASE_URL,
});

export const auth = betterAuth({
  baseURL: env.BETTER_AUTH_URL,
  basePath: "/auth",
  database: pool,
  emailAndPassword: {
    enabled: true,
  },
  logger: {
    level: env.NODE_ENV === 'prod' ? 'error' : 'warn',
  },
  trustedOrigins: [env.CLIENT_ORIGIN],
})
