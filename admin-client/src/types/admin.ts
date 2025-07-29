// Feature Types
export interface Feature {
  id: number;
  name: string;
  category: string;
  estimatedHours: number;
  complexity: 'simple' | 'medium' | 'complex';
  basePrice?: number;
  description?: string;
  prerequisites?: number[];
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CreateFeatureRequest {
  name: string;
  category: string;
  estimatedHours: number;
  complexity: 'simple' | 'medium' | 'complex';
  basePrice?: number;
  description?: string;
  prerequisites?: number[];
  isActive?: boolean;
}

// Software Type Types
export interface SoftwareType {
  id: number;
  name: string;
  category: 'web' | 'mobile' | 'desktop' | 'api' | 'other';
  basePrice?: number;
  complexity: 'simple' | 'medium' | 'complex';
  description?: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CreateSoftwareTypeRequest {
  name: string;
  category: 'web' | 'mobile' | 'desktop' | 'api' | 'other';
  basePrice?: number;
  complexity: 'simple' | 'medium' | 'complex';
  description?: string;
  isActive?: boolean;
}

// Tech Stack Types
export interface TechStack {
  id: number;
  name: string;
  category: 'backend' | 'frontend' | 'mobile' | 'database' | 'cloud' | 'other';
  version?: string;
  description?: string;
  difficultyLevel: 'beginner' | 'intermediate' | 'advanced';
  hourlyRateMultiplier: number;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CreateTechStackRequest {
  name: string;
  category: 'backend' | 'frontend' | 'mobile' | 'database' | 'cloud' | 'other';
  version?: string;
  description?: string;
  difficultyLevel: 'beginner' | 'intermediate' | 'advanced';
  hourlyRateMultiplier?: number;
  isActive?: boolean;
}

// Timeline Types
export interface Timeline {
  id: number;
  label: string;
  durationInMonths: number;
  multiplier: number;
  description?: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CreateTimelineRequest {
  label: string;
  durationInMonths: number;
  multiplier: number;
  description?: string;
  isActive?: boolean;
}

// Generic API Response Types
export interface ApiResponse<T> {
  data: T;
  message?: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  pageSize: number;
}
