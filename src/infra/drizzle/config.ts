import { defineConfig } from "drizzle-kit"
import * as dotenv from "dotenv"
dotenv.config()

export default defineConfig({
  dialect: "postgresql",
  schema:
    "/Users/sehyunpark/develop/project/spotify-back/src/infra/drizzle/schema.ts",
  out: "/Users/sehyunpark/develop/project/spotify-back/src/infra/drizzle/migration",
  dbCredentials: {
    url: process.env.DB_URL!,
  },
})
