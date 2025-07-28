import React from 'react';
import { render, RenderOptions } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { StaticData } from '@/types/api';

// Mock static data for testing
export const mockStaticData: StaticData = {
  industries: [
    { id: 1, name: 'Gaming' },
    { id: 2, name: 'Fintech' },
    { id: 3, name: 'Healthcare' },
    { id: 4, name: 'E-commerce' },
  ],
  softwareTypes: [
    { id: 1, name: 'Web App', basePrice: 5000 },
    { id: 2, name: 'Mobile App', basePrice: 8000 },
    { id: 3, name: 'SaaS Platform', basePrice: 15000 },
    { id: 4, name: 'ERP System', basePrice: 25000 },
  ],
  techStacks: {
    backend: [
      { id: 1, name: 'Node.js' },
      { id: 2, name: 'Python' },
      { id: 3, name: '.NET' },
    ],
    frontend: [
      { id: 1, name: 'React' },
      { id: 2, name: 'Vue.js' },
      { id: 3, name: 'Angular' },
    ],
    mobile: [
      { id: 1, name: 'React Native' },
      { id: 2, name: 'Flutter' },
      { id: 3, name: 'Native iOS/Android' },
    ],
  },
  timelines: [
    { id: 1, label: '1-2 months', multiplier: 1.5 },
    { id: 2, label: '3-4 months', multiplier: 1.0 },
    { id: 3, label: '5-6 months', multiplier: 0.8 },
    { id: 4, label: '6+ months', multiplier: 0.7 },
  ],
  features: [
    {
      id: 1,
      name: 'User Authentication',
      description: 'Login, registration, password reset',
      basePrice: 1000,
      estimatedHours: 40,
      complexity: 'Medium',
    },
    {
      id: 2,
      name: 'Payment Integration',
      description: 'Stripe, PayPal integration',
      basePrice: 1500,
      estimatedHours: 60,
      complexity: 'High',
    },
    {
      id: 3,
      name: 'Admin Dashboard',
      description: 'Admin panel with analytics',
      basePrice: 2000,
      estimatedHours: 80,
      complexity: 'High',
    },
  ],
  currencies: [
    {
      code: 'USD',
      symbol: '$',
      flag: '🇺🇸',
      name: 'US Dollar',
      exchangeRate: 1,
    },
    {
      code: 'INR',
      symbol: '₹',
      flag: '🇮🇳',
      name: 'Indian Rupee',
      exchangeRate: 83,
    },
    {
      code: 'GBP',
      symbol: '£',
      flag: '🇬🇧',
      name: 'British Pound',
      exchangeRate: 0.8,
    },
    {
      code: 'AUD',
      symbol: 'A$',
      flag: '🇦🇺',
      name: 'Australian Dollar',
      exchangeRate: 1.5,
    },
  ],
};

// Custom render function with QueryClient provider
interface CustomRenderOptions extends Omit<RenderOptions, 'wrapper'> {
  queryClient?: QueryClient;
}

export function renderWithQueryClient(
  ui: React.ReactElement,
  options: CustomRenderOptions = {}
) {
  const { queryClient = createTestQueryClient(), ...renderOptions } = options;

  function Wrapper({ children }: { children: React.ReactNode }) {
    return (
      <QueryClientProvider client={queryClient}>
        {children}
      </QueryClientProvider>
    );
  }

  return render(ui, { wrapper: Wrapper, ...renderOptions });
}

// Create a test query client with disabled retries and fast failure
export function createTestQueryClient() {
  return new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
        gcTime: 0,
      },
      mutations: {
        retry: false,
      },
    },
  });
}

// Mock functions for useStaticData hook states
export const createMockUseStaticData = (
  state: 'loading' | 'success' | 'error'
) => {
  switch (state) {
    case 'loading':
      return {
        data: undefined,
        isLoading: true,
        isError: false,
        error: null,
        refetch: jest.fn(),
      };
    case 'success':
      return {
        data: mockStaticData,
        isLoading: false,
        isError: false,
        error: null,
        refetch: jest.fn(),
      };
    case 'error':
      return {
        data: undefined,
        isLoading: false,
        isError: true,
        error: new Error('Failed to fetch static data'),
        refetch: jest.fn(),
      };
    default:
      throw new Error(`Invalid state: ${state}`);
  }
};

// Helper to wait for async operations
export const waitForAsync = () => new Promise(resolve => setTimeout(resolve, 0));

// Mock toast notifications
export const mockToast = {
  success: jest.fn(),
  error: jest.fn(),
  info: jest.fn(),
  warning: jest.fn(),
};

// Jest mock for sonner
jest.mock('sonner', () => ({
  toast: mockToast,
}));
