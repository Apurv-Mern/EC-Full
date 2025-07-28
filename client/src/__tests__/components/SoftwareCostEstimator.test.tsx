import React from 'react';
import { renderWithQueryClient, createMockUseStaticData, waitForAsync } from '@/__tests__/utils/test-utils';
import { SoftwareCostEstimator } from '@/components/SoftwareCostEstimator';
import { screen } from '@testing-library/react';

jest.mock('@/hooks/useApi', () => ({
  useStaticData: () => createMockUseStaticData('loading'),
}));

describe('SoftwareCostEstimator', () => {
  it('renders skeleton during loading', async () => {
    renderWithQueryClient(<SoftwareCostEstimator />);
    expect(screen.getByText(/Estimate Your Software Cost/i)).toBeInTheDocument();
    await waitForAsync();
  });

  it('renders data when useStaticData hook succeeds', async () => {
    jest.mock('@/hooks/useApi', () => ({
      useStaticData: () => createMockUseStaticData('success'),
    }));

    renderWithQueryClient(<SoftwareCostEstimator />);
    await waitForAsync();
    expect(screen.getByText('Gaming')).toBeInTheDocument();
    expect(screen.getByText('Fintech')).toBeInTheDocument();
  });

  it('renders error alert when useStaticData hook fails', async () => {
    jest.mock('@/hooks/useApi', () => ({
      useStaticData: () => createMockUseStaticData('error'),
    }));

    renderWithQueryClient(<SoftwareCostEstimator />);
    await waitForAsync();
    expect(screen.getByText(/Failed to Load Data/i)).toBeInTheDocument();
  });
});

