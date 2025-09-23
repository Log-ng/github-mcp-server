import { repoHandlers, repoToolDefinitions, HandlerFunction } from "./repo.js";
import { issueHandlers, issueToolDefinitions } from "./issue.js";
import { pullRequestHandlers, pullRequestToolDefinitions } from "./pullRequest.js";
import { commitHandlers, commitToolDefinitions } from "./commit.js";
import { fileHandlers, fileToolDefinitions } from "./file.js";
import { searchHandlers, searchToolDefinitions } from "./search.js";

export const allHandlers: Record<string, HandlerFunction> = {
  ...repoHandlers,
  ...issueHandlers,
  ...pullRequestHandlers,
  ...commitHandlers,
  ...fileHandlers,
  ...searchHandlers,
};

export const allToolDefinitions = [
  ...repoToolDefinitions,
  ...issueToolDefinitions,
  ...pullRequestToolDefinitions,
  ...commitToolDefinitions,
  ...fileToolDefinitions,
  ...searchToolDefinitions,
];
