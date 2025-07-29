import { apiClient } from './api';
import { SoftwareType, CreateSoftwareTypeRequest } from '@/types/admin';

export class SoftwareTypesService {
  private readonly endpoint = '/software-types';

  async getAll(): Promise<SoftwareType[]> {
    return apiClient.get(this.endpoint);
  }

  async getById(id: number): Promise<SoftwareType> {
    return apiClient.get(`${this.endpoint}/${id}`);
  }

  async create(data: CreateSoftwareTypeRequest): Promise<SoftwareType> {
    return apiClient.post(this.endpoint, data);
  }

  async update(id: number, data: Partial<CreateSoftwareTypeRequest>): Promise<SoftwareType> {
    return apiClient.put(`${this.endpoint}/${id}`, data);
  }

  async delete(id: number): Promise<void> {
    return apiClient.delete(`${this.endpoint}/${id}`);
  }
}

export const softwareTypesService = new SoftwareTypesService();
