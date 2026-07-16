"use client";

import { Skeleton } from "@/components/ui/skeleton";

const COLUMNS = 5;

const TASKS_PER_COLUMN = [4, 3, 5, 2, 4];

export default function BoardSkeleton() {
  return (
    <div className="overflow-x-auto pb-4">
      <div className="flex min-w-max gap-5">
        {Array.from({ length: COLUMNS }).map((_, columnIndex) => (
          <div
            key={columnIndex}
            className="flex h-[650px] w-80 flex-col rounded-xl border bg-muted/20"
          >
            <div className="flex items-center justify-between border-b bg-background px-4 py-3">
              <div className="flex items-center gap-3">
                <Skeleton className="h-3 w-3 rounded-full" />

                <Skeleton className="h-5 w-24" />

                <Skeleton className="h-5 w-8 rounded-full" />
              </div>

              <Skeleton className="h-8 w-8 rounded-md" />
            </div>

            <div className="flex-1 space-y-3 overflow-y-auto p-3">
              {Array.from({
                length: TASKS_PER_COLUMN[columnIndex],
              }).map((_, taskIndex) => (
                <div
                  key={taskIndex}
                  className="space-y-4 rounded-xl border bg-background p-4"
                >
                  <Skeleton className="h-5 w-16" />

                  <Skeleton className="h-5 w-full" />
                  <Skeleton className="h-5 w-4/5" />

                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-3/4" />

                  <div className="flex gap-2">
                    <Skeleton className="h-6 w-16 rounded-full" />
                    <Skeleton className="h-6 w-20 rounded-full" />
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex gap-2">
                      <Skeleton className="h-4 w-10" />
                      <Skeleton className="h-4 w-10" />
                    </div>

                    <Skeleton className="h-8 w-8 rounded-full" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
