import { ListCommitsParamsSchema, GetCommitParamsSchema } from "../schemas/index.js";
import { listCommits, getCommit } from "../services/index.js";

export type HandlerFunction = (args: unknown) => Promise<any>;

export interface ListCommitsArgs {
  owner: string;
  repo: string;
  sha?: string;
  path?: string;
  author?: string;
  since?: string;
  until?: string;
  per_page?: number;
  page?: number;
}

export interface GetCommitArgs {
  owner: string;
  repo: string;
  ref: string;
}

export const commitHandlers: Record<string, HandlerFunction> = {
  list_commits: async (args: unknown) => {
    const params = ListCommitsParamsSchema.parse(args) as ListCommitsArgs;
    const result = await listCommits(params);
    return {
      content: [
        {
          type: "text",
          text: JSON.stringify(result, null, 2),
        },
      ],
    };
  },

  get_commit: async (args: unknown) => {
    const params = GetCommitParamsSchema.parse(args) as GetCommitArgs;
    const result = await getCommit(params);
    return {
      content: [
        {
          type: "text",
          text: JSON.stringify(result, null, 2),
        },
      ],
    };
  },
};

export const commitToolDefinitions = [
  {
    name: "list_commits",
    description: "List commits in a repository",
    inputSchema: {
      type: "object",
      properties: {
        owner: {
          type: "string",
          description: "Repository owner",
        },
        repo: {
          type: "string",
          description: "Repository name",
        },
        sha: {
          type: "string",
          description: "SHA or branch to start listing commits from",
        },
        path: {
          type: "string",
          description: "Only commits containing this file path",
        },
        author: {
          type: "string",
          description: "GitHub login or email address",
        },
        since: {
          type: "string",
          description: "Only commits after this date (ISO 8601 format)",
        },
        until: {
          type: "string",
          description: "Only commits before this date (ISO 8601 format)",
        },
        per_page: {
          type: "number",
          description: "Number of commits per page (1-100)",
          default: 30,
        },
        page: {
          type: "number",
          description: "Page number",
          default: 1,
        },
      },
      required: ["owner", "repo"],
    },
  },
  {
    name: "get_commit",
    description: "Get details of a specific commit",
    inputSchema: {
      type: "object",
      properties: {
        owner: {
          type: "string",
          description: "Repository owner",
        },
        repo: {
          type: "string",
          description: "Repository name",
        },
        ref: {
          type: "string",
          description: "SHA, branch, or tag name",
        },
      },
      required: ["owner", "repo", "ref"],
    },
  },
];
