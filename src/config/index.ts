import dotenv from "dotenv";
import { z } from "zod";

dotenv.config();

const ConfigSchema = z.object({
  GITHUB_TOKEN: z.string().min(1, "GITHUB_TOKEN is required"),
  NODE_ENV: z.enum(["development", "production", "test"]).default("development"),
  LOG_LEVEL: z.enum(["error", "warn", "info", "debug"]).default("info"),
  RATE_LIMIT_MAX_REQUESTS: z.number().min(1).default(100),
  RATE_LIMIT_WINDOW_MS: z.number().min(1000).default(60000),
  MAX_RETRIES: z.number().min(0).max(10).default(3),
  RETRY_DELAY_MS: z.number().min(100).default(1000),
});

const parseConfig = () => {
  try {
    return ConfigSchema.parse({
      GITHUB_TOKEN: process.env.GITHUB_TOKEN,
      NODE_ENV: process.env.NODE_ENV,
      LOG_LEVEL: process.env.LOG_LEVEL,
      RATE_LIMIT_MAX_REQUESTS: process.env.RATE_LIMIT_MAX_REQUESTS 
        ? parseInt(process.env.RATE_LIMIT_MAX_REQUESTS, 10) 
        : undefined,
      RATE_LIMIT_WINDOW_MS: process.env.RATE_LIMIT_WINDOW_MS 
        ? parseInt(process.env.RATE_LIMIT_WINDOW_MS, 10) 
        : undefined,
      MAX_RETRIES: process.env.MAX_RETRIES 
        ? parseInt(process.env.MAX_RETRIES, 10) 
        : undefined,
      RETRY_DELAY_MS: process.env.RETRY_DELAY_MS 
        ? parseInt(process.env.RETRY_DELAY_MS, 10) 
        : undefined,
    });
  } catch (error) {
    console.error("Configuration validation failed:", error);
    process.exit(1);
  }
};

export const config = parseConfig();

export const serverConfig = {
  name: "github-mcp-server",
  version: "1.0.0",
  capabilities: {
    tools: {},
  },
} as const;

export const githubConfig = {
  auth: config.GITHUB_TOKEN,
  userAgent: `${serverConfig.name}/${serverConfig.version}`,
  timeout: 30000,
  retries: config.MAX_RETRIES,
} as const;

export const rateLimitConfig = {
  maxRequests: config.RATE_LIMIT_MAX_REQUESTS,
  windowMs: config.RATE_LIMIT_WINDOW_MS,
} as const;

export const retryConfig = {
  maxRetries: config.MAX_RETRIES,
  delayMs: config.RETRY_DELAY_MS,
} as const;
