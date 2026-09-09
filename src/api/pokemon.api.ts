import { apiClient } from '@/api/apiClient'
import type {
  PokemonDetailResponseApi,
  PokemonListResponseApi,
} from '@/features/pokemon/types/api.types'
import type { PokemonDetails, PokemonSummary } from '@/features/pokemon/types/domain.types'
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
