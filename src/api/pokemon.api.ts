import { apiClient } from '@/api/apiClient'
import type {
  EvolutionChainResponseApi,
  PokemonDetailResponseApi,
  PokemonListResponseApi,
  PokemonSpeciesResponseApi,
} from '@/features/pokemon/types/api.types'
import type {
  PokemonDetails,
  PokemonEvolutionData,
  PokemonSummary,
} from '@/features/pokemon/types/domain.types'
import { getPokemonEvolutionData } from '@/features/pokemon/utils/evolutionTransform'
import {
  transformPokemonDetailResponse,
  transformPokemonListResponse,
} from '@/features/pokemon/utils/transform'
import { GEN1_TOTAL, POKEAPI_BASE } from '@/lib/constants'

export interface FetchPokemonListParams {
  limit: number
  offset: number
}

export async function fetchPokemonList(
  params: FetchPokemonListParams,
): Promise<{ items: PokemonSummary[]; totalCount: number }> {
  const searchParams = new URLSearchParams({
    limit: String(params.limit),
    offset: String(params.offset),
  })

  const response = await apiClient<PokemonListResponseApi>(
    `${POKEAPI_BASE}/pokemon/?${searchParams.toString()}`,
  )

  return {
    items: transformPokemonListResponse(response),
    totalCount: Math.min(response.count, GEN1_TOTAL),
  }
}

export async function fetchAllGen1Pokemon(): Promise<PokemonSummary[]> {
  const response = await fetchPokemonList({
    limit: GEN1_TOTAL,
    offset: 0,
  })
  return response.items
}

export async function fetchPokemonById(id: number): Promise<PokemonDetails> {
  const response = await apiClient<PokemonDetailResponseApi>(
    `${POKEAPI_BASE}/pokemon/${id}/`,
  )
  return transformPokemonDetailResponse(response)
}

export async function fetchPokemonEvolution(id: number): Promise<PokemonEvolutionData> {
  const species = await apiClient<PokemonSpeciesResponseApi>(
    `${POKEAPI_BASE}/pokemon-species/${id}/`,
  )

  const chain = await apiClient<EvolutionChainResponseApi>(species.evolution_chain.url)
  return getPokemonEvolutionData(chain.chain, id)
}
