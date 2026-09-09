import { ChevronLeft, ChevronRight } from 'lucide-react'
import { Button } from '@/components/ui/button'

interface PaginationProps {
  page: number
  totalPages: number
  onPageChange: (page: number) => void
  isFetching?: boolean
}

export function Pagination({
  page,
  totalPages,
  onPageChange,
  isFetching = false,
}: PaginationProps) {
  const canGoPrevious = page > 1
  const canGoNext = page < totalPages

  return (
    <nav
      className="flex flex-wrap items-center justify-center gap-2 sm:gap-3"
      aria-label="Pagination"
    >
      <Button
        variant="outline"
        size="sm"
        className="min-w-[2.75rem] sm:min-w-0"
        onClick={() => onPageChange(page - 1)}
        disabled={!canGoPrevious || isFetching}
        aria-label="Previous page"
      >
        <ChevronLeft className="h-4 w-4" />
        <span className="hidden sm:inline">Previous</span>
      </Button>

      <p className="w-full text-center text-sm text-muted-foreground sm:w-auto sm:min-w-[8rem]">
        Page{' '}
        <span className="font-medium text-foreground">{page}</span> of{' '}
        <span className="font-medium text-foreground">{totalPages}</span>
      </p>

      <Button
        variant="outline"
        size="sm"
        className="min-w-[2.75rem] sm:min-w-0"
        onClick={() => onPageChange(page + 1)}
        disabled={!canGoNext || isFetching}
        aria-label="Next page"
      >
        <span className="hidden sm:inline">Next</span>
        <ChevronRight className="h-4 w-4" />
      </Button>
    </nav>
  )
}
