import { octokit } from "../../shared";
import { logger, withRetry } from "../../utils";
import { retryConfig } from "../../config";

export interface GetRepoInfoArgs {
  owner: string;
  repo: string;
}

export interface ListReposArgs {
  username?: string;
  type?: "all" | "owner" | "public" | "private" | "member";
  sort?: "created" | "updated" | "pushed" | "full_name";
  direction?: "asc" | "desc";
  per_page?: number;
  page?: number;
}

export interface CreateBranchArgs {
  owner: string;
  repo: string;
  branch: string;
  base_branch?: string;
}

export const getRepoInfo = async (owner: string, repo: string) => {
  const startTime = Date.now();
  logger.debug(`Getting repo info for ${owner}/${repo}`);
  
  try {
    const result = await withRetry(async () => {
      const { data } = await octokit.repos.get({ owner, repo });
      return {
        name: data.full_name,
        description: data.description,
        stars: data.stargazers_count,
        forks: data.forks_count,
        language: data.language,
        created_at: data.created_at,
        updated_at: data.updated_at,
        clone_url: data.clone_url,
        html_url: data.html_url,
      };
    }, retryConfig.maxRetries, retryConfig.delayMs);
    
    const duration = Date.now() - startTime;
    logger.info(`Successfully retrieved repo info for ${owner}/${repo}`, { duration: `${duration}ms` });
    return result;
  } catch (error) {
    const duration = Date.now() - startTime;
    logger.error(`Failed to get repo info for ${owner}/${repo}`, { error, duration: `${duration}ms` });
    throw error;
  }
}

export const listRepos = async (params: ListReposArgs) => {
  const startTime = Date.now();
  logger.debug(`Listing repos for user: ${params.username || 'authenticated user'}`);
  
  try {
    const result = await withRetry(async () => {
      const { data } = await octokit.repos.listForUser({
        username: params.username || "",
        type: (params.type === "all" || params.type === "owner" || params.type === "member") ? params.type : "all",
        sort: params.sort || "updated",
        direction: params.direction || "desc",
        per_page: params.per_page || 30,
        page: params.page || 1,
      });
      return data.map(repo => ({
        name: repo.full_name,
        description: repo.description,
        stars: repo.stargazers_count,
        forks: repo.forks_count,
        language: repo.language,
        created_at: repo.created_at,
        updated_at: repo.updated_at,
        html_url: repo.html_url,
      }));
    }, retryConfig.maxRetries, retryConfig.delayMs);
    
    const duration = Date.now() - startTime;
    logger.info(`Successfully listed ${result.length} repos`, { duration: `${duration}ms` });
    return result;
  } catch (error) {
    const duration = Date.now() - startTime;
    logger.error(`Failed to list repos`, { error, duration: `${duration}ms` });
    throw error;
  }
}

export const createBranch = async (params: CreateBranchArgs) => {
  const startTime = Date.now();
  logger.debug(`Creating branch ${params.branch} from ${params.base_branch || 'main'} in ${params.owner}/${params.repo}`);
  
  try {
    const result = await withRetry(async () => {
      const { data: baseBranchData } = await octokit.repos.getBranch({
        owner: params.owner,
        repo: params.repo,
        branch: params.base_branch || "main",
      });

      const { data } = await octokit.git.createRef({
        owner: params.owner,
        repo: params.repo,
        ref: `refs/heads/${params.branch}`,
        sha: baseBranchData.commit.sha,
      });

      return {
        ref: data.ref,
        sha: data.object.sha,
        url: data.url,
        branch_name: params.branch,
        base_branch: params.base_branch || "main",
      };
    }, retryConfig.maxRetries, retryConfig.delayMs);
    
    const duration = Date.now() - startTime;
    logger.info(`Successfully created branch ${params.branch}`, { duration: `${duration}ms` });
    return result;
  } catch (error) {
    const duration = Date.now() - startTime;
    logger.error(`Failed to create branch ${params.branch}`, { error, duration: `${duration}ms` });
    throw error;
  }
}
