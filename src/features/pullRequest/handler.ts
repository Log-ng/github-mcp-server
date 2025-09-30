import { CreatePullRequestParamsSchema, ListPullRequestsParamsSchema, GetPullRequestParamsSchema } from "./schema.js";
import { createPullRequest, listPullRequests, getPullRequest } from "./service.js";
import { CreatePullRequestArgs, ListPullRequestsArgs, GetPullRequestArgs } from "./service.js";

export type HandlerFunction = (args: unknown) => Promise<any>;

export const pullRequestHandlers: Record<string, HandlerFunction> = {
  create_pull_request: async (args: unknown) => {
    const params = CreatePullRequestParamsSchema.parse(args) as CreatePullRequestArgs;
    const result = await createPullRequest(params);
    return {
      content: [
        {
          type: "text",
          text: JSON.stringify(result, null, 2),
        },
      ],
    };
  },

  list_pull_requests: async (args: unknown) => {
    const params = ListPullRequestsParamsSchema.parse(args) as ListPullRequestsArgs;
    const result = await listPullRequests(params);
    return {
      content: [
        {
          type: "text",
          text: JSON.stringify(result, null, 2),
        },
      ],
    };
  },

  get_pull_request: async (args: unknown) => {
    const params = GetPullRequestParamsSchema.parse(args) as GetPullRequestArgs;
    const result = await getPullRequest(params);
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

export const pullRequestToolDefinitions = [
  {
    name: "create_pull_request",
    description: "Create a new pull request",
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
        title: {
          type: "string",
          description: "Pull request title",
        },
        head: {
          type: "string",
          description: "Branch to merge from",
        },
        base: {
          type: "string",
          description: "Branch to merge into",
        },
        body: {
          type: "string",
          description: "Pull request body/description",
        },
        draft: {
          type: "boolean",
          description: "Whether this is a draft pull request",
          default: false,
        },
      },
      required: ["owner", "repo", "title", "head", "base"],
    },
  },
  {
    name: "list_pull_requests",
    description: "List pull requests in a repository",
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
        state: {
          type: "string",
          enum: ["open", "closed", "all"],
          description: "Pull request state",
          default: "open",
        },
        head: {
          type: "string",
          description: "Filter by head branch",
        },
        base: {
          type: "string",
          description: "Filter by base branch",
        },
        sort: {
          type: "string",
          enum: ["created", "updated", "popularity", "long-running"],
          description: "Sort pull requests by",
          default: "created",
        },
        direction: {
          type: "string",
          enum: ["asc", "desc"],
          description: "Sort direction",
          default: "desc",
        },
        per_page: {
          type: "number",
          description: "Number of pull requests per page (1-100)",
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
    name: "get_pull_request",
    description: "Get details of a specific pull request",
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
        pull_number: {
          type: "number",
          description: "Pull request number",
        },
      },
      required: ["owner", "repo", "pull_number"],
    },
  },
];
