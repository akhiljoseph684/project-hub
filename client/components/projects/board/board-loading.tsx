"use client";

import BoardSkeleton from "./board-skeleton";

export default function BoardLoading() {
  return (
    <div className="space-y-6">
      <div className="space-y-4">
        <div className="h-8 w-64 animate-pulse rounded-md bg-muted" />

        <div className="flex flex-wrap gap-3">
          <div className="h-10 w-40 animate-pulse rounded-md bg-muted" />
          <div className="h-10 w-32 animate-pulse rounded-md bg-muted" />
          <div className="h-10 w-32 animate-pulse rounded-md bg-muted" />
          <div className="h-10 w-36 animate-pulse rounded-md bg-muted" />
        </div>
      </div>

      <BoardSkeleton />
    </div>
  );
}
