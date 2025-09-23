import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
} from "@modelcontextprotocol/sdk/types.js";

import { allHandlers, allToolDefinitions } from "./handlers/index.js";
import { serverConfig } from "./config/index.js";
import { logger } from "./utils/logger.js";
import { handleError } from "./utils/index.js";

const server = new Server(
  {
    name: serverConfig.name,
    version: serverConfig.version,
  },
  {
    capabilities: serverConfig.capabilities,
  }
);

server.setRequestHandler(ListToolsRequestSchema, async () => {
  return {
    tools: allToolDefinitions,
  };
});

server.setRequestHandler(CallToolRequestSchema, async (request) => {
  const { name, arguments: args } = request.params;
  const startTime = Date.now();

  try {
    logger.info(`Tool request: ${name}`, { args });
    
    const handler = allHandlers[name];
    if (!handler) {
      throw new Error(`Unknown tool: ${name}`);
    }
    
    const result = await handler(args);
    
    const duration = Date.now() - startTime;
    logger.info(`Tool completed: ${name}`, { duration: `${duration}ms` });
    
    return result;
  } catch (error) {
    const duration = Date.now() - startTime;
    logger.error(`Tool failed: ${name}`, { error, duration: `${duration}ms` });
    return handleError(error);
  }
});

const main = async () => {
  try {
    const transport = new StdioServerTransport();
    await server.connect(transport);
    logger.info("GitHub MCP server running on stdio");
  } catch (error) {
    logger.error("Failed to start server", { error });
    throw error;
  }
}

main().catch((error) => {
  logger.error("Fatal error in main()", { error });
  process.exit(1);
});
