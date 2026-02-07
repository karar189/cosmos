import axios, { AxiosError, AxiosRequestConfig, AxiosResponse } from 'axios';

/**
 * Standard API Error structure
 */
export interface ApiError {
  message: string;
  status?: number;
  code?: string;
  details?: unknown;
}

/**
 * Standard API Response wrapper
 */
export interface ApiResponse<T = unknown> {
  data: T;
  status: number;
  statusText: string;
  headers: Record<string, string>;
}


/**
 * Transform axios response to standard API response
 */
function transformResponse<T>(response: AxiosResponse<T>): ApiResponse<T> {
  return {
    data: response.data,
    status: response.status,
    statusText: response.statusText,
    headers: response.headers as Record<string, string>,
  };
}

/**
 * Handle and transform axios errors to standard API error
 */
function handleApiError(error: unknown): never {
  if (axios.isAxiosError(error)) {
    const axiosError = error as AxiosError;
    
    // Safely extract error message from response data
    const responseData = axiosError.response?.data as { message?: string } | undefined;
    
    const apiError: ApiError = {
      message: responseData?.message || axiosError.message || 'An unknown error occurred',
      status: axiosError.response?.status,
      code: axiosError.code,
      details: axiosError.response?.data,
    };

    throw apiError;
  }

  // Handle non-axios errors
  const apiError: ApiError = {
    message: error instanceof Error ? error.message : 'An unknown error occurred',
  };

  throw apiError;
}

/**
 * GET request with error handling and automatic proxying
 * @param url - Request URL (can be external, will be proxied automatically)
 * @param config - Axios request configuration
 * @returns Promise with standard API response
 */
export async function get<T = unknown>(
  url: string,
  config?: AxiosRequestConfig
): Promise<ApiResponse<T>> {
  try {
    const response = await axios.get<T>(url, config);
    return transformResponse(response);
  } catch (error) {
    handleApiError(error);
  }
}

/**
 * POST request with error handling
 * @param url - Request URL
 * @param data - Request body data
 * @param config - Axios request configuration
 * @returns Promise with standard API response
 */
export async function post<T = unknown, D = unknown>(
  url: string,
  data?: D,
  config?: AxiosRequestConfig
): Promise<ApiResponse<T>> {
  try {
    const response = await axios.post<T>(url, data, config);
    return transformResponse(response);
  } catch (error) {
    handleApiError(error);
  }
}

/**
 * PUT request with error handling
 * @param url - Request URL
 * @param data - Request body data
 * @param config - Axios request configuration
 * @returns Promise with standard API response
 */
export async function put<T = unknown, D = unknown>(
  url: string,
  data?: D,
  config?: AxiosRequestConfig
): Promise<ApiResponse<T>> {
  try {
    const response = await axios.put<T>(url, data, config);
    return transformResponse(response);
  } catch (error) {
    handleApiError(error);
  }
}

/**
 * PATCH request with error handling
 * @param url - Request URL
 * @param data - Request body data
 * @param config - Axios request configuration
 * @returns Promise with standard API response
 */
export async function patch<T = unknown, D = unknown>(
  url: string,
  data?: D,
  config?: AxiosRequestConfig
): Promise<ApiResponse<T>> {
  try {
    const response = await axios.patch<T>(url, data, config);
    return transformResponse(response);
  } catch (error) {
    handleApiError(error);
  }
}

/**
 * DELETE request with error handling
 * @param url - Request URL
 * @param config - Axios request configuration
 * @returns Promise with standard API response
 */
export async function del<T = unknown>(
  url: string,
  config?: AxiosRequestConfig
): Promise<ApiResponse<T>> {
  try {
    const response = await axios.delete<T>(url, config);
    return transformResponse(response);
  } catch (error) {
    handleApiError(error);
  }
}

/**
 * Export as default object for easier imports
 */
export const api = {
  get,
  post,
  put,
  patch,
  delete: del,
};

export default api;
