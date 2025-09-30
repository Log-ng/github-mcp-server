import { SearchReposParamsSchema, SearchIssuesParamsSchema } from "./schema.js";
import { searchRepos, searchIssues, SearchReposArgs, SearchIssuesArgs } from "./service.js";

export type HandlerFunction = (args: unknown) => Promise<any>;

export const searchHandlers: Record<string, HandlerFunction> = {
  search_repos: async (args: unknown) => {
    const params = SearchReposParamsSchema.parse(args) as SearchReposArgs;
    const result = await searchRepos(params);
    return {
      content: [
        {
          type: "text",
          text: JSON.stringify(result, null, 2),
        },
      ],
    };
  },

  search_issues: async (args: unknown) => {
    const params = SearchIssuesParamsSchema.parse(args) as SearchIssuesArgs;
    const result = await searchIssues(params);
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

export const searchToolDefinitions = [
  {
    name: "search_repos",
    description: "Search for repositories",
    inputSchema: {
      type: "object",
      properties: {
        q: {
          type: "string",
          description: "Search query (e.g., 'language:javascript stars:>1000')",
        },
        sort: {
          type: "string",
          enum: ["stars", "forks", "help-wanted-issues", "updated"],
          description: "Sort results by",
        },
        order: {
          type: "string",
          enum: ["asc", "desc"],
          description: "Sort order",
          default: "desc",
        },
        per_page: {
          type: "number",
          description: "Number of results per page (1-100)",
          default: 30,
        },
        page: {
          type: "number",
          description: "Page number",
          default: 1,
        },
      },
      required: ["q"],
    },
  },
  {
    name: "search_issues",
    description: "Search for issues and pull requests",
    inputSchema: {
      type: "object",
      properties: {
        q: {
          type: "string",
          description: "Search query (e.g., 'is:issue is:open language:javascript')",
        },
        sort: {
          type: "string",
          enum: ["comments", "reactions", "reactions-+1", "reactions--1", "reactions-smile", "reactions-thinking_face", "reactions-heart", "reactions-tada", "interactions", "created", "updated"],
          description: "Sort results by",
        },
        order: {
          type: "string",
          enum: ["asc", "desc"],
          description: "Sort order",
          default: "desc",
        },
        per_page: {
          type: "number",
          description: "Number of results per page (1-100)",
          default: 30,
        },
        page: {
          type: "number",
          description: "Page number",
          default: 1,
        },
      },
      required: ["q"],
    },
  },
];
