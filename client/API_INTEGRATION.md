# API Integration Documentation

This document describes the production-level API integration implemented in the Software Cost Estimator client application.

## Overview

The client application now fully integrates with the backend API server for:

- Fetching static configuration data (industries, software types, features, etc.)
- Creating and managing cost estimations
- Handling contact form submissions
- Real-time error handling and user feedback

## Architecture

### API Service Layer (`src/lib/api.ts`)

**Base API Service Class**
- Centralized HTTP client with timeout handling
- Automatic error parsing and custom exception handling
- Support for all HTTP methods (GET, POST, PUT, DELETE)
- Request/response interceptors for consistent data handling

**Key Features:**
- Request timeout (10 seconds default)
- Automatic retry logic (3 attempts for network errors)
- No retry for 4xx client errors
- TypeScript-first design with full type safety

### Service Layer

#### Estimation Service (`src/services/estimationService.ts`)
- `getStaticData()` - Fetch configuration data
- `createEstimation()` - Create new estimation
- `getEstimations()` - List all estimations
- `getEstimation(id)` - Get single estimation
- `updateEstimation(id, data)` - Update estimation
- `deleteEstimation(id)` - Delete estimation
- `createEstimationWithContact()` - Create estimation with email notification

#### Contact Service (`src/services/contactService.ts`)
- `createContact()` - Submit contact form
- `getContacts()` - List all contacts (admin)
- `getContact(id)` - Get single contact
- `updateContact(id, data)` - Update contact status
- `deleteContact(id)` - Delete contact
- `submitContactForm()` - Enhanced form submission with validation

### React Query Integration (`src/hooks/useApi.ts`)

**Query Hooks:**
- `useStaticData()` - Cached configuration data (30 min cache)
- `useEstimations()` - List estimations with caching
- `useEstimation(id)` - Single estimation data
- `useContacts()` - Contact list (admin use)
- `useContact(id)` - Single contact data
- `useHealthCheck()` - Server health monitoring

**Mutation Hooks:**
- `useCreateEstimation()` - Create estimation with cache invalidation
- `useUpdateEstimation()` - Update with optimistic updates
- `useDeleteEstimation()` - Delete with cache cleanup
- `useCreateContact()` - Submit contact form
- `useCreateEstimationWithContact()` - Combined estimation + contact

**Caching Strategy:**
- Static data: 30 minutes cache time
- Dynamic data: 5 minutes cache time
- Automatic cache invalidation on mutations
- Background refetching on window focus

### Type Safety (`src/types/api.ts`)

**Comprehensive TypeScript interfaces:**
- `Currency` - Supported currency types
- `StaticData` - Configuration data structure
- `Estimation` - Complete estimation object
- `Contact` - Contact form and response data
- `CreateEstimationRequest` - Estimation creation payload
- `CreateContactRequest` - Contact form payload

**Query Key Management:**
- Centralized query keys for cache management
- Type-safe query key generation
- Consistent naming conventions

## Component Integration

### SoftwareCostEstimator Component

**API Integration:**
- Real-time data fetching from `/api/estimations/static-data`
- Loading states with skeleton UI
- Error boundaries with retry functionality
- Form validation and submission
- Success/error notifications via toast system

**Features:**
- Dynamic data loading (no hardcoded values)
- Production-ready error handling
- Loading states for better UX
- Cache optimization for performance

### ContactSection Component

**API Integration:**
- Form validation and error handling
- Real-time submission with loading states
- Success feedback and form reset
- Integration with static data for project types

## Environment Configuration

### Environment Variables

```bash
# Development (.env)
VITE_API_BASE_URL=http://localhost:5000/api
VITE_APP_NAME=Software Cost Estimator
VITE_APP_VERSION=1.0.0
VITE_ENABLE_ANALYTICS=false
VITE_ENABLE_DEBUG=true

# Production (.env.production)
VITE_API_BASE_URL=https://your-production-api.com/api
VITE_ENABLE_ANALYTICS=true
VITE_ENABLE_DEBUG=false
```

## Error Handling

### API Error Types

1. **Network Errors** (0 status code)
   - Connection timeout
   - No internet connection
   - DNS resolution failures

2. **Client Errors** (4xx status codes)
   - 400: Bad Request (validation errors)
   - 401: Unauthorized
   - 403: Forbidden
   - 404: Not Found
   - 422: Unprocessable Entity

3. **Server Errors** (5xx status codes)
   - 500: Internal Server Error
   - 502: Bad Gateway
   - 503: Service Unavailable

### Error Handling Strategy

- **Automatic Retry:** Network errors only (up to 3 attempts)
- **User Feedback:** Toast notifications for all errors
- **Fallback UI:** Error boundaries with retry options
- **Loading States:** Skeleton loaders during data fetching

## Performance Optimizations

### Caching Strategy
- **Static Data:** Aggressive caching (30 minutes)
- **Dynamic Data:** Smart caching (5 minutes)
- **Background Updates:** Silent refetching on focus
- **Cache Invalidation:** Automatic on data mutations

### Bundle Optimization
- Tree-shaking compatible imports
- Lazy loading for non-critical components
- Type-only imports where applicable

### Network Optimization
- Request deduplication
- Automatic background refetching
- Optimistic updates for mutations

## Security Considerations

### Data Validation
- Client-side validation for user experience
- Server-side validation for security
- TypeScript for compile-time type checking

### Error Information
- No sensitive information in error messages
- Generic error messages for production
- Detailed logging for development

## Development Guidelines

### Adding New API Endpoints

1. **Define Types** (`src/types/api.ts`)
```typescript
export interface NewResource {
  id: number;
  name: string;
  // ... other fields
}
```

2. **Create Service** (`src/services/newService.ts`)
```typescript
class NewService {
  async getResource(id: number): Promise<NewResource> {
    const response = await apiService.get<ApiResponse<NewResource>>(`/resources/${id}`);
    return response.data;
  }
}
```

3. **Add React Query Hook** (`src/hooks/useApi.ts`)
```typescript
export const useNewResource = (id: number) => {
  return useQuery({
    queryKey: ['new-resource', id],
    queryFn: () => newService.getResource(id),
    enabled: !!id,
  });
};
```

### Best Practices

1. **Always use TypeScript interfaces** for API data
2. **Implement proper loading states** for all async operations
3. **Handle errors gracefully** with user-friendly messages
4. **Use React Query** for all server state management
5. **Implement optimistic updates** where appropriate
6. **Cache invalidation** after mutations
7. **Test API integration** thoroughly

## Deployment

### Build Configuration

```bash
# Development build
npm run build:dev

# Production build
npm run build

# Preview production build
npm run preview
```

### Environment Setup

1. **Development:**
   - Server: `http://localhost:5000`
   - Client: `http://localhost:5173`
   - Database: Local MySQL/SQLite

2. **Production:**
   - Update `VITE_API_BASE_URL` in `.env.production`
   - Enable analytics and disable debug mode
   - Configure proper CORS settings on server
   - Set up proper database connections

## Monitoring and Analytics

### Health Checks
- `useHealthCheck()` hook for server monitoring
- Automatic retry on connection failures
- Error reporting for failed API calls

### Performance Metrics
- React Query DevTools (development only)
- Cache hit/miss ratios
- API response times
- Error rates

## Troubleshooting

### Common Issues

1. **CORS Errors**
   - Check server CORS configuration
   - Verify API base URL in environment variables

2. **Network Timeouts**
   - Increase timeout in `src/lib/api.ts`
   - Check server response times

3. **Cache Issues**
   - Clear React Query cache: `queryClient.clear()`
   - Check cache invalidation logic

4. **Type Errors**
   - Ensure API response matches TypeScript interfaces
   - Update types when API changes

### Debug Tools

- React Query DevTools (development)
- Browser Network tab
- Server logs
- Toast notifications for user feedback

## Future Enhancements

### Planned Features
- Offline support with service workers
- Real-time updates via WebSocket
- Advanced caching strategies
- Request/response interceptors for auth
- API rate limiting handling
- Enhanced error recovery mechanisms

### Performance Improvements
- Query prefetching for predictable user flows
- Background synchronization
- Advanced cache strategies (stale-while-revalidate)
- Request deduplication optimization
