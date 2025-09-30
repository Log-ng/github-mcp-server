import { repoHandlers, repoToolDefinitions } from "./repo";
import { HandlerFunction } from "../types";
import { issueHandlers, issueToolDefinitions } from "./issue";
import { pullRequestHandlers, pullRequestToolDefinitions } from "./pullRequest";
import { commitHandlers, commitToolDefinitions } from "./commit";
import { fileHandlers, fileToolDefinitions } from "./file";
import { searchHandlers, searchToolDefinitions } from "./search";

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