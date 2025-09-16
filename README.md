# GitHub MCP Server

A Model Context Protocol (MCP) server that provides comprehensive GitHub API integration for AI assistants and applications.

## Features

This MCP server provides tools for:

### Repository Management
- Get repository information
- List repositories for users/organizations
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

## Installation

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

4. Edit `.env` and add your GitHub token:
```
GITHUB_TOKEN=your_github_token_here
```

## Getting a GitHub Token

1. Go to [GitHub Settings > Personal Access Tokens](https://github.com/settings/tokens)
2. Click "Generate new token (classic)"
3. Select the following scopes:
   - `repo` (Full control of private repositories)
   - `read:user` (Read user profile data)
   - `read:org` (Read org and team membership)
4. Copy the generated token to your `.env` file

## Usage

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

## Available Tools

The server provides the following MCP tools:

- `get_repo_info` - Get repository information
- `list_repos` - List repositories
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

## Project Structure

```
src/
├── schemas/           # Zod validation schemas
│   ├── common.ts     # Common schemas
│   ├── repo.ts       # Repository schemas
│   ├── issue.ts      # Issue schemas
│   ├── pullRequest.ts # Pull request schemas
│   ├── commit.ts     # Commit schemas
│   ├── file.ts       # File schemas
│   ├── search.ts     # Search schemas
│   └── index.ts      # Schema exports
├── service/          # GitHub API services
│   ├── common.ts     # Common Octokit setup
│   ├── repo.ts       # Repository services
│   ├── issue.ts      # Issue services
│   ├── pullRequest.ts # Pull request services
│   ├── commit.ts     # Commit services
│   ├── file.ts       # File services
│   ├── search.ts     # Search services
│   └── index.ts      # Service exports
└── index.ts          # MCP server implementation
```

## License

MIT
