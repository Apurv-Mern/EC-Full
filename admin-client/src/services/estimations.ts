import { apiClient } from './api';
import { Estimation } from '@/types/admin';

export class EstimationsService {
  private readonly endpoint = '/estimations';

  async getAll(): Promise<Estimation[]> {
    const response = await apiClient.get(this.endpoint);
    // Server returns { success: true, count: number, data: Estimation[] }
    // The server now provides properly transformed data
    return response.data || [];
  }

  async getById(id: number): Promise<Estimation> {
    const response = await apiClient.get(`${this.endpoint}/${id}`);
    // Server returns { success: true, data: Estimation }
    return response.data;
  }

  async updateStatus(id: number, status: 'draft' | 'sent' | 'accepted' | 'rejected'): Promise<Estimation> {
    const response = await apiClient.put(`${this.endpoint}/${id}`, { status });
    // Server returns { success: true, data: Estimation }
    // For status update, we need to transform the raw server response
    const estimation = response.data;
    return {
      id: estimation.id,
      industries: Array.isArray(estimation.industries) 
        ? estimation.industries 
        : JSON.parse(estimation.industries || '[]'),
      softwareType: typeof estimation.softwareType === 'string' 
        ? (estimation.softwareType.startsWith('[') 
          ? JSON.parse(estimation.softwareType)[0] || estimation.softwareType
          : estimation.softwareType)
        : estimation.softwareType,
      techStack: Array.isArray(estimation.techStack) 
        ? estimation.techStack 
        : (typeof estimation.techStack === 'string' 
          ? Object.values(JSON.parse(estimation.techStack || '{}')) 
          : []),
      timeline: estimation.timeline,
      timelineMultiplier: estimation.timelineMultiplier,
      features: Array.isArray(estimation.features)
        ? estimation.features
        : JSON.parse(estimation.features || '[]').map((id: number) => ({ 
            id, 
            name: `Feature ${id}`, 
            price: 0 
          })),
      currency: estimation.currency,
      pricing: {
        basePrice: estimation.basePrice,
        featuresPrice: estimation.featuresPrice,
        totalPrice: estimation.totalPrice,
        industryMultiplier: 1
      },
      contactInfo: {
        name: estimation.contactName || '',
        email: estimation.contactEmail || '',
        phone: '',
        company: estimation.contactCompany || ''
      },
      status: estimation.status,
      createdAt: estimation.createdAt
    };
  }

  async delete(id: number): Promise<void> {
    await apiClient.delete(`${this.endpoint}/${id}`);
  }
}

export const estimationsService = new EstimationsService();
