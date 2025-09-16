import { octokit } from "./common.js";

export async function getRepoInfo(owner: string, repo: string) {
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

export async function listRepos(params: {
  username?: string;
  type?: "all" | "owner" | "public" | "private" | "member";
  sort?: "created" | "updated" | "pushed" | "full_name";
  direction?: "asc" | "desc";
  per_page?: number;
  page?: number;
}) {
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
