import { PokemonListItem } from '@/features/pokemon/components/PokemonListItem'
import type { PokemonSummary } from '@/features/pokemon/types/domain.types'

interface PokemonListViewProps {
  items: PokemonSummary[]
}

export function PokemonListView({ items }: PokemonListViewProps) {
  return (
    <div className="space-y-3">
      {items.map((pokemon) => (
        <PokemonListItem key={pokemon.id} pokemon={pokemon} />
      ))}
    </div>
  )
}
