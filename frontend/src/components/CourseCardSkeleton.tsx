export function CourseCardSkeleton() {
  return (
    <div className="group relative h-full overflow-hidden rounded-2xl border border-zinc-100 bg-white/5 transition duration-200">
      <div className="relative aspect-[16/10] w-full overflow-hidden rounded-tl-lg rounded-tr-lg bg-gray-200 animate-pulse" />
      <div className="p-4">
        <div className="flex items-center space-x-2 mb-4">
          <div className="h-5 w-5 rounded-full bg-gray-200 animate-pulse" />
          <div className="h-4 w-24 bg-gray-200 rounded animate-pulse" />
        </div>
        <div className="h-6 w-3/4 bg-gray-200 rounded animate-pulse mb-4" />
        <div className="space-y-2">
          <div className="h-4 w-full bg-gray-200 rounded animate-pulse" />
          <div className="h-4 w-5/6 bg-gray-200 rounded animate-pulse" />
        </div>
        <div className="mt-10 flex justify-between items-center">
          <div className="h-4 w-20 bg-gray-200 rounded animate-pulse" />
          <div className="h-8 w-16 bg-gray-200 rounded animate-pulse" />
        </div>
      </div>
    </div>
  );
}