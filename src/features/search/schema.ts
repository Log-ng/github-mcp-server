import { z } from "zod";

export const SearchReposParamsSchema = z.object({
  q: z.string().min(1),
  sort: z.enum(["stars", "forks", "help-wanted-issues", "updated"]).optional(),
  order: z.enum(["asc", "desc"]).default("desc"),
  per_page: z.number().min(1).max(100).default(30),
  page: z.number().min(1).default(1),
});

export const SearchIssuesParamsSchema = z.object({
  q: z.string().min(1),
  sort: z.enum(["comments", "reactions", "reactions-+1", "reactions--1", "reactions-smile", "reactions-thinking_face", "reactions-heart", "reactions-tada", "interactions", "created", "updated"]).optional(),
  order: z.enum(["asc", "desc"]).default("desc"),
  per_page: z.number().min(1).max(100).default(30),
  page: z.number().min(1).default(1),
});
