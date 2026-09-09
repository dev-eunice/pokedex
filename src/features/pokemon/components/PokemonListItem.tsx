import { ChevronRight } from 'lucide-react'
import { Link } from 'react-router-dom'
import { CapturedIndicator } from '@/features/pokemon/components/CapturedIndicator'
import { PokemonImage } from '@/features/pokemon/components/PokemonImage'
import type { PokemonSummary } from '@/features/pokemon/types/domain.types'
import { useIsCaptured } from '@/hooks/useCapturedPokemon'
import { formatPokedexNumber, formatPokemonName } from '@/lib/utils/format'
import { cn } from '@/lib/utils/cn'

interface PokemonListItemProps {
  pokemon: PokemonSummary
}

export function PokemonListItem({ pokemon }: PokemonListItemProps) {
  const isCaptured = useIsCaptured(pokemon.id)

  return (
    <Link
      to={`/pokemon/${pokemon.id}`}
      className={cn(
        'group flex items-center gap-4 rounded-xl border border-border bg-card p-4 shadow-sm transition-all hover:border-primary/30 hover:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring',
        isCaptured && 'ring-1 ring-success/30',
      )}
    >
      <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-xl bg-surface p-2">
        <PokemonImage
          pokemonId={pokemon.id}
          src={pokemon.spriteUrl}
          width={64}
          height={64}
        />
      </div>

      <div className="min-w-0 flex-1">
        <p className="text-xs font-medium text-muted-foreground">
          {formatPokedexNumber(pokemon.id)}
        </p>
        <h3 className="truncate font-display text-base font-semibold capitalize">
          {formatPokemonName(pokemon.name)}
        </h3>
      </div>

      <div className="flex items-center gap-2 text-muted-foreground">
        {isCaptured ? <CapturedIndicator size="sm" /> : null}
        <ChevronRight
          className="h-5 w-5 transition-transform group-hover:translate-x-0.5"
          aria-hidden
        />
      </div>
    </Link>
  )
}
