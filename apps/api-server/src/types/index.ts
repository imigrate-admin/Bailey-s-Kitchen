export interface ErrorResponse {
  error: string;
  statusCode: number;
  details?: unknown;
}

export interface SuccessResponse<T> {
  data: T;
  statusCode: number;
}

