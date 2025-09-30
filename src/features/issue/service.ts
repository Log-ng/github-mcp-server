import { octokit } from "../../shared";

export interface CreateIssueArgs {
  owner: string;
  repo: string;
  title: string;
  body?: string;
  labels?: string[];
  assignees?: string[];
}

export interface ListIssuesArgs {
  owner: string;
  repo: string;
  state?: "open" | "closed" | "all";
  labels?: string;
  sort?: "created" | "updated" | "comments";
  direction?: "asc" | "desc";
  per_page?: number;
  page?: number;
}

export interface GetIssueArgs {
  owner: string;
  repo: string;
  issue_number: number;
}

export const createIssue = async (params: CreateIssueArgs) => {
  try {
    const { data } = await octokit.issues.create({
      owner: params.owner,
      repo: params.repo,
      title: params.title,
      body: params.body,
      labels: params.labels,
      assignees: params.assignees,
    });
    return {
      issueId: data.id,
      number: data.number,
      url: data.html_url,
      title: data.title,
      state: data.state,
    };
  } catch (error) {
    throw new Error(`Error creating issue: ${(error as Error).message}`);
  }
}

export const listIssues = async (params: ListIssuesArgs) => {
  try {
    const { data } = await octokit.issues.listForRepo({
      owner: params.owner,
      repo: params.repo,
      state: params.state || "open",
      labels: params.labels,
      sort: params.sort || "created",
      direction: params.direction || "desc",
      per_page: params.per_page || 30,
      page: params.page || 1,
    });
    return data.map(issue => ({
      number: issue.number,
      title: issue.title,
      state: issue.state,
      url: issue.html_url,
      created_at: issue.created_at,
      updated_at: issue.updated_at,
      user: issue.user?.login,
      labels: issue.labels?.map(label => typeof label === 'string' ? label : label.name),
    }));
  } catch (error) {
    throw new Error(`Error listing issues: ${(error as Error).message}`);
  }
}

export const getIssue = async (params: GetIssueArgs) => {
  try {
    const { data } = await octokit.issues.get({
      owner: params.owner,
      repo: params.repo,
      issue_number: params.issue_number,
    });
    return {
      number: data.number,
      title: data.title,
      body: data.body,
      state: data.state,
      url: data.html_url,
      created_at: data.created_at,
      updated_at: data.updated_at,
      user: data.user?.login,
      labels: data.labels?.map(label => typeof label === 'string' ? label : label.name),
      assignees: data.assignees?.map(assignee => assignee.login),
    };
  } catch (error) {
    throw new Error(`Error getting issue: ${(error as Error).message}`);
  }
}
