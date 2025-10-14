import { GetRepoInfoParamsSchema, ListReposParamsSchema, CreateBranchParamsSchema } from "./schema.js";
import { getRepoInfo, listRepos, createBranch } from "./service.js";
import { createSuccessResponse, handleError, logger } from "../../utils/index.js";
import { HandlerFunction } from "../../types/index.js";
import { GetRepoInfoArgs, ListReposArgs, CreateBranchArgs } from "./service.js";

export const repoHandlers: Record<string, HandlerFunction> = {
  get_repo_info: async (args: unknown) => {
    const startTime = Date.now();
    logger.handlerStart('get_repo_info', args);
    
    try {
      const params = GetRepoInfoParamsSchema.parse(args) as GetRepoInfoArgs;
      const result = await getRepoInfo(params.owner, params.repo);
      
      const duration = Date.now() - startTime;
      logger.handlerSuccess('get_repo_info', duration);
      return createSuccessResponse(result);
    } catch (error) {
      const duration = Date.now() - startTime;
      logger.handlerError('get_repo_info', error as Error, duration);
      return handleError(error);
    }
  },

  list_repos: async (args: unknown) => {
    const startTime = Date.now();
    logger.handlerStart('list_repos', args);
    
    try {
      const params = ListReposParamsSchema.parse(args) as ListReposArgs;
      const result = await listRepos(params);
      
      const duration = Date.now() - startTime;
      logger.handlerSuccess('list_repos', duration);
      return createSuccessResponse(result);
    } catch (error) {
      const duration = Date.now() - startTime;
      logger.handlerError('list_repos', error as Error, duration);
      return handleError(error);
    }
  },

  create_branch: async (args: unknown) => {
    const startTime = Date.now();
    logger.handlerStart('create_branch', args);
    
    try {
      const params = CreateBranchParamsSchema.parse(args) as CreateBranchArgs;
      const result = await createBranch(params);
      
      const duration = Date.now() - startTime;
      logger.handlerSuccess('create_branch', duration);
      return createSuccessResponse(result);
    } catch (error) {
      const duration = Date.now() - startTime;
      logger.handlerError('create_branch', error as Error, duration);
      return handleError(error);
    }
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
