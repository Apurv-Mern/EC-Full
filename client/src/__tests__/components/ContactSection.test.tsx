import React from 'react';
import { renderWithQueryClient, createMockUseStaticData, waitForAsync } from '@/__tests__/utils/test-utils';
import ContactSection from '@/components/ContactSection';
import { screen } from '@testing-library/react';

jest.mock('@/hooks/useApi', () => ({
  useStaticData: () => createMockUseStaticData('loading'),
}));

describe('ContactSection', () => {
  it('renders skeleton during loading', async () => {
    renderWithQueryClient(<ContactSection />);
    expect(screen.getByLabelText(/Name/)).toBeInTheDocument();
    await waitForAsync();
  });

  it('renders form options when useStaticData hook succeeds', async () => {
    jest.mock('@/hooks/useApi', () => ({
      useStaticData: () => createMockUseStaticData('success'),
    }));

    renderWithQueryClient(<ContactSection />);
    await waitForAsync();
    expect(screen.getByText('Web App')).toBeInTheDocument();
    expect(screen.getByText('Mobile App')).toBeInTheDocument();
  });

  it('renders error view when useStaticData hook fails', async () => {
    jest.mock('@/hooks/useApi', () => ({
      useStaticData: () => createMockUseStaticData('error'),
    }));

    renderWithQueryClient(<ContactSection />);
    await waitForAsync();
    expect(screen.getByText(/Please check your connection and try again/i)).toBeInTheDocument();
  });
});
