import { Link } from 'react-router-dom'
import { CapturedIndicator } from '@/features/pokemon/components/CapturedIndicator'
import { PokemonImage } from '@/features/pokemon/components/PokemonImage'
import type { PokemonSummary } from '@/features/pokemon/types/domain.types'
import { useIsCaptured } from '@/hooks/useCapturedPokemon'
import { formatPokedexNumber, formatPokemonName } from '@/lib/utils/format'
import { cn } from '@/lib/utils/cn'

interface PokemonCardProps {
  pokemon: PokemonSummary
}

export function PokemonCard({ pokemon }: PokemonCardProps) {
  const isCaptured = useIsCaptured(pokemon.id)

  return (
    <Link
      to={`/pokemon/${pokemon.id}`}
      className={cn(
        'group relative flex flex-col items-center rounded-2xl border border-border bg-card p-4 shadow-sm transition-all duration-200 hover:-translate-y-1 hover:border-primary/30 hover:shadow-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring',
        isCaptured && 'ring-1 ring-success/30',
      )}
    >
      {isCaptured ? (
        <CapturedIndicator className="absolute right-3 top-3" size="sm" />
      ) : null}

      <div className="relative mb-3 flex aspect-square w-full max-w-[96px] items-center justify-center rounded-xl bg-surface p-2 transition-transform group-hover:scale-105">
        <PokemonImage
          pokemonId={pokemon.id}
          src={pokemon.spriteUrl}
          width={96}
          height={96}
        />
      </div>

      <p className="text-xs font-medium text-muted-foreground">
        {formatPokedexNumber(pokemon.id)}
      </p>
      <h3 className="mt-1 text-center font-display text-sm font-semibold capitalize">
        {formatPokemonName(pokemon.name)}
      </h3>
    </Link>
  )
}
