import React from 'react';

const SkeletonCard = () => (
  <div className="animate-pulse rounded-xl bg-zinc-900 border border-zinc-800 overflow-hidden shadow-sm">
    <div className="h-56 bg-zinc-800" />
    <div className="p-4 space-y-3">
      <div className="h-4 bg-zinc-700 rounded w-3/4" />
      <div className="h-3 bg-zinc-700 rounded w-1/2" />
      <div className="flex justify-between items-center pt-2">
         <div className="h-3 bg-zinc-800 rounded w-1/4" />
         <div className="h-3 bg-zinc-800 rounded w-1/4" />
      </div>
    </div>
  </div>
);

interface Props {
    count?: number;
}

export default function NovelGridSkeleton({ count = 8 }: Props) {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
      {Array.from({ length: count }).map((_, i) => (
        <SkeletonCard key={i} />
      ))}
    </div>
  );
}
