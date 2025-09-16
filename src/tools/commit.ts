import { octokit } from "./common.js";

export const listCommits = async (params: {
  owner: string;
  repo: string;
  sha?: string;
  path?: string;
  author?: string;
  since?: string;
  until?: string;
  per_page?: number;
  page?: number;
}) => {
  try {
    const { data } = await octokit.repos.listCommits({
      owner: params.owner,
      repo: params.repo,
      sha: params.sha,
      path: params.path,
      author: params.author,
      since: params.since,
      until: params.until,
      per_page: params.per_page || 30,
      page: params.page || 1,
    });
    return data.map(commit => ({
      sha: commit.sha,
      message: commit.commit.message,
      author: commit.commit.author?.name,
      date: commit.commit.author?.date,
      url: commit.html_url,
    }));
  } catch (error) {
    throw new Error(`Error listing commits: ${(error as Error).message}`);
  }
};

export const getCommit = async (params: {
  owner: string;
  repo: string;
  ref: string;
}) => {
  try {
    const { data } = await octokit.repos.getCommit({
      owner: params.owner,
      repo: params.repo,
      ref: params.ref,
    });
    return {
      sha: data.sha,
      message: data.commit.message,
      author: data.commit.author?.name,
      date: data.commit.author?.date,
      url: data.html_url,
      stats: data.stats,
      files: data.files?.map(file => ({
        filename: file.filename,
        status: file.status,
        additions: file.additions,
        deletions: file.deletions,
      })),
    };
  } catch (error) {
    throw new Error(`Error getting commit: ${(error as Error).message}`);
  }
};
