import { ApiResponse } from './types';

// Custom Error Error để bắt các HTTP Status (400, 401, 403, 500)
export class ApiError extends Error {
  public status: number;
  public data?: unknown;

  constructor(message: string, status: number, data?: unknown) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
    this.data = data;
  }
}

/**
 * Hàm core wrap fetch API để chuẩn hoá data & error
 */
async function fetchWrapper<T>(endpoint: string, config?: RequestInit): Promise<T> {
  const defaultHeaders = {
    'Content-Type': 'application/json',
  };

  const finalConfig: RequestInit = {
    ...config,
    headers: {
      ...defaultHeaders,
      ...config?.headers,
    },
    // Nếu gọi external api khác domain, có thể cấu hình credentials: 'include' để truyền cookie
  };

  let response: Response;
  try {
    response = await fetch(endpoint, finalConfig);
  } catch (error) {
    // Bắt lỗi Network cực đoan (Đứt mạng, DNS fail...)
    throw new ApiError(error instanceof Error ? error.message : 'Network failure', 0);
  }

  // Parse JSON an toàn
  const result = await response.json().catch(() => null);

  // Fallback lấy lỗi chuẩn nếu API Backend trả về `{ error: "message" }` theo chuẩn ApiResponse
  if (!response.ok) {
    const errorMsg = result?.error || `HTTP Error ${response.status}: ${response.statusText}`;
    throw new ApiError(errorMsg, response.status, result);
  }

  // Ép kiểu chuẩn hoá theo ApiResponse
  return result as T;
}

/**
 * apiClient - Utility fetching chính của toàn bộ FE Component thay thế Axios
 */
export const apiClient = {
  // Method GET
  get: <ResponseData = unknown>(endpoint: string, options?: RequestInit) =>
    fetchWrapper<ApiResponse<ResponseData>>(endpoint, { ...options, method: 'GET' }),

  // Method POST
  post: <PayloadType = Record<string, unknown>, ResponseData = unknown>(
    endpoint: string,
    data?: PayloadType,
    options?: RequestInit
  ) =>
    fetchWrapper<ApiResponse<ResponseData>>(endpoint, {
      ...options,
      method: 'POST',
      body: data ? JSON.stringify(data) : undefined,
    }),

  // Method PUT
  put: <PayloadType = Record<string, unknown>, ResponseData = unknown>(
    endpoint: string,
    data?: PayloadType,
    options?: RequestInit
  ) =>
    fetchWrapper<ApiResponse<ResponseData>>(endpoint, {
      ...options,
      method: 'PUT',
      body: data ? JSON.stringify(data) : undefined,
    }),

  // Method PATCH
  patch: <PayloadType = Record<string, unknown>, ResponseData = unknown>(
    endpoint: string,
    data?: PayloadType,
    options?: RequestInit
  ) =>
    fetchWrapper<ApiResponse<ResponseData>>(endpoint, {
      ...options,
      method: 'PATCH',
      body: data ? JSON.stringify(data) : undefined,
    }),

  // Method DELETE
  delete: <ResponseData = unknown>(endpoint: string, options?: RequestInit) =>
    fetchWrapper<ApiResponse<ResponseData>>(endpoint, { ...options, method: 'DELETE' }),
};
