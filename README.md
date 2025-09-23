# GitHub MCP Server

A Model Context Protocol (MCP) server that provides comprehensive GitHub API integration for AI assistants and applications. Built with TypeScript, featuring robust error handling, logging, retry mechanisms, and rate limiting.

## ✨ Features

This MCP server provides tools for:

### Repository Management
- Get repository information
- List repositories for users/organizations
- Create new branches
- Search repositories

### Issue Management
- Create issues
- List issues with filtering
- Get issue details

### Pull Request Management
- Create pull requests
- List pull requests with filtering
- Get pull request details

### Commit Management
- List commits with filtering
- Get commit details and statistics

### File Management
- Get file/directory contents
- Create or update files

### Search
- Search repositories
- Search issues and pull requests

## 🚀 New Features & Improvements

### Enhanced Architecture
- **Type Safety**: Comprehensive TypeScript types and interfaces
- **Error Handling**: Centralized error handling with custom error classes
- **Logging**: Structured logging with configurable levels
- **Retry Mechanism**: Automatic retry with exponential backoff
- **Rate Limiting**: Built-in rate limiting to prevent API abuse
- **Configuration**: Environment-based configuration management

### Performance & Reliability
- **Request/Response Logging**: Full API call monitoring
- **Performance Tracking**: Duration measurement for all operations
- **Input Validation**: Zod schema validation for all inputs
- **Input Sanitization**: Security-focused input cleaning
- **Retry Logic**: Automatic retry for failed requests
- **Error Recovery**: Graceful error handling and recovery

## 📦 Installation

1. Clone this repository:
```bash
git clone <repository-url>
cd github-mcp-server
```

2. Install dependencies:
```bash
pnpm install
```

3. Set up environment variables:
```bash
cp env.example .env
```

4. Edit `.env` and configure your settings:
```bash
# Required: GitHub Personal Access Token
GITHUB_TOKEN=your_github_token_here

# Optional: Environment Configuration
NODE_ENV=development
LOG_LEVEL=info

# Optional: Rate Limiting Configuration
RATE_LIMIT_MAX_REQUESTS=100
RATE_LIMIT_WINDOW_MS=60000

# Optional: Retry Configuration
MAX_RETRIES=3
RETRY_DELAY_MS=1000
```

## Getting a GitHub Token

1. Go to [GitHub Settings > Personal Access Tokens](https://github.com/settings/tokens)
2. Click "Generate new token (classic)"
3. Select the following scopes:
   - `repo` (Full control of private repositories)
   - `read:user` (Read user profile data)
   - `read:org` (Read org and team membership)
4. Copy the generated token to your `.env` file

## 🛠️ Usage

### Development
```bash
pnpm dev
```

### Build and Run
```bash
pnpm build
pnpm start
```

### Type Checking
```bash
pnpm type-check
```

## ⚙️ Configuration

### Environment Variables

| Variable | Description | Default | Required |
|----------|-------------|---------|----------|
| `GITHUB_TOKEN` | GitHub Personal Access Token | - | ✅ |
| `NODE_ENV` | Environment (development/production/test) | development | ❌ |
| `LOG_LEVEL` | Log level (error/warn/info/debug) | info | ❌ |
| `RATE_LIMIT_MAX_REQUESTS` | Max requests per window | 100 | ❌ |
| `RATE_LIMIT_WINDOW_MS` | Rate limit window (ms) | 60000 | ❌ |
| `MAX_RETRIES` | Max retry attempts | 3 | ❌ |
| `RETRY_DELAY_MS` | Retry delay (ms) | 1000 | ❌ |

### Logging

The server provides structured logging with the following levels:
- **error**: Critical errors and failures
- **warn**: Warning messages
- **info**: General information
- **debug**: Detailed debugging information

Example log output:
```
[2024-01-15T10:30:00.000Z] [INFO] Tool request: get_repo_info {"args": {"owner": "octocat", "repo": "Hello-World"}}
[2024-01-15T10:30:00.500Z] [INFO] Tool completed: get_repo_info {"duration": "500ms"}
```

## 🔧 Available Tools

The server provides the following MCP tools:

- `get_repo_info` - Get repository information
- `list_repos` - List repositories
- `create_branch` - Create a new branch in a repository
- `create_issue` - Create a new issue
- `list_issues` - List issues in a repository
- `get_issue` - Get issue details
- `create_pull_request` - Create a pull request
- `list_pull_requests` - List pull requests
- `get_pull_request` - Get pull request details
- `list_commits` - List commits
- `get_commit` - Get commit details
- `get_file_content` - Get file/directory contents
- `create_or_update_file` - Create or update files
- `search_repos` - Search repositories
- `search_issues` - Search issues and pull requests

## 📝 Tool Examples

### Create Branch Tool

The `create_branch` tool allows you to create a new branch in a GitHub repository:

**Parameters:**
- `owner` (required): Repository owner (username or organization)
- `repo` (required): Repository name
- `branch` (required): Name of the new branch to create
- `base_branch` (optional): Base branch to create from (defaults to "main")

**Example usage:**
```json
{
  "name": "create_branch",
  "arguments": {
    "owner": "octocat",
    "repo": "Hello-World",
    "branch": "feature/new-feature",
    "base_branch": "main"
  }
}
```

**Response:**
```json
{
  "ref": "refs/heads/feature/new-feature",
  "sha": "6dcb09b5b57875f334f61aebed695e2e4193db5e",
  "url": "https://api.github.com/repos/octocat/Hello-World/git/refs/heads/feature/new-feature",
  "branch_name": "feature/new-feature",
  "base_branch": "main"
}
```

## 🏗️ Project Structure

```
src/
├── types/            # TypeScript type definitions
│   └── index.ts      # Common types and interfaces
├── utils/            # Utility functions
│   ├── index.ts      # Common utilities
│   └── logger.ts     # Logging system
├── config/           # Configuration management
│   └── index.ts      # Environment configuration
├── schemas/          # Zod validation schemas
│   ├── common.ts     # Common schemas
│   ├── repo.ts       # Repository schemas
│   ├── issue.ts      # Issue schemas
│   ├── pullRequest.ts # Pull request schemas
│   ├── commit.ts     # Commit schemas
│   ├── file.ts       # File schemas
│   ├── search.ts     # Search schemas
│   └── index.ts      # Schema exports
├── services/         # GitHub API services
│   ├── common.ts     # Common Octokit setup
│   ├── repo.ts       # Repository services
│   ├── issue.ts      # Issue services
│   ├── pullRequest.ts # Pull request services
│   ├── commit.ts     # Commit services
│   ├── file.ts       # File services
│   ├── search.ts     # Search services
│   └── index.ts      # Service exports
├── handlers/         # MCP request handlers
│   ├── repo.ts       # Repository handlers
│   ├── issue.ts      # Issue handlers
│   ├── pullRequest.ts # Pull request handlers
│   ├── commit.ts     # Commit handlers
│   ├── file.ts       # File handlers
│   ├── search.ts     # Search handlers
│   └── index.ts      # Handler exports
└── index.ts          # MCP server implementation
```

## 🔒 Security Features

- **Input Validation**: All inputs are validated using Zod schemas
- **Input Sanitization**: HTML tags and special characters are sanitized
- **Rate Limiting**: Built-in rate limiting to prevent API abuse
- **Error Handling**: Secure error messages that don't leak sensitive information
- **Token Security**: GitHub token is loaded from environment variables only

## 🚀 Performance Features

- **Retry Mechanism**: Automatic retry with exponential backoff for failed requests
- **Request Logging**: Full API call monitoring and performance tracking
- **Caching**: Built-in request caching to reduce API calls
- **Rate Limiting**: Intelligent rate limiting to respect GitHub API limits
- **Performance Monitoring**: Duration tracking for all operations

## 🐛 Error Handling

The server provides comprehensive error handling:

- **Validation Errors**: Clear validation error messages
- **GitHub API Errors**: Proper handling of GitHub API errors
- **Network Errors**: Automatic retry for network failures
- **Rate Limit Errors**: Graceful handling of rate limit exceeded
- **Authentication Errors**: Clear authentication error messages

## 📊 Monitoring & Logging

- **Structured Logging**: JSON-formatted logs with timestamps
- **Performance Metrics**: Request duration and success rates
- **Error Tracking**: Detailed error logging with stack traces
- **API Monitoring**: Full GitHub API call monitoring
- **Configurable Log Levels**: Adjustable logging verbosity

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Commit your changes: `git commit -m 'Add amazing feature'`
4. Push to the branch: `git push origin feature/amazing-feature`
5. Open a Pull Request

## 📄 License

MIT

## 🙏 Acknowledgments

- [Model Context Protocol](https://modelcontextprotocol.io/) for the MCP specification
- [Octokit](https://github.com/octokit/octokit.js) for GitHub API integration
- [Zod](https://zod.dev/) for runtime type validation
- [TypeScript](https://www.typescriptlang.org/) for type safety
