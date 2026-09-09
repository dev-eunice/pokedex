import { useQuery } from '@tanstack/react-query'
import { ApiError } from '@/api/apiClient'
import { fetchPokemonEvolution } from '@/api/pokemon.api'
import { pokemonQueryKeys } from '@/features/pokemon/hooks/queryKeys'
import { isValidGen1Id } from '@/lib/utils/pokemon'

const EVOLUTION_STALE_TIME = 1000 * 60 * 60 * 24

export function useEvolutionChain(id: number) {
  const isValid = isValidGen1Id(id)

  return useQuery({
    queryKey: pokemonQueryKeys.evolution(id),
    queryFn: () => fetchPokemonEvolution(id),
    enabled: isValid,
    staleTime: EVOLUTION_STALE_TIME,
    retry: (failureCount, error) => {
      if (error instanceof ApiError && error.status === 404) return false
      return failureCount < 2
    },
  })
}
