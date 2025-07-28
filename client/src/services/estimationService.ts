/**
 * Estimation API Service
 * Handles all estimation-related API calls
 */

import { apiService, ApiResponse, ApiListResponse } from '@/lib/api';
import {
  StaticData,
  Estimation,
  CreateEstimationRequest,
  EstimationEndpoints,
} from '@/types/api';

/**
 * Estimation service class implementing all estimation-related API calls
 */
class EstimationService implements EstimationEndpoints {
  private readonly basePath = '/estimations';

  /**
   * Get static data (industries, software types, features, etc.)
   */
  async getStaticData(): Promise<StaticData> {
    const response = await apiService.get<ApiResponse<StaticData>>(
      `${this.basePath}/data-for-estimation`
    );
    return response.data;
  }

  /**
   * Create a new estimation
   */
  async createEstimation(data: CreateEstimationRequest): Promise<Estimation> {
    const response = await apiService.post<ApiResponse<Estimation>>(
      this.basePath,
      data
    );
    return response.data;
  }

  /**
   * Get all estimations
   */
  async getEstimations(): Promise<Estimation[]> {
    const response = await apiService.get<ApiListResponse<Estimation>>(
      this.basePath
    );
    return response.data;
  }

  /**
   * Get a single estimation by ID
   */
  async getEstimation(id: number): Promise<Estimation> {
    const response = await apiService.get<ApiResponse<Estimation>>(
      `${this.basePath}/${id}`
    );
    return response.data;
  }

  /**
   * Update an estimation
   */
  async updateEstimation(
    id: number,
    data: Partial<Estimation>
  ): Promise<Estimation> {
    const response = await apiService.put<ApiResponse<Estimation>>(
      `${this.basePath}/${id}`,
      data
    );
    return response.data;
  }

  /**
   * Delete an estimation
   */
  async deleteEstimation(id: number): Promise<void> {
    await apiService.delete<ApiResponse<{}>>(
      `${this.basePath}/${id}`
    );
  }

  /**
   * Create estimation with contact information (sends email)
   */
  async createEstimationWithContact(data: CreateEstimationRequest): Promise<Estimation> {
    if (!data.contactEmail || !data.contactName) {
      throw new Error('Contact information is required for email estimation');
    }

    return this.createEstimation(data);
  }

  /**
   * Get estimation by ID and mark as viewed
   */
  async viewEstimation(id: number): Promise<Estimation> {
    const estimation = await this.getEstimation(id);
    
    // Update status to viewed if it's still draft or sent
    if (estimation.status === 'draft' || estimation.status === 'sent') {
      return this.updateEstimation(id, { status: 'viewed' });
    }

    return estimation;
  }

  /**
   * Mark estimation as contacted
   */
  async markAsContacted(id: number): Promise<Estimation> {
    return this.updateEstimation(id, { status: 'contacted' });
  }
}

// Create and export service instance
export const estimationService = new EstimationService();

// Export individual methods for convenience
export const {
  getStaticData,
  createEstimation,
  getEstimations,
  getEstimation,
  updateEstimation,
  deleteEstimation,
} = estimationService;
