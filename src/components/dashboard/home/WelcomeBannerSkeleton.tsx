import { Skeleton } from '@/components/ui/skeleton';

export function WelcomeBannerSkeleton() {
  return (
    <div className="rounded-xl bg-gradient-to-r from-indigo-500 to-purple-600 p-6">
      <Skeleton className="h-6 w-64 mb-3 bg-white/20" />
      <Skeleton className="h-4 w-48 mb-4 bg-white/20" />
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3 mb-4">
        <Skeleton className="h-5 w-full bg-white/20" />
        <Skeleton className="h-5 w-full bg-white/20" />
        <Skeleton className="h-5 w-full bg-white/20" />
        <Skeleton className="h-5 w-full bg-white/20" />
      </div>
      <div className="flex gap-3">
        <Skeleton className="h-10 w-32 bg-white/20" />
        <Skeleton className="h-10 w-24 bg-white/20" />
      </div>
    </div>
  );
}
