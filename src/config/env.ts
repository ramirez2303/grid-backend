import "dotenv/config";

interface EnvConfig {
  PORT: number;
  DATABASE_URL: string;
  NEWS_API_KEY: string;
  SYNC_API_KEY: string;
  NODE_ENV: string;
}

function requireEnv(key: string): string {
  const value = process.env[key];
  if (!value) {
    throw new Error(`Missing required environment variable: ${key}`);
  }
  return value;
}

export const env: EnvConfig = {
  PORT: Number(process.env["PORT"] ?? 3001),
  DATABASE_URL: requireEnv("DATABASE_URL"),
  NEWS_API_KEY: process.env["NEWS_API_KEY"] ?? "",
  SYNC_API_KEY: process.env["SYNC_API_KEY"] ?? "grid-sync-dev-key",
  NODE_ENV: process.env["NODE_ENV"] ?? "development",
};
