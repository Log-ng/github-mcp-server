import { Octokit } from "@octokit/rest";
import { githubConfig } from "../config";

export const octokit: Octokit = new Octokit({
  auth: githubConfig.auth,
  userAgent: githubConfig.userAgent,
  request: {
    timeout: githubConfig.timeout,
  },
});