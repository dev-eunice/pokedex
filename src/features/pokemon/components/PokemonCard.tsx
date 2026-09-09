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

interface PokemonCardProps {
  pokemon: PokemonSummary
}

export function PokemonCard({ pokemon }: PokemonCardProps) {
  const isCaptured = useIsCaptured(pokemon.id)
  const cardMeta = getPokemonCardMeta(pokemon.id)
  const theme = getTcgTheme(cardMeta.type)

  return (
    <Link
      to={`/pokemon/${pokemon.id}`}
      className={cn(
        'group block aspect-[5/7] w-full max-w-[240px] justify-self-center focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2',
        isCaptured && 'drop-shadow-[0_0_12px_rgba(255,215,0,0.45)]',
      )}
      aria-label={`${formatPokemonName(pokemon.name)}, ${cardMeta.hp} HP`}
    >
      <article
        className="relative flex h-full flex-col overflow-hidden rounded-[14px] border-[3px] p-1.5 shadow-lg transition-transform duration-200 group-hover:-translate-y-1 group-hover:shadow-xl"
        style={{
          borderColor: theme.border,
          background: theme.background,
          color: theme.text,
        }}
      >
        {isCaptured ? (
          <CapturedIndicator className="absolute right-2 top-2 z-10" size="sm" />
        ) : null}

        {/* Header */}
        <header
          className="mb-1 flex items-center justify-between gap-1 rounded-md px-1.5 py-1"
          style={{ backgroundColor: theme.header }}
        >
          <div className="flex min-w-0 items-center gap-1.5">
            <span
              className="shrink-0 rounded px-1 py-0.5 text-[8px] font-black uppercase tracking-wider"
              style={{ backgroundColor: theme.frame, color: theme.text }}
            >
              Basic
            </span>
            <h3 className="truncate text-sm font-black uppercase tracking-tight">
              {formatPokemonName(pokemon.name)}
            </h3>
          </div>
          <div className="flex shrink-0 items-center gap-1">
            <span className="text-[10px] font-black">
              HP <span className="text-sm">{cardMeta.hp}</span>
            </span>
            <PokemonTypeIcon type={cardMeta.type} size="sm" />
          </div>
        </header>

        {/* Art frame */}
        <div
          className="relative mb-1 overflow-hidden rounded-md border-2 p-1.5"
          style={{ borderColor: theme.frame, backgroundColor: 'rgba(255,255,255,0.35)' }}
        >
          <div className="aspect-[4/3] overflow-hidden rounded-sm bg-white/80">
            <PokemonImage
              pokemonId={pokemon.id}
              src={pokemon.spriteUrl}
              className="h-full w-full scale-110 object-contain transition-transform duration-300 group-hover:scale-[1.15]"
            />
          </div>
        </div>

        {/* Info strip */}
        <p
          className="mb-1 truncate rounded px-1 py-0.5 text-center text-[8px] font-semibold italic"
          style={{ backgroundColor: 'rgba(255,255,255,0.25)' }}
        >
          {formatPokedexNumber(pokemon.id)} · Gen 1 Pokémon
        </p>

        {/* Attack row */}
        <div
          className="mb-1 flex items-center justify-between rounded-md border px-1.5 py-1"
          style={{ borderColor: theme.frame, backgroundColor: 'rgba(255,255,255,0.2)' }}
        >
          <div className="flex items-center gap-1">
            <PokemonTypeIcon type={cardMeta.type} size="sm" />
            <span className="text-[10px] font-bold">{cardMeta.attackName}</span>
          </div>
          <span className="text-sm font-black">{cardMeta.attackDamage}</span>
        </div>

        {/* Footer */}
        <footer className="mt-auto space-y-1">
          <div
            className="flex items-center justify-between rounded px-1.5 py-0.5 text-[7px] font-bold uppercase tracking-wide"
            style={{ backgroundColor: theme.header }}
          >
            <span>Weakness</span>
            <span>Resistance</span>
            <span>Retreat</span>
          </div>
          <p
            className="line-clamp-2 rounded px-1 py-0.5 text-[7px] leading-tight italic"
            style={{ backgroundColor: 'rgba(255,255,255,0.25)' }}
          >
            A classic Kanto species awaiting discovery in your Pokédex collection.
          </p>
          <p className="text-center text-[6px] font-semibold uppercase tracking-widest opacity-70">
            Pokédex Card
          </p>
        </footer>
      </article>
    </Link>
  )
}
