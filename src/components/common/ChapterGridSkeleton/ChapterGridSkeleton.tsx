

const ChapterGridSkeleton = ({ count = 8 }) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="bg-white dark:bg-zinc-900 rounded-xl p-4 border border-gray-100 dark:border-white/5 overflow-hidden">
          <div className="h-3 w-3/4 bg-gray-200 dark:bg-zinc-800 rounded mb-3 animate-pulse"></div>
          <div className="h-2.5 w-full bg-gray-100 dark:bg-zinc-800/50 rounded mb-2 animate-pulse"></div>
          <div className="h-2 w-1/3 bg-gray-100 dark:bg-zinc-800/50 rounded animate-pulse"></div>
        </div>
      ))}
    </div>
  );
};

export default ChapterGridSkeleton;
