import { GetFileContentParamsSchema, CreateOrUpdateFileParamsSchema } from "./schema.js";
import { getFileContent, createOrUpdateFile } from "./service.js";
import { GetFileContentArgs, CreateOrUpdateFileArgs } from "./service.js";

export type HandlerFunction = (args: unknown) => Promise<any>;

export const fileHandlers: Record<string, HandlerFunction> = {
  get_file_content: async (args: unknown) => {
    const params = GetFileContentParamsSchema.parse(args) as GetFileContentArgs;
    const result = await getFileContent(params);
    return {
      content: [
        {
          type: "text",
          text: JSON.stringify(result, null, 2),
        },
      ],
    };
  },

  create_or_update_file: async (args: unknown) => {
    const params = CreateOrUpdateFileParamsSchema.parse(args) as CreateOrUpdateFileArgs;
    const result = await createOrUpdateFile(params);
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

export const fileToolDefinitions = [
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
];
