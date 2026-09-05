import { useLaiTranslation } from "@/hooks/use-lai-translation";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Pagination as PaginationNav,
  PaginationContent,
  PaginationItem,
  PaginationEllipsis,
} from "@/components/ui/pagination";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectGroup,
  SelectItem,
} from "@/components/ui/select";

export interface DataPaginationProps {
  labels?: Partial<DataPaginationLabels>;
  pageSizeOptions?: number[];
  page: number;
  limit: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  onLimitChange: (limit: number) => void;
}

export interface DataPaginationLabels {
  limit: string;
  pagination: string;
  previous: string;
  next: string;
  page: (page: number, total: number) => string;
  goTo: (page: number) => string;
}


function getPageNumbers(currentPage: number, totalPages: number): (number | "...")[] {
  if (totalPages <= 7) {
    return Array.from({ length: totalPages }, (_, i) => i + 1);
  }

  const pages: (number | "...")[] = [1];

  if (currentPage > 3) {
    pages.push("...");
  }

  const start = Math.max(2, currentPage - 1);
  const end = Math.min(totalPages - 1, currentPage + 1);

  for (let i = start; i <= end; i++) {
    pages.push(i);
  }

  if (currentPage < totalPages - 2) {
    pages.push("...");
  }

  pages.push(totalPages);

  return pages;
}

export function DataPagination({
  page,
  totalPages,
  onPageChange,
  onLimitChange,
  limit,
  labels: customLabels,
  pageSizeOptions = [10, 20, 50],
}: DataPaginationProps) {
  const { t } = useLaiTranslation();
  const labels = {
    limit: t("pagination.limit"), pagination: t("pagination.label"), previous: t("pagination.previous"), next: t("pagination.next"),
    page: (page: number, total: number) => t("pagination.page", { page, total }), goTo: (page: number) => t("pagination.goTo", { page }),
    ...customLabels,
  };
  const limits = [...new Set([...pageSizeOptions, limit])]
    .filter((n) => Number.isInteger(n) && n > 0)
    .sort((a, b) => a - b);
  const lastPage = Math.max(0, totalPages);
  const currentPage = lastPage === 0 ? 0 : Math.min(Math.max(1, page), lastPage);
  const changePage = (next: number) => {
    if (next >= 1 && next <= lastPage && next !== currentPage) onPageChange(next);
  };
  return (
    <div className="flex flex-wrap items-center justify-between gap-3">
      <div className="flex items-center gap-2">
        <span className="text-sm text-muted-foreground">{labels.limit}</span>
        <Select
          value={String(limit)}
          onValueChange={(value) => {
            if (value) onLimitChange(Number(value));
          }}
        >
          <SelectTrigger size="sm" aria-label={labels.limit}>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              {limits.map((value) => (
                <SelectItem key={value} value={String(value)}>
                  {value}
                </SelectItem>
              ))}
            </SelectGroup>
          </SelectContent>
        </Select>
      </div>
      <span className="text-sm text-muted-foreground" aria-live="polite">
        {labels.page(currentPage, lastPage)}
      </span>
      <PaginationNav aria-label={labels.pagination} className="mx-0 w-auto max-w-full">
        <PaginationContent className="flex-wrap">
          <PaginationItem>
            <Button
              variant="outline"
              size="icon-sm"
              aria-label={labels.previous}
              disabled={currentPage <= 1}
              onClick={() => changePage(currentPage - 1)}
            >
              <ArrowLeft />
            </Button>
          </PaginationItem>
          {getPageNumbers(currentPage, lastPage).map((value, index) => (
            <PaginationItem key={value === "..." ? `ellipsis-${index}` : value}>
              {value === "..." ? (
                <PaginationEllipsis aria-hidden="true" />
              ) : (
                <Button
                  size="icon-sm"
                  variant={currentPage === value ? "outline" : "ghost"}
                  aria-current={currentPage === value ? "page" : undefined}
                  aria-label={labels.goTo(value)}
                  onClick={() => changePage(value)}
                >
                  {value}
                </Button>
              )}
            </PaginationItem>
          ))}
          <PaginationItem>
            <Button
              variant="outline"
              size="icon-sm"
              aria-label={labels.next}
              disabled={currentPage === 0 || currentPage >= lastPage}
              onClick={() => changePage(currentPage + 1)}
            >
              <ArrowRight />
            </Button>
          </PaginationItem>
        </PaginationContent>
      </PaginationNav>
    </div>
  );
}
