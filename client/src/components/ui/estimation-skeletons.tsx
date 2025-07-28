import { Skeleton } from "./skeleton";

// Skeleton for select/button options in grid layout (industry selection)
export const SelectGridSkeleton = ({ count = 6, cols = "2 md:3" }: { count?: number; cols?: string }) => (
  <div className={`grid grid-cols-${cols} gap-3`}>
    {Array.from({ length: count }).map((_, i) => (
      <Skeleton key={i} className="h-12 w-full" />
    ))}
  </div>
);

// Skeleton for software type selection (larger buttons with price)
export const SoftwareTypeSkeleton = ({ count = 4 }: { count?: number }) => (
  <div className="grid gap-4">
    {Array.from({ length: count }).map((_, i) => (
      <div key={i} className="border rounded-lg p-4">
        <div className="flex justify-between items-center">
          <Skeleton className="h-6 w-32" />
          <Skeleton className="h-6 w-20" />
        </div>
      </div>
    ))}
  </div>
);

// Skeleton for technology stack selection (small pills/badges)
export const TechStackSkeleton = () => (
  <div className="space-y-6">
    <div>
      <Skeleton className="h-6 w-32 mb-3" />
      <div className="flex flex-wrap gap-2">
        {Array.from({ length: 5 }).map((_, i) => (
          <Skeleton key={i} className="h-8 w-16" />
        ))}
      </div>
    </div>
    <div>
      <Skeleton className="h-6 w-36 mb-3" />
      <div className="flex flex-wrap gap-2">
        {Array.from({ length: 4 }).map((_, i) => (
          <Skeleton key={i} className="h-8 w-20" />
        ))}
      </div>
    </div>
    <div>
      <Skeleton className="h-6 w-32 mb-3" />
      <div className="flex flex-wrap gap-2">
        {Array.from({ length: 3 }).map((_, i) => (
          <Skeleton key={i} className="h-8 w-18" />
        ))}
      </div>
    </div>
  </div>
);

// Skeleton for timeline selection (similar to software type but with badges)
export const TimelineSkeleton = ({ count = 4 }: { count?: number }) => (
  <div className="grid gap-4">
    {Array.from({ length: count }).map((_, i) => (
      <div key={i} className="border rounded-lg p-4">
        <div className="flex justify-between items-center">
          <Skeleton className="h-6 w-36" />
          <Skeleton className="h-5 w-24 rounded-full" />
        </div>
      </div>
    ))}
  </div>
);

// Skeleton for feature checklist (detailed feature cards)
export const FeatureChecklistSkeleton = ({ count = 6 }: { count?: number }) => (
  <div className="grid gap-3">
    {Array.from({ length: count }).map((_, i) => (
      <div key={i} className="p-4 border rounded-lg">
        <div className="flex justify-between items-start">
          <div className="flex-1 space-y-2">
            <Skeleton className="h-5 w-48" />
            <Skeleton className="h-4 w-72" />
            <Skeleton className="h-3 w-32" />
          </div>
          <Skeleton className="h-6 w-16 ml-4" />
        </div>
      </div>
    ))}
  </div>
);

// Skeleton for currency/region selection (cards with flags)
export const CurrencySelectionSkeleton = ({ count = 4 }: { count?: number }) => (
  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
    {Array.from({ length: count }).map((_, i) => (
      <div key={i} className="h-28 border rounded-lg p-4 flex flex-col items-center justify-center gap-2">
        <Skeleton className="h-8 w-8 rounded-full" />
        <Skeleton className="h-5 w-12" />
        <Skeleton className="h-3 w-20" />
      </div>
    ))}
  </div>
);

// Main skeleton component that adapts based on the current step
export const EstimationStepSkeleton = ({ step }: { step: number }) => {
  const getSkeletonForStep = () => {
    switch (step) {
      case 1:
        return (
          <div className="space-y-6">
            <div className="text-center space-y-2">
              <Skeleton className="h-8 w-48 mx-auto" />
              <Skeleton className="h-5 w-96 mx-auto" />
            </div>
            <SelectGridSkeleton count={6} cols="2 md:3" />
          </div>
        );
      case 2:
        return (
          <div className="space-y-6">
            <div className="text-center space-y-2">
              <Skeleton className="h-8 w-52 mx-auto" />
              <Skeleton className="h-5 w-72 mx-auto" />
            </div>
            <SoftwareTypeSkeleton count={4} />
          </div>
        );
      case 3:
        return (
          <div className="space-y-6">
            <div className="text-center space-y-2">
              <Skeleton className="h-8 w-60 mx-auto" />
              <Skeleton className="h-5 w-80 mx-auto" />
            </div>
            <TechStackSkeleton />
          </div>
        );
      case 4:
        return (
          <div className="space-y-6">
            <div className="text-center space-y-2">
              <Skeleton className="h-8 w-64 mx-auto" />
              <Skeleton className="h-5 w-56 mx-auto" />
            </div>
            <TimelineSkeleton count={4} />
          </div>
        );
      case 5:
        return (
          <div className="space-y-6">
            <div className="text-center space-y-2">
              <Skeleton className="h-8 w-56 mx-auto" />
              <Skeleton className="h-5 w-84 mx-auto" />
            </div>
            <FeatureChecklistSkeleton count={8} />
          </div>
        );
      case 6:
        return (
          <div className="space-y-6">
            <div className="text-center space-y-2">
              <Skeleton className="h-8 w-40 mx-auto" />
              <Skeleton className="h-5 w-48 mx-auto" />
            </div>
            <CurrencySelectionSkeleton count={8} />
          </div>
        );
      default:
        return (
          <div className="text-center space-y-6">
            <Skeleton className="h-10 w-3/4 mx-auto" />
            <Skeleton className="h-6 w-1/2 mx-auto" />
            <SelectGridSkeleton count={6} cols="2 md:3" />
          </div>
        );
    }
  };

  return getSkeletonForStep();
};
