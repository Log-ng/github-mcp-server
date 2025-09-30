import { octokit } from "../../shared";

export interface SearchReposArgs {
  q: string;
  sort?: "stars" | "forks" | "help-wanted-issues" | "updated";
  order?: "asc" | "desc";
  per_page?: number;
  page?: number;
}

export interface SearchIssuesArgs {
  q: string;
  sort?: "comments" | "reactions" | "reactions-+1" | "reactions--1" | "reactions-smile" | "reactions-thinking_face" | "reactions-heart" | "reactions-tada" | "interactions" | "created" | "updated";
  order?: "asc" | "desc";
  per_page?: number;
  page?: number;
}

export const searchRepos = async (params: SearchReposArgs) => {
  try {
    const { data } = await octokit.search.repos({
      q: params.q,
      sort: params.sort,
      order: params.order || "desc",
      per_page: params.per_page || 30,
      page: params.page || 1,
    });
    return data.items.map(repo => ({
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
    throw new Error(`Error searching repos: ${(error as Error).message}`);
  }
}

export const searchIssues = async (params: SearchIssuesArgs) => {
  try {
    const { data } = await octokit.search.issuesAndPullRequests({
      q: params.q,
      sort: params.sort,
      order: params.order || "desc",
      per_page: params.per_page || 30,
      page: params.page || 1,
    });
    return data.items.map(issue => ({
      number: issue.number,
      title: issue.title,
      state: issue.state,
      url: issue.html_url,
      created_at: issue.created_at,
      updated_at: issue.updated_at,
      user: issue.user?.login,
      repository_url: issue.repository_url,
    }));
  } catch (error) {
    throw new Error(`Error searching issues: ${(error as Error).message}`);
  }
}
