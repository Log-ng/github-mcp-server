import { z } from "zod";

export const GetRepoInfoParamsSchema = z.object({
  owner: z.string().min(1),
  repo: z.string().min(1),
});

export const ListReposParamsSchema = z.object({
  username: z.string().min(1).optional(),
  type: z.enum(["all", "owner", "public", "private", "member"]).default("all"),
  sort: z.enum(["created", "updated", "pushed", "full_name"]).default("updated"),
  direction: z.enum(["asc", "desc"]).default("desc"),
  per_page: z.number().min(1).max(100).default(30),
  page: z.number().min(1).default(1),
});
