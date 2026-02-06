
const ChapterContentSkeleton = () => {
  return (
    <div className="min-h-screen bg-bg-primary pt-36 pb-12 px-4">
      {/* Title Section Skeleton */}
      <div className="max-w-4xl mx-auto text-center mb-12">
        <div className="h-10 md:h-14 bg-gray-200 dark:bg-zinc-800 rounded-lg w-3/4 mx-auto mb-6 animate-pulse"></div>
        
        <div className="flex justify-center gap-4">
           <div className="h-8 w-32 bg-gray-200 dark:bg-zinc-800 rounded-lg animate-pulse"></div>
           <div className="h-8 w-24 bg-gray-200 dark:bg-zinc-800 rounded-lg animate-pulse"></div>
        </div>
      </div>

      {/* Content Skeleton */}
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Paragraphs */}
        {[1, 2, 3, 4, 5, 6].map((_, i) => (
          <div key={i} className="space-y-3">
             <div className="h-4 bg-gray-200 dark:bg-zinc-800 rounded w-full animate-pulse"></div>
             <div className="h-4 bg-gray-200 dark:bg-zinc-800 rounded w-11/12 animate-pulse"></div>
             <div className="h-4 bg-gray-200 dark:bg-zinc-800 rounded w-full animate-pulse"></div>
             <div className="h-4 bg-gray-200 dark:bg-zinc-800 rounded w-3/4 animate-pulse"></div>
             {i % 2 === 0 && <div className="h-4 bg-gray-200 dark:bg-zinc-800 rounded w-5/6 animate-pulse"></div>}
          </div>
        ))}
      </div>
    </div>
  );
};

export default ChapterContentSkeleton;
