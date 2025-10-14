import { octokit } from "../../shared/index.js";

export interface CompareBranchesArgs {
  owner: string;
  repo: string;
  base: string;
  head: string;
}

export interface MergeBranchesArgs {
  owner: string;
  repo: string;
  base: string;
  head: string;
  commit_message?: string;
}

export const compareBranches = async (params: CompareBranchesArgs) => {
  try {
    const { data } = await octokit.repos.compareCommitsWithBasehead({
      owner: params.owner,
      repo: params.repo,
      basehead: `${params.base}...${params.head}`,
    });

    return {
      status: data.status,
      ahead_by: data.ahead_by,
      behind_by: data.behind_by,
      total_commits: data.total_commits,
      base_commit: {
        sha: data.base_commit.sha,
        message: data.base_commit.commit.message,
        author: data.base_commit.commit.author?.name,
        date: data.base_commit.commit.author?.date,
      },
      merge_base_commit: {
        sha: data.merge_base_commit.sha,
        message: data.merge_base_commit.commit.message,
        author: data.merge_base_commit.commit.author?.name,
        date: data.merge_base_commit.commit.author?.date,
      },
      commits: data.commits.map(commit => ({
        sha: commit.sha,
        message: commit.commit.message,
        author: commit.commit.author?.name,
        date: commit.commit.author?.date,
        url: commit.html_url,
      })),
      files: data.files?.map(file => ({
        filename: file.filename,
        status: file.status,
        additions: file.additions,
        deletions: file.deletions,
        changes: file.changes,
        patch: file.patch?.substring(0, 500) + (file.patch && file.patch.length > 500 ? '...' : ''),
      })),
    };
  } catch (error) {
    throw new Error(`Error comparing branches: ${(error as Error).message}`);
  }
};

export const mergeBranches = async (params: MergeBranchesArgs) => {
  try {
    const { data } = await octokit.repos.merge({
      owner: params.owner,
      repo: params.repo,
      base: params.base,
      head: params.head,
      commit_message: params.commit_message || `Merge ${params.head} into ${params.base}`,
    });

    return {
      sha: data.sha,
      merged: true,
      message: data.commit.message,
      author: data.commit.author?.name,
      date: data.commit.author?.date,
      url: data.html_url,
      parents: data.parents?.map(parent => ({
        sha: parent.sha,
        url: parent.html_url,
      })),
    };
  } catch (error) {
    const errorMessage = (error as any)?.response?.data?.message || (error as Error).message;
    
    if (errorMessage.includes('merge conflict')) {
      throw new Error(`Merge conflict detected: ${errorMessage}`);
    }
    if (errorMessage.includes('Nothing to merge')) {
      throw new Error(`Nothing to merge: ${params.head} is already merged into ${params.base}`);
    }
    if (errorMessage.includes('Base does not exist')) {
      throw new Error(`Base branch '${params.base}' does not exist`);
    }
    if (errorMessage.includes('Head does not exist')) {
      throw new Error(`Head branch '${params.head}' does not exist`);
    }
    
    throw new Error(`Error merging branches: ${errorMessage}`);
  }
};