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
            className="flex h-24 overflow-hidden rounded-xl border-[3px] border-yellow-300/50"
          >
            <Skeleton className="h-full w-24 shrink-0 rounded-none" />
            <div className="flex flex-1 flex-col justify-center gap-2 p-3">
              <Skeleton className="h-3 w-24" />
              <Skeleton className="h-5 w-40" />
            </div>
          </div>
        ))}
      </div>
    )
  }

  return (
    <div
      className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5"
      aria-hidden
    >
      {Array.from({ length: count }).map((_, index) => (
        <div
          key={index}
          className="aspect-[5/7] w-full max-w-[240px] justify-self-center rounded-[14px] border-[3px] border-yellow-300/50 p-2"
        >
          <Skeleton className="mb-2 h-8 w-full rounded-md" />
          <Skeleton className="mb-2 aspect-[4/3] w-full rounded-md" />
          <Skeleton className="mb-2 h-4 w-full rounded" />
          <Skeleton className="mb-2 h-8 w-full rounded-md" />
          <Skeleton className="h-10 w-full rounded" />
        </div>
      ))}
    </div>
  )
}
