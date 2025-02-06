import { Skeleton } from "@/components/ui/skeleton";

export function PluginPageSkeleton() {
  return (
    <div className="pt-12 max-w-4xl mx-auto">
      <Skeleton className="h-[400px] w-full rounded-lg" />
      <div className="mt-6 space-y-4">
        <Skeleton className="h-8 w-3/4" />
        <Skeleton className="h-4 w-1/2" />
        <Skeleton className="h-4 w-1/3" />
      </div>
    </div>
  );
} 