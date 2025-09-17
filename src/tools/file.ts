import { octokit } from "./common.js";

export const getFileContent = async (params: {
  owner: string;
  repo: string;
  path: string;
  ref?: string;
}) => {
  try {
    const { data } = await octokit.repos.getContent({
      owner: params.owner,
      repo: params.repo,
      path: params.path,
      ref: params.ref,
    });
    
    if (Array.isArray(data)) {
      return data.map(item => ({
        name: item.name,
        path: item.path,
        type: item.type,
        size: item.size,
        download_url: item.download_url,
      }));
    } else {
      return {
        name: data.name,
        path: data.path,
        type: data.type,
        size: data.size,
        content: data.type === 'file' ? Buffer.from(data.content || '', 'base64').toString('utf-8') : undefined,
        download_url: data.download_url,
      };
    }
  } catch (error) {
    throw new Error(`Error getting file content: ${(error as Error).message}`);
  }
}

export const createOrUpdateFile = async(params: {
  owner: string;
  repo: string;
  path: string;
  message: string;
  content: string;
  branch?: string;
  sha?: string;
}) => {
  try {
    const { data } = await octokit.repos.createOrUpdateFileContents({
      owner: params.owner,
      repo: params.repo,
      path: params.path,
      message: params.message,
      content: Buffer.from(params.content).toString('base64'),
      branch: params.branch,
      sha: params.sha,
    });
    return {
      sha: data.commit.sha,
      message: data.commit.message,
      url: data.content?.html_url || '',
    };
  } catch (error) {
    throw new Error(`Error creating/updating file: ${(error as Error).message}`);
  }
}
