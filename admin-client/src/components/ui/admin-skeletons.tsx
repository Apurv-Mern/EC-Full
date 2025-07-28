import { Skeleton } from "./skeleton";

// Skeleton for feature cards in the admin page
export const FeatureSkeleton = ({ count = 4 }: { count?: number }) => (
  <div className="grid gap-4">
    {Array.from({ length: count }).map((_, i) => (
      <div key={i} className="border rounded-lg p-4">
        <div className="flex items-center justify-between mb-4">
          <Skeleton className="h-6 w-1/3" />
          <div className="flex gap-2">
            <Skeleton className="h-6 w-8" />
            <Skeleton className="h-6 w-8" />
          </div>
        </div>
        <Skeleton className="h-4 w-full mb-2" />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-2">
          <Skeleton className="h-5 w-1/2" />
          <Skeleton className="h-5 w-1/2" />
          <Skeleton className="h-5 w-1/2" />
        </div>
        <Skeleton className="h-3 w-5/6" />
      </div>
    ))}
  </div>
);
