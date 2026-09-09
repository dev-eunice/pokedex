import type { PokemonDetailResponseApi, PokemonListResponseApi } from '@/features/pokemon/types/api.types'
import type { PokemonDetails, PokemonSummary } from '@/features/pokemon/types/domain.types'
import { formatPokemonName } from '@/lib/utils/format'
import { extractPokemonIdFromUrl, getPokemonSpriteUrl } from '@/lib/utils/pokemon'

const STAT_LABELS: Record<string, string> = {
  hp: 'HP',
  attack: 'Attack',
  defense: 'Defense',
  'special-attack': 'Sp. Atk',
  'special-defense': 'Sp. Def',
  speed: 'Speed',
}

export function toPokemonSummary(name: string, url: string): PokemonSummary {
  const id = extractPokemonIdFromUrl(url)
  return {
    id,
    name,
    spriteUrl: getPokemonSpriteUrl(id),
  }
}

export function transformPokemonListResponse(
  response: PokemonListResponseApi,
): PokemonSummary[] {
  return response.results.map((item) => toPokemonSummary(item.name, item.url))
}

export function transformPokemonDetailResponse(
  response: PokemonDetailResponseApi,
): PokemonDetails {
  return {
    id: response.id,
    name: response.name,
    spriteUrl: getPokemonSpriteUrl(response.id),
    height: response.height,
    weight: response.weight,
    types: response.types
      .slice()
      .sort((a, b) => a.slot - b.slot)
      .map((entry) => entry.type.name),
    abilities: response.abilities
      .slice()
      .sort((a, b) => a.slot - b.slot)
      .map((entry) => ({
        name: formatPokemonName(entry.ability.name),
        isHidden: entry.is_hidden,
      })),
    stats: response.stats
      .slice()
      .sort((a, b) => a.stat.name.localeCompare(b.stat.name))
      .map((entry) => ({
        name: entry.stat.name,
        label: STAT_LABELS[entry.stat.name] ?? formatPokemonName(entry.stat.name),
        value: entry.base_stat,
      })),
  }
}
