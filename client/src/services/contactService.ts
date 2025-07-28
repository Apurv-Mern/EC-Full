/**
 * Contact API Service
 * Handles all contact-related API calls
 */

import { apiService, ApiResponse, ApiListResponse } from '@/lib/api';
import {
  Contact,
  CreateContactRequest,
  ContactEndpoints,
} from '@/types/api';

/**
 * Contact service class implementing all contact-related API calls
 */
class ContactService implements ContactEndpoints {
  private readonly basePath = '/contacts';

  /**
   * Create a new contact submission
   */
  async createContact(data: CreateContactRequest): Promise<Contact> {
    const response = await apiService.post<ApiResponse<Contact>>(
      this.basePath,
      data
    );
    return response.data;
  }

  /**
   * Get all contacts
   */
  async getContacts(): Promise<Contact[]> {
    const response = await apiService.get<ApiListResponse<Contact>>(
      this.basePath
    );
    return response.data;
  }

  /**
   * Get contacts by status
   */
  async getContactsByStatus(status: Contact['status']): Promise<Contact[]> {
    const response = await apiService.get<ApiListResponse<Contact>>(
      `${this.basePath}?status=${status}`
    );
    return response.data;
  }

  /**
   * Get a single contact by ID
   */
  async getContact(id: number): Promise<Contact> {
    const response = await apiService.get<ApiResponse<Contact>>(
      `${this.basePath}/${id}`
    );
    return response.data;
  }

  /**
   * Update a contact
   */
  async updateContact(
    id: number,
    data: Partial<Contact>
  ): Promise<Contact> {
    const response = await apiService.put<ApiResponse<Contact>>(
      `${this.basePath}/${id}`,
      data
    );
    return response.data;
  }

  /**
   * Delete a contact
   */
  async deleteContact(id: number): Promise<void> {
    await apiService.delete<ApiResponse<{}>>(
      `${this.basePath}/${id}`
    );
  }

  /**
   * Mark contact as contacted
   */
  async markAsContacted(id: number): Promise<Contact> {
    return this.updateContact(id, { status: 'contacted' });
  }

  /**
   * Mark contact as responded
   */
  async markAsResponded(id: number): Promise<Contact> {
    return this.updateContact(id, { 
      status: 'responded',
      respondedAt: new Date().toISOString()
    });
  }

  /**
   * Mark contact as closed
   */
  async markAsClosed(id: number): Promise<Contact> {
    return this.updateContact(id, { status: 'closed' });
  }

  /**
   * Submit contact form with validation
   */
  async submitContactForm(data: CreateContactRequest): Promise<Contact> {
    // Basic validation
    if (!data.name?.trim()) {
      throw new Error('Name is required');
    }

    if (!data.email?.trim()) {
      throw new Error('Email is required');
    }

    if (!data.message?.trim()) {
      throw new Error('Message is required');
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(data.email)) {
      throw new Error('Please enter a valid email address');
    }

    return this.createContact({
      ...data,
      name: data.name.trim(),
      email: data.email.trim().toLowerCase(),
      company: data.company?.trim(),
      projectType: data.projectType?.trim(),
      message: data.message.trim(),
    });
  }
}

// Create and export service instance
export const contactService = new ContactService();

// Export individual methods for convenience
export const {
  createContact,
  getContacts,
  getContact,
  updateContact,
  deleteContact,
} = contactService;
