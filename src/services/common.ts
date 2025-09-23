import { Octokit } from "@octokit/rest";
import { githubConfig } from "../config/index.js";

export const octokit: Octokit = new Octokit({
  auth: githubConfig.auth,
  userAgent: githubConfig.userAgent,
  request: {
    timeout: githubConfig.timeout,
  },
});
