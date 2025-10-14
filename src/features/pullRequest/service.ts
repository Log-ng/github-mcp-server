import { octokit } from "../../shared/index.js";

export interface CreatePullRequestArgs {
  owner: string;
  repo: string;
  title: string;
  head: string;
  base: string;
  body?: string;
  draft?: boolean;
}

export interface ListPullRequestsArgs {
  owner: string;
  repo: string;
  state?: "open" | "closed" | "all";
  head?: string;
  base?: string;
  sort?: "created" | "updated" | "popularity" | "long-running";
  direction?: "asc" | "desc";
  per_page?: number;
  page?: number;
}

export interface GetPullRequestArgs {
  owner: string;
  repo: string;
  pull_number: number;
}

export const createPullRequest = async (params: CreatePullRequestArgs) => {
  try {
    const { data } = await octokit.pulls.create({
      owner: params.owner,
      repo: params.repo,
      title: params.title,
      head: params.head,
      base: params.base,
      body: params.body,
      draft: params.draft || false,
    });
    return {
      number: data.number,
      title: data.title,
      state: data.state,
      url: data.html_url,
      head: data.head.ref,
      base: data.base.ref,
    };
  } catch (error) {
    throw new Error(`Error creating pull request: ${(error as Error).message}`);
  }
}

export const listPullRequests = async (params: ListPullRequestsArgs) => {
  try {
    const { data } = await octokit.pulls.list({
      owner: params.owner,
      repo: params.repo,
      state: params.state || "open",
      head: params.head,
      base: params.base,
      sort: params.sort || "created",
      direction: params.direction || "desc",
      per_page: params.per_page || 30,
      page: params.page || 1,
    });
    return data.map(pr => ({
      number: pr.number,
      title: pr.title,
      state: pr.state,
      url: pr.html_url,
      head: pr.head.ref,
      base: pr.base.ref,
      created_at: pr.created_at,
      updated_at: pr.updated_at,
      user: pr.user?.login,
    }));
  } catch (error) {
    throw new Error(`Error listing pull requests: ${(error as Error).message}`);
  }
}

export const getPullRequest = async (params: GetPullRequestArgs) => {
  try {
    const { data } = await octokit.pulls.get({
      owner: params.owner,
      repo: params.repo,
      pull_number: params.pull_number,
    });
    return {
      number: data.number,
      title: data.title,
      body: data.body,
      state: data.state,
      url: data.html_url,
      head: data.head.ref,
      base: data.base.ref,
      created_at: data.created_at,
      updated_at: data.updated_at,
      user: data.user?.login,
      mergeable: data.mergeable,
    };
  } catch (error) {
    throw new Error(`Error getting pull request: ${(error as Error).message}`);
  }
}
