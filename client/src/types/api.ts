/**
 * TypeScript interfaces for API data types
 */

// Currency type
export type Currency = "USD" | "INR" | "AUD" | "GBP";

// Currency info interface
export interface CurrencyInfo {
  code: Currency;
  symbol: string;
  flag: string;
  name: string;
  exchangeRate: number;
}

// Price interface for multi-currency support
export interface Price {
  USD: number;
  INR: number;
  AUD: number;
  GBP: number;
}

// Software type interface
export interface SoftwareType {
  id: number;
  name: string;
  basePrice: number;
  estimatedHours: number;
  complexity: string;
  price: Price;
  description: string;
  type: string
}

// Feature interface
export interface Feature {
  id: number;
  name: string;
  description: string;
  basePrice: number;
  estimatedHours: number;
  complexity: string;
}

// Timeline interface
export interface Timeline {
  id: number;
  label: string;
  multiplier: number;
}

// Tech stack interface
export interface TechStack {
  backend: string;
  frontend: string;
  mobile?: string;
  database?: string;
  cloud?: string;
  other?: string;
}

// Static data response interface
export interface StaticData {
  industries: Array<{id: number, name: string}>;
  softwareTypes: SoftwareType[];
  techStacks: {
    backend: Array<{id: number, name: string}>;
    frontend: Array<{id: number, name: string}>;
    mobile: Array<{id: number, name: string}>;
    database: Array<{id: number, name: string}>;
    cloud: Array<{id: number, name: string}>;
    other: Array<{id: number, name: string}>;
  };
  timelines: Timeline[];
  features: Record<string, Feature[]> | Feature[];
  currencies: CurrencyInfo[];
}

// Estimation creation request interface
export interface CreateEstimationRequest {
  industries: string[];
  softwareType: string[];
  techStack: TechStack;
  timeline: string;
  timelineMultiplier: number;
  features: number[];
  currency: Currency;
  contactName?: string;
  contactEmail?: string;
  contactCompany?: string;
}

// Estimation response interface
export interface Estimation {
  id: number;
  industries: string[];
  softwareType: string[];
  softwareTypeBasePrice: Price;
  techStack: TechStack;
  timeline: string;
  timelineMultiplier: number;
  features: number[];
  currency: Currency;
  basePrice: number;
  featuresPrice: number;
  totalPrice: number;
  contactName?: string;
  contactEmail?: string;
  contactCompany?: string;
  status: 'draft' | 'sent' | 'viewed' | 'contacted';
  createdAt: string;
  updatedAt: string;
}

// Contact creation request interface
export interface CreateContactRequest {
  name: string;
  email: string;
  company?: string;
  projectType?: string;
  message: string;
}

// Contact response interface
export interface Contact {
  id: number;
  name: string;
  email: string;
  company?: string;
  projectType?: string;
  message: string;
  status: 'new' | 'contacted' | 'responded' | 'closed';
  createdAt: string;
  updatedAt: string;
  respondedAt?: string;
}

// Form data interface for the estimator
export interface EstimatorFormData {
  industries: string[];
  softwareType: SoftwareType[];
  techStack: TechStack;
  timeline: Timeline | null;
  features: number[];
  currency: Currency;
  contactInfo?: {
    name: string;
    email: string;
    company?: string;
  };
}

// API endpoint interfaces
export interface EstimationEndpoints {
  getStaticData: () => Promise<StaticData>;
  createEstimation: (data: CreateEstimationRequest) => Promise<Estimation>;
  getEstimations: () => Promise<Estimation[]>;
  getEstimation: (id: number) => Promise<Estimation>;
  updateEstimation: (id: number, data: Partial<Estimation>) => Promise<Estimation>;
  deleteEstimation: (id: number) => Promise<void>;
}

export interface ContactEndpoints {
  createContact: (data: CreateContactRequest) => Promise<Contact>;
  getContacts: () => Promise<Contact[]>;
  getContact: (id: number) => Promise<Contact>;
  updateContact: (id: number, data: Partial<Contact>) => Promise<Contact>;
  deleteContact: (id: number) => Promise<void>;
}

// Query keys for React Query
export const QUERY_KEYS = {
  STATIC_DATA: ['static-data'] as const,
  ESTIMATIONS: ['estimations'] as const,
  ESTIMATION: (id: number) => ['estimation', id] as const,
  CONTACTS: ['contacts'] as const,
  CONTACT: (id: number) => ['contact', id] as const,
  HEALTH: ['health'] as const,
} as const;

// Mutation keys for React Query
export const MUTATION_KEYS = {
  CREATE_ESTIMATION: 'create-estimation',
  UPDATE_ESTIMATION: 'update-estimation',
  DELETE_ESTIMATION: 'delete-estimation',
  CREATE_CONTACT: 'create-contact',
  UPDATE_CONTACT: 'update-contact',
  DELETE_CONTACT: 'delete-contact',
} as const;
