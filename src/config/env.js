import { z } from "zod";
import dotenv from "dotenv";

dotenv.config();

const EnvSchema = z.object({
  NODE_ENV: z.enum(["development", "test", "production"]).default("development"),
  PORT: z.coerce.number().default(3000),
  APP_URL: z.string().url(),
  DATABASE_URL: z.string().min(1),
  JWT_ACCESS_SECRET: z.string().min(32),
  JWT_REFRESH_SECRET: z.string().min(32),
  JWT_ACCESS_TTL: z.string().min(2),
  JWT_REFRESH_TTL: z.string().min(2),
  REFRESH_TOKEN_COOKIE_NAME: z.string().min(1),
  COOKIE_DOMAIN: z.string().optional(),
  S3_ENDPOINT: z.string().min(1),
  S3_REGION: z.string().min(1),
  S3_ACCESS_KEY_ID: z.string().min(1),
  S3_SECRET_ACCESS_KEY: z.string().min(1),
  S3_BUCKET: z.string().min(1),
  S3_FORCE_PATH_STYLE: z.string().default("true"),
  S3_PUBLIC_URL: z.string().optional(),
  UPLOAD_MAX_BYTES: z.coerce.number().default(10485760),
});

export const env = EnvSchema.parse(process.env);
