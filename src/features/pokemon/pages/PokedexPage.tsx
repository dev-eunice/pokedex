import { SearchX } from 'lucide-react'
import { useEffect, useMemo } from 'react'
import { useSearchParams } from 'react-router-dom'
import { EmptyState } from '@/components/EmptyState'
import { ErrorState } from '@/components/ErrorState'
import { Pagination } from '@/components/Pagination'
import { SearchBar } from '@/components/SearchBar'
import { ViewToggle } from '@/components/ViewToggle'
import { PokemonGrid } from '@/features/pokemon/components/PokemonGrid'
import { PokemonListView } from '@/features/pokemon/components/PokemonListView'
import { PokemonSkeleton } from '@/features/pokemon/components/PokemonSkeleton'
import {
  getGen1TotalPages,
  useAllGen1Pokemon,
  usePaginatedPokemonList,
  usePrefetchGen1Pokemon,
} from '@/features/pokemon/hooks/usePokemonList'
import { filterPokemonByQuery } from '@/features/pokemon/utils/search'
import { useDebouncedValue } from '@/hooks/useDebouncedValue'
import { GEN1_TOTAL, PAGE_SIZE, type ViewMode } from '@/lib/constants'
import { getStoredViewMode, setStoredViewMode } from '@/lib/storage/preferencesStorage'
import { getTotalPages, paginateArray } from '@/lib/utils/pokemon'
import { cn } from '@/lib/utils/cn'

function parsePage(value: string | null): number {
  const page = Number.parseInt(value ?? '1', 10)
  return Number.isFinite(page) && page > 0 ? page : 1
}

function parseViewMode(value: string | null): ViewMode {
  if (value === 'grid' || value === 'list') return value
  return getStoredViewMode() ?? 'grid'
}

export function PokedexPage() {
  const [searchParams, setSearchParams] = useSearchParams()
  const searchInput = searchParams.get('search') ?? ''
  const page = parsePage(searchParams.get('page'))
  const viewMode = parseViewMode(searchParams.get('view'))
  const debouncedSearch = useDebouncedValue(searchInput, 250)
  const isSearching = debouncedSearch.trim().length > 0

  usePrefetchGen1Pokemon()

  const paginatedQuery = usePaginatedPokemonList(page)
  const allGen1Query = useAllGen1Pokemon(isSearching)

  useEffect(() => {
    setStoredViewMode(viewMode)
  }, [viewMode])

  const searchResults = useMemo(() => {
    if (!isSearching || !allGen1Query.data) return []
    return filterPokemonByQuery(allGen1Query.data, debouncedSearch)
  }, [allGen1Query.data, debouncedSearch, isSearching])

  const displayedItems = isSearching
    ? paginateArray(searchResults, page, PAGE_SIZE)
    : (paginatedQuery.data?.items ?? [])

  const totalPages = isSearching
    ? getTotalPages(searchResults.length, PAGE_SIZE)
    : getGen1TotalPages()

  const isInitialLoading = isSearching
    ? allGen1Query.isLoading
    : paginatedQuery.isLoading && !paginatedQuery.data

  const isFetching = isSearching ? allGen1Query.isFetching : paginatedQuery.isFetching
  const error = isSearching ? allGen1Query.error : paginatedQuery.error

  function updateParams(updates: Record<string, string | null>) {
    setSearchParams((current) => {
      const next = new URLSearchParams(current)
      Object.entries(updates).forEach(([key, value]) => {
        if (!value) next.delete(key)
        else next.set(key, value)
      })
      return next
    })
  }

  function handleSearchChange(value: string) {
    updateParams({
      search: value || null,
      page: '1',
    })
  }

  function handleViewChange(mode: ViewMode) {
    updateParams({ view: mode })
  }

  function handlePageChange(nextPage: number) {
    updateParams({ page: String(nextPage) })
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  useEffect(() => {
    if (page > totalPages) {
      updateParams({ page: String(totalPages) })
    }
  }, [page, totalPages])

  return (
    <div className="space-y-8">
      <section className="space-y-2">
        <h1 className="font-display text-3xl font-bold tracking-tight sm:text-4xl">
          Pokédex
        </h1>
        <p className="max-w-2xl text-muted-foreground">
          Explore the original 151 Pokémon from the Kanto region. Search, browse, and
          track your captured team.
        </p>
      </section>

      <section className="flex flex-col gap-4 rounded-2xl border border-border bg-card/70 p-4 shadow-sm backdrop-blur-sm sm:flex-row sm:items-center sm:justify-between">
        <div className="flex-1">
          <SearchBar value={searchInput} onChange={handleSearchChange} />
        </div>
        <ViewToggle value={viewMode} onChange={handleViewChange} />
      </section>

      {error ? (
        <ErrorState
          onRetry={() => {
            if (isSearching) void allGen1Query.refetch()
            else void paginatedQuery.refetch()
          }}
        />
      ) : isInitialLoading ? (
        <PokemonSkeleton viewMode={viewMode} count={PAGE_SIZE} />
      ) : displayedItems.length === 0 ? (
        <EmptyState
          icon={<SearchX className="h-8 w-8" />}
          title="No Pokémon found"
          description={
            isSearching
              ? `No Gen 1 Pokémon match "${debouncedSearch}". Try a different name or number.`
              : 'No Pokémon are available to display.'
          }
        />
      ) : (
        <div
          className={cn(
            'space-y-8 transition-opacity duration-200',
            isFetching && 'opacity-80',
          )}
        >
          <p className="text-sm text-muted-foreground">
            {isSearching
              ? `${searchResults.length} result${searchResults.length === 1 ? '' : 's'}`
              : `Showing ${GEN1_TOTAL} Gen 1 Pokémon`}
          </p>

          {viewMode === 'grid' ? (
            <PokemonGrid items={displayedItems} />
          ) : (
            <PokemonListView items={displayedItems} />
          )}

          {totalPages > 1 ? (
            <Pagination
              page={page}
              totalPages={totalPages}
              onPageChange={handlePageChange}
              isFetching={isFetching}
            />
          ) : null}
        </div>
      )}
    </div>
  )
}
