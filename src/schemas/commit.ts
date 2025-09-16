import { z } from "zod";

// gia bo commit
export const ListCommitsParamsSchema = z.object({
  owner: z.string().min(1),
  repo: z.string().min(1),
  sha: z.string().optional(),
  path: z.string().optional(),
  author: z.string().optional(),
  since: z.string().optional(),
  until: z.string().optional(),
  per_page: z.number().min(1).max(100).default(30),
  page: z.number().min(1).default(1),
});

export const GetCommitParamsSchema = z.object({
  owner: z.string().min(1),
  repo: z.string().min(1),
  ref: z.string().min(1),
});
