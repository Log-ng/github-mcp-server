import { z } from "zod";

export const GetFileContentParamsSchema = z.object({
  owner: z.string().min(1),
  repo: z.string().min(1),
  path: z.string().min(1),
  ref: z.string().optional(),
});

export const CreateOrUpdateFileParamsSchema = z.object({
  owner: z.string().min(1),
  repo: z.string().min(1),
  path: z.string().min(1),
  message: z.string().min(1),
  content: z.string(),
  branch: z.string().optional(),
  sha: z.string().optional(),
});
