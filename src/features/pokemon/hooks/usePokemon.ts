import { useQuery } from '@tanstack/react-query'
import { ApiError } from '@/api/apiClient'
import { fetchPokemonById } from '@/api/pokemon.api'
import { pokemonQueryKeys } from '@/features/pokemon/hooks/queryKeys'
import { isValidGen1Id } from '@/lib/utils/pokemon'

const DETAIL_STALE_TIME = 1000 * 60 * 60

export function usePokemon(id: number) {
  const isValid = isValidGen1Id(id)

  return useQuery({
    queryKey: pokemonQueryKeys.detail(id),
    queryFn: () => fetchPokemonById(id),
    enabled: isValid,
    staleTime: DETAIL_STALE_TIME,
    retry: (failureCount, error) => {
      if (error instanceof ApiError && error.status === 404) return false
      return failureCount < 2
    },
  })
}
