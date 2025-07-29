import { apiClient } from './api';
import { TechStack, CreateTechStackRequest } from '@/types/admin';

export class TechStacksService {
  private readonly endpoint = '/tech-stacks';

  async getAll(): Promise<TechStack[]> {
    return apiClient.get(this.endpoint);
  }

  async getById(id: number): Promise<TechStack> {
    return apiClient.get(`${this.endpoint}/${id}`);
  }

  async create(data: CreateTechStackRequest): Promise<TechStack> {
    return apiClient.post(this.endpoint, data);
  }

  async update(id: number, data: Partial<CreateTechStackRequest>): Promise<TechStack> {
    return apiClient.put(`${this.endpoint}/${id}`, data);
  }

  async delete(id: number): Promise<void> {
    return apiClient.delete(`${this.endpoint}/${id}`);
  }
}

export const techStacksService = new TechStacksService();
