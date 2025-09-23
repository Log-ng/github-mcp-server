import { CreateIssueParamsSchema, ListIssuesParamsSchema, GetIssueParamsSchema } from "../schemas/index.js";
import { createIssue, listIssues, getIssue } from "../services/index.js";

export type HandlerFunction = (args: unknown) => Promise<any>;

export interface CreateIssueArgs {
  owner: string;
  repo: string;
  title: string;
  body?: string;
  labels?: string[];
  assignees?: string[];
}

export interface ListIssuesArgs {
  owner: string;
  repo: string;
  state?: "open" | "closed" | "all";
  labels?: string;
  sort?: "created" | "updated" | "comments";
  direction?: "asc" | "desc";
  per_page?: number;
  page?: number;
}

export interface GetIssueArgs {
  owner: string;
  repo: string;
  issue_number: number;
}

export const issueHandlers: Record<string, HandlerFunction> = {
  create_issue: async (args: unknown) => {
    const params = CreateIssueParamsSchema.parse(args) as CreateIssueArgs;
    const result = await createIssue(params);
    return {
      content: [
        {
          type: "text",
          text: JSON.stringify(result, null, 2),
        },
      ],
    };
  },

  list_issues: async (args: unknown) => {
    const params = ListIssuesParamsSchema.parse(args) as ListIssuesArgs;
    const result = await listIssues(params);
    return {
      content: [
        {
          type: "text",
          text: JSON.stringify(result, null, 2),
        },
      ],
    };
  },

  get_issue: async (args: unknown) => {
    const params = GetIssueParamsSchema.parse(args) as GetIssueArgs;
    const result = await getIssue(params);
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

export const issueToolDefinitions = [
  {
    name: "create_issue",
    description: "Create a new issue in a repository",
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
          description: "Issue title",
        },
        body: {
          type: "string",
          description: "Issue body/description",
        },
        labels: {
          type: "array",
          items: { type: "string" },
          description: "Labels to assign to the issue",
        },
        assignees: {
          type: "array",
          items: { type: "string" },
          description: "Usernames to assign to the issue",
        },
      },
      required: ["owner", "repo", "title"],
    },
  },
  {
    name: "list_issues",
    description: "List issues in a repository",
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
          description: "Issue state",
          default: "open",
        },
        labels: {
          type: "string",
          description: "Comma-separated list of labels to filter by",
        },
        sort: {
          type: "string",
          enum: ["created", "updated", "comments"],
          description: "Sort issues by",
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
          description: "Number of issues per page (1-100)",
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
    name: "get_issue",
    description: "Get details of a specific issue",
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
        issue_number: {
          type: "number",
          description: "Issue number",
        },
      },
      required: ["owner", "repo", "issue_number"],
    },
  },
];
