/**
 * Response Normalizer Utility
 *
 * Handles different backend response structures and normalizes them
 * for consistent frontend consumption.
 */

export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  message?: string;
  error?: {
    code?: string;
    message?: string;
    details?: any;
  };
}

/**
 * Normalize API response to a consistent structure
 * Handles various backend response formats:
 * 1. { data: {...}, success: true }
 * 2. { success: true, data: {...} }
 * 3. Direct data response: {...}
 */
export const normalizeResponse = <T = any>(response: any): ApiResponse<T> => {
  // If response already has success field, return as is
  if (typeof response.success === 'boolean') {
    return {
      success: response.success,
      data: response.data || response,
      message: response.message,
      error: response.error
    };
  }

  // If response has a data field, assume success
  if (response.data !== undefined) {
    return {
      success: true,
      data: response.data,
      message: response.message
    };
  }

  // Otherwise, treat entire response as data
  return {
    success: true,
    data: response as T
  };
};

/**
 * Extract data from various response structures
 */
export const extractData = <T = any>(response: any): T => {
  // Try to get data from nested structures
  if (response?.data?.data) {
    return response.data.data;
  }

  if (response?.data) {
    return response.data;
  }

  return response;
};

/**
 * Check if response indicates success
 */
export const isSuccessResponse = (response: any): boolean => {
  // Check explicit success field
  if (typeof response?.success === 'boolean') {
    return response.success;
  }

  // Check HTTP-like status codes
  if (response?.status) {
    return response.status >= 200 && response.status < 300;
  }

  // If no error field, assume success
  return !response?.error;
};

/**
 * Extract error message from response
 */
export const extractErrorMessage = (error: any): string => {
  // Try various error message locations
  if (typeof error === 'string') {
    return error;
  }

  if (error?.response?.data?.message) {
    return error.response.data.message;
  }

  if (error?.response?.data?.error?.message) {
    return error.response.data.error.message;
  }

  if (error?.message) {
    return error.message;
  }

  if (error?.error?.message) {
    return error.error.message;
  }

  return 'An unexpected error occurred';
};
