import { HandlerResponse, AppError, ValidationError, GitHubApiError } from '../types/index.js';

export * from './logger.js';

export const createSuccessResponse = (data: any): HandlerResponse => ({
  content: [
    {
      type: "text",
      text: JSON.stringify(data, null, 2),
    },
  ],
});

export const createErrorResponse = (error: string, isError: boolean = true): HandlerResponse => ({
  content: [
    {
      type: "text",
      text: error,
    },
  ],
  isError,
});

export const handleError = (error: unknown): HandlerResponse => {
  console.error('Handler error:', error);
  
  if (error instanceof AppError) {
    return createErrorResponse(`Error: ${error.message}`, true);
  }
  
  if (error instanceof Error) {
    return createErrorResponse(`Error: ${error.message}`, true);
  }
  
  return createErrorResponse(`Unknown error: ${String(error)}`, true);
};

export const safeJsonParse = <T>(jsonString: string, fallback: T): T => {
  try {
    return JSON.parse(jsonString);
  } catch {
    return fallback;
  }
};

export const sanitizeInput = (input: string): string => {
  return input.trim().replace(/[<>]/g, '');
};

export const validateRequiredFields = (data: Record<string, any>, requiredFields: string[]): void => {
  const missingFields = requiredFields.filter(field => !data[field]);
  if (missingFields.length > 0) {
    throw new ValidationError(`Missing required fields: ${missingFields.join(', ')}`);
  }
};

export const handleGitHubError = (error: any): never => {
  if (error.status === 404) {
    throw new GitHubApiError('Resource not found', error);
  }
  if (error.status === 403) {
    throw new GitHubApiError('Access forbidden - check your GitHub token permissions', error);
  }
  if (error.status === 401) {
    throw new GitHubApiError('Unauthorized - check your GitHub token', error);
  }
  if (error.status >= 400 && error.status < 500) {
    throw new GitHubApiError(`Client error: ${error.message}`, error);
  }
  if (error.status >= 500) {
    throw new GitHubApiError(`GitHub API server error: ${error.message}`, error);
  }
  
  throw new GitHubApiError(`GitHub API error: ${error.message}`, error);
};

export const createRateLimitHandler = (maxRequests: number = 100, windowMs: number = 60000) => {
  const requests: number[] = [];
  
  return (): boolean => {
    const now = Date.now();
    const windowStart = now - windowMs;
    
    while (requests.length > 0 && requests[0] < windowStart) {
      requests.shift();
    }
    
    if (requests.length >= maxRequests) {
      throw new AppError('Rate limit exceeded', 429);
    }
    
    requests.push(now);
    return true;
  };
};

export const withRetry = async <T>(
  fn: () => Promise<T>,
  maxRetries: number = 3,
  delayMs: number = 1000
): Promise<T> => {
  let lastError: Error;
  
  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      return await fn();
    } catch (error) {
      lastError = error as Error;
      
      if (attempt === maxRetries) {
        throw lastError;
      }
      
      const delay = delayMs * Math.pow(2, attempt - 1);
      await new Promise(resolve => setTimeout(resolve, delay));
    }
  }
  
  throw lastError!;
};
