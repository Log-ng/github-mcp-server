import { z } from "zod";

export const CompareBranchesParamsSchema = z.object({
  owner: z.string().min(1),
  repo: z.string().min(1),
  base: z.string().min(1),
  head: z.string().min(1),
});

export const MergeBranchesParamsSchema = z.object({
  owner: z.string().min(1),
  repo: z.string().min(1),
  base: z.string().min(1),
  head: z.string().min(1),
  commit_message: z.string().optional(),
});