import { octokit } from "./common.js";

export const getRepoInfo = async (owner: string, repo: string) => {
  try {
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
  } catch (error) {
    throw new Error(`Error getting repo info: ${(error as Error).message}`);
  }
}

export const listRepos = async (params: {
  username?: string;
  type?: "all" | "owner" | "public" | "private" | "member";
  sort?: "created" | "updated" | "pushed" | "full_name";
  direction?: "asc" | "desc";
  per_page?: number;
  page?: number;
}) => {
  try {
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
  } catch (error) {
    throw new Error(`Error listing repos: ${(error as Error).message}`);
  }
}

export const createBranch = async (params: {
  owner: string;
  repo: string;
  branch: string;
  base_branch?: string;
}) => {
  try {
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
  } catch (error) {
    throw new Error(`Error creating branch: ${(error as Error).message}`);
  }
}
