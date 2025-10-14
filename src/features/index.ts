import { repoHandlers, repoToolDefinitions } from "./repo/index.js";
import { HandlerFunction } from "../types/index.js";
import { issueHandlers, issueToolDefinitions } from "./issue/index.js";
import { pullRequestHandlers, pullRequestToolDefinitions } from "./pullRequest/index.js";
import { commitHandlers, commitToolDefinitions } from "./commit/index.js";
import { fileHandlers, fileToolDefinitions } from "./file/index.js";
import { searchHandlers, searchToolDefinitions } from "./search/index.js";

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