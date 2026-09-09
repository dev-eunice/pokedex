import { ChevronRight } from 'lucide-react'
import { Link } from 'react-router-dom'
import { CapturedIndicator } from '@/features/pokemon/components/CapturedIndicator'
import { PokemonImage } from '@/features/pokemon/components/PokemonImage'
import { PokemonTypeIcon } from '@/features/pokemon/components/PokemonTypeIcon'
import type { PokemonSummary } from '@/features/pokemon/types/domain.types'
import { getPokemonCardMeta } from '@/features/pokemon/utils/cardMeta'
import { getTcgTheme } from '@/features/pokemon/utils/tcgTheme'
import { useIsCaptured } from '@/hooks/useCapturedPokemon'
import { formatPokedexNumber, formatPokemonName } from '@/lib/utils/format'
import { cn } from '@/lib/utils/cn'

interface PokemonListItemProps {
  pokemon: PokemonSummary
}

export function PokemonListItem({ pokemon }: PokemonListItemProps) {
  const isCaptured = useIsCaptured(pokemon.id)
  const cardMeta = getPokemonCardMeta(pokemon.id)
  const theme = getTcgTheme(cardMeta.type)

  return (
    <Link
      to={`/pokemon/${pokemon.id}`}
      className={cn(
        'group flex overflow-hidden rounded-xl border-[3px] shadow-md transition-all hover:-translate-y-0.5 hover:shadow-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring',
        isCaptured && 'ring-2 ring-yellow-400/60',
      )}
      style={{
        borderColor: theme.border,
        background: theme.background,
        color: theme.text,
      }}
    >
      <div
        className="flex w-24 shrink-0 flex-col border-r-2 p-2"
        style={{ borderColor: theme.frame, backgroundColor: 'rgba(255,255,255,0.25)' }}
      >
        <div className="mb-1 aspect-square overflow-hidden rounded-md bg-white/80 p-1">
          <PokemonImage pokemonId={pokemon.id} src={pokemon.spriteUrl} />
        </div>
        <p className="text-center text-[8px] font-bold uppercase">{formatPokedexNumber(pokemon.id)}</p>
      </div>

      <div className="flex min-w-0 flex-1 items-center justify-between gap-3 p-3">
        <div className="min-w-0">
          <div className="mb-1 flex items-center gap-2">
            <span
              className="rounded px-1 py-0.5 text-[8px] font-black uppercase"
              style={{ backgroundColor: theme.frame }}
            >
              Basic
            </span>
            <span className="text-[10px] font-black">
              HP {cardMeta.hp}
            </span>
            <PokemonTypeIcon type={cardMeta.type} size="sm" />
          </div>
          <h3 className="truncate font-black uppercase tracking-tight">
            {formatPokemonName(pokemon.name)}
          </h3>
          <p className="mt-0.5 text-[10px] font-semibold">
            {cardMeta.attackName} · {cardMeta.attackDamage} dmg
          </p>
        </div>

        <div className="flex items-center gap-2 text-muted-foreground">
          {isCaptured ? <CapturedIndicator size="sm" /> : null}
          <ChevronRight
            className="h-5 w-5 opacity-60 transition-transform group-hover:translate-x-0.5"
            aria-hidden
          />
        </div>
      </div>
    </Link>
  )
}
