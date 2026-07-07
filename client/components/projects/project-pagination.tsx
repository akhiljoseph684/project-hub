"use client";

import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationPrevious,
  PaginationNext,
} from "@/components/ui/pagination";

interface PaginationData {
  page: number;
  totalPages: number;
  totalProjects: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
}

interface ProjectsPaginationProps {
  pagination: PaginationData;
  onPageChange: (page: number) => void;
}

export default function ProjectsPagination({
  pagination,
  onPageChange,
}: ProjectsPaginationProps) {
  const { page, totalPages, totalProjects, hasNextPage, hasPreviousPage } =
    pagination;

  if (totalProjects === 0) {
    return (
      <div className="mt-8 text-center text-muted-foreground">
        No projects found.
      </div>
    );
  }

  if (totalPages <= 1) {
    return null;
  }

  return (
    <Pagination className="mt-8">
      <PaginationContent>
        <PaginationItem>
          <PaginationPrevious
            href="#"
            onClick={(e) => {
              e.preventDefault();

              if (hasPreviousPage) {
                onPageChange(page - 1);
              }
            }}
            className={!hasPreviousPage ? "pointer-events-none opacity-50" : ""}
          />
        </PaginationItem>

        {Array.from({ length: totalPages }, (_, index) => {
          const pageNumber = index + 1;

          return (
            <PaginationItem key={pageNumber}>
              <PaginationLink
                href="#"
                isActive={page === pageNumber}
                onClick={(e) => {
                  e.preventDefault();
                  onPageChange(pageNumber);
                }}
              >
                {pageNumber}
              </PaginationLink>
            </PaginationItem>
          );
        })}

        <PaginationItem>
          <PaginationNext
            href="#"
            onClick={(e) => {
              e.preventDefault();

              if (hasNextPage) {
                onPageChange(page + 1);
              }
            }}
            className={!hasNextPage ? "pointer-events-none opacity-50" : ""}
          />
        </PaginationItem>
      </PaginationContent>
    </Pagination>
  );
}
