import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
} from "@modelcontextprotocol/sdk/types.js";
import { z } from "zod";
import dotenv from "dotenv";

import {
  GetRepoInfoParamsSchema,
  ListReposParamsSchema,
  CreateBranchParamsSchema,
  CreateIssueParamsSchema,
  ListIssuesParamsSchema,
  GetIssueParamsSchema,
  CreatePullRequestParamsSchema,
  ListPullRequestsParamsSchema,
  GetPullRequestParamsSchema,
  ListCommitsParamsSchema,
  GetCommitParamsSchema,
  GetFileContentParamsSchema,
  CreateOrUpdateFileParamsSchema,
  SearchReposParamsSchema,
  SearchIssuesParamsSchema,
} from "./schemas/index.js";

import {
  getRepoInfo,
  listRepos,
  createBranch,
  createIssue,
  listIssues,
  getIssue,
  createPullRequest,
  listPullRequests,
  getPullRequest,
  listCommits,
  getCommit,
  getFileContent,
  createOrUpdateFile,
  searchRepos,
  searchIssues,
} from "./tools/index.js";

dotenv.config();

if (!process.env.GITHUB_TOKEN) {
  console.error("Error: GITHUB_TOKEN environment variable is required");
  process.exit(1);
}

const server = new Server(
  {
    name: "github-mcp-server",
    version: "1.0.0",
  },
  {
    capabilities: {
      tools: {},
    },
  }
);

server.setRequestHandler(ListToolsRequestSchema, async () => {
  return {
    tools: [
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
      {
        name: "get_file_content",
        description: "Get the contents of a file or directory",
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
            path: {
              type: "string",
              description: "File or directory path",
            },
            ref: {
              type: "string",
              description: "Branch, tag, or commit SHA",
            },
          },
          required: ["owner", "repo", "path"],
        },
      },
      {
        name: "create_or_update_file",
        description: "Create or update a file in a repository",
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
            path: {
              type: "string",
              description: "File path",
            },
            message: {
              type: "string",
              description: "Commit message",
            },
            content: {
              type: "string",
              description: "File content",
            },
            branch: {
              type: "string",
              description: "Branch name (optional)",
            },
            sha: {
              type: "string",
              description: "SHA of the file to update (required for updates)",
            },
          },
          required: ["owner", "repo", "path", "message", "content"],
        },
      },
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
    ],
  };
});

server.setRequestHandler(CallToolRequestSchema, async (request: any) => {
  const { name, arguments: args } = request.params;

  try {
    switch (name) {
      case "get_repo_info": {
        const params = GetRepoInfoParamsSchema.parse(args);
        const result = await getRepoInfo(params.owner, params.repo);
        return {
          content: [
            {
              type: "text",
              text: JSON.stringify(result, null, 2),
            },
          ],
        };
      }

      case "list_repos": {
        const params = ListReposParamsSchema.parse(args);
        const result = await listRepos(params);
        return {
          content: [
            {
              type: "text",
              text: JSON.stringify(result, null, 2),
            },
          ],
        };
      }

      case "create_branch": {
        const params = CreateBranchParamsSchema.parse(args);
        const result = await createBranch(params);
        return {
          content: [
            {
              type: "text",
              text: JSON.stringify(result, null, 2),
            },
          ],
        };
      }

      case "create_issue": {
        const params = CreateIssueParamsSchema.parse(args);
        const result = await createIssue(params);
        return {
          content: [
            {
              type: "text",
              text: JSON.stringify(result, null, 2),
            },
          ],
        };
      }

      case "list_issues": {
        const params = ListIssuesParamsSchema.parse(args);
        const result = await listIssues(params);
        return {
          content: [
            {
              type: "text",
              text: JSON.stringify(result, null, 2),
            },
          ],
        };
      }

      case "get_issue": {
        const params = GetIssueParamsSchema.parse(args);
        const result = await getIssue(params);
        return {
          content: [
            {
              type: "text",
              text: JSON.stringify(result, null, 2),
            },
          ],
        };
      }

      case "create_pull_request": {
        const params = CreatePullRequestParamsSchema.parse(args);
        const result = await createPullRequest(params);
        return {
          content: [
            {
              type: "text",
              text: JSON.stringify(result, null, 2),
            },
          ],
        };
      }

      case "list_pull_requests": {
        const params = ListPullRequestsParamsSchema.parse(args);
        const result = await listPullRequests(params);
        return {
          content: [
            {
              type: "text",
              text: JSON.stringify(result, null, 2),
            },
          ],
        };
      }

      case "get_pull_request": {
        const params = GetPullRequestParamsSchema.parse(args);
        const result = await getPullRequest(params);
        return {
          content: [
            {
              type: "text",
              text: JSON.stringify(result, null, 2),
            },
          ],
        };
      }

      case "list_commits": {
        const params = ListCommitsParamsSchema.parse(args);
        const result = await listCommits(params);
        return {
          content: [
            {
              type: "text",
              text: JSON.stringify(result, null, 2),
            },
          ],
        };
      }

      case "get_commit": {
        const params = GetCommitParamsSchema.parse(args);
        const result = await getCommit(params);
        return {
          content: [
            {
              type: "text",
              text: JSON.stringify(result, null, 2),
            },
          ],
        };
      }

      case "get_file_content": {
        const params = GetFileContentParamsSchema.parse(args);
        const result = await getFileContent(params);
        return {
          content: [
            {
              type: "text",
              text: JSON.stringify(result, null, 2),
            },
          ],
        };
      }

      case "create_or_update_file": {
        const params = CreateOrUpdateFileParamsSchema.parse(args);
        const result = await createOrUpdateFile(params);
        return {
          content: [
            {
              type: "text",
              text: JSON.stringify(result, null, 2),
            },
          ],
        };
      }

      case "search_repos": {
        const params = SearchReposParamsSchema.parse(args);
        const result = await searchRepos(params);
        return {
          content: [
            {
              type: "text",
              text: JSON.stringify(result, null, 2),
            },
          ],
        };
      }

      case "search_issues": {
        const params = SearchIssuesParamsSchema.parse(args);
        const result = await searchIssues(params);
        return {
          content: [
            {
              type: "text",
              text: JSON.stringify(result, null, 2),
            },
          ],
        };
      }

      default:
        throw new Error(`Unknown tool: ${name}`);
    }
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    return {
      content: [
        {
          type: "text",
          text: `Error: ${errorMessage}`,
        },
      ],
      isError: true,
    };
  }
});

async function main() {
  const transport = new StdioServerTransport();
  await server.connect(transport);
  console.error("GitHub MCP server running on stdio");
}

main().catch((error) => {
  console.error("Fatal error in main():", error);
  process.exit(1);
});
