import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { featuresService } from '@/services/features';
import { softwareTypesService } from '@/services/softwareTypes';
import { techStacksService } from '@/services/techStacks';
import { timelinesService } from '@/services/timelines';
import { 
  Feature, 
  CreateFeatureRequest, 
  SoftwareType, 
  CreateSoftwareTypeRequest,
  TechStack,
  CreateTechStackRequest,
  Timeline,
  CreateTimelineRequest
} from '@/types/admin';

// Query Keys
export const QUERY_KEYS = {
  features: ['features'] as const,
  feature: (id: number) => ['features', id] as const,
  softwareTypes: ['softwareTypes'] as const,
  softwareType: (id: number) => ['softwareTypes', id] as const,
  techStacks: ['techStacks'] as const,
  techStack: (id: number) => ['techStacks', id] as const,
  timelines: ['timelines'] as const,
};

// Features Hooks
export const useFeatures = () => {
  return useQuery({
    queryKey: QUERY_KEYS.features,
    queryFn: () => featuresService.getAll(),
  });
};

export const useFeature = (id: number) => {
  return useQuery({
    queryKey: QUERY_KEYS.feature(id),
    queryFn: () => featuresService.getById(id),
    enabled: !!id,
  });
};

export const useCreateFeature = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (data: CreateFeatureRequest) => featuresService.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.features });
      toast.success('Feature created successfully');
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Failed to create feature');
    },
  });
};

export const useUpdateFeature = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: Partial<CreateFeatureRequest> }) =>
      featuresService.update(id, data),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.features });
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.feature(id) });
      toast.success('Feature updated successfully');
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Failed to update feature');
    },
  });
};

export const useDeleteFeature = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (id: number) => featuresService.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.features });
      toast.success('Feature deleted successfully');
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Failed to delete feature');
    },
  });
};

// Software Types Hooks
export const useSoftwareTypes = () => {
  return useQuery({
    queryKey: QUERY_KEYS.softwareTypes,
    queryFn: () => softwareTypesService.getAll(),
  });
};

export const useSoftwareType = (id: number) => {
  return useQuery({
    queryKey: QUERY_KEYS.softwareType(id),
    queryFn: () => softwareTypesService.getById(id),
    enabled: !!id,
  });
};

export const useCreateSoftwareType = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (data: CreateSoftwareTypeRequest) => softwareTypesService.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.softwareTypes });
      toast.success('Software type created successfully');
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Failed to create software type');
    },
  });
};

export const useUpdateSoftwareType = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: Partial<CreateSoftwareTypeRequest> }) =>
      softwareTypesService.update(id, data),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.softwareTypes });
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.softwareType(id) });
      toast.success('Software type updated successfully');
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Failed to update software type');
    },
  });
};

export const useDeleteSoftwareType = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (id: number) => softwareTypesService.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.softwareTypes });
      toast.success('Software type deleted successfully');
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Failed to delete software type');
    },
  });
};

// Tech Stacks Hooks
export const useTechStacks = () => {
  return useQuery({
    queryKey: QUERY_KEYS.techStacks,
    queryFn: () => techStacksService.getAll(),
  });
};

export const useTechStack = (id: number) => {
  return useQuery({
    queryKey: QUERY_KEYS.techStack(id),
    queryFn: () => techStacksService.getById(id),
    enabled: !!id,
  });
};

export const useCreateTechStack = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (data: CreateTechStackRequest) => techStacksService.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.techStacks });
      toast.success('Tech stack created successfully');
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Failed to create tech stack');
    },
  });
};

export const useUpdateTechStack = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: Partial<CreateTechStackRequest> }) =>
      techStacksService.update(id, data),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.techStacks });
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.techStack(id) });
      toast.success('Tech stack updated successfully');
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Failed to update tech stack');
    },
  });
};

export const useDeleteTechStack = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (id: number) => techStacksService.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.techStacks });
      toast.success('Tech stack deleted successfully');
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Failed to delete tech stack');
    },
  });
};

// Timelines Hooks
export const useTimelines = () => {
  return useQuery({
    queryKey: QUERY_KEYS.timelines,
    queryFn: () => timelinesService.getAll(),
  });
};

export const useCreateTimeline = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (data: CreateTimelineRequest) => timelinesService.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.timelines });
      toast.success('Timeline created successfully');
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Failed to create timeline');
    },
  });
};

export const useUpdateTimeline = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: Partial<CreateTimelineRequest> }) =>
      timelinesService.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.timelines });
      toast.success('Timeline updated successfully');
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Failed to update timeline');
    },
  });
};

export const useDeleteTimeline = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (id: number) => timelinesService.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.timelines });
      toast.success('Timeline deleted successfully');
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Failed to delete timeline');
    },
  });
};
