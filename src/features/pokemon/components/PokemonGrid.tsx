import { PokemonCard } from '@/features/pokemon/components/PokemonCard'
import type { PokemonSummary } from '@/features/pokemon/types/domain.types'

interface PokemonGridProps {
  items: PokemonSummary[]
}

export function PokemonGrid({ items }: PokemonGridProps) {
  return (
    <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
      {items.map((pokemon) => (
        <PokemonCard key={pokemon.id} pokemon={pokemon} />
      ))}
    </div>
  )
}
