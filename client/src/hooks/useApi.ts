/**
 * React Query hooks for API data fetching
 * Provides typed hooks for all API operations with caching and error handling
 */

import {
  useQuery,
  useMutation,
  useQueryClient,
  UseQueryOptions,
  UseMutationOptions,
} from '@tanstack/react-query';
import { toast } from 'sonner';

import { estimationService } from '@/services/estimationService';
import { contactService } from '@/services/contactService';
import { apiService, ApiException } from '@/lib/api';
import {
  StaticData,
  Estimation,
  CreateEstimationRequest,
  Contact,
  CreateContactRequest,
  QUERY_KEYS,
  MUTATION_KEYS,
} from '@/types/api';

// Default query options
const defaultQueryOptions = {
  staleTime: 5 * 60 * 1000, // 5 minutes
  gcTime: 10 * 60 * 1000, // 10 minutes (previously cacheTime)
  retry: (failureCount: number, error: any) => {
    // Don't retry on 4xx errors
    if (error instanceof ApiException && error.statusCode >= 400 && error.statusCode < 500) {
      return false;
    }
    return failureCount < 3;
  },
};

// Error handler for mutations
const handleMutationError = (error: unknown, defaultMessage: string) => {
  if (error instanceof ApiException) {
    toast.error(error.message);
  } else if (error instanceof Error) {
    toast.error(error.message);
  } else {
    toast.error(defaultMessage);
  }
};

// Success handler for mutations
const handleMutationSuccess = (message: string) => {
  toast.success(message);
};

/**
 * Health Check Hook
 */
export const useHealthCheck = (options?: UseQueryOptions<{ status: string; message: string }>) => {
  return useQuery({
    queryKey: QUERY_KEYS.HEALTH,
    queryFn: () => apiService.healthCheck(),
    ...defaultQueryOptions,
    ...options,
  });
};

/**
 * Static Data Hooks
 */
export const useStaticData = (options?: UseQueryOptions<StaticData>) => {
  return useQuery({
    queryKey: QUERY_KEYS.STATIC_DATA,
    queryFn: () => estimationService.getStaticData(),
    ...defaultQueryOptions,
    staleTime: 30 * 60 * 1000, // Static data is stable for 30 minutes
    ...options,
  });
};

/**
 * Estimation Hooks
 */
export const useEstimations = (options?: UseQueryOptions<Estimation[]>) => {
  return useQuery({
    queryKey: QUERY_KEYS.ESTIMATIONS,
    queryFn: () => estimationService.getEstimations(),
    ...defaultQueryOptions,
    ...options,
  });
};

export const useEstimation = (
  id: number,
  options?: UseQueryOptions<Estimation>
) => {
  return useQuery({
    queryKey: QUERY_KEYS.ESTIMATION(id),
    queryFn: () => estimationService.getEstimation(id),
    ...defaultQueryOptions,
    enabled: !!id,
    ...options,
  });
};

export const useCreateEstimation = (
  options?: UseMutationOptions<Estimation, unknown, CreateEstimationRequest>
) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: [MUTATION_KEYS.CREATE_ESTIMATION],
    mutationFn: (data: CreateEstimationRequest) =>
      estimationService.createEstimation(data),
    onSuccess: (data) => {
      // Invalidate and refetch estimations list
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.ESTIMATIONS });
      
      // Add the new estimation to the cache
      queryClient.setQueryData(QUERY_KEYS.ESTIMATION(data.id), data);
      
      handleMutationSuccess('Estimation created successfully!');
    },
    onError: (error) => {
      handleMutationError(error, 'Failed to create estimation');
    },
    ...options,
  });
};

export const useUpdateEstimation = (
  options?: UseMutationOptions<
    Estimation,
    unknown,
    { id: number; data: Partial<Estimation> }
  >
) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: [MUTATION_KEYS.UPDATE_ESTIMATION],
    mutationFn: ({ id, data }) => estimationService.updateEstimation(id, data),
    onSuccess: (data) => {
      // Update the specific estimation in cache
      queryClient.setQueryData(QUERY_KEYS.ESTIMATION(data.id), data);
      
      // Invalidate estimations list to ensure consistency
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.ESTIMATIONS });
      
      handleMutationSuccess('Estimation updated successfully!');
    },
    onError: (error) => {
      handleMutationError(error, 'Failed to update estimation');
    },
    ...options,
  });
};

export const useDeleteEstimation = (
  options?: UseMutationOptions<void, unknown, number>
) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: [MUTATION_KEYS.DELETE_ESTIMATION],
    mutationFn: (id: number) => estimationService.deleteEstimation(id),
    onSuccess: (_, id) => {
      // Remove the estimation from cache
      queryClient.removeQueries({ queryKey: QUERY_KEYS.ESTIMATION(id) });
      
      // Invalidate estimations list
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.ESTIMATIONS });
      
      handleMutationSuccess('Estimation deleted successfully!');
    },
    onError: (error) => {
      handleMutationError(error, 'Failed to delete estimation');
    },
    ...options,
  });
};

/**
 * Contact Hooks
 */
export const useContacts = (options?: UseQueryOptions<Contact[]>) => {
  return useQuery({
    queryKey: QUERY_KEYS.CONTACTS,
    queryFn: () => contactService.getContacts(),
    ...defaultQueryOptions,
    ...options,
  });
};

export const useContact = (
  id: number,
  options?: UseQueryOptions<Contact>
) => {
  return useQuery({
    queryKey: QUERY_KEYS.CONTACT(id),
    queryFn: () => contactService.getContact(id),
    ...defaultQueryOptions,
    enabled: !!id,
    ...options,
  });
};

export const useCreateContact = (
  options?: UseMutationOptions<Contact, unknown, CreateContactRequest>
) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: [MUTATION_KEYS.CREATE_CONTACT],
    mutationFn: (data: CreateContactRequest) =>
      contactService.submitContactForm(data),
    onSuccess: (data) => {
      // Invalidate and refetch contacts list
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.CONTACTS });
      
      // Add the new contact to the cache
      queryClient.setQueryData(QUERY_KEYS.CONTACT(data.id), data);
      
      handleMutationSuccess('Message sent successfully! We\'ll get back to you soon.');
    },
    onError: (error) => {
      handleMutationError(error, 'Failed to send message');
    },
    ...options,
  });
};

export const useUpdateContact = (
  options?: UseMutationOptions<
    Contact,
    unknown,
    { id: number; data: Partial<Contact> }
  >
) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: [MUTATION_KEYS.UPDATE_CONTACT],
    mutationFn: ({ id, data }) => contactService.updateContact(id, data),
    onSuccess: (data) => {
      // Update the specific contact in cache
      queryClient.setQueryData(QUERY_KEYS.CONTACT(data.id), data);
      
      // Invalidate contacts list to ensure consistency
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.CONTACTS });
      
      handleMutationSuccess('Contact updated successfully!');
    },
    onError: (error) => {
      handleMutationError(error, 'Failed to update contact');
    },
    ...options,
  });
};

export const useDeleteContact = (
  options?: UseMutationOptions<void, unknown, number>
) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: [MUTATION_KEYS.DELETE_CONTACT],
    mutationFn: (id: number) => contactService.deleteContact(id),
    onSuccess: (_, id) => {
      // Remove the contact from cache
      queryClient.removeQueries({ queryKey: QUERY_KEYS.CONTACT(id) });
      
      // Invalidate contacts list
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.CONTACTS });
      
      handleMutationSuccess('Contact deleted successfully!');
    },
    onError: (error) => {
      handleMutationError(error, 'Failed to delete contact');
    },
    ...options,
  });
};

/**
 * Combined hook for estimation with contact
 */
export const useCreateEstimationWithContact = (
  options?: UseMutationOptions<Estimation, unknown, CreateEstimationRequest>
) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: [MUTATION_KEYS.CREATE_ESTIMATION, 'with-contact'],
    mutationFn: (data: CreateEstimationRequest) =>
      estimationService.createEstimationWithContact(data),
    onSuccess: (data) => {
      // Invalidate and refetch estimations list
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.ESTIMATIONS });
      
      // Add the new estimation to the cache
      queryClient.setQueryData(QUERY_KEYS.ESTIMATION(data.id), data);
      
      handleMutationSuccess(
        'Estimation created and sent to your email successfully!'
      );
    },
    onError: (error) => {
      handleMutationError(error, 'Failed to create and send estimation');
    },
    ...options,
  });
};
