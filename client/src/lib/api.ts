/**
 * API Configuration and Base Service
 * Handles all API communication with proper error handling and type safety
 */

// Environment configuration
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';

// API Response interfaces
export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
}

export interface ApiListResponse<T> {
  success: boolean;
  data: T[];
  message?: string;
  total?: number;
}

export interface ApiError {
  success: false;
  message: string;
  error?: string;
  statusCode?: number;
}

// Custom error class for API errors
export class ApiException extends Error {
  public statusCode: number;
  public error?: string;

  constructor(message: string, statusCode: number = 500, error?: string) {
    super(message);
    this.name = 'ApiException';
    this.statusCode = statusCode;
    this.error = error;
  }
}

// Request configuration interface
interface RequestConfig extends RequestInit {
  timeout?: number;
}

/**
 * Base API service class with common functionality
 */
class ApiService {
  private baseUrl: string;
  private defaultTimeout: number = 10000; // 10 seconds

  constructor(baseUrl: string) {
    this.baseUrl = baseUrl;
  }

  /**
   * Make HTTP request with timeout and error handling
   */
  private async request<T>(
    endpoint: string,
    config: RequestConfig = {}
  ): Promise<T> {
    const { timeout = this.defaultTimeout, ...restConfig } = config;
    
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), timeout);

    try {
      const response = await fetch(`${this.baseUrl}${endpoint}`, {
        ...restConfig,
        signal: controller.signal,
        headers: {
          'Content-Type': 'application/json',
          ...restConfig.headers,
        },
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        let errorMessage = `HTTP ${response.status}: ${response.statusText}`;
        let errorData = null;

        try {
          errorData = await response.json();
          errorMessage = errorData.message || errorMessage;
        } catch {
          // If response is not JSON, use the default error message
        }

        throw new ApiException(errorMessage, response.status, errorData?.error);
      }

      const data = await response.json();
      return data;
    } catch (error) {
      clearTimeout(timeoutId);

      if (error.name === 'AbortError') {
        throw new ApiException('Request timeout', 408);
      }

      if (error instanceof ApiException) {
        throw error;
      }

      // Network or other errors
      throw new ApiException(
        error.message || 'Network error occurred',
        0,
        'NETWORK_ERROR'
      );
    }
  }

  /**
   * GET request
   */
  async get<T>(endpoint: string, config?: RequestConfig): Promise<T> {
    return this.request<T>(endpoint, { ...config, method: 'GET' });
  }

  /**
   * POST request
   */
  async post<T>(
    endpoint: string,
    data?: any,
    config?: RequestConfig
  ): Promise<T> {
    return this.request<T>(endpoint, {
      ...config,
      method: 'POST',
      body: data ? JSON.stringify(data) : undefined,
    });
  }

  /**
   * PUT request
   */
  async put<T>(
    endpoint: string,
    data?: any,
    config?: RequestConfig
  ): Promise<T> {
    return this.request<T>(endpoint, {
      ...config,
      method: 'PUT',
      body: data ? JSON.stringify(data) : undefined,
    });
  }

  /**
   * DELETE request
   */
  async delete<T>(endpoint: string, config?: RequestConfig): Promise<T> {
    return this.request<T>(endpoint, { ...config, method: 'DELETE' });
  }

  /**
   * Health check endpoint
   */
  async healthCheck(): Promise<{ status: string; message: string }> {
    return this.get('/health');
  }
}

// Create and export API service instance
export const apiService = new ApiService(API_BASE_URL);

// Export base URL for use in other modules
export { API_BASE_URL };
