import { apiClient } from './api';
import { Feature, CreateFeatureRequest } from '@/types/admin';

export class FeaturesService {
  private readonly endpoint = '/features';

  async getAll(): Promise<Feature[]> {
    return apiClient.get(this.endpoint);
  }

  async getById(id: number): Promise<Feature> {
    return apiClient.get(`${this.endpoint}/${id}`);
  }

  async create(data: CreateFeatureRequest): Promise<Feature> {
    return apiClient.post(this.endpoint, data);
  }

  async update(id: number, data: Partial<CreateFeatureRequest>): Promise<Feature> {
    return apiClient.put(`${this.endpoint}/${id}`, data);
  }

  async delete(id: number): Promise<void> {
    return apiClient.delete(`${this.endpoint}/${id}`);
  }
}

export const featuresService = new FeaturesService();
