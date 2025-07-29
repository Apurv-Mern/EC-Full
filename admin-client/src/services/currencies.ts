import { apiClient } from './api';
import { Currency, CreateCurrencyRequest } from '@/types/admin';

export class CurrenciesService {
  private readonly endpoint = '/currencies';

  async getAll(): Promise<Currency[]> {
    return apiClient.get(this.endpoint);
  }

  async getById(id: number): Promise<Currency> {
    return apiClient.get(`${this.endpoint}/${id}`);
  }

  async create(data: CreateCurrencyRequest): Promise<Currency> {
    return apiClient.post(this.endpoint, data);
  }

  async update(id: number, data: Partial<CreateCurrencyRequest>): Promise<Currency> {
    return apiClient.put(`${this.endpoint}/${id}`, data);
  }

  async delete(id: number): Promise<void> {
    return apiClient.delete(`${this.endpoint}/${id}`);
  }
}

export const currenciesService = new CurrenciesService();
