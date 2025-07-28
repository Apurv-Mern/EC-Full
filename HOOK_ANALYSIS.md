# useStaticData() Hook Analysis

## Hook Implementation Study

### Location
- **File**: `client/src/hooks/useApi.ts` (lines 72-80)
- **Type**: React Query hook using `@tanstack/react-query`

### Hook Signature
```typescript
export const useStaticData = (options?: UseQueryOptions<StaticData>) => {
  return useQuery({
    queryKey: QUERY_KEYS.STATIC_DATA,
    queryFn: () => estimationService.getStaticData(),
    ...defaultQueryOptions,
    staleTime: 30 * 60 * 1000, // Static data is stable for 30 minutes
    ...options,
  });
};
```

### Return Structure
The hook returns a React Query result object with the following properties:

#### Data Properties
- **`data`**: `StaticData | undefined` - The fetched static data
- **`error`**: `unknown` - Error object if the request fails
- **`isLoading`**: `boolean` - True during initial fetch
- **`isFetching`**: `boolean` - True during any fetch (including background)
- **`isError`**: `boolean` - True if request failed
- **`isSuccess`**: `boolean` - True if request succeeded

#### Utility Properties
- **`refetch`**: Function to manually refetch data
- **`isStale`**: `boolean` - True if data is considered stale
- **`dataUpdatedAt`**: `number` - Timestamp of last successful data update
- **`errorUpdatedAt`**: `number` - Timestamp of last error
- **`status`**: `'loading' | 'error' | 'success'` - Current status

## StaticData Interface Analysis

### Exact Keys Returned (from `StaticData` interface)

```typescript
export interface StaticData {
  industries: string[];              // e.g., ["Healthcare", "Finance", "E-commerce"]
  softwareTypes: SoftwareType[];     // Array of software type objects
  techStacks: {                      // Technology stack options
    backend: string[];               // e.g., ["Node.js", "Python", "Java"]
    frontend: string[];              // e.g., ["React", "Vue", "Angular"] 
    mobile: string[];                // e.g., ["React Native", "Flutter"]
  };
  timelines: Timeline[];             // Project timeline options
  features: Feature[];               // Available features to add
  currencies: CurrencyInfo[];        // Supported currencies
}
```

### Component Usage Pattern
Based on `SoftwareCostEstimator.tsx`:

```typescript
const { data: staticData, isLoading, error } = useStaticData();

// Accessing the data with fallbacks
const industries = staticData?.industries || [];
const softwareTypes = staticData?.softwareTypes || [];
const techStacks = staticData?.techStacks || { backend: [], frontend: [], mobile: [] };
const timelines = staticData?.timelines || [];
const features = staticData?.features || [];
const currencies = staticData?.currencies || [];
```

## Supporting Type Definitions

### Already Existing Interfaces

#### SoftwareType Interface
```typescript
export interface SoftwareType {
  name: string;
  basePrice: Price;
}
```

#### Feature Interface
```typescript
export interface Feature {
  name: string;
  price: Price;
}
```

#### Timeline Interface
```typescript
export interface Timeline {
  label: string;
  multiplier: number;
}
```

#### CurrencyInfo Interface
```typescript
export interface CurrencyInfo {
  code: Currency;
  symbol: string;
  flag: string;
  name: string;
}
```

#### Price Interface (Multi-currency support)
```typescript
export interface Price {
  USD: number;
  INR: number;
  AUD: number;
  GBP: number;
}
```

#### Currency Type
```typescript
export type Currency = "USD" | "INR" | "AUD" | "GBP";
```

## Enhanced TypeScript Interfaces

### Hook Return Type Enhancement
Since the existing types are already well-defined, here's an enhanced interface for better type safety:

```typescript
// Enhanced hook return type for better developer experience
export interface UseStaticDataReturn {
  // Data properties
  data: StaticData | undefined;
  error: unknown;
  
  // Loading states
  isLoading: boolean;
  isFetching: boolean;
  isError: boolean;
  isSuccess: boolean;
  isStale: boolean;
  
  // Status
  status: 'loading' | 'error' | 'success';
  
  // Timestamps
  dataUpdatedAt: number;
  errorUpdatedAt: number;
  
  // Actions
  refetch: () => Promise<UseQueryResult<StaticData>>;
}

// Usage enhancement
export const useStaticData = (
  options?: UseQueryOptions<StaticData>
): UseStaticDataReturn => {
  return useQuery({
    queryKey: QUERY_KEYS.STATIC_DATA,
    queryFn: () => estimationService.getStaticData(),
    ...defaultQueryOptions,
    staleTime: 30 * 60 * 1000,
    ...options,
  });
};
```

### Utility Type Guards
For safer data access in components:

```typescript
// Type guard to check if static data is loaded
export const isStaticDataLoaded = (
  data: StaticData | undefined
): data is StaticData => {
  return data !== undefined &&
    Array.isArray(data.industries) &&
    Array.isArray(data.softwareTypes) &&
    Array.isArray(data.timelines) &&
    Array.isArray(data.features) &&
    Array.isArray(data.currencies) &&
    typeof data.techStacks === 'object';
};

// Usage in components
const { data: staticData, isLoading, error } = useStaticData();

if (isStaticDataLoaded(staticData)) {
  // TypeScript now knows staticData is fully loaded
  const industries = staticData.industries; // No need for fallback
  const softwareTypes = staticData.softwareTypes;
  // ... etc
}
```

## API Endpoint Details

### Request
- **Method**: `GET`
- **Endpoint**: `/api/estimations/data-for-estimation`
- **Service**: `estimationService.getStaticData()`

### Response Structure
The API returns an `ApiResponse<StaticData>` wrapper:

```typescript
interface ApiResponse<T> {
  data: T;
  message?: string;
  success: boolean;
}
```

## Caching Configuration

### Cache Settings
- **Query Key**: `['static-data']`
- **Stale Time**: 30 minutes (30 * 60 * 1000 ms)
- **GC Time**: 10 minutes (10 * 60 * 1000 ms)
- **Retry Logic**: Up to 3 attempts for non-4xx errors

### Cache Benefits
- Reduces API calls for frequently accessed static data
- Improves application performance
- Provides offline-like experience when data is cached

## Error Handling

### Error States
1. **Network Errors**: Connection issues, timeouts
2. **Server Errors**: 5xx status codes
3. **Client Errors**: 4xx status codes (no retry)

### Error Handling in Components
```typescript
const { data: staticData, isLoading, error } = useStaticData();

if (error) {
  return (
    <div className="error-state">
      <AlertCircle className="w-16 h-16 text-destructive mx-auto" />
      <h2 className="text-2xl font-bold text-destructive">Failed to Load Data</h2>
      <p className="text-muted-foreground">
        We're having trouble loading the estimation data. Please check your connection and try again.
      </p>
      <Button onClick={() => window.location.reload()}>
        Try Again
      </Button>
    </div>
  );
}
```

## Recommendations

### For Downstream Components
1. **Always check loading state** before accessing data
2. **Provide fallback values** for optional data access
3. **Handle error states gracefully** with retry options
4. **Use type guards** for safer data access
5. **Leverage TypeScript's strict mode** for better type safety

### Best Practices
1. Import and use the existing interfaces from `@/types/api`
2. Use optional chaining (`?.`) when accessing nested properties
3. Provide loading skeletons for better UX
4. Implement error boundaries for production apps
5. Consider implementing retry logic in error states
