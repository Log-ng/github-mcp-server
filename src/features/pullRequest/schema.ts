import { z } from "zod";

export const CreatePullRequestParamsSchema = z.object({
  owner: z.string().min(1),
  repo: z.string().min(1),
  title: z.string().min(1),
  head: z.string().min(1),
  base: z.string().min(1),
  body: z.string().optional(),
  draft: z.boolean().default(false),
});

export const ListPullRequestsParamsSchema = z.object({
  owner: z.string().min(1),
  repo: z.string().min(1),
  state: z.enum(["open", "closed", "all"]).default("open"),
  head: z.string().optional(),
  base: z.string().optional(),
  sort: z.enum(["created", "updated", "popularity", "long-running"]).default("created"),
  direction: z.enum(["asc", "desc"]).default("desc"),
  per_page: z.number().min(1).max(100).default(30),
  page: z.number().min(1).default(1),
});

export const GetPullRequestParamsSchema = z.object({
  owner: z.string().min(1),
  repo: z.string().min(1),
  pull_number: z.number().min(1),
});
