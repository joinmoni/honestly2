"use client";

import React from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

type AdminPaginationProps = {
  currentPage: number;
  totalPages: number;
  pageNumbers: number[];
  onPageChange?: (page: number) => void;
};

export function AdminPagination({
  currentPage,
  totalPages,
  pageNumbers,
  onPageChange
}: AdminPaginationProps) {
  return (
    <div className="mt-12 flex items-center justify-between border-t border-stone-100 pt-8">
      <button
        type="button"
        disabled={currentPage <= 1}
        className="group flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-stone-400 transition-colors hover:text-stone-900 disabled:cursor-not-allowed disabled:opacity-50"
        onClick={() => onPageChange?.(Math.max(1, currentPage - 1))}
      >
        <ChevronLeft size={14} />
        Previous
      </button>

      <div className="flex items-center gap-1">
        {pageNumbers.map((pageNumber, index) => {
          const showEllipsis = index === pageNumbers.length - 1 && pageNumber !== currentPage + 2 && pageNumber !== currentPage;

          if (showEllipsis) {
            return (
              <React.Fragment key={pageNumber}>
                <span className="px-2 text-stone-300">...</span>
                <button
                  type="button"
                  className="flex h-8 w-8 items-center justify-center rounded-lg text-xs font-bold text-stone-400 transition-colors hover:bg-stone-50"
                  onClick={() => onPageChange?.(pageNumber)}
                >
                  {pageNumber}
                </button>
              </React.Fragment>
            );
          }

          return (
            <button
              key={pageNumber}
              type="button"
              className={
                pageNumber === currentPage
                  ? "flex h-8 w-8 items-center justify-center rounded-lg bg-stone-900 text-xs font-bold text-white"
                  : "flex h-8 w-8 items-center justify-center rounded-lg text-xs font-bold text-stone-400 transition-colors hover:bg-stone-50"
              }
              onClick={() => onPageChange?.(pageNumber)}
            >
              {pageNumber}
            </button>
          );
        })}
      </div>

      <button
        type="button"
        disabled={currentPage >= totalPages}
        className="group flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-stone-400 transition-colors hover:text-stone-900 disabled:cursor-not-allowed disabled:opacity-50"
        onClick={() => onPageChange?.(Math.min(totalPages, currentPage + 1))}
      >
        Next
        <ChevronRight size={14} />
      </button>
    </div>
  );
}
