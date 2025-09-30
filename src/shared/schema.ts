import { z } from "zod";

export const JsonRpcRequestSchema = z.object({
  jsonrpc: z.literal("2.0"),
  method: z.string(),
  params: z.unknown(),
  id: z.union([z.string(), z.number()]),
});