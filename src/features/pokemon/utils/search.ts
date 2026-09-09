import type { PokemonSummary } from '@/features/pokemon/types/domain.types'

export function filterPokemonByQuery(
  pokemon: PokemonSummary[],
  query: string,
): PokemonSummary[] {
  const normalized = query.trim().toLowerCase()
  if (!normalized) return pokemon

  return pokemon.filter((item) => {
    const paddedId = String(item.id).padStart(3, '0')
    const displayId = String(item.id)
    const name = item.name.toLowerCase()

    return (
      name.includes(normalized) ||
      displayId.includes(normalized) ||
      paddedId.includes(normalized)
    )
  })
}
