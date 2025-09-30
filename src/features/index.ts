import { repoHandlers, repoToolDefinitions } from "./repo/handler.js";
import { HandlerFunction } from "../types/index.js";
import { issueHandlers, issueToolDefinitions } from "./issue/handler.js";
import { pullRequestHandlers, pullRequestToolDefinitions } from "./pullRequest/handler.js";
import { commitHandlers, commitToolDefinitions } from "./commit/handler.js";
import { fileHandlers, fileToolDefinitions } from "./file/handler.js";
import { searchHandlers, searchToolDefinitions } from "./search/handler.js";

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