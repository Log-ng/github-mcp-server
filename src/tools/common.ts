import { Octokit } from "@octokit/rest";
import dotenv from "dotenv";

dotenv.config();

export const octokit: Octokit = new Octokit({ auth: process.env["GITHUB_TOKEN"] as string });
