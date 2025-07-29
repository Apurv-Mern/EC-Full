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
  type: 'OS' | 'software';
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
  type: 'OS' | 'software';
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

// Industry Types
export interface Industry {
  id: number;
  name: string;
  slug: string;
  description?: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CreateIndustryRequest {
  name: string;
  slug?: string;
  description?: string;
  isActive?: boolean;
}

// Currency Types
export interface Currency {
  id: number;
  code: string;
  name: string;
  symbol: string;
  flag?: string;
  exchangeRate: number;
  isBaseCurrency: boolean;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CreateCurrencyRequest {
  code: string;
  name: string;
  symbol: string;
  flag?: string;
  exchangeRate?: number;
  isBaseCurrency?: boolean;
  isActive?: boolean;
}

// Estimation Types
export interface Estimation {
  id: number;
  industries: string[];
  softwareType: string;
  softwareTypeBasePrice: any;
  techStack: any;
  timeline: string;
  timelineMultiplier: number;
  features: string;
  currency: string;
  basePrice: number;
  featuresPrice: number;
  totalPrice: number;
  contactName?: string;
  contactEmail?: string;
  contactCompany?: string;
  status: 'draft' | 'sent' | 'accepted' | 'rejected';
  createdAt: string;
  updatedAt: string;
}

export interface CreateEstimationRequest {
  industries: string[];
  softwareType: string[];
  techStack: any;
  timeline: string;
  timelineMultiplier: number;
  features: number[];
  currency: string;
  contactName?: string;
  contactEmail?: string;
  contactCompany?: string;
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
