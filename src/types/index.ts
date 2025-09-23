import { z } from "zod";

export type HandlerFunction = (args: unknown) => Promise<HandlerResponse>;
export type HandlerResponse = {
  content: Array<{
    type: "text";
    text: string;
  }>;
  isError?: boolean;
};

export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export class AppError extends Error {
  constructor(
    message: string,
    public statusCode: number = 500,
    public code?: string
  ) {
    super(message);
    this.name = 'AppError';
  }
}

export class ValidationError extends AppError {
  constructor(message: string, public field?: string) {
    super(message, 400, 'VALIDATION_ERROR');
    this.name = 'ValidationError';
  }
}

export class GitHubApiError extends AppError {
  constructor(message: string, public originalError?: any) {
    super(message, 500, 'GITHUB_API_ERROR');
    this.name = 'GitHubApiError';
  }
}

export interface PaginationParams {
  per_page?: number;
  page?: number;
}

export interface SortParams {
  sort?: string;
  direction?: 'asc' | 'desc';
}

export interface BaseRepoParams {
  owner: string;
  repo: string;
}

export const BaseRepoParamsSchema = z.object({
  owner: z.string().min(1, "Owner is required"),
  repo: z.string().min(1, "Repository name is required"),
});

export const PaginationSchema = z.object({
  per_page: z.number().min(1).max(100).default(30),
  page: z.number().min(1).default(1),
});

export const SortSchema = z.object({
  sort: z.string().optional(),
  direction: z.enum(['asc', 'desc']).default('desc'),
});
