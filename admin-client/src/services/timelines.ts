import { apiClient } from './api';
import { Timeline, CreateTimelineRequest } from '@/types/admin';

export class TimelinesService {
  private readonly endpoint = '/timelines';

  async getAll(): Promise<Timeline[]> {
    return apiClient.get(this.endpoint);
  }

  async create(data: CreateTimelineRequest): Promise<Timeline> {
    return apiClient.post(this.endpoint, data);
  }

  async update(id: number, data: Partial<CreateTimelineRequest>): Promise<Timeline> {
    return apiClient.put(`${this.endpoint}/${id}`, data);
  }

  async delete(id: number): Promise<void> {
    return apiClient.delete(`${this.endpoint}/${id}`);
  }
}

export const timelinesService = new TimelinesService();
