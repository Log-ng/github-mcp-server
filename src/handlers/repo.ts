import { GetRepoInfoParamsSchema, ListReposParamsSchema, CreateBranchParamsSchema } from "../schemas/index.js";
import { getRepoInfo, listRepos, createBranch } from "../services/index.js";

export type HandlerFunction = (args: unknown) => Promise<any>;

export interface GetRepoInfoArgs {
  owner: string;
  repo: string;
}

export interface ListReposArgs {
  username?: string;
  type?: "all" | "owner" | "public" | "private" | "member";
  sort?: "created" | "updated" | "pushed" | "full_name";
  direction?: "asc" | "desc";
  per_page?: number;
  page?: number;
}

export interface CreateBranchArgs {
  owner: string;
  repo: string;
  branch: string;
  base_branch?: string;
}

export const repoHandlers: Record<string, HandlerFunction> = {
  get_repo_info: async (args: unknown) => {
    const params = GetRepoInfoParamsSchema.parse(args) as GetRepoInfoArgs;
    const result = await getRepoInfo(params.owner, params.repo);
    return {
      content: [
        {
          type: "text",
          text: JSON.stringify(result, null, 2),
        },
      ],
    };
  },

  list_repos: async (args: unknown) => {
    const params = ListReposParamsSchema.parse(args) as ListReposArgs;
    const result = await listRepos(params);
    return {
      content: [
        {
          type: "text",
          text: JSON.stringify(result, null, 2),
        },
      ],
    };
  },

  create_branch: async (args: unknown) => {
    const params = CreateBranchParamsSchema.parse(args) as CreateBranchArgs;
    const result = await createBranch(params);
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

export const repoToolDefinitions = [
  {
    name: "get_repo_info",
    description: "Get information about a GitHub repository",
    inputSchema: {
      type: "object",
      properties: {
        owner: {
          type: "string",
          description: "Repository owner (username or organization)",
        },
        repo: {
          type: "string",
          description: "Repository name",
        },
      },
      required: ["owner", "repo"],
    },
  },
  {
    name: "list_repos",
    description: "List repositories for a user or organization",
    inputSchema: {
      type: "object",
      properties: {
        username: {
          type: "string",
          description: "Username to list repos for (optional, defaults to authenticated user)",
        },
        type: {
          type: "string",
          enum: ["all", "owner", "public", "private", "member"],
          description: "Type of repositories to list",
          default: "all",
        },
        sort: {
          type: "string",
          enum: ["created", "updated", "pushed", "full_name"],
          description: "Sort repositories by",
          default: "updated",
        },
        direction: {
          type: "string",
          enum: ["asc", "desc"],
          description: "Sort direction",
          default: "desc",
        },
        per_page: {
          type: "number",
          description: "Number of repositories per page (1-100)",
          default: 30,
        },
        page: {
          type: "number",
          description: "Page number",
          default: 1,
        },
      },
    },
  },
  {
    name: "create_branch",
    description: "Create a new branch in a repository",
    inputSchema: {
      type: "object",
      properties: {
        owner: {
          type: "string",
          description: "Repository owner (username or organization)",
        },
        repo: {
          type: "string",
          description: "Repository name",
        },
        branch: {
          type: "string",
          description: "Name of the new branch to create",
        },
        base_branch: {
          type: "string",
          description: "Base branch to create from (defaults to 'main')",
          default: "main",
        },
      },
      required: ["owner", "repo", "branch"],
    },
  },
];
