import { Skeleton } from '@/components/ui/skeleton'
import type { ViewMode } from '@/lib/constants'

interface PokemonSkeletonProps {
  viewMode: ViewMode
  count?: number
}

export function PokemonSkeleton({ viewMode, count = 8 }: PokemonSkeletonProps) {
  if (viewMode === 'list') {
    return (
      <div className="space-y-3" aria-hidden>
        {Array.from({ length: count }).map((_, index) => (
          <div
            key={index}
            className="flex items-center gap-4 rounded-xl border border-border bg-card p-4"
          >
            <Skeleton className="h-16 w-16 shrink-0 rounded-xl" />
            <div className="flex-1 space-y-2">
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-5 w-40" />
            </div>
          </div>
        ))}
      </div>
    )
  }

  return (
    <div
      className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6"
      aria-hidden
    >
      {Array.from({ length: count }).map((_, index) => (
        <div
          key={index}
          className="rounded-2xl border border-border bg-card p-4"
        >
          <Skeleton className="mx-auto mb-4 aspect-square w-full max-w-[96px] rounded-xl" />
          <Skeleton className="mx-auto h-3 w-12" />
          <Skeleton className="mx-auto mt-2 h-4 w-24" />
        </div>
      ))}
    </div>
  )
}
