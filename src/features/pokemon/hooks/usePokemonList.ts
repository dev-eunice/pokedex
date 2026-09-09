import { keepPreviousData, useQuery, useQueryClient } from '@tanstack/react-query'
import { useEffect } from 'react'
import { fetchAllGen1Pokemon, fetchPokemonList } from '@/api/pokemon.api'
import { pokemonQueryKeys } from '@/features/pokemon/hooks/queryKeys'
import { GEN1_TOTAL, PAGE_SIZE } from '@/lib/constants'

const LIST_STALE_TIME = 1000 * 60 * 30
const GEN1_STALE_TIME = 1000 * 60 * 60 * 24

export function usePaginatedPokemonList(page: number) {
  const offset = (page - 1) * PAGE_SIZE

  return useQuery({
    queryKey: pokemonQueryKeys.list(PAGE_SIZE, offset),
    queryFn: () =>
      fetchPokemonList({
        limit: PAGE_SIZE,
        offset,
      }),
    staleTime: LIST_STALE_TIME,
    placeholderData: keepPreviousData,
  })
}

export function useAllGen1Pokemon(enabled = true) {
  return useQuery({
    queryKey: pokemonQueryKeys.gen1All(),
    queryFn: fetchAllGen1Pokemon,
    staleTime: GEN1_STALE_TIME,
    enabled,
  })
}

export function usePrefetchGen1Pokemon() {
  const queryClient = useQueryClient()

  useEffect(() => {
    void queryClient.prefetchQuery({
      queryKey: pokemonQueryKeys.gen1All(),
      queryFn: fetchAllGen1Pokemon,
      staleTime: GEN1_STALE_TIME,
    })
  }, [queryClient])
}

export function getGen1TotalPages(pageSize = PAGE_SIZE): number {
  return Math.ceil(GEN1_TOTAL / pageSize)
}
