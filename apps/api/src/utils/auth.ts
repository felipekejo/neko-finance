import { env } from "@/env";
import { betterAuth } from "better-auth";
import { Pool } from "pg";

const pool = new Pool({
  connectionString: env.DATABASE_URL,
});

export const auth = betterAuth({
  baseURL: "http://localhost:3333",
  basePath: "/auth",
  database: pool,
  emailAndPassword: {
    enabled: true,
  },
  logger: {
    level: "debug",
  },
  trustedOrigins: [
    process.env.CLIENT_ORIGIN ?? "http://localhost:3333",
  ],
})