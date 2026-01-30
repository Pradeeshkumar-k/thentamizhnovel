import React from 'react';

const NovelCardSkeleton = () => {
  return (
    <div className="flex-shrink-0 w-40 md:w-48 aspect-[2/3] rounded-xl overflow-hidden bg-surface animate-pulse border border-white/5">
      <div className="w-full h-full bg-gray-700/30 flex flex-col justify-end p-4">
        <div className="h-4 bg-gray-600/50 rounded w-3/4 mb-2"></div>
        <div className="h-3 bg-gray-600/30 rounded w-1/2 mb-4"></div>
        <div className="flex justify-between">
          <div className="h-2 bg-gray-600/20 rounded w-1/4"></div>
          <div className="h-2 bg-gray-600/20 rounded w-1/4"></div>
        </div>
      </div>
    </div>
  );
};

export const NovelGridSkeleton = ({ count = 6 }) => {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
      {[...Array(count)].map((_, i) => (
        <NovelCardSkeleton key={i} />
      ))}
    </div>
  );
};

export default NovelCardSkeleton;
