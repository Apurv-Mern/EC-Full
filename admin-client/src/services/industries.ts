import { apiClient } from './api';
import { Industry, CreateIndustryRequest } from '@/types/admin';

export class IndustriesService {
  private readonly endpoint = '/industries';

  async getAll(): Promise<Industry[]> {
    return apiClient.get(this.endpoint);
  }

  async getById(id: number): Promise<Industry> {
    return apiClient.get(`${this.endpoint}/${id}`);
  }

  async create(data: CreateIndustryRequest): Promise<Industry> {
    return apiClient.post(this.endpoint, data);
  }

  async update(id: number, data: Partial<CreateIndustryRequest>): Promise<Industry> {
    return apiClient.put(`${this.endpoint}/${id}`, data);
  }

  async delete(id: number): Promise<void> {
    return apiClient.delete(`${this.endpoint}/${id}`);
  }
}

export const industriesService = new IndustriesService();
