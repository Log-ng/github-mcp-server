import { z } from "zod";

export const CreateIssueParamsSchema = z.object({
  owner: z.string().min(1),
  repo: z.string().min(1),
  title: z.string().min(1),
  body: z.string().optional(),
  labels: z.array(z.string()).optional(),
  assignees: z.array(z.string()).optional(),
});

export const ListIssuesParamsSchema = z.object({
  owner: z.string().min(1),
  repo: z.string().min(1),
  state: z.enum(["open", "closed", "all"]).default("open"),
  labels: z.string().optional(),
  sort: z.enum(["created", "updated", "comments"]).default("created"),
  direction: z.enum(["asc", "desc"]).default("desc"),
  per_page: z.number().min(1).max(100).default(30),
  page: z.number().min(1).default(1),
});

export const GetIssueParamsSchema = z.object({
  owner: z.string().min(1),
  repo: z.string().min(1),
  issue_number: z.number().min(1),
});
