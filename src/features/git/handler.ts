import { CompareBranchesParamsSchema, MergeBranchesParamsSchema } from "./schema.js";
import { compareBranches, mergeBranches, CompareBranchesArgs, MergeBranchesArgs } from "./service.js";

export type HandlerFunction = (args: unknown) => Promise<any>;

export const gitHandlers: Record<string, HandlerFunction> = {
  compare_branches: async (args: unknown) => {
    const params = CompareBranchesParamsSchema.parse(args) as CompareBranchesArgs;
    const result = await compareBranches(params);
    return {
      content: [
        {
          type: "text",
          text: JSON.stringify(result, null, 2),
        },
      ],
    };
  },

  merge_branches: async (args: unknown) => {
    const params = MergeBranchesParamsSchema.parse(args) as MergeBranchesArgs;
    const result = await mergeBranches(params);
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

export const gitToolDefinitions = [
  {
    name: "compare_branches",
    description: "Compare two branches and show differences",
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
        base: {
          type: "string",
          description: "Base branch name",
        },
        head: {
          type: "string",
          description: "Head branch name to compare against base",
        },
      },
      required: ["owner", "repo", "base", "head"],
    },
  },
  {
    name: "merge_branches",
    description: "Merge one branch into another",
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
        base: {
          type: "string", 
          description: "Base branch to merge into",
        },
        head: {
          type: "string",
          description: "Head branch to merge from",
        },
        commit_message: {
          type: "string",
          description: "Commit message for the merge (optional)",
        },
      },
      required: ["owner", "repo", "base", "head"],
    },
  },
];